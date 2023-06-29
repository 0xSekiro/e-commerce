const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utilities//sendgrid");
const errHandler = require("../controllers/errorController");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

exports.logUser = signToken;

exports.singUP = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = { ...req.body };
    console.log("cred " + username, email, password, passwordConfirm);
    const user = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });
    const token = signToken(user._id);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    errHandler.returnError(400, err.message, res);
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return errHandler.returnError(
        400,
        "Missed [email, password] parameters",
        res
      );
    const user = await User.findOne({ email: req.body.email });

    if (
      !user ||
      !(await bcrypt.compare(String(req.body.password), user.password))
    ) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    } else {
      const token = signToken(user._id);
      res.status(200).json({
        status: "success",
        token,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.checkAuthorization = (req, res, next) => {
  let token = req.headers["authorization"];
  // check if token exist
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization error",
    });
  }

  // verify token
  try {
    let token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.id;
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization error",
    });
  }

  next();
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Email not found",
    });
  }

  const generatedToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = crypto
    .createHash("sha256")
    .update(generatedToken)
    .digest("hex");
  user.expireToken = Date.now() + 1000 * 60 * 10;

  await user.save({ validateBeforeSave: false });
  let msg;
  if (process.env.ENV == "development") {
    msg = `Forgot your password? send PATCH request with password and passwordConfirm to https://127.0.0.1:8080/api/v1/auth/resetPassword/${generatedToken} \n( Token valid for 10 min )\n`;
  } else {
    msg = `Forgot your password? send GET request to https://sarahheshamali2.github.io/connectedEcommerce/#/reset/${generatedToken} \n( Token valid for 10 min )\n`;
  }

  await sendEmail(req.body.email, "Password reset token", msg);

  res.status(200).json({
    status: "success",
    message: "token sent to email",
  });
};

exports.resetPassword = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetToken: token,
    expireToken: { $gt: Date.now() },
  });

  if (!user)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid token or has expired" });

  if (!req.body.password || !req.body.passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Please enter new password and confirm it",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetToken = undefined;
  user.expireToken = undefined;

  try {
    await user.save();
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      err,
    });
  }

  res.status(200).json({
    status: "success",
    message: "password changed successfully",
  });
};

exports.logWithGoogle = (req, res) => {
  const token = signToken(req.user._id);
  res
    .status(302)
    .redirect(
      `https://sarahheshamali2.github.io/connectedEcommerce/#/home/${token}`
    );
};
