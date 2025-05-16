// controllers/profileController.js
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;  // Example fields you might want to update

  try {
    const user = await User.findById(req.user.id);  // req.user.id should come from JWT

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the user's profile data
    user.username = name || user.username;
    user.avatar = avatar || user.avatar;
    user.profileCompleted = true;  // Mark the profile as completed

    await user.save();

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
