const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getAllProducts);
router.get("/random", productsController.getRandom);
router.get("/category/:category", productsController.getCategory);
router.get("/:id", productsController.getProduct);

module.exports = router;
