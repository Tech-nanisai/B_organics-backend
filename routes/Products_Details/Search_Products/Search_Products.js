const express = require("express");
const router = express.Router();
const Product = require("../../../models/Product"); // ✅ using updated model

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Missing search query" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive

    const products = await Product.find({ name: { $regex: regex } }).limit(10);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
