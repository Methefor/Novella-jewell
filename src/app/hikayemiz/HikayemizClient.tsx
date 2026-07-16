'use client';

import { COLLECTIONS } from '@/data/collections';
import { SHIPPING } from '@/lib/config';
import { CAYMA_SURESI_GUN } from '@/lib/legal';
import { motion } from 'framer-motion';
import { Droplets, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease },
  }),
};

/** Malzeme sözümüz — her biri somut bir teknik iddia */
const promises = [
  {
    icon: ShieldCheck,
    title: '316L cerrahi çelik',
    body: 'Ameliyat aletlerinde kullanılan alaşım. Nikel salınımı düşük olduğu için hassas ciltlerde bile kızarıklık yapmaz.',
  },
  {
    icon: Droplets,
    title: 'Suyla arası iyi',
    body: 'Duşta, denizde, havuzda çıkarmanız gerekmez. Krom oksit tabakası çeliği oksitlenmeye karşı korur.',
  },
  {
    icon: Sparkles,
    title: 'Kararmaz, solmaz',
    body: 'Gümüş gibi kararmaz, kaplama takılar gibi birkaç ayda rengini bırakmaz. İlk günkü tonunu korur.',
  },
  {
    icon: Gift,
    title: 'Hediye kutusunda',
    body: 'Her sipariş, üzerine not yazabileceğiniz özel kutusunda ve keten kesesinde gelir.',
  },
];

