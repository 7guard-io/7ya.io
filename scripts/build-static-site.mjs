import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  publicDataDirectories,
  publicRootFiles,
  publicRouteDirectories,
  publicScriptFiles,
  publicStyleFiles,
} from './site-contract.mjs';

const root = process.cwd();
const output = path.join(root, 'dist');
const guideStyleTag = '<link rel="stylesheet" href="/styles/7ya-signal-key-20260715.css" data-7ya-signal-key-assets="20260715">';
const guideScriptTag = '<script src="/scripts/7ya-signal-key-20260715.js" data-7ya-signal-key-assets="20260715" defer></script>';
const manifestTag = '<link rel="manifest" href="/site.webmanifest" data-7ya-pwa="20260817">';
const appleTouchIconTag = '<link rel="apple-touch-icon" sizes="180x180" href="/assets/7ya-app-icon-180.png" data-7ya-app-icon="20260817">';
const appleWebAppTitleTag = '<meta name="apple-mobile-web-app-title" content="7YA" data-7ya-app-icon="20260817">';
const appleWebAppCapableTag = '<meta name="apple-mobile-web-app-capable" content="yes" data-7ya-app-icon="20260817">';
const mobileWebAppCapableTag = '<meta name="mobile-web-app-capable" content="yes" data-7ya-app-icon="20260817">';
const controlStyleTag = '<link rel="stylesheet" href="/styles/7ya-control-layer-20260726.css?v=1" data-7ya-control-assets="20260726">';
const controlScriptTag = '<script src="/scripts/7ya-control-layer-20260726.js" data-7ya-control-assets="20260726" defer></script>';


const siteImpactStyleTag = '<link rel="stylesheet" href="/styles/site-impact-layer-20260918.css?v=2" data-7ya-impact-layer="20260918">';
const siteImpactScriptTag = '<script src="/scripts/site-impact-layer-20260918.js?v=2" data-7ya-impact-layer="20260918" defer></script>';
const siteImpactEligible = new Set([
  'index.html','7ya/index.html','museum/index.html','entity/index.html','create/index.html','history/index.html',
  'igor-vepretski/index.html','journey/index.html','starton/index.html','radar/index.html','influence/index.html',
  'research/index.html','response-ai/index.html','evidence/index.html','verify/index.html','ledger/index.html',
  'speaker/index.html','talk/index.html','media/index.html','library/index.html','articles/index.html',
  'contact/index.html','delta-audit/index.html','legacy/index.html'
]);
const siteImpactMarkup = `<section class="seven-proof-layer" data-seven-proof-layer aria-label="שכבת השפעה ציבורית">
  <div class="seven-proof-head">
    <div><div class="seven-proof-kicker">#7YA / PUBLIC RECORD / 2026</div><h2>העמוד הזה הוא רק שכבה אחת.<br><em>הרשומה גדולה יותר.</em></h2></div>
    <p>פרסומים, וידאו, עיתונות, מוזיקה, פודקאסטים, Facebook, Instagram ותגובות ציבוריות נשמרים באותה מערכת — עם מקור, תאריך והקשר.</p>
  </div>
  <div class="seven-proof-metrics">
    <a href="/influence/#master-public-record"><b data-seven-proof-master-count>434</b><span>רשומות ב־Master Public Record</span><small>FULL LEDGER ↗</small></a>
    <a href="/influence/#live-social-corpus"><b data-seven-proof-count>59</b><span>רשומות בקורפוס החברתי האוצר</span><small>CURATED SOCIAL ↗</small></a>
    <a href="/influence/#master-public-record"><b>248,155</b><span>Instagram reach · August 2023</span><small>OFFICIAL BUSINESS REPORT</small></a>
    <a href="https://www.instagram.com/igor.vepretski/" target="_blank" rel="noreferrer"><b>213K</b><span>views · The special ingredient #israel</span><small>OWNER INSIGHTS</small></a>
    <a href="https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0icaS4EV3EFHPbtTaexx3X4Lo9UGQD22Nvm8xzkpJRqiJSLro9D3zNp1PX6SJ26iPl" target="_blank" rel="noreferrer"><b>4,124</b><span>Facebook reactions · אבא מושלם</span><small>PUBLIC SNAPSHOT</small></a>
    <a href="https://www.instagram.com/p/Co4HKRLoack/" target="_blank" rel="noreferrer"><b>2,329</b><span>Instagram likes · אבא מושלם</span><small>PUBLIC POST</small></a>
  </div>
  <div class="seven-proof-visuals">
    <a class="seven-proof-visual" href="/igor-vepretski/"><img src="/assets/personal-hero-20260716/igor-hero.webp" alt="איגור ופרצקי" loading="lazy"><span>האדם מאחורי הרשומה</span></a>
    <a class="seven-proof-visual" href="https://www.youtube.com/watch?v=SOx8DUXFIEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/SOx8DUXFIEw/hqdefault.jpg" alt="StartOn בווידאו" loading="lazy"><span>StartOn · YouTube ↗</span></a>
    <a class="seven-proof-visual" href="https://www.youtube.com/watch?v=jRjZjpqAgEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/jRjZjpqAgEw/maxresdefault.jpg" alt="BIZZI feat Vepretski" loading="lazy"><span>BIZZI · MUSIC ↗</span></a>
    <a class="seven-proof-visual" href="https://holon.mynet.co.il/local_news/article/hjxqegkiq" target="_blank" rel="noreferrer"><img src="https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg" alt="StartOn ב-mynet חולון" loading="lazy"><span>mynet · חזרה לג׳סי כהן ↗</span></a>
  </div>
  <div class="seven-proof-context" data-seven-proof-context><a class="seven-proof-card" href="/influence/"><small>PUBLIC RECORD</small><h3>טוען רשומות רלוונטיות לעמוד…</h3><p>הקורפוס נטען מהמקור של 7YA.</p><b>למפת ההשפעה ↗</b></a></div>
  <nav class="seven-proof-links" aria-label="ערוצי מדיה וארכיון">
    <a href="https://www.facebook.com/vepretski7" target="_blank" rel="noreferrer">Facebook <span>↗</span></a>
    <a href="https://www.instagram.com/igor.vepretski/" target="_blank" rel="noreferrer">Instagram <span>↗</span></a>
    <a href="/media/">Media archive <span>↗</span></a>
    <a href="/influence/">Influence map <span>↗</span></a>
  </nav>
  <p class="seven-proof-integrity">מדדים מוצגים כ־snapshots מתוארכים או נתונים ממקור ראשון/ציבורי. הפצה חיצונית מסומנת בנפרד. רשומות פוליטיות נשמרות בארכיון ואינן מקודמות אוטומטית בשכבה זו.</p>
</section>`;

