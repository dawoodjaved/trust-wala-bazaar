import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
        reviews: true,
      },
    });

    if (!user) {
      return error('User not found', 404);
    }

    return json(user);
  } catch (e) {
    console.error('users/[id] GET error:', e);
    return error('Failed to fetch user', 500);
  }
}
