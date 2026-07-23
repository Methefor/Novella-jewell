import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import SiparisTakipClient from './SiparisTakipClient';

export const metadata: Metadata = {
  title: 'Sipariş Takip',
  description:
    'NOVELLA siparişinizin durumunu sipariş numaranız ve e-posta adresinizle sorgulayın.',
  alternates: { canonical: `${SITE.url}/siparis-takip` },
};

export default function SiparisTakipPage() {
  return <SiparisTakipClient />;
}
