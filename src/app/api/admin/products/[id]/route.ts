import { db, dbYok } from '@/db';
import { catalogProducts, inventory } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { productSchema } from '../route';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 401 });
  }
  if (dbYok) {
    return NextResponse.json(
      { error: 'Veritabanı bağlantısı yok.' },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ürün bilgileri eksik veya geçersiz.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const [existing] = await db
    .select()
    .from(catalogProducts)
    .where(eq(catalogProducts.id, id))
    .limit(1);
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
    createdAt: existing?.data.createdAt ?? body.createdAt ?? now,
    updatedAt: now,
  };

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(catalogProducts)
        .values({
          id,
          slug: input.slug,
          data: product,
          published: input.published,
        })
        .onConflictDoUpdate({
          target: catalogProducts.id,
          set: {
            slug: input.slug,
            data: product,
            published: input.published,
            updatedAt: new Date(),
          },
        });
      await tx
        .insert(inventory)
        .values({ productId: id, variantId: 'v1', stock: input.stock })
        .onConflictDoUpdate({
          target: [inventory.productId, inventory.variantId],
          set: { stock: input.stock, updatedAt: new Date() },
        });
    });
  } catch (error) {
    console.error('[admin/products/:id]', error);
    return NextResponse.json(
      { error: 'Bağlantı adı kullanılıyor veya ürün güncellenemedi.' },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, id, slug: input.slug });
}
