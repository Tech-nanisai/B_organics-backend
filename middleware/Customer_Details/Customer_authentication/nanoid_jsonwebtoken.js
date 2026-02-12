const jwt = require("jsonwebtoken");
const UserRegister = require("../../../models/UserRegister.js");

const verifyNanoidToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token; // ✅ Match the actual cookie name
    if (!token) {
      console.warn("No token found in cookies");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserRegister.findOne({ nanoid: decoded.nanoid }).select("-password");

    if (!user) {
      console.warn("User not found for nanoid:", decoded.nanoid);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ Attach user to request
    console.log("✅ Authenticated user:", req.user.nanoid);
    next();
  } catch (error) {
    console.error("❌ Nanoid token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyNanoidToken;
