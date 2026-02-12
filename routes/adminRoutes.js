const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
