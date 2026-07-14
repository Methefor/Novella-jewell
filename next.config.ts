import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/wishlist', destination: '/favoriler', permanent: true },
      { source: '/collections', destination: '/koleksiyonlar', permanent: true },
      { source: '/collections/:slug', destination: '/koleksiyonlar/:slug', permanent: true },
      { source: '/products/:slug', destination: '/urun/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
