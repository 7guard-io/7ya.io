import fs from 'node:fs/promises';
import path from 'node:path';
import { canonicalRoutes, publicRouteDirectories } from './site-contract.mjs';

export const generatedLocaleRoots = ['en','ru','ar'];
const allLocales = ['he', ...generatedLocaleRoots];
const dirFor = locale => (locale === 'he' || locale === 'ar') ? 'rtl' : 'ltr';

const routeNames = {
  '': {he:'ראשי',en:'Home',ru:'Главная',ar:'الرئيسية'},
  'igor-vepretski': {he:'הסיפור',en:'Story',ru:'История',ar:'القصة'},
  journey: {he:'המסע',en:'Journey',ru:'Путь',ar:'المسار'},
  influence: {he:'הפיד',en:'Public feed',ru:'Публичная лента',ar:'الخلاصة العامة'},
  library: {he:'מקור',en:'Source library',ru:'Библиотека источников',ar:'مكتبة المصادر'},
  evidence: {he:'ראיות',en:'Evidence',ru:'Источники и доказательства',ar:'الأدلة والمصادر'},
  starton: {he:'StartOn',en:'StartOn',ru:'StartOn',ar:'StartOn'},
  media: {he:'מדיה',en:'Media',ru:'Медиа',ar:'الإعلام'},
  research: {he:'מחקר',en:'Research',ru:'Исследования',ar:'البحث'},
  speaker: {he:'מרצה',en:'Speaker',ru:'Спикер',ar:'المتحدث'},
  articles: {he:'כתיבה',en:'Writing',ru:'Тексты',ar:'الكتابة'},
  contact: {he:'דברו איתי',en:'Contact',ru:'Связаться',ar:'تواصل معي'},
  museum: {he:'מוזיאון',en:'Museum',ru:'Музей',ar:'المتحف'},
  history: {he:'היסטוריה',en:'History',ru:'История',ar:'التاريخ'},
  create: {he:'ליצור',en:'Create',ru:'Создать',ar:'أنشئ'},
  radar: {he:'רדאר',en:'Radar',ru:'Радар',ar:'الرادار'},
  verify: {he:'אימות',en:'Verify',ru:'Проверка',ar:'التحقق'},
  ledger: {he:'מאגר',en:'Ledger',ru:'Реестр',ar:'السجل'},
  '7ya': {he:'7YA',en:'7YA',ru:'7YA',ar:'7YA'},
  talk: {he:'שיחה',en:'Talk',ru:'Разговор',ar:'حوار'},
  'response-ai': {he:'Response AI',en:'Response AI',ru:'Response AI',ar:'Response AI'},
  entity: {he:'זהות',en:'Identity',ru:'Идентичность',ar:'الهوية'},
  go: {he:'קישורים',en:'Links',ru:'Ссылки',ar:'الروابط'},
  control: {he:'בקרה',en:'Control',ru:'Контроль',ar:'التحكم'},
  'delta-audit': {he:'בדיקת שינויים',en:'Delta audit',ru:'Аудит изменений',ar:'تدقيق التغييرات'}
};

