import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  canonicalRoutes,
  canonicalSiteUrl,
  canonicalUrl
} from './site-routes.mjs';

const root = process.cwd();
const outputDirs = [root, path.join(root, 'dist')];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function assertRouteRegistry() {
  const paths = canonicalRoutes.map(({ path: routePath }) => routePath);
  const uniquePaths = new Set(paths);

  if (uniquePaths.size !== paths.length) {
    throw new Error('Canonical route registry contains duplicate paths.');
  }

  for (const route of canonicalRoutes) {
    if (!/^[a-z0-9-]*$/.test(route.path)) {
      throw new Error(`Invalid canonical route path: ${route.path}`);
    }

    if (!['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(route.changefreq)) {
      throw new Error(`Invalid changefreq for ${route.path || '/'}: ${route.changefreq}`);
    }

    const priority = Number(route.priority);
    if (!Number.isFinite(priority) || priority < 0 || priority > 1) {
      throw new Error(`Invalid priority for ${route.path || '/'}: ${route.priority}`);
    }
  }
}

function buildSitemap() {
  const entries = canonicalRoutes.map((route) => [
    '  <url>',
    `    <loc>${escapeXml(canonicalUrl(route.path))}</loc>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>'
  ].join('\n'));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    ''
  ].join('\n');
}

function buildRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${canonicalSiteUrl}/sitemap.xml`,
    ''
  ].join('\n');
}

async function writeAtomic(targetPath, content) {
  const directory = path.dirname(targetPath);
  const temporaryPath = `${targetPath}.tmp-${process.pid}`;

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(temporaryPath, content, 'utf8');

  try {
    await fs.rename(temporaryPath, targetPath);
  } catch (error) {
    if (error?.code !== 'EEXIST' && error?.code !== 'EPERM') {
      throw error;
    }

    await fs.rm(targetPath, { force: true });
    await fs.rename(temporaryPath, targetPath);
  }
}

assertRouteRegistry();

const sitemap = buildSitemap();
const robots = buildRobots();

for (const outputDir of outputDirs) {
  await writeAtomic(path.join(outputDir, 'sitemap.xml'), sitemap);
  await writeAtomic(path.join(outputDir, 'robots.txt'), robots);
}

console.log(`Generated sitemap.xml and robots.txt for ${canonicalRoutes.length} canonical routes.`);
console.log(`Outputs: ${outputDirs.map((dir) => path.relative(root, dir) || '.').join(', ')}`);
