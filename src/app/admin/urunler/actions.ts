'use server';

import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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
    const product = PRODUCTS.find((item) => item.id === input.id);
    if (!product) throw new Error('Ürün bulunamadı.');
    await db.insert(catalogProducts).values({
      id: product.id,
      slug: product.slug,
      published,
      data: {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  revalidatePath('/admin');
  revalidatePath('/admin/urunler');
  revalidatePath(`/urun/${existing?.slug ?? PRODUCTS.find((item) => item.id === input.id)?.slug ?? ''}`);
}
