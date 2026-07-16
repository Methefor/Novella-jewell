import StoreHydration from '@/components/common/StoreHydration';
import ToastContainer from '@/components/common/Toast';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import { SITE } from '@/lib/config';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NOVELLA — Kararmayan Çelik, Eskimeyen Zarafet',
    template: '%s | NOVELLA',
  },
  description:
    '316L paslanmaz çelik takılar. El seçimi bilezik, küpe, yüzük ve kolye koleksiyonları. Suya dayanıklı, alerji yapmaz, hediye kutusunda.',
  keywords: [
    'paslanmaz çelik takı',
    '316L çelik takı',
    'bilezik',
    'küpe',
    'yüzük',
    'kolye',
    'suya dayanıklı takı',
    'alerji yapmaz takı',
    'novella takı',
    'butik takı',
    'takı koleksiyonu',
    'çelik bileklik',
    'çelik kolye',
  ],
  authors: [{ name: 'NOVELLA' }],
  creator: 'NOVELLA',
  publisher: 'NOVELLA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE.url,
    title: 'NOVELLA — Kararmayan Çelik, Eskimeyen Zarafet',
    description:
      '316L paslanmaz çelik takılar. El seçimi bilezik, küpe, yüzük ve kolye koleksiyonları. Suya dayanıklı, alerji yapmaz.',
    siteName: 'NOVELLA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NOVELLA Takı Koleksiyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVELLA - Her Parça Bir Hikaye',
    description: 'Butik takı koleksiyonları ile her parça bir hikaye.',
    images: ['/og-image.jpg'],
    creator: '@novella.tr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
  },
};

/**
 * Marka rengi sinyali.
 * Pomelli gibi siteyi tarayıp marka kimliği çıkaran araçlar önce `theme-color`
 * meta etiketine bakar. Burayı altın olarak sabitlemek, aracın markayı
 * "beyaz/gri" değil "altın" olarak okumasını sağlar.
 */
export const viewport: Viewport = {
  themeColor: '#B8A574',
  colorScheme: 'light',
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/Yatay%20logo%20banner.png`,
  image: `${SITE.url}/og-image.jpg`,
  slogan: SITE.tagline,
  description:
    '316L cerrahi çelikten üretilen, kararmayan ve alerji yapmayan el seçimi takılar.',
  sameAs: [SITE.instagram],
  // Marka renkleri — makine tarafından okunabilir kimlik sinyali
  brand: {
    '@type': 'Brand',
    name: SITE.name,
    slogan: SITE.tagline,
    logo: `${SITE.url}/Yatay%20logo%20banner.png`,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+${SITE.whatsapp}`,
    contactType: 'customer service',
    availableLanguage: 'Turkish',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <StoreHydration />
        <Header />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
