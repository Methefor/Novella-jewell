'use client';

import { AlertTriangle, CheckCircle2, LoaderCircle, ScanSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export type ScanProduct = { id: string; name: string; slug: string; category: string; price: number; stock: number; published: boolean; deleted: boolean; images: string[] };
type Candidate = { left: ScanProduct; right: ScanProduct; score: number; imageScore: number; nameScore: number };

const ignoredWords = new Set(['altin', 'gumus', 'tasli', 'yuzuk', 'kupe', 'bilezik', 'bileklik', 'stockholm', 'paris', 'barcelona', 'klasik']);
function words(value: string) { return new Set(value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9ğüşöçıİ]+/g, ' ').split(/\s+/).filter((word) => word.length > 2 && !ignoredWords.has(word))); }
function jaccard(left: string, right: string) { const a = words(left); const b = words(right); const union = new Set([...a, ...b]); if (!union.size) return 0; return [...a].filter((word) => b.has(word)).length / union.size; }
function hammingSimilarity(left: Uint8Array, right: Uint8Array) { let different = 0; for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) different += 1; return 1 - different / left.length; }
async function imageHash(src: string) {
  const image = document.createElement('img'); image.crossOrigin = 'anonymous'; image.decoding = 'async';
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Görsel okunamadı')); image.src = src; });
  const canvas = document.createElement('canvas'); canvas.width = 17; canvas.height = 16;
  const context = canvas.getContext('2d', { willReadFrequently: true }); if (!context) throw new Error('Tarayıcı görsel analizi açılamadı.');
  const side = Math.min(image.naturalWidth, image.naturalHeight) * 0.72; const x = (image.naturalWidth - side) / 2; const y = (image.naturalHeight - side) / 2;
  context.drawImage(image, x, y, side, side, 0, 0, 17, 16);
  const pixels = context.getImageData(0, 0, 17, 16).data; const bits = new Uint8Array(256);
  for (let row = 0; row < 16; row += 1) for (let col = 0; col < 16; col += 1) { const at = (row * 17 + col) * 4; const next = at + 4; const gray = pixels[at] * .299 + pixels[at + 1] * .587 + pixels[at + 2] * .114; const nextGray = pixels[next] * .299 + pixels[next + 1] * .587 + pixels[next + 2] * .114; bits[row * 16 + col] = gray > nextGray ? 1 : 0; }
  return bits;
}

