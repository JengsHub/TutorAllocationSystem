import passport from "passport";
import { Router } from "express";

/**
 * Note: I'm using the regular express router instead of typescript-rest because
 * I'm not sure on how to use passport middleware on a route-level with typescript-rest
 */

const router = Router();
// auth login
router.get("/login", (req, res) => {
  // redirect to login page
  res.send("login page");
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  res.send("logging out");
});

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email","profile"],
  })
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Google auth redirecting");
  // redirect to homepage
  res.redirect("http://localhost:3000"); //TODO: how to dynamically change this for deployment
});

export default router;
