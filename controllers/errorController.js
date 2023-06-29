const express = require("express");
exports.returnError = (code, message, res) => {
  res.status(code).json({
    status: "fail",
    message,
  });
};
