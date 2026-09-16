import fs from 'node:fs/promises';

const [dataText, scriptText, htmlText] = await Promise.all([
  fs.readFile('knowledge/moment-library-social-v1.json', 'utf8'),
  fs.readFile('scripts/moment-library-v1.js', 'utf8'),
  fs.readFile('moments/index.html', 'utf8'),
]);

const data = JSON.parse(dataText);
const moments = Array.isArray(data.moments) ? data.moments : [];
const failures = [];
const fail = message => failures.push(message);

if (data.layer !== 'DISCOVERY') fail('Moment seed library must remain DISCOVERY until verification');
if (data.policy?.genericPersonalMedia !== 'forbidden') fail('genericPersonalMedia must be forbidden');
if (data.policy?.cdnUrlsDurable !== false) fail('cdnUrlsDurable must be false');
if (moments.length < 10) fail(`expected at least 10 seeded moments, got ${moments.length}`);

const ids = new Set();
const urls = new Set();
for (const moment of moments) {
  if (!moment.id) fail('moment without id');
  else if (ids.has(moment.id)) fail(`duplicate moment id: ${moment.id}`);
  else ids.add(moment.id);

  const normalizedUrl = String(moment.sourceUrl || '').trim().replace(/\/+$/, '').toLowerCase();
  if (!normalizedUrl.startsWith('https://')) fail(`non-https source: ${moment.id}`);
  if (urls.has(normalizedUrl)) fail(`duplicate source URL: ${moment.sourceUrl}`);
  else urls.add(normalizedUrl);

  if (/fbcdn\.net|cdninstagram\.com|scontent/i.test(normalizedUrl)) {
    fail(`ephemeral CDN stored as durable source: ${moment.id}`);
  }
  if (/[?&]stkn=/i.test(normalizedUrl)) fail(`tracking token stored in canonical source: ${moment.id}`);

  if (
    moment.platform === 'Facebook' &&
    moment.mediaType === 'video' &&
    moment.accountRole === 'personal-primary' &&
    !normalizedUrl.includes('/videos/')
  ) {
    fail(`personal Facebook video must link directly to video object: ${moment.id}`);
  }
}

if (data.accounts?.instagramPrimary?.role !== 'personal-primary') fail('Instagram primary role mismatch');
if (data.accounts?.instagramSecondary?.role !== '7ya-secondary') fail('Instagram secondary role mismatch');
if (!moments.some(moment => moment.review === 'manual-review-required')) fail('manual-review fixture missing');

if (scriptText.includes('thum.io')) fail('runtime screenshot dependency is forbidden');
if (!scriptText.includes("moment.review === 'manual-review-required'")) fail('manual-review items are not gated in runtime');
if (!scriptText.includes('i.ytimg.com')) fail('YouTube source thumbnail path missing');
if (!scriptText.includes('moment-source-only')) fail('source-only media fallback missing');

for (const required of [
  'id="momentGrid"',
  'id="randomMoment"',
  '/styles/moment-library-v1.css',
  '/scripts/moment-library-v1.js',
  'https://7ya.io/moments/',
]) {
  if (!htmlText.includes(required)) fail(`Moments HTML missing: ${required}`);
}

if (failures.length) {
  console.error('MOMENT_LIBRARY_CHECK: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`MOMENT_LIBRARY_CHECK: PASS (${moments.length} moments; ${ids.size} unique ids; ${urls.size} unique sources)`);
