import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getAiService } from "@/lib/server/ai";
import { requireUser } from "@/lib/server/jwt";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { json, error } from "@/lib/server/http";
import { recalculateTrustScoresForSeller } from "@/lib/server/trust-score";

/** Server-owned CNIC verification — clients cannot set cnicVerified themselves. */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "ai-cnic-verify", 5, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const imageUrl = body?.imageUrl;
    if (!imageUrl || typeof imageUrl !== "string") {
      return error("imageUrl is required", 400);
    }

    // Only accept same-origin upload paths (blocks arbitrary URL / SSRF-style abuse)
    let parsed: URL;
    try {
      parsed = new URL(imageUrl);
    } catch {
      return error("Invalid imageUrl", 400);
    }
    const origin = new URL(request.url).origin;
    if (parsed.origin !== origin || !parsed.pathname.startsWith("/uploads/images/")) {
      return error("imageUrl must be an upload on this app", 400);
    }

    const extracted = await getAiService().extractCNICData(imageUrl);
    const verified = Boolean(extracted?.valid);

    await prisma.user.update({
      where: { id: auth.id },
      data: {
        cnicImage: imageUrl,
        cnicNumber: extracted?.cnicNumber || null,
        cnicVerified: verified,
        verificationStatus:
          verified && auth.videoVerified ? "VERIFIED" : "PENDING",
      },
    });

    if (verified) {
      void recalculateTrustScoresForSeller(prisma, auth.id).catch((err) => {
        console.error("Error recalculating trust scores after CNIC verify:", err);
      });
    }

    return json({
      verified,
      cnicNumber: extracted?.cnicNumber || null,
      name: extracted?.name || null,
      dob: extracted?.dob || null,
    });
  } catch (e) {
    console.error("users/me/verify/cnic error:", e);
    return error("CNIC verification failed", 500);
  }
}
