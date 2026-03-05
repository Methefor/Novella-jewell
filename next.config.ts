import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Harici görseller için domain eklenebilir
    // domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Vercel için trailing slash (opsiyonel)
  // trailingSlash: false,
};

export default nextConfig;
