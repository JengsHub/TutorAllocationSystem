import passport from "passport";
import { Router } from "express";
import { Staff } from "~/entity";
import { authCheck } from "~/helpers/auth";

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
  req.session.cookie.expires = new Date(); // delete session cookie
  res.redirect(CLIENT_HOME_PAGE_URL);

  // req.session.destroy(()=>{
  //   res.redirect(CLIENT_HOME_PAGE_URL);
  // });
});

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// when login is successful, retrieve user info
router.get("/login/success", authCheck, (req, res) => {
  const { id, givenNames, lastName, email } = req.user as Staff;
  res.json({
    success: true,
    message: "user has successfully authenticated",
    user: {
      id,
      givenNames,
      lastName,
      email,
    },
    cookies: req.cookies,
  });
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
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
    (req.session as any).userId = (req.user as any).id;
    res.redirect("http://localhost:3000/login"); // TODO: dynamic
  }
);

export default router;
