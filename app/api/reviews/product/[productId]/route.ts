import { prisma } from '@/lib/server/prisma';
import { json, error } from '@/lib/server/http';

type Ctx = { params: Promise<{ productId: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { productId } = await context.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
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
    });

    return json(reviews);
  } catch (e) {
    console.error('reviews/product GET error:', e);
    return error('Failed to fetch reviews', 500);
  }
}
