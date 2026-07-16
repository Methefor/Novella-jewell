'use client';

import type { Order, OrderItem } from '@/lib/checkout/types';
import { SHIPPING } from '@/lib/config';
import { ILLER } from '@/lib/turkiye';
import { useCartStore } from '@/store/cartStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
});

type FormData = z.infer<typeof schema>;

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NV-${ts}-${rnd}`;
}

export default function OdemeClient() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (items.length === 0) router.replace('/sepet');
  }, [items.length, router]);

  if (items.length === 0) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const order: Order = {
      id: generateOrderId(),
      items: orderItems,
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
      subtotal,
      shippingCost,
      total,
      currency: 'TRY',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      if (!res.ok) throw new Error('Ödeme başlatılamadı.');

      const result = await res.json();

      if (result.type === 'redirect') {
        clearCart();
        window.location.href = result.redirectUrl;
      } else if (result.type === 'form') {
        clearCart();
        // Shopier form HTML'i yeni bir div'e ekle ve otomatik submit et
        const container = document.createElement('div');
        container.innerHTML = result.formHtml;
        document.body.appendChild(container);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            <div className="sticky top-24 bg-[#F9F9F7] p-6 border border-black/6">
              <h2 className="font-serif text-lg text-black mb-5">
                Sipariş Özeti
              </h2>

              <div className="space-y-2 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-black/70 truncate pr-2">
                      {item.product.name}
                      <span className="text-black/35"> ×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-black flex-shrink-0">
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

              <button
                type="submit"
                form="odeme-form"
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
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

              <p className="text-xs text-black/30 text-center mt-3">
                Shopier güvenli ödeme altyapısı
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-3.5 py-2.5 text-sm bg-white border ${
    hasError ? 'border-red-400' : 'border-black/15'
  } rounded focus:outline-none focus:border-black transition-colors`;
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
      <label className="block text-xs font-medium text-black/50 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
