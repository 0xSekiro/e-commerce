const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Must enter username"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      required: [true, "Must enter email"],
      validate: {
        validator: function (n) {
          return validator.isEmail(n);
        },
        message: "Invalid email",
      },
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Must enter password"],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Must confirm password"],
      validate: {
        validator: function (pass) {
          return pass == this.password;
        },
        message: "Passwords are not the same",
      },
    },
    resetToken: String,
    expireToken: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.passwordConfirm = undefined;
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
