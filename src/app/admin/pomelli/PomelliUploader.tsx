'use client';

import { upload } from '@vercel/blob/client';
import { ExternalLink, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function PomelliUploader({
  products,
}: {
  products: Array<{ id: string; name: string; slug: string }>;
}) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const product = products.find((item) => item.id === productId);
  const productUrl = product
    ? `https://novellajewell.com/urun/${product.slug}`
    : '';

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!product || !files.length) return;
    setBusy(true);
    setMessage('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const blob = await upload(
          `products/${product.slug}/pomelli/${file.name}`,
          file,
          {
            access: 'public',
            handleUploadUrl: '/api/admin/products/upload',
          }
        );
        urls.push(blob.url);
      }
      const response = await fetch('/api/admin/media-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, urls }),
      });
      if (!response.ok) throw new Error('Görseller kaydedilemedi.');
      setFiles([]);
      setMessage(`${urls.length} çekim incelemeye eklendi.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Yükleme başarısız.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#e3d9c8] bg-white p-5 sm:p-6">
      <h2 className="font-heading text-3xl">Yeni Pomelli çekimi</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Ürünü Pomelli’ye URL ile ekleyin; indirdiğiniz stüdyo, model ve lifestyle sonuçlarını topluca yükleyin.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">Ürün<select value={productId} onChange={(event) => setProductId(event.target.value)} className="rounded-xl border-[#d8cdbb]">{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <div className="flex flex-wrap gap-2">
          <input readOnly value={productUrl} className="min-w-0 flex-1 rounded-xl border-[#d8cdbb] bg-[#f8f5ef] text-sm" />
          <button type="button" onClick={() => navigator.clipboard.writeText(productUrl)} className="rounded-xl border border-[#d8cdbb] px-4 text-sm">URL’yi kopyala</button>
          <a href="https://labs.google.com/pomelli" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm text-white">Pomelli’yi aç <ExternalLink className="h-4 w-4" /></a>
        </div>
        <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#cfc2aa] bg-[#faf8f3] p-8 text-center">
          <UploadCloud className="h-7 w-7 text-[#9e8e63]" />
          <span className="mt-3 text-sm font-medium">Pomelli’den indirdiğiniz 3–4 görseli seçin</span>
          <span className="mt-1 text-xs text-neutral-500">JPG, PNG veya WebP · görsel başına en fazla 10 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
        </label>
        {files.length > 0 && <p className="text-sm text-neutral-600">{files.length} dosya seçildi: {files.map((file) => file.name).join(' · ')}</p>}
        <button disabled={busy || !files.length} className="rounded-xl bg-[#9e8e63] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Yükleniyor…' : 'Çekimleri incelemeye al'}</button>
        {message && <p className="text-sm text-neutral-600">{message}</p>}
      </form>
    </section>
  );
}
