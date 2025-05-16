import express from "express";
import {
  updateProfile,
  getProfile,
  saveFeedController,
  getDashboard,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with authenticateToken
router.get("/profile", authenticateToken, getProfile);
router.post("/updateProfile", authenticateToken, updateProfile);
router.post("/saveFeed", authenticateToken, saveFeedController);
router.get("/dashboard", authenticateToken, getDashboard);

export default router;
