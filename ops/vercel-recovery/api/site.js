const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '..', 'release-manifest.json');
const PORTRAIT = 'https://raw.githubusercontent.com/7guard-io/7ya.io/2c7b7e092bc593f29322efe5104af0d44ffbaec9/assets/igor-home-portrait-20260712.jpg';
const RELEASE = '2026-07-14.7-direct-runtime';

const PAGES = {
  '/': {
    title: 'איגור ופרצקי | 7YA — כל העשייה הציבורית',
    description: 'Creatorverse ציבורי של איגור ופרצקי: StartOn, שירות ציבורי, מערכות 7YA, ראיות, מדיה, מוזיקה, הרצאות ו-AI.',
    eyebrow: 'IGOR VEPRETSKI · CREATORVERSE · HUMAN FIRST',
    heading: 'כל מה שבניתי.\nבמקום אחד.',
    lead: 'מסע חיים, שירות, StartOn, מערכות דיגיטליות, מדיה, מוזיקה ובינה מלאכותית — עם סטטוס ראיה ברור לכל טענה.',
    items: [
      ['DOCUMENTED', 'StartOn', 'מרחבי טכנולוגיה, יצירה ושייכות לנוער.', '/starton/'],
      ['BUILT', '7YA Systems', 'זהות ציבורית, Evidence Wall, AI Guide, Radar ו-Provenance.', '/systems/'],
      ['SELF-ATTESTED', 'שירות ציבורי', 'צה״ל, אבטחה, משטרה ושירות מוניציפלי — ללא מידע מבצעי.', '/public-service/'],
      ['ARCHIVE', 'מדיה והשפעה', 'וידאו, כתיבה ושיחה רב-לשונית עם קהלים.', '/influence/'],
      ['ARCHIVE', 'מוזיקה', 'יצירה, זהות ושיתופי פעולה ללא המצאת מדדים או קרדיטים.', '/music/'],
      ['PUBLIC', 'במה ותקשורת', 'הרצאות, פאנלים, ראיונות ופודקאסטים.', '/speaker/'],
      ['GOVERNED', 'Evidence First', 'מאומת, מתועד, תיאור עצמי, תכנון או פרטי.', '/evidence/'],
      ['BUILT', '7YA AI', 'מדריך ציבורי עם fallback מקומי וגבולות נגד המצאת טענות.', '/talk/'],
      ['GOVERNED', 'Government Radar', 'הפרדה בין כוונה, החלטה, הקצאה, ביצוע ותוצאה.', '/radar/'],
    ],
  },
  '/igor-vepretski/': {
    title: 'איגור ופרצקי | זהות ציבורית רשמית | 7YA',
    description: 'הפרופיל הציבורי הרשמי של איגור ופרצקי.',
    eyebrow: 'OFFICIAL PUBLIC IDENTITY',
    heading: 'איגור ופרצקי.',
    lead: 'יזם חברתי, יוצר ובונה מערכות ציבוריות. החיבור בין ניסיון חיים, שירות, טכנולוגיה ותרבות הוא הבסיס ל-StartOn ול-7YA.',
    items: [
      ['DOCUMENTED', 'StartOn', 'חזון חברתי-טכנולוגי למרחבים מקדמי הזדמנות לנוער.', '/starton/'],
      ['BUILT', '7YA.IO', 'בית ציבורי לראיות, תוכן, זהות, AI וארכיון.', '/systems/'],
      ['SELF-ATTESTED', 'Public safety background', 'שירות ציבורי וביטחוני ללא חשיפת מידע רגיש.', '/public-service/'],
      ['SELF-ATTESTED', 'B.A. Criminology', 'רקע אקדמי בקרימינולוגיה; ממתין להצמדת מקור ישיר.', '/evidence/'],
      ['ARCHIVE', 'Creator', 'וידאו, מוזיקה, כתיבה ושפה ציבורית.', '/influence/'],
      ['PUBLIC', 'Speaker', 'נוער, אמון ציבורי, השפעה ו-AI Human First.', '/speaker/'],
    ],
  },
  '/journey/': {
    title: 'המסע של איגור ופרצקי | 7YA',
    description: 'מחרקיב לישראל, משכונות ילדות לשירות ציבורי, מיצירה ל-StartOn ול-7YA.',
    eyebrow: 'LIFE JOURNEY',
    heading: 'שורשים. שירות. בנייה.',
    lead: 'המסע מוצג כהקשר אנושי, לא כמיתולוגיה. מידע משפחתי, רגיש או מבצעי נשאר מחוץ לאתר.',
    items: [
      ['SELF-ATTESTED', '1990–1993 · חרקיב → ישראל', 'נולד בחרקיב ועלה לישראל בגיל שלוש.', null],
      ['SELF-ATTESTED', 'בת ים, חולון וג׳סי כהן', 'ילדות של הגירה, קושי, שייכות וחיפוש אחר מסגרת.', null],
      ['SELF-ATTESTED', 'צה״ל ואבטחה דיפלומטית', 'שירות ואחריות; ללא פרטים מבצעיים.', '/public-service/'],
      ['SELF-ATTESTED', 'משטרת ישראל · 2015–2021', 'רקע במודיעין ובעבודת שטח.', '/public-service/'],
      ['SELF-ATTESTED', 'שירות מוניציפלי · 2023–2025', 'ניהול תחום ביטחון ופיקוח בחופים בהרצליה.', '/public-service/'],
      ['DOCUMENTED', 'NOW · StartOn + 7YA', 'מעבר מביצוע בתוך מערכות לבנייה של מערכות חדשות.', '/work/'],
    ],
  },
  '/work/': {
    title: 'מפת העשייה הציבורית | Igor Vepretski',
    description: 'מפת העשייה של איגור ופרצקי: StartOn, 7YA, Evidence, AI, שירות, מדיה, מוזיקה והרצאות.',
    eyebrow: 'THE COMPLETE PUBLIC WORK MAP',
    heading: 'לא רשימת תארים.\nמערכת של עשייה.',
    lead: 'כל פריט מסומן לפי מצבו. חזון, פיילוט ותכנון אינם מוצגים כתוצאה שהושלמה.',
    items: [
      ['MISSION', 'StartOn Creative Tech Hubs', 'Play, Learn, Belong, מנטורים, מדיה וטכנולוגיה.', '/starton/'],
      ['BUILT', '7YA Public Identity OS', 'זהות, מסע, עשייה, השפעה, במה וראיות במבנה קנוני.', '/systems/'],
      ['BUILT', 'Evidence Wall', 'סטטוס טענה, מקור, הקשר ותאריך.', '/evidence/'],
      ['PROTOTYPE', 'Evidence Oracle', 'Append-only ledger, canonical JSON, SHA-256, Merkle proofs ו-outbox.', '/systems/'],
      ['PUBLIC', 'Speaker & Media', 'הרצאות, פאנלים, ראיונות ופודקאסטים.', '/speaker/'],
      ['ARCHIVE', 'Music & Creative Work', 'מוזיקה, וידאו וכתיבה כחלק מזהות ציבורית רחבה.', '/music/'],
      ['PUBLIC', 'Social Influence Archive', 'תוכן ציבורי ללא מספרי חשיפה שאינם מגובים ב-snapshot.', '/influence/'],
      ['GOVERNED', 'Government & Impact Radar', 'כוונה, החלטה, הקצאה, ביצוע ותוצאה.', '/radar/'],
      ['RESERVED', '7YA Pass', 'נתיב שירות שמור שאינו תעודה או הרשאה מוסדית.', '/pass/'],
    ],
  },
  '/starton/': {
    title: 'StartOn | טכנולוגיה, שייכות והזדמנות',
    description: 'חזון חברתי-טכנולוגי למרחבים בטוחים ומקדמי הזדמנות לנוער.',
    eyebrow: 'STARTON · YOUTH · TECHNOLOGY · BELONGING',
    heading: 'טכנולוגיה כבית של הזדמנות.',
    lead: 'מחשבים, גיימינג, AI, מוזיקה ומדיה כדלת כניסה לשייכות, למידה, מנטורים ועתיד מקצועי.',
    items: [
      ['MODEL', 'Playroom', 'גיימינג, VR וסקרנות ככניסה בטוחה לקשר.', null],
      ['MODEL', 'Classroom', 'מחשבים, אוריינות דיגיטלית, AI ויצירה.', null],
      ['MODEL', 'Social Lounge', 'קהילה, מנטורים, ליווי ושייכות.', null],
      ['MODEL', 'Transparent Media Studio', 'פודקאסט, וידאו ומוזיקה עם קול, קרדיט ואחריות.', null],
      ['PILOT', '414 Media Labs', 'מסגרת פיילוט מוצעת להכשרה, הפקה והפצה.', null],
      ['DESIGN', 'StartOn Seeds', 'מדידה לא-רגישה וראיות מצטברות תוך שמירת פרטיות.', '/systems/'],
    ],
  },
  '/systems/': {
    title: '7YA Systems | מערכות ציבוריות מבוססות ראיות',
    description: 'Evidence Wall, Oracle, Radar, Pass, AI Guide, Seeds ו-Release Provenance.',
    eyebrow: '7YA SYSTEMS · PROVENANCE · PUBLIC TRUST',
    heading: 'מערכות שזוכרות מה באמת קרה.',
    lead: 'המטרה אינה להישמע משכנע יותר — אלא להיות ניתן לבדיקה, תיקון והוכחה.',
    items: [
      ['BUILT', 'Public Identity OS', 'מפת זהות, מסע, עשייה, השפעה ובמה.', '/igor-vepretski/'],
      ['BUILT', 'Evidence Wall', 'סטטוס טענה, מקור, תאריך והקשר.', '/evidence/'],
      ['PROTOTYPE', 'Evidence Oracle', 'Ledger, canonicalization, hashing, Merkle proofs ו-transactional outbox.', null],
      ['BUILT', '7YA AI Guide', 'מדריך עם fallback מקומי וגבולות נגד המצאה.', '/talk/'],
      ['GOVERNED', 'Government Radar', 'מעקב בין הצהרה לתוצאה.', '/radar/'],
      ['RESERVED', '7YA Pass', 'נתיב עתידי תחת Privacy Review ו-Threat Model.', '/pass/'],
      ['DESIGN', 'StartOn Seeds', 'אירועי התקדמות לא-רגישים ו-k-anonymity.', '/starton/'],
      ['BUILT', 'Release Provenance', 'SHA מלא וכשל סגור כאשר אין שיוך אמין.', '/release.json'],
    ],
  },
  '/public-service/': {
    title: 'שירות ציבורי וביטחון | איגור ופרצקי',
    description: 'רקע השירות הציבורי של איגור ופרצקי, ללא פרטים מבצעיים או מידע רגיש.',
    eyebrow: 'PUBLIC SERVICE · RESPONSIBILITY · FIELD EXPERIENCE',
    heading: 'ניסיון מהשטח.\nבלי לחשוף את השטח.',
    lead: 'עד להצמדת מסמכים ישירים, הפרטים מסומנים כתיאור עצמי ולא כאימות מוסדי.',
    items: [
      ['SELF-ATTESTED', 'IDF', 'שירות צבאי ביחידת סיור שריון; אין פירוט מבצעי.', null],
      ['SELF-ATTESTED', 'MFA Security', 'ניסיון באבטחת נציגות ישראלית בחו״ל.', null],
      ['SELF-ATTESTED', 'Israel Police · 2015–2021', 'עבודת מודיעין ושטח ללא חשיפת מקורות, שיטות או תיקים.', null],
      ['SELF-ATTESTED', 'B.A. Criminology', 'רקע אקדמי בקרימינולוגיה.', '/evidence/'],
      ['SELF-ATTESTED', 'Herzliya Municipality · 2023–2025', 'ניהול תחום ביטחון ופיקוח בחופים.', null],
      ['MISSION', 'Civil systems today', 'תרגום ניסיון השירות ל-StartOn, 7YA וכלי אמון ציבורי.', '/work/'],
    ],
  },
  '/evidence/': {
    title: 'Evidence Wall | 7YA',
    description: 'מה מאומת, מה מתועד, מה תיאור עצמי ומה עדיין בבדיקה.',
    eyebrow: 'EVIDENCE BEFORE AMPLIFICATION',
    heading: 'הארכיון הוא המוצר.',
    lead: 'חוסר הוכחה אינו מוסתר. כל טענה מקבלת סטטוס וכל תיקון משאיר עקבה.',
    items: [
      ['VERIFIED', 'מקור ציבורי ישיר', 'דומיין, קוד, מסמך או מקור רשמי שניתן לבדוק.', null],
      ['DOCUMENTED', 'תיעוד עם הקשר', 'רשומה מתוארכת, snapshot, export או ארכיון.', null],
      ['SELF-ATTESTED', 'תיאור עצמי', 'ביוגרפיה ציבורית שממתינה למקור מוסדי ישיר.', null],
      ['PENDING', 'ממתין לאימות', 'אינו מתקדם כעובדה עד שנמצא מקור מתאים.', null],
      ['PRIVATE', 'קיים אך אינו ציבורי', 'משפחה, קטינים, רפואה, כספים, משפט או מידע מבצעי.', null],
      ['REJECTED', 'לא יפורסם', 'טענה מנופחת, מקור לא אמין או מספר ללא snapshot.', null],
    ],
  },
  '/influence/': {
    title: 'השפעה ציבורית וארכיון מדיה | Igor Vepretski',
    description: 'וידאו, כתיבה, מוזיקה וערוצים ציבוריים עם משמעת מדידה.',
    eyebrow: 'PUBLIC INFLUENCE · MEDIA ARCHIVE',
    heading: 'לא רק צפיות.\nקשר לאורך זמן.',
    lead: 'קיום תוכן ציבורי אינו זהה להוכחת היקף או השפעה. מספרים דורשים snapshot או export.',
    items: [
      ['PUBLIC', 'Short-form video', 'TikTok, Instagram Reels ופורמטים קצרים.', '/social/'],
      ['PUBLIC', 'YouTube', 'וידאו, ארכיון ושיחות ארוכות יותר.', '/social/'],
      ['ARCHIVE', 'Writing', 'פוסטים, טורים ותוכן הסברתי בעברית, רוסית ואנגלית.', null],
      ['ARCHIVE', 'Music', 'שירים ושיתופי פעולה כחלק מהזהות היצירתית.', '/music/'],
      ['GOVERNED', 'Metrics discipline', 'צפיות ושיתופים מוצגים רק עם מקור מתוארך.', '/evidence/'],
      ['PUBLIC', 'Community dialogue', 'שיחה סביב שירות, חברה, נוער, תרבות ו-AI.', null],
    ],
  },
  '/music/': {
    title: 'מוזיקה ויצירה | Igor Vepretski',
    description: 'ארכיון היצירה המוזיקלית של איגור ופרצקי.',
    eyebrow: 'MUSIC · IDENTITY · CULTURE',
    heading: 'הקול הוא גם כלי ציבורי.',
    lead: 'המוזיקה היא חלק מהדרך שבה איגור מעבד זהות, הגירה, שאיפה וחיים בין עולמות.',
    items: [
      ['ARCHIVE_ENTRY', 'СупаПорп', 'יצירה שפורסמה; פרטי הפצה ומדדים יתווספו עם מקור ישיר.', null],
      ['ARCHIVE_ENTRY', 'BIZZI — Vepretski ft. NAWAN', 'שיתוף פעולה רב-לשוני; קישורי הפצה יתווספו לאחר אימות.', null],
      ['CREATIVE', 'Hip-hop identity', 'קצב, שפה וסיפור המחברים תרבות, קושי ושאיפה.', null],
      ['GOVERNED', 'Credits and rights', 'קרדיטים, זכויות והשמעות אינם מומצאים.', '/evidence/'],
    ],
  },
  '/speaker/': {
    title: 'איגור ופרצקי | הרצאות, פאנלים ותקשורת',
    description: 'נוער, אמון ציבורי, שירות, השפעה דיגיטלית ו-AI אחראי.',
    eyebrow: 'SPEAKER · MEDIA · PANELS',
    heading: 'לא הרצאה מהספר.\nשיחה מהשטח.',
    lead: 'ניסיון חיים, שירות, יזמות חברתית, יצירה, השפעה ומערכות AI Human First.',
    items: [
      ['TOPIC', 'נוער ושייכות', 'טכנולוגיה כדלת כניסה לקשר, מסוגלות ועתיד.', null],
      ['TOPIC', 'אמון ומנהיגות', 'מה שטח ואחריות מלמדים על מוסדות וציבור.', null],
      ['TOPIC', 'השפעה דיגיטלית', 'הפרדה בין reach, influence, trust ופעולה.', null],
      ['TOPIC', 'AI Human First', 'מערכות שמגדילות בהירות ואחריות במקום להחליף אדם.', null],
      ['FORMAT', 'ראיון או פודקאסט', 'שיחה פתוחה, רב-לשונית וישירה.', '/talk/'],
      ['FORMAT', 'פאנל או הרצאה', 'מבנה מותאם לקהל וסיום בפעולה אפשרית.', '/contact/'],
    ],
  },
  '/talk/': {
    title: '7YA AI & Talk | מדריך ציבורי',
    description: 'שאלו על איגור, StartOn, השירות, המערכות והראיות.',
    eyebrow: 'TALK · 7YA AI · PUBLIC GUIDE',
    heading: 'שאלו. בדקו.\nהמשיכו למקור.',
    lead: 'המערכת אינה איגור ואינה רשאית להמציא הישגים, מספרים, שותפים או תפקידים.',
    items: [
      ['AI', 'Public guide', 'מענה בעברית, רוסית או אנגלית עם הפניות.', null],
      ['BOUNDARY', 'Not Igor', 'אינו מתחזה לאיגור או מחליף תגובה רשמית.', null],
      ['BOUNDARY', 'No invented claims', 'אין המצאת שותפים, תפקידים, מספרים או תוצאות.', '/evidence/'],
      ['FALLBACK', 'Local guide', 'שכבת ניווט דטרמיניסטית גם ללא ספק AI חיצוני.', null],
    ],
  },
  '/social/': {
    title: 'Social Radar | הערוצים הציבוריים של איגור ופרצקי',
    description: 'מפת הערוצים וכללי האימות למדדי תוכן והשפעה.',
    eyebrow: 'SOCIAL RADAR · PUBLIC CHANNELS',
    heading: 'קישור מוכיח תוכן.\nלא היקף.',
    lead: 'מדדי צפייה, שיתוף והשפעה דורשים צילום מצב או יצוא פלטפורמה.',
    items: [
      ['CHANNEL', 'TikTok', '@igor.vepretski', null],
      ['CHANNEL', 'Instagram', '@igor.vepretski', null],
      ['CHANNEL', 'YouTube', '@IgorVepretski', null],
      ['CHANNEL', 'Facebook', '/vepretski', null],
      ['CHANNEL', 'X', '@igorvepretski', null],
      ['CHANNEL', 'Threads', '@igor.vepretski', null],
    ],
  },
  '/pass/': {
    title: '7YA Pass | נתיב שירות שמור',
    description: 'נתיב עתידי עם גבולות ברורים של זהות, הרשאה ופרטיות.',
    eyebrow: '7YA PASS · RESERVED SERVICE ROUTE',
    heading: 'נתיב קיים.\nסמכות עדיין לא.',
    lead: 'אינו תעודה, אימות ממשלתי, הרשאה מוסדית או מסמך זהות.',
    items: [
      ['LIVE', 'Reserved route', 'הנתיב נשמר למניעת פיצול עתידי.', null],
      ['BOUNDARY', 'No authority', 'אין סמכות מוסדית או משפטית.', null],
      ['REQUIRED', 'Privacy by design', 'אין השקה ללא צמצום נתונים, הרשאות ו-incident response.', null],
    ],
  },
  '/radar/': {
    title: '7YA Radar | כוונה, החלטה, ביצוע ותוצאה',
    description: 'הפרדה בין הצהרות, החלטות, תקציבים, ביצוע ותוצאות.',
    eyebrow: 'GOVERNMENT & IMPACT RADAR',
    heading: 'כוונה אינה תוצאה.',
    lead: 'הודעה, תקציב או הבטחה אינם מוצגים כאילו כבר שינו מציאות.',
    items: [
      ['INTENTION', 'כוונה והצהרה', 'מי אמר מה, מתי ובאיזה הקשר.', null],
      ['FORMAL', 'החלטה ואישור', 'האם התקבלה החלטה מוסמכת.', null],
      ['ALLOCATION', 'תקציב והקצאה', 'מה הוקצה בפועל.', null],
      ['EXECUTION', 'ביצוע', 'מה נרכש, נבנה, הופעל או נמסר.', null],
      ['OUTCOME', 'תוצאה', 'מה השתנה אצל אנשים, עם מדד ומקור.', null],
    ],
  },
  '/contact/': {
    title: 'יצירת קשר | Igor Vepretski, StartOn & 7YA',
    description: 'StartOn, תקשורת, הרצאות, שותפויות, טכנולוגיה ותיקוני ראיות.',
    eyebrow: 'OFFICIAL CONTACT',
    heading: 'מתחילים בשיחה ברורה.',
    lead: 'ערוץ הקשר הרשמי: hello@7ya.io.',
    items: [
      ['EMAIL', 'StartOn ושותפויות', 'עיריות, שותפים מקצועיים, תוכן, ציוד ופיילוטים.', null],
      ['EMAIL', 'תקשורת והרצאות', 'ראיונות, פודקאסטים, פאנלים והרצאות.', null],
      ['EMAIL', 'טכנולוגיה ו-7YA', 'מוצר, AI, Evidence, Data, Security ו-Hosting.', null],
      ['CORRECTION', 'תיקון ראיות', 'שלחו מקור ישיר, תאריך והסבר קצר.', '/evidence/'],
    ],
  },
};

