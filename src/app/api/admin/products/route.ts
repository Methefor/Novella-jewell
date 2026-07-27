import { db, dbYok } from '@/db';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(10).max(2000),
  story: z.string().trim().max(500).default(''),
  category: z.enum(['bilezik', 'kupe', 'yuzuk']),
  collection: z.enum(['barcelona', 'stockholm', 'paris', 'klasikler']),
  material: z.enum(['celik', 'gumus-kaplama', 'altin-kaplama', 'rose-gold-kaplama']),
  color: z.enum(['altin', 'gumus', 'rose-gold', 'siyah', 'beyaz', 'cok-renkli']),
  price: z.number().positive().max(100000),
  compareAtPrice: z.number().positive().max(100000).nullable(),
  stock: z.number().int().min(0).max(100000),
  images: z
    .array(
      z.string().refine(
        (value) => value.startsWith('/') || URL.canParse(value),
        'Geçersiz görsel adresi'
      )
    )
    .min(1)
    .max(8),
  features: z.array(z.string().trim().min(1).max(80)).max(12),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  published: z.boolean().default(true),
  adChecklist: z.object({
    visualMatchApproved: z.boolean(),
    copyApproved: z.boolean(),
    priceStockApproved: z.boolean(),
    landingPageApproved: z.boolean(),
  }),
});

export async function POST(request: Request) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }
  if (dbYok) {
    return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  }

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ürün bilgileri eksik veya geçersiz.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const id = `product-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const product = {
    id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    collection: input.collection,
    story: input.story || input.description,
    category: input.category,
    price: input.price,
    ...(input.compareAtPrice ? { compareAtPrice: input.compareAtPrice } : {}),
    variants: [{
      id: 'v1',
      color: input.color,
      material: input.material,
      stock: input.stock,
      images: input.images,
    }],
    defaultVariant: 'v1',
    images: input.images,
    features: input.features,
    material: input.material,
    isNew: input.isNew,
    isBestSeller: input.isBestSeller,
    isCustomizable: false,
    adChecklist: input.adChecklist,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(catalogProducts).values({
        id,
        slug: input.slug,
        data: product,
        published: input.published,
      });
      await tx.insert(inventory).values({
        productId: id,
        variantId: 'v1',
        stock: input.stock,
      });
      await tx.insert(stockMovements).values({
        productId: id,
        variantId: 'v1',
        delta: input.stock,
        previousStock: 0,
        newStock: input.stock,
        source: 'product_create',
        reason: 'Ürün oluşturulurken başlangıç stoğu',
        createdBy: admin.email,
      });
    });
  } catch (error) {
    console.error('[admin/products]', error);
    return NextResponse.json(
      { error: 'Bu bağlantı adı kullanılıyor veya ürün kaydedilemedi.' },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, id, slug: input.slug }, { status: 201 });
}
