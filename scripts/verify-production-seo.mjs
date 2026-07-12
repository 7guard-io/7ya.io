import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  canonicalRoutes,
  canonicalSiteUrl,
  canonicalUrl
} from './site-routes.mjs';

const productionUrl = new URL(process.env.PRODUCTION_URL || canonicalSiteUrl);
const timeoutMs = Number.parseInt(process.env.PRODUCTION_TIMEOUT_MS || '15000', 10);
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || 'artifacts');
const distDir = path.resolve(process.env.DIST_DIR || 'dist');
const evidencePath = path.join(evidenceDir, 'production-seo-verification.json');
const failures = [];

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function extractLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

async function fetchProduction(relativePath) {
  const url = new URL(relativePath, productionUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: '*/*',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': '7YA-G6-production-gate/1.0'
      }
    });

    const body = Buffer.from(await response.arrayBuffer());
    return {
      requested_url: url.href,
      final_url: response.url,
      status: response.status,
      content_type: response.headers.get('content-type') || '',
      cache_control: response.headers.get('cache-control') || '',
      body,
      bytes: body.byteLength,
      sha256: sha256(body)
    };
  } catch (error) {
    return {
      requested_url: url.href,
      final_url: null,
      status: null,
      content_type: '',
      cache_control: '',
      body: Buffer.alloc(0),
      bytes: 0,
      sha256: null,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    clearTimeout(timer);
  }
}

async function readDistFile(fileName) {
  const filePath = path.join(distDir, fileName);
  const body = await fs.readFile(filePath);
  return {
    path: filePath,
    body,
    bytes: body.byteLength,
    sha256: sha256(body)
  };
}

await fs.mkdir(evidenceDir, { recursive: true });

let localSitemap;
let localRobots;
try {
  [localSitemap, localRobots] = await Promise.all([
    readDistFile('sitemap.xml'),
    readDistFile('robots.txt')
  ]);
  pass('dist sitemap.xml and robots.txt exist');
} catch (error) {
  fail(`required dist SEO files are missing: ${error.message}`);
}

const [productionSitemap, productionRobots] = await Promise.all([
  fetchProduction('/sitemap.xml'),
  fetchProduction('/robots.txt')
]);

if (productionSitemap.error) {
  fail(`production sitemap request failed: ${productionSitemap.error}`);
} else {
  productionSitemap.status === 200
    ? pass('production sitemap returns HTTP 200')
    : fail(`production sitemap expected HTTP 200, received ${productionSitemap.status}`);

  /(?:application|text)\/(?:[a-z0-9.+-]*\+)?xml\b/i.test(productionSitemap.content_type)
    ? pass(`production sitemap content type is XML (${productionSitemap.content_type})`)
    : fail(`production sitemap has non-XML content type: ${productionSitemap.content_type || 'missing'}`);

  productionSitemap.final_url === new URL('/sitemap.xml', productionUrl).href
    ? pass('production sitemap remains on the canonical URL')
    : fail(`production sitemap redirected to ${productionSitemap.final_url}`);
}

if (localSitemap) {
  productionSitemap.sha256 === localSitemap.sha256
    ? pass(`production sitemap SHA-256 matches dist (${localSitemap.sha256})`)
    : fail(`production sitemap SHA-256 mismatch: production=${productionSitemap.sha256 || 'unavailable'} dist=${localSitemap.sha256}`);

  productionSitemap.body.equals(localSitemap.body)
    ? pass('production sitemap is byte-identical to dist/sitemap.xml')
    : fail('production sitemap differs byte-for-byte from dist/sitemap.xml');
}

