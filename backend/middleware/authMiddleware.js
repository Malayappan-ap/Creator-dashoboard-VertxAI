import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/adminModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "thalapathy22";

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Not an admin." });
    }
  } catch (err) {
    console.error("isAdmin error:", err);
    res.status(500).json({ message: "Admin check failed" });
  }
};

// Authenticate any token (for users)
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded contains payload like { id: ..., isAdmin: ... }
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid or expired token" });
  }
};

// Verify admin-specific token (for admins)
export const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or format invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: 'Admin not found' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ message: 'JWT Error: ' + err.message });
  }
};

