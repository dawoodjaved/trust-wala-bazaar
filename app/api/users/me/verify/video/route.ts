import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';
import { recalculateTrustScoresForSeller } from '@/lib/server/trust-score';

async function updateVerification(
  userId: string,
  data: { cnicVerified?: boolean; videoVerified?: boolean },
) {
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { cnicVerified: true, videoVerified: true },
  });

  const cnicVerified = data.cnicVerified ?? current?.cnicVerified ?? false;
  const videoVerified = data.videoVerified ?? current?.videoVerified ?? false;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      verificationStatus: cnicVerified && videoVerified ? 'VERIFIED' : 'PENDING',
    },
  });

  if (data.cnicVerified !== undefined || data.videoVerified !== undefined) {
    void recalculateTrustScoresForSeller(prisma, userId).catch((err) => {
      console.error('Error recalculating trust scores after verification update:', err);
    });
  }

  return updated;
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    if (!body?.videoUrl || typeof body.videoUrl !== 'string') {
      return error('videoUrl is required', 400);
    }

    // Block arbitrary remote URLs (SSRF / content abuse)
    try {
      const parsed = new URL(body.videoUrl);
      const origin = new URL(request.url).origin;
      if (parsed.origin !== origin || !parsed.pathname.startsWith('/uploads/videos/')) {
        return error('videoUrl must be an upload on this app', 400);
      }
    } catch {
      return error('Invalid videoUrl', 400);
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
    console.error('users/me/verify/video error:', e);
    return error('Video verification failed', 500);
  }
}
