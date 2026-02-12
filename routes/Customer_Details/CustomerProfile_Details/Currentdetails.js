// backend/routes/Customer_Details/CustomerProfile_Details/Currentdetails.js
const express = require("express");
const router = express.Router();
const { getCurrentCustomerDetails } = require("../../../controllers/Customer_Details/CustomerProfile/Currentdetails.js");
const verifyToken = require("../../../middleware/Customer_Details/Customer_authentication/nanoid_jsonwebtoken.js");

router.get("/currentdetails", verifyToken, getCurrentCustomerDetails);

module.exports = router;
