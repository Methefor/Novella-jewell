/**
 * NOVELLA - Order Success Page
 * Sipariş başarı sayfası
 */

import { Metadata } from 'next';
import OrderSuccessClient from './OrderSuccessClient';

export const metadata: Metadata = {
  title: 'Siparişiniz Alındı | NOVELLA',
  description: 'Siparişiniz başarıyla oluşturuldu.',
  robots: 'noindex, nofollow',
};

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
