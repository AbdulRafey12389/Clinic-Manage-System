import { uploadBufferToCloudinary } from "../../config/cloudinary.js";
import User from "../../models/user.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, age, gender } = req.body;
    let imageUrl;

    console.log(req.body);

    if (req.file) {
      const cloudinaryRes = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = cloudinaryRes;
    }

    if (!name && !email && !age && !gender && !req.file) {
      return res.status(400).json({
        message: "Please provide at least one field to update.",
      });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (age) updates.age = age;
    if (gender) updates.gender = gender;
    if (imageUrl) updates.imageUrl = imageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
