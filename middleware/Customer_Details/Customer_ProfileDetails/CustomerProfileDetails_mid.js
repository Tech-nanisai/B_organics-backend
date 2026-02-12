//backend/middleware/CustomerDetails_mid/CustomerProfileDetails_mid/CustomerProfileDetails_mid.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.log("Decoded JWT:", decoded); // Debugging
        req.userId = decoded.userId; // Must match the key used when signing token
        next();
    });
};

module.exports = verifyToken;

