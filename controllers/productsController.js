const Product = require("../models/productModel");
const errHandler = require("../controllers/errorController");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $ne: 0 } });
    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (err) {
    errHandler.returnError(500, "Someting went wrong", res);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) return errHandler.returnError(200, "Product not found", res);
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (err) {
    errHandler.returnError(400, "Product not found", res);
  }
};

exports.getRandom = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 5 },
      },
    ]);
    res.status(200).json({
      status: "success",
      products,
    });
  } catch (err) {
    errHandler.returnError(500, "Something went wrong", res);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = ["sport", "book", "game"];
    if (!categories.includes(req.params.category)) {
      return errHandler.returnError(400, "Invalid category", res);
    }
    const products = await Product.find({ category: req.params.category });
    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (err) {
    errHandler.returnError(500, "Something went wrong", res);
  }
};
