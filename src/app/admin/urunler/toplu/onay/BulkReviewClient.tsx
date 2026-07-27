'use client';

import { CheckCircle2, Megaphone, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ReviewProduct = {
  id: string; name: string; description: string; category: string; collection: string;
  imageCount: number; score: number; ready: boolean; copyApproved: boolean;
};

export default function BulkReviewClient({ products }: { products: ReviewProduct[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');

  async function run(action: 'approve-copy' | 'queue' | 'publish') {
    setBusy(action); setMessage('');
    const response = await fetch('/api/admin/products/bulk/workflow', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, ids: selected }),
    });
    const result = await response.json();
    setBusy('');
    if (!response.ok) return setMessage(result.error ?? 'İşlem tamamlanamadı.');
    setMessage(`${result.count} ürün için işlem tamamlandı.`);
    if (action === 'queue' && result.campaignId) router.push(`/admin/kampanyalar?campaign=${result.campaignId}`);
    else router.refresh();
  }

  return (
    <section className="mt-7 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e3d9c8] bg-white p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={selected.length === products.length && products.length > 0}
            onChange={(event) => setSelected(event.target.checked ? products.map((p) => p.id) : [])} />
          Tüm taslakları seç · {selected.length}
        </label>
        <div className="flex flex-wrap gap-2">
          <button disabled={!selected.length || !!busy} onClick={() => run('approve-copy')} className="inline-flex items-center gap-2 rounded-xl border border-[#d8cdbb] px-4 py-2.5 text-sm disabled:opacity-40"><CheckCircle2 className="h-4 w-4" /> Metinleri onayla</button>
          <button disabled={!selected.length || !!busy} onClick={() => run('queue')} className="inline-flex items-center gap-2 rounded-xl bg-[#8d7c55] px-4 py-2.5 text-sm text-white disabled:opacity-40"><Megaphone className="h-4 w-4" /> Reklam kuyruğuna aktar</button>
          <button disabled={!selected.length || !!busy} onClick={() => run('publish')} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm text-white disabled:opacity-40"><Send className="h-4 w-4" /> Hazırları yayınla</button>
        </div>
      </div>
      {message && <p className="rounded-xl bg-[#fff8e8] p-4 text-sm text-[#765f2c]">{message}</p>}
      <div className="grid gap-3">
        {products.map((product) => (
          <label key={product.id} className="grid cursor-pointer gap-4 rounded-2xl border border-[#e3d9c8] bg-white p-5 md:grid-cols-[24px_1fr_auto]">
            <input type="checkbox" checked={selected.includes(product.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} />
            <div>
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-xl">{product.name}</h2><span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px]">{product.category} · {product.collection}</span></div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{product.description}</p>
              <p className="mt-2 text-xs text-neutral-500">{product.imageCount}/3 görsel · Metin {product.copyApproved ? 'onaylı' : 'onay bekliyor'}</p>
            </div>
            <span className={`h-fit rounded-full px-3 py-1.5 text-xs font-semibold ${product.ready ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>%{product.score}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

