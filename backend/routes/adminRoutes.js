import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin route to get all saved posts with user details
// GET /api/admin/saved-posts
// routes/adminRoutes.js
router.get("/saved-posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("savedBy", "username email");
    
    // Group posts by user
    const grouped = {};

    posts.forEach(post => {
      const userId = post.savedBy._id.toString();
      if (!grouped[userId]) {
        grouped[userId] = {
          name: post.savedBy.username,
          email: post.savedBy.email,
          posts: [],
        };
      }
      grouped[userId].posts.push({
        title: post.title,
        link: post.link,
      });
    });

    const result = Object.values(grouped);
    res.json(result);

  } catch (error) {
    console.error("Admin saved-posts error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;



