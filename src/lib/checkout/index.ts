import { PayTRProvider } from './paytr';
import { ShopierProvider } from './shopier';
import type { CheckoutProvider } from './types';

/**
 * Aktif ödeme sağlayıcısını döndürür.
 *
 * Shopier (2026-07 itibarıyla) kendi sitede satış desteğini kaldırdığı için
 * varsayılan sağlayıcı PayTR'dir. Eski Shopier kodu referans/geri dönüş
 * amacıyla duruyor ancak yeni kurulumlarda kullanılmamalı.
 */
export function getCheckoutProvider(): CheckoutProvider {
  const provider = process.env.CHECKOUT_PROVIDER ?? 'paytr';

  switch (provider) {
    case 'paytr':
      return new PayTRProvider();
    case 'shopier':
      return new ShopierProvider();
    default:
      throw new Error(`Bilinmeyen checkout provider: ${provider}`);
  }
}

export type {
  CheckoutProvider,
  Order,
  OrderCustomer,
  OrderItem,
  PaymentResult,
} from './types';
