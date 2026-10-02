import { NextResponse } from 'next/server';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

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
    const result = await getAiService().detectLiveness(body.videoUrl);
    return json(result);
  } catch (e) {
    console.error('users/me/verify/liveness error:', e);
    return error('Liveness check failed', 500);
  }
}
