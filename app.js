// read env variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// require and lanuch express app
const express = require("express");
const app = express();

// connect to db
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_LINK).then(() => {
  console.log("DB connected successfully");
});

// Middlewares

// serve static files
app.use("/public/", express.static("../public"));
// parse json data
app.use("/", express.json());
// api routing
const authRouter = require("./routers/authRouter");
app.use("/api/v1/auth", authRouter);

// listening on port 8080
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Start listening on ${PORT} ...`);
});

module.exports = app;
