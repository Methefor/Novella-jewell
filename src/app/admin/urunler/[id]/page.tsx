import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ProductForm, { type ProductFormInitial } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const { id } = await params;
  const [row] = dbYok
    ? []
    : await db
        .select()
        .from(catalogProducts)
        .where(eq(catalogProducts.id, id))
        .limit(1);
  const staticProduct = PRODUCTS.find((product) => product.id === id);
  const data = row?.data ?? staticProduct;
  if (!data) notFound();
  const variant = data.variants.find((item) => item.id === data.defaultVariant) ?? data.variants[0];
  const initialProduct: ProductFormInitial = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    story: data.story,
    category: data.category,
    collection: data.collection,
    material: data.material,
    color: variant?.color ?? 'altin',
    price: data.price,
    compareAtPrice: data.compareAtPrice,
    stock: variant?.stock ?? 0,
    images: data.images?.length ? data.images : (variant?.images ?? []),
    features: data.features,
    isNew: Boolean(data.isNew),
    isBestSeller: Boolean(data.isBestSeller),
    published: row?.published ?? !staticProduct?.hidden,
    createdAt: new Date(data.createdAt).toISOString(),
  };

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/urunler" className="text-sm text-neutral-600">
          ← Ürünlere dön
        </Link>
        <div className="mb-8 mt-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9e8e63]">
            Ürün düzenleme
          </p>
          <h1 className="mt-2 font-heading text-4xl">{data.name}</h1>
        </div>
        <ProductForm initialProduct={initialProduct} />
      </div>
    </main>
  );
}
