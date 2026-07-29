import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { getProductReadiness } from '@/lib/product-readiness';
import type { Product } from '@/types/product';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProductBulkManager } from './ProductBulkManager';

export const dynamic = 'force-dynamic';

type ProductFilter =
  | 'all'
  | 'published'
  | 'trash'
  | 'missing-visuals'
  | 'draft'
  | 'out-of-stock'
  | 'ready';

export default async function ProductsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const query = (params.q ?? '').trim().toLocaleLowerCase('tr-TR');
  const filter: ProductFilter = [
    'published',
    'trash',
    'missing-visuals',
    'draft',
    'out-of-stock',
    'ready',
  ].includes(params.filter ?? '')
    ? (params.filter as ProductFilter)
    : 'all';
  const rows = dbYok
    ? []
    : await db
        .select()
        .from(catalogProducts)
        .orderBy(desc(catalogProducts.updatedAt));
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const dynamicProducts: Product[] = rows.map((row) => ({
    ...row.data,
    createdAt: new Date(row.data.createdAt),
    updatedAt: new Date(row.data.updatedAt),
  }));
  const products = [
    ...dynamicProducts,
    ...PRODUCTS.filter((product) => !rowById.has(product.id)),
  ];
  const activeProducts = products.filter((product) => !product.deletedAt);
  const readyCount = activeProducts.filter((product) => getProductReadiness(product).ready).length;
  const publishedCount = activeProducts.filter((product) => {
    const row = rowById.get(product.id);
    return row ? row.published : !product.hidden;
  }).length;
  const productStates = products.map((product) => {
    const row = rowById.get(product.id);
    const published = row ? row.published : !product.hidden;
    const readiness = getProductReadiness(product);
    const stock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
    return { product, published, readiness, stock, deleted: Boolean(product.deletedAt) };
  });
  const filterCounts: Record<ProductFilter, number> = {
    all: productStates.filter(({ deleted }) => !deleted).length,
    published: productStates.filter(({ published, deleted }) => published && !deleted).length,
    trash: productStates.filter(({ deleted }) => deleted).length,
    'missing-visuals': productStates.filter(
      ({ readiness, deleted }) => !deleted && readiness.imageCount < 3
    ).length,
    draft: productStates.filter(({ published, deleted }) => !deleted && !published).length,
    'out-of-stock': productStates.filter(({ stock, deleted }) => !deleted && stock === 0).length,
    ready: productStates.filter(({ readiness, deleted }) => !deleted && readiness.ready).length,
  };
  const visibleProducts = productStates.filter(
    ({ product, published, readiness, stock, deleted }) => {
      const matchesQuery =
        !query ||
        [product.name, product.slug, product.collection, product.category]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(query);
      const matchesFilter =
        (filter === 'all' && !deleted) ||
        (filter === 'published' && !deleted && published) ||
        (filter === 'trash' && deleted) ||
        (filter === 'missing-visuals' && !deleted && readiness.imageCount < 3) ||
        (filter === 'draft' && !deleted && !published) ||
        (filter === 'out-of-stock' && !deleted && stock === 0) ||
        (filter === 'ready' && !deleted && readiness.ready);
      return matchesQuery && matchesFilter;
    }
  );
  const filters: Array<{
    value: ProductFilter;
    label: string;
  }> = [
    { value: 'all', label: 'Tümü' },
    { value: 'published', label: 'Yayında' },
    { value: 'trash', label: 'Çöp kutusu' },
    { value: 'missing-visuals', label: 'Eksik görselli' },
    { value: 'draft', label: 'Taslak' },
    { value: 'out-of-stock', label: 'Stokta yok' },
    { value: 'ready', label: 'Reklama hazır' },
  ];

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <h1 className="mt-3 font-heading text-4xl">Ürün Yönetimi</h1>
            <p className="mt-2 text-sm text-neutral-500">
              {activeProducts.length} ürün · {publishedCount} yayında · {readyCount} reklama hazır
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/reklam-hazirlik" className="rounded-xl border border-[#d8cdbb] bg-white px-5 py-3 text-sm font-medium">
              Reklam hazırlığı
            </Link>
            <Link href="/admin/urunler/toplu" className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-medium">
              Toplu ürün ekle
            </Link>
            <Link href="/admin/urunler/yeni" className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
              Yeni ürün ekle
            </Link>
          </div>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <Summary label="Toplam ürün" value={activeProducts.length} />
          <Summary label="Mağazada yayında" value={publishedCount} />
          <Summary label="Reklama hazır" value={readyCount} accent />
        </div>

        <section className="mb-5 rounded-2xl border border-[#e3d9c8] bg-white p-4 shadow-[0_8px_30px_rgba(77,61,35,0.04)]">
          <form method="get" className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="filter" value={filter} />
            <label className="sr-only" htmlFor="product-search">
              Ürün ara
            </label>
            <input
              id="product-search"
              name="q"
              defaultValue={params.q}
              placeholder="Ürün adı, bağlantı, koleksiyon veya kategori ara…"
              className="min-w-0 flex-1 rounded-xl border border-[#d8cdbb] px-4 py-3 text-sm"
            />
            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
              Ara
            </button>
            {(query || filter !== 'all') && (
              <Link
                href="/admin/urunler"
                className="rounded-xl border border-[#d8cdbb] px-5 py-3 text-center text-sm font-medium"
              >
                Temizle
              </Link>
            )}
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((item) => (
              <Link
                key={item.value}
                href={{
                  pathname: '/admin/urunler',
                  query: {
                    ...(params.q ? { q: params.q } : {}),
                    ...(item.value !== 'all' ? { filter: item.value } : {}),
                  },
                }}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                  filter === item.value
                    ? 'bg-black text-white'
                    : 'bg-[#f5f1e9] text-neutral-600 hover:bg-[#e9dfca]'
                }`}
              >
                {item.label} · {filterCounts[item.value]}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            {visibleProducts.length} ürün gösteriliyor
          </p>
        </section>

        <ProductBulkManager
          products={visibleProducts.map(({ product, published, readiness, stock, deleted }) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            stock,
            published,
            deleted,
            readiness: {
              ready: readiness.ready,
              score: readiness.score,
              imageCount: readiness.imageCount,
              missing: readiness.missing,
            },
          }))}
        />
      </div>
    </main>
  );
}

function Summary({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-[#d8c79e] bg-[#f1ead8]' : 'border-[#e3d9c8] bg-white'}`}>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
