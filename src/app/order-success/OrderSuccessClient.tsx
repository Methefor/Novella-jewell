/**
 * NOVELLA - Order Success Client
 * Sipariş başarı sayfası client component
 */

'use client';

import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle, Mail, Package } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'NOVELLA-' + Date.now();

  useEffect(() => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#B76E79', '#FDFBF7'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="font-serif text-3xl lg:text-4xl text-black mb-2">
            Siparişiniz Alındı!
          </h1>

          <p className="text-lg text-black/60">
            Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="border-b border-cream-200 pb-6 mb-6">
            <p className="text-sm text-black/60 mb-2">Sipariş Numarası</p>
            <p className="text-2xl font-bold text-gold">#{orderId}</p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-black mb-1">
                  E-posta Gönderildi
                </h3>
                <p className="text-sm text-black/60">
                  Sipariş detaylarınız e-posta adresinize gönderildi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-black mb-1">Hazırlanıyor</h3>
                <p className="text-sm text-black/60">
                  Siparişiniz 1-3 iş günü içinde kargoya verilecektir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-blue-900 mb-2">📦 Kargo Takibi</h3>
          <p className="text-sm text-blue-800">
            Kargonuz yola çıktığında e-posta adresinize kargo takip numarası
            gönderilecektir. Sipariş durumunuzu hesabınızdan takip
            edebilirsiniz.
          </p>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/collections"
            className="
              px-6 py-3 rounded-lg font-medium text-center
              border-2 border-gold text-gold
              hover:bg-gold hover:text-white
              transition-colors
              flex items-center justify-center gap-2
            "
          >
            Alışverişe Devam Et
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/hesap/siparisler"
            className="
              px-6 py-3 rounded-lg font-medium text-center
              bg-gold text-white
              hover:bg-gold/90
              transition-colors
            "
          >
            Siparişlerimi Görüntüle
          </Link>
        </div>

        {/* Help */}
        <div className="text-center mt-8 text-sm text-black/60">
          <p>
            Sorularınız mı var?{' '}
            <Link href="/iletisim" className="text-gold hover:underline">
              Bize Ulaşın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-black/60">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
