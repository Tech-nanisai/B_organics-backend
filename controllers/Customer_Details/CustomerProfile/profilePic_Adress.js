// controllers/Customer_Details/CustomerProfile/profilePic_Adress.js

const UserDetail = require("../../../models/UserDetail.js");
const UserRegister = require("../../../models/UserRegister.js");

// ✅ 1. Update user profile (generic update)
const updateUserByNanoid = async (req, res) => {
  try {
    const { nanoid } = req.params;
    const updateData = req.body;

    // Split updates between UserRegister (core info) and UserDetail (profile info)
    const registerFields = ['fullName', 'phone', 'email'];
    const detailFields = ['addresses', 'profileImage', 'bannerImage'];

    const registerUpdate = {};
    const detailUpdate = {};

    Object.keys(updateData).forEach(key => {
      if (registerFields.includes(key)) registerUpdate[key] = updateData[key];
      else detailUpdate[key] = updateData[key]; // Default others to detail
    });

    let updatedUserRegister = null;
    if (Object.keys(registerUpdate).length > 0) {
      updatedUserRegister = await UserRegister.findOneAndUpdate(
        { nanoid },
        { $set: registerUpdate },
        { new: true }
      );
    }

    let updatedUserDetail = null;
    if (Object.keys(detailUpdate).length > 0) {
      updatedUserDetail = await UserDetail.findOneAndUpdate(
        { nanoid },
        { $set: detailUpdate },
        { new: true, upsert: true }
      );
    }

    if (!updatedUserRegister && !updatedUserDetail) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.status(200).json({
      message: "Update successful",
      user: updatedUserRegister,
      details: updatedUserDetail
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 2. Upload profile or banner image
const uploadImage = async (req, res) => {
  try {
    const { nanoid, type } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!nanoid || !imageBuffer || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageBase64 = imageBuffer.toString("base64");
    const imageField = type === "banner" ? "bannerImage" : "profileImage";

    const updatedUser = await UserDetail.findOneAndUpdate(
      { nanoid },
      { $set: { [imageField]: imageBase64 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Image uploaded successfully", details: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. Add a new address to the user
const addAddress = async (req, res) => {
  try {
    const { nanoid, address } = req.body;

    if (!nanoid || !address) {
      return res.status(400).json({ message: "Missing nanoid or address" });
    }

    const updatedUser = await UserDetail.findOneAndUpdate(
      { nanoid },
      { $push: { addresses: address } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Address added successfully", details: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 4. Get current user details (used by frontend)
const getCurrentCustomerDetails = async (req, res) => {
  try {
    // FIX: The nanoid should be available on req.user after authentication
    const { nanoid } = req.user;

    if (!nanoid) {
      return res.status(400).json({ message: "Authentication failed. Missing nanoid." });
    }

    const mainUser = await UserRegister.findOne({ nanoid }).select('-password');
    const detailUser = await UserDetail.findOne({ nanoid }) || {};

    if (!mainUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      profile: {
        fullName: mainUser.fullName,
        email: mainUser.email,
        phone: mainUser.phone,
        nanoid: mainUser.nanoid,
        profileImage: detailUser.profileImage || null,
        bannerImage: detailUser.bannerImage || null,
      },
      addresses: detailUser.addresses || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export all functions
module.exports = {
  updateUserByNanoid,
  uploadImage,
  addAddress,
  getCurrentCustomerDetails,
};
