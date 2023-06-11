const User = require("../models/userModel");

exports.addToWishList = async (req, res) => {
  const user = await User.findById(req.user);
  console.log(req.user);
  console.log(user);
  user.wishList.push(req.body.product);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "sucess",
  });
};

exports.getWishList = async (req, res) => {
  const wishList = await User.findById(req.user)
    .select("wishList")
    .populate("wishList");
  res.status(200).json({
    status: "success",
    wishList,
  });
};
