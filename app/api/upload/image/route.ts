import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { validateImageUpload } from '@/lib/server/upload';

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'upload-image', 20, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return error('file is required', 400);
    }

    const validated = await validateImageUpload(file);
    if (!validated.ok) {
      return error(validated.message, 400);
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${randomUUID()}${validated.ext}`;
    writeFileSync(join(uploadDir, filename), validated.buffer);

    return json({ url: `${request.nextUrl.origin}/uploads/images/${filename}` });
  } catch (e) {
    console.error('upload/image error:', e);
    return error('Image upload failed', 500);
  }
}
