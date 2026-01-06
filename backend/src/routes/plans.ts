import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active plans (public)
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
    
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch plans' });
  }
});

// Get plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await prisma.plan.findUnique({
      where: { id, isActive: true }
    });
    
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch plan' });
  }
});

export default router;