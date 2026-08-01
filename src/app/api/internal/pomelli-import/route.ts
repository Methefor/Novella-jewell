import { createHash, timingSafeEqual } from 'node:crypto';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumSizeInBytes = 4 * 1024 * 1024;

function importKey() {
  if (!process.env.DATABASE_URL) return null;
  return createHash('sha256')
    .update(`${process.env.DATABASE_URL}:pomelli-import-v1`)
    .digest('hex');
}

export async function POST(request: Request) {
  const expected = importKey();
  const supplied = request.headers.get('x-import-key');
  if (!expected || !supplied) {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }

  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  if (
    expectedBytes.length !== suppliedBytes.length ||
    !timingSafeEqual(expectedBytes, suppliedBytes)
  ) {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  const pathname = form.get('pathname');
  if (!(file instanceof File) || typeof pathname !== 'string') {
    return NextResponse.json({ error: 'Görsel veya dosya yolu eksik.' }, { status: 400 });
  }
  if (!pathname.startsWith('products/') || pathname.includes('..')) {
    return NextResponse.json({ error: 'Geçersiz dosya yolu.' }, { status: 400 });
  }
  if (!allowedContentTypes.has(file.type) || file.size > maximumSizeInBytes) {
    return NextResponse.json({ error: 'Geçersiz görsel.' }, { status: 400 });
  }

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
    contentType: file.type,
  });
  return NextResponse.json({ url: blob.url });
}
