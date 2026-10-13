import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireUser } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";

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

    // Privilege escalation fix: verification flags are server-only
    // (see /api/users/me/verify/cnic and /verify/video).
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

    return json(updated);
  } catch (e) {
    console.error("users/me PUT error:", e);
    return error("Failed to update profile", 500);
  }
}
