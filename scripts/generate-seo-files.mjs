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
const releaseSha = process.env.RELEASE_SHA
  || process.env.GITHUB_SHA
  || process.env.COMMIT_SHA
  || 'local';

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

function assertReleaseSha() {
  if (releaseSha !== 'local' && !/^[0-9a-f]{40}$/i.test(releaseSha)) {
    throw new Error(`Invalid release SHA: ${releaseSha}`);
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

function buildRelease() {
  return `${JSON.stringify({
    release_sha: releaseSha,
    repository: '7guard-io/7ya.io'
  }, null, 2)}\n`;
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
assertReleaseSha();

const generatedFiles = {
  'sitemap.xml': buildSitemap(),
  'robots.txt': buildRobots(),
  'release.json': buildRelease()
};

for (const outputDir of outputDirs) {
  for (const [filename, content] of Object.entries(generatedFiles)) {
    await writeAtomic(path.join(outputDir, filename), content);
  }
}

console.log(`Generated sitemap.xml, robots.txt and release.json for ${canonicalRoutes.length} canonical routes.`);
console.log(`Release SHA: ${releaseSha}`);
console.log(`Outputs: ${outputDirs.map((dir) => path.relative(root, dir) || '.').join(', ')}`);
