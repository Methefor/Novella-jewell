import { db, dbYok } from '@/db';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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
  const [slugOwner] = await db
    .select({ id: catalogProducts.id })
    .from(catalogProducts)
    .where(and(eq(catalogProducts.slug, input.slug), ne(catalogProducts.id, id)))
    .limit(1);
  if (slugOwner) {
    return NextResponse.json(
      { error: 'Bu bağlantı adı başka bir ürün tarafından kullanılıyor.' },
      { status: 409 }
    );
  }

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
    const [currentStock] = await db
      .select({ stock: inventory.stock })
      .from(inventory)
      .where(eq(inventory.productId, id))
      .limit(1);

    await db
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

    await db
      .insert(inventory)
      .values({ productId: id, variantId: 'v1', stock: input.stock })
      .onConflictDoUpdate({
        target: [inventory.productId, inventory.variantId],
        set: { stock: input.stock, updatedAt: new Date() },
      });

    const previousStock =
      currentStock?.stock ?? existing?.data.variants?.[0]?.stock ?? 0;
    if (previousStock !== input.stock) {
      await db.insert(stockMovements).values({
        productId: id,
        variantId: 'v1',
        delta: input.stock - previousStock,
        previousStock,
        newStock: input.stock,
        source: 'product_edit',
        reason: 'Ürün formundan stok güncellendi',
        createdBy: admin.email,
      });
    }
  } catch (error) {
    console.error('[admin/products/:id]', error);
    return NextResponse.json(
      { error: 'Ürün kaydedilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'product.update',
    entityType: 'product',
    entityId: id,
    summary: `${input.name} ürünü güncellendi.`,
    metadata: { stock: input.stock, price: input.price, published: input.published },
  });

  revalidatePath('/');
  revalidatePath('/urunler');
  revalidatePath('/admin');
  revalidatePath('/admin/urunler');
  revalidatePath(`/urun/${input.slug}`);
  return NextResponse.json({ ok: true, id, slug: input.slug });
}
