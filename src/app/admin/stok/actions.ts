'use server';

import { db, dbYok } from '@/db';
import { PRODUCTS } from '@/data/products';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function adjustStock(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');

  const input = z
    .object({
      productId: z.string().min(1),
      variantId: z.string().min(1),
      currentStock: z.coerce.number().int().min(0).max(100000),
      newStock: z.coerce.number().int().min(0).max(100000),
      lowStockThreshold: z.coerce.number().int().min(0).max(1000),
      reason: z.string().trim().min(3).max(500),
    })
    .parse({
      productId: formData.get('productId'),
      variantId: formData.get('variantId'),
      currentStock: formData.get('currentStock'),
      newStock: formData.get('newStock'),
      lowStockThreshold: formData.get('lowStockThreshold'),
      reason: formData.get('reason'),
    });

  await db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.productId, input.productId),
          eq(inventory.variantId, input.variantId)
        )
      )
      .limit(1);
    const previousStock = current?.stock ?? input.currentStock;
    if (current && previousStock !== input.currentStock) {
      throw new Error('Stok başka bir işlemle değişti. Sayfayı yenileyip tekrar deneyin.');
    }

    await tx
      .insert(inventory)
      .values({
        productId: input.productId,
        variantId: input.variantId,
        stock: input.newStock,
        lowStockThreshold: input.lowStockThreshold,
      })
      .onConflictDoUpdate({
        target: [inventory.productId, inventory.variantId],
        set: {
          stock: input.newStock,
          lowStockThreshold: input.lowStockThreshold,
          updatedAt: new Date(),
        },
      });

    const [catalogRow] = await tx
      .select()
      .from(catalogProducts)
      .where(eq(catalogProducts.id, input.productId))
      .limit(1);
    if (catalogRow) {
      const now = new Date().toISOString();
      await tx
        .update(catalogProducts)
        .set({
          data: {
            ...catalogRow.data,
            variants: catalogRow.data.variants.map((variant) =>
              variant.id === input.variantId
                ? { ...variant, stock: input.newStock }
                : variant
            ),
            updatedAt: now,
          },
          updatedAt: new Date(now),
        })
        .where(eq(catalogProducts.id, input.productId));
    } else {
      const staticProduct = PRODUCTS.find(
        (product) => product.id === input.productId
      );
      if (!staticProduct) throw new Error('Ürün kataloğu bulunamadı.');
      await tx.insert(catalogProducts).values({
        id: staticProduct.id,
        slug: staticProduct.slug,
        published: !staticProduct.hidden,
        data: {
          ...staticProduct,
          variants: staticProduct.variants.map((variant) =>
            variant.id === input.variantId
              ? { ...variant, stock: input.newStock }
              : variant
          ),
          createdAt: staticProduct.createdAt.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    if (previousStock !== input.newStock) {
      await tx.insert(stockMovements).values({
        productId: input.productId,
        variantId: input.variantId,
        delta: input.newStock - previousStock,
        previousStock,
        newStock: input.newStock,
        source: 'manual',
        reason: input.reason,
        createdBy: admin.email,
      });
    }
  });

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'stock.adjust',
    entityType: 'inventory',
    entityId: `${input.productId}:${input.variantId}`,
    summary: `Stok ${input.currentStock} → ${input.newStock} olarak güncellendi.`,
    metadata: {
      previousStock: input.currentStock,
      newStock: input.newStock,
      threshold: input.lowStockThreshold,
      reason: input.reason,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/stok');
  revalidatePath('/admin/urunler');
}
