import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const createLimiter = (max: number, windowMs?: number, message?: string) =>
  rateLimit({
    windowMs: windowMs ?? env.RATE_LIMIT_WINDOW_MS,
    max,
    message: { success: false, error: message ?? 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

// General API rate limit
export const apiLimiter = createLimiter(env.RATE_LIMIT_MAX);

// Stricter limit for auth endpoints
export const authLimiter = createLimiter(
  env.AUTH_RATE_LIMIT_MAX,
  15 * 60 * 1000, // 15 min
  'Too many authentication attempts. Please try again in 15 minutes.',
);

// Publish/write operations
export const writeLimiter = createLimiter(30, 60 * 1000, 'Too many write requests.');

// Search endpoints
export const searchLimiter = createLimiter(60, 60 * 1000, 'Too many search requests.');

// View tracking — very permissive
export const viewLimiter = createLimiter(300, 60 * 1000);

// Affiliate redirects
export const affiliateLimiter = createLimiter(200, 60 * 1000);
