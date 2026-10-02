import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';
import { recalculateTrustScore } from '@/lib/server/trust-score';

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      include: {
        products: true,
        reviews: true,
      },
    });
    return json(user);
  } catch (e) {
    console.error('users/me GET error:', e);
    return error('Failed to fetch profile', 500);
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    const updated = await prisma.user.update({
      where: { id: auth.id },
      data: dto,
    });

    if (dto.cnicVerified !== undefined || dto.videoVerified !== undefined) {
      const products = await prisma.product.findMany({
        where: { sellerId: auth.id },
        select: { id: true },
      });
      for (const product of products) {
        recalculateTrustScore(prisma, product.id).catch((err) => {
          console.error('Error recalculating trust score after verification update:', err);
        });
      }
    }

    return json(updated);
  } catch (e) {
    console.error('users/me PUT error:', e);
    return error('Failed to update profile', 500);
  }
}
