const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();
const passport = require("passport");

require("../utilities/passportConfig");

router.route("/sign-up").post(authController.singUP);
router.route("/login").post(authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// google auth

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  authController.logWithGoogle
);

module.exports = router;
