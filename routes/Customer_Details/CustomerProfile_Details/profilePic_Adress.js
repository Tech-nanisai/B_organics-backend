// backend/routes/Customer_Details/CustomerProfile_Details/profilePic_Adress.js

const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/Customer_Details/Customer_ProfileDetails/profilePic_Adress");

const {
  uploadImage,
  updateUserByNanoid,
  getCurrentCustomerDetails,
  addAddress
} = require("../../../controllers/Customer_Details/CustomerProfile/profilePic_Adress");

router.post("/upload", upload.single("image"), uploadImage);
router.put("/registered/nanoid/:nanoid", updateUserByNanoid);
router.get("/currentdetails", getCurrentCustomerDetails);
router.post("/address", addAddress);

// ❌ Wrong: module.exports = { router };  // This exports an object
// ✅ Correct:
module.exports = router;


