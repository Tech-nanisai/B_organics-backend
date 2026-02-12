const User = require("../models/UserRegister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// --- Admin Auth Controllers ---

const registerAdmin = async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database connection is not active. Please check your backend terminal and MongoDB Atlas whitelist."
            });
        }

        // Check if admin already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "Admin with this email or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const crypto = require("crypto");
        const nanoid = crypto.randomBytes(6).toString("hex").toUpperCase();

        const newAdmin = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            nanoid,
            role: "admin" // Explicitly set role to admin
        });

        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Admin Registration Error:", error.message);
        res.status(500).json({ message: "Server error during admin registration" });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database connection is not active. Please check your backend terminal and MongoDB Atlas whitelist."
            });
        }

        const user = await User.findOne({ email });

        // Check if user exists AND is an admin
        if (!user) {
            return res.status(404).json({ message: "Admin not found with this email" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Not an admin account." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate API Token
        const token = jwt.sign(
            { id: user._id, role: user.role, nanoid: user.nanoid },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Auto logout after 60 minutes
        );

        // Set Cookie
        res.cookie("jwt_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json({
            message: "Admin login successful",
            token,
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error.message);
        res.status(500).json({ message: "Server error during admin login" });
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie("jwt_token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
    registerAdmin,
    loginAdmin,
    logoutAdmin
};