const localeCopy = {
  en:{
    site:'Igor Vepretski · 7YA',
    nav:'Primary navigation',
    home:'Home',story:'Story',feed:'Feed',source:'Source',evidence:'Evidence',journey:'Journey',contact:'Contact',
    context:'This is the English view of 7YA.',
    sourceNote:'Navigation, page context and key visitor labels are localized. Linked source material stays in its original language when that is part of the public record.',
    proofKicker:'#7YA · LIFE ALBUM · 2026',proofTitle:'This page is one layer.\nThe record is bigger.',
    proofBody:'Posts, video, press, music, podcasts, Facebook, Instagram and public reactions live in one source-linked system.',
    master:'records in the full life archive',curated:'records in the curated social corpus',instagram:'Instagram reach · August 2023',account:'account report',
    reactions:'Facebook reactions · fatherhood story',snapshot:'public snapshot',likes:'Instagram likes · fatherhood story',post:'public post',
    person:'The person behind the record',impact:'Impact map',media:'Media',research:'Research',writing:'Writing',sources:'Evidence',
    integrity:'Metrics remain tied to their platform, date and source. External distribution stays explicitly marked as external.'
  },
  ru:{
    site:'Игорь Вепрецкий · 7YA',
    nav:'Основная навигация',
    home:'Главная',story:'История',feed:'Лента',source:'Источники',evidence:'Доказательства',journey:'Путь',contact:'Связаться',
    context:'Это русская версия 7YA.',
    sourceNote:'Навигация, контекст страницы и ключевые элементы интерфейса локализованы. Материалы первоисточников сохраняют исходный язык, когда он является частью публичной записи.',
    proofKicker:'#7YA · АЛЬБОМ ЖИЗНИ · 2026',proofTitle:'Эта страница — только один слой.\nЗапись гораздо больше.',
    proofBody:'Посты, видео, пресса, музыка, подкасты, Facebook, Instagram и публичные реакции собраны в одной системе с источниками.',
    master:'записей в полном архиве жизни',curated:'записей в отобранном социальном корпусе',instagram:'охват Instagram · август 2023',account:'официальный отчёт аккаунта',
    reactions:'реакций Facebook · история об отцовстве',snapshot:'публичный снимок',likes:'лайков Instagram · история об отцовстве',post:'публичный пост',
    person:'Человек за публичной записью',impact:'Карта влияния',media:'Медиа',research:'Исследования',writing:'Тексты',sources:'Источники',
    integrity:'Каждый показатель остаётся связан с платформой, датой и источником. Внешнее распространение всегда отмечается отдельно.'
  },
  ar:{
    site:'إيغور فيبريتسكي · 7YA',
    nav:'التنقل الرئيسي',
    home:'الرئيسية',story:'القصة',feed:'الخلاصة',source:'المصادر',evidence:'الأدلة',journey:'المسار',contact:'تواصل معي',
    context:'هذه هي النسخة العربية من 7YA.',
    sourceNote:'تمت مواءمة التنقل وسياق الصفحة والعناصر الأساسية للواجهة. تبقى مواد المصادر المرتبطة بلغتها الأصلية عندما تكون اللغة جزءاً من السجل العام.',
    proofKicker:'#7YA · ألبوم الحياة · 2026',proofTitle:'هذه الصفحة طبقة واحدة فقط.\nالسجل أكبر بكثير.',
    proofBody:'المنشورات والفيديو والصحافة والموسيقى والبودكاست وFacebook وInstagram والتفاعلات العامة محفوظة في نظام واحد مرتبط بالمصادر.',
    master:'سجلاً في أرشيف الحياة الكامل',curated:'سجلاً في المجموعة الاجتماعية المختارة',instagram:'وصول Instagram · أغسطس 2023',account:'تقرير رسمي للحساب',
    reactions:'تفاعلات Facebook · قصة الأبوة',snapshot:'لقطة عامة',likes:'إعجابات Instagram · قصة الأبوة',post:'منشور عام',
    person:'الإنسان خلف السجل',impact:'خريطة التأثير',media:'الإعلام',research:'البحث',writing:'الكتابة',sources:'الأدلة',
    integrity:'يبقى كل مقياس مرتبطاً بمنصته وتاريخه ومصدره. ويظل الانتشار الخارجي موسوماً بوضوح على أنه خارجي.'
  }
};

const metaDescriptions = {
  en:'A source-linked public record of Igor Vepretski: life, StartOn, media, research, creation, public reactions and evidence.',
  ru:'Публичная запись Игоря Вепрецкого с источниками: жизнь, StartOn, медиа, исследования, творчество, реакции аудитории и доказательства.',
  ar:'سجل عام مرتبط بالمصادر لإيغور فيبريتسكي: الحياة وStartOn والإعلام والبحث والإبداع وتفاعل الجمهور والأدلة.'
};

