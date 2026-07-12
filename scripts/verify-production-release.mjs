import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  canonicalRoutes,
  canonicalSiteUrl,
  canonicalUrl
} from './site-routes.mjs';

const root = process.cwd();
const siteUrl = (process.env.SITE_URL || canonicalSiteUrl).replace(/\/$/, '');
const expectedSha = process.env.EXPECTED_SHA
  || process.env.GITHUB_SHA
  || process.env.COMMIT_SHA;
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || 'artifacts');
const checks = [];

function record(name, passed, details = {}) {
  checks.push({ name, passed, ...details });
  const prefix = passed ? 'PASS' : 'FAIL';
  console[passed ? 'log' : 'error'](`${prefix} ${name}`);
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function fetchAsset(assetPath) {
  const url = `${siteUrl}/${assetPath}`;
  const response = await fetch(url, {
    redirect: 'manual',
    headers: {
      accept: '*/*',
      'user-agent': '7YA-Institutional-Acceptance-Gate/1.0'
    },
    signal: AbortSignal.timeout(20_000)
  });
  const bytes = Buffer.from(await response.arrayBuffer());

  return {
    url,
    status: response.status,
    contentType: response.headers.get('content-type') || '',
    location: response.headers.get('location'),
    bytes
  };
}

function extractLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

if (!expectedSha || !/^[0-9a-f]{40}$/i.test(expectedSha)) {
  throw new Error('EXPECTED_SHA, GITHUB_SHA or COMMIT_SHA must contain the exact 40-character production candidate SHA.');
}

const localPaths = {
  sitemap: path.join(root, 'dist', 'sitemap.xml'),
  robots: path.join(root, 'dist', 'robots.txt'),
  release: path.join(root, 'dist', 'release.json')
};

const [localSitemap, localRobots, localRelease] = await Promise.all([
  fs.readFile(localPaths.sitemap),
  fs.readFile(localPaths.robots),
  fs.readFile(localPaths.release)
]);

const localReleaseJson = JSON.parse(localRelease.toString('utf8'));
record(
  'local release.json matches expected SHA',
  localReleaseJson.release_sha === expectedSha,
  { expected_sha: expectedSha, actual_sha: localReleaseJson.release_sha }
);

const [prodSitemap, prodRobots, prodRelease] = await Promise.all([
  fetchAsset('sitemap.xml'),
  fetchAsset('robots.txt'),
  fetchAsset('release.json')
]);

for (const [name, asset] of Object.entries({
  sitemap: prodSitemap,
  robots: prodRobots,
  release: prodRelease
})) {
  record(`${name} returns HTTP 200`, asset.status === 200, {
    url: asset.url,
    status: asset.status,
    redirect_location: asset.location
  });
  record(`${name} is not redirected`, asset.status < 300 || asset.status >= 400, {
    url: asset.url,
    status: asset.status,
    redirect_location: asset.location
  });
}

record(
  'sitemap content-type is XML',
  /^(application|text)\/xml(?:;|$)/i.test(prodSitemap.contentType),
  { content_type: prodSitemap.contentType }
);
record(
  'robots content-type is text',
  /^text\/plain(?:;|$)/i.test(prodRobots.contentType),
  { content_type: prodRobots.contentType }
);
record(
  'release content-type is JSON',
  /^application\/(?:json|[^;]+\+json)(?:;|$)/i.test(prodRelease.contentType),
  { content_type: prodRelease.contentType }
);

const localSitemapHash = sha256(localSitemap);
const prodSitemapHash = sha256(prodSitemap.bytes);
const localRobotsHash = sha256(localRobots);
const prodRobotsHash = sha256(prodRobots.bytes);

record('production sitemap bytes match dist', localSitemap.equals(prodSitemap.bytes), {
  local_sha256: localSitemapHash,
  production_sha256: prodSitemapHash
});
record('production robots bytes match dist', localRobots.equals(prodRobots.bytes), {
  local_sha256: localRobotsHash,
  production_sha256: prodRobotsHash
});

const expectedLocations = canonicalRoutes.map(({ path: routePath }) => canonicalUrl(routePath));
const actualLocations = extractLocations(prodSitemap.bytes.toString('utf8'));
record(
  'production sitemap contains the exact canonical route set',
  JSON.stringify(actualLocations) === JSON.stringify(expectedLocations),
  { expected_locations: expectedLocations, actual_locations: actualLocations }
);

const robotsBody = prodRobots.bytes.toString('utf8');
record(
  'production robots points to canonical sitemap',
  robotsBody.includes(`Sitemap: ${canonicalSiteUrl}/sitemap.xml`),
  { expected: `Sitemap: ${canonicalSiteUrl}/sitemap.xml` }
);

let productionReleaseJson = null;
try {
  productionReleaseJson = JSON.parse(prodRelease.bytes.toString('utf8'));
  record('production release.json is valid JSON', true);
} catch (error) {
  record('production release.json is valid JSON', false, { error: error.message });
}

if (productionReleaseJson) {
  record(
    'production release SHA matches tested SHA',
    productionReleaseJson.release_sha === expectedSha,
    { expected_sha: expectedSha, actual_sha: productionReleaseJson.release_sha }
  );
  record(
    'production release repository is canonical',
    productionReleaseJson.repository === '7guard-io/7ya.io',
    { expected_repository: '7guard-io/7ya.io', actual_repository: productionReleaseJson.repository }
  );
}

const passed = checks.every((check) => check.passed);
const evidence = {
  gate: 'G6.1_G6.2_G1.3',
  result: passed ? 'PASS' : 'FAIL',
  checked_at_utc: new Date().toISOString(),
  site_url: siteUrl,
  expected_sha: expectedSha,
  checks
};

await fs.mkdir(evidenceDir, { recursive: true });
await fs.writeFile(
  path.join(evidenceDir, 'production-seo-release-verification.json'),
  `${JSON.stringify(evidence, null, 2)}\n`,
  'utf8'
);

console.log(`Evidence written to ${path.relative(root, evidenceDir)}/production-seo-release-verification.json`);

if (!passed) {
  console.error('\nPRODUCTION_RELEASE_GATE: FAIL');
  process.exit(1);
}

console.log('\nPRODUCTION_RELEASE_GATE: PASS');
