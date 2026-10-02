import { getAiService } from '@/lib/server/ai';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const language = await getAiService().detectLanguage(body?.text || '');
    return json({ language });
  } catch (e) {
    console.error('ai/detect-language error:', e);
    return error('Language detection failed', 500);
  }
}
