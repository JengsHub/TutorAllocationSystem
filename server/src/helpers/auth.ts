import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { getRepository } from "typeorm";
import { Staff } from "~/entity";
import { Request, Response, NextFunction } from "express";
import { emailHelperInstance } from "..";
import { config } from "~/config";

console.log(process.env.NODE_ENV);
console.log(config);
console.log("----Setting up Passport and Strategy----");

// @ts-ignore
passport.serializeUser((user: Staff, done) => {
  done(null, user.id);
});

// @ts-ignore
passport.deserializeUser(async (id: string, done) => {
  const staffRepo = getRepository(Staff);
  const user = await staffRepo.findOne({ id });
  done(null, user);
});

export const authCheck = (req: Request, res: Response): boolean => {
  if (!req.user) {
    req.logout();
    req.session.cookie.expires = new Date(); // delete session cookie
    res.clearCookie("sid");
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
    return false;
  }
  return true;
};

// middleware to check if the current user is login
export const authCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!authCheck(req, res)) return;
  // if (!req.user) {
  //   req.logout();
  //   req.session.cookie.expires = new Date(); // delete session cookie
  //   res.clearCookie("sid");
  //   return res.status(401).json({
  //     authenticated: false,
  //     message: "user has not been authenticated",
  //   });
  // }
  next();
};

const googleStrategy = new Strategy(
  {
    // options for google strategy
    clientID: config.GOOGLE_CLIENT_ID || "",
    clientSecret: config.GOOGLE_CLIENT_SECRET || "",
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
