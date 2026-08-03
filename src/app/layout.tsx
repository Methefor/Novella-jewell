import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MetaPixel from '@/components/analytics/MetaPixel';
import FirstPartyAnalytics from '@/components/analytics/FirstPartyAnalytics';
import SepetHatirlatici from '@/components/cart/SepetHatirlatici';
import StoreHydration from '@/components/common/StoreHydration';
import ToastContainer from '@/components/common/Toast';
import CookieBanner from '@/components/legal/CookieBanner';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import { SITE } from '@/lib/config';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  Instrument_Sans,
  Instrument_Serif,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-editorial',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NOVELLA — Özgün 316L Çelik Takılar',
    template: '%s | NOVELLA',
  },
  description:
    'Özgün tasarımlı 316L paslanmaz çelik yüzük, küpe ve bileklikler. Suya dayanıklı, modern ve ulaşılabilir takı koleksiyonları.',
  keywords: [
    'paslanmaz çelik takı',
    '316L çelik takı',
    'bilezik',
    'küpe',
    'yüzük',
    'suya dayanıklı takı',
    'novella takı',
    'butik takı',
    'takı koleksiyonu',
    'çelik bileklik',
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
  // ⚠️ Buraya `alternates.canonical` KOYMA.
  // Next.js metadata'yı parent'tan miras verir; layout'a canonical konursa
  // kendi canonical'ını tanımlamayan her sayfa ana sayfayı işaret eder ve
  // Google o sayfaları indeksten düşürür. Canonical her sayfada ayrı verilir.
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE.url,
    title: 'NOVELLA — Özgün 316L Çelik Takılar',
    description:
      'Özgün tasarımlı 316L paslanmaz çelik yüzük, küpe ve bileklikler. Suya dayanıklı, modern ve ulaşılabilir.',
    siteName: 'NOVELLA',
    // images YOK — src/app/opengraph-image.tsx zaten dinamik OG görseli üretiyor
    // ve dosya konvansiyonu bu alanı otomatik doldurur. Buraya elle
    // '/og-image.jpg' yazılmıştı ama o dosya public/ içinde hiç yoktu → 404.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVELLA — Özgün 316L Çelik Takılar',
    description:
      'Özgün tasarımlı 316L paslanmaz çelik takılar. Suya dayanıklı, modern ve ulaşılabilir.',
    // images YOK — aynı sebep. Elle verilen değer dosya konvansiyonunu ezip
    // 404'e gidiyordu.
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
  },
  manifest: '/site.webmanifest',
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
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
  // image: dinamik OG görselini gösterir. Eskiden /og-image.jpg yazıyordu
  // ama o dosya hiç yoktu (404).
  image: `${SITE.url}/opengraph-image`,
  slogan: SITE.tagline,
  description:
    'Özgün tasarımlı, suya dayanıklı 316L paslanmaz çelik takılar.',
  sameAs: [SITE.instagram, SITE.threads],
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
    <ClerkProvider>
    <html lang="tr" className={`${cormorant.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Klavye kullanıcıları için içeriğe atla — Tab'a basınca görünür,
            header'ı baştan sona gezmeden ana içeriğe geçmeyi sağlar (WCAG 2.4.1). */}
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <StoreHydration />
        <Header />
        {/*
          Bu bir <div>, <main> DEĞİL — bilerek. Her sayfa client'ı kendi
          <main>'ini render ediyor. Buraya da main koyulunca sayfada iki iç içe
          main oluyordu (geçersiz HTML, ekran okuyucuyu şaşırtır). Skip linkin
          hedefi olarak id taşıyor.
        */}
        <div id="icerik" className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
        <ToastContainer />
        {/* Terk edilmiş sepet hatırlatıcısı — saatler sonra dönen ziyaretçiye */}
        <SepetHatirlatici />
        {/* KVKK çerez onayı — GA yalnızca burada "Kabul et" seçilirse yüklenir. */}
        <CookieBanner />
        <GoogleAnalytics />
        <MetaPixel />
        <FirstPartyAnalytics />
      </body>
    </html>
    </ClerkProvider>
  );
}
