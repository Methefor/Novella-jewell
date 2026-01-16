'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Kalite',
    description: 'Paslanmaz çelik ve kaliteli malzemelerle üretilmiş, uzun ömürlü tasarımlar.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli Alışveriş',
    description: '256-bit SSL sertifikası ile korunan güvenli ödeme sistemi.',
  },
  {
    icon: Truck,
    title: 'Ücretsiz Kargo',
    description: 'Türkiye geneli tüm siparişlerde ücretsiz ve hızlı kargo.',
  },
  {
    icon: RefreshCw,
    title: 'Kolay İade',
    description: '14 gün içinde koşulsuz iade ve değişim garantisi.',
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a] py-20">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-4 inline-block w-fit rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-inter text-sm font-medium text-gold">
              HAKKIMIZDA
            </span>

            <h2 className="mb-6 font-cormorant text-5xl font-bold leading-tight text-white md:text-6xl">
              Her Parça
              <br />
              <span className="text-gradient">Bir Hikaye</span>
            </h2>

            <p className="mb-6 font-inter text-lg leading-relaxed text-white/70">
              NOVELLA, İtalyanca "yeni hikaye" anlamına gelir. Her ürünümüz, sizin
              yeni hikayenizin bir parçası olmak için özenle tasarlandı.
            </p>

            <p className="mb-8 font-inter text-lg leading-relaxed text-white/70">
              Tekirdağ'dan Türkiye'ye uzanan yolculuğumuzda, kaliteyi ve estetiği
              bir araya getirerek, herkesin erişebileceği premium takılar sunuyoruz.
              Paslanmaz çelik ürünlerimiz, hem dayanıklılığı hem de şıklığı
              barındırıyor.
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-6">
              <div>
                <div className="mb-1 font-cormorant text-4xl font-bold text-gold">500+</div>
                <div className="font-inter text-sm text-white/60">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="mb-1 font-cormorant text-4xl font-bold text-gold">200+</div>
                <div className="font-inter text-sm text-white/60">Benzersiz Tasarım</div>
              </div>
              <div>
                <div className="mb-1 font-cormorant text-4xl font-bold text-gold">4.8</div>
                <div className="font-inter text-sm text-white/60">Müşteri Puanı</div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gold-gradient px-8 py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30"
              >
                Hikayemizi Keşfet
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Image Placeholder */}
            <div className="glass-strong relative aspect-[4/5] overflow-hidden rounded-3xl">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 via-rose-gold/10 to-gold/20">
                <div className="text-center">
                  <div className="mb-4 font-cormorant text-8xl text-white/20">N</div>
                  <p className="font-inter text-sm text-white/40">
                    Lifestyle fotoğrafı buraya gelecek
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="glass absolute right-6 top-6 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <div className="font-cormorant text-lg font-semibold text-white">
                      Premium
                    </div>
                    <div className="font-inter text-xs text-white/60">Kalite Garantisi</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="glass absolute bottom-6 left-6 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-gold/20">
                    <ShieldCheck className="h-6 w-6 text-rose-gold" />
                  </div>
                  <div>
                    <div className="font-cormorant text-lg font-semibold text-white">
                      Güvenli
                    </div>
                    <div className="font-inter text-xs text-white/60">Alışveriş</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass group rounded-2xl p-6 transition-all hover:bg-white/10"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 transition-all group-hover:scale-110">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>

              <h3 className="mb-2 font-cormorant text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="font-inter text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
