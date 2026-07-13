const RELEASE = '2026-07-14.8-canonical-runtime';
const PORTRAIT = 'https://raw.githubusercontent.com/7guard-io/7ya.io/2c7b7e092bc593f29322efe5104af0d44ffbaec9/assets/igor-home-portrait-20260712.jpg';

const pages = {
  '/': {
    title: 'איגור ופרצקי | Creatorverse — יצירה, השפעה וראיות',
    description: 'הבית הציבורי של איגור ופרצקי: StartOn, שירות ציבורי, יצירה, מדיה, 7YA, ראיות ובינה מלאכותית.',
    eyebrow: 'IGOR VEPRETSKI · CREATORVERSE · HUMAN FIRST',
    heading: 'יוצר עולמות.\nמתעד מציאות.',
    lead: 'אדם אחד, תחומי עשייה רבים ומערכת אחת שמפרידה בין עובדה, מקור, תיאור עצמי, תכנון ויצירה.',
    cards: [
      ['DOCUMENTED', 'StartOn', 'יוזמה חברתית־טכנולוגית לנוער, שייכות ויצירה.', '/starton/'],
      ['BUILT', '7YA Systems', 'זהות ציבורית, Evidence Wall, Radar ו־AI Guide.', '/evidence/'],
      ['SELF-ATTESTED', 'שירות ציבורי', 'רקע שירותי וביטחוני; פרטים שאינם מגובים מסומנים במפורש.', '/igor-vepretski/'],
      ['ARCHIVE', 'מדיה והשפעה', 'תוכן ציבורי רב־לשוני ללא המצאת נתוני חשיפה.', '/social/'],
      ['GOVERNED', 'Evidence First', 'כל טענה מקבלת סטטוס, מקור והקשר.', '/evidence/'],
      ['PUBLIC', 'שיחה ושיתוף פעולה', 'ראיונות, הרצאות, שותפויות ותיקוני ראיות.', '/contact/']
    ]
  },
  '/igor-vepretski/': {
    title: 'איגור ופרצקי | זהות ציבורית רשמית | 7YA',
    description: 'הפרופיל הציבורי הרשמי של איגור ופרצקי, עם הפרדה בין עובדות מתועדות לתיאור עצמי.',
    eyebrow: 'OFFICIAL PUBLIC IDENTITY',
    heading: 'איגור ופרצקי.',
    lead: 'יזם חברתי, יוצר ובונה מערכות ציבוריות. מידע ביוגרפי שאינו מחובר עדיין למקור ישיר מסומן כ־SELF-ATTESTED או SOURCE PENDING.',
    cards: [
      ['DOCUMENTED', 'מייסד StartOn', 'היוזמה והחזון מתועדים במקורות ציבוריים ובארכיון 7YA.', '/starton/'],
      ['BUILT', '7YA.IO', 'מערכת ציבורית לזהות, ראיות, תוכן ו־AI.', '/evidence/'],
      ['SELF-ATTESTED', 'רקע בשירות ובביטחון', 'מוצג כתיאור עצמי עד להצמדת מקורות ישירים לכל רכיב.', '/evidence/'],
      ['SOURCE PENDING', 'B.A. בקרימינולוגיה', 'טענה ממתינה למסמך או מקור מוסדי ישיר.', '/evidence/'],
      ['ARCHIVE', 'יוצר ומתקשר ציבורי', 'וידאו, כתיבה, מוזיקה ושיחה ציבורית.', '/social/']
    ]
  },
  '/talk/': {
    title: '7YA AI Guide | שיחה עם גבולות ראיה',
    description: 'מדריך ציבורי על איגור ופרצקי, StartOn ו־7YA שאינו ממציא עובדות ומפנה למקורות.',
    eyebrow: '7YA AI GUIDE · EVIDENCE BOUNDED',
    heading: 'לשאול. להבין. לבדוק.',
    lead: 'המדריך מסביר את המערכת ומבדיל בין מידע מתועד, תיאור עצמי ותכנון. הוא אינו מקור עצמאי לעובדות.',
    cards: [
      ['RULE', 'לא ממציאים', 'כשאין מקור, התשובה מסומנת כלא מאומתת.', '/evidence/'],
      ['RULE', 'לא חושפים מידע פרטי', 'מידע משפחתי, רגיש או מבצעי נשאר מחוץ למערכת.', '/contact/'],
      ['ACTION', 'שאלו את המדריך', 'השתמשו במסוף המקומי בתחתית העמוד.', '#guide']
    ],
    guide: true
  },
  '/social/': {
    title: 'Social Archive | 7YA',
    description: 'ארכיון ציבורי של ערוצי התוכן וההשפעה של איגור ופרצקי, ללא נתונים לא מאומתים.',
    eyebrow: 'OWNED MEDIA · PUBLIC SIGNALS',
    heading: 'תוכן הוא אות.\nראיה היא הקשר.',
    lead: 'מספרי צפיות, עוקבים והשפעה מפורסמים רק כאשר קיים snapshot מתוארך או מקור פלטפורמה ישיר.',
    cards: [
      ['PUBLIC', 'Instagram', 'ערוץ תוכן ציבורי רשמי.', 'https://www.instagram.com/igor.vepretski/'],
      ['PUBLIC', 'YouTube', 'וידאו, ראיונות וארכיון יצירה.', 'https://www.youtube.com/@IgorVepretski'],
      ['PUBLIC', 'TikTok', 'תוכן קצר ושיחה עם קהל.', 'https://www.tiktok.com/@igor.vepretski'],
      ['GOVERNED', 'Metrics', 'אין טענת חשיפה ללא צילום מסך או export מתוארך.', '/evidence/']
    ]
  },
  '/pass/': {
    title: '7YA Pass | נתיב שמור',
    description: '7YA Pass הוא נתיב מוצר שמור ואינו תעודה רשמית, רישיון או הרשאה מוסדית.',
    eyebrow: 'RESERVED PRODUCT SURFACE',
    heading: 'לא תעודה.\nלא הרשאה.',
    lead: 'הנתיב נשמר לפיתוח עתידי. אין בו כרגע מעמד ממשלתי, מוסדי, משפטי או מקצועי.',
    cards: [
      ['RESERVED', 'Product concept', 'משטח שירות עתידי בלבד.', '/'],
      ['BOUNDARY', 'No authority claim', 'אינו מחליף זיהוי רשמי או אישור מוסדי.', '/evidence/']
    ]
  },
  '/evidence/': {
    title: 'Evidence Wall | 7YA',
    description: 'מפת טענות, מקורות וסטטוסי אימות של 7YA ואיגור ופרצקי.',
    eyebrow: 'EVIDENCE BEFORE AMPLIFICATION',
    heading: 'מה מתועד.\nמה עדיין בבדיקה.',
    lead: 'המערכת אינה הופכת תיאור עצמי לעובדה. כל טענה מסומנת לפי איכות המקור והשלב שלה.',
    cards: [
      ['DOCUMENTED', 'StartOn', 'קיימים מקורות ציבוריים ישירים על היוזמה והחזון.', '/starton/'],
      ['SELF-ATTESTED', 'רקע שירותי וביטחוני', 'מוצג כתיאור עצמי עד לחיבור מקורות מלא.', '/igor-vepretski/'],
      ['SOURCE PENDING', 'השכלה אקדמית', 'נדרש מסמך או מקור מוסדי ישיר.', '/igor-vepretski/'],
      ['BUILT', '7YA runtime', 'הנתיבים, ה־release וה־crawl controls ניתנים לבדיקה ציבורית.', '/release.json'],
      ['RULE', 'תיקון פתוח', 'ניתן לשלוח מקור, סתירה או בקשת תיקון.', '/contact/']
    ]
  },
  '/starton/': {
    title: 'StartOn | טכנולוגיה, שייכות והזדמנות',
    description: 'חזון חברתי־טכנולוגי למרחבים בטוחים ומקדמי הזדמנות לנוער.',
    eyebrow: 'YOUTH · TECHNOLOGY · BELONGING',
    heading: 'טכנולוגיה כבית\nשל הזדמנות.',
    lead: 'מחשבים, גיימינג, AI, מוזיקה ומדיה כדלת כניסה לשייכות, למידה, מנטורים ועתיד מקצועי.',
    cards: [
      ['MODEL', 'Playroom', 'גיימינג, VR וסקרנות ככניסה בטוחה לקשר.', null],
      ['MODEL', 'Classroom', 'מחשבים, אוריינות דיגיטלית, AI ויצירה.', null],
      ['MODEL', 'Social Lounge', 'קהילה, מנטורים, ליווי ושייכות.', null],
      ['MODEL', 'Transparent Media Studio', 'פודקאסט, וידאו ומוזיקה עם קול, קרדיט ואחריות.', null],
      ['STATUS', 'Pilot development', 'תכנון ופיתוח אינם מוצגים כתוצאה שכבר הושלמה.', '/evidence/']
    ]
  },
  '/contact/': {
    title: 'Contact | 7YA',
    description: 'יצירת קשר רשמית בנושאי StartOn, שותפויות, מדיה, הרצאות ותיקוני ראיות.',
    eyebrow: 'OFFICIAL CONTACT',
    heading: 'מנתבים נכון.\nפועלים מדויק.',
    lead: 'פניות לשותפות, תקשורת, הרצאות, StartOn ותיקוני ראיות מתקבלות בערוץ הרשמי.',
    cards: [
      ['EMAIL', 'hello@7ya.io', 'StartOn, שותפויות, מדיה, הרצאות ותיקוני ראיות.', 'mailto:hello@7ya.io'],
      ['PRIVACY', 'No sensitive data', 'אין לשלוח מידע מבצעי, רפואי או אישי רגיש.', null]
    ]
  },
  '/radar/': {
    title: '7YA Radar | כוונה, החלטה, ביצוע ותוצאה',
    description: 'מתודולוגיית מעקב ציבורי שמפרידה בין כוונה, החלטה, תקצוב, ביצוע ותוצאה.',
    eyebrow: 'PUBLIC ACCOUNTABILITY METHODOLOGY',
    heading: 'לא כל הבטחה\nהיא ביצוע.',
    lead: 'Radar אינו מנוע האשמות. הוא מסווג שלבים, מקורות, סתירות, פערים ושאלות פתוחות.',
    cards: [
      ['STAGE', 'Declared intent', 'הצהרה או כיוון מדיניות.', null],
      ['STAGE', 'Formal approval', 'החלטה, חוק, תקציב או הרשאה.', null],
      ['STAGE', 'Execution', 'פעולה בפועל עם מסמכים ומועדים.', null],
      ['STAGE', 'Measured outcome', 'תוצאה שנמדדה ולא רק הוצהרה.', null],
      ['RULE', 'No unsupported wrongdoing claims', 'אין ייחוס אשמה או כוונה ללא ראיה ישירה.', '/evidence/']
    ]
  }
};

