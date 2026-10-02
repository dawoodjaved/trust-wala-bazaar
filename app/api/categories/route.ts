import { prisma } from '@/lib/server/prisma';
import { json, error } from '@/lib/server/http';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
    return json(categories);
  } catch (e) {
    console.error('categories GET error:', e);
    return error('Failed to fetch categories', 500);
  }
}
