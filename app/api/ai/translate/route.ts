import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-translate', 20, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const translated = await getAiService().translate(body?.text || '', body?.targetLang || 'en');
    return json({ translated });
  } catch (e) {
    console.error('ai/translate error:', e);
    return error('Translation failed', 500);
  }
}
