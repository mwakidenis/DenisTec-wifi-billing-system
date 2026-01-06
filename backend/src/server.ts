import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

import authRoutes from './routes/auth';
import planRoutes from './routes/plans';
import paymentRoutes from './routes/payments';
import sessionRoutes from './routes/sessions';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';

import { errorHandler } from './middleware/errorHandler';
import { sessionCleanup } from './services/sessionService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  skip: (req) => {
    // Skip rate limiting for auth endpoints in development
    return process.env.NODE_ENV === 'development' && req.path.includes('/auth/');
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Cron jobs
cron.schedule('*/5 * * * *', () => {
  sessionCleanup();
});

app.listen(PORT, () => {
  console.log(`🚀 COLLOSPOT Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});

export default app;