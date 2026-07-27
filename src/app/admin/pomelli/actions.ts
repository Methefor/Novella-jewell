'use server';

import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts, productMediaAssets } from '@/db/schema';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { getAdminAuth } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const reviewSchema = z.object({
  assetId: z.string().uuid(),
  kind: z.enum(['studio', 'model', 'lifestyle', 'campaign']),
  formApproved: z.boolean(),
  colorApproved: z.boolean(),
  detailApproved: z.boolean(),
  notes: z.string().trim().max(1000),
});

export async function reviewPomelliAsset(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');
  const input = reviewSchema.parse({
    assetId: formData.get('assetId'),
    kind: formData.get('kind'),
    formApproved: formData.get('formApproved') === 'on',
    colorApproved: formData.get('colorApproved') === 'on',
    detailApproved: formData.get('detailApproved') === 'on',
    notes: formData.get('notes'),
  });
  const approved =
    input.formApproved && input.colorApproved && input.detailApproved;
  const [asset] = await db
    .update(productMediaAssets)
    .set({
      ...input,
      status: approved ? 'approved' : 'review',
      updatedAt: new Date(),
    })
    .where(eq(productMediaAssets.id, input.assetId))
    .returning();
  if (asset) {
    await writeAdminAuditLog({
      actorId: admin.userId,
      actorEmail: admin.email,
      action: 'media.review',
      entityType: 'media_asset',
      entityId: asset.id,
      summary: approved
        ? 'Pomelli çekimi ürün uygunluğu için onaylandı.'
        : 'Pomelli çekimi incelemede bırakıldı.',
    });
  }
  revalidatePath('/admin/pomelli');
}

export async function addPomelliAssetToGallery(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');
  const assetId = z.string().uuid().parse(formData.get('assetId'));
  const [asset] = await db
    .select()
    .from(productMediaAssets)
    .where(eq(productMediaAssets.id, assetId))
    .limit(1);
  if (!asset || asset.status !== 'approved') {
    throw new Error('Yalnızca tüm ürün kontrolleri onaylanan görseller aktarılabilir.');
  }
  const [row] = await db
    .select()
    .from(catalogProducts)
    .where(eq(catalogProducts.id, asset.productId))
    .limit(1);
  const staticProduct = PRODUCTS.find((product) => product.id === asset.productId);
  if (!row && !staticProduct) throw new Error('Ürün bulunamadı.');
  const current = row?.data;
  const images = [...new Set([...(current?.images ?? staticProduct?.images ?? []), asset.url])];
  if (images.length > 8) throw new Error('Ürün galerisinde en fazla 8 görsel olabilir.');
  const now = new Date();
  if (row) {
    await db
      .update(catalogProducts)
      .set({
        data: { ...row.data, images, updatedAt: now.toISOString() },
        updatedAt: now,
      })
      .where(eq(catalogProducts.id, asset.productId));
  } else if (staticProduct) {
    await db.insert(catalogProducts).values({
      id: staticProduct.id,
      slug: staticProduct.slug,
      published: !staticProduct.hidden,
      data: {
        ...staticProduct,
        images,
        createdAt: staticProduct.createdAt.toISOString(),
        updatedAt: now.toISOString(),
      },
    });
  }
  await db
    .update(productMediaAssets)
    .set({ status: 'gallery', updatedAt: now })
    .where(eq(productMediaAssets.id, asset.id));
  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'media.gallery_add',
    entityType: 'product',
    entityId: asset.productId,
    summary: 'Onaylı Pomelli çekimi ürün galerisine eklendi.',
  });
  revalidatePath('/admin/pomelli');
  revalidatePath('/admin/urunler');
}
