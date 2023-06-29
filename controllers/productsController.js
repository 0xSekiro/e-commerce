const Product = require("../models/productModel");
const errHandler = require("../controllers/errorController");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
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
    res.status(404).json({
      status: "fail",
      message: "Product not found",
    });
  }
};

exports.getRandom = async (req, res) => {
  const products = await Product.aggregate([
    {
      $sample: { size: 5 },
    },
  ]);
  res.status(200).json({
    status: "success",
    products,
  });
};

exports.getCategory = async (req, res) => {
  const categories = ["sport", "book", "game"];
  if (!categories.includes(req.params.category)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid category",
    });
  }
  const products = await Product.find({ category: req.params.category });
  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
};
