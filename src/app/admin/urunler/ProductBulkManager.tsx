'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  published: boolean;
  readiness: {
    ready: boolean;
    score: number;
    imageCount: number;
    missing: string[];
  };
};

export function ProductBulkManager({ products }: { products: ProductListItem[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = products.length > 0 && products.every((product) => selected.has(product.id));

  function toggleAll() {
    setSelectedIds(allSelected ? [] : products.map((product) => product.id));
    setMessage('');
  }

  function toggleOne(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    setMessage('');
  }

  async function run(action: 'publish' | 'unpublish', ids = selectedIds) {
    if (!ids.length || busy) return;
    const verb = action === 'publish' ? 'yayına almak' : 'yayından kaldırmak';
    const detail =
      action === 'unpublish'
        ? '\n\nÜrünler mağazada görünmeyecek, ancak silinmeyecek ve daha sonra yeniden yayınlanabilecek.'
        : '\n\nYalnızca görsel ve kalite kontrolleri tamamlanmış ürünler yayınlanabilir.';
    if (!window.confirm(`${ids.length} ürünü ${verb} istediğinize emin misiniz?${detail}`)) return;

    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/products/bulk/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'İşlem tamamlanamadı.');
      setSelectedIds([]);
      setMessage(
        `${ids.length} ürün ${action === 'publish' ? 'yayına alındı' : 'yayından kaldırıldı'}.`
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'İşlem tamamlanamadı.');
    } finally {
      setBusy(false);
    }
  }

  if (!products.length) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-neutral-500">
        Bu arama ve filtreyle eşleşen ürün bulunamadı.
      </p>
    );
  }

  return (
    <div>
      <div className="sticky top-3 z-20 mb-4 rounded-2xl border border-[#d8cdbb] bg-white/95 p-4 shadow-[0_12px_35px_rgba(77,61,35,0.12)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 accent-black"
            />
            Görünen {products.length} ürünün tümünü seç
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-neutral-500">{selectedIds.length} ürün seçildi</span>
            <button
              type="button"
              disabled={!selectedIds.length || busy}
              onClick={() => run('unpublish')}
              className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Seçilenleri yayından kaldır
            </button>
            <button
              type="button"
              disabled={!selectedIds.length || busy}
              onClick={() => run('publish')}
              className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Seçilenleri yayınla
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-3 border-t border-[#eee7da] pt-3 text-xs text-neutral-600" role="status">
            {message}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <article
            key={product.id}
            className={`rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.04)] transition-colors ${
              selected.has(product.id) ? 'border-black' : 'border-[#e3d9c8]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <input
                  type="checkbox"
                  checked={selected.has(product.id)}
                  onChange={() => toggleOne(product.id)}
                  aria-label={`${product.name} ürününü seç`}
                  className="mt-1 h-4 w-4 shrink-0 accent-black"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{product.name}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>
                      {product.published ? 'Yayında' : 'Taslak'}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${product.readiness.ready ? 'bg-[#efe9d8] text-[#75643d]' : 'bg-amber-100 text-amber-800'}`}>
                      {product.readiness.ready ? 'Reklama hazır' : `Hazırlık %${product.readiness.score}`}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    {product.slug} · {product.price.toLocaleString('tr-TR')} ₺ · stok {product.stock} · {product.readiness.imageCount} görsel
                  </p>
                  {!product.readiness.ready && (
                    <p className="mt-3 text-xs text-amber-700">
                      Eksik: {product.readiness.missing.join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/urunler/${encodeURIComponent(product.id)}`} className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm font-medium hover:border-black">
                  Düzenle
                </Link>
                {product.published && (
                  <Link href={`/urun/${product.slug}`} target="_blank" className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm">
                    Görüntüle
                  </Link>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(product.published ? 'unpublish' : 'publish', [product.id])}
                  className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-40 ${product.published ? 'bg-neutral-100 text-neutral-700' : 'bg-black text-white'}`}
                >
                  {product.published ? 'Yayından kaldır' : 'Yayınla'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
