// backend/controllers/Customer_Details/Customer_authentication/Customer_login.js

const User = require("../../../models/UserRegister.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🧾 Generate JWT token
    const token = jwt.sign(
      {
        nanoid: user.nanoid,
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set to false if you're testing without HTTPS
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // ✅ Include full user data in response
    res.status(200).json({
      message: "Login successful",
      token, // optional if frontend still expects it
      user: {
        fullname: user.fullname,
        phone: user.phone,
        email: user.email,
        nanoid: user.nanoid,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = userLoginController;
