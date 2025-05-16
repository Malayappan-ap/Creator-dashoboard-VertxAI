import express from 'express';
import { getCreators } from '../controllers/creatorController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/creators
router.get('/', authenticateToken, getCreators);

export default router;
