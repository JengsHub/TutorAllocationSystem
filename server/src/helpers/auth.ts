import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { getRepository } from "typeorm";
import { Staff } from "~/entity";
import { Request, Response, NextFunction } from "express";

console.log("----Setting up Passport and Strategy----");

passport.serializeUser((user: Staff, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const staffRepo = getRepository(Staff);
  const user = await staffRepo.findOne({ id });
  done(null, user);
});

// middleware to check if the current user is login
export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const googleStrategy = new Strategy(
  {
    // options for google strategy
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/auth/google/redirect",
  },
  async (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log("access token: ", accessToken);
    const staffRepo = getRepository(Staff);
    let currentUser = await staffRepo.findOne({
      googleId: profile.id,
    });
    if (currentUser) {
      //if we already have a record with the given profile ID
      done(undefined, currentUser);
    } else {
      // TODO: error handling, redirect back to login page
      if (profile.emails) {
        //if not, create a new user
        // TODO: user/staff data may have been imported before they actually login so this will throw a PK error here. Should merge instead
        const newUser = staffRepo.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          givenNames: profile.name?.givenName,
          lastName: profile.name?.familyName,
        });
        await staffRepo.save(newUser);
        done(undefined, newUser);
      }
    }
  }
);

passport.use(googleStrategy);

export { passport };
