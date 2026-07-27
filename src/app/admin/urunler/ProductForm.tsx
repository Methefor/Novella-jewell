'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export type ProductFormInitial = {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  category: string;
  collection: string;
  material: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  features: string[];
  isNew: boolean;
  isBestSeller: boolean;
  published: boolean;
  createdAt: string;
};

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ProductForm({
  initialProduct,
}: {
  initialProduct?: ProductFormInitial;
}) {
  const router = useRouter();
  const editing = Boolean(initialProduct);
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [slug, setSlug] = useState(initialProduct?.slug ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const form = new FormData(event.currentTarget);
      const files = form
        .getAll('images')
        .filter(
          (value): value is File => value instanceof File && value.size > 0
        );
      const images = [...(initialProduct?.images ?? [])];
      for (const file of files) {
        const blob = await upload(`products/${slug}/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/products/upload',
        });
        images.push(blob.url);
      }
      if (!images.length) throw new Error('En az bir ürün görseli seçin.');
      if (images.length > 8) throw new Error('En fazla 8 ürün görseli kullanılabilir.');

      const payload = {
        name,
        slug,
        description: form.get('description'),
        story: form.get('story'),
        category: form.get('category'),
        collection: form.get('collection'),
        material: form.get('material'),
        color: form.get('color'),
        price: Number(form.get('price')),
        compareAtPrice: form.get('compareAtPrice')
          ? Number(form.get('compareAtPrice'))
          : null,
        stock: Number(form.get('stock')),
        images,
        features: String(form.get('features') ?? '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        isNew: form.get('isNew') === 'on',
        isBestSeller: form.get('isBestSeller') === 'on',
        published: form.get('published') === 'on',
        createdAt: initialProduct?.createdAt,
      };
      const response = await fetch(
        editing
          ? `/api/admin/products/${encodeURIComponent(initialProduct!.id)}`
          : '/api/admin/products',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? 'Ürün kaydedilemedi.');
      }

      router.push('/admin/urunler');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Bir hata oluştu.');
      setBusy(false);
    }
  }

  const input =
    'rounded-xl border border-[#d8cdbb] bg-white px-4 py-3 text-sm';

  return (
    <form
      onSubmit={submit}
      className="grid gap-5 rounded-2xl border border-[#e3d9c8] bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Ürün adı
          <input
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!editing) setSlug(slugify(event.target.value));
            }}
            className={input}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Bağlantı adı
          <input
            required
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            className={input}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Açıklama
        <textarea
          required
          name="description"
          rows={4}
          defaultValue={initialProduct?.description}
          className={input}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Kısa hikâye
        <textarea
          name="story"
          rows={2}
          defaultValue={initialProduct?.story}
          className={input}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm">
          Kategori
          <select
            name="category"
            defaultValue={initialProduct?.category ?? 'bilezik'}
            className={input}
          >
            <option value="bilezik">Bileklik</option>
            <option value="kupe">Küpe</option>
            <option value="yuzuk">Yüzük</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Koleksiyon
          <select
            name="collection"
            defaultValue={initialProduct?.collection ?? 'klasikler'}
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
            name="material"
            defaultValue={initialProduct?.material ?? 'celik'}
            className={input}
          >
            <option value="celik">Çelik</option>
            <option value="altin-kaplama">Altın kaplama</option>
            <option value="gumus-kaplama">Gümüş kaplama</option>
            <option value="rose-gold-kaplama">Rose gold kaplama</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-2 text-sm">
          Renk
          <select
            name="color"
            defaultValue={initialProduct?.color ?? 'altin'}
            className={input}
          >
            <option value="altin">Altın</option>
            <option value="gumus">Gümüş</option>
            <option value="rose-gold">Rose gold</option>
            <option value="siyah">Siyah</option>
            <option value="beyaz">Beyaz</option>
            <option value="cok-renkli">Çok renkli</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Fiyat (₺)
          <input
            required
            name="price"
            type="number"
            min="1"
            step="0.01"
            defaultValue={initialProduct?.price}
            className={input}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Eski fiyat
          <input
            name="compareAtPrice"
            type="number"
            min="1"
            step="0.01"
            defaultValue={initialProduct?.compareAtPrice}
            className={input}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Stok
          <input
            required
            name="stock"
            type="number"
            min="0"
            defaultValue={initialProduct?.stock ?? 1}
            className={input}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Özellikler
        <span className="text-xs text-neutral-500">Virgülle ayırın</span>
        <input
          name="features"
          defaultValue={initialProduct?.features.join(', ')}
          placeholder="316L paslanmaz çelik, Suya dayanıklı"
          className={input}
        />
      </label>

      {initialProduct?.images.length ? (
        <div className="rounded-xl border border-[#e8e0d2] bg-[#faf8f5] p-4">
          <p className="text-sm font-medium">
            Mevcut görseller ({initialProduct.images.length}/8)
          </p>
          <div className="mt-3 grid gap-2 text-xs text-neutral-500">
            {initialProduct.images.map((image, index) => (
              <a
                key={image}
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate underline underline-offset-2"
              >
                {index + 1}. {image}
              </a>
            ))}
          </div>
        </div>
      ) : null}
      <label className="grid gap-2 text-sm">
        {editing ? 'Yeni görsel ekle' : 'Ürün görselleri'} (en fazla 8)
        <input
          required={!editing}
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={input}
        />
      </label>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            name="isNew"
            type="checkbox"
            defaultChecked={initialProduct?.isNew ?? true}
          />
          Yeni ürün
        </label>
        <label className="flex items-center gap-2">
          <input
            name="isBestSeller"
            type="checkbox"
            defaultChecked={initialProduct?.isBestSeller}
          />
          Çok satan
        </label>
        <label className="flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initialProduct?.published ?? true}
          />
          Mağazada yayında
        </label>
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <button
        disabled={busy}
        className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {busy
          ? 'Görseller yükleniyor ve ürün kaydediliyor…'
          : editing
            ? 'Değişiklikleri kaydet'
            : 'Ürünü kaydet'}
      </button>
    </form>
  );
}
