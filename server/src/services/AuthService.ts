import { passport } from "~/helpers/auth";
import { Router } from "express";

/**
 * Note: I'm using the regular express router instead of typescript-rest because
 * I'm not sure on how to use passport middleware on a route-level with typescript-rest
 */

const router = Router();
// auth login
router.get("/login", (req, res) => {
  // redirect to login page
  res.send("login page")
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
    scope: ["profile"],
  })
);

// callback route for google to redirect to
router.get("/google/redirect", (req, res) => {
  res.send("you reached the redirect URI");
});

export default router;
