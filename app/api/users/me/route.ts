import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireUser } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";
import { recalculateTrustScoresForSeller } from "@/lib/server/trust-score";

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        cnicVerified: true,
        cnicNumber: true,
        videoVerified: true,
        verificationStatus: true,
        city: true,
        province: true,
        rating: true,
        totalReviews: true,
        language: true,
        simpleMode: true,
        highContrast: true,
        fontSize: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            reviews: true,
          },
        },
      },
    });
    return json(user);
  } catch (e) {
    console.error("users/me GET error:", e);
    return error("Failed to fetch profile", 500);
  }
}

export async function PUT(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();

    // Only allow safe profile fields — never mass-assign
    const data: Record<string, unknown> = {};
    const allowed = [
      "phone",
      "firstName",
      "lastName",
      "avatar",
      "city",
      "province",
      "address",
      "latitude",
      "longitude",
      "language",
      "simpleMode",
      "highContrast",
      "fontSize",
      "cnicNumber",
      "cnicImage",
      "cnicVerified",
      "videoUrl",
      "videoVerified",
      "verificationStatus",
    ] as const;

    for (const key of allowed) {
      if (dto[key] !== undefined) data[key] = dto[key];
    }

    const updated = await prisma.user.update({
      where: { id: auth.id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cnicVerified: true,
        videoVerified: true,
        verificationStatus: true,
        city: true,
        avatar: true,
      },
    });

    if (dto.cnicVerified !== undefined || dto.videoVerified !== undefined) {
      // Batched recalculation — one findMany + parallel updates (no N+1 finds)
      void recalculateTrustScoresForSeller(prisma, auth.id).catch((err) => {
        console.error("Error recalculating trust scores after verification update:", err);
      });
    }

    return json(updated);
  } catch (e) {
    console.error("users/me PUT error:", e);
    return error("Failed to update profile", 500);
  }
}
