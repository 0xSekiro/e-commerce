const errHandler = require("../controllers/errorController");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

exports.createReview = async (req, res) => {
  try {
    const { product, review } = { ...req.body };
    if (!product || !review) {
      return errHandler.returnError(
        400,
        "Missed 1 or more of 2 fields ['product', 'review]",
        res
      );
    }

    const orders = await Order.find({ user: req.user }).select("products");
    let theProducts = [];
    orders.forEach((order) => {
      order.products.forEach((product) => {
        product = JSON.stringify(product.product).replaceAll('"', "");
        if (!theProducts.includes(product)) {
          theProducts.push(product);
        }
      });
    });

    if (theProducts.includes(product)) {
      const theProduct = await Product.findById(product);
      theProduct.reviews.push(review);
      await theProduct.save({ validateBeforeSave: false });

      res.status(201).json({
        status: "success",
        message: "Review added to product sucessfully",
      });
    } else {
      return errHandler.returnError(
        400,
        "You must buy the product to review it",
        res
      );
    }
  } catch (err) {
    errHandler.returnError(500, "Something went wrong", res);
  }
};
