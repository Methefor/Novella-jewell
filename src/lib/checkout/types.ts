export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  note?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: OrderCustomer;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: 'TRY';
  createdAt: string; // ISO string
  userIp?: string; // PayTR gibi sağlayıcılar için; buildOrder sonrası rota doldurur
}

export type PaymentResult =
  | { type: 'redirect'; redirectUrl: string }
  | { type: 'form'; formHtml: string }
  | { type: 'iframe'; iframeUrl: string };

export interface CheckoutProvider {
  // randomNr dışarıdan verilir: aynı değer hem imzada kullanılır hem DB'ye
  // pending sipariş olarak kaydedilir (tek kaynak).
  createPayment(order: Order, randomNr: string): Promise<PaymentResult>;
  verifyCallback(params: Record<string, string>): boolean;
}
