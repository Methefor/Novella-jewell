import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/wishlist', destination: '/favoriler', permanent: true },
      { source: '/hakkimizda', destination: '/hikayemiz', permanent: true },
      { source: '/collections', destination: '/koleksiyonlar', permanent: true },
      // Yalnızca gerçek koleksiyon slug'ları /koleksiyonlar'a taşınır.
      // /collections/[category] (yeni-gelenler, cok-satanlar, kolye, …) burada
      // eşleşmemeli — yoksa kategori sayfaları 404'e yönlenir.
      {
        source: '/collections/:slug(barcelona|stockholm|paris|klasikler)',
        destination: '/koleksiyonlar/:slug',
        permanent: true,
      },
      { source: '/products/:slug', destination: '/urun/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
