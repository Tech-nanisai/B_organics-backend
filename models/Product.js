const mongoose = require("mongoose");

// Avoid redefining the model if it's already compiled
const Product = mongoose.models.Product || mongoose.model(
  "Product",
  new mongoose.Schema({
    category: String,
    name: String,
    image: String,
    images: [String],
    price: Number,
    discount: Number,
    quantity: String,
    description: String, // Optional: if needed by any functionality
  }),
  "products"
);

module.exports = Product;
