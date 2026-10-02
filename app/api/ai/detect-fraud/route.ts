import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-fraud', 10, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const result = await getAiService().detectFraud(body?.product || {}, body?.seller || {});
    return json(result);
  } catch (e) {
    console.error('ai/detect-fraud error:', e);
    return error('Fraud detection failed', 500);
  }
}
