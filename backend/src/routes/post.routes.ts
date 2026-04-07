import { Router } from 'express';
import {
  getPostBySlug,
  getPopularPosts,
  getLatestPosts,
  getInternalSuggestions,
  createPost,
  updatePost,
  publishPost,
  getByCategory,
  getByAuthor,
  recordView,
} from '../controllers/post.controller';
import { authenticate, authorize } from '../middleware/auth';
import { writeLimiter, viewLimiter } from '../middleware/rateLimiter';
import { Role } from '@prisma/client';

const router = Router();

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/popular', getPopularPosts);
router.get('/latest', getLatestPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:id/internal-suggestions', getInternalSuggestions);
router.post('/:slug/view', viewLimiter, recordView);

// ── Category / Author ────────────────────────────────────────────────────────
router.get('/categories/:slug/posts', getByCategory);
router.get('/authors/:slug/posts', getByAuthor);

// ── Protected: WRITER+ ───────────────────────────────────────────────────────
router.post('/', authenticate, authorize(Role.WRITER), writeLimiter, createPost);
router.put('/:id', authenticate, authorize(Role.WRITER), writeLimiter, updatePost);

// ── Protected: EDITOR+ ───────────────────────────────────────────────────────
router.put('/:id/publish', authenticate, authorize(Role.EDITOR), writeLimiter, publishPost);

export default router;
