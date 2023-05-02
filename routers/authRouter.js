const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.route("/sign-up").post(authController.singUP);
router.route("/login").post(authController.login);
router.post("/forgotPassword", authController.forgotPassword);

module.exports = router;
