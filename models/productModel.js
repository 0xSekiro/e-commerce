const mongoose = require("mongoose");
// require("mongoose-type-url");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product must have a name"],
    },
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
    },
    category: {
      type: String,
      enum: ["sport", "book", "game"],
      required: [true, "Product must have belong to a category"],
    },
    img: {
      type: Array,
      required: [true, "Product must have an image"],
    },
    quantity: {
      type: Number,
      required: [true, "Product must hava a quantity"],
    },
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
