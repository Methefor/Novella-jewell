import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import HikayemizClient from './HikayemizClient';

export const metadata: Metadata = {
  title: 'Hikayemiz',
  description:
    'Novella, İtalyanca "kısa hikaye" demek. 316L cerrahi çelikten üretilen, kararmayan ve alerji yapmayan takılar. Neden çelik seçtiğimizi ve her koleksiyonun hikayesini okuyun.',
  alternates: { canonical: `${SITE.url}/hikayemiz` },
  openGraph: {
    title: 'Hikayemiz — NOVELLA',
    description:
      'Novella, İtalyanca "kısa hikaye" demek. Kararmayan çelikten, eskimeyen zarafet.',
    url: `${SITE.url}/hikayemiz`,
    type: 'article',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hikayemiz — NOVELLA',
  url: `${SITE.url}/hikayemiz`,
  description:
    'Novella markasının hikayesi, 316L cerrahi çelik tercihi ve koleksiyon felsefesi.',
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    sameAs: [SITE.instagram],
  },
};

export default function HikayemizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <HikayemizClient />
    </>
  );
}
