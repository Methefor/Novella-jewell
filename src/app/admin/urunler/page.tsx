import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { getProductReadiness } from '@/lib/product-readiness';
import type { Product } from '@/types/product';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setProductPublished } from './actions';

export const dynamic = 'force-dynamic';

type ProductFilter =
  | 'all'
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
  const readyCount = products.filter((product) => getProductReadiness(product).ready).length;
  const publishedCount = products.filter((product) => {
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
    return { product, published, readiness, stock };
  });
  const filterCounts: Record<ProductFilter, number> = {
    all: productStates.length,
    'missing-visuals': productStates.filter(
      ({ readiness }) => readiness.imageCount < 3
    ).length,
    draft: productStates.filter(({ published }) => !published).length,
    'out-of-stock': productStates.filter(({ stock }) => stock === 0).length,
    ready: productStates.filter(({ readiness }) => readiness.ready).length,
  };
  const visibleProducts = productStates.filter(
    ({ product, published, readiness, stock }) => {
      const matchesQuery =
        !query ||
        [product.name, product.slug, product.collection, product.category]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'missing-visuals' && readiness.imageCount < 3) ||
        (filter === 'draft' && !published) ||
        (filter === 'out-of-stock' && stock === 0) ||
        (filter === 'ready' && readiness.ready);
      return matchesQuery && matchesFilter;
    }
  );
  const filters: Array<{
    value: ProductFilter;
    label: string;
  }> = [
    { value: 'all', label: 'Tümü' },
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
              {products.length} ürün · {publishedCount} yayında · {readyCount} reklama hazır
            </p>
          </div>
          <Link href="/admin/urunler/yeni" className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
            Yeni ürün ekle
          </Link>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <Summary label="Toplam ürün" value={products.length} />
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

        <div className="grid gap-4">
          {visibleProducts.map(({ product, published, readiness, stock }) => {
            return (
              <article key={product.id} className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{product.name}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>
                        {published ? 'Yayında' : 'Taslak'}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${readiness.ready ? 'bg-[#efe9d8] text-[#75643d]' : 'bg-amber-100 text-amber-800'}`}>
                        {readiness.ready ? 'Reklama hazır' : `Hazırlık %${readiness.score}`}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-500">
                      {product.slug} · {product.price.toLocaleString('tr-TR')} ₺ · stok {stock} · {readiness.imageCount} görsel
                    </p>
                    {!readiness.ready && (
                      <p className="mt-3 text-xs text-amber-700">
                        Eksik: {readiness.missing.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/urunler/${encodeURIComponent(product.id)}`} className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm font-medium hover:border-black">
                      Düzenle
                    </Link>
                    {published && (
                      <Link href={`/urun/${product.slug}`} target="_blank" className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm">
                        Görüntüle
                      </Link>
                    )}
                    <form action={setProductPublished}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="published" value={String(!published)} />
                      <button className={`rounded-lg px-3 py-2 text-sm font-medium ${published ? 'bg-neutral-100 text-neutral-700' : 'bg-black text-white'}`}>
                        {published ? 'Yayından kaldır' : 'Yayınla'}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
          {!visibleProducts.length && (
            <p className="rounded-2xl bg-white p-8 text-center text-neutral-500">
              Bu arama ve filtreyle eşleşen ürün bulunamadı.
            </p>
          )}
        </div>
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
