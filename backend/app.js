import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import redditRoutes from './routes/reddit.js'; 
import userRoutes from "./routes/userRoutes.js";
import { authRoutes, authenticateToken } from "./routes/auth.js";
import { updateProfile, saveFeedController } from "./controllers/userController.js";
import Post from './models/Post.js';
import creditRoutes from './routes/creditRoutes.js';
import newAdminRoutes from './routes/newAdminRoutes.js';
import postRoutes from "./routes/postRoutes.js";
import creatorRoutes from './routes/creatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

app.use('/api/reddit', redditRoutes);
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);      // Must come before postRoutes
app.use('/api/post', postRoutes);
app.use('/api/credits', creditRoutes); 
app.use('/api/creators', creatorRoutes);
app.use('/api/admin', newAdminRoutes);
app.use('/api/admin', adminRoutes);
// Routes
app.use('/api/auth', authRoutes);


// Protected Routes
app.post('/api/user/save-feed', authenticateToken, saveFeedController);
app.post('/api/user/updateProfile', authenticateToken, updateProfile);

// Save a Post
app.post('/api/savePost', async (req, res) => {
  const { postId, content } = req.body;
  try {
    const post = new Post({ postId, content });
    await post.save();
    res.status(200).send('Post saved');
  } catch (err) {
    res.status(500).send('Error saving post');
  }
});

// Report a Post
app.post('/api/reportPost', async (req, res) => {
  const { postId } = req.body;
  try {
    await Post.findOneAndUpdate({ postId }, { reported: true });
    res.status(200).send('Post reported');
  } catch (err) {
    res.status(500).send('Error reporting post');
  }
});

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection failed:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Get user profile data
app.get('/api/user/profile', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);
    res.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      credits: user.credits,
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Update user profile and award credits for completion
app.post('/api/user/updateProfile', async (req, res) => {
  const { userId, name, email, bio } = req.body;

  try {
    const user = await User.findById(userId);

    // Update profile fields
    user.name = name;
    user.email = email;
    user.bio = bio;

    // Check if profile is now complete
    if (user.name && user.email && user.bio) {
      if (!user.profileCompleted) {
        user.credits += 10;  // Award 10 credits for completing profile
        user.profileCompleted = true; // Mark profile as complete
      }
    }

    await user.save();
    res.json({ credits: user.credits, profileCompleted: user.profileCompleted });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default app;
