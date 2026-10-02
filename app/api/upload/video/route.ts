import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return error('file is required', 400);
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = file.name || 'video.webm';
    const ext = extname(originalName) || '.webm';
    const filename = `${randomUUID()}${ext}`;
    const dest = join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(dest, buffer);

    const url = `${request.nextUrl.origin}/uploads/videos/${filename}`;
    return json({ url });
  } catch (e) {
    console.error('upload/video error:', e);
    return error('Video upload failed', 500);
  }
}
