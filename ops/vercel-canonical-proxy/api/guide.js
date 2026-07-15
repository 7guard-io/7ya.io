'use strict';

const LINKS = {
  identity: { label: 'איגור ופרצקי', href: '/igor-vepretski/' },
  journey: { label: 'המסע', href: '/journey/' },
  history: { label: 'שיר ההיסטוריה', href: '/history/' },
  create: { label: '7YA Create', href: '/create/' },
  starton: { label: 'StartOn', href: '/starton/' },
  systems: { label: 'מערכות 7YA', href: '/7ya/' },
  evidence: { label: 'Evidence Wall', href: '/evidence/' },
  influence: { label: 'מדיה והשפעה', href: '/influence/' },
  response: { label: 'הד ציבורי AI', href: '/response-ai/' },
  speaker: { label: 'הרצאות ובמה', href: '/speaker/' },
  contact: { label: 'יצירת קשר', href: '/contact/' },
};

const PROVIDER_TIMEOUT_MS = 18000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 18;
const rateBuckets = new Map();

function clientKey(request) {
  return String(request.headers?.['x-forwarded-for'] || request.socket?.remoteAddress || 'anonymous')
    .split(',')[0]
    .trim()
    .slice(0, 128);
}

function withinRateLimit(request) {
  const now = Date.now();
  const key = clientKey(request);
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt > RATE_WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT;
}

function infoAnswer(message, currentPath = '/') {
  const query = message.toLowerCase();
  const routeHint = currentPath.startsWith('/starton') ? [LINKS.starton, LINKS.contact] : [];

  if (/starton|נוער|youth|מרחב|גיימינג/.test(query)) {
    return { answer: 'StartOn הוא החזון החברתי של איגור למרחבי טכנולוגיה, יצירה ושייכות לנוער. האתר מפריד בין מודל, פיילוט, מקור ותוצאה.', links: [LINKS.starton, LINKS.evidence, LINKS.contact] };
  }
  if (/ראי|evidence|proof|מקור|אימות|verified/.test(query)) {
    return { answer: 'Evidence Wall מפריד בין VERIFIED, DOCUMENTED, SOURCE PENDING ו-PRIVATE. קישור אינו מוכיח אוטומטית היקף, תוצאה או שותפות.', links: [LINKS.evidence, LINKS.history] };
  }
  if (/מערכ|system|oracle|ledger|provenance|merkle|pass|radar|seeds/.test(query)) {
    return { answer: '7YA היא המערכת המארגנת: זהות ציבורית, תוכן, ראיות, provenance, AI ופעולה. איגור הוא הליבה האנושית, StartOn היא השליחות ושיר ההיסטוריה הוא שכבת הזיכרון הציבורי.', links: [LINKS.systems, LINKS.evidence, LINKS.create] };
  }
  if (/יציר|תוכן|פוסט|וידאו|סרטון|רעיון|מטרה|הגשמ|תקוע|מפחד|ביקורת/.test(query)) {
    return { answer: '7YA Create עוזר להפוך רצון למטרה, תוכן וצעד מעשי. הוא חיובי אבל אינו מבטיח הצלחה ואינו ממציא עובדות.', links: [LINKS.create, LINKS.influence, LINKS.evidence] };
  }
  if (/תגובה|הד|response|קהל|שיתופ|צפיות|engagement/.test(query)) {
    return { answer: 'Public Response AI מפריד בין חשיפה, שיחה, הפצה חיצונית ומסגור חיובי מפורש. צפייה אינה הוכחת הסכמה או השפעה.', links: [LINKS.response, LINKS.influence, LINKS.evidence] };
  }
  if (/צבא|משטר|ביטחון|service|police|army/.test(query)) {
    return { answer: 'עמוד המסע מציג ביוגרפיה ציבורית ללא מידע מבצעי. פרטים ללא מסמך צמוד נשארים כתיאור עצמי או מקור בהמתנה.', links: [LINKS.journey, LINKS.evidence] };
  }
  if (/איגור|igor|מסע|journey|ביוגר/.test(query)) {
    return { answer: 'איגור ופרצקי הוא יזם חברתי, יוצר ובונה מערכות ציבוריות. 7YA מחבר את המסע, StartOn, התוכן, המדיה והראיות למערכת ציבורית אחת.', links: [LINKS.identity, LINKS.journey, LINKS.history] };
  }
  if (/הרצאה|ראיון|speaker|interview|contact|קשר|פאנל/.test(query)) {
    return { answer: 'להרצאה, ראיון, פאנל, שותפות או שיחה אנושית עברו לעמוד הבמה או ליצירת קשר.', links: [LINKS.speaker, LINKS.contact] };
  }

  return { answer: 'אני מדריך 7YA. אפשר לשאול על איגור, המסע, StartOn, יצירת תוכן, מערכות 7YA, ראיות, מדיה או שיחה.', links: routeHint.length ? [...routeHint, LINKS.evidence] : [LINKS.create, LINKS.history, LINKS.evidence] };
}

