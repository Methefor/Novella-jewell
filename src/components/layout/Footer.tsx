import { Instagram, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Koleksiyonlar', href: '/collections' },
  { label: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
  { label: 'Hikayemiz', href: '/hikayemiz' },
  { label: 'Favorilerim', href: '/favoriler' },
];

const helpLinks = [
  { label: 'Kargo & Teslimat', href: '/kargo' },
  { label: 'İade Koşulları', href: '/iade' },
  { label: 'Sık Sorulan Sorular', href: '/#sss' },
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
              <span className="font-serif text-2xl font-light tracking-tight">
                NOVELLA
              </span>
            </Link>
            <p
              className="font-sans font-light leading-relaxed mb-6"
              style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}
            >
              El seçimi 316L paslanmaz çelik takılar.
              <br />
              Her parça bir hikaye.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/jewelry.novella/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')
                }
                aria-label="Instagram"
              >
                <Instagram
                  className="w-4 h-4"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=905451125059"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')
                }
                aria-label="WhatsApp"
              >
                <MessageCircle
                  className="w-4 h-4"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="section-label text-white/30 mb-5">Sayfalar</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans font-light transition-colors duration-200"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help + contact */}
          <div>
            <p className="section-label text-white/30 mb-5">Yardım</p>
            <ul className="space-y-3 mb-8">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans font-light transition-colors duration-200"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="section-label text-white/30 mb-3">İletişim</p>
            <a
              href="https://api.whatsapp.com/send?phone=905451125059"
              className="font-sans font-light transition-colors duration-200"
              style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseOut={(e) =>
                (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
              }
            >
              +90 545 112 50 59
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span
            className="font-sans font-light"
            style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}
          >
            © {year} Novella. Tüm hakları saklıdır.
          </span>
          <span
            className="flex items-center gap-1.5 font-sans font-light"
            style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ backgroundColor: '#b8a574' }}
            />
            316L Paslanmaz Çelik
          </span>
        </div>
      </div>
    </footer>
  );
}
