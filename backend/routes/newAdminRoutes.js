import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

const hardcodedAdmin = {
  email: "admin@example.com",
  password: "admin123", // For demo only. You can hash it or use env variables.
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(400).json({ message: 'Invalid credentials' });
});

router.get("/saved-posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("savedBy", "username email");

    const grouped = {};
    posts.forEach(post => {
      const user = post.savedBy;
      if (!user) return;

      const userId = user._id.toString();

      if (!grouped[userId]) {
        grouped[userId] = {
          name: user.username,
          email: user.email,
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

  } catch (err) {
    console.error("Error in /api/admin/saved-posts:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