const NAV = [
  ['/', 'בית'], ['/igor-vepretski/', 'איגור'], ['/work/', 'עשייה'],
  ['/starton/', 'StartOn'], ['/systems/', 'מערכות'], ['/evidence/', 'ראיות'],
  ['/speaker/', 'במה'], ['/contact/', 'קשר'],
];

const esc = (value) => String(value ?? '').replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function manifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { return {}; }
}
function sourceSha() {
  const m = manifest();
  return process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.SOURCE_SHA || process.env.RELEASE_SOURCE_SHA || m.source_sha || 'PROVENANCE_UNBOUND';
}
function normalize(raw) {
  let p = String(raw || '/').split('?')[0];
  if (!p.startsWith('/')) p = `/${p}`;
  if (p !== '/' && !p.endsWith('/')) p += '/';
  if (p === '/7ya/') return '/systems/';
  return p;
}
function nav(current) {
  return NAV.map(([href,label]) => `<a href="${href}"${href===current?' aria-current="page"':''}>${esc(label)}</a>`).join('');
}
function cards(items) {
  return (items || []).map(([status,title,text,href],i) => {
    const content = `<div class="top"><span>${esc(status)}</span><b>${String(i+1).padStart(2,'0')}</b></div><h3>${esc(title)}</h3><p>${esc(text)}</p>${href?'<em>לפרטים ←</em>':''}`;
    return href ? `<a class="card" href="${esc(href)}">${content}</a>` : `<article class="card">${content}</article>`;
  }).join('');
}
function satellites() {
  return Array.from({length:7},(_,i)=>`<figure class="sat s${i+1}"><img src="${PORTRAIT}" alt="איגור ופרצקי — זהות ציבורית ${i+1}"></figure>`).join('');
}
function rootPage(page, sha) {
  return `<!doctype html><html lang="he" dir="rtl"><head>${head('/', page, sha)}</head><body class="root"><header>${brand()}<nav>${nav('/')}</nav><button data-open-ai>ASK 7YA AI</button></header><main><section class="creator"><div class="stars"></div><div class="copy"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>CREATOR<br><i>OF WORLDS.</i></h1><p class="lead">${esc(page.lead)}</p><div class="actions"><a class="primary" href="/work/">לכל מה שבניתי</a><a href="/evidence/">בדקו את הראיות</a></div><small>Release ${RELEASE} · ${esc(sha.slice(0,12))}</small></div><div class="orbit"><figure class="core"><img src="${PORTRAIT}" alt="איגור ופרצקי"></figure>${satellites()}<b>IGOR · ONE PERSON · MANY CREATIONS</b></div></section><section class="manifesto"><span>AI IS NOT THE HERO.</span><h2>PEOPLE ARE.</h2><p>הטכנולוגיה היא מכפיל כוח. המשימה היא אנושית.</p></section><section class="archive"><div class="section-head"><p>COMPLETE PUBLIC ARCHIVE</p><h2>כל תחומי העשייה, עם סטטוס ראיה.</h2></div><div class="grid">${cards(page.items)}</div></section><section class="igor-wall"><h2>הרבה תפקידים. אדם אחד.</h2><div>${Array.from({length:12},(_,i)=>`<figure><img src="${PORTRAIT}" alt="איגור ופרצקי"><figcaption>${['CREATOR','STARTON','PUBLIC SERVICE','SPEAKER','PUBLIC VOICE','MUSIC','AI BUILDER','SYSTEM BUILDER','EVIDENCE FIRST','KHARKIV → ISRAEL','HUMAN FIRST','CREATING NEXT'][i]}</figcaption></figure>`).join('')}</div></section>${finalCta()}</main>${footer(sha)}${aiWidget()}</body></html>`;
}
function head(route, page, sha) {
  const canonical = `https://7ya.io${route}`;
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#050505"><meta name="7ya-release" content="${RELEASE}"><meta name="7ya-source-sha" content="${esc(sha)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="profile"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${PORTRAIT}"><meta name="twitter:card" content="summary_large_image"><style>${CSS}</style>`;
}
function brand(){return `<a class="brand" href="/"><span>7</span><b>IGOR VEPRETSKI</b></a>`;}
function depthPage(route, page, sha) {
  return `<!doctype html><html lang="he" dir="rtl"><head>${head(route,page,sha)}</head><body><header>${brand()}<nav>${nav(route)}</nav><button data-open-ai>ASK 7YA AI</button></header><main><section class="hero"><img src="${PORTRAIT}" alt="איגור ופרצקי"><div class="shade"></div><div class="copy"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.heading).replace(/\n/g,'<br>')}</h1><p class="lead">${esc(page.lead)}</p><div class="actions"><a class="primary" href="/work/">מפת העשייה</a><a href="/evidence/">Evidence Wall</a></div><small>Release ${RELEASE} · ${esc(sha.slice(0,12))}</small></div></section><section class="archive"><div class="section-head"><p>PUBLIC RECORD</p><h2>עשייה עם הקשר וגבולות.</h2></div><div class="grid">${cards(page.items)}</div></section><section class="legend"><div><b>VERIFIED / BUILT</b><p>מקור ישיר או מערכת שניתנת לבדיקה.</p></div><div><b>DOCUMENTED / ARCHIVE</b><p>תיעוד עם הקשר, לא בהכרח אימות מוסדי.</p></div><div><b>SELF-ATTESTED</b><p>ביוגרפיה ציבורית שממתינה למקור ישיר.</p></div><div><b>MISSION / PILOT</b><p>חזון או תכנון, לא תוצאה שהושלמה.</p></div></section>${finalCta()}</main>${footer(sha)}${aiWidget()}</body></html>`;
}
function finalCta(){return `<section class="final"><p>THE ARCHIVE IS ALIVE</p><h2>לא מבקשים אמון עיוור.<br>בונים משהו שאפשר לבדוק.</h2><div class="actions"><a class="primary" href="/evidence/">בדקו את הראיות</a><a href="mailto:hello@7ya.io">צרו קשר</a></div></section>`;}
function footer(sha){return `<footer><b>IGOR VEPRETSKI / 7YA.IO</b><span>${RELEASE} · ${esc(sha.slice(0,12))} · <a href="/release.json">Provenance</a></span></footer>`;}
function aiWidget(){return `<div class="ai"><button class="orb" data-open-ai>7<br><small>AI</small></button><section class="panel" aria-hidden="true"><div class="panel-head"><b>7YA AI</b><button data-close-ai>×</button></div><div class="log"><p>שאלו על איגור, StartOn, השירות, המערכות, הראיות או המוזיקה.</p></div><form><input maxlength="1600" placeholder="מה תרצו להבין?"><button>שליחה</button></form></section></div><script>${CLIENT}</script>`;}