const aliases = {
  '/journey/': '/', '/work/': '/', '/systems/': '/evidence/', '/public-service/': '/igor-vepretski/',
  '/influence/': '/social/', '/music/': '/social/', '/speaker/': '/contact/', '/7ya/': '/evidence/'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function normalizeRoute(request) {
  const raw = String(request.query?.route || request.url || '/').split('?')[0];
  const route = raw.startsWith('/api/site') ? '/' : raw;
  return route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}/`;
}
function card([status, title, text, href]) {
  const body = `<span class="status">${escapeHtml(status)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p>`;
  return href ? `<a class="card" href="${escapeHtml(href)}">${body}<b>פתיחה ←</b></a>` : `<article class="card">${body}</article>`;
}
function render(page, route) {
  const cards = page.cards.map(card).join('');
  const nav = [
    ['/', 'בית'], ['/igor-vepretski/', 'איגור'], ['/starton/', 'StartOn'], ['/evidence/', 'ראיות'],
    ['/social/', 'Social'], ['/talk/', 'AI Guide'], ['/radar/', 'Radar'], ['/contact/', 'קשר']
  ].map(([href,label]) => `<a href="${href}"${href===route?' aria-current="page"':''}>${label}</a>`).join('');
  const guide = page.guide ? `<section id="guide" class="guide"><div><span class="eyebrow">LOCAL EVIDENCE GUIDE</span><h2>שאלו על 7YA</h2><p id="answer">נסו: מהו StartOn? מה מאומת? מהו 7YA Pass?</p></div><form id="guide-form"><input id="question" maxlength="500" placeholder="כתבו שאלה"><button>שאלו</button></form></section>` : '';
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://7ya.io${route}"><meta name="7ya-release" content="${RELEASE}"><meta property="og:type" content="website"><meta property="og:site_name" content="7YA.IO"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:url" content="https://7ya.io${route}"><meta property="og:image" content="${PORTRAIT}"><style>${CSS}</style></head><body><canvas id="stars" aria-hidden="true"></canvas><header><a class="brand" href="/"><i>7</i><span><b>IGOR VEPRETSKI</b><small>7YA · CREATORVERSE</small></span></a><nav>${nav}</nav></header><main><section class="hero"><div><span class="eyebrow">${escapeHtml(page.eyebrow)}</span><h1>${escapeHtml(page.heading).replace(/\n/g,'<br>')}</h1><p>${escapeHtml(page.lead)}</p><div class="actions"><a class="primary" href="/evidence/">Evidence Wall</a><a href="/contact/">שיתוף פעולה</a></div></div><figure><img src="${PORTRAIT}" width="900" height="900" alt="איגור ופרצקי"><figcaption>HUMAN FIRST · EVIDENCE FIRST</figcaption></figure></section><section class="grid">${cards}</section>${guide}</main><footer><span>7YA.IO · ${RELEASE}</span><span><a href="/robots.txt">Robots</a> · <a href="/sitemap.xml">Sitemap</a> · <a href="/release.json">Release</a></span></footer><script>${JS}</script></body></html>`;
}

const CSS = `:root{color-scheme:dark;--bg:#050711;--panel:#0d1221cc;--line:#28324d;--text:#f7f8ff;--muted:#a9b1c8;--cyan:#74f0ff;--violet:#a78bfa}*{box-sizing:border-box}html{background:var(--bg);scroll-behavior:smooth}body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:var(--text);background:radial-gradient(circle at 15% 5%,#17225a66,transparent 30rem),radial-gradient(circle at 85% 20%,#581c8760,transparent 34rem),var(--bg);min-height:100vh}#stars{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;opacity:.55}a{color:inherit;text-decoration:none}header,main,footer{position:relative;z-index:1}header{display:flex;align-items:center;justify-content:space-between;gap:2rem;padding:1rem clamp(1rem,4vw,4rem);border-bottom:1px solid #ffffff17;background:#050711c7;backdrop-filter:blur(18px);position:sticky;top:0;z-index:5}.brand{display:flex;align-items:center;gap:.8rem}.brand i{display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;font-style:normal;font-weight:900;color:#02040b;background:linear-gradient(135deg,var(--cyan),var(--violet));box-shadow:0 0 28px #74f0ff66}.brand span{display:grid}.brand small{color:var(--muted);font-size:.65rem;letter-spacing:.18em}nav{display:flex;gap:.35rem;flex-wrap:wrap}nav a{padding:.55rem .75rem;border-radius:999px;color:var(--muted);font-size:.82rem}nav a:hover,nav a[aria-current]{background:#ffffff12;color:white}main{width:min(1180px,calc(100% - 2rem));margin:auto;padding:clamp(2rem,7vw,6rem) 0}.hero{display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:clamp(2rem,6vw,6rem);min-height:62vh}.eyebrow{display:inline-block;color:var(--cyan);font-size:.72rem;font-weight:800;letter-spacing:.18em;margin-bottom:1rem}.hero h1{font-size:clamp(3.2rem,9vw,8rem);line-height:.84;letter-spacing:-.07em;margin:0;max-width:10ch;background:linear-gradient(110deg,#fff 20%,var(--cyan) 55%,var(--violet));-webkit-background-clip:text;color:transparent}.hero p{font-size:clamp(1.05rem,2vw,1.35rem);line-height:1.75;color:var(--muted);max-width:62ch}.hero figure{margin:0;position:relative}.hero img{width:100%;height:auto;border-radius:45% 45% 28% 28%;filter:saturate(.85) contrast(1.08);border:1px solid #ffffff2e;box-shadow:0 0 80px #6d5cff33}.hero figcaption{text-align:center;color:var(--muted);font-size:.68rem;letter-spacing:.18em;margin-top:.8rem}.actions{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.6rem}.actions a,.guide button{border:1px solid var(--line);padding:.8rem 1rem;border-radius:12px;background:#ffffff08}.actions .primary,.guide button{background:linear-gradient(135deg,var(--cyan),var(--violet));color:#03050c;border:0;font-weight:850}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:3rem}.card{display:block;min-height:220px;padding:1.4rem;border-radius:22px;border:1px solid var(--line);background:linear-gradient(145deg,#11182aee,#090d18dd);transition:.25s transform,.25s border-color}.card:hover{transform:translateY(-5px);border-color:#74f0ff88}.card .status{font-size:.65rem;letter-spacing:.15em;color:var(--cyan);font-weight:850}.card h2{font-size:1.4rem;margin:1.3rem 0 .55rem}.card p{color:var(--muted);line-height:1.65}.card b{display:block;margin-top:1.2rem;font-size:.8rem;color:var(--violet)}.guide{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:end;margin-top:3rem;padding:2rem;border:1px solid var(--line);border-radius:24px;background:#0d1221dd}.guide h2{font-size:2.2rem;margin:.3rem 0}.guide p{color:var(--muted);line-height:1.6}.guide form{display:flex;gap:.6rem}.guide input{width:100%;background:#050711;border:1px solid var(--line);border-radius:12px;padding:1rem;color:white;font:inherit}.guide button{cursor:pointer;white-space:nowrap}footer{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1.5rem clamp(1rem,4vw,4rem);border-top:1px solid #ffffff17;color:var(--muted);font-size:.78rem}@media(max-width:850px){header{align-items:flex-start;flex-direction:column}.hero{grid-template-columns:1fr;min-height:auto}.hero figure{max-width:420px;margin:auto}.grid{grid-template-columns:1fr 1fr}.guide{grid-template-columns:1fr}}@media(max-width:560px){nav{display:grid;grid-template-columns:repeat(4,1fr);width:100%}nav a{text-align:center;padding:.45rem .25rem}.grid{grid-template-columns:1fr}.hero h1{font-size:clamp(3.1rem,18vw,5rem)}.guide form{display:grid}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}#stars{display:none}}`;

const JS = `(()=>{const c=document.getElementById('stars'),x=c.getContext('2d');let w,h,s=[];function z(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;s=Array.from({length:Math.min(140,Math.floor(innerWidth/8))},()=>[Math.random()*w,Math.random()*h,Math.random()*1.6+.3])}function d(){x.clearRect(0,0,w,h);x.fillStyle='#dffcff';for(const a of s){x.globalAlpha=.2+a[2]/3;x.beginPath();x.arc(a[0],a[1],a[2]*devicePixelRatio,0,7);x.fill()}requestAnimationFrame(d)}addEventListener('resize',z);z();d();const f=document.getElementById('guide-form');if(f)f.addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('question').value.toLowerCase(),a=document.getElementById('answer');let t='המידע אינו מאומת במדריך המקומי. עברו ל־Evidence Wall או שלחו מקור לתיקון.';if(q.includes('starton'))t='StartOn מוצג כיוזמה חברתית־טכנולוגית מתועדת. שלבי פיילוט ותכנון אינם מוצגים כתוצאה שהושלמה.';else if(q.includes('pass'))t='7YA Pass הוא נתיב מוצר שמור בלבד ואינו תעודה, רישיון או הרשאה מוסדית.';else if(q.includes('איגור')||q.includes('igor'))t='איגור ופרצקי מוצג כיזם חברתי, יוצר ובונה 7YA. רקע שירותי והשכלה מסומנים לפי מצב המקור.';else if(q.includes('מאומת')||q.includes('ראי'))t='Evidence Wall מפריד בין DOCUMENTED, SELF-ATTESTED, SOURCE PENDING, BUILT ו־RESERVED.';a.textContent=t})})();`;

module.exports = (request, response) => {
  const host = String(request.headers?.host || '').toLowerCase();
  if (host === 'www.7ya.io') {
    response.statusCode = 308;
    response.setHeader('Location', `https://7ya.io${normalizeRoute(request)}`);
    response.end();
    return;
  }
  let route = normalizeRoute(request);
  route = aliases[route] || route;
  const page = pages[route];
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https://raw.githubusercontent.com data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  if (!page) {
    response.statusCode = 404;
    response.end(render({title:'404 | 7YA',description:'העמוד לא נמצא.',eyebrow:'NOT FOUND',heading:'העמוד לא נמצא.',lead:'הנתיב אינו חלק מהמערכת הציבורית הפעילה.',cards:[['ACTION','חזרה לבית','פתחו את הבית הציבורי של 7YA.','/']]}, route));
    return;
  }
  response.statusCode = 200;
  response.end(render(page, route));
};