function localCreatorCoach(message, creatorMode = 'clarify') {
  const text = message.trim();
  const query = text.toLowerCase();
  const isVideo = /וידאו|סרטון|reel|tiktok|ריל/.test(query);
  const isBlocked = /מפחד|פחד|חושש|תקוע|מחסום|ביקורת|לא יודע|לא מצליח/.test(query);
  const isDistribution = /הפצה|פלטפורמ|אינסטגרם|טיקטוק|פייסבוק|לינקדאין|telegram|newsletter/.test(query);
  const isPersonal = /סיפור אישי|עברתי|ילדות|משפחה|חוויה|שינוי/.test(query);
  const isImpact = /לעזור|עשיית טוב|קהיל|נוער|חברתי|השפעה|עולם|בעיה ציבורית|התנדב|מיזם/.test(query);
  const isTech = /nvidia|מיקרוסופט|microsoft|azure|openai|github|ai|בינה|טכנולוג|כלי דיגיטלי/.test(query);
  const evidenceNotes = [];

  let reflection = 'יש כאן כוונה אמיתית. עכשיו מצמצמים אותה לתוצאה אחת שאפשר ליצור ולבדוק.';
  let nextStep = 'השלימו משפט אחד: “אחרי שהתוכן הזה יסתיים, אני רוצה שהאדם שמולו יחשוב, ירגיש או יעשה ___”.';
  let today = 'הקליטו דקה קולית חופשית והוציאו ממנה את המשפט החזק ביותר.';
  let thisWeek = 'פרסמו גרסה אחת, אספו תגובה איכותית אחת ושפרו רק את הפתיחה.';
  let hook = 'יש רגע שבו מפסיקים לחכות לאישור ומתחילים לבנות.';
  let angle = 'סיפור קצר שמוביל לבחירה מעשית בהווה.';
  let outline = ['פתיחה חדה', 'רגע קונקרטי', 'מה השתנה', 'מה הקהל יכול לעשות עכשיו'];
  let links = [LINKS.create, LINKS.influence, LINKS.evidence];

  if (isBlocked) {
    reflection = 'הביקורת קיבלה זכות וטו לפני שהיצירה נולדה. מחזירים את השליטה דרך ניסוי קטן ומוגן.';
    nextStep = 'כתבו גרסה פרטית של 120 מילים שאסור לפרסם. המטרה היא להוציא אמת, לא להרשים.';
    today = 'בחרו משפט אחד מהגרסה הפרטית והפכו אותו לפתיחה נקייה.';
    thisWeek = 'פרסמו ניסוי קטן לקהל מוגבל או בפורמט קצר.';
    hook = 'כמעט לא פרסמתי את זה, לא כי אין לי מה לומר — אלא כי ידעתי שתהיה ביקורת.';
    angle = 'להפוך פחד מהתגובה לבחירה מודעת בגבולות ובדיוק.';
  }

  if (isVideo) {
    nextStep = 'צלמו 20 שניות: משפט פתיחה, דוגמה אחת וסיום עם פעולה אחת.';
    hook = 'אם הייתי צריך להתחיל מחדש היום, זה הדבר הראשון שלא הייתי עושה.';
    angle = 'וידאו קצר עם קונפליקט מיידי, סיפור בגוף ראשון ולקח שימושי.';
    outline = ['0–3 שניות: משפט עוצר', '3–12: מה קרה', '12–18: מה הבנתם', '18–25: פעולה לקהל'];
  }

  if (isDistribution) {
    reflection = 'אותו רעיון לא צריך להעתיק בין פלטפורמות; הוא צריך להחליף צורה בלי לאבד אמת.';
    nextStep = 'בחרו מקור אחד מאושר והגדירו משפט ליבה שאסור לשנות.';
    today = 'הכינו Hook ל-TikTok, Caption ל-Instagram, פוסט ל-Facebook ופסקת תובנה ל-LinkedIn.';
    thisWeek = 'פרסמו בסדר מדורג, תעדו תאריך ותוצאה ואל תשנו עובדות כדי “לעבוד טוב יותר”.';
    angle = 'מקור אחד, ארבעה קצבים, משמעות אחת.';
    links = [LINKS.history, LINKS.influence, LINKS.evidence];
  }

  if (isImpact) {
    reflection = 'יש כאן רצון לעשות טוב. כדי שלא יישאר כסיסמה, נגדיר אדם אחד, צורך אחד וניסוי קטן שאפשר לבדוק בבטחה.';
    nextStep = 'השלימו משפט: “אני רוצה לעזור ל___ שמתמודד/ת עם ___ באמצעות ___”. התחילו מהאדם, לא מהכלי.';
    today = 'שוחחו עם אדם אחד מקהל היעד או עם איש מקצוע שמכיר אותו. שאלו מה באמת קשה, בלי להבטיח פתרון.';
    thisWeek = 'הריצו ניסוי מצומצם עם הסכמה, גבולות פרטיות ומדד אנושי אחד.';
    hook = 'השינוי הגדול התחיל משאלה קטנה שאף מערכת לא שאלה.';
    angle = 'אדם אחד, צורך אחד, ניסוי אחד שאפשר ללמוד ממנו.';
    outline = ['למי רוצים לעזור', 'מה שמענו', 'הניסוי הקטן', 'גבולות בטיחות ופרטיות', 'מה נמדוד ומה נשנה'];
    links = [LINKS.starton, LINKS.evidence, LINKS.contact];
    evidenceNotes.push('רצון טוב אינו הוכחת השפעה. הגדירו מראש אות מועיל ותעדו גם תוצאה שלא הצליחה.');
  }

  if (isTech) {
    evidenceNotes.push('גישה לתוכנית, כלי או תשתית אינה שותפות רשמית. ציינו סטטוס ותאריך רק אם יש תיעוד.');
    evidenceNotes.push('אל תזינו לשירות חיצוני מידע של קטינים, פרטים רגישים או חומר שלא ניתנה רשות לעבד.');
  }
  if (isPersonal) {
    evidenceNotes.push('הפרידו בין זיכרון אישי לבין עובדה שניתנת לאימות.');
    evidenceNotes.push('אל תחשפו פרטים מזהים של ילדים או אנשים שלא נתנו הסכמה.');
  }
  if (/\d/.test(text)) evidenceNotes.push('כל מספר ציבורי צריך מקור ותאריך observation.');
  if (/שותף|מיקרוסופט|ממשלה|עירייה|תפקיד|מועמד|רשמי/.test(query)) evidenceNotes.push('בדקו אם מדובר בשותפות, חברות בתוכנית, תמיכה, פגישה או כוונה. אלה אינם אותו דבר.');

  if (creatorMode === 'create' && !isBlocked) reflection = 'יש מספיק חומר כדי ליצור. עכשיו מפסיקים להסביר את הרעיון ומתחילים לבנות את החוויה.';
  if (creatorMode === 'momentum') {
    reflection = 'המטרה כרגע אינה יצירת המופת. המטרה היא רצף שמייצר ביטחון, חומר ולמידה.';
    nextStep = 'הגדירו משימה של 15 דקות בלבד וסיימו אותה לפני שיפור נוסף.';
    today = 'צרו טיוטה אחת ושמרו אותה בשם ברור עם תאריך.';
    thisWeek = 'השלימו שלושה ניסויים קטנים במקום פרויקט אחד ענק שלא יוצא לאור.';
  }
  if (creatorMode === 'impact') {
    reflection = isImpact ? reflection : 'השפעה מתחילה בהבנה מדויקת של אדם, צורך והפעולה הקטנה ביותר שיכולה להועיל.';
    nextStep = isImpact ? nextStep : 'בחרו אדם או קהילה אחת וכתבו מה הייתם רוצים שיהיה עבורם קל, בטוח או אפשרי יותר.';
    today = isImpact ? today : 'אמתו את הצורך בשיחה אחת לפני בחירת כלי או פתרון.';
    thisWeek = isImpact ? thisWeek : 'בנו ניסוי של שבעה ימים, עם הסכמה, גבול פרטיות ומדד אנושי אחד.';
  }

  const firstSentence = text.split(/[.!?\n]/).find(Boolean)?.trim();
  return {
    reflection,
    goal: firstSentence || 'להפוך כוונה לתוכן ברור ולצעד מעשי.',
    next_step: nextStep,
    today,
    this_week: thisWeek,
    content_seed: { hook, angle, outline },
    evidence_notes: evidenceNotes,
    links,
    mode: 'local-coach',
  };
}

