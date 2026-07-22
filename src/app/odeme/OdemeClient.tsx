'use client';

import { trackBeginCheckout } from '@/lib/analytics';
import { SHIPPING } from '@/lib/config';
import { ILLER } from '@/lib/turkiye';
import { useCartStore } from '@/store/cartStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  surname: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  phone: z
    .string()
    .regex(/^[0-9\s+\-()]{10,15}$/, 'Geçerli bir telefon numarası girin'),
  city: z.string().min(1, 'Şehir seçin'),
  district: z.string().min(2, 'İlçe girin'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalı'),
  note: z.string().optional(),
  // Mesafeli Sözleşmeler Yönetmeliği m.6 — ön bilgilendirmenin teyidi zorunlu.
  // Onay alınmazsa sözleşme kurulmamış sayılır. Sunucu da bunu ayrıca şart koşar.
  sozlesme: z.literal(true, {
    message: 'Devam etmek için sözleşmeleri onaylamalısınız.',
  }),
  kvkk: z.literal(true, {
    message: 'Devam etmek için aydınlatma metnini onaylamalısınız.',
  }),
});

type FormData = z.infer<typeof schema>;

export default function OdemeClient() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (items.length === 0) router.replace('/sepet');
  }, [items.length, router]);

  // GA4 begin_checkout — ödeme sayfası açıldığında bir kez (sepette ürün varsa).
  const izlendiRef = useRef(false);
  useEffect(() => {
    if (izlendiRef.current || items.length === 0) return;
    izlendiRef.current = true;
    trackBeginCheckout(
      total,
      items.map((i) => i.product)
    );
  }, [items, total]);

  // PayTR iframe açıldığında formu gizle; iframeResizer script'ini yükle.
  useEffect(() => {
    if (!iframeUrl) return;
    if (document.getElementById('paytr-iframe-resizer')) return;

    const script = document.createElement('script');
    script.id = 'paytr-iframe-resizer';
    script.src = 'https://www.paytr.com/js/iframeResizer.min.js';
    script.onload = () => {
      // @ts-expect-error paytr iframeResizer global'i
      if (typeof window.iFrameResize === 'function') {
        // @ts-expect-error paytr iframeResizer global'i
        window.iFrameResize({}, '#paytriframe');
      }
    };
    document.body.appendChild(script);
  }, [iframeUrl]);

  if (items.length === 0) return null;

  if (iframeUrl) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif font-light text-2xl text-black mb-6">
            Güvenli Ödeme
          </h1>
          <iframe
            src={iframeUrl}
            id="paytriframe"
            title="Güvenli Ödeme"
            className="w-full min-h-[600px] border-0"
          />
        </div>
      </main>
    );
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    // Sunucuya YALNIZCA ne istediğimizi gönderiyoruz.
    // Fiyat/kargo/toplam sunucuda PRODUCTS'tan yeniden hesaplanır —
    // buradan fiyat göndermek güvenlik açığıydı, bkz. lib/checkout/buildOrder.ts
    const payload = {
      items: items.map((i) => ({
        productId: i.product.id,
        variantId: i.variant.id,
        quantity: i.quantity,
        customization: i.customization,
      })),
      customer: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        district: data.district,
        note: data.note,
      },
      consent: { sozlesme: data.sozlesme, kvkk: data.kvkk },
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error ?? 'Ödeme başlatılamadı.');
      }

      // NOT: Sepet burada TEMİZLENMEZ. Müşteri ödeme sayfasında vazgeçer veya
      // ödeme düşerse sepetini kaybetmemeli. Temizleme /odeme/sonuc sayfasında,
      // yalnızca ödeme başarılıysa yapılır.
      if (result.type === 'redirect') {
        window.location.href = result.redirectUrl;
      } else if (result.type === 'form') {
        const container = document.createElement('div');
        container.innerHTML = result.formHtml;
        document.body.appendChild(container);
      } else if (result.type === 'iframe') {
        setIframeUrl(result.iframeUrl);
      } else {
        throw new Error('Bilinmeyen ödeme yanıtı.');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Bir hata oluştu, lütfen tekrar deneyin.'
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20">
        <h1
          className="font-serif font-light text-3xl md:text-4xl text-black mb-10"
          style={{ letterSpacing: '-0.02em' }}
        >
          Ödeme
        </h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          {/* Form */}
          <form
            id="odeme-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Kişisel bilgiler */}
            <section>
              <h2 className="text-sm font-medium text-black/50 uppercase tracking-widest mb-5">
                Kişisel Bilgiler
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Ad" error={errors.name?.message}>
                  <input
                    {...register('name')}
                    placeholder="Ada"
                    className={inputCls(!!errors.name)}
                  />
                </Field>
                <Field label="Soyad" error={errors.surname?.message}>
                  <input
                    {...register('surname')}
                    placeholder="Yıldız"
                    className={inputCls(!!errors.surname)}
                  />
                </Field>
                <Field label="E-posta" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="ada@novella.com"
                    className={inputCls(!!errors.email)}
                  />
                </Field>
                <Field label="Telefon" error={errors.phone?.message}>
                  <input
                    {...register('phone')}
                    placeholder="05xx xxx xx xx"
                    className={inputCls(!!errors.phone)}
                  />
                </Field>
              </div>
            </section>

            {/* Teslimat adresi */}
            <section>
              <h2 className="text-sm font-medium text-black/50 uppercase tracking-widest mb-5">
                Teslimat Adresi
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="İl" error={errors.city?.message}>
                  <select
                    {...register('city')}
                    className={inputCls(!!errors.city)}
                  >
                    <option value="">Seçin…</option>
                    {ILLER.map((il) => (
                      <option key={il} value={il}>
                        {il}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="İlçe" error={errors.district?.message}>
                  <input
                    {...register('district')}
                    placeholder="Kadıköy"
                    className={inputCls(!!errors.district)}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Açık Adres" error={errors.address?.message}>
                  <textarea
                    {...register('address')}
                    rows={3}
                    placeholder="Mahalle, sokak, kapı numarası…"
                    className={`${inputCls(!!errors.address)} resize-none`}
                  />
                </Field>
              </div>
            </section>

            {/* Sipariş notu */}
            <section>
              <Field
                label="Sipariş Notu (opsiyonel)"
                error={errors.note?.message}
              >
                <textarea
                  {...register('note')}
                  rows={2}
                  placeholder="Hediye paketi, özel not…"
                  className={`${inputCls(false)} resize-none`}
                />
              </Field>
            </section>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded">
                {error}
              </p>
            )}
          </form>

          {/* Summary — sticky */}
          <div>
            <div className="sticky top-24 bg-[#F9F9F7] p-6 rounded-lg border border-black/8 shadow-sm">
              <h2 className="font-serif text-lg text-black mb-5">
                Sipariş Özeti
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm gap-2"
                  >
                    <span className="text-black/70 truncate">
                      {item.product.name}
                      <span className="text-black/35"> ×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-black flex-shrink-0 whitespace-nowrap">
                      {(item.product.price * item.quantity).toLocaleString(
                        'tr-TR'
                      )}{' '}
                      ₺
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/8 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-black/50">
                  <span>Ara toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-black/50">
                  <span>Kargo</span>
                  <span>
                    {shippingCost === 0
                      ? 'Bedava'
                      : `${shippingCost.toLocaleString('tr-TR')} ₺`}
                  </span>
                </div>
                {subtotal < SHIPPING.freeThreshold && (
                  <p className="text-xs text-gold">
                    {(SHIPPING.freeThreshold - subtotal).toLocaleString(
                      'tr-TR'
                    )}{' '}
                    ₺ daha ekleyin, kargo bedava
                  </p>
                )}
                <div className="flex justify-between font-semibold text-black text-base pt-2 border-t border-black/8">
                  <span>Toplam</span>
                  <span>{total.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {/* Yasal onaylar — Mesafeli Sözleşmeler Yönetmeliği m.6 gereği
                  zorunlu. Onay olmadan sözleşme kurulmamış sayılır. */}
              <div className="mt-6 pt-5 border-t border-black/8 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('sozlesme')}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-black/25 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-black/60 leading-relaxed">
                    <Link
                      href="/on-bilgilendirme"
                      target="_blank"
                      className="text-black underline underline-offset-2 hover:text-gold-dark"
                    >
                      Ön Bilgilendirme Formu
                    </Link>{' '}
                    ve{' '}
                    <Link
                      href="/mesafeli-satis-sozlesmesi"
                      target="_blank"
                      className="text-black underline underline-offset-2 hover:text-gold-dark"
                    >
                      Mesafeli Satış Sözleşmesi
                    </Link>
                    &apos;ni okudum, onaylıyorum.
                  </span>
                </label>
                {errors.sozlesme && (
                  <p className="text-xs text-red-600 pl-7">
                    {errors.sozlesme.message}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('kvkk')}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-black/25 text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-black/60 leading-relaxed">
                    Kişisel verilerimin siparişimin işlenmesi amacıyla
                    kullanılmasına ilişkin{' '}
                    <Link
                      href="/kvkk"
                      target="_blank"
                      className="text-black underline underline-offset-2 hover:text-gold-dark"
                    >
                      KVKK Aydınlatma Metni
                    </Link>
                    &apos;ni okudum.
                  </span>
                </label>
                {errors.kvkk && (
                  <p className="text-xs text-red-600 pl-7">
                    {errors.kvkk.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                form="odeme-form"
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yönlendiriliyor…
                  </>
                ) : (
                  'Siparişi Tamamla'
                )}
              </button>

              <p className="text-xs text-black/30 text-center mt-3 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                256-bit SSL ile güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 text-sm bg-white border ${
    hasError ? 'border-red-400' : 'border-black/12'
  } rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-black/50 mb-2 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
