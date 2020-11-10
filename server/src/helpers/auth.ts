import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { getRepository } from "typeorm";
import { Staff } from "~/entity";

console.log("----Setting up Passport and Strategy----");

passport.serializeUser((user: Staff, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const staffRepo = getRepository(Staff);
  const user = await staffRepo.findOne({ id });
  done(null, user);
});
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
        const newUser = staffRepo.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          givenNames: profile.name?.givenName,
          lastName: profile.name?.familyName,
        });
        await staffRepo.save(newUser);
      }
    }
  }
);

passport.use(googleStrategy);

export { passport };
