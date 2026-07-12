export const canonicalSiteUrl = 'https://7ya.io';

export const canonicalRoutes = Object.freeze([
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: 'igor-vepretski', changefreq: 'weekly', priority: '0.9' },
  { path: 'journey', changefreq: 'weekly', priority: '0.9' },
  { path: 'influence', changefreq: 'weekly', priority: '0.9' },
  { path: 'evidence', changefreq: 'weekly', priority: '0.9' },
  { path: 'starton', changefreq: 'weekly', priority: '0.9' },
  { path: 'speaker', changefreq: 'monthly', priority: '0.8' },
  { path: 'media', changefreq: 'monthly', priority: '0.8' },
  { path: 'articles', changefreq: 'weekly', priority: '0.8' },
  { path: 'talk', changefreq: 'monthly', priority: '0.8' },
  { path: 'contact', changefreq: 'monthly', priority: '0.7' },
  { path: '7ya', changefreq: 'monthly', priority: '0.7' },
  { path: 'oracle', changefreq: 'monthly', priority: '0.7' },
  { path: 'business', changefreq: 'monthly', priority: '0.7' },
  { path: 'social', changefreq: 'weekly', priority: '0.7' },
  { path: 'pass', changefreq: 'monthly', priority: '0.5' },
  { path: 'radar', changefreq: 'weekly', priority: '0.7' },
  { path: 'delta-audit', changefreq: 'weekly', priority: '0.7' }
]);

export const routes = Object.freeze(canonicalRoutes.map(({ path }) => path));

export function canonicalUrl(pathname) {
  return `${canonicalSiteUrl}/${pathname ? `${pathname}/` : ''}`;
}