export default function DuplicateScanner({ products }: { products: ScanProduct[] }) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const publishedCount = useMemo(() => products.filter((product) => product.published).length, [products]);
  async function scan() {
    setStatus('scanning'); setProgress(0); setCandidates([]);
    try {
      const hashes = new Map<string, Uint8Array[]>();
      for (let index = 0; index < products.length; index += 1) {
        const product = products[index]; const productHashes: Uint8Array[] = [];
        for (const src of product.images) { try { productHashes.push(await imageHash(src)); } catch { /* Bozuk tek görsel tüm taramayı durdurmaz. */ } }
        hashes.set(product.id, productHashes); setProgress(Math.round(((index + 1) / products.length) * 70));
      }
      const found: Candidate[] = []; let compared = 0; const total = products.length * (products.length - 1) / 2;
      for (let leftIndex = 0; leftIndex < products.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < products.length; rightIndex += 1) {
        const left = products[leftIndex]; const right = products[rightIndex]; compared += 1;
        if (left.category !== right.category) continue;
        const leftHashes = hashes.get(left.id) ?? []; const rightHashes = hashes.get(right.id) ?? [];
        let imageScore = left.images.some((image) => right.images.includes(image)) ? 1 : 0;
        for (const a of leftHashes) for (const b of rightHashes) imageScore = Math.max(imageScore, hammingSimilarity(a, b));
        const nameScore = jaccard(left.name, right.name); const score = imageScore * .85 + nameScore * .15;
        if (score >= .78 || imageScore >= .84 || nameScore >= .72) found.push({ left, right, score, imageScore, nameScore });
        if (compared % 80 === 0) setProgress(70 + Math.round((compared / total) * 30));
      }
      setCandidates(found.sort((a, b) => b.score - a.score).slice(0, 40)); setProgress(100); setStatus('done');
    } catch { setStatus('error'); }
  }
  return <><section className="mt-8 grid gap-3 sm:grid-cols-3"><Metric label="Taranabilir ürün" value={products.length} /><Metric label="Yayında" value={publishedCount} /><Metric label="Olası eşleşme" value={candidates.length} warning={candidates.length > 0} /></section><section className="mt-6 rounded-2xl border border-[#e1d6c5] bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-heading text-2xl">Görsel benzerlik taraması</h2><p className="mt-1 text-xs text-neutral-500">İlk iki görselin merkez yapısı ve ürün adı birlikte değerlendirilir.</p></div><button type="button" onClick={scan} disabled={status === 'scanning'} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white disabled:opacity-50">{status === 'scanning' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}{status === 'scanning' ? `Taranıyor · %${progress}` : status === 'done' ? 'Yeniden tara' : 'Taramayı başlat'}</button></div>{status === 'scanning' && <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee9e1]"><div className="h-full rounded-full bg-[#9b8352] transition-all" style={{ width: `${progress}%` }} /></div>}{status === 'error' && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-800">Bazı görseller tarayıcı tarafından okunamadı. Sayfayı yenileyip tekrar deneyin.</p>}</section>{status === 'done' && <section className="mt-6"><h2 className="font-heading text-3xl">İncelenecek eşleşmeler</h2><div className="mt-4 grid gap-5">{candidates.map((candidate) => <CandidateCard key={`${candidate.left.id}-${candidate.right.id}`} candidate={candidate} />)}{!candidates.length && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" /><p className="mt-3 font-semibold text-emerald-900">Belirgin bir mükerrer aday bulunmadı.</p></div>}</div></section>}</>;
}

function CandidateCard({ candidate }: { candidate: Candidate }) { return <article className="overflow-hidden rounded-2xl border border-amber-200 bg-white"><div className="flex items-center justify-between gap-3 bg-amber-50 px-5 py-3"><span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-900"><AlertTriangle className="h-4 w-4" />Olası mükerrer · %{Math.round(candidate.score * 100)}</span><span className="text-[10px] text-amber-800">Görsel %{Math.round(candidate.imageScore * 100)} · Ad %{Math.round(candidate.nameScore * 100)}</span></div><div className="grid md:grid-cols-2">{[candidate.left, candidate.right].map((product, index) => <div key={product.id} className={`p-5 ${index ? 'border-t md:border-l md:border-t-0' : ''} border-[#eee7dc]`}><div className="grid grid-cols-[110px_1fr] gap-4"><div className="relative aspect-square overflow-hidden rounded-xl bg-[#eee9e1]"><Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="110px" /></div><div><span className={`rounded-full px-2 py-1 text-[10px] ${product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>{product.published ? 'Yayında' : 'Taslak'}</span><h3 className="mt-2 font-heading text-xl leading-tight">{product.name}</h3><p className="mt-2 text-xs text-neutral-500">{product.price.toLocaleString('tr-TR')} ₺ · Stok {product.stock}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><Link href={`/admin/urunler/${encodeURIComponent(product.id)}`} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white">Düzenle</Link>{product.published && <Link href={`/urun/${product.slug}`} target="_blank" className="rounded-lg border border-[#d8cdbb] px-4 py-2 text-xs font-semibold">Mağazada aç</Link>}</div></div>)}</div></article>; }
function Metric({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) { return <div className={`rounded-2xl border p-5 ${warning ? 'border-amber-200 bg-amber-50' : 'border-[#e1d6c5] bg-white'}`}><p className="text-xs text-neutral-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>; }