const CLIENT = `(()=>{const panel=document.querySelector('.panel'),log=document.querySelector('.log'),form=document.querySelector('.panel form'),input=document.querySelector('.panel input');const open=v=>{panel.classList.toggle('open',v);panel.setAttribute('aria-hidden',String(!v));if(v)input.focus()};document.querySelectorAll('[data-open-ai]').forEach(x=>x.onclick=()=>open(true));document.querySelector('[data-close-ai]').onclick=()=>open(false);form.onsubmit=async e=>{e.preventDefault();const text=input.value.trim();if(!text)return;log.innerHTML+='<p class="user"></p>';log.lastChild.textContent=text;input.value='';const wait=document.createElement('p');wait.textContent='חושב…';log.append(wait);try{const r=await fetch('/api/guide',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,path:location.pathname})});const d=await r.json();wait.textContent=d.answer||'לא נמצאה תשובה.';if(d.links){const row=document.createElement('div');row.className='links';d.links.forEach(x=>{const a=document.createElement('a');a.href=x.href;a.textContent=x.label;row.append(a)});log.append(row)}}catch{wait.textContent='החיבור אינו זמין כרגע.'}log.scrollTop=log.scrollHeight};})();`;

const CSS = `:root{color-scheme:dark;--bg:#050506;--fg:#faf7f1;--muted:#aaa49d;--line:#ffffff22;--orange:#ff5420;--cyan:#7be9ff;--green:#72f6ae;--max:1240px;font-family:Inter,Arial,system-ui,sans-serif}*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;background:radial-gradient(circle at 12% 8%,#23449b32,transparent 34rem),radial-gradient(circle at 90% 20%,#ff542022,transparent 30rem),var(--bg);color:var(--fg);overflow-x:hidden}a{color:inherit;text-decoration:none}button,input{font:inherit}header{position:fixed;z-index:50;inset:0 0 auto;min-height:72px;padding:0 max(16px,calc((100vw - var(--max))/2));display:flex;align-items:center;justify-content:space-between;gap:22px;background:#050506db;border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}.brand{display:flex;align-items:center;gap:10px;direction:ltr}.brand span{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--orange);font-weight:1000}.brand b{font-size:.72rem;letter-spacing:.15em}nav{display:flex;gap:18px;font-size:.75rem;font-weight:850}nav a[aria-current=page],nav a:hover{color:#ff9878}header>button{border:1px solid #ffffff35;border-radius:999px;padding:10px 14px;background:#fff;color:#050506;font-weight:900}.creator,.hero{position:relative;min-height:96svh;overflow:hidden}.hero>img{position:absolute;width:100%;height:100%;object-fit:cover;object-position:60% 18%;filter:saturate(.62) contrast(1.1) brightness(.65)}.shade{position:absolute;inset:0;background:linear-gradient(90deg,#050506 0,#050506ef 32%,#0505065f 72%),linear-gradient(0deg,#050506,transparent 45%)}.copy{position:relative;z-index:3;width:min(760px,calc(100% - 34px));min-height:96svh;margin:auto;padding:130px 0 70px;display:flex;flex-direction:column;justify-content:center;transform:translateX(-25%)}.eyebrow{color:#ff9b7b;font-size:.66rem;font-weight:950;letter-spacing:.19em;direction:ltr}.copy h1{margin:16px 0 0;font-size:clamp(4rem,9vw,9rem);line-height:.82;letter-spacing:-.075em}.lead{max-width:720px;color:#d9d4cd;font-size:clamp(1.03rem,1.45vw,1.28rem);line-height:1.7}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.actions a{padding:12px 18px;border:1px solid #ffffff3a;border-radius:999px;font-weight:900}.actions .primary{background:var(--orange);border-color:var(--orange)}.copy small{margin-top:25px;color:#aaa;direction:ltr}.creator{display:grid;grid-template-columns:1fr 1fr;align-items:center;width:min(var(--max),calc(100% - 30px));margin:auto;padding-top:72px}.creator .copy{transform:none;margin:0}.creator h1{direction:ltr;text-align:left;font-size:clamp(4.5rem,9vw,9.5rem)}.creator h1 i{color:transparent;-webkit-text-stroke:1.5px #fff;font-style:normal}.stars{position:absolute;inset:0;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:38px 38px;opacity:.15}.orbit{position:relative;min-height:650px}.core{position:absolute;inset:13% 20%;margin:0;border-radius:50%;overflow:hidden;border:1px solid #ffffff38;box-shadow:0 0 100px #335eff45}.core img,.sat img{width:100%;height:100%;object-fit:cover}.sat{position:absolute;width:96px;height:96px;margin:0;border-radius:50%;overflow:hidden;border:1px solid #ffffff44}.s1{top:2%;left:46%}.s2{top:20%;right:1%}.s3{bottom:20%;right:4%}.s4{bottom:1%;left:47%}.s5{bottom:20%;left:2%}.s6{top:20%;left:1%}.s7{top:43%;right:-6%}.orbit>b{position:absolute;bottom:8%;left:25%;font-size:.62rem;letter-spacing:.18em}.manifesto{padding:110px 20px;text-align:center;background:#f2ece3;color:#070707}.manifesto span{color:var(--orange);font-size:.72rem;font-weight:950;letter-spacing:.2em}.manifesto h2{margin:8px 0;font-size:clamp(4rem,12vw,11rem);line-height:.82;letter-spacing:-.08em}.archive{width:min(var(--max),calc(100% - 30px));margin:auto;padding:110px 0}.section-head{display:grid;grid-template-columns:.35fr 1.65fr;gap:40px}.section-head>p{color:#ff9878;font-size:.68rem;font-weight:950;letter-spacing:.17em}.section-head h2{max-width:13ch;margin:0;font-size:clamp(3.2rem,6vw,6rem);line-height:.9;letter-spacing:-.06em}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:50px;background:var(--line);border:1px solid var(--line)}.card{min-height:290px;padding:23px;background:#0a0a0b;display:flex;flex-direction:column}.card:hover{background:#131315}.top{display:flex;justify-content:space-between}.top span{color:var(--cyan);font-size:.59rem;font-weight:950}.top b{color:#ffffff32;font-size:1.7rem}.card h3{margin:65px 0 0;font-size:clamp(1.65rem,2.5vw,2.8rem);line-height:1}.card p{color:var(--muted)}.card em{margin-top:auto;color:#ff9878;font-style:normal;font-size:.72rem}.igor-wall{padding:100px max(15px,calc((100vw - var(--max))/2));background:#0a0a0c}.igor-wall h2{text-align:center;font-size:clamp(3rem,7vw,7rem)}.igor-wall>div{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.igor-wall figure{margin:0;position:relative;aspect-ratio:1;overflow:hidden}.igor-wall img{width:100%;height:100%;object-fit:cover;filter:grayscale(.35)}.igor-wall figcaption{position:absolute;inset:auto 10px 10px;font-size:.58rem;font-weight:900;letter-spacing:.12em}.legend{width:min(var(--max),calc(100% - 30px));margin:0 auto 100px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line)}.legend div{padding:20px}.legend b{color:#ff9878;font-size:.62rem}.legend p{color:var(--muted);font-size:.8rem}.final{padding:120px 20px;text-align:center;background:var(--orange)}.final h2{font-size:clamp(3.5rem,8vw,8rem);line-height:.84}.final .actions{justify-content:center}footer{padding:28px max(16px,calc((100vw - var(--max))/2));display:flex;justify-content:space-between;color:#999}.ai{position:fixed;z-index:100;right:16px;bottom:16px}.orb{width:64px;height:64px;border:0;border-radius:50%;background:var(--orange);color:#fff;font-weight:1000}.panel{position:absolute;right:0;bottom:76px;width:min(390px,calc(100vw - 22px));height:min(590px,calc(100svh - 110px));display:none;grid-template-rows:auto 1fr auto;background:#0d0d0eef;border:1px solid var(--line);border-radius:22px;overflow:hidden}.panel.open{display:grid}.panel-head{padding:14px;display:flex;justify-content:space-between;background:#171719}.panel-head button{background:none;border:0;color:#fff;font-size:1.5rem}.log{padding:15px;overflow:auto}.log p{padding:11px;border-radius:14px;background:#1b1b1d}.log .user{background:var(--orange)}.links{display:flex;gap:6px;flex-wrap:wrap}.links a{padding:6px 8px;border:1px solid var(--line);border-radius:999px;font-size:.7rem}.panel form{display:grid;grid-template-columns:1fr auto;gap:7px;padding:10px}.panel input{min-width:0;padding:11px;border:1px solid var(--line);border-radius:999px;background:#171719;color:#fff}.panel form button{border:0;border-radius:999px;background:var(--orange);color:#fff;font-weight:900}@media(max-width:900px){nav{display:none}.creator{grid-template-columns:1fr}.creator .copy{padding-top:120px}.orbit{min-height:500px}.copy{transform:none;margin:0;padding-inline:20px}.grid{grid-template-columns:repeat(2,1fr)}.section-head{grid-template-columns:1fr}.igor-wall>div{grid-template-columns:repeat(3,1fr)}.legend{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.brand b{display:none}.creator h1,.copy h1{font-size:16vw}.orbit{min-height:400px}.sat{width:65px;height:65px}.grid,.legend{grid-template-columns:1fr}.igor-wall>div{grid-template-columns:repeat(2,1fr)}.actions{display:grid}.actions a{width:100%;text-align:center}footer{flex-direction:column;gap:8px}}`;

module.exports = (req, res) => {
  const route = normalize(req.query.route || req.url || '/');
  const page = PAGES[route];
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Robots-Tag', page ? 'index, follow' : 'noindex');
  if (!page) {
    res.statusCode = 404;
    res.end('<!doctype html><html lang="he" dir="rtl"><head><meta name="robots" content="noindex"><title>404 | 7YA</title></head><body><h1>העמוד לא נמצא</h1><a href="/">חזרה לבית</a></body></html>');
    return;
  }
  const sha = sourceSha();
  res.statusCode = 200;
  res.end(route === '/' ? rootPage(page, sha) : depthPage(route, page, sha));
};
