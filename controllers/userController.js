const User = require("../models/userModel");
const Order = require("../models/orderModel");
const errHandler = require("./errorController");

exports.addToWishList = async (req, res) => {
  try {
    if (req.body.product) {
      const user = await User.findById(req.user);
      if (user.wishList.includes(req.body.product)) {
        return res.status(400).json({
          status: "fail",
          message: "item already in wishlist",
        });
      }
      user.wishList.push(req.body.product);
      await user.save({ validateBeforeSave: false });

      const wishList = (
        await User.findById(req.user)
          .select("wishList -_id")
          .populate("wishList")
      ).wishList;

      res.status(201).json({
        status: "sucess",
        wishList,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Missing product parameter",
      });
    }
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

exports.getWishList = async (req, res) => {
  const wishList = (
    await User.findById(req.user).select("wishList -_id").populate("wishList")
  ).wishList;
  res.status(200).json({
    status: "success",
    wishList,
  });
};

exports.deleteWishList = async (req, res) => {
  try {
    let user = await User.findById(req.user);
    if (user.wishList.includes(req.params.id)) {
      user.wishList.splice(user.wishList.indexOf(req.params.id), 1);
    } else {
      return errHandler.returnError(400, "Invalid product ID", res);
    }
    await user.save({ validateBeforeSave: false });
    const wishList = (
      await User.findById(req.user).select("wishList -_id").populate("wishList")
    ).wishList;
    res.status(200).json({
      status: "success",
      wishList,
    });
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user })
      .select("-user")
      .populate("products");
    res.status(200).json({
      status: "success",
      orders,
    });
  } catch (err) {
    return errHandler.returnError(400, err, res);
  }
};
