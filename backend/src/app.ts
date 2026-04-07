import express from 'express';
import { applySecurity } from './middleware/security';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import searchRoutes from './routes/search.routes';
import utilityRoutes from './routes/utility.routes';

export function createApp(): express.Express {
  const app = express();

  // Security (Helmet, CORS, body limits, cookies)
  applySecurity(app);

  // Global rate limit
  app.use('/api', apiLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/', utilityRoutes);          // /sitemap.xml, /health, /metrics, /r/:slug

  // 404
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
