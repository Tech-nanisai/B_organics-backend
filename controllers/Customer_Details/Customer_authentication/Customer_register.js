//backend/controllers/Customer_Details/Customer_authentication/Customer_register.js
const User = require("../../../models/UserRegister.js");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

// ✅ Password strength checker
const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

// ✅ Format response
const formatUserResponse = (user) => ({
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  nanoid: user.nanoid,
  createdAt: moment(user.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
});

/**
 * @desc Register a new user
 * @route POST /api/users/register
 */
const registerUser = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail) return res.status(400).json({ message: "Email already exists" });
    if (existingPhone) return res.status(400).json({ message: "Phone number already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { nanoid } = await import("nanoid");
    const uniqueNanoid = nanoid(12);

    const newUser = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      nanoid: uniqueNanoid,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
