export interface OrderItem {
  productId: string;
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
}

export type PaymentResult =
  | { type: 'redirect'; redirectUrl: string }
  | { type: 'form'; formHtml: string };

export interface CheckoutProvider {
  createPayment(order: Order): Promise<PaymentResult>;
  verifyCallback(params: Record<string, string>): boolean;
}
