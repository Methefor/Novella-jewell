import { PayTRProvider } from './paytr';
import type { CheckoutProvider } from './types';

/**
 * Aktif ödeme sağlayıcısını döndürür.
 *
 * Novella'nın aktif ve tek ödeme sağlayıcısı PayTR'dir.
 */
export function getCheckoutProvider(): CheckoutProvider {
  return new PayTRProvider();
}

export type {
  CheckoutProvider,
  Order,
  OrderCustomer,
  OrderItem,
  PaymentResult,
} from './types';
