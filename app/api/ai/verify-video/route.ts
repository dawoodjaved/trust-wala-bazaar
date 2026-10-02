import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-vision', 5, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    if (!body?.videoUrl) {
      return error('videoUrl is required', 400);
    }
    const result = await getAiService().verifyVideoWithFaceRecognition(
      body.videoUrl,
      body.cnicImageUrl,
    );
    return json(result);
  } catch (e) {
    console.error('ai/verify-video error:', e);
    return error('Video verification failed', 500);
  }
}
