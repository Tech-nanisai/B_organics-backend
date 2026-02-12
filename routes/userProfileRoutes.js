// backend/routes/userProfileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadProfilePicture, getProfilePicture } = require("../controllers/Customer_Details/CustomerProfile/UploadProfilePicture.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload profile picture
router.post("/upload", upload.single("profileImage"), uploadProfilePicture);

// Get profile picture
router.get("/:userId", getProfilePicture);

module.exports = router;

