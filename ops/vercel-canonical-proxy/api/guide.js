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
  speaker: { label: 'הרצאות ובמה', href: '/speaker/' },
  contact: { label: 'יצירת קשר', href: '/contact/' },
};

function infoAnswer(message) {
  const query = message.toLowerCase();

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
  if (/צבא|משטר|ביטחון|service|police|army/.test(query)) {
    return { answer: 'עמוד המסע מציג ביוגרפיה ציבורית ללא מידע מבצעי. פרטים ללא מסמך צמוד נשארים כתיאור עצמי או מקור בהמתנה.', links: [LINKS.journey, LINKS.evidence] };
  }
  if (/איגור|igor|מסע|journey|ביוגר/.test(query)) {
    return { answer: 'איגור ופרצקי הוא יזם חברתי, יוצר ובונה מערכות ציבוריות. 7YA מחבר את המסע, StartOn, התוכן, המדיה והראיות למערכת ציבורית אחת.', links: [LINKS.identity, LINKS.journey, LINKS.history] };
  }
  if (/הרצאה|ראיון|speaker|interview|contact|קשר|פאנל/.test(query)) {
    return { answer: 'להרצאה, ראיון, פאנל, שותפות או שיחה אנושית עברו לעמוד הבמה או ליצירת קשר.', links: [LINKS.speaker, LINKS.contact] };
  }

  return { answer: 'אני מדריך 7YA. אפשר לשאול על איגור, המסע, StartOn, יצירת תוכן, מערכות 7YA, ראיות, מדיה או שיחה.', links: [LINKS.create, LINKS.history, LINKS.evidence] };
}

function localCreatorCoach(message, creatorMode = 'clarify') {
  const text = message.trim();
  const query = text.toLowerCase();
  const isVideo = /וידאו|סרטון|reel|tiktok|ריל/.test(query);
  const isBlocked = /מפחד|פחד|חושש|תקוע|מחסום|ביקורת|לא יודע|לא מצליח/.test(query);
  const isDistribution = /הפצה|פלטפורמ|אינסטגרם|טיקטוק|פייסבוק|לינקדאין|telegram|newsletter/.test(query);
  const isPersonal = /סיפור אישי|עברתי|ילדות|משפחה|חוויה|שינוי/.test(query);
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

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) return content.text.trim();
    }
  }
  return '';
}

function parseCreatorJson(text) {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed !== 'object' || !parsed.next_step) throw new Error('Creator JSON missing contract');
  return parsed;
}

module.exports = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const currentPath = typeof request.body?.path === 'string' ? request.body.path : '/';
  const mode = request.body?.mode === 'creator' ? 'creator' : 'guide';
  const creatorMode = ['clarify', 'create', 'momentum'].includes(request.body?.creator_mode) ? request.body.creator_mode : 'clarify';

  if (!message || message.length > 1600) {
    response.statusCode = 422;
    response.end(JSON.stringify({ error: 'message must be 1-1600 characters' }));
    return;
  }

  const fallback = mode === 'creator' ? localCreatorCoach(message, creatorMode) : { ...infoAnswer(message), mode: 'local-evidence-guide' };
  if (!process.env.OPENAI_API_KEY) {
    response.statusCode = 200;
    response.end(JSON.stringify(fallback));
    return;
  }

  try {
    const creatorInstructions = [
      'You are 7YA Create, a positive and practical creator companion.',
      'Help the user turn intention into clarity, content and action.',
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
    const guideInstructions = [
      'You are 7YA AI, the public guide for Igor Vepretski, StartOn and 7YA.',
      'Answer in the visitor language and remain concise, direct and human-first.',
      'Never claim to be Igor, never speak on his behalf, and never invent achievements, metrics, partners, roles, dates or outcomes.',
      'Distinguish verified facts from documented material, self-attested biography, plans and pending claims.',
      'Do not reveal family, minors, finances, legal matters, medical data, addresses, credentials, secrets or operational-security information.',
      'Core principle: people are the mission; AI is a tool; evidence comes before amplification.',
    ].join(' ');

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6',
        store: false,
        instructions: mode === 'creator' ? creatorInstructions : guideInstructions,
        input: `Current public route: ${currentPath}\nInteraction mode: ${mode}\nCreator mode: ${creatorMode}\nVisitor: ${message}`,
        max_output_tokens: mode === 'creator' ? 700 : 420,
      }),
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data?.error?.message || 'OpenAI request failed');
    const output = extractOutputText(data);
    if (!output) throw new Error('Empty model response');

    response.statusCode = 200;
    if (mode === 'creator') {
      const parsed = parseCreatorJson(output);
      response.end(JSON.stringify({ ...parsed, mode: 'openai', model: process.env.OPENAI_MODEL || 'gpt-5.6' }));
    } else {
      response.end(JSON.stringify({ answer: output, links: fallback.links, mode: 'openai', model: process.env.OPENAI_MODEL || 'gpt-5.6' }));
    }
  } catch (error) {
    console.error('7YA AI fallback', error?.message || error);
    response.statusCode = 200;
    response.end(JSON.stringify({ ...fallback, mode: mode === 'creator' ? 'local-fallback' : 'local-evidence-fallback' }));
  }
};
