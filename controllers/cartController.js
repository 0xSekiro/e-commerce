const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
  let price = 0;
  cart.forEach((el) => {
    price += el.product.price * el.quantity;
  });

  res.json({
    status: "success",
    price,
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
    let cart = await Cart.findOne({
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
    const newCart = await Cart.findByIdAndUpdate(req.params.cartId, {
      quantity: req.body.quantity,
    })
      .select("-user")
      .populate("product");
    cart = await Cart.find({ user: req.user })
      .select("-user")
      .populate("product");
    let price = 0;
    cart.forEach((el) => {
      price += el.product.price * el.quantity;
    });

    res.status(200).json({
      status: "success",
      price,
      cart,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const fields = [
      req.body.email,
      req.body.card_number,
      req.body.exp_month,
      req.body.exp_year,
      req.body.cvc,
      req.body.city,
      req.body.country,
      req.body.address,
    ];
    for (i = 0; i < fields.length; i++) {
      if (!fields[i]) {
        return res.status(400).json({
          status: "fail",
          message:
            "Missing 1 or more of 8 fields ['email','card_number','exp_month','exp_year','cvc', 'country', 'city', 'address']",
        });
      }
    }

    const user = await User.findById(req.user);

    // check user as customer
    if (!user.stripe_id) {
      const param = {};
      param.name = user.username;
      param.email = req.body.email;
      const customer = await stripe.customers.create(param);
      user.stripe_id = customer.id;
      await user.save({ validateBeforeSave: false });
    }

    // delete last card
    if (user.card_id) {
      try {
        const deleted = await stripe.customers.deleteSource(
          user.stripe_id,
          user.card_id
        );
      } catch (err) {
        console.log(err);
      }
    }

    // add token
    let param = {
      card: {
        number: String(req.body.card_number),
        exp_month: Number(req.body.exp_month),
        exp_year: Number(req.body.exp_year),
        cvc: String(req.body.cvc),
        address_country: String(req.body.country),
        address_city: String(req.body.city),
        address_line1: String(req.body.address),
      },
    };

    const token = await stripe.tokens.create(param);

    // add card
    const card = await stripe.customers.createSource(user.stripe_id, {
      source: token.id,
    });
    (user.card_id = card.id), await user.save({ validateBeforeSave: false });

    // charge
    const cart = await Cart.find({ user: req.user })
      .select("-user")
      .populate("product");
    let products = [];
    cart.forEach((el) => {
      products.push(el.product._id);
    });
    let price = 0;
    cart.forEach((el) => {
      price += el.product.price * el.quantity;
    });
    param = {
      amount: price,
      currency: "usd",
      customer: user.stripe_id,
    };

    if (price == 0) {
      return res.status(400).json({
        status: "fail",
        message: "Cart is empty",
      });
    }

    await stripe.charges.create(param);

    // empty card
    await Cart.deleteMany({ user: req.user });

    // create order
    await Order.create({
      user: req.user,
      products,
      total_price: price,
    });

    // update product quantity

    res.status(200).json({
      status: "success",
      messgage: `Payment completed successfully`,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      err,
    });
  }
};
