// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Consolidated Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// Compatibility mappings for old frontend endpoints
app.use("/api/userreg", userRoutes);
app.use("/api/userlog", userRoutes);
app.use("/api/customer", userRoutes);
app.get("/api/search", require("./controllers/productController").searchProducts);


// MongoDB Connection
console.log("⏳ Attempting to connect to MongoDB Atlas...");
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "borganics_db",
    family: 4, // Force IPv4
    serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas - Borganics DB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("👉 Please ensure your IP is whitelisted in MongoDB Atlas: https://cloud.mongodb.com/");
    // Removed process.exit(1) to prevent crash loop while waiting for whitelist
  });

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB event error:', err.message);
});

// Global Error Handler (must be after routes)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);

  // Handle Multer upload errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: "File is too large! Maximum limit is 25MB." });
  }

  res.status(err.status || 500).json({
    message: err.message || "An internal server error occurred"
  });
});

const PORT = process.env.PORT || 5678;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Error: Port ${PORT} is already in use.`);
      console.log(`👉 To fix this, kill the process on port ${PORT} or close other terminals.`);
    } else {
      console.error('❌ Server error:', err.message);
    }
  });

