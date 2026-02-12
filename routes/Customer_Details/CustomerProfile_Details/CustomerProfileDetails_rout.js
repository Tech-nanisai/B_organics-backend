//Backend/routes/Customer_Details/CustomerProfile_Details/CustomerProfileDetails_rout.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Middlewares
const verifyToken = require('../../../middleware/Customer_Details/Customer_ProfileDetails/CustomerProfileDetails_mid');

// Controllers
const { getCustomerProfile } = require('../../../controllers/Customer_Details/CustomerProfile/CustomerProfilePic');
const { uploadProfilePicture, getProfilePicture } = require('../../../controllers/Customer_Details/CustomerProfile/UploadProfilePicture.js');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === Endpoints ===

// Get full customer profile (protected)
router.get('/profile', verifyToken, getCustomerProfile);

// Upload profile picture
router.post('/upload', upload.single("profileImage"), uploadProfilePicture);

// Get profile picture by userId
router.get('/picture/:userId', getProfilePicture);

module.exports = router;


