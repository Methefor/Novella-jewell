import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import {
  campaignItems,
  catalogProducts,
  contentCampaigns,
  type CampaignChannel,
} from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { getProductReadiness } from '@/lib/product-readiness';
import type { Product } from '@/types/product';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  action: z.enum(['approve-copy', 'queue', 'publish', 'unpublish']),
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  if (dbYok) return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz toplu işlem.' }, { status: 400 });
  const { action, ids } = parsed.data;

  // Eski statik katalog ürünleri ilk toplu işlemde veritabanına taşınır.
  // Böylece yayından kaldırma geri alınabilir olur; ürün verisi silinmez.
  const existingRows = await db
    .select({ id: catalogProducts.id })
    .from(catalogProducts)
    .where(inArray(catalogProducts.id, ids));
  const existingIds = new Set(existingRows.map((row) => row.id));
  const missingProducts = ids
    .filter((id) => !existingIds.has(id))
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  if (existingRows.length + missingProducts.length !== ids.length) {
    return NextResponse.json(
      { error: 'Ürünlerden biri bulunamadı.' },
      { status: 404 }
    );
  }
  if (missingProducts.length) {
    const now = new Date();
    await db.insert(catalogProducts).values(
      missingProducts.map((product) => ({
        id: product.id,
        slug: product.slug,
        published: !product.hidden,
        data: {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: now.toISOString(),
        },
        updatedAt: now,
      }))
    );
  }

  const rows = await db
    .select()
    .from(catalogProducts)
    .where(inArray(catalogProducts.id, ids));
  if (rows.length !== ids.length) return NextResponse.json({ error: 'Ürünlerden biri bulunamadı.' }, { status: 404 });

  if (action === 'approve-copy') {
    await db.transaction(async (tx) => {
      for (const row of rows) {
        await tx.update(catalogProducts).set({
          data: {
            ...row.data,
            adChecklist: {
              visualMatchApproved: row.data.adChecklist?.visualMatchApproved ?? false,
              copyApproved: true,
              priceStockApproved: row.data.adChecklist?.priceStockApproved ?? false,
              landingPageApproved: row.data.adChecklist?.landingPageApproved ?? false,
            },
            updatedAt: new Date().toISOString(),
          },
          updatedAt: new Date(),
        }).where(eq(catalogProducts.id, row.id));
      }
    });
  }

  if (action === 'publish') {
    const notReady = rows.filter((row) =>
      !getProductReadiness({
        ...row.data,
        createdAt: new Date(row.data.createdAt),
        updatedAt: new Date(row.data.updatedAt),
      } as Product).ready
    );
    if (notReady.length) {
      return NextResponse.json({
        error: `${notReady.length} ürünün görsel veya kalite kontrolleri tamamlanmadı.`,
      }, { status: 409 });
    }
    await db.update(catalogProducts).set({ published: true, updatedAt: new Date() }).where(inArray(catalogProducts.id, ids));
  }

  if (action === 'unpublish') {
    await db
      .update(catalogProducts)
      .set({ published: false, updatedAt: new Date() })
      .where(inArray(catalogProducts.id, ids));
  }

  let campaignId: string | undefined;
  if (action === 'queue') {
    const [existing] = await db.select().from(contentCampaigns)
      .where(eq(contentCampaigns.name, 'Yeni Ürün Reklam Hazırlığı')).limit(1);
    if (existing) campaignId = existing.id;
    else {
      const [created] = await db.insert(contentCampaigns).values({
        name: 'Yeni Ürün Reklam Hazırlığı',
        objective: 'Yeni katalog ürünlerinin Instagram ve Threads hazırlık kuyruğu',
      }).returning({ id: contentCampaigns.id });
      campaignId = created.id;
    }
    await db.insert(campaignItems).values(ids.map((productId) => ({
      campaignId: campaignId!,
      productId,
      channels: ['instagram-reels', 'instagram-carousel', 'instagram-story', 'threads'] as CampaignChannel[],
      stage: 'planned',
    }))).onConflictDoNothing();
  }

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: `product.bulk_${action}`,
    entityType: 'product',
    entityId: ids[0],
    summary: `${ids.length} ürüne ${action} işlemi uygulandı.`,
    metadata: { count: ids.length, campaignId: campaignId ?? null },
  });
  if (action === 'publish' || action === 'unpublish') {
    revalidatePath('/');
    revalidatePath('/urunler');
    revalidatePath('/koleksiyonlar');
    revalidatePath('/admin');
    revalidatePath('/admin/urunler');
    revalidatePath('/collections/[category]', 'page');
    rows.forEach((row) => revalidatePath(`/urun/${row.slug}`));
  }
  return NextResponse.json({ ok: true, count: ids.length, campaignId });
}
