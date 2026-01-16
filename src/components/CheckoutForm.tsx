'use client';

import { motion } from 'framer-motion';
import { CreditCard, Lock, MapPin, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/sanity.utils';
import { generateShopierPaymentUrl } from '@/lib/shopier';
import { generateOrderId } from '@/lib/orders';

// Form validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir seçiniz'),
  district: z.string().min(2, 'İlçe giriniz'),
  postalCode: z.string().min(5, 'Posta kodu en az 5 karakter olmalıdır'),
  paymentMethod: z.enum(['iyzico', 'shopier', 'whatsapp'], {
    required_error: 'Ödeme yöntemi seçiniz',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'iyzico',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const total = getTotalPrice();

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const fullAddress = `${data.address}, ${data.district}, ${data.city} ${data.postalCode}`;
      const customerName = `${data.firstName} ${data.lastName}`;

      // Create order object
      const orderData = {
        customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
        address: data.address,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total,
        paymentMethod: data.paymentMethod,
      };

      if (data.paymentMethod === 'whatsapp') {
        // Save order first
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...orderData, orderId }),
          });
        } catch (error) {
          console.error('Order save error:', error);
          // Continue even if order save fails
        }

        // WhatsApp sipariş
        const whatsappMessage = encodeURIComponent(
          `Merhaba! Sipariş vermek istiyorum.\n\n` +
          `Sipariş No: ${orderId}\n` +
          `Ad Soyad: ${customerName}\n` +
          `E-posta: ${data.email}\n` +
          `Telefon: ${data.phone}\n` +
          `Adres: ${fullAddress}\n\n` +
          `Ürünler:\n${items.map((item) => `- ${item.name} x${item.quantity} = ₺${item.price * item.quantity}`).join('\n')}\n\n` +
          `Toplam: ₺${total}`
        );
        const whatsappUrl = `https://wa.me/905451125059?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
        clearCart();
        router.push(`/checkout/success?orderId=${orderId}&method=whatsapp`);
        return;
      }

      if (data.paymentMethod === 'shopier') {
        // Save order first
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...orderData, orderId }),
          });
        } catch (error) {
          console.error('Order save error:', error);
        }

        // Shopier ödeme
        try {
          const paymentUrl = generateShopierPaymentUrl({
            orderId,
            amount: total,
            currency: 'TRY',
            customerName,
            customerEmail: data.email,
            customerPhone: data.phone,
            customerAddress: fullAddress,
            items: items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          });
          // Redirect to Shopier
          window.location.href = paymentUrl;
        } catch (error) {
          console.error('Shopier error:', error);
          alert('Shopier ödeme sistemi şu anda kullanılamıyor. Lütfen WhatsApp sipariş yöntemini kullanın.');
          setIsSubmitting(false);
        }
        return;
      }

      // İyzico veya diğer ödeme yöntemleri için
      // Save order
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, orderId }),
        });
      } catch (error) {
        console.error('Order save error:', error);
      }

      // TODO: Implement İyzico integration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
          <CreditCard className="h-10 w-10 text-white/30" />
        </div>
        <h2 className="mb-2 font-cormorant text-2xl font-semibold text-white">
          Sepetiniz Boş
        </h2>
        <p className="mb-6 font-inter text-white/60">
          Ödeme yapmak için sepete ürün ekleyin.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/products')}
          className="rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
        >
          Ürünlere Git
        </motion.button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 font-cormorant text-4xl font-bold text-white md:text-5xl">
        Ödeme
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-6 flex items-center gap-2 font-cormorant text-2xl font-semibold text-white">
                <User className="h-6 w-6 text-gold" />
                Müşteri Bilgileri
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                    Ad *
                  </label>
                  <input
                    {...register('firstName')}
                    className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                    Soyad *
                  </label>
                  <input
                    {...register('lastName')}
                    className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="0555 123 45 67"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-6 flex items-center gap-2 font-cormorant text-2xl font-semibold text-white">
                <MapPin className="h-6 w-6 text-gold" />
                Adres Bilgileri
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                    Adres *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Mahalle, Sokak, Bina No, Daire No"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                      Şehir *
                    </label>
                    <input
                      {...register('city')}
                      className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      placeholder="İstanbul"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                      İlçe *
                    </label>
                    <input
                      {...register('district')}
                      className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      placeholder="Kadıköy"
                    />
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                      Posta Kodu *
                    </label>
                    <input
                      {...register('postalCode')}
                      className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      placeholder="34000"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-6 flex items-center gap-2 font-cormorant text-2xl font-semibold text-white">
                <CreditCard className="h-6 w-6 text-gold" />
                Ödeme Yöntemi
              </h2>

              <div className="space-y-3">
                <label className="glass flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all hover:bg-white/10">
                  <input
                    type="radio"
                    value="iyzico"
                    {...register('paymentMethod')}
                    className="h-5 w-5 text-gold"
                  />
                  <div className="flex-1">
                    <div className="font-inter font-semibold text-white">
                      Güvenli Ödeme (İyzico)
                    </div>
                    <div className="font-inter text-sm text-white/60">
                      Kredi kartı, banka kartı ile ödeme
                    </div>
                  </div>
                  <Lock className="h-5 w-5 text-gold" />
                </label>

                <label className="glass flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all hover:bg-white/10">
                  <input
                    type="radio"
                    value="shopier"
                    {...register('paymentMethod')}
                    className="h-5 w-5 text-gold"
                  />
                  <div className="flex-1">
                    <div className="font-inter font-semibold text-white">
                      Shopier ile Öde
                    </div>
                    <div className="font-inter text-sm text-white/60">
                      Kredi kartı, banka kartı ile güvenli ödeme
                    </div>
                  </div>
                  <Lock className="h-5 w-5 text-gold" />
                </label>

                <label className="glass flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all hover:bg-white/10">
                  <input
                    type="radio"
                    value="whatsapp"
                    {...register('paymentMethod')}
                    className="h-5 w-5 text-gold"
                  />
                  <div className="flex-1">
                    <div className="font-inter font-semibold text-white">
                      WhatsApp Sipariş
                    </div>
                    <div className="font-inter text-sm text-white/60">
                      Siparişinizi WhatsApp üzerinden tamamlayın
                    </div>
                  </div>
                  <Phone className="h-5 w-5 text-green-400" />
                </label>
              </div>

              {errors.paymentMethod && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-strong sticky top-24 rounded-2xl p-6">
            <h2 className="mb-6 font-cormorant text-2xl font-semibold text-white">
              Sipariş Özeti
            </h2>

            {/* Items */}
            <div className="mb-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/20">
                        {item.category[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-inter text-sm font-semibold text-white">
                      {item.name}
                    </div>
                    <div className="font-inter text-xs text-white/60">
                      {item.quantity} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-inter font-semibold text-gold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mb-6 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between font-inter text-sm text-white/60">
                <span>Ara Toplam</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between font-inter text-sm text-white/60">
                <span>Kargo</span>
                <span className="text-green-400">Ücretsiz</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 font-inter text-lg font-semibold text-white">
                <span>Toplam</span>
                <span className="font-cormorant text-2xl text-gold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full rounded-full bg-gold-gradient py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-50"
            >
              {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
            </motion.button>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
              <Lock className="h-4 w-4" />
              <span>256-bit SSL ile korunmaktadır</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

