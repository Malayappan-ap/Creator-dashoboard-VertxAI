import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";  // make sure path is correct
import bcrypt from "bcryptjs";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "thalapathy22";

// Middleware for token verification
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
    req.user = user;
    next();
  });
}

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Ensure 'username' is being destructured

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with hashed password
    const user = new User({ username, email, password }); // let the model handle hashing

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const today = new Date().toDateString();
    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;

    // ✅ Only increment credits if login is on a new day
    if (lastLoginDate !== today) {
      user.credits += 10;
      user.activityLog.push(`+10 credits for daily login on ${new Date().toLocaleString()}`);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        credits: user.credits,
        savedFeeds: user.savedFeeds,
        activityLog: user.activityLog,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});


export const authRoutes = router;
