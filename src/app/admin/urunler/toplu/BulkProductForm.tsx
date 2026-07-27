'use client';

import type {
  CollectionSlug,
  ProductCategory,
  ProductColor,
  ProductMaterial,
} from '@/types/product';
import { CheckCircle2, Copy, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  color: ProductColor;
};

type Template = {
  category: ProductCategory;
  collection: CollectionSlug;
  material: ProductMaterial;
  features: string[];
};

function newRow(): Row {
  return {
    id: crypto.randomUUID(),
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '1',
    color: 'altin',
  };
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function BulkProductForm({
  initialTemplate,
  careNote,
}: {
  initialTemplate: Template;
  careNote: string;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate);
  const [featureText, setFeatureText] = useState(initialTemplate.features.join(', '));
  const [rows, setRows] = useState<Row[]>(() => Array.from({ length: 5 }, newRow));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.name.trim().length >= 3 &&
          row.description.trim().length >= 10 &&
          Number(row.price) > 0 &&
          Number(row.stock) >= 0
      ),
    [rows]
  );

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  }

  function addRows(count: number) {
    setRows((current) => [
      ...current,
      ...Array.from({ length: Math.min(count, 50 - current.length) }, newRow),
    ]);
  }

  async function save() {
    setError('');
    setSuccess('');
    if (!validRows.length) {
      setError('Kaydedilecek en az bir eksiksiz ürün satırı bulunmalı.');
      return;
    }
    if (validRows.length !== rows.filter((row) => row.name.trim()).length) {
      setError('Adı girilmiş satırlardaki açıklama, fiyat veya stok bilgilerini tamamlayın.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...template,
          features: featureText
            .split(',')
            .map((feature) => feature.trim())
            .filter(Boolean),
          items: validRows.map((row) => ({
            name: row.name.trim(),
            slug: row.slug || slugify(row.name),
            description: row.description.trim(),
            price: Number(row.price),
            stock: Number(row.stock),
            color: row.color,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Ürünler kaydedilemedi.');
      setSuccess(`${result.count} ürün taslak olarak oluşturuldu.`);
      setRows(Array.from({ length: 5 }, newRow));
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Bir hata oluştu.');
    } finally {
      setBusy(false);
    }
  }

  const input =
    'w-full rounded-xl border border-[#d8cdbb] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black';

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl">Merkezi ürün özellikleri şablonu</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Bu değerler aşağıdaki tüm ürünlere uygulanır.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            316L standardı aktif
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm">
            Kategori
            <select
              value={template.category}
              onChange={(event) =>
                setTemplate({ ...template, category: event.target.value as ProductCategory })
              }
              className={input}
            >
              <option value="yuzuk">Yüzük</option>
              <option value="bilezik">Bileklik</option>
              <option value="kupe">Küpe</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Koleksiyon
            <select
              value={template.collection}
              onChange={(event) =>
                setTemplate({ ...template, collection: event.target.value as CollectionSlug })
              }
              className={input}
            >
              <option value="klasikler">Klasikler</option>
              <option value="barcelona">Barcelona</option>
              <option value="stockholm">Stockholm</option>
              <option value="paris">Paris</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Malzeme
            <select
              value={template.material}
              onChange={(event) =>
                setTemplate({ ...template, material: event.target.value as ProductMaterial })
              }
              className={input}
            >
              <option value="celik">316L çelik</option>
              <option value="altin-kaplama">Altın kaplama</option>
              <option value="gumus-kaplama">Gümüş kaplama</option>
              <option value="rose-gold-kaplama">Rose gold kaplama</option>
            </select>
          </label>
        </div>
        <label className="mt-4 grid gap-2 text-sm">
          Ortak özellikler
          <input
            value={featureText}
            onChange={(event) => setFeatureText(event.target.value)}
            className={input}
          />
        </label>
        <div className="mt-4 rounded-xl bg-[#f8f5ef] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#81734e]">
            Merkezi bakım bilgisi
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{careNote}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e3d9c8] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee6d9] p-5">
          <div>
            <h2 className="font-heading text-2xl">Ürün satırları</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {validRows.length} hazır · {rows.length}/50 satır
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => addRows(5)} className="rounded-xl border border-[#d8cdbb] px-4 py-2 text-sm">
              +5 satır
            </button>
            <button type="button" onClick={() => addRows(1)} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm text-white">
              <Plus className="h-4 w-4" /> Satır ekle
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead className="bg-[#faf8f4] text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-3 py-3">Ürün adı</th>
                <th className="px-3 py-3">Bağlantı</th>
                <th className="px-3 py-3">Müşteri açıklaması</th>
                <th className="px-3 py-3">Renk</th>
                <th className="px-3 py-3">Fiyat</th>
                <th className="px-3 py-3">Stok</th>
                <th className="px-3 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee6d9]">
              {rows.map((row, index) => (
                <tr key={row.id} className="align-top">
                  <td className="px-4 py-3 text-xs text-neutral-400">{index + 1}</td>
                  <td className="w-48 px-3 py-3">
                    <input
                      value={row.name}
                      onChange={(event) => {
                        const name = event.target.value;
                        updateRow(row.id, { name, slug: slugify(name) });
                      }}
                      placeholder="Ürün adı"
                      className={input}
                    />
                  </td>
                  <td className="w-48 px-3 py-3">
                    <input
                      value={row.slug}
                      onChange={(event) => updateRow(row.id, { slug: slugify(event.target.value) })}
                      placeholder="urun-baglantisi"
                      className={input}
                    />
                  </td>
                  <td className="w-80 px-3 py-3">
                    <textarea
                      value={row.description}
                      onChange={(event) => updateRow(row.id, { description: event.target.value })}
                      placeholder="Ürünü farklılaştıran tasarım ve kullanım hissi…"
                      rows={2}
                      className={input}
                    />
                  </td>
                  <td className="w-36 px-3 py-3">
                    <select
                      value={row.color}
                      onChange={(event) => updateRow(row.id, { color: event.target.value as ProductColor })}
                      className={input}
                    >
                      <option value="altin">Altın</option>
                      <option value="gumus">Gümüş</option>
                      <option value="rose-gold">Rose gold</option>
                      <option value="siyah">Siyah</option>
                      <option value="beyaz">Beyaz</option>
                      <option value="cok-renkli">Çok renkli</option>
                    </select>
                  </td>
                  <td className="w-28 px-3 py-3">
                    <input type="number" min="1" value={row.price} onChange={(event) => updateRow(row.id, { price: event.target.value })} placeholder="₺" className={input} />
                  </td>
                  <td className="w-24 px-3 py-3">
                    <input type="number" min="0" value={row.stock} onChange={(event) => updateRow(row.id, { stock: event.target.value })} className={input} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        title="Satırı çoğalt"
                        onClick={() =>
                          setRows((current) => [
                            ...current.slice(0, index + 1),
                            { ...row, id: crypto.randomUUID(), slug: `${row.slug}-kopya` },
                            ...current.slice(index + 1),
                          ])
                        }
                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button type="button" title="Satırı sil" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#eee6d9] bg-[#faf8f4] p-5">
          <div>
            {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
            {success && (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {success}
              </p>
            )}
            {!error && !success && (
              <p className="text-xs text-neutral-500">
                Ürünler yayına çıkmaz; görseller ve son kontroller tamamlanana kadar taslak kalır.
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={busy || !validRows.length}
            onClick={save}
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Taslaklar oluşturuluyor…' : `${validRows.length} ürünü taslak oluştur`}
          </button>
        </div>
      </section>
    </div>
  );
}

