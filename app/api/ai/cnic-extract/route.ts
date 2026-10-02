import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    if (!body?.imageUrl) {
      return error('imageUrl is required', 400);
    }
    const data = await getAiService().extractCNICData(body.imageUrl);
    return json(data);
  } catch (e) {
    console.error('ai/cnic-extract error:', e);
    return error('CNIC extraction failed', 500);
  }
}
