import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';
import { computeTrustScore, recalculateTrustScore } from '@/lib/server/trust-score';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            cnicVerified: true,
            videoVerified: true,
            verificationStatus: true,
          },
        },
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return error('Product not found', 404);
    }

    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const { score, breakdown } = computeTrustScore(product);
    product.trustScore = score;

    return json({
      ...product,
      trustBreakdown: breakdown,
    });
  } catch (e) {
    console.error('products/[id] GET error:', e);
    return error('Failed to fetch product', 500);
  }
}

export async function PUT(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const dto = await request.json();

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.sellerId !== auth.id) {
      return error('Product not found or unauthorized', 404);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: dto,
      include: {
        seller: {
          select: {
            id: true,
            cnicVerified: true,
            videoVerified: true,
          },
        },
        reviews: true,
      },
    });

    await recalculateTrustScore(prisma, id);

    return json(updated);
  } catch (e) {
    console.error('products/[id] PUT error:', e);
    return error('Failed to update product', 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.sellerId !== auth.id) {
      return error('Product not found or unauthorized', 404);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return json(updated);
  } catch (e) {
    console.error('products/[id] DELETE error:', e);
    return error('Failed to delete product', 500);
  }
}
