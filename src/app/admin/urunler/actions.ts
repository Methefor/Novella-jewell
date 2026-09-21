'use server';

import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { revalidateCatalog } from '@/lib/catalog-revalidation';
import { z } from 'zod';

export async function setProductPublished(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');

  const input = z.object({
    id: z.string().min(1),
    published: z.enum(['true', 'false']),
  }).parse({
    id: formData.get('id'),
    published: formData.get('published'),
  });
  const published = input.published === 'true';
  const [existing] = await db
    .select()
    .from(catalogProducts)
    .where(eq(catalogProducts.id, input.id))
    .limit(1);

  if (existing) {
    await db
      .update(catalogProducts)
      .set({ published, updatedAt: new Date() })
      .where(eq(catalogProducts.id, input.id));
  } else {
    // Katalog tek kaynağı DB'dir (ADR-013); eksik kayıt statik veriden üretilmez.
    throw new Error('Ürün bulunamadı.');
  }

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: published ? 'product.publish' : 'product.unpublish',
    entityType: 'product',
    entityId: input.id,
    summary: published ? 'Ürün yayına alındı.' : 'Ürün yayından kaldırıldı.',
  });

  revalidateCatalog();
  revalidatePath('/admin');
  revalidatePath('/admin/urunler');
  revalidatePath(`/urun/${existing.slug}`);
}