const commonTranslations = {
  en:[
    ['ראשי','Home'],['עכשיו','Now'],['הסיפור','Story'],['מקור','Sources'],['לשמוע','Listen'],['הפיד','Feed'],['דברו איתי','Contact'],
    ['פתיחת תפריט','Open menu'],['תפריט','Menu'],['נעים להכיר · איגור ופרצקי','Nice to meet you · Igor Vepretski'],
    ['אני איגור.','I’m Igor.'],['החיים לימדו אותי','Life taught me'],['לבנות דרך.','to build a way forward.'],
    ['הסיפור שלי','My story'],['העשייה שלי','What I build'],['להמשיך במסע','Continue the journey'],
    ['אישי לפני מערכתי','Human before system'],['עכשיו / 18.09.2026','NOW / 18.09.2026'],
    ['מה שאני מפרסם','What I publish'],['נכנס ישר לסיפור.','enters the story directly.'],
    ['הקהל בתוך הסיפור','The audience inside the story'],['לא רק פרסמתי.','I didn’t only publish.'],['משהו חזר אליי.','Something came back.'],
    ['המסע החי · מקור → קהל → המשך','Living journey · source → audience → continuation'],
    ['הארכיון החזותי','Visual archive'],['פחות להסביר.','Less explaining.'],['יותר לראות.','More seeing.'],
    ['העשייה שלי','What I build'],['הפיד החי','Live feed'],['הכול','All'],['הכי השפיעו','Highest response'],['ארכיון ציבורי','Public archive'],
    ['שלי','Owned'],['ארוך','Long-form'],['מוזיקה','Music'],['מחקר','Research'],['הפצה חיצונית','External distribution'],
    ['הנושאים שמעסיקים אותי','Questions I keep working on'],['אנשים לפני מערכות.','People before systems.'],['שאלות לפני תשובות.','Questions before answers.'],
    ['ממשיכים מכאן','Continue from here'],['ראיות','Evidence'],['ספרייה','Library'],['אדם · עשייה · מקורות','Person · work · sources']
  ],
  ru:[
    ['ראשי','Главная'],['עכשיו','Сейчас'],['הסיפור','История'],['מקור','Источники'],['לשמוע','Слушать'],['הפיד','Лента'],['דברו איתי','Связаться'],
    ['פתיחת תפריט','Открыть меню'],['תפריט','Меню'],['נעים להכיר · איגור ופרצקי','Давайте знакомиться · Игорь Вепрецкий'],
    ['אני איגור.','Я Игорь.'],['החיים לימדו אותי','Жизнь научила меня'],['לבנות דרך.','строить путь вперёд.'],
    ['הסיפור שלי','Моя история'],['העשייה שלי','Что я создаю'],['להמשיך במסע','Продолжить путь'],
    ['אישי לפני מערכתי','Человек раньше системы'],['עכשיו / 18.09.2026','СЕЙЧАС / 18.09.2026'],
    ['מה שאני מפרסם','То, что я публикую,'],['נכנס ישר לסיפור.','сразу входит в историю.'],
    ['הקהל בתוך הסיפור','Аудитория внутри истории'],['לא רק פרסמתי.','Я не просто публиковал.'],['משהו חזר אליי.','Что-то возвращалось ко мне.'],
    ['המסע החי · מקור → קהל → המשך','Живой путь · источник → аудитория → продолжение'],
    ['הארכיון החזותי','Визуальный архив'],['פחות להסביר.','Меньше объяснять.'],['יותר לראות.','Больше видеть.'],
    ['הפיד החי','Живая лента'],['הכול','Все'],['הכי השפיעו','Сильнейший отклик'],['ארכיון ציבורי','Публичный архив'],
    ['שלי','Моё'],['ארוך','Длинный формат'],['מוזיקה','Музыка'],['מחקר','Исследования'],['הפצה חיצונית','Внешнее распространение'],
    ['הנושאים שמעסיקים אותי','Вопросы, над которыми я работаю'],['אנשים לפני מערכות.','Люди раньше систем.'],['שאלות לפני תשובות.','Вопросы раньше ответов.'],
    ['ממשיכים מכאן','Продолжить отсюда'],['ראיות','Источники'],['ספרייה','Библиотека'],['אדם · עשייה · מקורות','Человек · работа · источники']
  ],
  ar:[
    ['ראשי','الرئيسية'],['עכשיו','الآن'],['הסיפור','القصة'],['מקור','المصادر'],['לשמוע','استمع'],['הפיד','الخلاصة'],['דברו איתי','تواصل معي'],
    ['פתיחת תפריט','فتح القائمة'],['תפריט','القائمة'],['נעים להכיר · איגור ופרצקי','تشرفت بمعرفتك · إيغور فيبريتسكي'],
    ['אני איגור.','أنا إيغور.'],['החיים לימדו אותי','علّمتني الحياة'],['לבנות דרך.','أن أبني طريقاً.'],
    ['הסיפור שלי','قصتي'],['העשייה שלי','ما أبنيه'],['להמשיך במסע','تابع المسار'],
    ['אישי לפני מערכתי','الإنسان قبل النظام'],['עכשיו / 18.09.2026','الآن / 18.09.2026'],
    ['מה שאני מפרסם','ما أنشره'],['נכנס ישר לסיפור.','يدخل مباشرة إلى القصة.'],
    ['הקהל בתוך הסיפור','الجمهور داخل القصة'],['לא רק פרסמתי.','لم أنشر فقط.'],['משהו חזר אליי.','بل عاد إليّ شيء من الجمهور.'],
    ['המסע החי · מקור → קהל → המשך','المسار الحي · مصدر → جمهور → استمرار'],
    ['הארכיון החזותי','الأرشيف البصري'],['פחות להסביר.','شرح أقل.'],['יותר לראות.','رؤية أكثر.'],
    ['הפיד החי','الخلاصة الحية'],['הכול','الكل'],['הכי השפיעו','الأعلى تفاعلاً'],['ארכיון ציבורי','أرشيف عام'],
    ['שלי','ملكي'],['ארוך','محتوى طويل'],['מוזיקה','موسيقى'],['מחקר','بحث'],['הפצה חיצונית','انتشار خارجي'],
    ['הנושאים שמעסיקים אותי','الأسئلة التي أعمل عليها'],['אנשים לפני מערכות.','الناس قبل الأنظمة.'],['שאלות לפני תשובות.','الأسئلة قبل الإجابات.'],
    ['ממשיכים מכאן','نكمل من هنا'],['ראיות','الأدلة'],['ספרייה','المكتبة'],['אדם · עשייה · מקורות','إنسان · عمل · مصادر']
  ]
};

