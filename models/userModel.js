const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    stripe_id: String,
    google_id: String,
    card_id: String,
    username: {
      type: String,
      required: [true, "Must enter username"],
      trim: true,
    },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
      sparse: true,
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
    versionKey: false,
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
