// backend/routes/Customer_Details/Customer_authentication/Customer_register.js
const express = require("express");
const router = express.Router();
const userLoginController = require("../../../controllers/Customer_Details/Customer_authentication/Customer_login.js");

router.post("/login", userLoginController);
module.exports = router;
