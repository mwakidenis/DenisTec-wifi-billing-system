import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import sessionService from '../services/sessionService';

const router = express.Router();
const prisma = new PrismaClient();

// Get user sessions
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sessions = await sessionService.getUserActiveSessions(req.user!.id);
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get sessions' });
  }
});

// Get session by token
router.get('/token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const session = await sessionService.getActiveSession(token);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found or expired' });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get session' });
  }
});

export default router;