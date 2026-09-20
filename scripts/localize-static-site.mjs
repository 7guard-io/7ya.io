import fs from 'node:fs/promises';
import path from 'node:path';
import { aliasRoutes, canonicalRoutes, publicRouteDirectories } from './site-contract.mjs';

export const generatedLocaleRoots = ['en','ru','ar'];
const allLocales = ['he', ...generatedLocaleRoots];
const dirFor = locale => (locale === 'he' || locale === 'ar') ? 'rtl' : 'ltr';

const buildDateParts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit'
}).formatToParts(new Date()).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
const buildDate = `${buildDateParts.day}.${buildDateParts.month}.${buildDateParts.year}`;
const buildDateIso = `${buildDateParts.year}-${buildDateParts.month}-${buildDateParts.day}`;
const buildNowLabel = { he:'עכשיו', en:'NOW', ru:'СЕЙЧАС', ar:'الآن' };
function stampBuildDate(html, locale) {
  const label = buildNowLabel[locale] || buildNowLabel.he;
  return html.replace(/(?:עכשיו|Now|NOW|СЕЙЧАС|الآن)\s*\/\s*(?:BUILD_DATE|\d{2}\.\d{2}\.\d{4})/g, `${label} / ${buildDate}`);
}

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


const coreNarrativeTranslations = {
  "en": [
    [
      "נולדתי בחרקוב, גדלתי בחולון, עברתי דרך שירות, משטרה, אבהות ויצירה. היום אני בונה חיבורים בין אנשים, טכנולוגיה והזדמנות — ומשאיר את המקורות פתוחים.",
      "I was born in Kharkiv, grew up in Holon, and moved through service, policing, fatherhood and creation. Today I build connections between people, technology and opportunity — while keeping the sources open."
    ],
    [
      "כל צילום ורגע באתר מובילים לפרסום או למקור שממנו הגיעו.",
      "Every photo and moment on the site leads back to the publication or source it came from."
    ],
    [
      "בלי שפה של ארגון גדול: אדם אחד, מסלול לא ישר, ועשייה שאפשר לראות ולבדוק.",
      "No big-organization language: one person, a nonlinear path, and work you can see and verify."
    ],
    [
      "העיקרון שמוביל את 7YA",
      "The principle that guides 7YA"
    ],
    [
      "להכיר אותי מעבר לכותרת",
      "Know me beyond the headline"
    ],
    [
      "לא מחכים ל״גרסה הבאה של האתר״. כאן המדיה מהפרסום עצמו מגיעה לפני ההסבר — וכל כרטיס נשאר מחובר למקור.",
      "No waiting for “the next version of the site.” Here the media from the original publication comes before the explanation — and every card stays connected to its source."
    ],
    [
      "המאגר שומר את הדרך מ־2011 ועד היום. כאן מקבלים טעימה מהרגעים שבהם אפשר לראות גם את מה שהקהל עשה עם התוכן — צפיות, תגובות, שיתופים והפצה מעבר לחשבון שלי.",
      "The archive preserves the path from 2011 to today. Here you can see moments where the audience also shaped what happened next — views, comments, shares and distribution beyond my own account."
    ],
    [
      "רשומות ציבוריות במאגר החיים · 170 מהן כבר מחוברות למדד מספרי",
      "public records in the life archive · 170 already linked to a numerical metric"
    ],
    [
      "המספרים אינם מחוברים ל״מספר השפעה״ אחד. כל מדד נשאר קשור לפרסום, לפלטפורמה ולנקודת הזמן שלו.",
      "The figures are not merged into one “impact number.” Every metric stays tied to its publication, platform and date."
    ],
    [
      "כאן רואים",
      "Here you can see"
    ],
    [
      "איך רגע הופך למסלול.",
      "how a moment becomes a path."
    ],
    [
      "לא טיימליין של תפקידים. אלה שישה אשכולות שבהם אפשר לפתוח את המקור, לראות את ההפצה והתגובה, ואז לעבור לפרק הבא שנשאר מתועד. כשאין הוכחה לקשר סיבתי — אני לא ממציא אחד.",
      "Not a timeline of job titles. These are six clusters where you can open the source, see distribution and response, then move to the next documented chapter. When causality is not proven, I do not invent it."
    ],
    [
      "הנתונים מוצגים לפי המקור ונקודת הזמן שלהם. הפצה חיצונית נשארת מסומנת כחיצונית, ומספרים מפלטפורמות שונות אינם מחוברים לסכום אחד.",
      "Data stays attached to its source and date. External distribution remains labeled external, and numbers from different platforms are not combined into one total."
    ],
    [
      "לא קורות חיים.",
      "Not a résumé."
    ],
    [
      "חיים עם הקשר.",
      "A life with context."
    ],
    [
      "במקום רשימת תפקידים, הנה הרגעים ששינו כיוון — והפרסומים שמאפשרים להכיר אותם מקרוב.",
      "Instead of a list of roles, these are the moments that changed direction — and the publications that let you inspect them closely."
    ],
    [
      "לא תמונות אווירה.",
      "Not decorative imagery."
    ],
    [
      "דברים שבאמת פרסמתי.",
      "Things I actually published."
    ],
    [
      "וידאו, שיחה ארוכה, מוזיקה, מסמך ציבורי ופוסט כתוב. כל כרטיס יוצא למקור; הפצה חיצונית מסומנת בנפרד מתוכן בבעלותי.",
      "Video, long-form conversation, music, a public document and written posts. Every card opens its source; external distribution is separated from content I own."
    ],
    [
      "לא כמה פוסטים.",
      "Not how many posts."
    ],
    [
      "שנים של נוכחות.",
      "Years of presence."
    ],
    [
      "המספרים כאן הם מספרי רשומות מתועדות ב־Master Public Record — לא סכום צפיות ולא ניסיון לחבר מדדים שונים למספר אחד.",
      "These figures are documented record counts in the Master Public Record — not total views and not an attempt to combine unlike metrics into one number."
    ],
    [
      "לא רק מה פרסמתי.",
      "Not only what I published."
    ],
    [
      "מה אנשים עשו עם זה.",
      "What people did with it."
    ],
    [
      "תגובות, שמירות, שיתופים והפצה מחוץ לחשבון. המדדים כאן קשורים למקור ולנקודת זמן — והפצה חיצונית מסומנת כהפצה חיצונית.",
      "Comments, saves, shares and distribution beyond my account. Metrics stay tied to a source and date, and external distribution stays explicitly labeled external."
    ],
    [
      "איגור ופרצקי.",
      "Igor Vepretski."
    ],
    [
      "לא טייטל. מסלול.",
      "Not a title. A path."
    ],
    [
      "נולדתי בחרקוב, גדלתי בישראל, עברתי דרך שירות, מערכות ציבוריות, אבהות, יצירה ויזמות חברתית. 7YA נבנתה כדי שהסיפור לא יישאר רשימת תפקידים — אלא יישאר מחובר לרגעים, למקורות ולמה שאני בונה היום.",
      "I was born in Kharkiv, grew up in Israel, and moved through service, public systems, fatherhood, creation and social entrepreneurship. 7YA was built so the story would not become a list of roles, but remain connected to moments, sources and what I am building today."
    ],
    [
      "למדיה המקורית",
      "Original media"
    ],
    [
      "לצפייה בראיות",
      "View evidence"
    ],
    [
      "לתיאום שיחה",
      "Start a conversation"
    ],
    [
      "האדם קודם. המערכת רק מארגנת.",
      "The person comes first. The system only organizes."
    ],
    [
      "הסיפור גם",
      "The story is also"
    ],
    [
      "נראה.",
      "visible."
    ],
    [
      "דיוקנאות, ראיונות, וידאו, StartOn ומוזיקה — פריטים אמיתיים שנפתחים למקור.",
      "Portraits, interviews, video, StartOn and music — real items that open to their sources."
    ],
    [
      "אני לא רוצה אתר שיגיד שהכול היה מסודר.",
      "I do not want a site that pretends everything was orderly."
    ],
    [
      "הוא לא היה.",
      "It was not."
    ],
    [
      "אני רוצה מקום שאפשר לראות בו איך רגע אחד התחבר לבא אחריו — ומה עשיתי עם מה שלמדתי.",
      "I want a place where you can see how one moment connected to the next — and what I did with what I learned."
    ],
    [
      "תחנות שונות.",
      "Different chapters."
    ],
    [
      "אותה שאלה.",
      "The same question."
    ],
    [
      "מה גורם לאדם להרגיש שיש לו מקום — ואיך מערכת יכולה לפתוח דלת במקום לסגור אותה?",
      "What makes a person feel they have a place — and how can a system open a door instead of closing one?"
    ],
    [
      "מה אני בונה",
      "What I am building"
    ],
    [
      "עכשיו.",
      "now."
    ],
    [
      "שלושה נתיבים שונים: משימה חברתית, מערכת זיכרון ומחקר/כתיבה. הם מתחברים — אבל לא מתערבבים.",
      "Three distinct paths: a social mission, a memory system, and research/writing. They connect, but they do not blur into one another."
    ],
    [
      "אותו אדם.",
      "The same person."
    ],
    [
      "כמה חלונות.",
      "Many windows."
    ],
    [
      "החשבונות אינם ״ערוצים שיווקיים״ באתר. כל אחד מחזיק שכבה אחרת של אותו ארכיון חי.",
      "The accounts are not “marketing channels” on this site. Each holds a different layer of the same living archive."
    ],
    [
      "העמוד הזה הוא רק הציר.",
      "This page is only the spine."
    ],
    [
      "המקורות נמצאים מסביבו.",
      "The sources live around it."
    ],
    [
      "לא באתי לבנות",
      "I did not come to build"
    ],
    [
      "תדמית.",
      "an image."
    ],
    [
      "באתי לבנות מסלול.",
      "I came to build a path."
    ],
    [
      "אני איגור ופרצקי.",
      "I’m Igor Vepretski."
    ],
    [
      "הסיפור שלי אינו קו ישר ואינו אוסף תארים. הוא חיבור בין הגירה ושייכות, חיים בלי גב מובן מאליו, שירות ואחריות, אבהות, מוזיקה, StartOn ובניית מערכת ציבורית שאפשר לבדוק.",
      "My story is neither a straight line nor a collection of titles. It connects immigration and belonging, life without an obvious safety net, service and responsibility, fatherhood, music, StartOn, and building a public system that can be checked."
    ],
    [
      "לפתוח את שבעת הפרקים",
      "Open the seven chapters"
    ],
    [
      "לראות את העבודה",
      "See the work"
    ],
    [
      "לבדוק את המקורות",
      "Check the sources"
    ],
    [
      "העמוד משלב חומר אישי, מקורות ציבוריים ונתוני אינדקס. טענה שאין לה מקור אינה מוצגת כהישג מאומת.",
      "This page combines personal material, public sources and index data. A claim without a source is not presented as a verified achievement."
    ],
    [
      "שבעה פרקים. לא שבע סיסמאות.",
      "Seven chapters. Not seven slogans."
    ],
    [
      "הסיפור החזותי אינו קישוט. הוא מסביר מאיפה באתי, מה המערכת לימדה אותי, ומה אני מנסה לבנות עבור אנשים שלא תמיד רואים אותם בזמן.",
      "The visual story is not decoration. It explains where I came from, what systems taught me, and what I am trying to build for people who are not always seen in time."
    ],
    [
      "הפרק הבא לא ייכתב לבד.",
      "The next chapter will not write itself."
    ],
    [
      "שותפות ל־StartOn, ראיון, הרצאה, יצירה, מערכת ציבורית או תיקון ראיה — מתחילים בשיחה ברורה ובאחריות על העובדות.",
      "A StartOn partnership, interview, lecture, creative project, public system or evidence correction begins with a clear conversation and responsibility for the facts."
    ],
    [
      "לחזור לשכונה.",
      "Return to the neighborhood."
    ],
    [
      "לבנות התחלה.",
      "Build a beginning."
    ],
    [
      "StartOn נולדה מהחיבור בין מסלול אישי לשאלה ציבורית: איך בונים לצעירים מקום שהם רוצים להיכנס אליו — ואז מחברים אותו לטכנולוגיה, יצירה, אנשים ושייכות.",
      "StartOn grew from the connection between a personal path and a public question: how do you build a place young people want to enter — then connect it to technology, creation, people and belonging?"
    ],
    [
      "לתמיכה בפיילוט",
      "Support the pilot"
    ],
    [
      "למקורות",
      "Sources"
    ],
    [
      "למודל",
      "The model"
    ],
    [
      "טכנולוגיה היא לא ההתערבות.",
      "Technology is not the intervention."
    ],
    [
      "היא הדלת. מה שקורה אחרי שנכנסים — קשר, קהילה, גבולות, למידה והמשכיות — הוא המבחן.",
      "It is the door. What happens after people enter — relationships, community, boundaries, learning and continuity — is the test."
    ],
    [
      "לפני החזון הגדול —",
      "Before the big vision —"
    ],
    [
      "המקורות.",
      "the sources."
    ],
    [
      "האתר לא צריך לבקש שתאמינו לסיפור. אפשר לפתוח את המסמך, הכתבה, הווידאו והרפלקציה ולראות איך הרעיון השתנה לאורך הזמן.",
      "The site should not ask you to believe the story. You can open the document, article, video and reflection and see how the idea changed over time."
    ],
    [
      "חמישה רכיבים.",
      "Five components."
    ],
    [
      "מסלול אנושי אחד.",
      "One human path."
    ],
    [
      "הרכיבים הם מודל עבודה — לא טענה שכל אחד מהם כבר פועל בכל אתר. סטטוס אמיתי קודם למצגת.",
      "The components are a working model — not a claim that every element is already operating at every site. Real status comes before presentation."
    ],
    [
      "מה ידוע.",
      "What is known."
    ],
    [
      "ומה עוד לא.",
      "And what is not yet known."
    ],
    [
      "ההבחנה חשובה יותר מעיצוב יפה: רעיון, מסמך, פיילוט ותוצאה אינם אותו דבר.",
      "The distinction matters more than polished design: an idea, a document, a pilot and an outcome are not the same thing."
    ],
    [
      "StartOn לא צריכה עוד סיסמה.",
      "StartOn does not need another slogan."
    ],
    [
      "היא צריכה מקום, אנשים, מדידה ושותפים נכונים.",
      "It needs a place, people, measurement and the right partners."
    ],
    [
      "לא ערכת מדיה.",
      "Not a media kit."
    ],
    [
      "המדיה עצמה.",
      "The media itself."
    ],
    [
      "כתבות, ראיונות טלוויזיה, פודקאסטים, וידאו, מוזיקה וכתיבה שפורסמו באמת — מהפרופיל העיתונאי המוקדם ב־2011 ועד השיחות הארוכות והפרסומים העדכניים. כל פריט מוביל למקור; mirrors והפצה חיצונית מסומנים בנפרד.",
      "Articles, television interviews, podcasts, video, music and writing that were actually published — from an early 2011 press profile to long-form conversations and current posts. Every item leads to its source; mirrors and external distribution are marked separately."
    ],
    [
      "ההשפעה שלי",
      "My public impact"
    ],
    [
      "אינה מספר אחד.",
      "is not one number."
    ],
    [
      "היא נבנתה לאורך שנים מפוסטים שאנשים העבירו הלאה, שיחות ציבוריות, כתיבה, מוזיקה, שירות, StartOn ותוכן בשלוש שפות. כאן אפשר לראות את הרצף — ולפתוח את המקור שמאחורי כל שכבה.",
      "It was built over years through posts people passed on, public conversations, writing, music, service, StartOn and content in three languages. Here you can see the continuity — and open the source behind each layer."
    ],
    [
      "מספרים עם תאריך.",
      "Numbers with a date."
    ],
    [
      "לא מספרים מהזיכרון.",
      "Not numbers from memory."
    ],
    [
      "צילום מצב הוא נקודת מדידה, לא הבטחה נצחית. לכן כל מספר מוצג יחד עם ההקשר שלו ומוביל לארכיון שממנו הגיע.",
      "A snapshot is a measurement point, not a permanent promise. Every number is shown with its context and links back to the archive it came from."
    ],
    [
      "הפלטפורמות מחלקות נראות.",
      "Platforms distribute visibility."
    ],
    [
      "7YA שומרת זיכרון.",
      "7YA preserves memory."
    ],
    [
      "כל פלטפורמה נשארת המקור לפריט שלה. 7YA שומרת את הקישור, ההקשר ומדרג האימות כדי שהסיפור לא יהיה תלוי בפיד אחד.",
      "Each platform remains the source for its own item. 7YA preserves the link, context and verification level so the story does not depend on one feed."
    ],
    [
      "לא תיקייה.",
      "Not a folder."
    ],
    [
      "זיכרון שאפשר לפתוח.",
      "Memory you can open."
    ],
    [
      "הספרייה מחברת בין רגע, מקור והקשר. היא לא מחליפה את YouTube, Instagram, Spotify או כתבה — היא מחזירה אותם לאותו סיפור.",
      "The library connects a moment, a source and its context. It does not replace YouTube, Instagram, Spotify or an article — it brings them back into the same story."
    ],
    [
      "לא רק לספר.",
      "Not only to tell."
    ],
    [
      "גם להראות.",
      "Also to show."
    ],
    [
      "7YA אינה מבקשת אמון עיוור.",
      "7YA does not ask for blind trust."
    ],
    [
      "הארכיון מחבר כל טענה מרכזית למקור, הקשר וסטטוס ברור. חוסר הוכחה אינו מוסתר; תכנון אינו מוצג כתוצאה; מידע רגיש נשאר מחוץ למרחב הציבורי.",
      "The archive connects every major claim to a source, context and clear status. Missing evidence is not hidden; plans are not presented as outcomes; sensitive information stays outside the public layer."
    ],
    [
      "מהחוויה",
      "From experience"
    ],
    [
      "למסגרת חשיבה.",
      "to a framework for thinking."
    ],
    [
      "כאן נמצאים המנוסקריפטים, הפוסטים והרעיונות שאני מנסה לנסח: agency אנושי, זהות דיגיטלית, אמון, AI, מערכות ציבוריות והזדמנות. כל פריט מקבל סטטוס ברור — רעיון, working manuscript או מקור חיצוני.",
      "Here are the manuscripts, posts and ideas I am trying to formulate: human agency, digital identity, trust, AI, public systems and opportunity. Every item gets a clear status — idea, working manuscript or external source."
    ],
    [
      "ביטחון.",
      "Security."
    ],
    [
      "אמון ציבורי.",
      "Public trust."
    ],
    [
      "איגור ופרצקי זמין להרצאות, פאנלים, פודקאסטים וראיונות בנושאי AI, ביטחון ציבורי, Civic Tech, נוער, StartOn, דיגיטל, ראיות והשפעה ציבורית. הזווית שלו אינה תיאורטית בלבד: היא מגיעה מהשטח — שירות, מודיעין, ביטחון, עיר, יזמות חברתית ובניית מערכת 7YA.",
      "Igor Vepretski is available for talks, panels, podcasts and interviews on AI, public safety, Civic Tech, youth, StartOn, digital systems, evidence and public impact. His perspective is not only theoretical; it comes from field experience — service, intelligence, security, municipal work, social entrepreneurship and building 7YA."
    ],
    [
      "פנייה להזמנה",
      "Booking inquiry"
    ],
    [
      "נושאי הרצאה",
      "Talk topics"
    ],
    [
      "בדיקת מקורות",
      "Check sources"
    ],
    [
      "לא לשלוח “היי”.",
      "Do not just send “Hi.”"
    ],
    [
      "להתחיל משהו.",
      "Start something."
    ],
    [
      "שיחה טובה מתחילה בהקשר ברור: מי אתם, מה אתם רוצים לבנות, למה זה חשוב עכשיו ומה יכולה להיות הפעולה הבאה. הפנייה הרשמית לכל תחומי העשייה עוברת דרך כתובת אחת.",
      "A good conversation starts with clear context: who you are, what you want to build, why it matters now and what the next action could be. One official address handles inquiries across all areas of work."
    ],
    [
      "המערכת מנתבת. האדם מחליט.",
      "The system routes. The person decides."
    ],
    [
      "שש דרכי פנייה.",
      "Six ways to reach out."
    ],
    [
      "כתובת אחת.",
      "One address."
    ],
    [
      "בחירת הנושא אינה בירוקרטיה. היא מאפשרת להבין מהר את ההקשר, לשמור על פרטיות ולהגיע לפעולה מתאימה.",
      "Choosing a topic is not bureaucracy. It helps understand context quickly, protect privacy and reach the right next action."
    ],
    [
      "ארבעה פרטים",
      "Four details"
    ],
    [
      "שחוסכים עשרה מיילים.",
      "that save ten emails."
    ],
    [
      "אין צורך במצגת ארוכה. הודעה מדויקת מאפשרת להבין מהר אם קיימת התאמה ומה הצעד הבא.",
      "No long deck is needed. A precise message makes it easier to see quickly whether there is a fit and what the next step should be."
    ],
    [
      "אפשר להיות פתוחים",
      "You can be open"
    ],
    [
      "בלי להיות חשופים.",
      "without being exposed."
    ],
    [
      "מייל רגיל אינו כספת. מידע רגיש נשלח רק לאחר תיאום ערוץ מתאים ורק כאשר הוא הכרחי.",
      "Ordinary email is not a vault. Sensitive information should be sent only after agreeing on an appropriate channel and only when necessary."
    ],
    [
      "יש דבר אמיתי לבנות?",
      "Is there something real to build?"
    ],
    [
      "בואו נתחיל נכון.",
      "Let’s start properly."
    ]
  ],
  "ru": [
    [
      "נולדתי בחרקוב, גדלתי בחולון, עברתי דרך שירות, משטרה, אבהות ויצירה. היום אני בונה חיבורים בין אנשים, טכנולוגיה והזדמנות — ומשאיר את המקורות פתוחים.",
      "Я родился в Харькове, вырос в Холоне и прошёл через службу, полицию, отцовство и творчество. Сегодня я соединяю людей, технологии и возможности — и оставляю источники открытыми."
    ],
    [
      "כל צילום ורגע באתר מובילים לפרסום או למקור שממנו הגיעו.",
      "Каждая фотография и каждый момент на сайте ведут к публикации или источнику, откуда они взяты."
    ],
    [
      "בלי שפה של ארגון גדול: אדם אחד, מסלול לא ישר, ועשייה שאפשר לראות ולבדוק.",
      "Без языка большой организации: один человек, нелинейный путь и работа, которую можно увидеть и проверить."
    ],
    [
      "העיקרון שמוביל את 7YA",
      "Принцип, который ведёт 7YA"
    ],
    [
      "להכיר אותי מעבר לכותרת",
      "Узнать меня за пределами заголовка"
    ],
    [
      "לא מחכים ל״גרסה הבאה של האתר״. כאן המדיה מהפרסום עצמו מגיעה לפני ההסבר — וכל כרטיס נשאר מחובר למקור.",
      "Здесь не ждут «следующей версии сайта». Медиа из самой публикации появляется раньше объяснения, и каждая карточка остаётся связанной с источником."
    ],
    [
      "המאגר שומר את הדרך מ־2011 ועד היום. כאן מקבלים טעימה מהרגעים שבהם אפשר לראות גם את מה שהקהל עשה עם התוכן — צפיות, תגובות, שיתופים והפצה מעבר לחשבון שלי.",
      "Архив сохраняет путь с 2011 года до сегодня. Здесь видно не только то, что я публиковал, но и то, что аудитория делала дальше: просмотры, комментарии, репосты и распространение за пределами моего аккаунта."
    ],
    [
      "רשומות ציבוריות במאגר החיים · 170 מהן כבר מחוברות למדד מספרי",
      "публичных записей в архиве жизни · 170 уже связаны с числовым показателем"
    ],
    [
      "המספרים אינם מחוברים ל״מספר השפעה״ אחד. כל מדד נשאר קשור לפרסום, לפלטפורמה ולנקודת הזמן שלו.",
      "Числа не сводятся в единый «показатель влияния». Каждый показатель остаётся привязан к публикации, платформе и дате."
    ],
    [
      "כאן רואים",
      "Здесь видно"
    ],
    [
      "איך רגע הופך למסלול.",
      "как момент превращается в путь."
    ],
    [
      "לא טיימליין של תפקידים. אלה שישה אשכולות שבהם אפשר לפתוח את המקור, לראות את ההפצה והתגובה, ואז לעבור לפרק הבא שנשאר מתועד. כשאין הוכחה לקשר סיבתי — אני לא ממציא אחד.",
      "Это не таймлайн должностей. Это шесть кластеров, где можно открыть источник, увидеть распространение и реакцию, а затем перейти к следующей документированной главе. Если причинная связь не доказана, я её не придумываю."
    ],
    [
      "הנתונים מוצגים לפי המקור ונקודת הזמן שלהם. הפצה חיצונית נשארת מסומנת כחיצונית, ומספרים מפלטפורמות שונות אינם מחוברים לסכום אחד.",
      "Данные остаются привязаны к источнику и дате. Внешнее распространение помечается отдельно, а показатели разных платформ не складываются в одну сумму."
    ],
    [
      "לא קורות חיים.",
      "Не резюме."
    ],
    [
      "חיים עם הקשר.",
      "Жизнь с контекстом."
    ],
    [
      "במקום רשימת תפקידים, הנה הרגעים ששינו כיוון — והפרסומים שמאפשרים להכיר אותם מקרוב.",
      "Вместо списка должностей — моменты, которые меняли направление, и публикации, позволяющие рассмотреть их ближе."
    ],
    [
      "לא תמונות אווירה.",
      "Не декоративные картинки."
    ],
    [
      "דברים שבאמת פרסמתי.",
      "То, что я действительно публиковал."
    ],
    [
      "וידאו, שיחה ארוכה, מוזיקה, מסמך ציבורי ופוסט כתוב. כל כרטיס יוצא למקור; הפצה חיצונית מסומנת בנפרד מתוכן בבעלותי.",
      "Видео, длинные разговоры, музыка, публичные документы и посты. Каждая карточка ведёт к источнику; внешнее распространение отделено от принадлежащего мне контента."
    ],
    [
      "לא כמה פוסטים.",
      "Не количество постов."
    ],
    [
      "שנים של נוכחות.",
      "Годы присутствия."
    ],
    [
      "המספרים כאן הם מספרי רשומות מתועדות ב־Master Public Record — לא סכום צפיות ולא ניסיון לחבר מדדים שונים למספר אחד.",
      "Это количество документированных записей в Master Public Record — не сумма просмотров и не попытка объединить разные метрики в одно число."
    ],
    [
      "לא רק מה פרסמתי.",
      "Не только то, что я публиковал."
    ],
    [
      "מה אנשים עשו עם זה.",
      "Что люди сделали с этим."
    ],
    [
      "תגובות, שמירות, שיתופים והפצה מחוץ לחשבון. המדדים כאן קשורים למקור ולנקודת זמן — והפצה חיצונית מסומנת כהפצה חיצונית.",
      "Комментарии, сохранения, репосты и распространение за пределами аккаунта. Показатели привязаны к источнику и дате, а внешнее распространение явно помечено как внешнее."
    ],
    [
      "איגור ופרצקי.",
      "Игорь Вепрецкий."
    ],
    [
      "לא טייטל. מסלול.",
      "Не титул. Путь."
    ],
    [
      "נולדתי בחרקוב, גדלתי בישראל, עברתי דרך שירות, מערכות ציבוריות, אבהות, יצירה ויזמות חברתית. 7YA נבנתה כדי שהסיפור לא יישאר רשימת תפקידים — אלא יישאר מחובר לרגעים, למקורות ולמה שאני בונה היום.",
      "Я родился в Харькове, вырос в Израиле и прошёл через службу, общественные системы, отцовство, творчество и социальное предпринимательство. 7YA создана, чтобы история не превращалась в список должностей, а оставалась связанной с моментами, источниками и тем, что я строю сегодня."
    ],
    [
      "למדיה המקורית",
      "Оригинальные медиа"
    ],
    [
      "לצפייה בראיות",
      "Смотреть доказательства"
    ],
    [
      "לתיאום שיחה",
      "Начать разговор"
    ],
    [
      "האדם קודם. המערכת רק מארגנת.",
      "Человек прежде всего. Система лишь организует."
    ],
    [
      "הסיפור גם",
      "История ещё и"
    ],
    [
      "נראה.",
      "видима."
    ],
    [
      "דיוקנאות, ראיונות, וידאו, StartOn ומוזיקה — פריטים אמיתיים שנפתחים למקור.",
      "Портреты, интервью, видео, StartOn и музыка — реальные материалы, ведущие к источникам."
    ],
    [
      "אני לא רוצה אתר שיגיד שהכול היה מסודר.",
      "Я не хочу сайт, который делает вид, будто всё было упорядочено."
    ],
    [
      "הוא לא היה.",
      "Это не так."
    ],
    [
      "אני רוצה מקום שאפשר לראות בו איך רגע אחד התחבר לבא אחריו — ומה עשיתי עם מה שלמדתי.",
      "Я хочу место, где видно, как один момент соединялся со следующим — и что я делал с тем, чему научился."
    ],
    [
      "תחנות שונות.",
      "Разные этапы."
    ],
    [
      "אותה שאלה.",
      "Один и тот же вопрос."
    ],
    [
      "מה גורם לאדם להרגיש שיש לו מקום — ואיך מערכת יכולה לפתוח דלת במקום לסגור אותה?",
      "Что помогает человеку почувствовать, что у него есть место — и как система может открыть дверь вместо того, чтобы её закрыть?"
    ],
    [
      "מה אני בונה",
      "Что я строю"
    ],
    [
      "עכשיו.",
      "сейчас."
    ],
    [
      "שלושה נתיבים שונים: משימה חברתית, מערכת זיכרון ומחקר/כתיבה. הם מתחברים — אבל לא מתערבבים.",
      "Три разных направления: социальная миссия, система памяти и исследования/тексты. Они связаны, но не смешиваются."
    ],
    [
      "אותו אדם.",
      "Один человек."
    ],
    [
      "כמה חלונות.",
      "Много окон."
    ],
    [
      "החשבונות אינם ״ערוצים שיווקיים״ באתר. כל אחד מחזיק שכבה אחרת של אותו ארכיון חי.",
      "Аккаунты здесь не «маркетинговые каналы». Каждый хранит отдельный слой одного живого архива."
    ],
    [
      "העמוד הזה הוא רק הציר.",
      "Эта страница — только ось."
    ],
    [
      "המקורות נמצאים מסביבו.",
      "Источники находятся вокруг неё."
    ],
    [
      "לא באתי לבנות",
      "Я пришёл не строить"
    ],
    [
      "תדמית.",
      "образ."
    ],
    [
      "באתי לבנות מסלול.",
      "Я пришёл строить путь."
    ],
    [
      "אני איגור ופרצקי.",
      "Я Игорь Вепрецкий."
    ],
    [
      "הסיפור שלי אינו קו ישר ואינו אוסף תארים. הוא חיבור בין הגירה ושייכות, חיים בלי גב מובן מאליו, שירות ואחריות, אבהות, מוזיקה, StartOn ובניית מערכת ציבורית שאפשר לבדוק.",
      "Моя история — не прямая линия и не коллекция титулов. Она соединяет миграцию и принадлежность, жизнь без очевидной опоры, службу и ответственность, отцовство, музыку, StartOn и создание публичной системы, которую можно проверить."
    ],
    [
      "לפתוח את שבעת הפרקים",
      "Открыть семь глав"
    ],
    [
      "לראות את העבודה",
      "Посмотреть работу"
    ],
    [
      "לבדוק את המקורות",
      "Проверить источники"
    ],
    [
      "העמוד משלב חומר אישי, מקורות ציבוריים ונתוני אינדקס. טענה שאין לה מקור אינה מוצגת כהישג מאומת.",
      "Страница объединяет личные материалы, публичные источники и данные индекса. Утверждение без источника не представляется как подтверждённое достижение."
    ],
    [
      "שבעה פרקים. לא שבע סיסמאות.",
      "Семь глав. Не семь лозунгов."
    ],
    [
      "הסיפור החזותי אינו קישוט. הוא מסביר מאיפה באתי, מה המערכת לימדה אותי, ומה אני מנסה לבנות עבור אנשים שלא תמיד רואים אותם בזמן.",
      "Визуальная история — не украшение. Она показывает, откуда я пришёл, чему меня научили системы и что я пытаюсь строить для людей, которых не всегда замечают вовремя."
    ],
    [
      "הפרק הבא לא ייכתב לבד.",
      "Следующая глава сама себя не напишет."
    ],
    [
      "שותפות ל־StartOn, ראיון, הרצאה, יצירה, מערכת ציבורית או תיקון ראיה — מתחילים בשיחה ברורה ובאחריות על העובדות.",
      "Партнёрство с StartOn, интервью, лекция, творческий проект, публичная система или исправление доказательства начинаются с ясного разговора и ответственности за факты."
    ],
    [
      "לחזור לשכונה.",
      "Вернуться в район."
    ],
    [
      "לבנות התחלה.",
      "Построить начало."
    ],
    [
      "StartOn נולדה מהחיבור בין מסלול אישי לשאלה ציבורית: איך בונים לצעירים מקום שהם רוצים להיכנס אליו — ואז מחברים אותו לטכנולוגיה, יצירה, אנשים ושייכות.",
      "StartOn родился из соединения личного пути и общественного вопроса: как создать место, куда молодые люди хотят прийти, а затем связать его с технологиями, творчеством, людьми и чувством принадлежности?"
    ],
    [
      "לתמיכה בפיילוט",
      "Поддержать пилот"
    ],
    [
      "למקורות",
      "Источники"
    ],
    [
      "למודל",
      "Модель"
    ],
    [
      "טכנולוגיה היא לא ההתערבות.",
      "Технология — не само вмешательство."
    ],
    [
      "היא הדלת. מה שקורה אחרי שנכנסים — קשר, קהילה, גבולות, למידה והמשכיות — הוא המבחן.",
      "Она лишь дверь. Настоящий тест — то, что происходит после входа: отношения, сообщество, границы, обучение и продолжение."
    ],
    [
      "לפני החזון הגדול —",
      "До большого видения —"
    ],
    [
      "המקורות.",
      "источники."
    ],
    [
      "האתר לא צריך לבקש שתאמינו לסיפור. אפשר לפתוח את המסמך, הכתבה, הווידאו והרפלקציה ולראות איך הרעיון השתנה לאורך הזמן.",
      "Сайт не должен просить поверить в историю. Можно открыть документ, статью, видео и рефлексию и увидеть, как идея менялась со временем."
    ],
    [
      "חמישה רכיבים.",
      "Пять компонентов."
    ],
    [
      "מסלול אנושי אחד.",
      "Один человеческий путь."
    ],
    [
      "הרכיבים הם מודל עבודה — לא טענה שכל אחד מהם כבר פועל בכל אתר. סטטוס אמיתי קודם למצגת.",
      "Компоненты — это рабочая модель, а не утверждение, что каждый из них уже работает в каждом центре. Реальный статус важнее презентации."
    ],
    [
      "מה ידוע.",
      "Что известно."
    ],
    [
      "ומה עוד לא.",
      "И что пока неизвестно."
    ],
    [
      "ההבחנה חשובה יותר מעיצוב יפה: רעיון, מסמך, פיילוט ותוצאה אינם אותו דבר.",
      "Различие важнее красивого дизайна: идея, документ, пилот и результат — не одно и то же."
    ],
    [
      "StartOn לא צריכה עוד סיסמה.",
      "StartOn не нужен ещё один лозунг."
    ],
    [
      "היא צריכה מקום, אנשים, מדידה ושותפים נכונים.",
      "Ему нужны место, люди, измерение и правильные партнёры."
    ],
    [
      "לא ערכת מדיה.",
      "Не медиакит."
    ],
    [
      "המדיה עצמה.",
      "Сами материалы."
    ],
    [
      "כתבות, ראיונות טלוויזיה, פודקאסטים, וידאו, מוזיקה וכתיבה שפורסמו באמת — מהפרופיל העיתונאי המוקדם ב־2011 ועד השיחות הארוכות והפרסומים העדכניים. כל פריט מוביל למקור; mirrors והפצה חיצונית מסומנים בנפרד.",
      "Статьи, телеинтервью, подкасты, видео, музыка и тексты, которые действительно были опубликованы — от раннего профиля 2011 года до длинных разговоров и свежих публикаций. Каждый материал ведёт к источнику; зеркала и внешнее распространение отмечены отдельно."
    ],
    [
      "ההשפעה שלי",
      "Моё публичное влияние"
    ],
    [
      "אינה מספר אחד.",
      "не одно число."
    ],
    [
      "היא נבנתה לאורך שנים מפוסטים שאנשים העבירו הלאה, שיחות ציבוריות, כתיבה, מוזיקה, שירות, StartOn ותוכן בשלוש שפות. כאן אפשר לראות את הרצף — ולפתוח את המקור שמאחורי כל שכבה.",
      "Оно складывалось годами из постов, которые люди передавали дальше, публичных разговоров, текстов, музыки, службы, StartOn и контента на трёх языках. Здесь видна непрерывность — и можно открыть источник за каждым слоем."
    ],
    [
      "מספרים עם תאריך.",
      "Числа с датой."
    ],
    [
      "לא מספרים מהזיכרון.",
      "Не числа по памяти."
    ],
    [
      "צילום מצב הוא נקודת מדידה, לא הבטחה נצחית. לכן כל מספר מוצג יחד עם ההקשר שלו ומוביל לארכיון שממנו הגיע.",
      "Снимок — это точка измерения, а не вечное обещание. Поэтому каждое число показано вместе с контекстом и ведёт к архиву, откуда оно взято."
    ],
    [
      "הפלטפורמות מחלקות נראות.",
      "Платформы распределяют видимость."
    ],
    [
      "7YA שומרת זיכרון.",
      "7YA сохраняет память."
    ],
    [
      "כל פלטפורמה נשארת המקור לפריט שלה. 7YA שומרת את הקישור, ההקשר ומדרג האימות כדי שהסיפור לא יהיה תלוי בפיד אחד.",
      "Каждая платформа остаётся источником своего материала. 7YA сохраняет ссылку, контекст и уровень проверки, чтобы история не зависела от одного фида."
    ],
    [
      "לא תיקייה.",
      "Не папка."
    ],
    [
      "זיכרון שאפשר לפתוח.",
      "Память, которую можно открыть."
    ],
    [
      "הספרייה מחברת בין רגע, מקור והקשר. היא לא מחליפה את YouTube, Instagram, Spotify או כתבה — היא מחזירה אותם לאותו סיפור.",
      "Библиотека соединяет момент, источник и контекст. Она не заменяет YouTube, Instagram, Spotify или статью — она возвращает их в одну историю."
    ],
    [
      "לא רק לספר.",
      "Не только рассказывать."
    ],
    [
      "גם להראות.",
      "Но и показывать."
    ],
    [
      "7YA אינה מבקשת אמון עיוור.",
      "7YA не просит слепого доверия."
    ],
    [
      "הארכיון מחבר כל טענה מרכזית למקור, הקשר וסטטוס ברור. חוסר הוכחה אינו מוסתר; תכנון אינו מוצג כתוצאה; מידע רגיש נשאר מחוץ למרחב הציבורי.",
      "Архив связывает каждое ключевое утверждение с источником, контекстом и ясным статусом. Отсутствие доказательств не скрывается; планы не выдаются за результаты; чувствительная информация остаётся вне публичного слоя."
    ],
    [
      "מהחוויה",
      "От опыта"
    ],
    [
      "למסגרת חשיבה.",
      "к рамке мышления."
    ],
    [
      "כאן נמצאים המנוסקריפטים, הפוסטים והרעיונות שאני מנסה לנסח: agency אנושי, זהות דיגיטלית, אמון, AI, מערכות ציבוריות והזדמנות. כל פריט מקבל סטטוס ברור — רעיון, working manuscript או מקור חיצוני.",
      "Здесь собраны рукописи, посты и идеи, которые я пытаюсь сформулировать: человеческая агентность, цифровая идентичность, доверие, AI, публичные системы и возможности. Каждый материал получает ясный статус — идея, рабочая рукопись или внешний источник."
    ],
    [
      "ביטחון.",
      "Безопасность."
    ],
    [
      "אמון ציבורי.",
      "Общественное доверие."
    ],
    [
      "איגור ופרצקי זמין להרצאות, פאנלים, פודקאסטים וראיונות בנושאי AI, ביטחון ציבורי, Civic Tech, נוער, StartOn, דיגיטל, ראיות והשפעה ציבורית. הזווית שלו אינה תיאורטית בלבד: היא מגיעה מהשטח — שירות, מודיעין, ביטחון, עיר, יזמות חברתית ובניית מערכת 7YA.",
      "Игорь Вепрецкий доступен для лекций, панелей, подкастов и интервью об AI, общественной безопасности, Civic Tech, молодёжи, StartOn, цифровых системах, доказательствах и публичном влиянии. Его взгляд не только теоретический: он идёт из практики — службы, разведки, безопасности, муниципальной работы, социального предпринимательства и построения 7YA."
    ],
    [
      "פנייה להזמנה",
      "Запрос на выступление"
    ],
    [
      "נושאי הרצאה",
      "Темы выступлений"
    ],
    [
      "בדיקת מקורות",
      "Проверить источники"
    ],
    [
      "לא לשלוח “היי”.",
      "Не пишите просто «Привет»."
    ],
    [
      "להתחיל משהו.",
      "Начните с дела."
    ],
    [
      "שיחה טובה מתחילה בהקשר ברור: מי אתם, מה אתם רוצים לבנות, למה זה חשוב עכשיו ומה יכולה להיות הפעולה הבאה. הפנייה הרשמית לכל תחומי העשייה עוברת דרך כתובת אחת.",
      "Хороший разговор начинается с ясного контекста: кто вы, что хотите построить, почему это важно сейчас и каким может быть следующий шаг. Один официальный адрес принимает обращения по всем направлениям."
    ],
    [
      "המערכת מנתבת. האדם מחליט.",
      "Система направляет. Решает человек."
    ],
    [
      "שש דרכי פנייה.",
      "Шесть способов обратиться."
    ],
    [
      "כתובת אחת.",
      "Один адрес."
    ],
    [
      "בחירת הנושא אינה בירוקרטיה. היא מאפשרת להבין מהר את ההקשר, לשמור על פרטיות ולהגיע לפעולה מתאימה.",
      "Выбор темы — не бюрократия. Он помогает быстро понять контекст, сохранить приватность и перейти к подходящему действию."
    ],
    [
      "ארבעה פרטים",
      "Четыре детали"
    ],
    [
      "שחוסכים עשרה מיילים.",
      "которые экономят десять писем."
    ],
    [
      "אין צורך במצגת ארוכה. הודעה מדויקת מאפשרת להבין מהר אם קיימת התאמה ומה הצעד הבא.",
      "Длинная презентация не нужна. Точное сообщение помогает быстро понять, есть ли совпадение и какой следующий шаг."
    ],
    [
      "אפשר להיות פתוחים",
      "Можно быть открытыми"
    ],
    [
      "בלי להיות חשופים.",
      "не становясь уязвимыми."
    ],
    [
      "מייל רגיל אינו כספת. מידע רגיש נשלח רק לאחר תיאום ערוץ מתאים ורק כאשר הוא הכרחי.",
      "Обычная почта — не сейф. Чувствительную информацию следует отправлять только после согласования подходящего канала и только когда это необходимо."
    ],
    [
      "יש דבר אמיתי לבנות?",
      "Есть что-то реальное, что стоит построить?"
    ],
    [
      "בואו נתחיל נכון.",
      "Начнём правильно."
    ]
  ],
  "ar": [
    [
      "נולדתי בחרקוב, גדלתי בחולון, עברתי דרך שירות, משטרה, אבהות ויצירה. היום אני בונה חיבורים בין אנשים, טכנולוגיה והזדמנות — ומשאיר את המקורות פתוחים.",
      "وُلدت في خاركيف، وكبرت في حولون، ومررت بالخدمة والشرطة والأبوة والإبداع. اليوم أبني روابط بين الناس والتكنولوجيا والفرص — مع إبقاء المصادر مفتوحة."
    ],
    [
      "כל צילום ורגע באתר מובילים לפרסום או למקור שממנו הגיעו.",
      "كل صورة ولحظة في الموقع تقود إلى المنشور أو المصدر الذي جاءت منه."
    ],
    [
      "בלי שפה של ארגון גדול: אדם אחד, מסלול לא ישר, ועשייה שאפשר לראות ולבדוק.",
      "من دون لغة المؤسسات الكبيرة: شخص واحد، مسار غير خطي، وعمل يمكن رؤيته والتحقق منه."
    ],
    [
      "העיקרון שמוביל את 7YA",
      "المبدأ الذي يقود 7YA"
    ],
    [
      "להכיר אותי מעבר לכותרת",
      "تعرّف إليّ أبعد من العنوان"
    ],
    [
      "לא מחכים ל״גרסה הבאה של האתר״. כאן המדיה מהפרסום עצמו מגיעה לפני ההסבר — וכל כרטיס נשאר מחובר למקור.",
      "لا ننتظر «النسخة التالية من الموقع». هنا تأتي الوسائط من المنشور الأصلي قبل الشرح، وتبقى كل بطاقة مرتبطة بمصدرها."
    ],
    [
      "המאגר שומר את הדרך מ־2011 ועד היום. כאן מקבלים טעימה מהרגעים שבהם אפשר לראות גם את מה שהקהל עשה עם התוכן — צפיות, תגובות, שיתופים והפצה מעבר לחשבון שלי.",
      "يحفظ الأرشيف المسار من عام 2011 حتى اليوم. هنا يمكن رؤية ما فعله الجمهور بالمحتوى أيضاً — مشاهدات وتعليقات ومشاركات وانتشاراً خارج حسابي."
    ],
    [
      "רשומות ציבוריות במאגר החיים · 170 מהן כבר מחוברות למדד מספרי",
      "سجلاً عاماً في أرشيف الحياة · 170 منها مرتبط بالفعل بمؤشر رقمي"
    ],
    [
      "המספרים אינם מחוברים ל״מספר השפעה״ אחד. כל מדד נשאר קשור לפרסום, לפלטפורמה ולנקודת הזמן שלו.",
      "لا تُدمج الأرقام في «رقم تأثير» واحد. يبقى كل مؤشر مرتبطاً بالمنشور والمنصة والتاريخ."
    ],
    [
      "כאן רואים",
      "هنا يمكن رؤية"
    ],
    [
      "איך רגע הופך למסלול.",
      "كيف تتحول لحظة إلى مسار."
    ],
    [
      "לא טיימליין של תפקידים. אלה שישה אשכולות שבהם אפשר לפתוח את המקור, לראות את ההפצה והתגובה, ואז לעבור לפרק הבא שנשאר מתועד. כשאין הוכחה לקשר סיבתי — אני לא ממציא אחד.",
      "هذا ليس خطاً زمنياً للمناصب. إنها ست مجموعات يمكن فيها فتح المصدر ورؤية الانتشار والاستجابة ثم الانتقال إلى الفصل التالي الموثق. عندما لا تكون السببية مثبتة، لا أختلقها."
    ],
    [
      "הנתונים מוצגים לפי המקור ונקודת הזמן שלהם. הפצה חיצונית נשארת מסומנת כחיצונית, ומספרים מפלטפורמות שונות אינם מחוברים לסכום אחד.",
      "تبقى البيانات مرتبطة بمصدرها وتاريخها. يظل الانتشار الخارجي موسوماً بوضوح، ولا تُجمع أرقام المنصات المختلفة في مجموع واحد."
    ],
    [
      "לא קורות חיים.",
      "ليست سيرة ذاتية."
    ],
    [
      "חיים עם הקשר.",
      "حياة مع سياق."
    ],
    [
      "במקום רשימת תפקידים, הנה הרגעים ששינו כיוון — והפרסומים שמאפשרים להכיר אותם מקרוב.",
      "بدلاً من قائمة المناصب، هذه هي اللحظات التي غيّرت الاتجاه — والمنشورات التي تتيح فحصها عن قرب."
    ],
    [
      "לא תמונות אווירה.",
      "ليست صوراً للزينة."
    ],
    [
      "דברים שבאמת פרסמתי.",
      "أشياء نشرتها فعلاً."
    ],
    [
      "וידאו, שיחה ארוכה, מוזיקה, מסמך ציבורי ופוסט כתוב. כל כרטיס יוצא למקור; הפצה חיצונית מסומנת בנפרד מתוכן בבעלותי.",
      "فيديو، حوار طويل، موسيقى، وثيقة عامة ومنشورات مكتوبة. كل بطاقة تفتح المصدر؛ ويُفصل الانتشار الخارجي عن المحتوى الذي أملكه."
    ],
    [
      "לא כמה פוסטים.",
      "ليس عدد المنشورات."
    ],
    [
      "שנים של נוכחות.",
      "سنوات من الحضور."
    ],
    [
      "המספרים כאן הם מספרי רשומות מתועדות ב־Master Public Record — לא סכום צפיות ולא ניסיון לחבר מדדים שונים למספר אחד.",
      "هذه أعداد السجلات الموثقة في Master Public Record — وليست مجموع المشاهدات ولا محاولة لدمج مؤشرات مختلفة في رقم واحد."
    ],
    [
      "לא רק מה פרסמתי.",
      "ليس فقط ما نشرته."
    ],
    [
      "מה אנשים עשו עם זה.",
      "بل ما فعله الناس به."
    ],
    [
      "תגובות, שמירות, שיתופים והפצה מחוץ לחשבון. המדדים כאן קשורים למקור ולנקודת זמן — והפצה חיצונית מסומנת כהפצה חיצונית.",
      "تعليقات وحفظ ومشاركات وانتشار خارج الحساب. تبقى المؤشرات مرتبطة بمصدر وتاريخ، ويُوسم الانتشار الخارجي بوضوح على أنه خارجي."
    ],
    [
      "איגור ופרצקי.",
      "إيغور فيبريتسكي."
    ],
    [
      "לא טייטל. מסלול.",
      "ليس لقباً. بل مسار."
    ],
    [
      "נולדתי בחרקוב, גדלתי בישראל, עברתי דרך שירות, מערכות ציבוריות, אבהות, יצירה ויזמות חברתית. 7YA נבנתה כדי שהסיפור לא יישאר רשימת תפקידים — אלא יישאר מחובר לרגעים, למקורות ולמה שאני בונה היום.",
      "وُلدت في خاركيف، وكبرت في إسرائيل، ومررت بالخدمة والأنظمة العامة والأبوة والإبداع وريادة الأعمال الاجتماعية. بُنيت 7YA كي لا تتحول القصة إلى قائمة من المناصب، بل تبقى مرتبطة باللحظات والمصادر وما أبنيه اليوم."
    ],
    [
      "למדיה המקורית",
      "الإعلام الأصلي"
    ],
    [
      "לצפייה בראיות",
      "عرض الأدلة"
    ],
    [
      "לתיאום שיחה",
      "ابدأ حواراً"
    ],
    [
      "האדם קודם. המערכת רק מארגנת.",
      "الإنسان أولاً. النظام ينظم فقط."
    ],
    [
      "הסיפור גם",
      "القصة أيضاً"
    ],
    [
      "נראה.",
      "مرئية."
    ],
    [
      "דיוקנאות, ראיונות, וידאו, StartOn ומוזיקה — פריטים אמיתיים שנפתחים למקור.",
      "صور شخصية ومقابلات وفيديو وStartOn وموسيقى — مواد حقيقية تفتح على مصادرها."
    ],
    [
      "אני לא רוצה אתר שיגיד שהכול היה מסודר.",
      "لا أريد موقعاً يدّعي أن كل شيء كان مرتباً."
    ],
    [
      "הוא לא היה.",
      "لم يكن كذلك."
    ],
    [
      "אני רוצה מקום שאפשר לראות בו איך רגע אחד התחבר לבא אחריו — ומה עשיתי עם מה שלמדתי.",
      "أريد مكاناً يمكن فيه رؤية كيف اتصلت لحظة بما بعدها — وماذا فعلت بما تعلمته."
    ],
    [
      "תחנות שונות.",
      "محطات مختلفة."
    ],
    [
      "אותה שאלה.",
      "السؤال نفسه."
    ],
    [
      "מה גורם לאדם להרגיש שיש לו מקום — ואיך מערכת יכולה לפתוח דלת במקום לסגור אותה?",
      "ما الذي يجعل الإنسان يشعر بأن له مكاناً — وكيف يمكن للنظام أن يفتح باباً بدلاً من إغلاقه؟"
    ],
    [
      "מה אני בונה",
      "ما أبنيه"
    ],
    [
      "עכשיו.",
      "الآن."
    ],
    [
      "שלושה נתיבים שונים: משימה חברתית, מערכת זיכרון ומחקר/כתיבה. הם מתחברים — אבל לא מתערבבים.",
      "ثلاثة مسارات مختلفة: مهمة اجتماعية، ونظام ذاكرة، وبحث/كتابة. تتصل ببعضها من دون أن تختلط."
    ],
    [
      "אותו אדם.",
      "الإنسان نفسه."
    ],
    [
      "כמה חלונות.",
      "نوافذ متعددة."
    ],
    [
      "החשבונות אינם ״ערוצים שיווקיים״ באתר. כל אחד מחזיק שכבה אחרת של אותו ארכיון חי.",
      "الحسابات ليست «قنوات تسويق» في الموقع. كل واحد منها يحمل طبقة مختلفة من الأرشيف الحي نفسه."
    ],
    [
      "העמוד הזה הוא רק הציר.",
      "هذه الصفحة هي العمود الفقري فقط."
    ],
    [
      "המקורות נמצאים מסביבו.",
      "المصادر موجودة حولها."
    ],
    [
      "לא באתי לבנות",
      "لم آتِ لأبني"
    ],
    [
      "תדמית.",
      "صورة."
    ],
    [
      "באתי לבנות מסלול.",
      "أتيت لأبني مساراً."
    ],
    [
      "אני איגור ופרצקי.",
      "أنا إيغور فيبريتسكي."
    ],
    [
      "הסיפור שלי אינו קו ישר ואינו אוסף תארים. הוא חיבור בין הגירה ושייכות, חיים בלי גב מובן מאליו, שירות ואחריות, אבהות, מוזיקה, StartOn ובניית מערכת ציבורית שאפשר לבדוק.",
      "قصتي ليست خطاً مستقيماً ولا مجموعة ألقاب. إنها تصل بين الهجرة والانتماء، والحياة من دون شبكة أمان واضحة، والخدمة والمسؤولية، والأبوة، والموسيقى، وStartOn، وبناء نظام عام يمكن التحقق منه."
    ],
    [
      "לפתוח את שבעת הפרקים",
      "افتح الفصول السبعة"
    ],
    [
      "לראות את העבודה",
      "شاهد العمل"
    ],
    [
      "לבדוק את המקורות",
      "تحقق من المصادر"
    ],
    [
      "העמוד משלב חומר אישי, מקורות ציבוריים ונתוני אינדקס. טענה שאין לה מקור אינה מוצגת כהישג מאומת.",
      "تجمع الصفحة بين مواد شخصية ومصادر عامة وبيانات فهرس. أي ادعاء بلا مصدر لا يُعرض كإنجاز موثق."
    ],
    [
      "שבעה פרקים. לא שבע סיסמאות.",
      "سبعة فصول. لا سبعة شعارات."
    ],
    [
      "הסיפור החזותי אינו קישוט. הוא מסביר מאיפה באתי, מה המערכת לימדה אותי, ומה אני מנסה לבנות עבור אנשים שלא תמיד רואים אותם בזמן.",
      "القصة البصرية ليست زينة. إنها تشرح من أين أتيت، وما الذي علمتني إياه الأنظمة، وما الذي أحاول بناءه لأشخاص لا يُرون دائماً في الوقت المناسب."
    ],
    [
      "הפרק הבא לא ייכתב לבד.",
      "الفصل التالي لن يكتب نفسه."
    ],
    [
      "שותפות ל־StartOn, ראיון, הרצאה, יצירה, מערכת ציבורית או תיקון ראיה — מתחילים בשיחה ברורה ובאחריות על העובדות.",
      "شراكة مع StartOn أو مقابلة أو محاضرة أو مشروع إبداعي أو نظام عام أو تصحيح دليل تبدأ بحوار واضح ومسؤولية عن الحقائق."
    ],
    [
      "לחזור לשכונה.",
      "العودة إلى الحي."
    ],
    [
      "לבנות התחלה.",
      "بناء بداية."
    ],
    [
      "StartOn נולדה מהחיבור בין מסלול אישי לשאלה ציבורית: איך בונים לצעירים מקום שהם רוצים להיכנס אליו — ואז מחברים אותו לטכנולוגיה, יצירה, אנשים ושייכות.",
      "وُلدت StartOn من الربط بين مسار شخصي وسؤال عام: كيف نبني للشباب مكاناً يريدون دخوله، ثم نربطه بالتكنولوجيا والإبداع والناس والانتماء؟"
    ],
    [
      "לתמיכה בפיילוט",
      "ادعم التجربة"
    ],
    [
      "למקורות",
      "المصادر"
    ],
    [
      "למודל",
      "النموذج"
    ],
    [
      "טכנולוגיה היא לא ההתערבות.",
      "التكنولوجيا ليست التدخل بحد ذاته."
    ],
    [
      "היא הדלת. מה שקורה אחרי שנכנסים — קשר, קהילה, גבולות, למידה והמשכיות — הוא המבחן.",
      "إنها الباب. الاختبار الحقيقي هو ما يحدث بعد الدخول: العلاقة والمجتمع والحدود والتعلم والاستمرارية."
    ],
    [
      "לפני החזון הגדול —",
      "قبل الرؤية الكبرى —"
    ],
    [
      "המקורות.",
      "المصادر."
    ],
    [
      "האתר לא צריך לבקש שתאמינו לסיפור. אפשר לפתוח את המסמך, הכתבה, הווידאו והרפלקציה ולראות איך הרעיון השתנה לאורך הזמן.",
      "لا ينبغي للموقع أن يطلب منكم تصديق القصة. يمكن فتح الوثيقة والمقال والفيديو والتأمل ورؤية كيف تغيرت الفكرة مع الوقت."
    ],
    [
      "חמישה רכיבים.",
      "خمسة مكونات."
    ],
    [
      "מסלול אנושי אחד.",
      "مسار إنساني واحد."
    ],
    [
      "הרכיבים הם מודל עבודה — לא טענה שכל אחד מהם כבר פועל בכל אתר. סטטוס אמיתי קודם למצגת.",
      "المكونات نموذج عمل — وليست ادعاء بأن كل عنصر يعمل بالفعل في كل موقع. الحالة الفعلية تسبق العرض."
    ],
    [
      "מה ידוע.",
      "ما هو معروف."
    ],
    [
      "ומה עוד לא.",
      "وما لم يُعرف بعد."
    ],
    [
      "ההבחנה חשובה יותר מעיצוב יפה: רעיון, מסמך, פיילוט ותוצאה אינם אותו דבר.",
      "التمييز أهم من التصميم الجميل: الفكرة والوثيقة والتجربة والنتيجة ليست الشيء نفسه."
    ],
    [
      "StartOn לא צריכה עוד סיסמה.",
      "StartOn لا تحتاج شعاراً آخر."
    ],
    [
      "היא צריכה מקום, אנשים, מדידה ושותפים נכונים.",
      "إنها تحتاج مكاناً وناساً وقياساً وشركاء مناسبين."
    ],
    [
      "לא ערכת מדיה.",
      "ليست حزمة إعلامية."
    ],
    [
      "המדיה עצמה.",
      "بل الإعلام نفسه."
    ],
    [
      "כתבות, ראיונות טלוויזיה, פודקאסטים, וידאו, מוזיקה וכתיבה שפורסמו באמת — מהפרופיל העיתונאי המוקדם ב־2011 ועד השיחות הארוכות והפרסומים העדכניים. כל פריט מוביל למקור; mirrors והפצה חיצונית מסומנים בנפרד.",
      "مقالات ومقابلات تلفزيونية وبودكاست وفيديو وموسيقى وكتابة نُشرت فعلاً — من ملف صحفي مبكر في 2011 إلى الحوارات الطويلة والمنشورات الحديثة. كل مادة تقود إلى مصدرها؛ وتُوسم النسخ والانتشار الخارجي بشكل منفصل."
    ],
    [
      "ההשפעה שלי",
      "تأثيري العام"
    ],
    [
      "אינה מספר אחד.",
      "ليس رقماً واحداً."
    ],
    [
      "היא נבנתה לאורך שנים מפוסטים שאנשים העבירו הלאה, שיחות ציבוריות, כתיבה, מוזיקה, שירות, StartOn ותוכן בשלוש שפות. כאן אפשר לראות את הרצף — ולפתוח את המקור שמאחורי כל שכבה.",
      "بُني على مدى سنوات من منشورات تناقلها الناس، وحوارات عامة، وكتابة، وموسيقى، وخدمة، وStartOn، ومحتوى بثلاث لغات. هنا يمكن رؤية الاستمرارية وفتح المصدر خلف كل طبقة."
    ],
    [
      "מספרים עם תאריך.",
      "أرقام مع تاريخ."
    ],
    [
      "לא מספרים מהזיכרון.",
      "لا أرقام من الذاكرة."
    ],
    [
      "צילום מצב הוא נקודת מדידה, לא הבטחה נצחית. לכן כל מספר מוצג יחד עם ההקשר שלו ומוביל לארכיון שממנו הגיע.",
      "اللقطة هي نقطة قياس وليست وعداً دائماً. لذلك يظهر كل رقم مع سياقه ويقود إلى الأرشيف الذي جاء منه."
    ],
    [
      "הפלטפורמות מחלקות נראות.",
      "المنصات توزع الظهور."
    ],
    [
      "7YA שומרת זיכרון.",
      "7YA تحفظ الذاكرة."
    ],
    [
      "כל פלטפורמה נשארת המקור לפריט שלה. 7YA שומרת את הקישור, ההקשר ומדרג האימות כדי שהסיפור לא יהיה תלוי בפיד אחד.",
      "تبقى كل منصة مصدر مادتها. تحفظ 7YA الرابط والسياق ومستوى التحقق كي لا تعتمد القصة على خلاصة واحدة."
    ],
    [
      "לא תיקייה.",
      "ليست مجلداً."
    ],
    [
      "זיכרון שאפשר לפתוח.",
      "ذاكرة يمكن فتحها."
    ],
    [
      "הספרייה מחברת בין רגע, מקור והקשר. היא לא מחליפה את YouTube, Instagram, Spotify או כתבה — היא מחזירה אותם לאותו סיפור.",
      "تربط المكتبة بين اللحظة والمصدر والسياق. لا تستبدل YouTube أو Instagram أو Spotify أو المقالة، بل تعيدها إلى القصة نفسها."
    ],
    [
      "לא רק לספר.",
      "ليس فقط أن نحكي."
    ],
    [
      "גם להראות.",
      "بل أن نُظهر أيضاً."
    ],
    [
      "7YA אינה מבקשת אמון עיוור.",
      "7YA لا تطلب ثقة عمياء."
    ],
    [
      "הארכיון מחבר כל טענה מרכזית למקור, הקשר וסטטוס ברור. חוסר הוכחה אינו מוסתר; תכנון אינו מוצג כתוצאה; מידע רגיש נשאר מחוץ למרחב הציבורי.",
      "يربط الأرشيف كل ادعاء رئيسي بمصدر وسياق وحالة واضحة. لا يُخفى غياب الدليل، ولا تُعرض الخطط كأنها نتائج، وتبقى المعلومات الحساسة خارج الطبقة العامة."
    ],
    [
      "מהחוויה",
      "من التجربة"
    ],
    [
      "למסגרת חשיבה.",
      "إلى إطار للتفكير."
    ],
    [
      "כאן נמצאים המנוסקריפטים, הפוסטים והרעיונות שאני מנסה לנסח: agency אנושי, זהות דיגיטלית, אמון, AI, מערכות ציבוריות והזדמנות. כל פריט מקבל סטטוס ברור — רעיון, working manuscript או מקור חיצוני.",
      "هنا توجد المخطوطات والمنشورات والأفكار التي أحاول صياغتها: الوكالة البشرية، والهوية الرقمية، والثقة، والذكاء الاصطناعي، والأنظمة العامة، والفرص. تحصل كل مادة على حالة واضحة — فكرة أو مخطوط عمل أو مصدر خارجي."
    ],
    [
      "ביטחון.",
      "الأمن."
    ],
    [
      "אמון ציבורי.",
      "الثقة العامة."
    ],
    [
      "איגור ופרצקי זמין להרצאות, פאנלים, פודקאסטים וראיונות בנושאי AI, ביטחון ציבורי, Civic Tech, נוער, StartOn, דיגיטל, ראיות והשפעה ציבורית. הזווית שלו אינה תיאורטית בלבד: היא מגיעה מהשטח — שירות, מודיעין, ביטחון, עיר, יזמות חברתית ובניית מערכת 7YA.",
      "إيغور فيبريتسكي متاح للمحاضرات والحوارات والبودكاست والمقابلات حول الذكاء الاصطناعي، والأمن العام، وCivic Tech، والشباب، وStartOn، والأنظمة الرقمية، والأدلة، والتأثير العام. منظوره ليس نظرياً فقط؛ بل يأتي من الميدان — الخدمة والاستخبارات والأمن والعمل البلدي وريادة الأعمال الاجتماعية وبناء 7YA."
    ],
    [
      "פנייה להזמנה",
      "طلب استضافة"
    ],
    [
      "נושאי הרצאה",
      "موضوعات المحاضرات"
    ],
    [
      "בדיקת מקורות",
      "تحقق من المصادر"
    ],
    [
      "לא לשלוח “היי”.",
      "لا ترسل مجرد «مرحباً»."
    ],
    [
      "להתחיל משהו.",
      "ابدأ شيئاً."
    ],
    [
      "שיחה טובה מתחילה בהקשר ברור: מי אתם, מה אתם רוצים לבנות, למה זה חשוב עכשיו ומה יכולה להיות הפעולה הבאה. הפנייה הרשמית לכל תחומי העשייה עוברת דרך כתובת אחת.",
      "يبدأ الحوار الجيد بسياق واضح: من أنتم، وما الذي تريدون بناءه، ولماذا يهم الآن، وما الخطوة التالية الممكنة. عنوان رسمي واحد يستقبل جميع مجالات التواصل."
    ],
    [
      "המערכת מנתבת. האדם מחליט.",
      "النظام يوجّه. الإنسان يقرر."
    ],
    [
      "שש דרכי פנייה.",
      "ست طرق للتواصل."
    ],
    [
      "כתובת אחת.",
      "عنوان واحد."
    ],
    [
      "בחירת הנושא אינה בירוקרטיה. היא מאפשרת להבין מהר את ההקשר, לשמור על פרטיות ולהגיע לפעולה מתאימה.",
      "اختيار الموضوع ليس بيروقراطية. إنه يساعد على فهم السياق بسرعة، وحماية الخصوصية، والوصول إلى الإجراء المناسب."
    ],
    [
      "ארבעה פרטים",
      "أربع تفاصيل"
    ],
    [
      "שחוסכים עשרה מיילים.",
      "توفر عشرة رسائل بريد."
    ],
    [
      "אין צורך במצגת ארוכה. הודעה מדויקת מאפשרת להבין מהר אם קיימת התאמה ומה הצעד הבא.",
      "لا حاجة إلى عرض طويل. رسالة دقيقة تساعد على فهم مدى الملاءمة والخطوة التالية بسرعة."
    ],
    [
      "אפשר להיות פתוחים",
      "يمكن أن نكون منفتحين"
    ],
    [
      "בלי להיות חשופים.",
      "من دون أن نكون مكشوفين."
    ],
    [
      "מייל רגיל אינו כספת. מידע רגיש נשלח רק לאחר תיאום ערוץ מתאים ורק כאשר הוא הכרחי.",
      "البريد العادي ليس خزنة. تُرسل المعلومات الحساسة فقط بعد الاتفاق على قناة مناسبة وفقط عندما تكون ضرورية."
    ],
    [
      "יש דבר אמיתי לבנות?",
      "هل هناك شيء حقيقي يستحق البناء؟"
    ],
    [
      "בואו נתחיל נכון.",
      "لنبدأ بالطريقة الصحيحة."
    ]
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

function canonicalRoute(route='') {
  const target=aliasRoutes.get(route);
  if(!target)return route;
  try{return new URL(target,'https://7ya.io/').pathname.replace(/^\/+|\/+$/g,'')}
  catch{return route}
}

function canonicalHref(locale,route='') {
  const target=aliasRoutes.get(route);
  return target ? 'https://7ya.io'+localizedInternalPath(target,locale) : 'https://7ya.io'+routePath(locale,route);
}

function routePath(locale, route='') {
  const normalized=route.replace(/^\/+|\/+$/g,'');
  const suffix = normalized ? normalized + '/' : '';
  return locale === 'he' ? '/' + suffix : '/' + locale + '/' + suffix;
}

function languageNav(locale, route) {
  const activeRoute=canonicalRoute(route);
  const c = locale === 'he' ? {nav:'ניווט ראשי',home:'ראשי',story:'הסיפור',feed:'הפיד',source:'מקור',evidence:'ראיות',journey:'המסע',contact:'דברו איתי'} : localeCopy[locale];
  const links = [
    ['home',''],['story','igor-vepretski'],['feed','influence'],['source','library'],['evidence','evidence'],['journey','journey']
  ].map(([key,target])=>'<a href="'+routePath(locale,target)+'">'+c[key]+'</a>').join('');
  const languages = allLocales.map(lang=>{
    const labels={he:'עברית',en:'EN',ru:'RU',ar:'العربية'};
    return '<a href="'+routePath(lang,activeRoute)+'" lang="'+lang+'" dir="'+dirFor(lang)+'"'+(lang===locale?' aria-current="true"':'')+'>'+labels[lang]+'</a>';
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

function localizedInternalPath(value, locale) {
  let url; try{url=new URL(value,'https://7ya.io/')}catch{return value}
  if(url.hostname!=='7ya.io')return value;
  const pathname=url.pathname;
  const assetLike=/\.[a-z0-9]{1,8}$/i.test(pathname)||/^\/(assets|styles|scripts|api|data|knowledge)\//.test(pathname)||['/favicon.svg','/site.webmanifest','/sw.js','/service-worker.js','/robots.txt','/sitemap.xml'].includes(pathname);
  if(assetLike)return pathname+url.search+url.hash;
  const parts=pathname.split('/').filter(Boolean);
  if(generatedLocaleRoots.includes(parts[0]))parts.shift();
  const base='/' + (parts.length?parts.join('/')+'/':'');
  return (locale==='he'?base:'/'+locale+(base==='/'?'/':base))+url.search+url.hash;
}

function rewriteSameHostReferences(html, locale, originalRoute) {
  if (locale==='he') return html;
  const pageBase='https://7ya.io/'+(originalRoute?originalRoute.replace(/^\/+|\/+$/g,'')+'/':'');
  let next=html.replace(/\b(href|src|action)=(["'])([^"']+)\2/gi,(match,attr,quote,ref)=>{
    if (!ref || ref.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(ref)) return match;
    let url; try{url=new URL(ref,pageBase)}catch{return match}
    if (url.hostname!=='7ya.io') return match;
    return attr+'='+quote+localizedInternalPath(url.href,locale)+quote;
  });
  next=next.replace(/(<meta\b[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*?url=)([^"' >]+)([^"']*["'][^>]*>)/gi,
    (_match,before,target,after)=>before+localizedInternalPath(target,locale)+after);
  next=next.replace(/location\.replace\((["'])(\/[^"']*)\1\s*\+\s*location\.search\s*\+\s*location\.hash\)/g,
    (_match,quote,target)=>'location.replace('+quote+localizedInternalPath(target,locale)+quote+'+location.search+location.hash)');
  return next;
}
function replaceVisibleCopy(html, locale) {
  if(locale==='he')return html;
  const translations=new Map([...commonTranslations[locale],...coreNarrativeTranslations[locale],...Object.entries(technicalTranslations[locale])]);
  const protectedBlocks=[];
  let next=html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi,block=>{
    const token='__7YA_LOCALE_PROTECTED_'+protectedBlocks.length+'__';
    protectedBlocks.push(block);
    return token;
  });
  next=next.replace(/>([^<]+)</g,(match,text)=>{
    const leading=text.match(/^\s*/)?.[0]||'';
    const trailing=text.match(/\s*$/)?.[0]||'';
    const core=text.trim();
    return translations.has(core) ? '>'+leading+translations.get(core)+trailing+'<' : match;
  });
  return next.replace(/__7YA_LOCALE_PROTECTED_(\d+)__/g,(_match,index)=>protectedBlocks[Number(index)]||'');
}
function localizeJsonLd(html,locale,route,meta){
  if(locale==='he')return html;
  const pageCanonical=canonicalHref(locale,route);
  const pageTypes=new Set(['WebPage','ProfilePage','ContactPage','CollectionPage','AboutPage','ItemPage']);
  return html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi,(match,attrs,body)=>{
    try{
      const data=JSON.parse(body);
      const walk=value=>{
        if(Array.isArray(value)){value.forEach(walk);return}
        if(!value||typeof value!=='object')return;
        const types=Array.isArray(value['@type'])?value['@type']:[value['@type']].filter(Boolean);
        const pageLike=types.some(type=>pageTypes.has(type));
        if(pageLike){
          const oldId=typeof value['@id']==='string'?value['@id']:'';
          if(typeof value.url==='string'&&value.url.startsWith('https://7ya.io/'))value.url=pageCanonical;
          if(oldId.startsWith('https://7ya.io/')){
            const fragment=oldId.includes('#')?'#'+oldId.split('#').slice(1).join('#'):'';
            value['@id']=pageCanonical.replace(/#.*$/,'')+fragment;
          }
          value.inLanguage=locale;
          if(meta){
            if('name' in value)value.name=meta.title;
            if('description' in value)value.description=meta.description;
          }
        }
        for(const item of Object.values(value))if(item&&typeof item==='object')walk(item);
      };
      walk(data);
      return '<script'+attrs+'>'+JSON.stringify(data)+'</script>';
    }catch{return match}
  });
}
function setMetadata(html, locale, route) {
  const resolvedRoute=canonicalRoute(route);
  const canonical=canonicalHref(locale,route);
  let next=html.replace(/<html\b[^>]*>/i,'<html lang="'+locale+'" dir="'+dirFor(locale)+'" data-7ya-locale="'+locale+'">');
  next=next.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gi,'');
  if(locale!=='he'){
    const meta=routeMeta(locale,route);
    next=next.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+esc(meta.title)+'</title>');
    next=next.replace(/<meta\s+name=["']description["'][^>]*>/i,'<meta name="description" content="'+esc(meta.description)+'">');
    next=next.replace(/<meta\s+property=["']og:title["'][^>]*>/i,'<meta property="og:title" content="'+esc(meta.title)+'">');
    next=next.replace(/<meta\s+property=["']og:description["'][^>]*>/i,'<meta property="og:description" content="'+esc(meta.description)+'">');
    next=next.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i,'<meta name="twitter:title" content="'+esc(meta.title)+'">');
    next=next.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i,'<meta name="twitter:description" content="'+esc(meta.description)+'">');
    next=next.replace(/<meta\s+property=["']og:url["'][^>]*>/i,'<meta property="og:url" content="'+canonical+'">');
    next=next.replace(/<meta\s+property=["']og:locale["'][^>]*>/i,'<meta property="og:locale" content="'+(locale==='ru'?'ru_RU':locale==='ar'?'ar_IL':'en_US')+'">');
  }
  if(/<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(next))next=next.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i,'<link rel="canonical" href="'+canonical+'">');
  else next=next.replace('</head>','  <link rel="canonical" href="'+canonical+'">\n</head>');
  const alternates=allLocales.map(lang=>'  <link rel="alternate" hreflang="'+lang+'" href="'+canonicalHref(lang,route)+'">').join('\n')+'\n  <link rel="alternate" hreflang="x-default" href="'+canonicalHref('he',route)+'">';
  next=next.replace('</head>',alternates+'\n</head>');
  const localizedMeta=locale==='he'?null:routeMeta(locale,resolvedRoute);
  return localizeJsonLd(next,locale,resolvedRoute,localizedMeta);
}

function addShellAssets(html) {
  let next=html;
  const headAssets=[];
  if(!next.includes('locale-shell-20260919.css'))headAssets.push('<link rel="stylesheet" href="/styles/locale-shell-20260919.css?v=2">');
  if(!next.includes('locale-runtime-20260919.js'))headAssets.push('<script src="/scripts/locale-runtime-20260919.js?v=2" defer></script>');
  if(headAssets.length)next=next.replace('</head>','  '+headAssets.join('\n  ')+'\n</head>');
  return next;
}

function contextMarkup(locale, route) {
  if(locale==='he')return '';
  const resolvedRoute=canonicalRoute(route);
  const c=localeCopy[locale], name=routeNames[resolvedRoute]?.[locale]||routeNames[''][locale];
  return '<aside class="locale-context" data-locale-context><strong>'+esc(name)+'</strong><p>'+c.context+'</p><small>'+c.sourceNote+'</small></aside>';
}

function applyLocale(html, locale, route) {
  let next=html;
  if(locale!=='he'&&aliasRoutes.has(route)){
    const target=aliasRoutes.get(route);
    next=next.split(target).join(localizedInternalPath(target,locale));
  }
  next=rewriteSameHostReferences(next,locale,route);
  next=stampBuildDate(next,locale);
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
      urls.push('  <url><loc>https://7ya.io'+routePath(locale,route)+'</loc><lastmod>${buildDateIso}</lastmod>'+alternates+xdefault+'</url>');
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
