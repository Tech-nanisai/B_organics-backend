// models/CustomerDetails_mod/CustomerProfileDetails_mod/profilePic_Adress.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: String,
  house: String,
  street: String,
  landmark: String,
  city: String,
  state: String,
  zip: String,
});

const profilePicAddressSchema = new mongoose.Schema({
  nanoid: { type: String, required: true, unique: true },
  profileImage: String, // base64 or file path
  bannerImage: String,
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProfilePicAddress", profilePicAddressSchema, "user_addresses_images");
