import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    if (!dto?.productId) {
      return error('productId is required', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      return error('Product not found', 404);
    }

    const order = await prisma.order.create({
      data: {
        ...dto,
        buyerId: auth.id,
        sellerId: product.sellerId,
        price: product.price,
      },
      include: {
        product: true,
        buyer: true,
      },
    });

    return json(order);
  } catch (e) {
    console.error('orders POST error:', e);
    return error('Failed to create order', 500);
  }
}
