import passport from "passport";
import { Router } from "express";

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

/**
 * Note: I'm using the regular express router instead of typescript-rest because
 * I'm not sure on how to use passport middleware on a route-level with typescript-rest
 */

const router = Router();
// auth logout
router.get("/google/logout", (req, res) => {
  // handle with passport
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// callback route for google to redirect to
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: CLIENT_HOME_PAGE_URL,
  }),
  (req, res) => {
    console.log("Google auth redirecting");
    res.json({
      isAuthenticated: true,
    });
    // // redirect to homepage
    // res.redirect("http://localhost:3000"); //TODO: how to dynamically change this for deployment
  }
);

export default router;
