import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

const pass = message => console.log(`PASS ${message}`);
const fail = message => {
  failures += 1;
  console.error(`FAIL ${message}`);
};

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`${relativePath} missing`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function normalizeRecoveryMirror(body) {
  return body
    .replace('/styles/creatorverse-depth-20260714.css?v=1', '/creatorverse-depth-20260714.css?v=1')
    .replace(
      '/assets/igor-home-portrait-20260712.jpg',
      'https://raw.githubusercontent.com/7guard-io/7ya.io/2c7b7e092bc593f29322efe5104af0d44ffbaec9/assets/igor-home-portrait-20260712.jpg'
    )
    .replace(/\r\n/g, '\n')
    .trim();
}

const route = '/public-service/';
const canonical = read('public-service/index.html');
const recovery = read('ops/vercel-recovery/public-service/index.html').replace(/\r\n/g, '\n').trim();

for (const required of [
  '<!doctype html>',
  '<html lang="he" dir="rtl">',
  '<title>שירות ציבורי ואחריות | איגור ופרצקי | 7YA</title>',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  '<link rel="canonical" href="https://7ya.io/public-service/">',
  'IGOR VEPRETSKI',
  'SELF-ATTESTED',
  'SOURCE PENDING',
  'NO OPERATIONAL DETAIL',
  'אינה מאמתות דרגה',
  'אין להסיק שהאדם מייצג כיום',
  '/evidence/',
  '/contact/'
]) requireText(canonical, required, 'public-service page');

for (const forbidden of [
  'Living Proof System',
  'Public trust shell',
  'verified service record',
  'official representative',
  'current police officer',
  'current security officer'
]) {
  canonical.includes(forbidden)
    ? fail(`public-service page contains unsupported claim: ${forbidden}`)
    : pass(`public-service page excludes ${forbidden}`);
}

normalizeRecoveryMirror(canonical) === recovery
  ? pass('public-service recovery mirror matches canonical source')
  : fail('public-service recovery mirror diverges from canonical source');

for (const sitemapPath of ['sitemap.xml', 'ops/vercel-recovery/sitemap.xml']) {
  requireText(read(sitemapPath), 'https://7ya.io/public-service/', sitemapPath);
}

let vercel = {};
try {
  vercel = JSON.parse(read('ops/vercel-recovery/vercel.json'));
  pass('ops/vercel-recovery/vercel.json parses as JSON');
} catch (error) {
  fail(`ops/vercel-recovery/vercel.json invalid JSON: ${error.message}`);
}

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
rewrites.some(rule => rule.source === route)
  ? fail(`${route} is still routed through generic renderer`)
  : pass(`${route} is served as static recovery content`);

const headerRules = Array.isArray(vercel.headers) ? vercel.headers : [];
const routeRule = headerRules.find(rule => rule.source === route);
const routeHeaders = new Map((routeRule?.headers || []).map(header => [header.key, header.value]));
routeHeaders.get('X-Robots-Tag') === 'index, follow'
  ? pass(`${route} preserves indexable response header`)
  : fail(`${route} missing X-Robots-Tag: index, follow`);
routeHeaders.get('Cache-Control') === 'public, max-age=0, must-revalidate'
  ? pass(`${route} preserves revalidation cache policy`)
  : fail(`${route} missing must-revalidate cache policy`);

if (failures) {
  console.error(`\nPUBLIC_SERVICE_INTEGRITY_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPUBLIC_SERVICE_INTEGRITY_GATE: PASS');
