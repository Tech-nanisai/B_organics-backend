//backend/routes/Customer_Details/CustomerProfile_Details/RegistaredDetails.js
const express = require("express");
const router = express.Router();

const {
  getRegisteredUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByNanoid,
} = require("../../../controllers/Customer_Details/CustomerProfile/RegistaredDetails.js");

const verifyRegistaredToken = require("../../../middleware/Customer_Details/Customer_ProfileDetails/RegistaredDetails.js");

// 🔐 GET user by email (query param)
router.get("/registared", verifyRegistaredToken, getRegisteredUser);

// 🔐 GET user by MongoDB _id
router.get("/registared/:id", verifyRegistaredToken, getUserById);

// 🔐 PUT user by MongoDB _id
router.put("/registared/:id", verifyRegistaredToken, updateUser);

// 🔐 DELETE user by MongoDB _id
router.delete("/registared/:id", verifyRegistaredToken, deleteUser);

// 🔍 GET user by nanoid (for dashboard/admin)
router.get("/registared/nanoid/:nanoid", verifyRegistaredToken, getUserByNanoid);

module.exports = router;
