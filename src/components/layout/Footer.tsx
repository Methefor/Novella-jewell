import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-gray-900">
                NOVELLA
              </span>
            </Link>
            <p className="text-sm text-gray-600">Her parça bir hikaye</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Alışveriş</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/collections"
                  className="text-sm text-gray-600 hover:text-gold"
                >
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/yeni-gelenler"
                  className="text-sm text-gray-600 hover:text-gold"
                >
                  Yeni Gelenler
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gold"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gold"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Takip Edin</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/jewelry.novella"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-gray-500">
            © {year} NOVELLA. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
