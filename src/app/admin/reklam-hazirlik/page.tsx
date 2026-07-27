import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { getProductReadiness } from '@/lib/product-readiness';
import type { Product } from '@/types/product';
import { AlertTriangle, ArrowRight, CheckCircle2, ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type ReadinessView = 'attention' | 'all' | 'ready';

export default async function AdReadinessPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  const params = await searchParams;
  const view: ReadinessView = ['all', 'ready'].includes(params.view ?? '')
    ? (params.view as ReadinessView)
    : 'attention';
  const rows = dbYok ? [] : await db.select().from(catalogProducts);
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

  const productStates = products.map((product) => {
    const readiness = getProductReadiness(product);
    const row = rowById.get(product.id);
    const published = row ? row.published : !product.hidden;
    const images = product.images?.length
      ? product.images
      : product.variants.flatMap((variant) => variant.images);
    const cover = images.find(Boolean);
    const manualMissing = readiness.missing.filter((item) =>
      [
        'Görsel gerçek ürünle eşleşiyor',
        'Reklam metni ve ürün bilgileri onaylandı',
        'Fiyat ve stok doğrulandı',
        'Ürün sayfası mobilde kontrol edildi',
      ].includes(item)
    ).length;

    return { product, readiness, published, cover, manualMissing };
  });

  const ready = productStates.filter(({ readiness }) => readiness.ready);
  const attention = productStates.filter(({ readiness }) => !readiness.ready);
  const missingVisuals = productStates.filter(
    ({ readiness }) => readiness.imageCount < 3
  );
  const awaitingApproval = productStates.filter(
    ({ manualMissing }) => manualMissing > 0
  );
  const visible = productStates
    .filter(({ readiness }) => {
      if (view === 'ready') return readiness.ready;
      if (view === 'attention') return !readiness.ready;
      return true;
    })
    .sort((a, b) => {
      if (a.readiness.ready !== b.readiness.ready) {
        return a.readiness.ready ? 1 : -1;
      }
      if (Boolean(a.product.isNew) !== Boolean(b.product.isNew)) {
        return a.product.isNew ? -1 : 1;
      }
      if (a.readiness.score !== b.readiness.score) {
        return b.readiness.score - a.readiness.score;
      }
      return b.product.updatedAt.getTime() - a.product.updatedAt.getTime();
    });
  const nextProduct = visible.find(({ readiness }) => !readiness.ready);

  const tabs: Array<{ value: ReadinessView; label: string; count: number }> = [
    { value: 'attention', label: 'Tamamlanacaklar', count: attention.length },
    { value: 'ready', label: 'Reklama hazır', count: ready.length },
    { value: 'all', label: 'Tüm ürünler', count: productStates.length },
  ];

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">
              ← Dashboard
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">
              İçerik operasyonu
            </p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
              Reklam Hazırlık Merkezi
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Kampanyaya çıkmadan önce ürün görsellerini, bilgilerini ve manuel
              kalite onaylarını tek iş kuyruğunda tamamlayın.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/kampanyalar"
              className="inline-flex min-h-12 items-center rounded-xl border border-[#d8cdbb] bg-white px-5 py-3 text-sm font-semibold"
            >
              Kampanya panosu
            </Link>
            {nextProduct && (
              <Link
                href={`/admin/urunler/${encodeURIComponent(nextProduct.product.id)}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8d7c55]"
              >
                Sıradaki ürünü tamamla
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Toplam ürün" value={productStates.length} />
          <Metric label="Reklama hazır" value={ready.length} positive />
          <Metric label="Eksik görselli" value={missingVisuals.length} warning />
          <Metric
            label="Manuel onay bekleyen"
            value={awaitingApproval.length}
            warning
          />
        </section>

        <nav
          aria-label="Reklam hazırlık görünümleri"
          className="mt-7 flex flex-wrap gap-2 rounded-2xl border border-[#e3d9c8] bg-white p-3"
        >
          {tabs.map((tab) => {
            const selected = tab.value === view;
            return (
              <Link
                key={tab.value}
                href={
                  tab.value === 'attention'
                    ? '/admin/reklam-hazirlik'
                    : `/admin/reklam-hazirlik?view=${tab.value}`
                }
                aria-current={selected ? 'page' : undefined}
                className={`rounded-full px-4 py-2.5 text-sm font-medium ${
                  selected
                    ? 'bg-black text-white'
                    : 'bg-[#f6f2eb] text-neutral-600 hover:text-black'
                }`}
              >
                {tab.label} · {tab.count}
              </Link>
            );
          })}
        </nav>

        <section className="mt-5 grid gap-4">
          {visible.map(
            ({ product, readiness, published, cover, manualMissing }, index) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-[#e3d9c8] bg-white shadow-[0_8px_30px_rgba(77,61,35,0.04)]"
              >
                <div className="grid md:grid-cols-[180px_1fr]">
                  <div className="relative aspect-square bg-[#eee9e0] md:aspect-auto md:min-h-[180px]">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${product.name} ana görseli`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                    ) : (
                      <div className="grid h-full min-h-44 place-items-center text-neutral-400">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}
                    {index === 0 && !readiness.ready && (
                      <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[11px] font-semibold text-white">
                        Sıradaki
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-heading text-2xl">{product.name}</h2>
                          {product.isNew && (
                            <span className="rounded-full bg-[#efe6ce] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#75643d]">
                              Yeni
                            </span>
                          )}
                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                            {published ? 'Yayında' : 'Taslak'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-neutral-500">
                          {readiness.imageCount} görsel · {manualMissing} manuel
                          onay bekliyor
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          readiness.ready
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {readiness.ready ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        )}
                        %{readiness.score}
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eee9e0]">
                      <div
                        className={`h-full rounded-full ${
                          readiness.ready ? 'bg-emerald-600' : 'bg-[#aa9259]'
                        }`}
                        style={{ width: `${readiness.score}%` }}
                      />
                    </div>

                    {!readiness.ready && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                          Tamamlanacaklar
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {readiness.missing.slice(0, 4).map((item) => (
                            <span
                              key={item}
                              className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800"
                            >
                              {item}
                            </span>
                          ))}
                          {readiness.missing.length > 4 && (
                            <span className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-600">
                              +{readiness.missing.length - 4} kontrol
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/urunler/${encodeURIComponent(product.id)}`}
                        className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white"
                      >
                        {readiness.ready ? 'Kontrolleri düzenle' : 'Ürünü tamamla'}
                      </Link>
                      {published && (
                        <Link
                          href={`/urun/${product.slug}`}
                          target="_blank"
                          className="rounded-lg border border-[#d8cdbb] px-4 py-2.5 text-sm font-medium"
                        >
                          Ürün sayfasını aç
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          )}

          {!visible.length && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-700" />
              <h2 className="mt-4 font-heading text-2xl text-emerald-950">
                Bu kuyruk tamamlandı
              </h2>
              <p className="mt-2 text-sm text-emerald-800">
                Seçili görünümde bekleyen ürün bulunmuyor.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  positive = false,
  warning = false,
}: {
  label: string;
  value: number;
  positive?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        positive
          ? 'border-emerald-200 bg-emerald-50'
          : warning
            ? 'border-amber-200 bg-amber-50'
            : 'border-[#e3d9c8] bg-white'
      }`}
    >
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
