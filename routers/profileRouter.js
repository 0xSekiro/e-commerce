const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.use(authController.checkAuthorization);

router
  .route("/wishlist")
  .post(userController.addToWishList)
  .get(userController.getWishList)
  .delete(userController.deleteWishList);

module.exports = router;
