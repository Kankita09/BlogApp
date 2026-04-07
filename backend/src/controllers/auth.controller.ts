import { Request, Response, NextFunction } from 'express';
import { loginSchema, googleAuthSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';
import { env } from '../config/env';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const tokens = await authService.loginWithEmail(email, password);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { idToken } = googleAuthSchema.parse(req.body);
    const { tokens, isNew } = await authService.loginWithGoogle(idToken);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
    res.status(isNew ? 201 : 200).json({ success: true, data: { accessToken: tokens.accessToken, isNew } });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies['refreshToken'] as string | undefined;
    if (!token) {
      res.status(401).json({ success: false, error: 'No refresh token provided' });
      return;
    }
    const tokens = await authService.refreshTokens(token);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('refreshToken', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict' });
  res.json({ success: true, message: 'Logged out' });
}
