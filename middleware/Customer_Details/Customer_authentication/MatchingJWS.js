// // backend/middleware/Customer_Details/Customer_authentication/MatchingJWS.js
const jwt = require("jsonwebtoken");
const UserRegister = require("../../../models/UserRegister.js");


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserRegister.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("Auth Middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = authMiddleware;

// backend/middleware/Customer_Details/Customer_authentication/MatchingJWS.js
// const jwt = require("jsonwebtoken");
// const UserRegister = require("../../../models/CustomerDetails_mod/CustomerProfileDetails_mod/RegistaredDetails.js");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt_token; // ✅ Read token from cookies

//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token
//     const user = await UserRegister.findById(decoded.id).select("-password"); // ✅ Lookup user

//     if (!user) {
//       return res.status(401).json({ message: "Not authorized, user not found" });
//     }

//     req.user = user; // ✅ attach user object to request
//     next();
//   } catch (error) {
//     console.error("Auth Middleware error:", error);
//     return res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

// module.exports = authMiddleware;
