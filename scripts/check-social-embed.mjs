import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'social/index.html',
  'social/embed.js',
  'social/oembed.json',
  'social/social-routes.json',
  'docs/social-embedded-terminal-os.md',
];

const blockedPhrases = [
  /million\s+views?/i,
  /verified\s+by\s+(tiktok|instagram|youtube|facebook|x|linkedin)/i,
  /official\s+partner/i,
  /sponsored\s+by/i,
  /endorsed\s+by/i,
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`missing file: ${file}`);
}

const html = existsSync('social/index.html') ? readFileSync('social/index.html', 'utf8') : '';
const embed = existsSync('social/embed.js') ? readFileSync('social/embed.js', 'utf8') : '';
const oembedRaw = existsSync('social/oembed.json') ? readFileSync('social/oembed.json', 'utf8') : '{}';
const manifestRaw = existsSync('social/social-routes.json') ? readFileSync('social/social-routes.json', 'utf8') : '{}';

for (const phrase of blockedPhrases) {
  if (phrase.test(html) || phrase.test(manifestRaw)) failures.push(`blocked public claim matched: ${phrase}`);
}

if (!html.includes('rel="alternate" type="application/json+oembed"')) failures.push('missing oEmbed discovery link');
if (!html.includes('No scraped metrics') && !html.includes('no scraped metrics')) failures.push('missing no-scraped-metrics statement');
if (!html.includes('application/ld+json')) failures.push('missing JSON-LD');
if (!embed.includes('/social/?embed=1')) failures.push('embed.js does not mount embed route');

try {
  const oembed = JSON.parse(oembedRaw);
  if (oembed.type !== 'rich') failures.push('oEmbed type must be rich');
  if (!String(oembed.html || '').includes('iframe')) failures.push('oEmbed html must include iframe');
} catch (error) {
  failures.push(`invalid oEmbed JSON: ${error.message}`);
}

try {
  const manifest = JSON.parse(manifestRaw);
  if (!Array.isArray(manifest.routes) || manifest.routes.length < 7) failures.push('manifest must include the seven core social routes');
  for (const route of manifest.routes || []) {
    if (!route.platform || !route.url || !route.handle) failures.push(`incomplete route record: ${JSON.stringify(route)}`);
  }
} catch (error) {
  failures.push(`invalid social routes JSON: ${error.message}`);
}

if (failures.length) {
  console.error('7YA social embed audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('7YA social embed audit passed. Static, free, source-aware social layer is ready.');
