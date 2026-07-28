'use client';

import { trackPurchase } from '@/lib/analytics';
import { SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, TESLIMAT_SURESI_GUN } from '@/lib/legal';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

function formatTL(n: number): string {
  return (
    n.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ₺'
  );
}

export default function SonucClient() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  // Callback order_no gönderiyor (NJ-2026-0001); eski orderId parametresi fallback.
  const orderNo =
    searchParams.get('orderNo') ?? searchParams.get('orderId') ?? '';
  const verify = searchParams.get('verify') ?? '';
  const reason = searchParams.get('reason');
  const clearCart = useCartStore((s) => s.clearCart);

  const [copied, setCopied] = useState(false);
  const [verification, setVerification] = useState<
    'checking' | 'paid' | 'failed'
  >(status === 'success' ? 'checking' : 'failed');
  const [verifiedTotal, setVerifiedTotal] = useState(0);

  const isSuccess = verification === 'paid';

  // Sepet YALNIZCA ödeme başarılıysa temizlenir.
  // Aynı anda GA4 purchase olayı gönderilir. transaction_id sayesinde sayfa
  // yenilenirse GA çift saymaz. value: total URL'den; yoksa 0.
  useEffect(() => {
    if (status !== 'success' || !orderNo || !verify) {
      setVerification('failed');
      return;
    }

    let cancelled = false;
    let attempt = 0;

    const verifyOrder = async () => {
      attempt += 1;
      try {
        const response = await fetch(
          `/api/odeme/dogrula?orderNo=${encodeURIComponent(
            orderNo
          )}&verify=${encodeURIComponent(verify)}`,
          { cache: 'no-store' }
        );
        const result = (await response.json()) as {
          status?: string;
          total?: string | null;
        };
        if (cancelled) return;

        if (response.ok && result.status === 'paid') {
          setVerifiedTotal(Number(result.total) || 0);
          setVerification('paid');
          return;
        }
        if (result.status === 'failed' || response.status === 404) {
          setVerification('failed');
          return;
        }
      } catch {
        // Geçici ağ hatasında kontrollü tekrar devam eder.
      }

      if (!cancelled && attempt < 10) {
        window.setTimeout(verifyOrder, 1200);
      } else if (!cancelled) {
        setVerification('failed');
      }
    };

    void verifyOrder();
    return () => {
      cancelled = true;
    };
  }, [orderNo, status, verify]);

  useEffect(() => {
    if (!isSuccess || !orderNo) return;
    clearCart();
    trackPurchase(orderNo, verifiedTotal);
  }, [isSuccess, clearCart, orderNo, verifiedTotal]);

  const copyOrderNo = async () => {
    if (!orderNo) return;
    try {
      await navigator.clipboard.writeText(orderNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard desteklenmiyorsa sessizce geç.
    }
  };

  const waText = encodeURIComponent(
    `Merhaba! Siparişim tamamlandı. Sipariş no: ${orderNo}`
  );

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-lg w-full"
      >
        {verification === 'checking' ? (
          <VerificationCard />
        ) : isSuccess ? (
          <SuccessCard
            orderNo={orderNo}
            total={verifiedTotal}
            copied={copied}
            onCopy={copyOrderNo}
            waText={waText}
          />
        ) : (
          <ErrorCard
            reason={reason ?? (status === 'success' ? 'verification' : null)}
          />
        )}
      </motion.div>
    </main>
  );
}

function VerificationCard() {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold-dark">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </div>
      <h1 className="mb-3 font-serif text-3xl font-light text-black">
        Ödemeniz doğrulanıyor
      </h1>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-black/50">
        Banka onayı siparişinizle eşleştiriliyor. Bu işlem genellikle birkaç
        saniye sürer; lütfen bu sayfayı kapatmayın.
      </p>
    </div>
  );
}

function SuccessCard({
  orderNo,
  total,
  copied,
  onCopy,
  waText,
}: {
  orderNo: string;
  total: number;
  copied: boolean;
  onCopy: () => void;
  waText: string;
}) {
  return (
    <div className="text-center">
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

      <p className="text-sm text-black/50 leading-relaxed mb-8">
        Ödemeniz başarıyla gerçekleşti. Sipariş özetiniz e-posta ile gönderildi.
        Kargoya verildiğinde WhatsApp üzerinden bilgilendirileceksiniz.
      </p>

      {/* Sipariş özeti kartı */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6 text-left shadow-sm">
        <p className="text-[11px] uppercase tracking-wider text-black/40 mb-1">
          Sipariş Numarası
        </p>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="font-medium text-black text-lg tracking-wide">
            {orderNo || '—'}
          </span>
          {orderNo && (
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center gap-1.5 text-xs text-gold hover:text-black transition-colors"
              aria-label="Sipariş numarasını kopyala"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-black/60">Toplam</span>
          <span className="font-semibold text-black">{formatTL(total)}</span>
        </div>
      </div>

      {/* Süreç adımları */}
      <div className="bg-cream/40 rounded-xl p-5 mb-8 text-left">
        <h2 className="text-sm font-medium text-black mb-4">Sipariş durumu</h2>
        <div className="space-y-4">
          <Step icon={CheckCircle2} label="Sipariş alındı" active />
          <Step icon={Package} label="Hazırlanıyor" />
          <Step icon={Truck} label="Kargoya verildi" />
        </div>
      </div>

      <p className="text-xs text-black/40 mb-6">
        Tahmini teslimat süresi en fazla {TESLIMAT_SURESI_GUN} iş günüdür. Cayma
        hakkınız {CAYMA_SURESI_GUN} gündür.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp&apos;tan Onayla
        </a>
        <Link
          href="/koleksiyonlar"
          className="btn-ghost flex items-center justify-center"
        >
          Alışverişe Devam
        </Link>
      </div>
    </div>
  );
}

function ErrorCard({ reason }: { reason: string | null }) {
  return (
    <div className="text-center">
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
          ? 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin veya WhatsApp üzerinden destek alın.'
          : reason === 'verification'
            ? 'Ödeme onayı henüz doğrulanamadı. Kartınızdan tahsilat gördüyseniz tekrar ödeme yapmadan önce sipariş numaranızla bizimle iletişime geçin.'
          : 'Ödeme işlemi banka veya kart sağlayıcısı tarafından onaylanmadı. Tekrar deneyebilir veya WhatsApp üzerinden sipariş verebilirsiniz.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/sepet"
          className="btn-primary flex items-center justify-center"
        >
          Sepete Dön ve Tekrar Dene
        </Link>
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Destek
        </a>
      </div>
    </div>
  );
}

function Step({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
          active ? 'bg-gold/10 text-gold' : 'bg-black/5 text-black/30'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <span
        className={`text-sm ${
          active ? 'text-black font-medium' : 'text-black/40'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
