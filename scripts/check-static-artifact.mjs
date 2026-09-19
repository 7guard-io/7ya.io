import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  criticalArtifactPaths,
  forbiddenArtifactEntries,
  publicDataDirectories,
  publicRootFiles,
  publicRouteDirectories,
} from './site-contract.mjs';
import { generatedLocaleRoots } from './localize-static-site.mjs';

const output = path.join(process.cwd(), 'dist');
const manifestPath = path.join(output, 'artifact-manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

const failures = [];
const fail = message => failures.push(message);

async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
    else fail(`unsupported artifact entry ${relative}`);
  }
  return files;
}

function localCandidates(sourceFile, reference) {
  if (!reference || reference.startsWith('#') || /^%23/i.test(reference)) return [];
  let url;
  try { url = new URL(reference, `https://7ya.io/${sourceFile}`); }
  catch { return []; }
  if (!['http:', 'https:'].includes(url.protocol) || url.hostname !== '7ya.io') return [];

  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return [`INVALID:${reference}`]; }
  const clean = pathname.replace(/^\/+/, '');
  if (!clean) return ['index.html'];
  if (pathname.endsWith('/')) return [`${clean}index.html`];
  if (path.posix.extname(clean)) return [clean];
  return [clean, `${clean}.html`, `${clean}/index.html`];
}

function referencesFrom(file, body) {
  const references = [];
  if (file.endsWith('.html')) {
    for (const match of body.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) references.push(match[1].trim());
    for (const match of body.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
      for (const candidate of match[1].split(',')) references.push(candidate.trim().split(/\s+/)[0]);
    }
  }
  if (file.endsWith('.css')) {
    for (const match of body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1].trim());
  }
  if (file === 'site.webmanifest') {
    try {
      const webManifest = JSON.parse(body);
      for (const icon of webManifest.icons || []) if (icon?.src) references.push(icon.src);
      for (const shortcut of webManifest.shortcuts || []) {
        for (const icon of shortcut?.icons || []) if (icon?.src) references.push(icon.src);
      }
    } catch {
      fail('site.webmanifest is invalid JSON');
    }
  }
  return references;
}

for (const relative of criticalArtifactPaths) {
  try { await fs.access(path.join(output, relative)); }
  catch { fail(`missing critical artifact path ${relative}`); }
}

for (const relative of forbiddenArtifactEntries) {
  try {
    await fs.access(path.join(output, relative));
    fail(`forbidden artifact entry ${relative}`);
  } catch {}
}

const allowedTopLevel = new Set([
  ...publicRootFiles.map(entry => entry.split('/')[0]),
  ...publicDataDirectories,
  ...publicRouteDirectories,
  ...generatedLocaleRoots,
  'styles',
  'scripts',
  'artifact-manifest.json',
]);

for (const entry of await fs.readdir(output)) {
  if (!allowedTopLevel.has(entry)) fail(`unexpected top-level artifact entry ${entry}`);
}

const manifestEntries = Object.entries(manifest.files || {});
const artifactFiles = (await walk(output)).filter(file => file !== 'artifact-manifest.json');
if (manifest.schema_version !== 1) fail('artifact manifest schema mismatch');
if (manifest.artifact !== '7ya-static-site') fail('artifact manifest identity mismatch');
if (manifest.file_count !== manifestEntries.length) fail('artifact manifest file count mismatch');
const manifestedFiles = new Set(manifestEntries.map(([file]) => file));
if (artifactFiles.length !== manifestedFiles.size || artifactFiles.some(file => !manifestedFiles.has(file))) {
  fail('artifact files do not exactly match the immutable manifest');
}

for (const [relative, expectedHash] of manifestEntries) {
  const body = await fs.readFile(path.join(output, relative));
  const actualHash = crypto.createHash('sha256').update(body).digest('hex');
  if (actualHash !== expectedHash) fail(`hash mismatch for ${relative}`);

  if (relative.endsWith('.html') || relative.endsWith('.css') || relative === 'site.webmanifest') {
    for (const reference of referencesFrom(relative, body.toString('utf8'))) {
      const candidates = localCandidates(relative, reference);
      if (candidates.length && !candidates.some(candidate => manifest.files?.[candidate])) {
        fail(`${relative} references unpublished path ${reference}`);
      }
    }
  }
}

const brandAssets = [
  'assets/7ya-app-icon-180.png',
  'assets/7ya-app-icon-192.png',
  'assets/7ya-app-icon-512.png',
  'assets/7ya-app-icon-maskable-512.png',
];
for (const relative of brandAssets) {
  if (!manifest.files?.[relative]) fail(`missing branded app icon ${relative}`);
}

const webManifest = JSON.parse(await fs.readFile(path.join(output, 'site.webmanifest'), 'utf8'));
const manifestIcons = webManifest.icons || [];
const hasIcon = (sizes, purpose) => manifestIcons.some(icon =>
  icon.type === 'image/png' &&
  icon.sizes === sizes &&
  String(icon.purpose || 'any').split(/\s+/).includes(purpose)
);
if (!hasIcon('192x192', 'any')) fail('web manifest missing 192x192 PNG icon');
if (!hasIcon('512x512', 'any')) fail('web manifest missing 512x512 PNG icon');
if (!hasIcon('512x512', 'maskable')) fail('web manifest missing dedicated maskable 512x512 PNG icon');

for (const relative of artifactFiles.filter(file => file.endsWith('.html') && file !== '404.html' && !file.startsWith('api/'))) {
  const html = await fs.readFile(path.join(output, relative), 'utf8');
  if (!html.includes('rel="manifest"')) fail(`${relative} missing web manifest link`);
  if (!html.includes('rel="apple-touch-icon"')) fail(`${relative} missing apple touch icon link`);
  if (!html.includes('apple-mobile-web-app-title')) fail(`${relative} missing iOS app title metadata`);
}

