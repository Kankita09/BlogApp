import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    name: string;
  };
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: Role;
      name: string;
    };

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError('Invalid or expired token', 401));
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const roleHierarchy: Record<Role, number> = {
      ADMIN: 3,
      EDITOR: 2,
      WRITER: 1,
    };

    const userLevel = roleHierarchy[req.user.role];
    const requiredLevel = Math.min(...roles.map((r) => roleHierarchy[r]));

    if (userLevel < requiredLevel) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
}

// Utility: verify refresh token and return payload
export function verifyRefreshToken(token: string): { id: string; email: string } {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string };
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
}

// Optional auth — attaches user if token present, doesn't block if not
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return next();

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: Role;
      name: string;
    };

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) {
      req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    }
    next();
  } catch {
    next();
  }
}
