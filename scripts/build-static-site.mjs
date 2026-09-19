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


const siteImpactStyleTag = '<link rel="stylesheet" href="/styles/site-impact-layer-20260918.css?v=3" data-7ya-impact-layer="20260918">';
const siteImpactScriptTag = '<script src="/scripts/site-impact-layer-20260918.js?v=3" data-7ya-impact-layer="20260918" defer></script>';
const siteHumanNavMarkup = `<nav class="seven-human-nav" data-seven-human-nav aria-label="ניווט אחיד ב־7YA">
  <a href="/">ראשי</a><a href="/igor-vepretski/">הסיפור</a><a href="/influence/">הפיד</a><a href="/library/">מקור</a><a href="/evidence/">ראיות</a><a href="/journey/">המסע</a><a class="seven-human-nav-cta" href="/contact/">דברו איתי</a>
</nav>`;
const siteImpactEligible = new Set([
  'index.html','7ya/index.html','museum/index.html','entity/index.html','create/index.html','history/index.html',
  'igor-vepretski/index.html','journey/index.html','starton/index.html','radar/index.html','influence/index.html',
  'research/index.html','response-ai/index.html','evidence/index.html','verify/index.html','ledger/index.html',
  'speaker/index.html','talk/index.html','media/index.html','library/index.html','articles/index.html',
  'contact/index.html','delta-audit/index.html','legacy/index.html'
]);
const siteImpactMarkup = `<section class="seven-proof-layer" data-seven-proof-layer aria-label="שכבת השפעה ציבורית">
  <div class="seven-proof-head">
    <div><div class="seven-proof-kicker">#7YA · אלבום החיים · 2026</div><h2>העמוד הזה הוא רק שכבה אחת.<br><em>הרשומה גדולה יותר.</em></h2></div>
    <p>פרסומים, וידאו, עיתונות, מוזיקה, פודקאסטים, Facebook, Instagram ותגובות ציבוריות נשמרים באותה מערכת — עם מקור, תאריך והקשר.</p>
  </div>
  <div class="seven-proof-metrics">
    <a href="/influence/#master-public-record"><b data-seven-proof-master-count>434</b><span>רשומות במאגר החיים המלא</span><small>למאגר המלא ↗</small></a>
    <a href="/influence/#live-social-corpus"><b data-seven-proof-count>59</b><span>רשומות בקורפוס החברתי האוצר</span><small>לפיד הנבחר ↗</small></a>
    <a href="/influence/#master-public-record"><b>248,155</b><span>חשיפה ב־Instagram · אוגוסט 2023</span><small>דוח רשמי של החשבון</small></a>
    <a href="https://www.instagram.com/igor.vepretski/" target="_blank" rel="noreferrer"><b>213K</b><span>views · The special ingredient #israel</span><small>נתוני החשבון שלי</small></a>
    <a href="https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0icaS4EV3EFHPbtTaexx3X4Lo9UGQD22Nvm8xzkpJRqiJSLro9D3zNp1PX6SJ26iPl" target="_blank" rel="noreferrer"><b>4,124</b><span>תגובות־רגש ב־Facebook · אבא מושלם</span><small>צילום מצב ציבורי</small></a>
    <a href="https://www.instagram.com/p/Co4HKRLoack/" target="_blank" rel="noreferrer"><b>2,329</b><span>לייקים ב־Instagram · אבא מושלם</span><small>פוסט ציבורי</small></a>
  </div>
  <div class="seven-proof-visuals">
    <a class="seven-proof-visual" href="/igor-vepretski/"><img src="/assets/personal-hero-20260716/igor-hero.webp" alt="איגור ופרצקי" loading="lazy"><span>האדם מאחורי הרשומה</span></a>
    <a class="seven-proof-visual" href="https://www.youtube.com/watch?v=SOx8DUXFIEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/SOx8DUXFIEw/hqdefault.jpg" alt="StartOn בווידאו" loading="lazy"><span>StartOn · YouTube ↗</span></a>
    <a class="seven-proof-visual" href="https://www.youtube.com/watch?v=jRjZjpqAgEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/jRjZjpqAgEw/maxresdefault.jpg" alt="BIZZI feat Vepretski" loading="lazy"><span>BIZZI · MUSIC ↗</span></a>
    <a class="seven-proof-visual" href="https://holon.mynet.co.il/local_news/article/hjxqegkiq" target="_blank" rel="noreferrer"><img src="https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg" alt="StartOn ב-mynet חולון" loading="lazy"><span>mynet · חזרה לג׳סי כהן ↗</span></a>
  </div>
  <div class="seven-proof-context" data-seven-proof-context><a class="seven-proof-card" href="/influence/"><small>אלבום חיים</small><h3>טוען רשומות רלוונטיות לעמוד…</h3><p>הקורפוס נטען מהמקור של 7YA.</p><b>למפת ההשפעה ↗</b></a></div>
  <nav class="seven-proof-links" data-seven-proof-links aria-label="כל חלקי 7YA והמקורות הקנוניים">
    <a href="/igor-vepretski/">החיים והזהות <span>↗</span></a>
    <a href="/starton/">StartOn <span>↗</span></a>
    <a href="/media/">מדיה <span>↗</span></a>
    <a href="/research/">מחקר <span>↗</span></a>
    <a href="https://igorvepretski.academia.edu/" target="_blank" rel="noreferrer">Academia <span>↗</span></a>
    <a href="/articles/">כתיבה <span>↗</span></a>
    <a href="/influence/">השפעה <span>↗</span></a>
    <a href="/evidence/">ראיות <span>↗</span></a>
  </nav>
  <p class="seven-proof-integrity">מדדים מוצגים כצילומי מצב מתוארכים או נתונים ממקור ראשון/ציבורי. הפצה חיצונית מסומנת בנפרד. רשומות פוליטיות נשמרות בארכיון ואינן מקודמות אוטומטית בשכבה זו.</p>
</section>`;


