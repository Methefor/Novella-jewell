import { db, dbYok } from '@/db';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { NOVELLA_CORE_FEATURES } from '@/lib/product-template';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(10).max(2000),
  detail: z.string().trim().min(3).max(500),
  collection: z.enum(['barcelona', 'stockholm', 'paris', 'klasikler']),
  color: z.enum(['altin', 'gumus', 'rose-gold', 'siyah', 'beyaz', 'cok-renkli']),
  images: z.array(z.url()).min(3).max(4),
});

const schema = z.object({ items: z.array(itemSchema).min(1).max(50) });

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  if (dbYok) return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Hazırlanan ürün verileri geçersiz.', details: parsed.error.flatten() }, { status: 400 });
  }
  const { items } = parsed.data;
  const slugs = items.map((item) => item.slug);
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json({ error: 'Tekrarlanan bağlantı adı var.' }, { status: 400 });
  }
  const existing = await db.select({ slug: catalogProducts.slug }).from(catalogProducts).where(inArray(catalogProducts.slug, slugs));
  if (existing.length) {
    return NextResponse.json({ error: `Kullanılan bağlantı adları: ${existing.map((row) => row.slug).join(', ')}` }, { status: 409 });
  }

  const now = new Date().toISOString();
  const records = items.map((item) => {
    const id = `product-${crypto.randomUUID()}`;
    return {
      id,
      slug: item.slug,
      data: {
        id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        story: item.detail,
        collection: item.collection,
        category: 'kupe' as const,
        price: 0,
        variants: [{ id: 'v1', color: item.color, material: 'celik' as const, stock: 0, images: item.images }],
        defaultVariant: 'v1',
        images: item.images,
        features: [...NOVELLA_CORE_FEATURES],
        material: 'celik' as const,
        isNew: true,
        isBestSeller: false,
        isCustomizable: false,
        adChecklist: {
          visualMatchApproved: item.images.length === 4,
          copyApproved: true,
          priceStockApproved: false,
          landingPageApproved: false,
        },
        createdAt: now,
        updatedAt: now,
      },
    };
  });

  // neon-http sürücüsü etkileşimli transaction callback'ini desteklemez.
  // Her tabloya tek bir toplu sorgu göndererek serverless zaman aşımını önlüyoruz.
  await db.insert(catalogProducts).values(records.map((record) => ({ ...record, published: false })));
  await db.insert(inventory).values(records.map((record) => ({ productId: record.id, variantId: 'v1', stock: 0 })));
  await db.insert(stockMovements).values(records.map((record) => ({
      productId: record.id,
      variantId: 'v1',
      delta: 0,
      previousStock: 0,
      newStock: 0,
      source: 'prepared_earrings_import',
      reason: 'Fiyat ve stok onayı bekleyen küpe taslağı',
      createdBy: admin.email,
    })));

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'product.prepared_batch_create',
    entityType: 'product',
    entityId: records[0].id,
    summary: `${records.length} hazırlanmış küpe taslağı oluşturuldu.`,
    metadata: { count: records.length, imageCount: items.reduce((sum, item) => sum + item.images.length, 0) },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/urunler');
  return NextResponse.json({ ok: true, count: records.length, ids: records.map((record) => record.id) }, { status: 201 });
}
