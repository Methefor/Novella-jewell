'use client';

import { Check, ChevronLeft, ChevronRight, GripVertical, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

type AdChecklist = {
  visualMatchApproved: boolean;
  copyApproved: boolean;
  priceStockApproved: boolean;
  landingPageApproved: boolean;
};

type ImageItem = {
  id: string;
  src: string;
  file?: File;
};

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
  adChecklist: AdChecklist;
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
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [story, setStory] = useState(initialProduct?.story ?? '');
  const [features, setFeatures] = useState(initialProduct?.features.join(', ') ?? '');
  const [price, setPrice] = useState(initialProduct?.price ?? 0);
  const [stock, setStock] = useState(initialProduct?.stock ?? 1);
  const [imageItems, setImageItems] = useState<ImageItem[]>(() =>
    (initialProduct?.images ?? []).map((src, index) => ({
      id: `existing-${index}-${src}`,
      src,
    }))
  );
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [adChecklist, setAdChecklist] = useState<AdChecklist>(
    initialProduct?.adChecklist ?? {
      visualMatchApproved: false,
      copyApproved: false,
      priceStockApproved: false,
      landingPageApproved: false,
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const readinessChecks = useMemo(() => {
    const featureCount = features
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean).length;
    return [
      { label: 'En az 3 ürün görseli', ok: imageItems.length >= 3 },
      { label: 'Detaylı ürün açıklaması', ok: description.trim().length >= 80 },
      { label: 'Kısa marka hikâyesi', ok: story.trim().length >= 10 },
      { label: 'En az 3 ürün özelliği', ok: featureCount >= 3 },
      { label: 'Geçerli fiyat', ok: price > 0 },
      { label: 'Satılabilir stok', ok: stock > 0 },
      {
        label: 'Görsel gerçek ürünle eşleşiyor',
        ok: adChecklist.visualMatchApproved,
      },
      {
        label: 'Reklam metni ve ürün bilgileri onaylandı',
        ok: adChecklist.copyApproved,
      },
      {
        label: 'Fiyat ve stok doğrulandı',
        ok: adChecklist.priceStockApproved,
      },
      {
        label: 'Ürün sayfası mobilde kontrol edildi',
        ok: adChecklist.landingPageApproved,
      },
    ];
  }, [adChecklist, description, features, imageItems.length, price, stock, story]);
  const readinessPassed = readinessChecks.filter((check) => check.ok).length;
  const readinessScore = Math.round(
    (readinessPassed / readinessChecks.length) * 100
  );

  function moveImage(fromId: string, toId: string) {
    setImageItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function moveImageBy(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= imageItems.length) return;
    moveImage(imageItems[index].id, imageItems[target].id);
  }

  function makePrimary(id: string) {
    setImageItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index <= 0) return current;
      return [current[index], ...current.filter((item) => item.id !== id)];
    });
  }

  function removeImage(id: string) {
    setImageItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed?.file) URL.revokeObjectURL(removed.src);
      return current.filter((item) => item.id !== id);
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (!editing) {
        const availabilityResponse = await fetch(
          `/api/admin/products?slug=${encodeURIComponent(slug)}`
        );
        const availability = (await availabilityResponse.json()) as {
          available?: boolean;
          error?: string;
        };
        if (!availabilityResponse.ok) {
          throw new Error(availability.error || 'Bağlantı adı kontrol edilemedi.');
        }
        if (!availability.available) {
          throw new Error(
            'Bu ürün zaten kaydedilmiş. Ürün listesinden bularak düzenleyebilirsiniz.'
          );
        }
      }

      const form = new FormData(event.currentTarget);
      const images: string[] = [];
      for (const item of imageItems) {
        if (item.file) {
          const uploadForm = new FormData();
          uploadForm.set('file', item.file);
          uploadForm.set('pathname', `products/${slug}/${item.file.name}`);
          const uploadResponse = await fetch('/api/admin/products/upload', {
            method: 'POST',
            body: uploadForm,
          });
          const uploadResult = (await uploadResponse.json()) as {
            url?: string;
            error?: string;
          };
          if (!uploadResponse.ok || !uploadResult.url) {
            throw new Error(uploadResult.error || 'Görsel yüklenemedi.');
          }
          images.push(uploadResult.url);
        } else {
          images.push(item.src);
        }
      }
      if (!images.length) throw new Error('En az bir ürün görseli seçin.');
      if (images.length > 8) throw new Error('En fazla 8 ürün görseli kullanılabilir.');

      const payload = {
        name,
        slug,
        description,
        story,
        category: form.get('category'),
        collection: form.get('collection'),
        material: form.get('material'),
        color: form.get('color'),
        price,
        compareAtPrice: form.get('compareAtPrice')
          ? Number(form.get('compareAtPrice'))
          : null,
        stock,
        images,
        features: features
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        isNew: form.get('isNew') === 'on',
        isBestSeller: form.get('isBestSeller') === 'on',
        published: form.get('published') === 'on',
        adChecklist,
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
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={input}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Kısa hikâye
        <textarea
          name="story"
          rows={2}
          value={story}
          onChange={(event) => setStory(event.target.value)}
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
            value={price || ''}
            onChange={(event) => setPrice(Number(event.target.value))}
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
            value={stock}
            onChange={(event) => setStock(Number(event.target.value))}
            className={input}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Özellikler
        <span className="text-xs text-neutral-500">Virgülle ayırın</span>
        <input
          name="features"
          value={features}
          onChange={(event) => setFeatures(event.target.value)}
          placeholder="316L paslanmaz çelik, Suya dayanıklı"
          className={input}
        />
      </label>

      {imageItems.length ? (
        <div className="rounded-xl border border-[#e8e0d2] bg-[#faf8f5] p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-medium">
                Görsel sırası ({imageItems.length}/8)
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                İlk görsel mağaza ve reklam vitrininin ana görselidir. Sürükleyin
                veya okları kullanın.
              </p>
            </div>
            <span className="rounded-full bg-[#eee5d4] px-3 py-1 text-xs text-[#75643d]">
              1. görsel = ana görsel
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {imageItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedImageId(item.id)}
                onDragEnd={() => setDraggedImageId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedImageId) moveImage(draggedImageId, item.id);
                  setDraggedImageId(null);
                }}
                className={`group overflow-hidden rounded-xl border bg-white ${
                  index === 0
                    ? 'border-[#b8a46f] ring-2 ring-[#d8c79e]/50'
                    : 'border-[#e3d9c8]'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={item.src}
                    alt={`${name || 'Ürün'} görseli ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute left-2 top-2 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/75 px-2 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm">
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#efe6ce] px-2.5 py-1 text-[11px] font-semibold text-[#695a34]">
                      <Star className="h-3 w-3 fill-current" />
                      Ana görsel
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 border-t border-[#eee7db]">
                  <button
                    type="button"
                    onClick={() => moveImageBy(index, -1)}
                    disabled={index === 0}
                    className="grid min-h-11 place-items-center border-r border-[#eee7db] disabled:opacity-25"
                    aria-label="Görseli sola taşı"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImageBy(index, 1)}
                    disabled={index === imageItems.length - 1}
                    className="grid min-h-11 place-items-center border-r border-[#eee7db] disabled:opacity-25"
                    aria-label="Görseli sağa taşı"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => makePrimary(item.id)}
                    disabled={index === 0}
                    className="grid min-h-11 place-items-center border-r border-[#eee7db] text-[#8b7848] disabled:opacity-25"
                    aria-label="Ana görsel yap"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="grid min-h-11 place-items-center text-red-600"
                    aria-label="Görseli kaldır"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <label className="grid gap-2 text-sm">
        {editing ? 'Yeni görsel ekle' : 'Ürün görselleri'} (en fazla 8)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            const available = Math.max(0, 8 - imageItems.length);
            const additions = files.slice(0, available).map((file) => ({
              id: `new-${crypto.randomUUID()}`,
              src: URL.createObjectURL(file),
              file,
            }));
            setImageItems((current) => [...current, ...additions]);
            event.target.value = '';
          }}
          className={input}
        />
      </label>

      <section className="rounded-2xl border border-[#d8c79e] bg-[#f7f2e6] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7848]">
              Reklam hazırlık kontrolü
            </p>
            <h2 className="mt-2 font-heading text-2xl">
              Hazırlık %{readinessScore}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {readinessPassed}/{readinessChecks.length} kontrol tamamlandı
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              readinessScore === 100
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {readinessScore === 100 ? 'Reklama hazır' : 'Hazırlıkta'}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-[#a99158] transition-[width] duration-300"
            style={{ width: `${readinessScore}%` }}
          />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {readinessChecks.slice(0, 6).map((check) => (
            <div
              key={check.label}
              className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm"
            >
              <span
                className={`grid h-5 w-5 flex-none place-items-center rounded-full ${
                  check.ok
                    ? 'bg-emerald-600 text-white'
                    : 'border border-neutral-300 text-transparent'
                }`}
              >
                <Check className="h-3 w-3" />
              </span>
              {check.label}
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-[#dfd3b9] pt-5">
          <p className="mb-3 text-sm font-semibold">Manuel onaylar</p>
          <div className="grid gap-3">
            {[
              ['visualMatchApproved', 'Görseller gerçek ürünün biçim, renk ve detaylarıyla eşleşiyor'],
              ['copyApproved', 'Reklam metni ve ürün bilgileri kontrol edildi'],
              ['priceStockApproved', 'Fiyat ve stok bilgileri doğrulandı'],
              ['landingPageApproved', 'Ürün sayfası mobilde açıldı ve satın alma akışı kontrol edildi'],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#e2d8c4] bg-white px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={adChecklist[key as keyof AdChecklist]}
                  onChange={(event) =>
                    setAdChecklist((current) => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-[#a99158]"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </section>
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
