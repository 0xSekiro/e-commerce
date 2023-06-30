const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.use(authController.checkAuthorization);

router
  .route("/wishlist")
  .post(userController.addToWishList)
  .get(userController.getWishList);
router.delete("/wishlist/:id", userController.deleteWishList);

router.route("/orders").get(userController.getOrders);

module.exports = router;
