import { NextResponse } from 'next/server';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

/** Authenticated OCR helper. Prefer /api/users/me/verify/cnic to set trust flags. */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    if (!body?.imageUrl || typeof body.imageUrl !== 'string') {
      return error('imageUrl is required', 400);
    }

    try {
      const parsed = new URL(body.imageUrl);
      const origin = new URL(request.url).origin;
      if (parsed.origin !== origin || !parsed.pathname.startsWith('/uploads/images/')) {
        return error('imageUrl must be an upload on this app', 400);
      }
    } catch {
      return error('Invalid imageUrl', 400);
    }

    const data = await getAiService().extractCNICData(body.imageUrl);
    return json(data);
  } catch (e) {
    console.error('ai/cnic-extract error:', e);
    return error('CNIC extraction failed', 500);
  }
}