const visitorLabelTranslations = [
  ['OWNED PUBLIC MEMORY · WEB VERIFIED','זיכרון אישי · מקור מאומת'],
  ['OWNED PUBLIC VIDEO · VERIFIED','וידאו אישי · מקור מאומת'],
  ['OWNED PUBLIC POST · WEB VERIFIED','פוסט אישי · מקור מאומת'],
  ['OWNED POLITICAL POST · WEB VERIFIED','פוסט ציבורי · מקור מאומת'],
  ['ARCHIVE PUBLISHER RECORD · PERIOD SOURCE · PHOTO CREDIT IDF SPOKESPERSON','מקור מהתקופה · קרדיט צילום: דובר צה״ל'],
  ['OFFICIAL U.S. GOVERNMENT RECORD · PERIOD DOCUMENT · DUTIES NOT INFERRED','מסמך ממשלתי אמריקאי מהתקופה · ללא פרשנות על התפקידים'],
  ['PUBLISHER PAGE · VERIFIED · METRIC DISPUTED','מקור עיתונאי מאומת · המספרים שנויים במחלוקת'],
  ['THIRD-PARTY PODCAST · ORIGINAL SOURCE · VERIFIED','פודקאסט חיצוני · המקור המקורי'],
  ['OFFICIAL PUBLIC VIDEO · CO-CREATION · VERIFIED','קליפ רשמי · שיתוף פעולה'],
  ['OWNER INSIGHTS · CANONICAL REEL · 01.08.2026','נתוני החשבון שלי · הריל הקנוני · 01.08.2026'],
  ['EXTERNAL CREATOR SOURCE · VERIFIED · NOT OWNED REACH','מקור של יוצר חיצוני · לא בבעלותי'],
  ['FACEBOOK · LIVE GRAPH API · ARCHIVE FALLBACK','Facebook · נתונים חיים · גיבוי ארכיון'],
  ['FACEBOOK · PARTY DISTRIBUTION · INDEXED','Facebook · הפצה מפלגתית · באינדקס'],
  ['FACEBOOK · DISTRIBUTION INSTANCE','Facebook · מופע הפצה'],
  ['FACEBOOK · VIRAL VIDEO · INDEXED','Facebook · וידאו ויראלי · באינדקס'],
  ['FACEBOOK · EXTERNAL REPOST','Facebook · שיתוף חיצוני'],
  ['POST / SOURCE · ARCHIVE VERIFIED_CROSS_PLATFORM','פוסט / מקור · אומת דרך כמה פלטפורמות'],
  ['IDENTITY → IMMIGRATION → REPOSTS → PROFESSIONAL MIRROR','זהות → עלייה → שיתופים → ראי מקצועי'],
  ['LIFE DECISION → COMMENTS → PRESS → BROADCAST → BUILD','החלטה → תגובות → עיתונות → שידור → בנייה'],
  ['FATHERHOOD → FACEBOOK → LINKEDIN → MEDIA','אבהות → Facebook → LinkedIn → מדיה'],
  ['TREND → CREATOR CROSSOVER → SONG → VIDEO','טרנד → מעבר בין יוצרים → שיר → וידאו'],
  ['LIFE → POST → PEOPLE → CONSEQUENCE','חיים → פוסט → אנשים → מה נשאר'],
  ['POSTS AS MEMORY / VIRAL UNIVERSE','פוסטים כזיכרון · היקום הוויראלי'],
  ['BROADCAST / LIVE UNIVERSE','שידור · היקום החי'],
  ['VERIFIED_MULTI_NODE','אומת מכמה מקורות'],['VERIFIED_MIXED_EXTERNAL','אומת חלקית · מקורות חיצוניים'],
  ['PUBLISHER PAGE · VERIFIED','מקור עיתונאי מאומת'],['TV INTERVIEW · VERIFIED','ראיון טלוויזיה מאומת'],
  ['THIRD-PARTY ARTICLE · VERIFIED','כתבה חיצונית מאומתת'],['BROADCAST RECORD · VERIFIED','שידור מאומת'],
  ['LONG FORM VIDEO · VERIFIED','שיחה ארוכה · מקור מאומת'],['CANON · SOURCE','המאגר · המקור'],
  ['MEDIA MASTER LIBRARY','ספריית המדיה המלאה'],['MASTER PUBLIC RECORD','מאגר החיים המלא'],
  ['Master Public Record','מאגר החיים המלא'],['CURATED SOCIAL CORPUS','הפיד החברתי הנבחר'],
  ['CURATED SOCIAL','הפיד הנבחר'],['FULL LEDGER','המאגר המלא'],
  ['OFFICIAL BUSINESS REPORT','דוח רשמי של החשבון'],['OWNER INSIGHTS','נתוני החשבון שלי'],
  ['PUBLIC COMMENTS','תגובות מהציבור'],['PUBLIC SNAPSHOT','צילום מצב ציבורי'],['PUBLIC POST','פוסט ציבורי'],
  ['EXTERNAL DISTRIBUTION','הפצה חיצונית'],['EXTERNAL REPOST','שיתוף חיצוני'],
  ['PUBLIC RECORD','אלבום חיים'],['PUBLIC SOURCE','מקור ציבורי'],['PUBLIC ASSET','נכס ציבורי'],
  ['PUBLIC MEMORY','זיכרון ציבורי'],['PUBLIC SURFACES','החלונות הציבוריים'],['PUBLIC SERVICE','שירות ציבורי'],
  ['PUBLIC ISSUE','סוגיה ציבורית'],['OPEN THE SOURCE','פותחים את המקור'],['SOCIAL MISSION','שליחות חברתית'],
  ['WORKING IDEAS','רעיונות בעבודה'],['LIFE / IDENTITY','החיים והזהות'],['IDENTITY ANCHOR','עוגן זהות'],
  ['EVIDENCE WALL · SOURCE · CONTEXT · STATUS','מקורות וראיות · מקור · הקשר · מצב'],
  ['Evidence Claims · Cryptographic View','טענות וראיות · תצוגה קריפטוגרפית'],
  ['CORRECTION IS PART OF THE RECORD','תיקון הוא חלק מהתיעוד'],['EPISTEMIC CONTRACT','כללי האמון'],
  ['PUBLIC LEDGER','מאגר ציבורי'],['SOURCE SURFACES','פתיחת המקורות'],['PRIVACY BOUNDARY','גבול הפרטיות'],
  ['PRESS SOURCE','מקור עיתונאי'],['VIDEO SOURCE','מקור וידאו'],['PROVENANCE','שרשרת המקור'],
  ['SOURCE PENDING','ממתין למקור'],['DOCUMENTED','מתועד'],['VERIFIED','מקור מאומת'],
  ['SNAPSHOT','צילום מצב'],['OWNED','שלי'],['EXTERNAL','חיצוני'],['IDENTITY','זהות'],
  ['ARCHIVE','ארכיון'],['PRIVATE','פרטי'],['BUILT','נבנה'],['MY STORY','הסיפור שלי'],
  ['FATHERHOOD','אבהות'],['PUBLIC STORY','סיפור ציבורי'],['DATE UNRESOLVED','תאריך לא הושלם'],
  ['MASTER RECORD','רשומה מהמאגר'],
  ['PUBLIC RECORD / SCALE','אלבום החיים · היקף'],
  ['IGOR VEPRETSKI · SEVEN CHAPTERS · ONE PUBLIC RECORD','IGOR VEPRETSKI · שבעה פרקים · אלבום חיים אחד'],
  ['THE SEVEN CHAPTERS','שבעת הפרקים'],['THE THROUGH-LINE','הקו שמחבר'],
  ['PERSON BEFORE SYSTEM','האדם לפני המערכת'],['HUMAN FIRST','האדם קודם'],
  ['PERSONAL NARRATIVE','סיפור אישי'],['SYSTEM BLIND SPOT','הנקודה שהמערכת מפספסת'],
  ['LIVED EXPERIENCE','ניסיון חיים'],['PUBLICLY DOCUMENTED · CONSERVATIVE WORDING','מתועד בפומבי · ניסוח זהיר'],
  ['METRICS REQUIRE DATED SOURCE','מדדים דורשים מקור מתוארך'],['BUILDER POSTURE','גישה של בנייה'],
  ['PUBLIC PATH','הדרך הציבורית'],['NOT A CAMPAIGN BIO','לא ביוגרפיית קמפיין'],
  ['THE NEXT CHAPTER IS ACTIVE','הפרק הבא כבר בתנועה'],['WORK THAT EXISTS','עשייה שאפשר לפתוח'],
  ['ORIGIN RECORD','רשומת התחלה'],['TV INTERVIEW','ראיון טלוויזיה'],['LONGFORM VOICE','שיחה ארוכה'],
  ['PUBLIC WRITING AUTHOR PAGE','עמוד הכתיבה הציבורית'],['PUBLIC ADVOCACY VIDEO','וידאו ציבורי'],
  ['MUSIC PUBLIC TRACK','קטע מוזיקלי ציבורי'],['7YA PROOF SYSTEM','7YA · מערכת הראיות'],
  ['PUBLIC FOOTPRINT V2','מפת הנוכחות הציבורית V2'],['Public Footprint Index V2','אינדקס הנוכחות הציבורית V2'],
  ['PUBLIC VOICES','קולות מהציבור'],['IDENTITY ARCHITECTURE','מבנה הזהות'],
  ['PUBLIC SYSTEM','מערכת ציבורית'],['THE NEXT CHAPTER','הפרק הבא'],
  ['Evidence mode','מצב ראיות'],['PUBLIC INFLUENCE WALL','קיר ההשפעה הציבורית'],
  ['Public archive','ארכיון ציבורי'],['DIGITAL INFLUENCE','השפעה דיגיטלית'],
  ['Verified · Documented · Self-reported · In review.','מאומת · מתועד · דיווח עצמי · בבדיקה.'],
  ['Source · Context · Status · Correction · Privacy','מקור · הקשר · מצב · תיקון · פרטיות'],
  ['canonical records','רשומות קנוניות'],['Owner-exported Reel Insights.','נתוני Reel שיוצאו מהחשבון.'],
  ['Curated social','פיד נבחר'],['public projection','תצוגה ציבורית'],['OWN WORK','יצירה שלי'],
  ['PROPAGATION','הפצה'],['HIGH CONFIDENCE','בביטחון גבוה'],['SOURCE-LINKED','מחובר למקור'],
  ['Sitemap','מפת האתר'],['Contact','יצירת קשר'],['VIDEO','וידאו'],['WRITING','כתיבה'],
  ['CREATIVE','יצירה'],['MEDIA','מדיה'],['REACTIONS','תגובות'],['STATUS','מצב'],
  ['CONTEXT','הקשר'],['SOURCE','מקור'],['INFLUENCE','השפעה'],['INFRASTRUCTURE','תשתית'],
  ['SERVICE','שירות'],['BUILD','בנייה'],['ORIGIN','התחלה'],['PERSON','האדם'],['MUSIC','מוזיקה'],
  [' likes/reactions',' לייקים/תגובות־רגש'],[' impressions',' חשיפות'],[' reactions',' תגובות־רגש'],
  [' comments',' תגובות'],[' shares',' שיתופים'],[' views',' צפיות'],[' likes',' לייקים'],
  [' saves',' שמירות'],[' reach',' חשיפה'],[' interactions',' אינטראקציות'],
  ['Evidence Wall','קיר המקורות והראיות'],['EVIDENCE WALL','קיר המקורות והראיות'],
  ['Evidence','ראיות'],['EVIDENCE','ראיות']
].sort((a,b)=>b[0].length-a[0].length);
function humanizeVisitorText(text){let next=text;for(const [from,to] of visitorLabelTranslations)next=next.split(from).join(to);return next;}
function humanizePublicHtml(html){
  const protectedBlocks=[];
  let masked=html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi,block=>{const token=`__7YA_PROTECTED_${protectedBlocks.length}__`;protectedBlocks.push(block);return token;});
  masked=masked.replace(/>([^<]+)</g,(match,text)=>`>${humanizeVisitorText(text)}<`);
  masked=masked.replace(/<([a-z][\w:-]*)([^>]*?)\sdir=(["'])ltr\3([^>]*)>([\s\S]*?)<\/\1>/gi,(match,tag,before,_quote,after,inner)=>/[\u0590-\u05ff]/u.test(inner.replace(/<[^>]+>/g,' '))?`<${tag}${before}${after}>${inner}</${tag}>`:match);
  return masked.replace(/__7YA_PROTECTED_(\d+)__/g,(_match,index)=>protectedBlocks[Number(index)]||'');
}

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
  if (!html.includes('7ya-control-layer-20260726.js')) bodyTags.push(controlScriptTag);
  if (siteImpactEligible.has(relative) && !html.includes('data-seven-proof-layer')) bodyTags.unshift(siteImpactMarkup);
  if (siteImpactEligible.has(relative) && !html.includes('site-impact-layer-20260918.js')) bodyTags.push(siteImpactScriptTag);

  let enhanced = html;
  if (headTags.length) enhanced = enhanced.replace('</head>', `  ${headTags.join('\n  ')}\n</head>`);
  if (bodyTags.length) enhanced = enhanced.replace('</body>', `  ${bodyTags.join('\n  ')}\n</body>`);
  if (siteImpactEligible.has(relative) && !enhanced.includes('data-seven-human-nav')) {
    const skipLink=/<a\b[^>]*class=["'][^"']*\bskip\b[^"']*["'][^>]*>[\s\S]*?<\/a>/i;
    enhanced=skipLink.test(enhanced)?enhanced.replace(skipLink,match=>`${match}\n${siteHumanNavMarkup}`):enhanced.replace(/<body\b[^>]*>/i,match=>`${match}\n${siteHumanNavMarkup}`);
  }
  return humanizePublicHtml(enhanced);
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