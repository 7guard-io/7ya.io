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

function excludePattern(body, pattern, label) {
  pattern.test(body) ? fail(`${label} matches forbidden pattern ${pattern}`) : pass(`${label} excludes ${pattern}`);
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

const criticalRoutes = [
  ['/', 'index.html'],
  ['/igor-vepretski/', 'igor-vepretski/index.html'],
  ['/talk/', 'talk/index.html'],
  ['/social/', 'social/index.html'],
  ['/pass/', 'pass/index.html'],
  ['/evidence/', 'evidence/index.html'],
  ['/starton/', 'starton/index.html'],
  ['/contact/', 'contact/index.html'],
  ['/radar/', 'radar/index.html']
];

const forbiddenPublicPatterns = [
  /<meta[^>]+name=["']robots["'][^>]+noindex/i,
  /http-equiv=["']refresh["']/i,
  /window\.location/i,
  /location\.replace/i,
  /Living Proof System/i,
  /Public trust shell/i,
  /Private strategic command room/i,
  /Utility route/i,
  /legacy lane/i,
  /Billions of impressions/i,
  /5\.1B\+/i,
  /50,000\+ empowered/i,
  /Microsoft-backed/i,
  /official partner/i,
  /Knesset Candidate/i,
  /candidate for Knesset/i,
  /\bcriminologist\b/i,
  /\bsecurity work\b/i
];

for (const [route, file] of criticalRoutes) {
  const html = read(file);
  const canonical = `https://7ya.io${route}`;

  requireText(html.toLowerCase(), '<!doctype html>', file);
  /<html\s+[^>]*lang=["'][^"']+["'][^>]*>/i.test(html)
    ? pass(`${file} declares document language`)
    : fail(`${file} missing html lang`);
  /<meta\s+name=["']viewport["']/i.test(html)
    ? pass(`${file} includes viewport`)
    : fail(`${file} missing viewport`);
  /<title>[^<]{3,}<\/title>/i.test(html)
    ? pass(`${file} includes title`)
    : fail(`${file} missing title`);
  /<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/i.test(html)
    ? pass(`${file} includes meaningful description`)
    : fail(`${file} missing meaningful description`);
  /<meta\s+name=["']robots["']\s+content=["'][^"']*index\s*,?\s*follow/i.test(html)
    ? pass(`${file} is indexable`)
    : fail(`${file} missing index, follow robots directive`);
  requireText(html, `<link rel="canonical" href="${canonical}">`, file);
  requireText(html, 'IGOR VEPRETSKI', file);

  for (const pattern of forbiddenPublicPatterns) excludePattern(html, pattern, file);
}

const identity = read('igor-vepretski/index.html');
for (const required of [
  'SELF-ATTESTED',
  'SOURCE PENDING',
  'השכלה בקרימינולוגיה',
  'אינה מוצגת כתואר מקצועי מאומת',
  '/evidence/',
  '/contact/'
]) requireText(identity, required, 'identity evidence contract');

const passPage = read('pass/index.html');
for (const required of [
  'NO CREDENTIAL',
  'NO AUTHORITY',
  'אין שירות פעיל',
  'אינו מחליף תעודת זהות',
  'דיווח על מצג מטעה'
]) requireText(passPage, required, '7YA Pass boundary');

const radar = read('radar/index.html');
for (const required of [
  'INTENT',
  'APPROVAL',
  'ALLOCATION',
  'EXECUTION',
  'OUTCOME',
  'אין לייחס עבירה',
  'זכות תגובה'
]) requireText(radar, required, 'Radar methodology');

const robots = read('robots.txt');
const recoveryRobots = read('ops/vercel-recovery/robots.txt');
for (const [label, body] of [['robots', robots], ['recovery robots', recoveryRobots]]) {
  for (const required of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
    requireText(body, required, label);
  }
  excludePattern(body, /Disallow:\s*\//i, label);
}

const sitemap = read('sitemap.xml');
const recoverySitemap = read('ops/vercel-recovery/sitemap.xml');
for (const [route] of criticalRoutes) {
  const loc = `https://7ya.io${route}`;
  requireText(sitemap, loc, 'canonical sitemap');
  requireText(recoverySitemap, loc, 'recovery sitemap');
}

const staticRecoveryRoutes = [
  'igor-vepretski', 'talk', 'social', 'pass', 'evidence', 'starton', 'contact', 'radar'
];
for (const route of staticRecoveryRoutes) {
  const sourcePath = `${route}/index.html`;
  const recoveryPath = `ops/vercel-recovery/${route}/index.html`;
  const source = read(sourcePath);
  const recovery = read(recoveryPath).replace(/\r\n/g, '\n').trim();

  if (['igor-vepretski', 'pass', 'radar'].includes(route)) {
    normalizeRecoveryMirror(source) === recovery
      ? pass(`${route} recovery mirror matches canonical source`)
      : fail(`${route} recovery mirror diverges from canonical source`);
  }
}

const cname = read('CNAME').trim();
cname === '7ya.io' ? pass('CNAME is canonical apex') : fail(`CNAME is ${cname || 'empty'}`);

const pagesWorkflow = read('.github/workflows/pages.yml');
for (const required of [
  'push:',
  'branches: [main]',
  'workflow_dispatch:',
  'pages: write',
  'id-token: write',
  'npm run check-all',
  'actions/deploy-pages@v4'
]) requireText(pagesWorkflow, required, 'Pages workflow');

const vercelPath = 'ops/vercel-recovery/vercel.json';
let vercel = {};
try {
  vercel = JSON.parse(read(vercelPath));
  pass(`${vercelPath} parses as JSON`);
} catch (error) {
  fail(`${vercelPath} invalid JSON: ${error.message}`);
}

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
for (const route of criticalRoutes.slice(1).map(([route]) => route)) {
  rewrites.some(rule => rule.source === route)
    ? fail(`${route} is still routed through generic recovery renderer`)
    : pass(`${route} is served as static recovery content`);
}

const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];
const wwwRedirect = redirects.find(rule =>
  rule.source === '/:path*' &&
  rule.destination === 'https://7ya.io/:path*' &&
  rule.permanent === true &&
  Array.isArray(rule.has) &&
  rule.has.some(condition => condition.type === 'host' && condition.value === 'www.7ya.io')
);
wwwRedirect ? pass('www redirects permanently to apex') : fail('www to apex redirect contract missing');

const headerRules = Array.isArray(vercel.headers) ? vercel.headers : [];
const headerMap = new Map(headerRules.map(rule => [
  rule.source,
  new Map((rule.headers || []).map(header => [header.key, header.value]))
]));
for (const route of criticalRoutes.slice(1).map(([route]) => route)) {
  const headers = headerMap.get(route);
  headers?.get('X-Robots-Tag') === 'index, follow'
    ? pass(`${route} has indexable response header`)
    : fail(`${route} missing X-Robots-Tag: index, follow`);
  headers?.get('Cache-Control') === 'public, max-age=0, must-revalidate'
    ? pass(`${route} has revalidation cache policy`)
    : fail(`${route} missing must-revalidate cache policy`);
}

for (const crawlPath of ['/robots.txt', '/sitemap.xml']) {
  const headers = headerMap.get(crawlPath);
  headers?.get('Cache-Control') === 'public, max-age=0, must-revalidate'
    ? pass(`${crawlPath} has revalidation cache policy`)
    : fail(`${crawlPath} missing revalidation cache policy`);
}

if (failures) {
  console.error(`\nP0_PUBLIC_INTEGRITY_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nP0_PUBLIC_INTEGRITY_GATE: PASS');
