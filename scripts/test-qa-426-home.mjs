/** Deterministic acceptance checks for QA #426's four public home routes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
const homes = [
  ['he', 'index.html', '/', 'איגור ופרצקי'],
  ['en', 'en/index.html', '/en/', 'Igor Vepretski'],
  ['ru', 'ru/index.html', '/ru/', 'Игорь Вепрецкий'],
  ['ar', 'ar/index.html', '/ar/', 'إيغور فيبريتسكي']
];
const routes = {he:'/', en:'/en/', ru:'/ru/', ar:'/ar/'};
for (const [locale, file, ownPath, name] of homes) {
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, new RegExp(`<h1[^>]*>${name}</h1>`), `${locale}: person name must be the H1`);
  assert.match(html, /class="[^"]*\bfirst-person-video\b[^"]*"[^>]*[\s\S]*?youtube\.com\/watch\?v=fxFAUrb1h0M/, 'first-person video must retain its original YouTube source');
  assert.match(html, /youtube-nocookie\.com\/embed\/fxFAUrb1h0M/, 'first-person video must be embedded in the opening experience');
  const personalMoments=html.match(/<section class="personal-moments"[\\s\\S]*?<\\/section>/)?.[0]||'';
  const imageCards=[...personalMoments.matchAll(/<a class="personal-moment[^"]*"[^>]*data-media-id="([^"]+)"[\\s\\S]*?<img\\b/g)];
  assert.equal(imageCards.length,7,`${locale}: every personal-moment card must include a real image`);
  assert.doesNotMatch(personalMoments,/<a class="personal-moment[^"]*"[^>]*>\\s*<span/,`${locale}: empty media frames are forbidden`);
  assert.match(html, /class="corpus-clarification"[\s\S]*?(?:September 2026|сентябрь 2026|ספטמבר 2026|سبتمبر 2026)/, `${locale}: corpus must be dated`);
  const switcher = html.match(/data-seven-languages[\s\S]*?<\/span>/)?.[0] || '';
  for (const [language, path] of Object.entries(routes)) {
    assert.match(switcher, new RegExp(`href="${path}"[^>]*lang="${language}"`), `${locale}: ${language} link must target ${path}`);
  }
  const hrefs = [...switcher.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(hrefs).size, 4, `${locale}: language destinations must be distinct`);
  assert.equal(routes[locale], ownPath);
}
const voices = fs.readFileSync('scripts/public-voices-wall-20261127.js', 'utf8');
assert.match(voices, /let records = fallbackRecords/);
assert.match(voices, /remoteRecords\.length \? remoteRecords : fallbackRecords/);
assert.match(voices, /fallbackRecords\.length\) render\(\)/);
console.log('QA_426_HOME: PASS (four locale switchers, person-first hero, dated corpus, static response fallback)');
