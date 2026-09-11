import { OnBilgilendirmePage } from '@/components/legal/CheckoutDocuments';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ön Bilgilendirme Formu',
  description:
    'Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş öncesi bilgilendirme formu.',
  alternates: { canonical: `${SITE.url}/on-bilgilendirme` },
  robots: { index: false, follow: true },
};

export default OnBilgilendirmePage;
