'use client';

import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function SonucClient() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId') ?? '';
  const reason = searchParams.get('reason');
  const clearCart = useCartStore((s) => s.clearCart);

  const isSuccess = status === 'success';

  // Sepet YALNIZCA ödeme başarılıysa temizlenir.
  // Eskiden Shopier'e yönlenmeden önce temizleniyordu; müşteri ödemeden
  // vazgeçtiğinde sepeti boş dönüyor ve sipariş tamamen kaybediliyordu.
  useEffect(() => {
    if (isSuccess) clearCart();
  }, [isSuccess, clearCart]);

  const waText = encodeURIComponent(
    `Merhaba! Siparişim tamamlandı. Sipariş no: ${orderId}`
  );

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-md w-full text-center"
      >
        {isSuccess ? (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-gold" strokeWidth={1.2} />
            </motion.div>

            <h1 className="font-serif font-light text-3xl text-black mb-3">
              Siparişiniz alındı
            </h1>

            {orderId && (
              <p className="text-xs text-black/35 mb-1">
                Sipariş No: {orderId}
              </p>
            )}

            <p className="text-sm text-black/50 leading-relaxed mb-8">
              Ödemeniz alındı. WhatsApp üzerinden kargo takip bilginizi ve onay
              mesajını en geç 1 iş günü içinde alacaksınız.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/905451125059?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp'tan Onayla
              </a>
              <Link
                href="/koleksiyonlar"
                className="btn-ghost flex items-center justify-center"
              >
                Alışverişe Devam
              </Link>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <XCircle className="w-16 h-16 text-black/20" strokeWidth={1.2} />
            </motion.div>

            <h1 className="font-serif font-light text-3xl text-black mb-3">
              Ödeme tamamlanamadı
            </h1>

            <p className="text-sm text-black/50 leading-relaxed mb-8">
              {reason === 'signature'
                ? 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin veya WhatsApp üzerinden iletişime geçin.'
                : 'Ödeme işlemi tamamlanamadı. Tekrar deneyebilir veya WhatsApp üzerinden sipariş verebilirsiniz.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/sepet"
                className="btn-primary flex items-center justify-center"
              >
                Tekrar Dene
              </Link>
              <a
                href="https://wa.me/905451125059"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Destek
              </a>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
