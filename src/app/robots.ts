import { SITE } from '@/lib/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/sepet',
          '/odeme',
          '/favoriler',
          '/search',
          '/_next',
          '/static',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
