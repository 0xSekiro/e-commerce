const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

async function checkQuantity(product_id, req_quantity) {
  const product = await Product.findById(product_id);
  if (product.quantity < req_quantity) {
    return product.quantity;
  }
  return null;
}

// Get cart for user

exports.getCart = async (req, res) => {
  const cart = await Cart.find({ user: req.user })
    .select("-user")
    .populate("product");
  res.json({
    status: "success",
    cart,
  });
};

// ADD to cart
async function checkCart(product_id, user) {
  const cart = await Cart.find({ user }).select("-user").populate("product");
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].product._id == product_id) {
      return false;
    }
  }
  return true;
}
exports.addToCart = async (req, res) => {
  try {
    if (!(await checkCart(req.body.product, req.user))) {
      return res.status(400).json({
        status: "fail",
        message: `Product already in cart, you can update it`,
      });
    }
    const product = await checkQuantity(req.body.product, req.body.quantity);
    if (typeof product == "number") {
      return res.status(400).json({
        status: "fail",
        message: `There is only ${product} availabe items from this product`,
      });
    }
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

// Delete all cart itmes

exports.emptyCart = async (req, res) => {
  await Cart.deleteMany({ user: req.user });
  res.status(204).json({
    status: "success",
  });
};

// Delete specifc item
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

// Update Quantity

exports.updateQuantity = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user,
      _id: req.params.cartId,
    }).populate("product");

    const product = cart.product;

    if (product.quantity < req.body.quantity) {
      return res.status(400).json({
        status: "fail",
        message: `There is only ${product.quantity} availabe items from this product`,
      });
    }
    cart.quantity = req.body.quantity;
    const newCart = await Cart.findByIdAndUpdate(
      req.params.cartId,
      {
        quantity: req.body.quantity,
      },
      {
        new: true,
      }
    )
      .select("-user")
      .populate("product");

    res.status(200).json({
      status: "success",
      newCart,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
