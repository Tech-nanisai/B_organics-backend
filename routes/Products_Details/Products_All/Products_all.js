const express = require("express");
const {
  getAllProducts,
  getProductsByCategory,
} = require("../../../controllers/Products_Details/Products_All/Products_all.js");

const router = express.Router();

// ✅ Route to get all products
router.get("/products", getAllProducts);

// ✅ Route to get products by category like "Honey", "Fruits"
router.get("/products/:category", getProductsByCategory);

module.exports = router;