function creatorInstructions() {
  return [
    'You are 7YA Create, a positive and practical creator companion.',
    'The experience is hosted by the public method and work of Igor Vepretski, but you are not Igor and must not imitate his voice.',
    'Help the user turn intention into clarity, content and action.',
    'When the user wants public good or impact, start with one beneficiary and one validated need, then design a small safe experiment with consent, privacy boundaries and a measurable human signal.',
    'Be encouraging without empty praise, manipulation, mystical certainty or guaranteed success.',
    'Do not diagnose mental health conditions.',
    'Never claim to be Igor Vepretski or speak on his behalf.',
    'Never invent achievements, metrics, partners, roles, dates or outcomes.',
    'Protect private family, minors, legal, medical, financial, credential and operational-security information.',
    'For political, legal, crisis or reputation-sensitive content, label the output draft-only and recommend review.',
    'Return only valid JSON with keys reflection, goal, next_step, today, this_week, content_seed, evidence_notes, links and mode.',
    'content_seed must contain hook, angle and outline. links must contain at most three objects with label and href using public 7YA routes.',
    'Use the visitor language. Keep the response useful and concise.',
  ].join(' ');
}

function guideInstructions() {
  return [
    'You are 7YA AI, the public guide for Igor Vepretski, StartOn and 7YA.',
    'Answer in the visitor language and remain concise, direct and human-first.',
    'Never claim to be Igor, never speak on his behalf, and never invent achievements, metrics, partners, roles, dates or outcomes.',
    'Distinguish verified facts from documented material, self-attested biography, plans and pending claims.',
    'Do not reveal family, minors, finances, legal matters, medical data, addresses, credentials, secrets or operational-security information.',
    'Core principle: people are the mission; AI is a tool; evidence comes before amplification.',
  ].join(' ');
}

