import { KvkkPage } from '@/components/legal/CheckoutDocuments';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
  alternates: { canonical: `${SITE.url}/kvkk` },
};

export default KvkkPage;
