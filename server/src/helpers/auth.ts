import { Passport } from "passport";
import { Strategy } from "passport-google-oauth20";
import { getRepository } from "typeorm";
import { Staff } from "~/entity";

console.log("----Setting up Passport and Strategy----");
const passport = new Passport();
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
      //if not, create a new user
      const newUser = staffRepo.create({ googleId: profile.id });
      staffRepo.save(newUser);
    }
  }
);

passport.use("google", googleStrategy);

export { passport };
