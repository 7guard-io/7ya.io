import fs from 'node:fs/promises';
import path from 'node:path';
import { canonicalRoutes } from './site-contract.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const locales = ['en','ru','ar'];
const routes = ['contact','influence','talk','chat'];
const allowedHebrew = new Set(['איגור ופרצקי','עברית']);

const strip = html => {
  const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || [,''])[1];
  return body
    .replace(/<(script|style|template|svg)\b[\s\S]*?<\/\1>/gi,'')
    .replace(/<[^>]+>/g,'\n')
    .split(/\n+/)
    .map(x=>x.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim())
    .filter(Boolean);
};

async function htmlFiles(directory) {
  const entries=await fs.readdir(directory,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory())files.push(...await htmlFiles(absolute));
    else if(entry.isFile()&&entry.name.endsWith('.html'))files.push(absolute);
  }
  return files;
}

const failures=[];
for(const locale of locales){
  const html=await fs.readFile(path.join(dist,locale,'index.html'),'utf8');
  for(const untranslated of ['רגעים אישיים · REAL מדיה','7YA · ORIGINAL / מחובר למקור מדיה','גיבורי העל של התקופה']) {
    if(strip(html).includes(untranslated)) failures.push(`${locale}/home: untranslated media label -> ${untranslated}`);
  }
}
for (const locale of locales) {
  for (const route of routes) {
    const file=path.join(dist,locale,route,'index.html');
    const html=await fs.readFile(file,'utf8');
    const leaked=[...new Set(strip(html).filter(text=>/[\u0590-\u05ff]/u.test(text)&&!allowedHebrew.has(text)))];
    const attrValues=[...html.matchAll(/\b(?:aria-label|title|placeholder|alt)=(["'])(.*?)\1/gi)].map(match=>match[2].trim());
    const leakedAttrs=[...new Set(attrValues.filter(text=>/[\u0590-\u05ff]/u.test(text)&&!allowedHebrew.has(text)))];
    if(leaked.length) failures.push(`${locale}/${route}: Hebrew leakage -> ${leaked.slice(0,12).join(' | ')}`);
    if(leakedAttrs.length) failures.push(`${locale}/${route}: Hebrew accessibility attribute leakage -> ${leakedAttrs.slice(0,12).join(' | ')}`);
  }
}

for (const locale of locales) {
  const root=path.join(dist,locale);
  for (const file of await htmlFiles(root)) {
    const html=await fs.readFile(file,'utf8');
    const markupOnly=html.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi,'');
    const attrValues=[...markupOnly.matchAll(/\b(?:aria-label|title|placeholder|alt)=(["'])(.*?)\1/gi)].map(match=>match[2].trim());
    const leaked=[...new Set(attrValues.filter(text=>/[\u0590-\u05ff]/u.test(text)&&text!=='עברית'))];
    if(leaked.length){
      const relative=path.relative(dist,file).split(path.sep).join('/');
      failures.push(`${relative}: Hebrew accessibility attribute leakage -> ${leaked.slice(0,12).join(' | ')}`);
    }
  }
}

const mixedScriptToken = token => /(?:[A-Za-z][\u0590-\u05ff]|[\u0590-\u05ff][A-Za-z]|[\u0400-\u04ff][\u0590-\u05ff]|[\u0590-\u05ff][\u0400-\u04ff])/u.test(token);
for (const locale of locales) {
  const root=path.join(dist,locale);
  for (const file of await htmlFiles(root)) {
    const html=await fs.readFile(file,'utf8');
    const text=strip(html).join(' ');
    const tokens=text.split(/\s+/).map(token=>token.replace(/^[^\p{L}]+|[^\p{L}]+$/gu,'')).filter(Boolean);
    const mixed=[...new Set(tokens.filter(mixedScriptToken))];
    if(mixed.length){
      const relative=path.relative(dist,file).split(path.sep).join('/');
      failures.push(`${relative}: mixed-script localization corruption -> ${mixed.slice(0,12).join(' | ')}`);
    }
  }
}

const now = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'
}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
const buildDate=`${now.day}.${now.month}.${now.year}`;
const labels={he:'עכשיו',en:'NOW',ru:'СЕЙЧАС',ar:'الآن'};
for (const locale of ['he',...locales]) {
  const file=locale==='he'?path.join(dist,'index.html'):path.join(dist,locale,'index.html');
  const html=await fs.readFile(file,'utf8');
  if(html.includes('BUILD_DATE')) failures.push(`${locale}: BUILD_DATE leaked into homepage`);
  if(!html.includes(`${labels[locale]} / ${buildDate}`)) failures.push(`${locale}: homepage freshness marker is not ${buildDate}`);
}


const humanFirstHomepageContract={
  en:{
    required:['My personal site · live and evolving','START HERE · choose your path','A metric is not an outcome.'],
    forbidden:['האתר האישי שלי · חי ומתעדכן','START HERE · בלי לנחש מה לחפש','מדד הוא לא תוצאה.']
  },
  ru:{
    required:['Мой личный сайт · живой и обновляемый','НАЧНИТЕ ЗДЕСЬ · выберите свой маршрут','Метрика — не результат.'],
    forbidden:['האתר האישי שלי · חי ומתעדכן','START HERE · בלי לנחש מה לחפש','מדד הוא לא תוצאה.']
  },
  ar:{
    required:['موقعي الشخصي · حيّ ومتجدد','ابدأ من هنا · اختر مسارك','المقياس ليس نتيجة.'],
    forbidden:['האתר האישי שלי · חי ומתעדכן','START HERE · בלי לנחש מה לחפש','מדד הוא לא תוצאה.']
  }
};
for(const locale of locales){
  const html=await fs.readFile(path.join(dist,locale,'index.html'),'utf8');
  for(const marker of humanFirstHomepageContract[locale].required){
    if(!html.includes(marker)) failures.push(locale+': human-first homepage marker missing -> '+marker);
  }
  for(const marker of humanFirstHomepageContract[locale].forbidden){
    if(html.includes(marker)) failures.push(locale+': untranslated human-first homepage copy -> '+marker);
  }
}

const homepageUiHebrewForbidden = [
  'המאגר שומר את הדרך מ־2011 ועד היום.',
  'רשומות ציבוריות במאגר החיים · 170 מהן כבר מחוברות למדד מספרי',
  'קולות מהתגובות',
  '✓ פתוחים',
  '✓ זמינות',
  '✓ ניווט'
];
const homepageLocaleRequired = {
  en: ['The archive preserves the path from 2011 to today.','Voices from the comments','✓ Open','✓ Available','✓ Navigation ready'],
  ru: ['Архив сохраняет путь с 2011 года до сегодня.','Голоса из комментариев','✓ Открыто','✓ Доступно','✓ Навигация готова'],
  ar: ['يحفظ الأرشيف المسار من عام 2011 حتى اليوم.','أصوات من التعليقات','✓ مفتوح','✓ متاح','✓ التنقل جاهز']
};
for (const locale of locales) {
  const html=await fs.readFile(path.join(dist,locale,'index.html'),'utf8');
  for (const marker of homepageUiHebrewForbidden) {
    if (html.includes(marker)) failures.push(`${locale}: untranslated homepage UI -> ${marker}`);
  }
  for (const marker of homepageLocaleRequired[locale]) {
    if (!html.includes(marker)) failures.push(`${locale}: localized homepage UI marker missing -> ${marker}`);
  }
}

// Guard the most visible personal copy against future fallback to Hebrew.
const personalPageLocaleContract = {
  en: {
    home: ['I was born in Kharkiv and grew up in Jessie Cohen.', 'Opportunity and belonging', 'If something in this story', '7YA organizes the memory. Igor remains the person at its center.'],
    story: ['Not a title. A journey.', 'I was born in Kharkiv and grew up in Israel.', 'Three distinct tracks: a social mission', 'These accounts are not marketing channels on this site.']
  },
  ru: {
    home: ['Я родился в Харькове и вырос в Джесси Коэн.', 'Возможности и причастность', 'Если что-то в этой истории', '7YA упорядочивает память.'],
    story: ['Не должность. Путь.', 'Я родился в Харькове, вырос в Израиле.', 'Три разных направления: социальная миссия', 'Эти аккаунты на сайте — не «маркетинговые каналы».']
  },
  ar: {
    home: ['وُلدت في خاركيف ونشأت في جيسي كوهين.', 'الفرص والانتماء', 'إذا كان في هذه القصة ما', 'تنظّم 7YA الذاكرة'],
    story: ['ليست صفة وظيفية. بل رحلة.', 'وُلدت في خاركيف ونشأت في إسرائيل.', 'ثلاثة مسارات مختلفة: رسالة اجتماعية', 'هذه الحسابات ليست «قنوات تسويق» على الموقع']
  }
};
for (const [locale, pages] of Object.entries(personalPageLocaleContract)) {
  for (const [route, markers] of Object.entries(pages)) {
    const file = path.join(dist, locale, route === 'home' ? 'index.html' : 'igor-vepretski/index.html');
    const html = await fs.readFile(file, 'utf8');
    for (const marker of markers) {
      if (!html.includes(marker)) failures.push(`${locale}/${route}: personal copy translation missing -> ${marker}`);
    }
  }
}

const redirects=await fs.readFile(path.join(dist,'_redirects'),'utf8');
if(!/^\/feed\s+\/influence\/\s+301$/m.test(redirects) || !/^\/feed\/\s+\/influence\/\s+301$/m.test(redirects)) {
  failures.push('legacy /feed redirect is missing');
}


const chatRouteContract = {
  he: { path: path.join(dist,'chat','index.html'), canonical: 'https://7ya.io/chat/' },
  en: { path: path.join(dist,'en','chat','index.html'), canonical: 'https://7ya.io/en/chat/' },
  ru: { path: path.join(dist,'ru','chat','index.html'), canonical: 'https://7ya.io/ru/chat/' },
  ar: { path: path.join(dist,'ar','chat','index.html'), canonical: 'https://7ya.io/ar/chat/' },
};
for (const [locale, contract] of Object.entries(chatRouteContract)) {
  const html = await fs.readFile(contract.path,'utf8');
  if (!html.includes(`rel="canonical" href="${contract.canonical}"`)) failures.push(`${locale}/chat: canonical route missing or stale`);
  if (html.includes('?chat=open')) failures.push(`${locale}/chat: legacy homepage chat redirect leaked into dedicated route`);
  if (!html.includes('Speak with Igor')) failures.push(`${locale}/chat: dedicated Speak with Igor page marker missing`);
}

const widget=await fs.readFile(path.join(dist,'scripts','7ya-signal-key-20260715.js'),'utf8');
// A legacy header must never hide the shared language/navigation controls again.
for (const css of ['locale-shell-20260919.css','premium-polish-20260921.css']) {
  const text=await fs.readFile(path.join(dist,'styles',css),'utf8');
  if (/body:has\(>\s*\.topbar\)>\.seven-human-nav\s*\{\s*display:none/.test(text)) failures.push(`${css}: legacy header hides primary navigation`);
}
for (const locale of ['he',...locales]) {
  const html=await fs.readFile(path.join(dist,locale==='he'?'':locale,'contact/index.html'),'utf8');
  if (!html.includes('href="https://t.me/vepretski"')) failures.push(`${locale}/contact: direct contact route missing`);
  if (html.includes('href="mailto:hello@7ya.io')) failures.push(`${locale}/contact: unavailable domain is still a contact action`);
  if(html.includes('"email":"hello@7ya.io"')) failures.push(`${locale}/contact: unavailable email remains in structured data`);
  const skip=html.search(/<a\b[^>]*class=["'][^"']*\bskip\b/);
  if(skip<0 || skip>html.indexOf('<nav class="seven-human-nav"')) failures.push(`${locale}/contact: skip link must precede primary navigation`);
}
for(const required of ['Speak with Igor','ПОГОВОРИТЬ С ИГОРЕМ','تحدّث مع إيغور',"fetch('/api/guide'","experience: 'speak-with-igor'"]){
  if(!widget.includes(required)) failures.push(`Speak with Igor contract missing: ${required}`);
}


// Global SEO acceptance: run across every canonical route and every supported locale.
const metadataLocales = ['he','en','ru','ar'];
const expectedOgLocales = {he:'he_IL',en:'en_US',ru:'ru_RU',ar:'ar_IL'};
const expectedSeoNames = ['description','og:title','og:description','og:url','og:locale','og:image','twitter:card','twitter:title','twitter:description','twitter:image'];
const expectedHreflangs = ['he','en','ru','ar','x-default'];

function metaAttr(tag, name) {
  const attributes = [...tag.matchAll(/([^\s=<>/]+)\s*=\s*(["'])(.*?)\2/gi)];
  return attributes.find(match => match[1].toLowerCase() === name.toLowerCase())?.[3] ?? null;
}
function decodeMeta(value) {
  return String(value || '').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>');
}
function metaTagsFor(html, key, attribute='name') {
  return (html.match(/<meta\b[^>]*>/gi) || []).filter(tag => (metaAttr(tag, attribute) || '').toLowerCase() === key.toLowerCase());
}
function metaValueFor(html, key, attribute='name') {
  const tag = metaTagsFor(html, key, attribute)[0];
  return decodeMeta(metaAttr(tag || '', 'content'));
}
function canonicalValueFor(html) {
  const tags = (html.match(/<link\b[^>]*>/gi) || []).filter(tag => (metaAttr(tag,'rel') || '').toLowerCase() === 'canonical');
  return {tags, href:metaAttr(tags[0] || '', 'href')};
}
function hreflangValueFor(html, language) {
  const tags = (html.match(/<link\b[^>]*>/gi) || []).filter(tag =>
    (metaAttr(tag,'rel') || '').toLowerCase() === 'alternate' &&
    (metaAttr(tag,'hreflang') || '').toLowerCase() === language.toLowerCase()
  );
  return {tags, href:metaAttr(tags[0] || '', 'href')};
}
const canonicalPublicUrl = (locale, route) => 'https://7ya.io/' + (locale === 'he' ? '' : locale + '/') + (route ? route + '/' : '');
const noHebrew = /[\u0590-\u05ff]/u;
const noCyrillic = /[\u0400-\u04ff]/u;
const noArabic = /[\u0600-\u06ff]/u;

for (const route of canonicalRoutes) {
  for (const locale of metadataLocales) {
    const segments = [locale === 'he' ? null : locale, route || null, 'index.html'].filter(Boolean);
    const file = path.join(dist, ...segments);
    let html;
    try {
      html = await fs.readFile(file, 'utf8');
    } catch {
      failures.push(locale + '/' + (route || 'home') + ': SEO check could not read ' + path.relative(dist,file));
      continue;
    }

    const location = locale + '/' + (route || 'home');
    const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    if (titles.length !== 1) failures.push(location + ': expected exactly one title, found ' + titles.length);
    const title = decodeMeta(titles[0]?.[1] || '').trim();
    if (title.length < 8 || title.length > 180) failures.push(location + ': title missing or outside 8–180 characters');

    for (const key of expectedSeoNames) {
      const attribute = key.startsWith('og:') ? 'property' : 'name';
      const tags = metaTagsFor(html, key, attribute);
      if (tags.length !== 1) failures.push(location + ': expected exactly one ' + key + ' tag, found ' + tags.length);
      if (tags.length === 1 && !metaAttr(tags[0], 'content')?.trim()) failures.push(location + ': ' + key + ' has empty content');
    }

    const description = metaValueFor(html,'description');
    if (description.length < 35 || description.length > 260) failures.push(location + ': description length ' + description.length + ' is outside 35–260 characters');
    if (!metaValueFor(html,'og:title','property')) failures.push(location + ': og:title missing');
    if (!metaValueFor(html,'og:description','property')) failures.push(location + ': og:description missing');
    if (!metaValueFor(html,'twitter:title')) failures.push(location + ': twitter:title missing');
    if (!metaValueFor(html,'twitter:description')) failures.push(location + ': twitter:description missing');
    if (metaValueFor(html,'og:locale','property') !== expectedOgLocales[locale]) failures.push(location + ': og:locale does not match ' + locale);
    if (metaValueFor(html,'twitter:card') !== 'summary_large_image') failures.push(location + ': twitter:card must be summary_large_image');

    if (locale !== 'he') {
      const localizedSeo = title + ' ' + description + ' ' + metaValueFor(html,'og:title','property') + ' ' + metaValueFor(html,'og:description','property') + ' ' + metaValueFor(html,'twitter:title') + ' ' + metaValueFor(html,'twitter:description');
      if (noHebrew.test(localizedSeo)) failures.push(location + ': Hebrew text leaked into localized SEO fields');
      if (locale === 'en' && noCyrillic.test(title + ' ' + description)) failures.push(location + ': Cyrillic text leaked into English title/description');
      if (locale === 'en' && noArabic.test(title + ' ' + description)) failures.push(location + ': Arabic text leaked into English title/description');
      if (metaValueFor(html,'og:title','property') !== title) failures.push(location + ': og:title must match localized title');
      if (metaValueFor(html,'twitter:title') !== title) failures.push(location + ': twitter:title must match localized title');
      if (metaValueFor(html,'og:description','property') !== description) failures.push(location + ': og:description must match localized description');
      if (metaValueFor(html,'twitter:description') !== description) failures.push(location + ': twitter:description must match localized description');
    }

    const canonical = canonicalValueFor(html);
    const expectedUrl = canonicalPublicUrl(locale,route);
    if (canonical.tags.length !== 1) failures.push(location + ': expected exactly one canonical, found ' + canonical.tags.length);
    if (canonical.href !== expectedUrl) failures.push(location + ': canonical mismatch; expected ' + expectedUrl + ', found ' + (canonical.href || '(empty)'));
    if (metaValueFor(html,'og:url','property') !== expectedUrl) failures.push(location + ': og:url must match canonical ' + expectedUrl);

    for (const language of expectedHreflangs) {
      const link = hreflangValueFor(html,language);
      const expectedHref = language === 'x-default' ? canonicalPublicUrl('he',route) : canonicalPublicUrl(language,route);
      if (link.tags.length !== 1) failures.push(location + ': expected exactly one hreflang=' + language + ', found ' + link.tags.length);
      if (link.href !== expectedHref) failures.push(location + ': hreflang=' + language + ' mismatch; expected ' + expectedHref + ', found ' + (link.href || '(empty)'));
    }

    const imageMeta = metaValueFor(html,'og:image','property');
    const twitterImage = metaValueFor(html,'twitter:image');
    if (!/^https?:\/\//i.test(imageMeta)) failures.push(location + ': og:image is not an absolute URL');
    if (!/^https?:\/\//i.test(twitterImage)) failures.push(location + ': twitter:image is not an absolute URL');

    const jsonLdScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (let index = 0; index < jsonLdScripts.length; index++) {
      try { JSON.parse(jsonLdScripts[index][1]); }
      catch { failures.push(location + ': JSON-LD block ' + (index + 1) + ' is invalid JSON'); }
    }
  }
}

if(failures.length){
  for(const failure of failures) console.error('LOCALE_ACCEPTANCE_FAIL:',failure);
  throw new Error(`Locale/route acceptance failed with ${failures.length} issue(s)`);
}
console.log('LOCALE_ROUTE_ACCEPTANCE: PASS (freshness · EN/RU/AR · /feed redirect · Speak with Igor contract)');
