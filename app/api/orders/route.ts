import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireUser } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    if (!dto?.productId) {
      return error("productId is required", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: dto.productId },
      select: {
        id: true,
        sellerId: true,
        price: true,
        isActive: true,
        title: true,
      },
    });

    if (!product || !product.isActive) {
      return error("Product not found", 404);
    }

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        buyerId: auth.id,
        sellerId: product.sellerId,
        price: product.price,
        paymentMethod: dto.paymentMethod,
        shippingAddress: dto.shippingAddress,
        escrowEnabled: dto.escrowEnabled !== false,
      },
      select: {
        id: true,
        productId: true,
        buyerId: true,
        sellerId: true,
        price: true,
        status: true,
        paymentMethod: true,
        escrowEnabled: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            images: true,
          },
        },
      },
    });

    return json(order);
  } catch (e) {
    console.error("orders POST error:", e);
    return error("Failed to create order", 500);
  }
}
