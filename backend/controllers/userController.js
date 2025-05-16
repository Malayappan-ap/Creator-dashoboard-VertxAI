// controllers/userController.js
import User from "../models/User.js";
import Post from "../models/Post.js";

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, bio, avatar, location } = req.body;

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;
    user.location = location || user.location;

    if (name && bio && location) {
      if (!user.profileCompleted) {
        user.credits += 30;
        user.activityLog.push(`Completed profile (+30 credits)`);
        user.profileCompleted = true;
      }
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};

// ✅ Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Fetching profile failed", error: err.message });
  }
};

// ✅ Save Feed/Post to Profile
export const saveFeedController = async (req, res) => {
  try {
    const { title, link } = req.body;
    const savedBy = req.user.id;

    if (!title || !link) {
      return res.status(400).json({ error: "Missing title or link" });
    }

    const newPost = new Post({ title, link, savedBy });
    await newPost.save();

    const user = await User.findById(savedBy);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.savedFeeds.push(newPost._id);
    await user.save();

    res.status(200).json({ message: 'Post saved successfully!' });
  } catch (error) {
    console.error('Error saving feed:', error);
    res.status(500).json({ error: 'Failed to save post.' });
  }
};

// ✅ User Dashboard Info
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedFeeds');

    if (!user) return res.status(404).json({ message: "User not found" });

    const filteredFeeds = user.savedFeeds.filter(
      (feed) => feed.savedBy.toString() === req.user.id
    );

    res.json({
      credits: user.credits || 0,
      activityLog: user.activityLog || [],
      savedFeeds: filteredFeeds,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


//export { updateProfile, saveFeedController, getDashboard };