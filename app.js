// read env variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// require and lanuch express app
const express = require("express");
const app = express();

// connect to db
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/e-commerce").then(() => {
  console.log("DB connected successfully");
});

// Middlewares

// serve static files
app.use("/public/", express.static("./public"));
// parse json data
app.use("/", express.json());
// api routing
const authRouter = require("./routers/authRouter");
app.use("/api/v1/auth", authRouter);

// listening on port 8080
app.listen(8080, () => {
  console.log("Start listening on port 8080...");
});
