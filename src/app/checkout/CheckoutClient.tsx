/**
 * NOVELLA - Checkout Client Component
 * Checkout sayfası ana component
 */

'use client';

import CartSummary from '@/components/cart/CartSummary';
import { useToast } from '@/hooks/useToast';
import { shopierClient } from '@/lib/shopier';
import { selectHasItems, useCartStore } from '@/store/cartStore';
import { CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CheckoutForm {
  // İletişim
  email: string;
  phone: string;

  // Teslimat
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  zipCode: string;

  // Ödeme
  paymentMethod: 'credit-card' | 'bank-transfer';

  // Notlar
  orderNote?: string;
}

export default function CheckoutClient() {
  const router = useRouter();
  const hasItems = useCartStore(selectHasItems);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const shippingCost = useCartStore((state) => state.shippingCost);
  const discount = useCartStore((state) => state.discount);
  const total = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    paymentMethod: 'credit-card',
    orderNote: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!hasItems) {
      router.push('/collections');
    }
  }, [hasItems, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create Shopier order
      const orderData = {
        order_id: `NOVELLA-${Date.now()}`,
        email: formData.email,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        zip_code: formData.zipCode,
        products: shopierClient.cartItemsToShopierProducts(items),
        total_amount: total,
        shipping_amount: shippingCost,
        discount_amount: discount,
        order_note: formData.orderNote,
      };

      const result = await shopierClient.createOrder(orderData);

      if (result.success) {
        toast.success('Siparişiniz oluşturuldu!');
        clearCart();
        router.push(`/order-success?order_id=${result.orderId}`);
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!hasItems) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl lg:text-4xl text-black mb-2">
            Ödeme
          </h1>
          <p className="text-black/60">Teslimat ve ödeme bilgilerinizi girin</p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg">
          <div className="text-center">
            <ShieldCheck className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-black/60">Güvenli Ödeme</p>
          </div>
          <div className="text-center">
            <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-black/60">Hızlı Kargo</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-black/60">Güvenli Ödeme</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* İletişim Bilgileri */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-serif text-xl text-black mb-4">
                  İletişim Bilgileri
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="E-posta *"
                    className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Telefon *"
                    className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Teslimat Adresi */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-serif text-xl text-black mb-4">
                  Teslimat Adresi
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Ad *"
                      className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Soyad *"
                      className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    />
                  </div>

                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Adres *"
                    rows={3}
                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none"
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="İl *"
                      className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      placeholder="İlçe *"
                      className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="Posta Kodu"
                      className="px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Ödeme Yöntemi */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-serif text-xl text-black mb-4">
                  Ödeme Yöntemi
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-cream-300 rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={(e) =>
                        updateField('paymentMethod', e.target.value as any)
                      }
                      className="w-4 h-4 text-gold focus:ring-gold"
                    />
                    <CreditCard className="w-5 h-5 text-gold" />
                    <span className="font-medium">Kredi/Banka Kartı</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-cream-300 rounded-lg cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={(e) =>
                        updateField('paymentMethod', e.target.value as any)
                      }
                      className="w-4 h-4 text-gold focus:ring-gold"
                    />
                    <span className="font-medium">Havale/EFT</span>
                  </label>
                </div>
              </div>

              {/* Sipariş Notu */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-serif text-xl text-black mb-4">
                  Sipariş Notu (Opsiyonel)
                </h2>
                <textarea
                  value={formData.orderNote}
                  onChange={(e) => updateField('orderNote', e.target.value)}
                  placeholder="Özel bir talebiniz var mı?"
                  rows={3}
                  className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gold text-white font-medium rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading
                  ? 'İşleminiz Gerçekleştiriliyor...'
                  : 'Siparişi Tamamla'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl text-black mb-4">
                Sipariş Özeti
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-16 h-16 bg-cream-50 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-black/60">Adet: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {(item.product.price * item.quantity).toLocaleString(
                        'tr-TR'
                      )}
                      ₺
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
