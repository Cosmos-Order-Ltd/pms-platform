import { Router } from 'express';
import { signin, signup, forgotPassword } from '../controllers/authController';

const router = Router();

// POST /api/v1/auth/signin
router.post('/signin', signin);

// POST /api/v1/auth/signup
router.post('/signup', signup);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPassword);

export default router;