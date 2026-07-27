import { db, dbYok } from '@/db';
import { productMediaAssets } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  productId: z.string().min(1).max(180),
  urls: z.array(z.string().url()).min(1).max(12),
});

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }
  if (dbYok) {
    return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz görsel bilgisi.' }, { status: 400 });
  }
  await db.insert(productMediaAssets).values(
    parsed.data.urls.map((url) => ({
      productId: parsed.data.productId,
      url,
      createdBy: admin.email,
    }))
  );
  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'media.pomelli_import',
    entityType: 'product',
    entityId: parsed.data.productId,
    summary: `${parsed.data.urls.length} Pomelli çekimi incelemeye alındı.`,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
