import fs from 'node:fs';
import path from 'node:path';
import { aliasRoutes as aliases, canonicalRoutes } from './site-contract.mjs';

const root = process.cwd();
let failures = 0;

const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);
const filePath = file => path.join(root, file);

function read(file) {
  const resolved = filePath(file);
  if (!fs.existsSync(resolved)) {
    fail(`${file} missing`);
    return '';
  }
  pass(`${file} exists`);
  return fs.readFileSync(resolved, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function excludeText(body, text, label) {
  !body.includes(text) ? pass(`${label} excludes ${text}`) : fail(`${label} contains ${text}`);
}

function validateHtmlShell(file, html) {
  requireText(html, '<!doctype html>', file);
  /<html[^>]+lang="[^"]+"/i.test(html) ? pass(`${file} includes language`) : fail(`${file} missing language`);
  /<meta\s+name="viewport"/i.test(html) ? pass(`${file} includes viewport`) : fail(`${file} missing viewport`);
  /<title>[^<]+<\/title>/i.test(html) ? pass(`${file} includes title`) : fail(`${file} missing title`);
  /<meta\s+name="description"/i.test(html) ? pass(`${file} includes description`) : fail(`${file} missing description`);
}

function parseJson(file) {
  const raw = read(file);
  try {
    const parsed = JSON.parse(raw);
    pass(`${file} parses as JSON`);
    return parsed;
  } catch (error) {
    fail(`${file} invalid JSON: ${error.message}`);
    return null;
  }
}

for (const route of canonicalRoutes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;
  validateHtmlShell(file, html);
  /<meta\s+name="robots"\s+content="index,\s*follow/i.test(html)
    ? pass(`${file} is indexable`)
    : fail(`${file} missing index, follow robots directive`);
  requireText(html, `<link rel="canonical" href="${url}"`, file);
  if (/noindex/i.test(html)) fail(`${file} contains noindex`);
}

for (const [route, target] of aliases) {
  const file = `${route}/index.html`;
  const html = read(file);
  const canonical = `https://7ya.io${target}`;
  validateHtmlShell(file, html);
  /<meta\s+name="robots"\s+content="noindex,\s*follow/i.test(html)
    ? pass(`${file} is noindex follow`)
    : fail(`${file} missing noindex, follow`);
  requireText(html, `<link rel="canonical" href="${canonical}"`, file);
  requireText(html, 'http-equiv="refresh"', file);
  requireText(html, 'location.replace(', file);
}

const home = read('index.html');
for (const required of [
  'איגור ופרצקי', 'IGOR VEPRETSKI',
  'igor-personal-hero-20260716-1',
  'אדם.', 'ראיות.', 'פעולה.',
  'id="impact"', 'id="person"', 'id="sources"', 'id="starton"',
  'לתיאום שיחה', 'לצפייה בראיות',
  'DOCUMENTED · OWNER EXPORT', 'TIER 1 · מקור חיצוני',
  'STARTON · INDEPENDENT SOCIAL MISSION'
]) requireText(home, required, 'homepage');

for (const technical of [
  'width=device-width, initial-scale=1, viewport-fit=cover',
  '/assets/personal-hero-20260716/igor-hero.webp',
  '/assets/personal-hero-20260716/igor-executive.webp',
  '/assets/personal-hero-20260716/igor-public-service.webp',
  '/assets/personal-hero-20260716/igor-speaker.webp',
  '/assets/personal-hero-20260716/igor-closeup.webp',
  '/styles/igor-personal-hero-20260716.css?v=1',
  '/scripts/igor-personal-hero-20260716.js'
]) requireText(home, technical, 'homepage technical contract');

const h1Count = (home.match(/<h1\b/gi) || []).length;
h1Count === 1 ? pass('homepage has exactly one H1') : fail(`homepage has ${h1Count} H1 elements`);
const publicSourceCount = (home.match(/class="source-card reveal"/g) || []).length;
publicSourceCount === 4 ? pass('homepage has four source-linked records') : fail(`homepage has ${publicSourceCount} source-linked records`);

for (const forbidden of [
  'maximum-scale=1', '5.1B+', 'Billions of impressions', '50,000+ empowered',
  '100K+', 'Microsoft-backed', 'official partner', 'candidate for Knesset',
  'הסצנות הקולנועיות החדשות הן תיעוד', 'AI הוא איגור', 'השומר הוא איגור',
  'שותף רשמי', 'מגובה על ידי Microsoft'
]) excludeText(home, forbidden, 'homepage');

const personalHeroCss = read('styles/igor-personal-hero-20260716.css');
for (const required of [
  '.hero-image', '.metric-grid', '.manifesto', '.source-grid', '.starton',
  '.ecosystem-grid', '@media(max-width:760px)', '@media(prefers-reduced-motion:reduce)'
]) requireText(personalHeroCss, required, 'personal hero stylesheet');

const personalHeroScript = read('scripts/igor-personal-hero-20260716.js');
for (const required of [
  'requestAnimationFrame', 'IntersectionObserver', 'prefers-reduced-motion',
  "setAttribute('aria-expanded'", 'is-visible'
]) requireText(personalHeroScript, required, 'personal hero script');
excludeText(personalHeroScript, 'innerHTML', 'personal hero script');
excludeText(personalHeroScript, 'localStorage', 'personal hero script');

const infostoryCss = read('styles/igor-story-cinema-20260716.css');
for (const required of [
  '.hero-media', '.chapter', '.chapter-human', '.chapter-system',
  '/assets/igor-hero-storm-20260716.webp', '@media(prefers-reduced-motion:reduce)'
]) requireText(infostoryCss, required, 'infostory stylesheet');

const infostoryScript = read('scripts/igor-story-cinema-20260716.js');
for (const required of [
  "const scenes = [...document.querySelectorAll('.scene[id]')]",
  'updatePage', 'IntersectionObserver', 'prefers-reduced-motion'
]) requireText(infostoryScript, required, 'infostory script');
excludeText(infostoryScript, 'OPENAI_API_KEY', 'infostory script');
excludeText(infostoryScript, 'innerHTML', 'companion rendering contract');

const experienceGuide = read('scripts/7ya-experience-guide-20260716.js');
for (const required of [
  '7 / השומר', "sessionStorage.setItem('7ya-guide-path'", 'history-song-records-',
  'public-universe-records-20260715.json', 'canonicalUrl', 'replaceChildren',
  'אני לא איגור ולא מדבר במקומו'
]) requireText(experienceGuide, required, 'experience guide');
excludeText(experienceGuide, 'localStorage', 'experience guide privacy contract');
excludeText(experienceGuide, 'innerHTML', 'experience guide rendering contract');

const signalKey = read('scripts/7ya-signal-key-20260715.js');
for (const required of [
  "creatorMode: 'create'", "creatorMode: 'momentum'", "creatorMode: 'impact'",
  "fetch('/api/guide'", "window.addEventListener('7ya:creator-seed'",
  'navigator.clipboard.writeText', 'אני המלווה החיובי של 7YA'
]) requireText(signalKey, required, 'Signal Key companion');
excludeText(signalKey, 'localStorage', 'Signal Key privacy contract');
excludeText(signalKey, 'innerHTML', 'Signal Key rendering contract');

const history = read('history/index.html');
for (const required of [
  'שיר ההיסטוריה — ארכיון מלא', '66-RECORD PUBLIC CONTENT MAP',
  'id="archiveGrid"', 'id="archiveSearch"', '/museum/',
  '/scripts/history-song-20260714.js'
]) requireText(history, required, 'history archive');

const museum = read('museum/index.html');
for (const required of [
  'היקום הציבורי של איגור ופרצקי',
  'igor-public-universe-museum-20260715-2',
  'VERIFIED CORE + PUBLIC UNIVERSE',
  '66 היא ליבת ראיות — לא תקרת תוכן',
  'id="museumCoreCount"', 'id="museumUniverseCount"',
  'id="museumGrid"', 'id="museumSearch"',
  '/styles/public-content-museum-20260715.css?v=1',
  '/styles/public-universe-20260715.css?v=1',
  '/scripts/public-content-museum-20260715.js',
  '/knowledge/public-universe-records-20260715.json'
]) requireText(museum, required, 'public universe museum');
excludeText(museum, 'פתחו 66 רשומות', 'public universe museum');

const museumScript = read('scripts/public-content-museum-20260715.js');
for (const required of [
  'PUBLIC_UNIVERSE', 'VERIFIED_CORE', 'canonicalSourceKey',
  'public-universe-records-20260715.json', 'coreRecords.length < 66'
]) requireText(museumScript, required, 'public universe loader');
excludeText(museumScript, 'Expected 66 records', 'public universe loader');

const coreShardFiles = [1, 2, 3, 4, 5].map(part => `knowledge/history-song-records-${part}.json`);
const coreRecords = [];
for (const file of coreShardFiles) {
  const shard = parseJson(file);
  if (!shard) continue;
  Array.isArray(shard.records)
    ? coreRecords.push(...shard.records)
    : fail(`${file} missing records array`);
}
coreRecords.length === 66
  ? pass('Verified narrative core has 66 records')
  : fail(`Verified narrative core has ${coreRecords.length} records`);

const universeFile = 'knowledge/public-universe-records-20260715.json';
const universe = parseJson(universeFile);
const universeRecords = Array.isArray(universe?.records) ? universe.records : [];
universeRecords.length >= 20
  ? pass(`Public Universe has ${universeRecords.length} additional records`)
  : fail(`Public Universe has only ${universeRecords.length} additional records`);

const allRecords = [...coreRecords, ...universeRecords];
allRecords.length >= 86
  ? pass(`Combined public index has ${allRecords.length} source records before runtime URL deduplication`)
  : fail(`Combined public index is too small: ${allRecords.length}`);

const ids = new Set();
for (const record of allRecords) {
  if (!record?.id || !record?.title || !record?.url || !record?.platform || !record?.evidence_tier) {
    fail(`invalid public record: ${JSON.stringify(record)}`);
    continue;
  }
  ids.has(record.id) ? fail(`duplicate public record ID ${record.id}`) : ids.add(record.id);
  /^https:\/\//.test(record.url) ? pass(`${record.id} has public HTTPS source`) : fail(`${record.id} source is not HTTPS`);
  ['TIER_1', 'TIER_2', 'TIER_3'].includes(record.evidence_tier)
    ? pass(`${record.id} has valid evidence tier`)
    : fail(`${record.id} has invalid evidence tier`);
  if (record.metric && !record.metric.as_of) fail(`${record.id} metric missing as_of date`);
}

for (const file of [
  'assets/igor-home-portrait-20260712.webp',
  'assets/igor-home-portrait-20260712.jpg',
  'assets/igor-home-og-20260712.jpg',
  'styles/history-song-20260714.css',
  'styles/igor-infostory-20260716.css',
  'assets/infostory/01-origins.webp',
  'assets/infostory/02-public-voice.webp',
  'assets/infostory/03-creator-night.webp',
  'assets/infostory/04-force-system.webp',
  'styles/public-content-museum-20260715.css',
  'styles/public-universe-20260715.css',
  'scripts/history-song-20260714.js',
  'scripts/igor-infostory-20260716.js',
  'scripts/public-content-museum-20260715.js',
  ...coreShardFiles,
  universeFile,
  'favicon.svg', '404.html', 'sw.js', 'service-worker.js', 'release.json'
]) read(file);

const sitemap = read('sitemap.xml');
for (const route of canonicalRoutes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  requireText(sitemap, loc, 'sitemap');
}
for (const route of aliases.keys()) excludeText(sitemap, `https://7ya.io/${route}/`, 'sitemap aliases');
excludeText(sitemap, 'https://7ya.io/legacy/', 'sitemap legacy');

const robots = read('robots.txt');
for (const snippet of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
  requireText(robots, snippet, 'robots');
}

const release = parseJson('release.json');
if (release) {
  release.service === '7ya-frontend' ? pass('release service is canonical') : fail('release service mismatch');
  ['production', 'candidate'].includes(release.environment)
    ? pass(`release environment is ${release.environment}`)
    : fail('release environment mismatch');
  release.data_contract?.record_count === 66
    ? pass('release preserves 66-record verified core')
    : fail('release verified-core count mismatch');
  release.critical_surfaces?.includes('/museum/') ? pass('release includes museum surface') : fail('release missing museum surface');
  release.critical_surfaces?.includes('/create/') ? pass('release includes creator surface') : fail('release missing creator surface');
}

for (const route of ['igor-vepretski', 'starton', 'evidence', 'talk', 'contact']) {
  const file = `${route}/index.html`;
  const body = read(file);
  for (const required of ['IGOR VEPRETSKI', 'לתיאום שיחה', 'לצפייה בראיות']) {
    requireText(body, required, file);
  }
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
