import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    if (!body?.videoUrl || !body?.referenceImageUrl) {
      return error('videoUrl and referenceImageUrl are required', 400);
    }
    const result = await getAiService().compareFaces(body.videoUrl, body.referenceImageUrl);
    return json(result);
  } catch (e) {
    console.error('ai/compare-faces error:', e);
    return error('Face comparison failed', 500);
  }
}
