// routes/creditRoutes.js
import express from 'express';
import { getCredits, updateCredits } from '../controllers/creditController.js'; // Import the controllers
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Get credits (requires authentication)
router.get("/", authenticateToken, getCredits);
router.post("/", authenticateToken, updateCredits);

export default router;
