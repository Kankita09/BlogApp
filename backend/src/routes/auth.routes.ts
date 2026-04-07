import { Router } from 'express';
import { login, googleLogin, refresh, logout } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);

export default router;
