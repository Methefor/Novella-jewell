'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Gift, ArrowRight } from 'lucide-react'

export default function GiftExperience() {
  return (
    <section className="section bg-cream">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold via-gold-light to-rose-gold p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              {/* Icon */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Özel Deneyim</span>
              </div>

              {/* Heading */}
              <h2 className="text-h2 md:text-display-sm font-heading font-bold mb-4">
                Her Paket Bir Hediye
              </h2>

              {/* Description */}
              <p className="text-body-lg mb-6 text-white/90 leading-relaxed">
                Açmaya kıyamayacağınız özel kutular içinde dostlarınıza kavuşun. 
                Her ürün, kişiye özel not kartı ve lüks packaging ile geliyor.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Premium kalite kutular ve torbalarda
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span className="text-white/90">
                    Kişiye özel mesaj kartı ekleme imkanı
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span className="text-white/90">
                    İsim baskısı hizmeti tamamen ücretsiz
                  </span>
                </li>
              </ul>

              {/* CTA */}
              <Link
                href="/collections/hediye-setleri"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gold rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Hediye Setlerini Keşfet
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-auto lg:h-[400px]"
            >
              {/* 
                GERÇEK PACKAGING GÖRSELİ EKLENECEK:
                <Image
                  src="/images/gift-packaging.jpg"
                  alt="NOVELLA Hediye Paketleme"
                  fill
                  className="object-contain"
                />
              */}
              
              {/* Temporary Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20">
                <div className="text-center text-white/80">
                  <Gift className="w-24 h-24 mx-auto mb-4" />
                  <p className="text-sm">
                    Packaging Görseli<br />Eklenecek
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
