import helmet from 'helmet';
import cors from 'cors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { env } from '../config/env';

export function applySecurity(app: Express): void {
  // Helmet — sets secure HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
          connectSrc: ["'self'"],
          frameSrc: ['www.youtube.com'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Body parsing with strict size limits
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Cookie parser
  app.use(cookieParser());

  // Disable X-Powered-By
  app.disable('x-powered-by');
}
