import { Instagram, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Koleksiyonlar', href: '/koleksiyonlar' },
  { label: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
  { label: 'Hikayemiz', href: '/hikayemiz' },
  { label: 'Takı Rehberi', href: '/rehber' },
  { label: 'Favorilerim', href: '/favoriler' },
];

const helpLinks = [
  { label: 'Sipariş Takip', href: '/siparis-takip' },
  { label: 'Sık Sorulan Sorular', href: '/sss' },
  { label: 'Kargo & Teslimat', href: '/kargo' },
  { label: 'İade & Cayma Hakkı', href: '/iade' },
  { label: 'İletişim', href: '/iletisim' },
];

// 6563 sayılı e-ticaret kanunu ve KVKK gereği her sayfadan erişilebilir olmalı.
const legalLinks = [
  { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
  { label: 'Ön Bilgilendirme Formu', href: '/on-bilgilendirme' },
  { label: 'Gizlilik Politikası', href: '/gizlilik' },
  { label: 'KVKK Aydınlatma Metni', href: '/kvkk' },
  { label: 'Çerez Politikası', href: '/cerez-politikasi' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="container-custom py-12 md:py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10 md:mb-14">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <span className="font-serif text-2xl font-light tracking-[0.15em]">
                NOVELLA
              </span>
            </Link>
            <p className="font-sans font-light leading-relaxed mb-6 text-white/55 text-sm">
              El seçimi 316L paslanmaz çelik takılar.
              <br />
              Her parça bir hikaye taşıyan zarafet.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/jewelry.novella/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                <Instagram className="w-4 h-4 text-white/55" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=905451125059"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 text-white/55" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="section-label text-white/35 mb-5">Sayfalar</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans font-light text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help + contact */}
          <div>
            <p className="section-label text-white/35 mb-5">Yardım</p>
            <ul className="space-y-3 mb-8">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans font-light text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="section-label text-white/35 mb-3">İletişim</p>
            <a
              href="https://api.whatsapp.com/send?phone=905451125059"
              className="font-sans font-light text-sm text-white/55 hover:text-white transition-colors duration-200"
            >
              +90 545 112 50 59
            </a>
          </div>
        </div>

        {/* Yasal linkler — her sayfadan erişilebilir olması zorunlu.
            Mobilde alt alta sarar, dokunma hedefleri ayrıştırılmıştır. */}
        <nav
          aria-label="Yasal bilgiler"
          className="pt-6 pb-5 border-t border-white/7"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans font-light text-[11px] text-white/40 hover:text-white/75 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/7">
          <span className="font-sans font-light text-[11px] text-white/30 text-center sm:text-left">
            © {year} Novella. Tüm hakları saklıdır.
          </span>
          <span className="flex items-center gap-1.5 font-sans font-light text-[11px] text-white/30">
            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 bg-gold" />
            316L Paslanmaz Çelik
          </span>
        </div>
      </div>
    </footer>
  );
}
