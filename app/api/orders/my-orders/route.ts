import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ buyerId: auth.id }, { sellerId: auth.id }],
      },
      include: {
        product: true,
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return json(orders);
  } catch (e) {
    console.error('orders/my-orders error:', e);
    return error('Failed to fetch orders', 500);
  }
}
