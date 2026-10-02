import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';
import { recalculateTrustScore } from '@/lib/server/trust-score';

async function updateVerification(
  userId: string,
  data: { cnicVerified?: boolean; videoVerified?: boolean },
) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      verificationStatus:
        data.cnicVerified && data.videoVerified ? 'VERIFIED' : 'PENDING',
    },
  });

  if (data.cnicVerified !== undefined || data.videoVerified !== undefined) {
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true },
    });
    for (const product of products) {
      recalculateTrustScore(prisma, product.id).catch((err) => {
        console.error('Error recalculating trust score after verification update:', err);
      });
    }
  }

  return updated;
}

/** Alias of /api/users/me/verify/video */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    if (!body?.videoUrl) {
      return error('videoUrl is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { cnicImage: true, cnicVerified: true },
    });

    if (!user) {
      return error('User not found', 404);
    }

    const verificationResult = await getAiService().verifyVideoWithFaceRecognition(
      body.videoUrl,
      user.cnicImage || undefined,
    );

    if (verificationResult.verified && verificationResult.confidence >= 0.7) {
      await updateVerification(auth.id, { videoVerified: true });
    } else {
      await prisma.user.update({
        where: { id: auth.id },
        data: { videoUrl: body.videoUrl },
      });
    }

    return json(verificationResult);
  } catch (e) {
    console.error('users/verify/video error:', e);
    return error('Video verification failed', 500);
  }
}
