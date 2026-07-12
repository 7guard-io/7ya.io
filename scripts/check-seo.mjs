import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  canonicalRoutes,
  canonicalSiteUrl,
  canonicalUrl
} from './site-routes.mjs';

const root = process.cwd();
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

async function readRequired(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    pass(`${path.relative(root, filePath)} exists`);
    return content;
  } catch (error) {
    fail(`${path.relative(root, filePath)} missing: ${error.message}`);
    return '';
  }
}

function extractLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

const rootSitemapPath = path.join(root, 'sitemap.xml');
const rootRobotsPath = path.join(root, 'robots.txt');
const distSitemapPath = path.join(root, 'dist', 'sitemap.xml');
const distRobotsPath = path.join(root, 'dist', 'robots.txt');

const [rootSitemap, rootRobots, distSitemap, distRobots] = await Promise.all([
  readRequired(rootSitemapPath),
  readRequired(rootRobotsPath),
  readRequired(distSitemapPath),
  readRequired(distRobotsPath)
]);

for (const [label, sitemap] of [
  ['root sitemap', rootSitemap],
  ['dist sitemap', distSitemap]
]) {
  if (!sitemap) continue;

  sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')
    ? pass(`${label} has XML declaration`)
    : fail(`${label} missing XML declaration`);

  sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    ? pass(`${label} has sitemap namespace`)
    : fail(`${label} missing sitemap namespace`);

  sitemap.trimEnd().endsWith('</urlset>')
    ? pass(`${label} closes urlset`)
    : fail(`${label} does not close urlset`);

  const locations = extractLocations(sitemap);
  const expected = canonicalRoutes.map(({ path: routePath }) => canonicalUrl(routePath));
  const uniqueLocations = new Set(locations);

  locations.length === expected.length
    ? pass(`${label} has ${expected.length} URLs`)
    : fail(`${label} expected ${expected.length} URLs, found ${locations.length}`);

  uniqueLocations.size === locations.length
    ? pass(`${label} has no duplicate URLs`)
    : fail(`${label} contains duplicate URLs`);

  for (const url of expected) {
    locations.includes(url)
      ? pass(`${label} includes ${url}`)
      : fail(`${label} missing ${url}`);
  }

  for (const url of locations) {
    if (!url.startsWith(`${canonicalSiteUrl}/`)) {
      fail(`${label} contains non-canonical URL: ${url}`);
    }

    if (/vercel\.app|netlify\.app|chatgpt\.site|localhost|127\.0\.0\.1/i.test(url)) {
      fail(`${label} contains preview or non-production host: ${url}`);
    }
  }
}

const expectedRobots = [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${canonicalSiteUrl}/sitemap.xml`
];

for (const [label, robots] of [
  ['root robots', rootRobots],
  ['dist robots', distRobots]
]) {
  if (!robots) continue;

  for (const line of expectedRobots) {
    robots.includes(line)
      ? pass(`${label} includes ${line}`)
      : fail(`${label} missing ${line}`);
  }

  /Disallow:\s*\/$/m.test(robots)
    ? fail(`${label} blocks the entire site`)
    : pass(`${label} does not block the entire site`);
}

if (rootSitemap && distSitemap) {
  rootSitemap === distSitemap
    ? pass('root and dist sitemap files are identical')
    : fail('root and dist sitemap files differ');
}

if (rootRobots && distRobots) {
  rootRobots === distRobots
    ? pass('root and dist robots files are identical')
    : fail('root and dist robots files differ');
}

if (failures > 0) {
  console.error(`\nSEO_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSEO_GATE: PASS');