export default function HikayemizClient() {
  return (
    <main className="bg-cream">
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-champagne">
        <div className="absolute inset-0 texture-gold" aria-hidden="true" />
        <div className="absolute inset-0 texture-lines" aria-hidden="true" />

        <div className="container-custom relative py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold-dark">
                Hikayemiz
              </p>
            </div>

            <h1
              className="font-serif font-light text-black text-balance mb-8"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Novella,{' '}
              <span className="italic text-gold-dark">kısa hikaye</span> demek.
            </h1>

            <p
              className="font-sans font-light text-black/60 max-w-xl text-balance"
              style={{ fontSize: '17px', lineHeight: 1.75 }}
            >
              Bir takının anlatacak bir şeyi olmalı. Biz de her parçayı, bir
              şehirde geçen kısa bir hikaye gibi tasarlıyoruz — ve o hikayenin
              yıllar sonra da okunabilmesi için çelikten yapıyoruz.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/40" aria-hidden="true" />
      </section>

      {/* ───────────────── Neden çelik ───────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={0}
              className="lg:col-span-4"
            >
              <p className="section-label mb-4">Neden çelik</p>
              <h2
                className="font-serif font-light text-black text-balance"
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                }}
              >
                Çekmecede kararan takılardan bıktık.
              </h2>
              <hr className="rule-gold mt-7 w-24" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={0.12}
              className="lg:col-span-8 space-y-6"
            >
              <p
                className="font-sans font-light text-black/70"
                style={{ fontSize: '16px', lineHeight: 1.85 }}
              >
                Hepimizin çekmecesinde bir kutu var: bir zamanlar çok sevilmiş,
                sonra kararmış, yeşil iz bırakmış, kaplaması dökülmüş takılar.
                Novella tam olarak o kutuya bir cevap olarak doğdu.
              </p>
              <p
                className="font-sans font-light text-black/70"
                style={{ fontSize: '16px', lineHeight: 1.85 }}
              >
                Sorunun tasarımda değil malzemede olduğunu fark ettik. Güzel bir
                takıyı birkaç ay sonra takılamaz hale getiren şey biçimi değil,
                neyden yapıldığı. Bu yüzden işe malzemeden başladık ve{' '}
                <strong className="font-medium text-black">
                  316L cerrahi çelikte
                </strong>{' '}
                karar kıldık — ameliyathanede güvenilen, suyla ve terle sorunu
                olmayan, kararmayan bir alaşım.
              </p>
              <p
                className="font-sans font-light text-black/70"
                style={{ fontSize: '16px', lineHeight: 1.85 }}
              >
                Bu seçim bize bir söz verdirdi: Novella&apos;dan aldığınız bir
                parçayı <em className="italic">özel gün</em> beklemeden takın.
                Duşta çıkarmayın, denize girerken düşünmeyin, kutuya kaldırmayın.
                Bir takı ancak takıldığında bir hikaye biriktirir.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── Malzeme sözümüz ───────────────── */}
      <section className="py-20 md:py-24 bg-cream-deep border-y border-border">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
            className="mb-12 md:mb-16 max-w-2xl"
          >
            <p className="section-label mb-4">Sözümüz</p>
            <h2
              className="font-serif font-light text-black text-balance"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
              }}
            >
              Pazarlama cümlesi değil, malzeme gerçeği.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {promises.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i * 0.08}
              >
                <div
                  className="w-11 h-11 rounded-full bg-white border border-gold/30 flex items-center justify-center mb-5"
                  aria-hidden="true"
                >
                  <Icon className="w-[18px] h-[18px] text-gold-dark" strokeWidth={1.5} />
                </div>
                <h3
                  className="font-serif font-light text-black mb-2.5"
                  style={{ fontSize: '1.3rem', letterSpacing: '-0.015em' }}
                >
                  {title}
                </h3>
                <p
                  className="font-sans font-light text-black/55"
                  style={{ fontSize: '14px', lineHeight: 1.7 }}
                >
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Koleksiyon felsefesi ───────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
            className="max-w-2xl mb-12 md:mb-16"
          >
            <p className="section-label mb-4">Koleksiyonlar</p>
            <h2
              className="font-serif font-light text-black text-balance mb-6"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
              }}
            >
              Her şehrin bir tonu var.
            </h2>
            <p
              className="font-sans font-light text-black/60"
              style={{ fontSize: '16px', lineHeight: 1.8 }}
            >
              Koleksiyonlarımızı şehirlerden topluyoruz — çünkü bir şehrin ışığı,
              temposu ve sessizliği bir tasarımı bir renkten daha iyi anlatıyor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {COLLECTIONS.map((col, i) => (
              <motion.article
                key={col.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i * 0.08}
                className="border-t border-border pt-7"
              >
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3
                    className="font-serif font-light text-black"
                    style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}
                  >
                    {col.sehir || 'Klasikler'}
                  </h3>
                  <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-gold-dark flex-shrink-0">
                    {col.ton}
                  </span>
                </div>
                <p
                  className="font-sans font-light text-black/60 mb-5"
                  style={{ fontSize: '14.5px', lineHeight: 1.8 }}
                >
                  {col.hikaye}
                </p>
                <Link
                  href={`/koleksiyonlar/${col.slug}`}
                  className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-black/50 hover:text-gold-dark transition-colors group"
                >
                  {col.sehir || 'Klasikler'} koleksiyonunu gör
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Kapanış / CTA ───────────────── */}
      <section className="relative overflow-hidden bg-champagne border-t border-gold/30">
        <div className="absolute inset-0 texture-gold" aria-hidden="true" />
        <div className="container-custom relative py-20 md:py-28 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0}
            className="max-w-2xl mx-auto"
          >
            <h2
              className="font-serif font-light text-black text-balance mb-6"
              style={{
                fontSize: 'clamp(1.9rem, 3.6vw, 2.9rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
              }}
            >
              Sıradaki hikaye sizin.
            </h2>
            <p
              className="font-sans font-light text-black/60 mb-9 text-balance"
              style={{ fontSize: '16px', lineHeight: 1.75 }}
            >
              Bir parça seçin, biz kutusunu hazırlayalım.{' '}
              {SHIPPING.freeThreshold.toLocaleString('tr-TR')} ₺ üzeri
              siparişlerde kargo bizden, {CAYMA_SURESI_GUN} gün cayma hakkı.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/koleksiyonlar"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white rounded-full hover:bg-gold transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link
                href="/collections/yeni-gelenler"
                className="inline-flex items-center justify-center px-8 py-3.5 text-black border border-gold/45 rounded-full hover:border-gold hover:bg-white/45 transition-colors duration-300 text-sm font-medium"
              >
                Yeni Gelenler
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
