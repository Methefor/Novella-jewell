import type { CheckoutProvider } from './types';

// Aktif provider'ı env'den seç.
// iyzico/paytr geçişinde: yeni sınıf yaz + CHECKOUT_PROVIDER değiştir.
export function getCheckoutProvider(): CheckoutProvider {
  const provider = process.env.CHECKOUT_PROVIDER ?? 'shopier';

  switch (provider) {
    case 'shopier': {
      const { ShopierProvider } = require('./shopier');
      return new ShopierProvider();
    }
    default:
      throw new Error(`Bilinmeyen checkout provider: ${provider}`);
  }
}

export type { CheckoutProvider, Order, OrderItem, OrderCustomer, PaymentResult } from './types';
