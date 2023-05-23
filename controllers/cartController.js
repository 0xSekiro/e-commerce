const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.getCart = async (req, res) => {
  const cart = await Cart.find({ user: req.user })
    .select("-user")
    .populate("product");
  res.json({
    status: "success",
    cart,
  });
};

exports.addToCart = async (req, res) => {
  try {
    const cart = await Cart.create({
      user: req.user,
      product: req.body.product,
      quantity: req.body.quantity,
    });

    res.status(201).json({
      status: "success",
      cart,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.emptyCart = async (req, res) => {
  await Cart.deleteMany({ user: req.user });
  res.status(204).json({
    status: "success",
  });
};

exports.deleteCart = async (req, res) => {
  await Cart.deleteOne({
    user: req.user,
    _id: req.params.cartId,
  });
  const cart = await Cart.find({ user: req.user })
    .select("-user")
    .populate("product");

  res.status(200).json({
    status: "Deleted successfully",
    cart,
  });
};
