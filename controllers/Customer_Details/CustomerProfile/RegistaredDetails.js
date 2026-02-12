//backend/controllers/Customer_Details/CustomerProfile/RegistaredDetails.js
const User = require("../../../models/UserRegister.js");
const moment = require("moment-timezone");

// ✅ Format response
const formatUserResponse = (user) => ({
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  nanoid: user.nanoid,
  createdAt: moment(user.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
});

/**
 * @desc Get user by email
 * @route GET /api/users?email=abc@example.com
 */
const getRegisteredUser = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get user by MongoDB _id
 * @route GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update user by MongoDB _id
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(formatUserResponse(updatedUser));
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete user by MongoDB _id
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get user by nanoid
 * @route GET /api/users/customer/:nanoid
 */
const getUserByNanoid = async (req, res) => {
  try {
    const user = await User.findOne({ nanoid: req.params.nanoid }).select("-password");
    if (!user) return res.status(404).json({ message: "Customer not found" });
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRegisteredUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByNanoid,
};
