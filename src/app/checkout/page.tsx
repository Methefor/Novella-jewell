import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Ödeme | NOVELLA',
  description: 'Güvenli ödeme sayfası',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <CheckoutForm />
      </div>
    </div>
  );
}

