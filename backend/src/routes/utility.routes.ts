import { Router } from 'express';
import { getSitemap, getHealth, getMetrics, affiliateRedirect } from '../controllers/utility.controller';
import { authenticate, authorize } from '../middleware/auth';
import { affiliateLimiter } from '../middleware/rateLimiter';
import { Role } from '@prisma/client';

const router = Router();

router.get('/sitemap.xml', getSitemap);
router.get('/health', getHealth);
router.get('/metrics', authenticate, authorize(Role.ADMIN), getMetrics);
router.get('/r/:slug', affiliateLimiter, affiliateRedirect);

export default router;