if (productionSitemap.status === 200 && productionSitemap.body.byteLength > 0) {
  const xml = productionSitemap.body.toString('utf8');
  const locations = extractLocations(xml);
  const expectedLocations = canonicalRoutes.map(({ path: routePath }) => canonicalUrl(routePath));
  const uniqueLocations = new Set(locations);

  locations.length === expectedLocations.length
    ? pass(`production sitemap has ${expectedLocations.length} canonical URLs`)
    : fail(`production sitemap expected ${expectedLocations.length} URLs, found ${locations.length}`);

  uniqueLocations.size === locations.length
    ? pass('production sitemap has no duplicate URLs')
    : fail('production sitemap contains duplicate URLs');

  for (const expectedUrl of expectedLocations) {
    if (!locations.includes(expectedUrl)) {
      fail(`production sitemap missing ${expectedUrl}`);
    }
  }

  for (const location of locations) {
    if (!location.startsWith(`${canonicalSiteUrl}/`)) {
      fail(`production sitemap contains non-canonical URL: ${location}`);
    }

    if (/vercel\.app|netlify\.app|chatgpt\.site|localhost|127\.0\.0\.1/i.test(location)) {
      fail(`production sitemap contains preview or non-production host: ${location}`);
    }
  }
}

if (productionRobots.error) {
  fail(`production robots request failed: ${productionRobots.error}`);
} else {
  productionRobots.status === 200
    ? pass('production robots.txt returns HTTP 200')
    : fail(`production robots.txt expected HTTP 200, received ${productionRobots.status}`);

  productionRobots.final_url === new URL('/robots.txt', productionUrl).href
    ? pass('production robots.txt remains on the canonical URL')
    : fail(`production robots.txt redirected to ${productionRobots.final_url}`);
}

if (localRobots) {
  productionRobots.sha256 === localRobots.sha256
    ? pass(`production robots.txt SHA-256 matches dist (${localRobots.sha256})`)
    : fail(`production robots.txt SHA-256 mismatch: production=${productionRobots.sha256 || 'unavailable'} dist=${localRobots.sha256}`);

  productionRobots.body.equals(localRobots.body)
    ? pass('production robots.txt is byte-identical to dist/robots.txt')
    : fail('production robots.txt differs byte-for-byte from dist/robots.txt');
}

if (productionRobots.status === 200 && productionRobots.body.byteLength > 0) {
  const robots = productionRobots.body.toString('utf8');
  robots.includes(`Sitemap: ${canonicalSiteUrl}/sitemap.xml`)
    ? pass('production robots.txt points to the canonical sitemap')
    : fail('production robots.txt does not point to the canonical sitemap');

  /Disallow:\s*\/$/m.test(robots)
    ? fail('production robots.txt blocks the entire site')
    : pass('production robots.txt does not block the entire site');
}

const evidence = {
  gate: 'G6.1/G6.2',
  status: failures.length === 0 ? 'PASS' : 'FAIL',
  checked_at_utc: new Date().toISOString(),
  production_origin: productionUrl.origin,
  timeout_ms: timeoutMs,
  expected_routes: canonicalRoutes.map(({ path: routePath }) => canonicalUrl(routePath)),
  local: {
    sitemap: localSitemap
      ? { path: localSitemap.path, bytes: localSitemap.bytes, sha256: localSitemap.sha256 }
      : null,
    robots: localRobots
      ? { path: localRobots.path, bytes: localRobots.bytes, sha256: localRobots.sha256 }
      : null
  },
  production: {
    sitemap: {
      requested_url: productionSitemap.requested_url,
      final_url: productionSitemap.final_url,
      status: productionSitemap.status,
      content_type: productionSitemap.content_type,
      cache_control: productionSitemap.cache_control,
      bytes: productionSitemap.bytes,
      sha256: productionSitemap.sha256,
      error: productionSitemap.error || null
    },
    robots: {
      requested_url: productionRobots.requested_url,
      final_url: productionRobots.final_url,
      status: productionRobots.status,
      content_type: productionRobots.content_type,
      cache_control: productionRobots.cache_control,
      bytes: productionRobots.bytes,
      sha256: productionRobots.sha256,
      error: productionRobots.error || null
    }
  },
  failures
};

await fs.writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
console.log(`Evidence written to ${evidencePath}`);

if (failures.length > 0) {
  console.error(`\nPRODUCTION_SEO_GATE: FAIL (${failures.length})`);
  process.exit(1);
}

console.log('\nPRODUCTION_SEO_GATE: PASS');
