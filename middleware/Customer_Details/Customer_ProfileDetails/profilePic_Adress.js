// Middleware/Customer_Details/Customer_ProfileDetails/profilePic_Adress.js
const multer = require("multer");
const storage = multer.memoryStorage(); // or diskStorage
module.exports = multer({ storage });

