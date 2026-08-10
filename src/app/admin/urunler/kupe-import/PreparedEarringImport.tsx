'use client';

import { useMemo, useState } from 'react';

export type PreparedEarring = {
  set: string;
  name: string;
  slug: string;
  collection: 'barcelona' | 'stockholm' | 'paris' | 'klasikler';
  color: 'altin' | 'gumus' | 'rose-gold' | 'siyah' | 'beyaz' | 'cok-renkli';
  detail: string;
  description: string;
};

export default function PreparedEarringImport({ manifest }: { manifest: PreparedEarring[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState('');

  const grouped = useMemo(() => new Map(manifest.map((item) => [
    item.slug,
    files.filter((file) => file.name.startsWith(`${item.slug}-`)).sort((a, b) => a.name.localeCompare(b.name)),
  ])), [files, manifest]);
  const readyCount = manifest.filter((item) => (grouped.get(item.slug)?.length ?? 0) >= 3).length;
  const expectedImageCount = manifest.length * 4;

  async function upload() {
    if (readyCount !== manifest.length || busy) return;
    setBusy(true);
    setResult('');
    try {
      const items = [];
      let completed = 0;
      for (const item of manifest) {
        const imageFiles = grouped.get(item.slug) ?? [];
        const images: string[] = [];
        for (const file of imageFiles) {
          setProgress(`${completed + 1}/${files.length} · ${item.name}`);
          const form = new FormData();
          form.set('file', file);
          form.set('pathname', `products/${item.slug}/${file.name}`);
          const response = await fetch('/api/admin/products/upload', { method: 'POST', body: form });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error ?? `${file.name} yüklenemedi.`);
          images.push(payload.url);
          completed += 1;
        }
        items.push({ ...item, images });
      }
      setProgress('Ürün taslakları oluşturuluyor…');
      const response = await fetch('/api/admin/products/prepared-batch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Ürün taslakları oluşturulamadı.');
      setResult(`${payload.count} küpe taslağı başarıyla oluşturuldu. Fiyat ve stok girişine hazır.`);
      setProgress('');
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Aktarım tamamlanamadı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <section className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
        <label className="grid gap-2 text-sm font-semibold">
          Hazırlanan {expectedImageCount} PNG görselini seçin
          <input
            type="file"
            multiple
            accept="image/png"
            disabled={busy}
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="rounded-xl border border-[#d8cdbb] p-4 text-sm"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-[#f4efe5] px-3 py-1.5">{files.length} görsel seçildi</span>
          <span className="rounded-full bg-[#f4efe5] px-3 py-1.5">{readyCount}/{manifest.length} ürün eşleşti</span>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-800">Fiyat ve stok bekleyecek</span>
        </div>
        <button
          type="button"
          onClick={upload}
          disabled={busy || readyCount !== manifest.length}
          className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Aktarılıyor…' : `Görselleri yükle ve ${manifest.length} taslağı oluştur`}
        </button>
        {progress && <p className="mt-3 text-sm text-neutral-600" role="status">{progress}</p>}
        {result && <p className="mt-3 text-sm font-semibold text-neutral-800" role="alert">{result}</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e3d9c8] bg-white">
        <div className="max-h-[620px] overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 bg-[#faf8f4] text-xs text-neutral-500">
              <tr><th className="p-3">Set</th><th className="p-3">Ürün</th><th className="p-3">Renk</th><th className="p-3">Görsel</th><th className="p-3">Durum</th></tr>
            </thead>
            <tbody className="divide-y divide-[#eee6d9]">
              {manifest.map((item) => {
                const count = grouped.get(item.slug)?.length ?? 0;
                return <tr key={item.slug}><td className="p-3 text-neutral-500">{item.set}</td><td className="p-3 font-medium">{item.name}</td><td className="p-3">{item.color}</td><td className="p-3">{count}/4</td><td className={`p-3 ${count >= 3 ? 'text-emerald-700' : 'text-amber-700'}`}>{count >= 3 ? (count === 4 ? 'Hazır' : '3 görsel · kontrol gerekli') : 'Dosya bekliyor'}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
