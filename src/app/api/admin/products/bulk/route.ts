import { db, dbYok } from '@/db';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { getAdminAuth } from '@/lib/admin-auth';
import { NOVELLA_CORE_FEATURES } from '@/lib/product-template';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(10).max(2000),
  price: z.number().positive().max(100000),
  stock: z.number().int().min(0).max(100000),
  color: z.enum(['altin', 'gumus', 'rose-gold', 'siyah', 'beyaz', 'cok-renkli']),
});

const bulkSchema = z.object({
  category: z.enum(['bilezik', 'kupe', 'yuzuk']),
  collection: z.enum(['barcelona', 'stockholm', 'paris', 'klasikler']),
  material: z.enum(['celik', 'gumus-kaplama', 'altin-kaplama', 'rose-gold-kaplama']),
  features: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
  items: z.array(itemSchema).min(1).max(50),
});

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }
  if (dbYok) {
    return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  }

  const parsed = bulkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Toplu ürün bilgileri eksik veya geçersiz.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const slugs = input.items.map((item) => item.slug);
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json(
      { error: 'Aynı bağlantı adına sahip birden fazla satır var.' },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const records = input.items.map((item) => {
    const id = `product-${crypto.randomUUID()}`;
    const features = [...new Set([...NOVELLA_CORE_FEATURES, ...input.features])];
    return {
      id,
      slug: item.slug,
      stock: item.stock,
      data: {
        id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        collection: input.collection,
        story: item.description,
        category: input.category,
        price: item.price,
        variants: [{
          id: 'v1',
          color: item.color,
          material: input.material,
          stock: item.stock,
          images: [],
        }],
        defaultVariant: 'v1',
        images: [],
        features,
        material: input.material,
        isNew: true,
        isBestSeller: false,
        isCustomizable: false,
        adChecklist: {
          visualMatchApproved: false,
          copyApproved: false,
          priceStockApproved: false,
          landingPageApproved: false,
        },
        createdAt: now,
        updatedAt: now,
      },
    };
  });

  try {
    await db.insert(catalogProducts).values(
        records.map(({ id, slug, data }) => ({
          id,
          slug,
          data,
          published: false,
        }))
      );
    await db.insert(inventory).values(
        records.map(({ id, stock }) => ({
          productId: id,
          variantId: 'v1',
          stock,
        }))
      );
    await db.insert(stockMovements).values(
        records.map(({ id, stock }) => ({
          productId: id,
          variantId: 'v1',
          delta: stock,
          previousStock: 0,
          newStock: stock,
          source: 'product_bulk_create',
          reason: 'Toplu ürün merkezinden başlangıç stoğu',
          createdBy: admin.email,
        }))
    );
  } catch (error) {
    console.error('[admin/products/bulk]', error);
    return NextResponse.json(
      { error: 'Bağlantı adlarından biri kullanılıyor veya ürünler kaydedilemedi.' },
      { status: 409 }
    );
  }

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'product.bulk_create',
    entityType: 'product',
    entityId: records[0].id,
    summary: `${records.length} ürün toplu olarak taslak oluşturuldu.`,
    metadata: {
      count: records.length,
      category: input.category,
      collection: input.collection,
      productIds: records.map(({ id }) => id).join(','),
    },
  });

  return NextResponse.json(
    { ok: true, count: records.length, ids: records.map(({ id }) => id) },
    { status: 201 }
  );
}
