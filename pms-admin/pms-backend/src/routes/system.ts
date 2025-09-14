import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'System health check',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Protected system routes
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'MANAGER']));

router.get('/logs', (req, res) => {
  res.json({ success: true, message: 'System logs endpoint - to be implemented' });
});

export default router;