const technicalTranslations = {
  en:{
    'PUBLIC RECORD':'Life record','PUBLIC RECORD / SCALE':'Life record · scale','MEDIA MASTER LIBRARY':'Complete media library','FULL LEDGER':'Full record',
    'CURATED SOCIAL':'Curated social','OFFICIAL BUSINESS REPORT':'Official account report','OWNER INSIGHTS':'Account insights','PUBLIC SNAPSHOT':'Public snapshot',
    'PUBLIC POST':'Public post','PUBLIC COMMENTS':'Public comments','EXTERNAL REPOST':'External repost','PUBLIC INFLUENCE WALL':'Public impact wall',
    'DIGITAL INFLUENCE':'Digital impact','EVIDENCE WALL':'Evidence and sources','EPISTEMIC CONTRACT':'Trust rules','PUBLIC LEDGER':'Public record',
    'SOURCE SURFACES':'Source links','PRIVACY BOUNDARY':'Privacy boundary','THE THROUGH-LINE':'The connecting line','THE SEVEN CHAPTERS':'Seven chapters',
    'PERSON BEFORE SYSTEM':'Person before system','OPEN THE SOURCE':'Open source','PUBLIC SURFACES':'Public channels'
  },
  ru:{
    'PUBLIC RECORD':'Альбом жизни','PUBLIC RECORD / SCALE':'Альбом жизни · масштаб','MEDIA MASTER LIBRARY':'Полная медиатека','FULL LEDGER':'Полный реестр',
    'CURATED SOCIAL':'Отобранная социальная лента','OFFICIAL BUSINESS REPORT':'Официальный отчёт аккаунта','OWNER INSIGHTS':'Данные аккаунта','PUBLIC SNAPSHOT':'Публичный снимок',
    'PUBLIC POST':'Публичный пост','PUBLIC COMMENTS':'Публичные комментарии','EXTERNAL REPOST':'Внешний репост','PUBLIC INFLUENCE WALL':'Стена публичного влияния',
    'DIGITAL INFLUENCE':'Цифровое влияние','EVIDENCE WALL':'Источники и доказательства','EPISTEMIC CONTRACT':'Правила доверия','PUBLIC LEDGER':'Публичный реестр',
    'SOURCE SURFACES':'Открыть источники','PRIVACY BOUNDARY':'Граница приватности','THE THROUGH-LINE':'Связующая линия','THE SEVEN CHAPTERS':'Семь глав',
    'PERSON BEFORE SYSTEM':'Человек прежде системы','OPEN THE SOURCE':'Открыть источник','PUBLIC SURFACES':'Публичные площадки'
  },
  ar:{
    'PUBLIC RECORD':'سجل الحياة','PUBLIC RECORD / SCALE':'سجل الحياة · النطاق','MEDIA MASTER LIBRARY':'مكتبة الإعلام الكاملة','FULL LEDGER':'السجل الكامل',
    'CURATED SOCIAL':'الخلاصة الاجتماعية المختارة','OFFICIAL BUSINESS REPORT':'تقرير رسمي للحساب','OWNER INSIGHTS':'بيانات الحساب','PUBLIC SNAPSHOT':'لقطة عامة',
    'PUBLIC POST':'منشور عام','PUBLIC COMMENTS':'تعليقات عامة','EXTERNAL REPOST':'إعادة نشر خارجية','PUBLIC INFLUENCE WALL':'جدار التأثير العام',
    'DIGITAL INFLUENCE':'التأثير الرقمي','EVIDENCE WALL':'الأدلة والمصادر','EPISTEMIC CONTRACT':'قواعد الثقة','PUBLIC LEDGER':'السجل العام',
    'SOURCE SURFACES':'روابط المصادر','PRIVACY BOUNDARY':'حدود الخصوصية','THE THROUGH-LINE':'الخيط الذي يربط','THE SEVEN CHAPTERS':'الفصول السبعة',
    'PERSON BEFORE SYSTEM':'الإنسان قبل النظام','OPEN THE SOURCE':'افتح المصدر','PUBLIC SURFACES':'القنوات العامة'
  }
};

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

