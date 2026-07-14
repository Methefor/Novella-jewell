import type { Metadata } from 'next';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: 'Sepetim — NOVELLA',
  robots: { index: false },
};

export default function SepetPage() {
  return <CartPageClient />;
}
