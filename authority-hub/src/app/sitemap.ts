import type { MetadataRoute } from 'next';
import { pageSlugs } from '@/lib/i18n';

const base = 'https://7ya.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-07-15T00:00:00Z');
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: { he: `${base}/`, en: `${base}/en/`, ru: `${base}/ru/` } }
    },
    {
      url: `${base}/en/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${base}/ru/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9
    }
  ];

  for (const slug of pageSlugs) {
    routes.push({
      url: `${base}/${slug}/`,
      lastModified: now,
      changeFrequency: slug === 'evidence-wall' ? 'weekly' : 'monthly',
      priority: slug === 'igor-vepretski' || slug === 'evidence-wall' ? 0.95 : 0.85,
      alternates: {
        languages: {
          he: `${base}/${slug}/`,
          en: `${base}/en/${slug}/`,
          ru: `${base}/ru/${slug}/`
        }
      }
    });
    routes.push(
      { url: `${base}/en/${slug}/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${base}/ru/${slug}/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 }
    );
  }

  return routes;
}
