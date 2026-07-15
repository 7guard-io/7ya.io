import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/']
    },
    sitemap: 'https://7ya.io/sitemap.xml',
    host: 'https://7ya.io'
  };
}
