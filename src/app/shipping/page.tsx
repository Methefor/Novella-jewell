import { Metadata } from 'next';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kargo & Teslimat | NOVELLA',
  description: 'Kargo ve teslimat bilgileri',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <Truck className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
            Kargo & Teslimat
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            Siparişleriniz güvenli ve hızlı şekilde size ulaşır
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Free Shipping */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <Truck className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                Ücretsiz Kargo
              </h2>
            </div>
            <p className="font-inter text-white/70">
              Türkiye geneli tüm siparişlerde ücretsiz kargo hizmeti sunuyoruz.
              Minimum sipariş tutarı yoktur.
            </p>
          </div>

          {/* Shipping Time */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                Kargo Süresi
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-inter font-semibold text-white">
                  Sipariş Hazırlama
                </h3>
                <p className="font-inter text-white/70">
                  Siparişleriniz 1-2 iş günü içinde hazırlanır ve kargoya
                  verilir.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-inter font-semibold text-white">
                  Teslimat Süresi
                </h3>
                <ul className="space-y-2 font-inter text-white/70">
                  <li>• İstanbul: 1-2 iş günü</li>
                  <li>• Marmara Bölgesi: 2-3 iş günü</li>
                  <li>• Türkiye Geneli: 3-5 iş günü</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <Package className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                Kargo Takibi
              </h2>
            </div>
            <p className="mb-4 font-inter text-white/70">
              Siparişiniz kargoya verildiğinde, kargo takip numaranız e-posta
              adresinize gönderilir. Kargo takip numaranız ile{' '}
              <a
                href="https://www.yurticikargo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Yurtiçi Kargo
              </a>{' '}
              veya{' '}
              <a
                href="https://www.mngkargo.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                MNG Kargo
              </a>{' '}
              web sitelerinden takip edebilirsiniz.
            </p>
          </div>

          {/* Delivery Areas */}
          <div className="glass rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-gold/20">
                <MapPin className="h-6 w-6 text-rose-gold" />
              </div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">
                Teslimat Bölgeleri
              </h2>
            </div>
            <p className="font-inter text-white/70">
              Türkiye'nin tüm il ve ilçelerine kargo gönderimi yapılmaktadır.
              Adres bilgilerinizin doğru ve eksiksiz olduğundan emin olun.
            </p>
          </div>

          {/* Contact */}
          <div className="glass-strong rounded-2xl p-8 text-center">
            <h3 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Sorunuz mu var?
            </h3>
            <p className="mb-6 font-inter text-white/70">
              Kargo ve teslimat hakkında sorularınız için bizimle iletişime
              geçin.
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

