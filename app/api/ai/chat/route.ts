import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-chat', 12, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const response = await getAiService().chat(body?.message || '', body?.context);
    return json({ response });
  } catch (e) {
    console.error('ai/chat error:', e);
    return error('Chat failed', 500);
  }
}
