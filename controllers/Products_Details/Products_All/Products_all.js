// backend/controllers/productController.js
const Product = require("../../../models/Product.js");

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get products by category (e.g., Honey, Fruits, Coffee)
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const filteredProducts = await Product.find({ category });
    res.status(200).json(filteredProducts);
  } catch (err) {
    console.error("❌ Failed to fetch category products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllProducts, getProductsByCategory };


// backend/controllers/productController.js
// const Product = require("../models/ProductModels.js"); // ✅ fixed path

// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.status(200).json(products);
//   } catch (err) {
//     console.error("❌ Failed to fetch products:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = getAllProducts;