async function requireRegularSource(relative) {
  const source = path.join(root, relative);
  const stat = await fs.lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Refusing symlink in public artifact: ${relative}`);
  return source;
}

async function copyFile(relative, destination = relative) {
  const source = await requireRegularSource(relative);
  const target = path.join(output, destination);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function copyDirectory(relative) {
  const source = await requireRegularSource(relative);
  await fs.cp(source, path.join(output, relative), {
    recursive: true,
    dereference: false,
    errorOnExist: false,
  });
}

async function walk(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported artifact entry: ${relative}`);
  }
  return files;
}

function injectSharedAssets(html, relative) {
  if (relative === '404.html' || relative.startsWith('api/')) return html;
  if (!html.includes('</head>') || !html.includes('</body>')) {
    throw new Error(`Cannot inject shared assets into malformed HTML: ${relative}`);
  }

  const headTags = [];
  const bodyTags = [];
  if (!html.includes('data-7ya-signal-key-assets="20260715"')) {
    headTags.push(guideStyleTag);
    bodyTags.push(guideScriptTag);
  }
  if (!html.includes('rel="manifest"')) headTags.push(manifestTag);
  if (!html.includes('rel="apple-touch-icon"')) headTags.push(appleTouchIconTag);
  if (!html.includes('apple-mobile-web-app-title')) headTags.push(appleWebAppTitleTag);
  if (!html.includes('apple-mobile-web-app-capable')) headTags.push(appleWebAppCapableTag);
  if (!html.includes('mobile-web-app-capable')) headTags.push(mobileWebAppCapableTag);
  if (!html.includes('7ya-control-layer-20260726.css')) headTags.push(controlStyleTag);
  if (siteImpactEligible.has(relative) && !html.includes('data-7ya-impact-layer="20260918"')) headTags.push(siteImpactStyleTag);
  if (siteImpactEligible.has(relative) && !html.includes('data-7ya-impact-layer="20260918"')) headTags.push(siteImpactStyleTag);
  if (!html.includes('7ya-control-layer-20260726.js')) bodyTags.push(controlScriptTag);
  if (siteImpactEligible.has(relative) && !html.includes('data-seven-proof-layer')) bodyTags.unshift(siteImpactMarkup);
  if (siteImpactEligible.has(relative) && !html.includes('site-impact-layer-20260918.js')) bodyTags.push(siteImpactScriptTag);
  if (siteImpactEligible.has(relative) && !html.includes('data-seven-proof-layer')) bodyTags.unshift(siteImpactMarkup(relative));
  if (siteImpactEligible.has(relative) && !html.includes('site-impact-layer-20260918.js')) bodyTags.push(siteImpactScriptTag);

  let enhanced = html;
  if (headTags.length) enhanced = enhanced.replace('</head>', `  ${headTags.join('\n  ')}\n</head>`);
  if (bodyTags.length) enhanced = enhanced.replace('</body>', `  ${bodyTags.join('\n  ')}\n</body>`);
  return enhanced;
}

async function enhancePublicHtml() {
  const files = (await walk(output)).filter(file => file.endsWith('.html'));
  for (const relative of files) {
    const target = path.join(output, relative);
    const html = await fs.readFile(target, 'utf8');
    const enhanced = injectSharedAssets(html, relative);
    if (enhanced !== html) await fs.writeFile(target, enhanced, 'utf8');
  }
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

for (const file of publicRootFiles) await copyFile(file);
for (const directory of [...publicDataDirectories, ...publicRouteDirectories]) await copyDirectory(directory);
for (const file of publicStyleFiles) await copyFile(`styles/${file}`);
for (const file of publicScriptFiles) await copyFile(`scripts/${file}`);
await enhancePublicHtml();

const artifactFiles = await walk(output);
const hashes = {};
for (const file of artifactFiles) {
  const body = await fs.readFile(path.join(output, file));
  hashes[file] = crypto.createHash('sha256').update(body).digest('hex');
}

const manifest = {
  schema_version: 1,
  artifact: '7ya-static-site',
  file_count: artifactFiles.length,
  files: hashes,
};

await fs.writeFile(
  path.join(output, 'artifact-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`STATIC_ARTIFACT_BUILD: PASS (${artifactFiles.length} files + manifest)`);