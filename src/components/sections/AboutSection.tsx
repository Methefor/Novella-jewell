'use client';

import { Heart, Shield, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="hakkimizda" className="py-20 bg-gray-900 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Her Parça Bir Hikaye
          </h2>
          <p className="text-lg text-white/70">
            NOVELLA olarak, her takının bir hikayesi olduğuna inanıyoruz. Sizin
            için özenle seçilmiş koleksiyonlarımızla, her anınıza değer
            katıyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 hover:border-gold/30 transition-all">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">
              Kaliteli Ürünler
            </h3>
            <p className="text-white/60">
              Paslanmaz çelik ve kaliteli kaplama ile uzun ömürlü takılar
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 hover:border-gold/30 transition-all">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">
              Özenle Seçilmiş
            </h3>
            <p className="text-white/60">
              Her parça, trendleri takip ederek özenle seçiliyor
            </p>
          </div>

          <div className="text-center p-6 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 hover:border-gold/30 transition-all">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">
              Güvenli Alışveriş
            </h3>
            <p className="text-white/60">
              Hızlı kargo ve kolay iade ile güvenli alışveriş deneyimi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
