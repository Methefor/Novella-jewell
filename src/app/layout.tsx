import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import ContactButtons from '@/components/ContactButtons';
import Providers from '@/components/Providers';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOVELLA | Her Parça Bir Hikaye - Premium Çelik Takılar',
  description:
    'NOVELLA ile tarzınızı yansıtın. Premium kalitede paslanmaz çelik kolye, bilezik, küpe ve yüzükler. Tekirdağ\'dan sizin için özenle seçilmiş tasarımlar.',
  keywords: [
    'takı',
    'çelik takı',
    'kolye',
    'bilezik',
    'küpe',
    'yüzük',
    'paslanmaz çelik',
    'novella',
    'jewelry',
    'aksesuar',
  ],
  authors: [{ name: 'NOVELLA' }],
  openGraph: {
    title: 'NOVELLA | Her Parça Bir Hikaye',
    description: 'Premium kalitede çelik takılar ile tarzınızı tamamlayın.',
    url: 'https://novella-tek.vercel.app',
    siteName: 'NOVELLA',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVELLA | Her Parça Bir Hikaye',
    description: 'Premium kalitede çelik takılar ile tarzınızı tamamlayın.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${cormorant.variable} ${inter.variable} min-h-screen bg-[#0F0F0F] font-inter antialiased`}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <CartSidebar />
          <ContactButtons />
        </Providers>
      </body>
    </html>
  );
}
