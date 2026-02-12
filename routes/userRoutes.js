const express = require("express");
const router = express.Router();
const {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    uploadImage,
    addAddress,
    getAllUsers
} = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Profile Routes
router.get("/current", verifyToken, getCurrentUser);
router.get("/currentdetails", verifyToken, getCurrentUser); // Alias for frontend
router.put("/profile/:nanoid", verifyToken, updateProfile);
router.put("/profile/registered/nanoid/:nanoid", verifyToken, updateProfile); // Alias for frontend
router.post("/profile/upload", verifyToken, upload.single("image"), uploadImage);
router.post("/address", verifyToken, addAddress);
router.post("/profile/address", verifyToken, addAddress); // Alias for frontend

// Admin Routes
router.get("/", verifyToken, verifyAdmin, getAllUsers);

module.exports = router;
