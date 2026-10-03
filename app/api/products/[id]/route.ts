import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireUser } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";
import { computeTrustScore, recalculateTrustScore } from "@/lib/server/trust-score";
import { productDetailSelect, productListSelect } from "@/lib/server/product-queries";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: productDetailSelect,
    });

    if (!product || !product.isActive) {
      return error("Product not found", 404);
    }

    // Fire-and-forget view increment — don't block the response
    void prisma.product
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => undefined);

    const { score, breakdown } = computeTrustScore(product);

    return json({
      ...product,
      trustScore: score,
      views: product.views + 1,
      trustBreakdown: breakdown,
    });
  } catch (e) {
    console.error("products/[id] GET error:", e);
    return error("Failed to fetch product", 500);
  }
}

export async function PUT(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const dto = await request.json();

    const result = await prisma.product.updateMany({
      where: { id, sellerId: auth.id },
      data: {
        ...(dto.title != null ? { title: dto.title } : {}),
        ...(dto.description != null ? { description: dto.description } : {}),
        ...(dto.price != null ? { price: Number(dto.price) } : {}),
        ...(dto.originalPrice != null ? { originalPrice: Number(dto.originalPrice) } : {}),
        ...(dto.condition != null ? { condition: dto.condition } : {}),
        ...(dto.city != null ? { city: dto.city } : {}),
        ...(dto.province != null ? { province: dto.province } : {}),
        ...(dto.images != null ? { images: dto.images } : {}),
        ...(dto.videos != null ? { videos: dto.videos } : {}),
        ...(dto.specifications != null ? { specifications: dto.specifications } : {}),
        ...(dto.isActive != null ? { isActive: Boolean(dto.isActive) } : {}),
      },
    });

    if (result.count === 0) {
      return error("Product not found or unauthorized", 404);
    }

    await recalculateTrustScore(prisma, id);

    const updated = await prisma.product.findUnique({
      where: { id },
      select: productListSelect,
    });

    return json(updated);
  } catch (e) {
    console.error("products/[id] PUT error:", e);
    return error("Failed to update product", 500);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;

    const result = await prisma.product.updateMany({
      where: { id, sellerId: auth.id },
      data: { isActive: false },
    });

    if (result.count === 0) {
      return error("Product not found or unauthorized", 404);
    }

    return json({ id, isActive: false });
  } catch (e) {
    console.error("products/[id] DELETE error:", e);
    return error("Failed to delete product", 500);
  }
}
