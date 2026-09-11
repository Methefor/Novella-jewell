import { MesafeliSatisPage } from '@/components/legal/CheckoutDocuments';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description:
    'NOVELLA mesafeli satış sözleşmesi. Taraflar, konu, cayma hakkı ve yükümlülükler.',
  alternates: { canonical: `${SITE.url}/mesafeli-satis-sozlesmesi` },
  robots: { index: false, follow: true },
};

export default MesafeliSatisPage;
