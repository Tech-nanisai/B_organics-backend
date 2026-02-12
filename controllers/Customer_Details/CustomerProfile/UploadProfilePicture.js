// backend/controllers/userProfileController.js
const UserProfile = require('../../../models/userProfileModel');

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body;

    // Check if profile already exists for this user
    let profile = await UserProfile.findOne({ userId });

    if (profile) {
      profile.profileImage.data = req.file.buffer;
      profile.profileImage.contentType = req.file.mimetype;
    } else {
      profile = new UserProfile({
        userId,
        profileImage: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });
    }

    await profile.save();
    res.status(200).json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await UserProfile.findOne({ userId });

    if (!profile || !profile.profileImage.data) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", profile.profileImage.contentType);
    res.send(profile.profileImage.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile picture", error });
  }
};

module.exports = { uploadProfilePicture, getProfilePicture };