function routePath(locale, route='') {
  const suffix = route ? route.replace(/^\/+|\/+$/g,'') + '/' : '';
  return locale === 'he' ? '/' + suffix : '/' + locale + '/' + suffix;
}

function languageNav(locale, route) {
  const c = locale === 'he' ? {nav:'ניווט ראשי',home:'ראשי',story:'הסיפור',feed:'הפיד',source:'מקור',evidence:'ראיות',journey:'המסע',contact:'דברו איתי'} : localeCopy[locale];
  const links = [
    ['home',''],['story','igor-vepretski'],['feed','influence'],['source','library'],['evidence','evidence'],['journey','journey']
  ].map(([key,target])=>'<a href="'+routePath(locale,target)+'">'+c[key]+'</a>').join('');
  const languages = allLocales.map(lang=>{
    const labels={he:'עברית',en:'EN',ru:'RU',ar:'العربية'};
    return '<a href="'+routePath(lang,route)+'" lang="'+lang+'" dir="'+dirFor(lang)+'"'+(lang===locale?' aria-current="true"':'')+'>'+labels[lang]+'</a>';
  }).join('');
  return '<nav class="seven-human-nav" data-seven-human-nav aria-label="'+esc(c.nav)+'">'+links+'<a class="seven-human-nav-cta" href="'+routePath(locale,'contact')+'">'+c.contact+'</a><span class="seven-language-switch" data-seven-languages>'+languages+'</span></nav>';
}

function proofMarkup(locale) {
  if (locale === 'he') return null;
  const c=localeCopy[locale];
  return '<section class="seven-proof-layer" data-seven-proof-layer aria-label="'+esc(c.sources)+'">'+
    '<div class="seven-proof-head"><div><div class="seven-proof-kicker">'+c.proofKicker+'</div><h2>'+c.proofTitle.replace('\n','<br>')+'</h2></div><p>'+c.proofBody+'</p></div>'+
    '<div class="seven-proof-metrics">'+
      '<a href="'+routePath(locale,'influence')+'#master-public-record"><b>434</b><span>'+c.master+'</span><small>'+c.impact+' ↗</small></a>'+
      '<a href="'+routePath(locale,'influence')+'#live-social-corpus"><b>59</b><span>'+c.curated+'</span><small>'+c.feed+' ↗</small></a>'+
      '<a href="'+routePath(locale,'influence')+'#master-public-record"><b>248,155</b><span>'+c.instagram+'</span><small>'+c.account+'</small></a>'+
      '<a href="https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0icaS4EV3EFHPbtTaexx3X4Lo9UGQD22Nvm8xzkpJRqiJSLro9D3zNp1PX6SJ26iPl" target="_blank" rel="noreferrer"><b>4,124</b><span>'+c.reactions+'</span><small>'+c.snapshot+'</small></a>'+
      '<a href="https://www.instagram.com/p/Co4HKRLoack/" target="_blank" rel="noreferrer"><b>2,329</b><span>'+c.likes+'</span><small>'+c.post+'</small></a>'+
    '</div>'+
    '<div class="seven-proof-visuals">'+
      '<a class="seven-proof-visual" href="'+routePath(locale,'igor-vepretski')+'"><img src="/assets/personal-hero-20260716/igor-hero.webp" alt="Igor Vepretski" loading="lazy"><span>'+c.person+'</span></a>'+
      '<a class="seven-proof-visual" href="https://www.youtube.com/watch?v=SOx8DUXFIEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/SOx8DUXFIEw/hqdefault.jpg" alt="StartOn" loading="lazy"><span>StartOn · YouTube ↗</span></a>'+
      '<a class="seven-proof-visual" href="https://www.youtube.com/watch?v=jRjZjpqAgEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/jRjZjpqAgEw/maxresdefault.jpg" alt="BIZZI feat Vepretski" loading="lazy"><span>BIZZI · MUSIC ↗</span></a>'+
    '</div>'+
    '<nav class="seven-proof-links"><a href="'+routePath(locale,'media')+'">'+c.media+' <span>↗</span></a><a href="'+routePath(locale,'research')+'">'+c.research+' <span>↗</span></a><a href="'+routePath(locale,'articles')+'">'+c.writing+' <span>↗</span></a><a href="'+routePath(locale,'evidence')+'">'+c.sources+' <span>↗</span></a></nav>'+
    '<p class="seven-proof-integrity">'+c.integrity+'</p></section>';
}

