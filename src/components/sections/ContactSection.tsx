'use client';

import { Instagram, Mail, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="iletisim" className="py-20 bg-black scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            İletişim
          </h2>
          <p className="text-lg text-white/70">
            Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk
            duyarız.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a
            href="mailto:novella.jewellery.tr@gmail.com"
            className="flex flex-col items-center p-6 bg-gray-900 border border-white/10 rounded-lg hover:bg-gray-800 hover:border-gold/50 hover:shadow-gold transition-all group"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-gold/30 transition-colors">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-medium text-white mb-1">E-posta</h3>
            <p className="text-sm text-white/60 text-center break-all">
              novella.jewellery.tr@gmail.com
            </p>
          </a>

          <a
            href="https://wa.me/905451125059"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-gray-900 border border-white/10 rounded-lg hover:bg-gray-800 hover:border-gold/50 hover:shadow-gold transition-all group"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-gold/30 transition-colors">
              <Phone className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-medium text-white mb-1">WhatsApp</h3>
            <p className="text-sm text-white/60">0545 112 50 59</p>
          </a>

          <a
            href="https://www.instagram.com/jewelry.novella/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-gray-900 border border-white/10 rounded-lg hover:bg-gray-800 hover:border-gold/50 hover:shadow-gold transition-all group"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-gold/30 transition-colors">
              <Instagram className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-medium text-white mb-1">Instagram</h3>
            <p className="text-sm text-white/60">@jewelry.novella</p>
          </a>
        </div>
      </div>
    </section>
  );
}
