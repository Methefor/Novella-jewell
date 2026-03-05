import ToastContainer from '@/components/common/Toast';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import type { Metadata } from 'next';
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
    default: 'NOVELLA - Her Parça Bir Hikaye',
    template: '%s | NOVELLA',
  },
  description:
    'Butik takı koleksiyonları ile her parça bir hikaye. Kaliteli çelik takılar, uygun fiyatlar.  Sizin için özenle seçilmiş kolye, bilezik, küpe ve yüzük modelleri.',
  keywords: [
    'takı',
    'kolye',
    'bilezik',
    'küpe',
    'yüzük',
    'çelik takı',
    'butik takı',
    'NOVELLA',
    '',
  ],
  authors: [{ name: 'NOVELLA' }],
  creator: 'NOVELLA',
  publisher: 'NOVELLA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'NOVELLA - Her Parça Bir Hikaye',
    description:
      'Butik takı koleksiyonları ile her parça bir hikaye. Kaliteli çelik takılar, uygun fiyatlar.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
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
