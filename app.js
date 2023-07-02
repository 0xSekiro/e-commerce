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

// enable cors
const cors = require("cors");
app.use(cors());

// logging
const morgan = require("morgan");
app.use(morgan("combined"));

// documentation
app.get("/", (req, res) => {
  res.status(200).sendFile(`${__dirname}/docmentation.html`);
}),
  // parse json data
  app.use("/", express.json());
// api routing
const authRouter = require("./routers/authRouter");
app.use("/api/v1/auth", authRouter);

const productRouter = require("./routers/productRouter");
app.use("/api/v1/products/", productRouter);

const cartRouter = require("./routers/cartRouter");
app.use("/api/v1/cart", cartRouter);

const profileRouter = require("./routers/profileRouter");
app.use("/api/v1/profile", profileRouter);

const reviewRouter = require("./routers/reviewRouter");
app.use("/api/v1/review", reviewRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Not found",
  });
});

// listening on port 8080
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Start listening on ${PORT} ...`);
});

module.exports = app;
