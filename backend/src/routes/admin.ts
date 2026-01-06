import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import mikrotikService from '../services/mikrotikService';
import sessionService from '../services/sessionService';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

// Dashboard stats
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      todayRevenue,
      activeSessions,
      totalSessions
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        _sum: { amount: true }
      }),
      prisma.session.count({ where: { status: 'ACTIVE' } }),
      prisma.session.count()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalRevenue: totalRevenue._sum.amount || 0,
        todayRevenue: todayRevenue._sum.amount || 0,
        activeSessions,
        totalSessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get dashboard stats' });
  }
});

// Get all users
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search ? {
      OR: [
        { phone: { contains: search as string } },
        { email: { contains: search as string } },
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          sessions: {
            where: { status: 'ACTIVE' },
            take: 1
          },
          _count: {
            select: {
              sessions: true,
              payments: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
});

// Get all plans
router.get('/plans', async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            sessions: true,
            payments: true
          }
        }
      }
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get plans' });
  }
});

// Create plan
router.post('/plans', [
  body('name').notEmpty().withMessage('Plan name required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('duration').isInt({ min: 1 }).withMessage('Valid duration required'),
  body('dataLimit').notEmpty().withMessage('Data limit required'),
  body('speedLimit').notEmpty().withMessage('Speed limit required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, price, duration, dataLimit, speedLimit } = req.body;

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
        duration,
        dataLimit,
        speedLimit
      }
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create plan' });
  }
});

// Update plan
router.put('/plans/:id', [
  body('name').optional().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 1 })
], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = await prisma.plan.update({
      where: { id },
      data: updates
    });

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update plan' });
  }
});

// Delete plan
router.delete('/plans/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.plan.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Plan deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete plan' });
  }
});

// Get all sessions
router.get('/sessions', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = status ? { status: status as any } : {};

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { startTime: 'desc' },
        include: {
          user: {
            select: {
              phone: true,
              firstName: true,
              lastName: true
            }
          },
          plan: {
            select: {
              name: true,
              price: true
            }
          }
        }
      }),
      prisma.session.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get sessions' });
  }
});

// Terminate session
router.post('/sessions/:id/terminate', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await sessionService.terminateSession(id);

    res.json({ success: true, message: 'Session terminated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to terminate session' });
  }
});

// Get payments
router.get('/payments', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = status ? { status: status as any } : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              phone: true,
              firstName: true,
              lastName: true
            }
          },
          plan: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get payments' });
  }
});

// Get router status
router.get('/router/status', async (req: AuthRequest, res: Response) => {
  try {
    const activeUsers = await mikrotikService.getActiveUsers();
    
    res.json({
      success: true,
      data: {
        activeUsers: activeUsers.length,
        users: activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get router status' });
  }
});

export default router;