function routeMeta(locale, route) {
  const name = routeNames[route]?.[locale] || routeNames[route]?.en || route || '7YA';
  if (locale === 'he') return null;
  const site=localeCopy[locale].site;
  return {title:(route?name+' · ':'')+site,description:metaDescriptions[locale]};
}

function rewriteSameHostReferences(html, locale, originalRoute) {
  if (locale==='he') return html;
  const pageBase='https://7ya.io/'+(originalRoute?originalRoute.replace(/^\/+|\/+$/g,'')+'/':'');
  return html.replace(/\b(href|src|action)=(["'])([^"']+)\2/gi,(match,attr,quote,ref)=>{
    if (!ref || ref.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(ref)) return match;
    let url; try{url=new URL(ref,pageBase)}catch{return match}
    if (url.hostname!=='7ya.io') return match;
    const pathname=url.pathname;
    const assetLike=/\.[a-z0-9]{1,8}$/i.test(pathname)||/^\/(assets|styles|scripts|api|data|knowledge)\//.test(pathname)||['/favicon.svg','/site.webmanifest','/sw.js','/service-worker.js','/robots.txt','/sitemap.xml'].includes(pathname);
    if(assetLike) return attr+'='+quote+pathname+url.search+url.hash+quote;
    const parts=pathname.split('/').filter(Boolean);
    if(generatedLocaleRoots.includes(parts[0]))parts.shift();
    const base='/' + (parts.length?parts.join('/')+'/':'');
    const localized='/' + locale + (base==='/'?'/':base);
    return attr+'='+quote+localized+url.search+url.hash+quote;
  });
}

function replaceVisibleCopy(html, locale) {
  if(locale==='he')return html;
  const protectedBlocks=[];
  let next=html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi,block=>{
    const token='__7YA_LOCALE_PROTECTED_'+protectedBlocks.length+'__';
    protectedBlocks.push(block);
    return token;
  });
  for(const [from,to] of commonTranslations[locale]) next=next.split(from).join(to);
  for(const [from,to] of Object.entries(technicalTranslations[locale])) next=next.split(from).join(to);
  return next.replace(/__7YA_LOCALE_PROTECTED_(\d+)__/g,(_match,index)=>protectedBlocks[Number(index)]||'');
}

