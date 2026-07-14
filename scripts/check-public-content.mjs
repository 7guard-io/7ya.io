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

function excludeText(body, text, label) {
  body.includes(text) ? fail(`${label} contains retired text: ${text}`) : pass(`${label} excludes ${text}`);
}

function normalizedArchiveMirror(body) {
  return body
    .replace('/styles/public-archive.css?v=1', '/public-archive.css?v=1')
    .replace(/\r\n/g, '\n')
    .trim();
}

const sitemap = read('sitemap.xml');
const recoverySitemap = read('ops/vercel-recovery/sitemap.xml');
const articleDirectory = path.join(root, 'articles');
const articleFiles = fs.readdirSync(articleDirectory)
  .filter(file => file.endsWith('.html') && file !== 'index.html')
  .sort();

articleFiles.length > 0
  ? pass(`discovered ${articleFiles.length} public article files`)
  : fail('no public article files discovered');

for (const file of articleFiles) {
  const canonical = `https://7ya.io/articles/${file}`;
  const sourcePath = `articles/${file}`;
  const recoveryPath = `ops/vercel-recovery/articles/${file}`;
  const source = read(sourcePath);
  const recovery = read(recoveryPath);

  requireText(sitemap, canonical, 'canonical sitemap');
  requireText(recoverySitemap, canonical, 'recovery sitemap');
  requireText(source, `<link rel="canonical" href="${canonical}"`, sourcePath);
  requireText(source, 'property="og:image"', sourcePath);
  requireText(source, 'name="twitter:card" content="summary_large_image"', sourcePath);
  requireText(source, 'max-image-preview:large', sourcePath);

  source.replace(/\r\n/g, '\n').trim() === recovery.replace(/\r\n/g, '\n').trim()
    ? pass(`${file} recovery mirror matches source`)
    : fail(`${file} recovery mirror diverges from source`);
}

const profile = read('igor-vepretski/index.html');
for (const required of [
  'property="og:image"',
  'name="twitter:card" content="summary_large_image"',
  'https://www.tiktok.com/@igor.vepretski',
  'https://github.com/vepretski',
  '/influence/',
  '/social/'
]) requireText(profile, required, 'public profile');

const archivePages = [
  ['social/index.html', 'ops/vercel-recovery/social/index.html', 7],
  ['influence/index.html', 'ops/vercel-recovery/influence/index.html', 6]
];

for (const [sourcePath, recoveryPath, minimumRecords] of archivePages) {
  const source = read(sourcePath);
  const recovery = read(recoveryPath);
  const records = (source.match(/data-source-status=/g) || []).length;
  records >= minimumRecords
    ? pass(`${sourcePath} has ${records} source-backed records`)
    : fail(`${sourcePath} has only ${records} source-backed records`);

  for (const required of [
    'property="og:image"',
    'name="twitter:card" content="summary_large_image"',
    'datetime="2026-07-14"',
    'data-source-status='
  ]) requireText(source, required, sourcePath);

  normalizedArchiveMirror(source) === recovery.replace(/\r\n/g, '\n').trim()
    ? pass(`${sourcePath} recovery mirror matches source`)
    : fail(`${sourcePath} recovery mirror diverges from source`);
}

for (const file of [
  'index.html',
  'igor-vepretski/index.html',
  'social/index.html',
  'influence/index.html',
  ...articleFiles.map(file => `articles/${file}`),
  'ops/vercel-recovery/social/index.html',
  'ops/vercel-recovery/influence/index.html',
  ...articleFiles.map(file => `ops/vercel-recovery/articles/${file}`)
]) {
  const body = read(file);
  for (const retired of [
    'Billions of impressions',
    'billions of impressions',
    '5.1B+',
    '50,000+ empowered',
    'Utility route',
    'legacy lane'
  ]) excludeText(body, retired, file);
}

const vercelPath = 'ops/vercel-recovery/vercel.json';
let vercel = {};
try {
  vercel = JSON.parse(read(vercelPath));
  pass(`${vercelPath} parses as JSON`);
} catch (error) {
  fail(`${vercelPath} invalid JSON: ${error.message}`);
}

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
for (const staticRoute of ['/social/', '/influence/']) {
  rewrites.some(rule => rule.source === staticRoute)
    ? fail(`${staticRoute} is still routed through the generic renderer`)
    : pass(`${staticRoute} is served as a static archive`);
}

const headerRules = Array.isArray(vercel.headers) ? vercel.headers : [];
const headersBySource = new Map(headerRules.map(rule => [rule.source, new Map((rule.headers || []).map(header => [header.key, header.value]))]));
for (const route of ['/social/', '/influence/', '/articles/(.*)']) {
  const headers = headersBySource.get(route);
  headers?.get('X-Robots-Tag') === 'index, follow'
    ? pass(`${route} preserves indexable response headers`)
    : fail(`${route} missing X-Robots-Tag: index, follow`);
  headers?.get('Cache-Control') === 'public, max-age=0, must-revalidate'
    ? pass(`${route} preserves revalidation cache policy`)
    : fail(`${route} missing must-revalidate cache policy`);
}

if (failures) {
  console.error(`\nPUBLIC_CONTENT_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPUBLIC_CONTENT_GATE: PASS');
