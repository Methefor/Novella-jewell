'use client';

import { Check, Clipboard, Download, Film, LoaderCircle, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export type MotionProduct = { id: string; name: string; slug: string; price: number; images: string[] };
type SelectedAsset = { key: string; productId: string; productName: string; image: string };

const formats = [
  { id: 'story', label: 'Story · 9:16', composition: 'Novella-YuzukLansmani-Story', output: 'story' },
  { id: 'feed', label: 'Akış · 4:5', composition: 'Novella-YuzukLansmani-Feed', output: 'feed' },
  { id: 'square', label: 'Kare · 1:1', composition: 'Novella-YuzukLansmani-Square', output: 'square' },
] as const;

const remotionPath = (src: string) => (src.startsWith('/') ? src.slice(1) : src);

export default function ContentStudioClient({ products }: { products: MotionProduct[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SelectedAsset[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(formats.map((format) => format.id));
  const [headline, setHeadline] = useState('Özgün parçalar.');
  const [subheadline, setSubheadline] = useState('Ulaşılabilir bir lüks.');
  const [cta, setCta] = useState('Yeni yüzükleri keşfet');
  const [copied, setCopied] = useState(false);
  const [renderState, setRenderState] = useState<{ status: 'idle' | 'rendering' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return normalized ? products.filter((product) => product.name.toLocaleLowerCase('tr-TR').includes(normalized)) : products;
  }, [products, query]);
  const props = useMemo(() => ({ gorseller: selected.map((asset) => remotionPath(asset.image)), baslik: headline.trim(), altBaslik: subheadline.trim(), cta: cta.trim() }), [selected, headline, subheadline, cta]);
  const ready = selected.length === 3 && selectedFormats.length > 0 && Boolean(headline.trim());
  const commands = formats.filter((format) => selectedFormats.includes(format.id)).map((format) => `npm run studio:render -- ${format.composition} out/novella-yuzuk-lansmani-${format.output}.mp4 --props=out/novella-yuzuk-lansmani-props.json`).join('\n');

  function toggleAsset(product: MotionProduct, image: string) {
    const key = `${product.id}:${image}`;
    if (selected.some((asset) => asset.key === key)) return setSelected((current) => current.filter((asset) => asset.key !== key));
    if (selected.length >= 3) return;
    setSelected((current) => [...current, { key, productId: product.id, productName: product.name, image }]);
  }
  function toggleFormat(id: string) { setSelectedFormats((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function downloadProps() {
    if (!ready) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(props, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'novella-yuzuk-lansmani-props.json'; anchor.click(); URL.revokeObjectURL(url);
  }
  async function copyCommands() { if (!ready) return; await navigator.clipboard.writeText(commands); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  async function renderOnComputer() {
    if (!ready || renderState.status === 'rendering') return;
    setRenderState({ status: 'rendering', message: 'Videolar bilgisayarında hazırlanıyor. Bu işlem birkaç dakika sürebilir.' });
    try {
      const response = await fetch('http://127.0.0.1:4317/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ props, formats: selectedFormats }),
      });
      const result = await response.json().catch(() => null) as { error?: string; outputs?: string[] } | null;
      if (!response.ok) throw new Error(result?.error || 'Render işlemi tamamlanamadı.');
      setRenderState({ status: 'success', message: `${result?.outputs?.length ?? selectedFormats.length} video studio/out klasörüne kaydedildi.` });
    } catch (error) {
      const message = error instanceof TypeError
        ? 'Render Köprüsü kapalı. Proje klasöründe npm run studio:bridge komutunu çalıştırıp tekrar deneyin.'
        : error instanceof Error ? error.message : 'Render işlemi tamamlanamadı.';
      setRenderState({ status: 'error', message });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
      <section className="rounded-3xl border border-[#ded3c3] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#947d4e]">01 · Görsel seçimi</p><h2 className="mt-2 font-heading text-3xl">Üç karelik hikâyeyi kur</h2></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selected.length === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-[#eee7db] text-neutral-700'}`}>{selected.length} / 3 seçildi</span></div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => { const asset = selected[slot]; return <div key={slot} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eee9e1]">{asset ? <><Image src={asset.image} alt={asset.productName} fill className="object-cover" sizes="240px" /><button type="button" onClick={() => setSelected((current) => current.filter((item) => item.key !== asset.key))} aria-label={`${asset.productName} görselini kaldır`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow"><X className="h-4 w-4" /></button><span className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/65 px-2 py-1 text-[10px] text-white backdrop-blur-sm">{asset.productName}</span></> : <div className="grid h-full place-items-center text-center text-xs text-neutral-400">Kare {slot + 1}</div>}</div>; })}
        </div>
        <label className="mt-7 flex items-center gap-3 rounded-xl border border-[#ded3c3] bg-[#faf8f4] px-4 py-3"><Search className="h-4 w-4 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Yüzük ara" className="w-full border-0 bg-transparent p-0 text-sm outline-none ring-0 focus:ring-0" /></label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-[#e7ded1] bg-[#fbfaf7]"><div className="grid grid-cols-2 gap-px bg-[#e7ded1]">{product.images.slice(0, 4).map((image, imageIndex) => { const key = `${product.id}:${image}`; const isSelected = selected.some((asset) => asset.key === key); return <button key={key} type="button" onClick={() => toggleAsset(product, image)} aria-pressed={isSelected} disabled={!isSelected && selected.length >= 3} className="group relative aspect-square overflow-hidden bg-[#eee9e1] disabled:cursor-not-allowed disabled:opacity-45"><Image src={image} alt={`${product.name} ${imageIndex + 1}. görsel`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="180px" />{isSelected && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black text-white"><Check className="h-4 w-4" /></span>}</button>; })}</div><div className="p-4"><h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3><p className="mt-1 text-xs text-neutral-500">{product.price.toLocaleString('tr-TR')} ₺ · {product.images.length} görsel</p></div></article>)}
        </div>
      </section>
      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <section className="overflow-hidden rounded-3xl bg-[#171713] p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c7ad70]">Canlı taslak</p><div className="relative mx-auto mt-5 aspect-[9/16] max-h-[510px] overflow-hidden rounded-[2rem] bg-[#302d27]"><div className="absolute inset-0 grid grid-cols-3">{selected.map((asset) => <div key={asset.key} className="relative"><Image src={asset.image} alt="" fill className="object-cover opacity-75" sizes="180px" /></div>)}</div><div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" /><div className="absolute bottom-0 left-0 right-0 p-6"><p className="font-heading text-3xl leading-none">{headline || 'Başlık'}</p><p className="mt-2 text-sm text-white/75">{subheadline || 'Alt başlık'}</p><span className="mt-5 inline-flex rounded-full border border-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.16em]">{cta || 'CTA'}</span></div></div></section>
        <section className="rounded-3xl border border-[#ded3c3] bg-white p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#947d4e]">02 · Metin ve format</p><div className="mt-4 space-y-3"><TextField label="Başlık" value={headline} onChange={setHeadline} /><TextField label="Alt başlık" value={subheadline} onChange={setSubheadline} /><TextField label="CTA" value={cta} onChange={setCta} /></div><div className="mt-5 flex flex-wrap gap-2">{formats.map((format) => { const active = selectedFormats.includes(format.id); return <button key={format.id} type="button" onClick={() => toggleFormat(format.id)} className={`rounded-full px-3 py-2 text-xs font-semibold ${active ? 'bg-black text-white' : 'bg-[#eee9e1] text-neutral-600'}`}>{format.label}</button>; })}</div></section>
        <section className="rounded-3xl border border-[#ded3c3] bg-white p-6"><div className="flex items-center gap-2"><Film className="h-5 w-5" /><h2 className="font-heading text-2xl">Video üretimi</h2></div><p className="mt-2 text-xs leading-relaxed text-neutral-500">Bilgisayarında bir kez <strong>npm run studio:bridge</strong> komutunu çalıştır. Ardından seçili formatların tamamını buradan oluşturabilirsin. Bu işlem paylaşım yapmaz.</p>{!ready && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Devam etmek için tam 3 görsel, en az 1 format ve bir başlık seçin.</p>}{renderState.message && <p className={`mt-4 rounded-xl p-3 text-xs ${renderState.status === 'success' ? 'bg-emerald-50 text-emerald-800' : renderState.status === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-blue-50 text-blue-800'}`}>{renderState.message}</p>}<div className="mt-4 grid gap-2"><button type="button" disabled={!ready || renderState.status === 'rendering'} onClick={renderOnComputer} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white disabled:opacity-35">{renderState.status === 'rendering' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}{renderState.status === 'rendering' ? 'Videolar hazırlanıyor' : 'Videoları bilgisayarımda oluştur'}</button><details className="rounded-xl border border-[#e2d8c8] p-3"><summary className="cursor-pointer text-xs font-semibold text-neutral-600">Manuel üretim seçenekleri</summary><div className="mt-3 grid gap-2"><button type="button" disabled={!ready} onClick={downloadProps} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#eee9e1] px-4 text-xs font-semibold disabled:opacity-35"><Download className="h-4 w-4" />JSON paketini indir</button><button type="button" disabled={!ready} onClick={copyCommands} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d6cab8] px-4 text-xs font-semibold disabled:opacity-35">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? 'Komutlar kopyalandı' : 'Render komutlarını kopyala'}</button></div></details></div></section>
      </aside>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="mb-1.5 block text-xs font-medium text-neutral-600">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-[#d6cab8] bg-[#faf8f4] text-sm focus:border-black focus:ring-black" /></label>; }
