import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import CheckoutSuccessClient from '@/components/CheckoutSuccessClient';

export const metadata: Metadata = {
  title: 'Sipariş Başarılı | NOVELLA',
  description: 'Siparişiniz başarıyla alındı',
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string; method?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { orderId, method } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <div className="glass-strong mx-auto max-w-2xl rounded-3xl p-8 text-center md:p-12">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
        </div>

        <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
          Siparişiniz Alındı!
        </h1>

        <p className="mb-8 font-inter text-lg text-white/70">
          {method === 'whatsapp'
            ? 'Siparişiniz WhatsApp üzerinden iletildi. En kısa sürede size dönüş yapacağız.'
            : 'Siparişiniz başarıyla oluşturuldu. En kısa sürede size ulaşacağız.'}
        </p>

        {orderId && (
          <div className="mb-8 space-y-4">
            <div className="glass rounded-xl p-4">
              <p className="mb-2 font-inter text-sm font-semibold text-white/80">
                Sipariş Numarası
              </p>
              <p className="font-cormorant text-2xl font-bold text-gold">
                {orderId}
              </p>
              <p className="mt-2 font-inter text-xs text-white/60">
                Sipariş detaylarınız e-posta adresinize gönderildi.
              </p>
            </div>
          </div>
        )}

        <CheckoutSuccessClient orderId={orderId} method={method} />
      </div>
    </div>
  );
}

