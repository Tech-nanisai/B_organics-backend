// backend/routes/Customer_Details/Customer_authentication/Customer_register.js
const express = require("express");
const router = express.Router();

const { registerUser } = require("../../../controllers/Customer_Details/Customer_authentication/Customer_register.js");

// 🔐 Register a new user
router.post("/register", registerUser);

module.exports = router;
