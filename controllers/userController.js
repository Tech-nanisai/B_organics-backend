const User = require("../models/UserRegister");
const UserDetail = require("../models/UserDetail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const mongoose = require("mongoose");

// Helper to format user response
const formatUserResponse = (user, details = {}) => ({
  _id: user._id,
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  nanoid: user.nanoid,
  role: user.role, // Added role
  createdAt: moment(user.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
  profileImage: details.profileImage || null,
  bannerImage: details.bannerImage || null,
  addresses: details.addresses || [],
});

// --- Auth Controllers ---

const register = async (req, res) => {
  const { fullName, phone, email, password } = req.body;
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database connection is not active." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Truly unique Nanoid generation
    const crypto = require("crypto");
    const finalNanoid = crypto.randomBytes(6).toString("hex").toUpperCase(); // 12 chars unique

    const newUser = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      nanoid: finalNanoid,
    });

    await newUser.save();

    // AUTO-LOGIN after registration
    const token = jwt.sign(
      { id: newUser._id, nanoid: newUser.nanoid, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        nanoid: newUser.nanoid,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: `Registration error: ${error.message}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection is not active. Please check your backend terminal and MongoDB Atlas whitelist."
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email address" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id, nanoid: user.nanoid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        nanoid: user.nanoid,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt_token", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// --- Profile Controllers ---

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const details = await UserDetail.findOne({ nanoid: user.nanoid }) || {};
    res.status(200).json({
      profile: formatUserResponse(user, details),
      addresses: details.addresses || [],
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  const { nanoid } = req.params;
  const updateData = req.body;
  try {
    const registerFields = ['fullName', 'phone', 'email'];
    const registerUpdate = {};
    const detailUpdate = {};

    Object.keys(updateData).forEach(key => {
      if (registerFields.includes(key)) registerUpdate[key] = updateData[key];
      else detailUpdate[key] = updateData[key];
    });

    if (Object.keys(registerUpdate).length > 0) {
      await User.findOneAndUpdate({ nanoid }, { $set: registerUpdate });
    }

    if (Object.keys(detailUpdate).length > 0) {
      await UserDetail.findOneAndUpdate({ nanoid }, { $set: detailUpdate }, { upsert: true });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { nanoid, type } = req.body;
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    const imageBase64 = req.file.buffer.toString("base64");
    const imageField = type === "banner" ? "bannerImage" : "profileImage";

    const details = await UserDetail.findOneAndUpdate(
      { nanoid },
      { $set: { [imageField]: imageBase64 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Image uploaded successfully", details });
  } catch (error) {
    console.error("Image Upload Error:", error.message);
    res.status(500).json({ message: "Server error uploading image" });
  }
};

const addAddress = async (req, res) => {
  const { nanoid, address } = req.body;
  try {
    const details = await UserDetail.findOneAndUpdate(
      { nanoid },
      { $push: { addresses: address } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Address added successfully", details });
  } catch (error) {
    console.error("Add Address Error:", error.message);
    res.status(500).json({ message: "Server error adding address" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");
    // Optionally join with UserDetail if needed
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch All Users Error:", error.message);
    res.status(500).json({ message: "Server error fetching customers" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadImage,
  addAddress,
  getAllUsers,
};