function sanitizePath(value) {
  const path = typeof value === 'string' ? value : '/';
  return /^\/[a-z0-9/_-]*$/i.test(path) ? path.slice(0, 180) : '/';
}

function parseCreatorJson(text) {
  const cleaned = String(text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed !== 'object' || !parsed.next_step) throw new Error('Creator JSON missing contract');
  return parsed;
}

async function withTimeout(task, timeoutMs = PROVIDER_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await task(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

async function callNvidia({ message, currentPath, mode, creatorMode }) {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) return null;
  const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-nano-30b-a3b';
  const instructions = mode === 'creator' ? creatorInstructions() : guideInstructions();

  const result = await withTimeout(async (signal) => {
    const apiResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: `Current public route: ${currentPath}\nInteraction mode: ${mode}\nCreator mode: ${creatorMode}\nVisitor: ${message}` },
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: mode === 'creator' ? 800 : 480,
        stream: false,
      }),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data?.error?.message || `NVIDIA request failed (${apiResponse.status})`);
    const output = data?.choices?.[0]?.message?.content?.trim();
    if (!output) throw new Error('Empty NVIDIA response');
    return output;
  });

  return { text: result, provider: 'nvidia', model };
}

function extractOpenAIText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) return content.text.trim();
    }
  }
  return '';
}

