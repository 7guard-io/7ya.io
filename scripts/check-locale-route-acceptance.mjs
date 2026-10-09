import fs from 'node:fs/promises';
import path from 'node:path';

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
    home: ['This is where my life, work, media and sources come together.', 'Opportunity and belonging', 'If something in this story', '7YA organizes the memory. Igor remains the person at its center.'],
    story: ['Not a title. A journey.', 'I was born in Kharkiv and grew up in Israel.', 'Three distinct tracks: a social mission', 'These accounts are not marketing channels on this site.']
  },
  ru: {
    home: ['Здесь соединяются моя жизнь, работа, медиа и первоисточники.', 'Возможности и причастность', 'Если что-то в этой истории', '7YA упорядочивает память.'],
    story: ['Не должность. Путь.', 'Я родился в Харькове, вырос в Израиле.', 'Три разных направления: социальная миссия', 'Эти аккаунты на сайте — не «маркетинговые каналы».']
  },
  ar: {
    home: ['هنا تتلاقى حياتي وعملي ووسائطي ومصادري.', 'الفرص والانتماء', 'إذا كان في هذه القصة ما', 'تنظّم 7YA الذاكرة'],
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
for(const required of ['Speak with Igor','ПОГОВОРИТЬ С ИГОРЕМ','تحدّث مع إيغور',"fetch('/api/guide'","experience: 'speak-with-igor'"]){
  if(!widget.includes(required)) failures.push(`Speak with Igor contract missing: ${required}`);
}

if(failures.length){
  for(const failure of failures) console.error('LOCALE_ACCEPTANCE_FAIL:',failure);
  throw new Error(`Locale/route acceptance failed with ${failures.length} issue(s)`);
}
console.log('LOCALE_ROUTE_ACCEPTANCE: PASS (freshness · EN/RU/AR · /feed redirect · Speak with Igor contract)');
