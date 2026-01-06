import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user payments
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      include: {
        plan: {
          select: {
            name: true,
            duration: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get payments' });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: req.user!.id
      },
      include: {
        plan: true
      }
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get payment' });
  }
});

export default router;