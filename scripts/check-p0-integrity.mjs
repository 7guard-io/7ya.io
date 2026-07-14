import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;
const pass = message => console.log(`PASS ${message}`);
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const read = relative => {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) { fail(`${relative} missing`); return ''; }
  return fs.readFileSync(absolute, 'utf8');
};
const requireText = (body,text,label) => body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
const forbid = (body,pattern,label) => pattern.test(body) ? fail(`${label} matches forbidden ${pattern}`) : pass(`${label} excludes ${pattern}`);

const critical = [
  ['/', 'index.html'],
  ['/igor-vepretski/', 'igor-vepretski/index.html'],
  ['/talk/', 'talk/index.html'],
  ['/social/', 'social/index.html'],
  ['/pass/', 'pass/index.html'],
  ['/evidence/', 'evidence/index.html'],
  ['/starton/', 'starton/index.html'],
  ['/contact/', 'contact/index.html'],
  ['/radar/', 'radar/index.html'],
];

for (const [route,file] of critical) {
  const html = read(file);
  const canonical = `https://7ya.io${route}`;
  /<title>[^<]{3,}<\/title>/i.test(html) ? pass(`${file} has title`) : fail(`${file} missing title`);
  /<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/i.test(html) ? pass(`${file} has description`) : fail(`${file} missing description`);
  /<meta\s+name=["']robots["']\s+content=["'][^"']*index\s*,?\s*follow/i.test(html) ? pass(`${file} is indexable`) : fail(`${file} missing index,follow`);
  requireText(html, `<link rel="canonical" href="${canonical}">`, file);
  for (const pattern of [/noindex/i,/http-equiv=["']refresh/i,/location\.replace/i,/window\.location/i,/Living Proof System/i,/Utility route/i,/legacy lane/i]) forbid(html,pattern,file);
}

const social = read('social/index.html');
for (const marker of ['PUBLIC CHANNELS','METRICS REQUIRE SNAPSHOT','tiktok.com/@igor.vepretski','instagram.com/igor.vepretski','youtube.com/@IgorVepretski']) requireText(social,marker,'social contract');
const passPage = read('pass/index.html');
for (const marker of ['RESERVED','NO CREDENTIAL','NO AUTHORITY','אינו מחליף תעודת זהות']) requireText(passPage,marker,'pass boundary');
const radar = read('radar/index.html');
for (const marker of ['INTENT','APPROVAL','ALLOCATION','EXECUTION','OUTCOME','אין לייחס עבירה']) requireText(radar,marker,'radar method');
const service = read('public-service/index.html');
for (const marker of ['SELF-ATTESTED','SOURCE PENDING','NO OPERATIONAL DETAIL','אין כאן טענה לסמכות נוכחית']) requireText(service,marker,'service claims');
for (const pattern of [/\bcriminologist\b/i,/\bsecurity work\b/i,/official representative/i,/current police officer/i]) {
  forbid(read('igor-vepretski/index.html'),pattern,'identity claims');
  forbid(service,pattern,'service claims');
}
for (const file of ['index.html','journey/index.html','ops/vercel-recovery/index.html']) {
  const body = read(file);
  for (const unsupportedAlias of ['Ido Vepretski','Igor Ido Vepretski','עידו ופרצקי']) {
    forbid(body,new RegExp(unsupportedAlias,'i'),`${file} identity aliases`);
  }
}

for (const crawlFile of ['robots.txt','ops/vercel-recovery/robots.txt']) {
  const body = read(crawlFile);
  for (const marker of ['User-agent: *','Allow: /','Sitemap: https://7ya.io/sitemap.xml']) requireText(body,marker,crawlFile);
  forbid(body,/Disallow:\s*\//i,crawlFile);
}
for (const sitemapFile of ['sitemap.xml','ops/vercel-recovery/sitemap.xml']) {
  const body = read(sitemapFile);
  for (const [route] of critical) requireText(body,`https://7ya.io${route}`,sitemapFile);
  requireText(body,'https://7ya.io/public-service/',sitemapFile);
}

for (const route of ['social','pass','radar','public-service']) {
  const source = read(`${route}/index.html`);
  const recovery = read(`ops/vercel-recovery/${route}/index.html`);
  for (const marker of ['<title>','<meta name="description"','index,follow',`https://7ya.io/${route}/`]) {
    requireText(source,marker,`${route} source`);
    requireText(recovery,marker,`${route} recovery`);
  }
}

let vercel = {};
try { vercel = JSON.parse(read('ops/vercel-recovery/vercel.json')); pass('vercel.json parses'); }
catch (error) { fail(`vercel.json invalid: ${error.message}`); }
const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];
const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
const criticalNonRoot = critical.slice(1).map(([route])=>route);
for (const route of criticalNonRoot) {
  redirects.some(rule=>rule.source===route) ? fail(`${route} must not redirect`) : pass(`${route} has no redirect`);
  rewrites.some(rule=>rule.source===route) ? fail(`${route} must not use generic rewrite`) : pass(`${route} is static`);
}
const wwwRule = redirects.find(rule=>rule.source==='/:path*' && rule.destination==='https://7ya.io/:path*' && rule.permanent===true && Array.isArray(rule.has) && rule.has.some(item=>item.type==='host' && item.value==='www.7ya.io'));
wwwRule ? pass('www redirects permanently to apex') : fail('www to apex redirect missing');
const headerMap = new Map((vercel.headers||[]).map(rule=>[rule.source,new Map((rule.headers||[]).map(header=>[header.key,header.value]))]));
for (const route of criticalNonRoot) {
  const headers = headerMap.get(route);
  headers?.get('X-Robots-Tag')==='index, follow' ? pass(`${route} response is indexable`) : fail(`${route} missing X-Robots-Tag`);
  headers?.get('Cache-Control')==='public, max-age=0, must-revalidate' ? pass(`${route} revalidates`) : fail(`${route} missing revalidation cache`);
}

for (const manifestPath of ['release.json','ops/vercel-recovery/release.json']) {
  let manifest = {};
  try { manifest = JSON.parse(read(manifestPath)); pass(`${manifestPath} parses`); }
  catch (error) { fail(`${manifestPath} invalid: ${error.message}`); }
  manifest.status==='SOURCE_READY' ? pass(`${manifestPath} is source-only`) : fail(`${manifestPath} must not claim READY`);
  manifest.production_verified===false ? pass(`${manifestPath} production is unverified`) : fail(`${manifestPath} must set production_verified=false`);
  manifest.source_sha===null ? pass(`${manifestPath} has no stale SHA`) : fail(`${manifestPath} must keep source_sha null`);
  for (const [route] of critical) (manifest.critical_routes||[]).includes(route) ? pass(`${manifestPath} lists ${route}`) : fail(`${manifestPath} missing ${route}`);
}

const releaseApi = read('ops/vercel-recovery/api/release.js');
for (const marker of ['PROVENANCE_UNBOUND','PROVENANCE_NOT_PROVIDER_BOUND','PROVENANCE_MISMATCH','PREVIEW_READY','production_verified']) requireText(releaseApi,marker,'release API');
const generator = read('ops/vercel-recovery/scripts/generate-release.js');
for (const marker of ['VERCEL_GIT_COMMIT_SHA','GITHUB_SHA','ALLOW_MANUAL_SOURCE_SHA','Manual source SHA is forbidden for production releases']) requireText(generator,marker,'release generator');
const releaseTest = read('ops/vercel-recovery/scripts/test-release.js');
for (const marker of ['PROVENANCE_UNBOUND','PROVENANCE_NOT_PROVIDER_BOUND','PREVIEW_READY','READY','PROVENANCE_MISMATCH']) requireText(releaseTest,marker,'release tests');
const proxyRelease = read('ops/vercel-canonical-proxy/api/release.js');
for (const marker of ['PROVENANCE_UNBOUND','SOURCE_BOUND','production_verified: false','CANONICAL_SOURCE_SHA','VERCEL_GIT_COMMIT_SHA','GITHUB_SHA']) requireText(proxyRelease,marker,'proxy release');
forbid(proxyRelease,/source_sha:\s*['"][0-9a-f]{40}['"]/i,'proxy release hard-coded SHA');

const pages = read('.github/workflows/pages.yml');
for (const marker of ['push:','branches: [main]','workflow_dispatch:','pages: write','id-token: write','npm run check-all','actions/deploy-pages@v4']) requireText(pages,marker,'Pages workflow');
read('CNAME').trim()==='7ya.io' ? pass('CNAME is canonical apex') : fail('CNAME is not 7ya.io');

if (failures) { console.error(`\nP0_INTEGRITY_GATE: FAIL (${failures})`); process.exit(1); }
console.log('\nP0_INTEGRITY_GATE: PASS');
