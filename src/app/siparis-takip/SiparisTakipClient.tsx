'use client';

import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';
import { useState } from 'react';

interface DurumSonucu {
  orderNo: string;
  durum: string;
  aciklama: string;
  items: { ad: string; adet: number }[];
  total: string;
  createdAt: string;
}

/**
 * Sipariş takip — sipariş no + e-posta ile durum sorgular.
 * Bilgi güvenliği: e-posta eşleşmeden sunucu hiçbir veri dönmez.
 */
export default function SiparisTakipClient() {
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [sonuc, setSonuc] = useState<DurumSonucu | null>(null);

  const sorgula = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHata(null);
    setSonuc(null);
    try {
      const res = await fetch('/api/siparis-durum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Sorgulama başarısız.');
      setSonuc(data as DurumSonucu);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Sorgulama başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 border border-black/15 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors bg-white';

  return (
    <main className="min-h-[70vh] bg-white pt-28 pb-24 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">Siparişim nerede?</p>
          <h1
            className="font-serif font-light text-3xl md:text-4xl text-black mb-3"
            style={{ letterSpacing: '-0.02em' }}
          >
            Sipariş Takip
          </h1>
          <p className="text-sm text-black/50 mb-10">
            Sipariş numaranızı (örn. NJ-2026-0001) ve sipariş verirken
            kullandığınız e-posta adresinizi girin.
          </p>

          <form onSubmit={sorgula} className="space-y-4">
            <input
              type="text"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="Sipariş numarası (NJ-2026-0001)"
              required
              className={inputCls}
              aria-label="Sipariş numarası"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              className={inputCls}
              aria-label="E-posta adresi"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Sorgulanıyor…' : 'Siparişimi Sorgula'}
            </button>
          </form>

          {hata && (
            <p className="mt-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              {hata}
            </p>
          )}

          {sonuc && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-gold/25 bg-champagne/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Package className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="text-xs text-black/45">{sonuc.orderNo}</p>
                  <p className="font-medium text-black">{sonuc.durum}</p>
                </div>
              </div>
              <p className="text-sm text-black/60 mb-4">{sonuc.aciklama}</p>
              <ul className="text-sm text-black/70 space-y-1 border-t border-gold/20 pt-4">
                {sonuc.items.map((i, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{i.ad}</span>
                    <span className="text-black/45">× {i.adet}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm font-medium text-black border-t border-gold/20 pt-3 mt-3">
                <span>Toplam</span>
                <span>{Number(sonuc.total).toLocaleString('tr-TR')} ₺</span>
              </div>
            </motion.div>
          )}

          <p className="mt-10 text-xs text-black/40">
            Sorun mu yaşıyorsunuz?{' '}
            <a
              href="https://wa.me/905451125059"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-dark hover:underline"
            >
              WhatsApp&apos;tan yazın
            </a>
            , hemen yardımcı olalım.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
