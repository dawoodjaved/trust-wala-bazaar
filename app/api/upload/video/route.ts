import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { validateVideoUpload } from '@/lib/server/upload';

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'upload-video', 10, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return error('file is required', 400);
    }

    const validated = await validateVideoUpload(file);
    if (!validated.ok) {
      return error(validated.message, 400);
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${randomUUID()}${validated.ext}`;
    writeFileSync(join(uploadDir, filename), validated.buffer);

    return json({ url: `${request.nextUrl.origin}/uploads/videos/${filename}` });
  } catch (e) {
    console.error('upload/video error:', e);
    return error('Video upload failed', 500);
  }
}
