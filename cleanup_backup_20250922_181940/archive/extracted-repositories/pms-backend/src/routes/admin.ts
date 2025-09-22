import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'OWNER', 'MANAGER']));

router.get('/users', (req, res) => {
  res.json({ success: true, message: 'Admin users endpoint - to be implemented' });
});

router.get('/properties', (req, res) => {
  res.json({ success: true, message: 'Admin properties endpoint - to be implemented' });
});

router.get('/audit', (req, res) => {
  res.json({ success: true, message: 'Admin audit endpoint - to be implemented' });
});

export default router;