function setMetadata(html, locale, route) {
  const canonical='https://7ya.io'+routePath(locale,route);
  let next=html.replace(/<html\b[^>]*>/i,'<html lang="'+locale+'" dir="'+dirFor(locale)+'" data-7ya-locale="'+locale+'">');
  next=next.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gi,'');
  if(locale!=='he'){
    const meta=routeMeta(locale,route);
    next=next.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+esc(meta.title)+'</title>');
    next=next.replace(/<meta\s+name=["']description["'][^>]*>/i,'<meta name="description" content="'+esc(meta.description)+'">');
    next=next.replace(/<meta\s+property=["']og:title["'][^>]*>/i,'<meta property="og:title" content="'+esc(meta.title)+'">');
    next=next.replace(/<meta\s+property=["']og:description["'][^>]*>/i,'<meta property="og:description" content="'+esc(meta.description)+'">');
    next=next.replace(/<meta\s+property=["']og:url["'][^>]*>/i,'<meta property="og:url" content="'+canonical+'">');
    next=next.replace(/<meta\s+property=["']og:locale["'][^>]*>/i,'<meta property="og:locale" content="'+(locale==='ru'?'ru_RU':locale==='ar'?'ar_IL':'en_US')+'">');
  }
  if(/<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(next))next=next.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i,'<link rel="canonical" href="'+canonical+'">');
  else next=next.replace('</head>','  <link rel="canonical" href="'+canonical+'">\n</head>');
  const alternates=allLocales.map(lang=>'  <link rel="alternate" hreflang="'+lang+'" href="https://7ya.io'+routePath(lang,route)+'">').join('\n')+'\n  <link rel="alternate" hreflang="x-default" href="https://7ya.io'+routePath('he',route)+'">';
  next=next.replace('</head>',alternates+'\n</head>');
  return next;
}

function addShellAssets(html) {
  let next=html;
  if(!next.includes('locale-shell-20260919.css'))next=next.replace('</head>','  <link rel="stylesheet" href="/styles/locale-shell-20260919.css?v=1">\n</head>');
  if(!next.includes('locale-runtime-20260919.js'))next=next.replace('</body>','  <script src="/scripts/locale-runtime-20260919.js?v=1" defer></script>\n</body>');
  return next;
}

function contextMarkup(locale, route) {
  if(locale==='he')return '';
  const c=localeCopy[locale], name=routeNames[route]?.[locale]||routeNames[''][locale];
  return '<aside class="locale-context" data-locale-context><strong>'+esc(name)+'</strong><p>'+c.context+'</p><small>'+c.sourceNote+'</small></aside>';
}

function applyLocale(html, locale, route) {
  let next=rewriteSameHostReferences(html,locale,route);
  next=replaceVisibleCopy(next,locale);
  const nav=languageNav(locale,route);
  if(/<nav class=["']seven-human-nav["'][\s\S]*?<\/nav>/i.test(next))next=next.replace(/<nav class=["']seven-human-nav["'][\s\S]*?<\/nav>/i,nav);
  else next=next.replace(/<body\b[^>]*>/i,match=>match+'\n'+nav);
  if(locale!=='he'){
    const proof=proofMarkup(locale);
    if(/<section class=["']seven-proof-layer["'][\s\S]*?<\/section>/i.test(next))next=next.replace(/<section class=["']seven-proof-layer["'][\s\S]*?<\/section>/i,proof);
    const context=contextMarkup(locale,route);
    next=next.replace(nav,nav+'\n'+context);
  }
  next=setMetadata(next,locale,route);
  next=addShellAssets(next);
  return next;
}

async function exists(file){try{await fs.access(file);return true}catch{return false}}

async function writeSitemap(output){
  const urls=[];
  for(const route of canonicalRoutes){
    const alternates=allLocales.map(lang=>'<xhtml:link rel="alternate" hreflang="'+lang+'" href="https://7ya.io'+routePath(lang,route)+'"/>').join('');
    const xdefault='<xhtml:link rel="alternate" hreflang="x-default" href="https://7ya.io'+routePath('he',route)+'"/>';
    for(const locale of allLocales){
      urls.push('  <url><loc>https://7ya.io'+routePath(locale,route)+'</loc><lastmod>2026-09-19</lastmod>'+alternates+xdefault+'</url>');
    }
  }
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+urls.join('\n')+'\n</urlset>\n';
  await fs.writeFile(path.join(output,'sitemap.xml'),xml,'utf8');
}

export async function localizeStaticSite(output){
  const routes=[...new Set(['',...publicRouteDirectories])];
  for(const route of routes){
    const source=path.join(output,route?route+'/index.html':'index.html');
    if(!(await exists(source)))continue;
    const base=await fs.readFile(source,'utf8');
    await fs.writeFile(source,applyLocale(base,'he',route),'utf8');
    for(const locale of generatedLocaleRoots){
      const target=path.join(output,locale,route?route+'/index.html':'index.html');
      await fs.mkdir(path.dirname(target),{recursive:true});
      await fs.writeFile(target,applyLocale(base,locale,route),'utf8');
    }
  }
  await writeSitemap(output);
  console.log('LOCALE_PROJECTION: PASS (he/en/ru/ar · clean paths · hreflang · sitemap)');
}
