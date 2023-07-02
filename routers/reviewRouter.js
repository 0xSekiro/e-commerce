const reviewController = require("../controllers/reviewController");

const router = require("express").Router();

const authController = require("../controllers/authController");
router.use(authController.checkAuthorization);

router.route("/").post(reviewController.createReview);

module.exports = router;
