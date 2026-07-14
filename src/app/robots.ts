import { SITE } from '@/lib/config';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sepet', '/odeme'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
