import { getAdminAuth } from '@/lib/admin-auth';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  const result = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith('products/')) throw new Error('Geçersiz dosya yolu.');
      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      };
    },
    onUploadCompleted: async () => {},
  });

  return NextResponse.json(result);
}