const homepageHtml = await fs.readFile(path.join(output, 'index.html'), 'utf8');
const homepageFacebookSourceCount = (homepageHtml.match(/https:\/\/(?:www\.)?facebook\.com\//g) || []).length;
const homepageExternalSourceCount = (homepageHtml.match(/target=["']_blank["']/g) || []).length;
if (homepageFacebookSourceCount < 12) fail(`homepage Facebook coverage regressed: ${homepageFacebookSourceCount} < 12`);
if (homepageExternalSourceCount < 48) fail(`homepage source coverage regressed: ${homepageExternalSourceCount} < 48`);

const localizedCoreRoutes = ['', 'igor-vepretski', 'influence', 'library', 'evidence', 'journey', 'starton', 'media', 'research', 'contact'];
for (const locale of generatedLocaleRoots) {
  const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
  for (const route of localizedCoreRoutes) {
    const relative = `${locale}/${route ? route + '/' : ''}index.html`;
    if (!manifest.files?.[relative]) {
      fail(`missing localized core route ${relative}`);
      continue;
    }
    const html = await fs.readFile(path.join(output, relative), 'utf8');
    if (!html.includes(`lang="${locale}"`)) fail(`${relative} missing lang=${locale}`);
    if (!html.includes(`dir="${expectedDir}"`)) fail(`${relative} missing dir=${expectedDir}`);
    const canonical = `https://7ya.io/${locale}/${route ? route + '/' : ''}`;
    if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${relative} canonical mismatch`);
    for (const lang of ['he','en','ru','ar']) {
      if (!html.includes(`hreflang="${lang}"`)) fail(`${relative} missing hreflang ${lang}`);
    }
    if (!html.includes('hreflang="x-default"')) fail(`${relative} missing x-default hreflang`);
    if (!html.includes('data-seven-languages')) fail(`${relative} missing persistent language switcher`);
  }
}
const sitemapBody = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8');
for (const locale of generatedLocaleRoots) {
  if (!sitemapBody.includes(`https://7ya.io/${locale}/`)) fail(`sitemap missing ${locale} locale root`);
}

const localeEditorialLeakGuards = {
  en: [
    ['index.html', 'נולדתי בחרקוב, גדלתי בחולון'],
    ['index.html', 'בלי שפה של ארגון גדול'],
    ['igor-vepretski/index.html', 'נולדתי בחרקוב, גדלתי בישראל'],
    ['journey/index.html', 'לא באתי לבנות'],
    ['starton/index.html', 'StartOn נולדה'],
    ['media/index.html', 'לא ערכת מדיה'],
    ['influence/index.html', 'ההשפעה שלי'],
    ['library/index.html', 'לא תיקייה'],
    ['evidence/index.html', '7YA אינה מבקשת אמון עיוור'],
    ['research/index.html', 'כאן נמצאים המנוסקריפטים'],
    ['speaker/index.html', 'איגור ופרצקי זמין להרצאות'],
    ['contact/index.html', 'שיחה טובה מתחילה']
  ],
  ru: [],
  ar: []
};
localeEditorialLeakGuards.ru = localeEditorialLeakGuards.en.map(([route, phrase]) => [route, phrase]);
localeEditorialLeakGuards.ar = localeEditorialLeakGuards.en.map(([route, phrase]) => [route, phrase]);
for (const [locale, checks] of Object.entries(localeEditorialLeakGuards)) {
  for (const [route, phrase] of checks) {
    const relative = `${locale}/${route}`;
    if (!manifest.files?.[relative]) {
      fail(`missing locale editorial guard target ${relative}`);
      continue;
    }
    const html = await fs.readFile(path.join(output, relative), 'utf8');
    if (html.includes(phrase)) fail(`${relative} leaked untranslated editorial Hebrew: ${phrase}`);
  }
}

const visitorFacingForbiddenLabels = [
  'PUBLIC RECORD','PUBLIC RECORD / SCALE','MEDIA MASTER LIBRARY','FULL LEDGER','CURATED SOCIAL',
  'OFFICIAL BUSINESS REPORT','OWNER INSIGHTS','PUBLIC SNAPSHOT','PUBLIC POST','PUBLIC COMMENTS','EXTERNAL REPOST',
  'PUBLIC INFLUENCE WALL','DIGITAL INFLUENCE','EVIDENCE WALL','EPISTEMIC CONTRACT','PUBLIC LEDGER',
  'SOURCE SURFACES','PRIVACY BOUNDARY','THE THROUGH-LINE','THE SEVEN CHAPTERS','PERSON BEFORE SYSTEM',
  'OPEN THE SOURCE','PUBLIC SURFACES'
];
const visibleTextOf = html => html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
for (const relative of artifactFiles.filter(file => file.endsWith('.html') && !file.startsWith('api/'))) {
  const html = await fs.readFile(path.join(output, relative), 'utf8');
  const visible = visibleTextOf(html);
  for (const label of visitorFacingForbiddenLabels) if (visible.includes(label)) fail(`${relative} still exposes technical visitor label ${label}`);
  if (/dir=["']ltr["'][^>]*>[^<]*[\u0590-\u05ff]/iu.test(html)) fail(`${relative} keeps dir=ltr on Hebrew visitor text`);
}

const cname = (await fs.readFile(path.join(output, 'CNAME'), 'utf8')).trim();
if (cname !== '7ya.io') fail(`CNAME mismatch: ${cname}`);

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`STATIC_ARTIFACT_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`STATIC_ARTIFACT_CONTRACT: PASS (${manifestEntries.length} verified files)`);