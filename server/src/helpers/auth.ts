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

export const authCheck = (req: Request, res: Response) => {
  if (!req.user) {
    req.logout();
    req.session.cookie.expires = new Date(); // delete session cookie
    res.clearCookie("sid");
    return res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
    // res.redirect("/auth/login");
  }
};

// middleware to check if the current user is login
export const authCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authCheck(req, res);
  next();
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
    const { id, emails } = profile;

    const query = getRepository(Staff)
      .createQueryBuilder("staff")
      .where("staff.googleId = :id", { id });

    let email: string | null = null;

    if (emails) {
      email = emails[0].value;
      query.orWhere("staff.email = :email", { email });
    }

    let user = await query.getOne();

    // this user needs to be registered
    if (!user) {
      user = await Staff.create({
        googleId: id as string,
        email: email as string,
        givenNames: profile.name?.givenName,
        lastName: profile.name?.familyName,
      }).save();
    } else if (!user.googleId) {
      // merge account
      // we found user by email
      user.googleId = id;
      await user.save();
    } else {
      // we have a twitterId
      // login
    }
    done(undefined, { id: user.id });
  }
);

passport.use(googleStrategy);

export { passport };
