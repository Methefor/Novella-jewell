import { getAdminAuth } from '@/lib/admin-auth';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumSizeInBytes = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const pathname = form.get('pathname');

    if (!(file instanceof File) || typeof pathname !== 'string') {
      return NextResponse.json(
        { error: 'Görsel veya dosya yolu eksik.' },
        { status: 400 }
      );
    }
    if (!pathname.startsWith('products/') || pathname.includes('..')) {
      return NextResponse.json({ error: 'Geçersiz dosya yolu.' }, { status: 400 });
    }
    if (!allowedContentTypes.has(file.type)) {
      return NextResponse.json(
        { error: 'Yalnızca JPEG, PNG veya WebP görselleri yüklenebilir.' },
        { status: 400 }
      );
    }
    if (file.size > maximumSizeInBytes) {
      return NextResponse.json(
        { error: 'Bir görsel en fazla 4 MB olabilir.' },
        { status: 400 }
      );
    }

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('[admin/products/upload]', error);
    return NextResponse.json(
      { error: 'Görsel depoya yüklenemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
