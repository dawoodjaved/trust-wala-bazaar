import { prisma } from '@/lib/server/prisma';
import { signAccessToken } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName } = body || {};

    if (!clerkId || !email) {
      return error('clerkId and email are required', 400);
    }

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || email.split('@')[0],
          lastName: lastName || '',
        },
      });
    } else if (firstName || lastName || email !== user.email) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
        },
      });
    }

    return json({
      access_token: signAccessToken(user),
      user,
    });
  } catch (e) {
    console.error('auth/verify error:', e);
    return error('Failed to verify user', 500);
  }
}
