import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import type { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { error } from './http';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  clerkId: string;
};

export function signAccessToken(user: Pick<User, 'id' | 'email' | 'clerkId'>): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    clerkId: user.clerkId,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export async function getUserFromRequest(request: Request): Promise<User | null> {
  const token = extractBearerToken(request);
  if (!token) return null;

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(request: Request): Promise<User | NextResponse> {
  const user = await getUserFromRequest(request);
  if (!user) {
    return error('Unauthorized', 401);
  }
  return user;
}
