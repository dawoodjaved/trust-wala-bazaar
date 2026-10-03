import { prisma } from "@/lib/server/prisma";
import { signAccessToken } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName } = body || {};

    if (!clerkId || !email) {
      return error("clerkId and email are required", 400);
    }

    // Single upsert instead of find + create/update
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        email,
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "",
      },
      update: {
        email,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        cnicVerified: true,
        videoVerified: true,
        role: true,
      },
    });

    return json({
      access_token: signAccessToken(user),
      user,
    });
  } catch (e) {
    console.error("auth/verify error:", e);
    return error("Failed to verify user", 500);
  }
}
