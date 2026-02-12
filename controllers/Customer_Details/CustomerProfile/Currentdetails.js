// backend/controllers/Customer_Details/CustomerProfile/Currentdetails.js
const User = require("../../../models/UserRegister.js");

const getCurrentCustomerDetails = async (req, res) => {
  try {
    const user = req.user; // ✅ Directly use req.user from middleware

    if (!user) {
      console.warn("req.user is missing in controller");
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log("📦 Serving profile for:", user.nanoid);

    const addresses = []; // 🔧 Placeholder for future address logic

    res.status(200).json({
      profile: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        nanoid: user.nanoid,
        profileImage: user.profileImage || null,
        createdAt: user.createdAt,
      },
      addresses,
    });
  } catch (error) {
    console.error("❌ Fetch error in getCurrentCustomerDetails:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCurrentCustomerDetails };
