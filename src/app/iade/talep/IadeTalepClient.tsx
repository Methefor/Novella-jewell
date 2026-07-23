'use client';

import { SITE } from '@/lib/config';
import { motion } from 'framer-motion';
import { AlertCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const SEBEPLER = [
  'Fikrimi değiştirdim',
  'Ürün beklediğim gibi değil',
  'Ürün hatalı / kusurlu geldi',
  'Yanlış ürün geldi',
  'Beden / model değişimi istiyorum',
] as const;

/**
 * İade talep formu — talebi yapılandırılmış bir WhatsApp mesajına çevirir.
 * Böylece talepler sipariş no + sebep formatında standart gelir; ayrı bir
 * backend/e-posta altyapısı gerekmez.
 */
export default function IadeTalepClient() {
  const [orderNo, setOrderNo] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [sebep, setSebep] = useState<string>(SEBEPLER[0]);
  const [aciklama, setAciklama] = useState('');

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    const mesaj = [
      'Merhaba, iade talebi oluşturmak istiyorum.',
      `Sipariş no: ${orderNo.trim()}`,
      `Ad soyad: ${adSoyad.trim()}`,
      `Sebep: ${sebep}`,
      aciklama.trim() ? `Açıklama: ${aciklama.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    window.open(
      `https://api.whatsapp.com/send?phone=${SITE.whatsapp}&text=${encodeURIComponent(mesaj)}`,
      '_blank',
      'noopener'
    );
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
          <p className="section-label mb-3">14 gün içinde koşulsuz</p>
          <h1
            className="font-serif font-light text-3xl md:text-4xl text-black mb-3"
            style={{ letterSpacing: '-0.02em' }}
          >
            İade Talebi
          </h1>
          <p className="text-sm text-black/50 mb-6">
            Formu doldurun, talebiniz WhatsApp üzerinden bize ulaşsın — iade
            kargo kodunuzu aynı gün iletelim.
          </p>

          <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-champagne/50 p-4 mb-8">
            <AlertCircle className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
            <p className="text-xs text-black/60 leading-relaxed">
              Küpeler hijyen nedeniyle yalnızca <strong>ambalajı açılmamışsa</strong>{' '}
              iade edilebilir. Kişiye özel (isim baskılı) ürünler iade
              kapsamı dışındadır. Hatalı veya yanlış gelen ürünlerde bu
              istisnalar geçerli değildir — detaylar için{' '}
              <Link href="/iade" className="text-gold-dark underline">
                iade koşulları
              </Link>
              .
            </p>
          </div>

          <form onSubmit={gonder} className="space-y-4">
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
              type="text"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              placeholder="Ad soyad"
              required
              className={inputCls}
              aria-label="Ad soyad"
            />
            <select
              value={sebep}
              onChange={(e) => setSebep(e.target.value)}
              className={inputCls}
              aria-label="İade sebebi"
            >
              {SEBEPLER.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={3}
              placeholder="Eklemek istedikleriniz (opsiyonel)"
              className={`${inputCls} resize-none`}
              aria-label="Açıklama"
            />
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp ile Talebi Gönder
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
