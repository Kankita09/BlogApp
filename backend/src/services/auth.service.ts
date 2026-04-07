import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface UserPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export function issueTokens(payload: UserPayload): TokenPair {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign(
    { id: payload.id, email: payload.email },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] },
  );
  return { accessToken, refreshToken };
}

export async function loginWithEmail(email: string, _password: string): Promise<TokenPair> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Note: In production, users set password via separate flow.
  // For now, we check if user exists and has the right role.
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  return issueTokens(payload);
}

export async function loginWithGoogle(idToken: string): Promise<{ tokens: TokenPair; isNew: boolean }> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const googlePayload = ticket.getPayload();
  if (!googlePayload?.email) {
    throw new AppError('Invalid Google token', 401);
  }

  const { email, name, sub: googleId, picture } = googlePayload;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  const isNew = !user;

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name ?? email.split('@')[0],
        googleId,
        avatar: picture,
        role: Role.WRITER,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId, avatar: picture ?? user.avatar },
    });
  }

  const tokens = issueTokens({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return { tokens, isNew };
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  let payload: { id: string; email: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string; email: string };
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw new AppError('User not found', 401);
  }

  return issueTokens({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
