import { Metadata } from 'next';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'İade & Değişim | NOVELLA',
  description: 'İade ve değişim koşulları',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <RefreshCw className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
            İade & Değişim
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            14 gün içinde koşulsuz iade ve değişim hakkınız
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Return Policy */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                İade Koşulları
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-inter font-semibold text-white">
                  Süre
                </h3>
                <p className="font-inter text-white/70">
                  Siparişinizi teslim aldığınız tarihten itibaren 14 gün içinde
                  iade edebilirsiniz.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-inter font-semibold text-white">
                  Koşullar
                </h3>
                <ul className="space-y-2 font-inter text-white/70">
                  <li>• Ürün orijinal ambalajında olmalıdır</li>
                  <li>• Ürün kullanılmamış ve hasar görmemiş olmalıdır</li>
                  <li>• Fatura veya fiş ile birlikte gönderilmelidir</li>
                  <li>• Kişisel kullanıma uygun olmayan ürünler iade edilemez</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="glass rounded-2xl p-8">
            <h2 className="mb-6 font-cormorant text-2xl font-semibold text-white">
              İade Süreci
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/20 font-inter font-semibold text-gold">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-inter font-semibold text-white">
                    İade Talebi Oluşturun
                  </h3>
                  <p className="font-inter text-white/70">
                    WhatsApp (0545 112 50 59) veya Instagram DM üzerinden iade
                    talebinizi bildirin.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/20 font-inter font-semibold text-gold">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-inter font-semibold text-white">
                    Ürünü Gönderin
                  </h3>
                  <p className="font-inter text-white/70">
                    Ürünü orijinal ambalajında, fatura/fiş ile birlikte
                    gönderin. Kargo adresi size bildirilecektir.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/20 font-inter font-semibold text-gold">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-inter font-semibold text-white">
                    İade Onayı
                  </h3>
                  <p className="font-inter text-white/70">
                    Ürün kontrol edildikten sonra iade işleminiz onaylanır ve
                    ödeme 3-5 iş günü içinde iade edilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange */}
          <div className="glass rounded-2xl p-8">
            <h2 className="mb-6 font-cormorant text-2xl font-semibold text-white">
              Değişim
            </h2>
            <p className="mb-4 font-inter text-white/70">
              Ürün değişimi için aynı iade koşulları geçerlidir. Farklı bir
              ürün veya beden değişimi yapabilirsiniz. Fiyat farkı varsa
              ödeme yapılır veya fark iade edilir.
            </p>
          </div>

          {/* Not Returnable */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                İade Edilemeyen Ürünler
              </h2>
            </div>
            <ul className="space-y-2 font-inter text-white/70">
              <li>• Kişisel kullanıma uygun olmayan ürünler</li>
              <li>• Hasarlı veya kullanılmış ürünler</li>
              <li>• Orijinal ambalajı olmayan ürünler</li>
              <li>• 14 günü geçmiş ürünler</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="glass-strong rounded-2xl p-8 text-center">
            <h3 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              İade İşlemi Başlat
            </h3>
            <p className="mb-6 font-inter text-white/70">
              İade veya değişim işlemi için bizimle iletişime geçin.
            </p>
            <a
              href="https://wa.me/905451125059"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-green-500 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-green-600"
            >
              WhatsApp ile İletişim
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

