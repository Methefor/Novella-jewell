import LegalPage from '@/components/legal/LegalPage';
import { SSS_DUZ } from '@/data/sss';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import SssClient from './SssClient';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular',
  description:
    'Çelik takı kararır mı, alerji yapar mı, kargo ne zaman gelir, iade nasıl yapılır? NOVELLA hakkında en çok merak edilenler.',
  alternates: { canonical: `${SITE.url}/sss` },
};

/**
 * FAQPage JSON-LD — SSS_DUZ'dan üretilir, görünen sayfayla aynı kaynak.
 * Google'da soruların açılır cevaplarla zengin sonuç olarak görünmesini sağlar.
 */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SSS_DUZ.map((k) => ({
    '@type': 'Question',
    name: k.soru,
    acceptedAnswer: {
      '@type': 'Answer',
      text: k.cevap,
    },
  })),
};

export default function SssPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LegalPage
        title="Sık Sorulan Sorular"
        intro="Aradığınız cevap yoksa WhatsApp’tan yazın — genellikle aynı gün dönüş yapıyoruz."
        hideUpdated
      >
        <SssClient />
      </LegalPage>
    </>
  );
}
