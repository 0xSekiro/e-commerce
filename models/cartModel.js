const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "cart must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "cannot add empty to cart"],
    },
    quantity: {
      type: Number,
      required: [true, "Please specify the quantity"],
    },
  },
  { versionKey: false }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