async function callOpenAI({ message, currentPath, mode, creatorMode }) {
  if (!process.env.OPENAI_API_KEY) return null;
  const model = process.env.OPENAI_MODEL || 'gpt-5.6';
  const instructions = mode === 'creator' ? creatorInstructions() : guideInstructions();

  const result = await withTimeout(async (signal) => {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        store: false,
        instructions,
        input: `Current public route: ${currentPath}\nInteraction mode: ${mode}\nCreator mode: ${creatorMode}\nVisitor: ${message}`,
        max_output_tokens: mode === 'creator' ? 700 : 420,
      }),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data?.error?.message || `OpenAI request failed (${apiResponse.status})`);
    const output = extractOpenAIText(data);
    if (!output) throw new Error('Empty OpenAI response');
    return output;
  });

  return { text: result, provider: 'openai', model };
}

function providerOrder() {
  const allowed = new Set(['nvidia', 'openai']);
  const configured = String(process.env.AI_PROVIDER_ORDER || 'nvidia,openai')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(value => allowed.has(value));
  return configured.length ? [...new Set(configured)] : ['nvidia', 'openai'];
}

async function callProvider(context) {
  const callers = { nvidia: callNvidia, openai: callOpenAI };
  for (const provider of providerOrder()) {
    try {
      const result = await callers[provider](context);
      if (result) return result;
    } catch (error) {
      console.error(`7YA AI ${provider} fallback`, error?.message || error);
    }
  }
  return null;
}

module.exports = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  if (!withinRateLimit(request)) {
    response.statusCode = 429;
    response.setHeader('Retry-After', '60');
    response.end(JSON.stringify({ error: 'Too many requests' }));
    return;
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const currentPath = sanitizePath(request.body?.path);
  const mode = request.body?.mode === 'creator' ? 'creator' : 'guide';
  const creatorMode = ['clarify', 'create', 'momentum', 'impact'].includes(request.body?.creator_mode) ? request.body.creator_mode : 'clarify';

  if (!message || message.length > 1600) {
    response.statusCode = 422;
    response.end(JSON.stringify({ error: 'message must be 1-1600 characters' }));
    return;
  }

  const fallback = mode === 'creator'
    ? localCreatorCoach(message, creatorMode)
    : { ...infoAnswer(message, currentPath), mode: 'local-evidence-guide' };

  const result = await callProvider({ message, currentPath, mode, creatorMode });
  if (!result) {
    response.statusCode = 200;
    response.end(JSON.stringify({ ...fallback, provider: 'local', model: 'deterministic-evidence-guide' }));
    return;
  }

  try {
    response.statusCode = 200;
    if (mode === 'creator') {
      const parsed = parseCreatorJson(result.text);
      response.end(JSON.stringify({ ...parsed, mode: `${result.provider}-creator`, provider: result.provider, model: result.model }));
    } else {
      response.end(JSON.stringify({ answer: result.text, links: fallback.links, mode: `${result.provider}-guide`, provider: result.provider, model: result.model }));
    }
  } catch (error) {
    console.error('7YA AI response contract fallback', error?.message || error);
    response.statusCode = 200;
    response.end(JSON.stringify({ ...fallback, provider: 'local', model: 'deterministic-evidence-guide' }));
  }
};
