const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.use(authController.checkAuthorization);

router
  .route("/")
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.emptyCart);
router.post("/checkout", cartController.checkout);
router
  .route("/:cartId")
  .delete(cartController.deleteCart)
  .patch(cartController.updateQuantity);

module.exports = router;
