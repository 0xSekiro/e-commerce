const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

exports.singUP = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user._id);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
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
};

exports.checkAuthorization = (req, res, next) => {
  const token = req.headers["authorization"];

  // check if token exist
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization error",
    });
  }

  // verify token
  try {
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

  user.resetToken = generatedToken;
  user.expireToken = Date.now() + 1000 * 1 * 60 * 10;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "token sent to email",
  });
};
