import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DuplicateScanner, { type ScanProduct } from './DuplicateScanner';

export const dynamic = 'force-dynamic';

export default async function DuplicateProductsPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const rows = dbYok ? [] : await db.select().from(catalogProducts);
  const dynamicIds = new Set(rows.map((row) => row.id));
  const products: ScanProduct[] = [
    ...rows.map((row) => ({
      id: row.id,
      name: row.data.name,
      slug: row.slug,
      category: row.data.category,
      price: row.data.price,
      stock: row.data.variants.reduce((sum, variant) => sum + variant.stock, 0),
      published: row.published,
      deleted: Boolean(row.data.deletedAt),
      images: (row.data.images?.length ? row.data.images : row.data.variants.flatMap((variant) => variant.images)).filter(Boolean).slice(0, 2),
    })),
    ...PRODUCTS.filter((product) => !dynamicIds.has(product.id)).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
      published: !product.hidden,
      deleted: Boolean(product.deletedAt),
      images: (product.images?.length ? product.images : product.variants.flatMap((variant) => variant.images)).filter(Boolean).slice(0, 2),
    })),
  ].filter((product) => !product.deleted && product.images.length > 0);

  return <main className="min-h-screen bg-[#f4efe7] px-4 py-10 sm:px-8"><div className="mx-auto max-w-7xl"><header className="flex flex-wrap items-end justify-between gap-5"><div><Link href="/admin/urunler" className="text-sm text-neutral-600">← Ürün yönetimi</Link><p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#947d4e]">Katalog kalite kontrolü</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">Mükerrer Ürün Kontrolü</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">Ana görselleri ve ürün adlarını birlikte karşılaştırın. Sonuçlar yalnızca aday eşleşmelerdir; ürünler otomatik değiştirilmez.</p></div><Link href="/admin/urunler/yeni" className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">Yeni ürün ekle</Link></header><DuplicateScanner products={products} /></div></main>;
}
