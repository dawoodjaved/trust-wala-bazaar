import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/jwt';
import { json } from '@/lib/server/http';

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;
  return json(auth);
}
