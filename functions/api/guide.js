const UPSTREAM = 'https://697a008fddc309b142.v2.appdeploy.ai/api/companion';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
};

const links = {
  identity: { label: 'הסיפור של איגור', href: '/igor-vepretski/' },
  journey: { label: 'המסע', href: '/journey/' },
  create: { label: 'מסלול היצירה', href: '/create/' },
  starton: { label: 'StartOn', href: '/starton/' },
  evidence: { label: 'מקורות וראיות', href: '/evidence/' },
  influence: { label: 'הפיד וההשפעה', href: '/influence/' },
  contact: { label: 'דברו איתי', href: '/contact/' },
};

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers });
const clean = (value, max = 1600) => String(value || '').trim().slice(0, max);
const safePath = value => /^\/[a-z0-9/_#?-]*$/i.test(String(value || '')) ? String(value).slice(0, 220) : '/';
const localeOf = value => /^ru/i.test(String(value || '')) ? 'ru' : /^en/i.test(String(value || '')) ? 'en' : 'he';
const modeOf = body => body.mode === 'creator' ? 'build' : 'guide';

function fallbackGuide(message, path, locale) {
  const q = message.toLowerCase();
  const he = locale === 'he';
  if (/starton|נוער|youth|молод/.test(q)) return {
    answer: he ? 'StartOn מחבר טכנולוגיה, יצירה ושייכות לנוער. אפשר להתחיל מהצורך האנושי, לבדוק מה כבר מתועד, ואז לבחור ניסוי קטן שאפשר לבצע.' : 'StartOn connects technology, creation and belonging for youth. Start with the human need, inspect what is documented, then choose a small executable experiment.',
    links: [links.starton, links.evidence, links.contact],
  };
  if (/איגור|igor|игор|סיפור|journey|путь/.test(q)) return {
    answer: he ? 'הדרך של איגור משמשת כאן כדוגמה לתהליך: ניסיון חיים, יצירה, פעולה ציבורית ובנייה של StartOn ו־7YA. המטרה היא לא לחקות אותו אלא להשתמש במבנה כדי לבנות את הדרך שלכם.' : 'Igor’s public journey is used here as a working example: lived experience, creation, public action, and building StartOn and 7YA. The point is not imitation; it is using the structure to build your own path.',
    links: [links.identity, links.journey, links.evidence],
  };
  if (/מקור|ראי|evidence|proof|source|доказ/.test(q)) return {
    answer: he ? 'מתחילים ממקור, מפרידים עובדה מפרשנות, ואז מחליטים מה אפשר לבנות עליה. אם אין מקור מספיק טוב, מסמנים את הפער ולא ממציאים השלמה.' : 'Start from a source, separate fact from interpretation, then decide what can responsibly be built on it. If evidence is incomplete, mark the gap instead of inventing certainty.',
    links: [links.evidence, links.influence],
  };
  return {
    answer: he ? 'נמשיך מתוך השאלה שלכם: נגדיר מה אתם רוצים להבין או לשנות, נבחר כיוון אחד, ואז נהפוך אותו לצעד שאפשר לבצע.' : 'We continue from your question: define what you want to understand or change, choose one direction, then turn it into a move you can execute.',
    links: path.startsWith('/starton') ? [links.starton, links.evidence] : [links.create, links.journey, links.evidence],
  };
}

function fallbackCreator(message, creatorMode, locale) {
  const he = locale === 'he';
  const goal = clean(message.split(/[.!?\n]/).find(Boolean) || message, 220);
  const impact = creatorMode === 'impact';
  const momentum = creatorMode === 'momentum';
  return {
    reflection: he ? 'יש כאן כיוון. עכשיו הופכים אותו לגרסה קטנה שאפשר לראות, לבדוק ולשפר.' : 'There is a direction here. Now turn it into a small version that can be seen, tested, and improved.',
    goal: goal || (he ? 'להפוך כוונה לתוצאה שאפשר לראות.' : 'Turn intention into a visible result.'),
    next_step: impact
      ? (he ? 'בחרו אדם או קהילה אחת, צורך אחד וניסוי קטן אחד.' : 'Choose one person or community, one need, and one small experiment.')
      : momentum
        ? (he ? 'בחרו משימה אחת של 15 דקות וסיימו אותה לפני שיפור נוסף.' : 'Choose one 15-minute task and finish it before improving anything else.')
        : (he ? 'הגדירו למי התוצר מיועד ומה הוא אמור לשנות עבורו.' : 'Define who the output is for and what it should change for them.'),
    today: he ? 'צרו גרסה ראשונה קטנה ושמרו אותה כתוצר, לא כרעיון.' : 'Create a small first version and save it as an output, not an idea.',
    this_week: he ? 'הראו אותה לאדם אחד, אספו תגובה אחת ושפרו דבר אחד בלבד.' : 'Show it to one person, collect one response, and improve one thing only.',
    content_seed: {
      hook: he ? 'לא צריך לחכות לרגע המושלם כדי להתחיל לבנות.' : 'You do not need the perfect moment to start building.',
      angle: he ? 'מרעיון לתוצר קטן, מתועד ובר־שיפור.' : 'From idea to a small, documented, improvable output.',
      outline: he ? ['מה אני רוצה לשנות', 'למי זה מיועד', 'הגרסה הראשונה', 'הצעד הבא'] : ['What I want to change', 'Who it is for', 'The first version', 'The next move'],
    },
    evidence_notes: [],
    links: impact ? [links.starton, links.evidence, links.contact] : [links.create, links.influence, links.evidence],
    mode: 'continuity-coach',
  };
}

function actionLinks(data, fallback) {
  const result = [];
  for (const item of Array.isArray(data.actions) ? data.actions : []) {
    const href = clean(item && item.href, 220);
    if (/^\/[a-z0-9/_#?-]*$/i.test(href)) result.push({ label: clean(item.label, 80) || href, href });
  }
  for (const item of fallback) if (!result.some(existing => existing.href === item.href)) result.push(item);
  return result.slice(0, 3);
}

function creatorShape(data, message, creatorMode, locale, fallback) {
  const he = locale === 'he';
  const checkpoint = Array.isArray(data.checkpoint && data.checkpoint.items) ? data.checkpoint.items.filter(Boolean).slice(0, 4) : [];
  const suggestions = Array.isArray(data.suggestions) ? data.suggestions.filter(Boolean).slice(0, 4) : [];
  const reply = clean(data.reply, 5200) || fallback.reflection;
  const firstSentence = clean(reply.split(/(?<=[.!?])\s+/)[0] || reply, 360);
  return {
    reflection: clean(data.spotlight, 420) || firstSentence || fallback.reflection,
    goal: clean(message, 300) || fallback.goal,
    next_step: clean(checkpoint[0] || suggestions[0], 500) || fallback.next_step,
    today: clean(checkpoint[1] || suggestions[1], 500) || fallback.today,
    this_week: clean(checkpoint[2] || suggestions[2], 500) || fallback.this_week,
    content_seed: {
      hook: firstSentence || fallback.content_seed.hook,
      angle: clean(data.spotlight, 420) || fallback.content_seed.angle,
      outline: checkpoint.length ? checkpoint : suggestions.length ? suggestions : fallback.content_seed.outline,
    },
    evidence_notes: Array.isArray(data.evidence) ? data.evidence.slice(0, 3).map(item => (he ? 'מקור: ' : 'Source: ') + clean(item.label, 120)) : [],
    links: actionLinks(data, fallback.links),
    mode: clean(data.provider, 40) + '-creator',
    provider: clean(data.provider, 40) || 'local',
    model: clean(data.model, 120) || '7ya',
    state: data.state || null,
  };
}

async function proxyCompanion(body, request) {
  const message = clean(body.message, 1600);
  const locale = localeOf(body.locale || request.headers.get('accept-language'));
  const path = safePath(body.path);
  const messages = Array.isArray(body.messages)
    ? body.messages.slice(-12).map(item => ({ role: item && item.role === 'assistant' ? 'assistant' : 'user', content: clean(item && item.content, 3000) })).filter(item => item.content)
    : [{ role: 'user', content: message }];
  if (!messages.length || messages[messages.length - 1].content !== message) messages.push({ role: 'user', content: message });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14500);
  try {
    const response = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        messages,
        state: body.state || null,
        locale,
        context: { dimension: '7ya', section: path, path },
        mode: modeOf(body),
        journeyContext: { lastMeaningfulStep: message, chosenDirection: body.mode === 'creator' ? message : '', visitedChapters: [], resonances: [] },
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || typeof data !== 'object') throw new Error('upstream');
    return { data, locale, path };
  } finally {
    clearTimeout(timeout);
  }
}

async function buildGuideResult(body, request) {
  const message = clean(body && body.message, 1600);
  if (!message) return { payload: { error: 'message required' }, status: 422, enginePath: 'invalid' };

  const locale = localeOf(body.locale || request.headers.get('accept-language'));
  const path = safePath(body.path);
  const creatorMode = ['create', 'momentum', 'impact', 'clarify'].includes(body.creator_mode) ? body.creator_mode : 'clarify';
  const creator = body.mode === 'creator';
  const fallback = creator ? fallbackCreator(message, creatorMode, locale) : fallbackGuide(message, path, locale);

  try {
    const proxied = await proxyCompanion(body, request);
    const data = proxied.data;
    const payload = creator
      ? creatorShape(data, message, creatorMode, locale, fallback)
      : {
          answer: clean(data.reply, 5200) || fallback.answer,
          links: actionLinks(data, fallback.links),
          mode: '7ya-guide',
          provider: clean(data.provider, 40) || 'local',
          model: clean(data.model, 120) || '7ya',
          state: data.state || null,
        };
    return { payload, status: 200, enginePath: 'upstream' };
  } catch {
    return {
      payload: { ...fallback, provider: 'local', model: '7ya-continuity', state: body.state || null },
      status: 200,
      enginePath: 'continuity',
    };
  }
}

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid request' }, 400);
  }
  const result = await buildGuideResult(body, request);
  return json(result.payload, result.status);
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  if (url.searchParams.get('probe') !== '1') {
    return json({ status: 'ready', experience: '7ya-growth-companion', upstream: 'server-side', secrets_exposed: false });
  }

  const body = {
    message: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.',
    messages: [{ role: 'user', content: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.' }],
    locale: 'he',
    path: '/',
    mode: 'creator',
    creator_mode: 'momentum',
  };
  const result = await buildGuideResult(body, request);
  const payload = result.payload || {};
  const outline = payload.content_seed && Array.isArray(payload.content_seed.outline) ? payload.content_seed.outline : [];
  const visitorPathReady = Boolean(
    result.status === 200 &&
    clean(payload.reflection, 20) &&
    clean(payload.goal, 20) &&
    clean(payload.next_step, 20) &&
    clean(payload.today, 20) &&
    clean(payload.this_week, 20) &&
    clean(payload.content_seed && payload.content_seed.hook, 20) &&
    outline.length
  );
  return json({
    status: visitorPathReady ? 'ready' : 'degraded',
    experience: '7ya-growth-companion',
    visitor_path_ready: visitorPathReady,
    engine_path: result.enginePath,
    response_present: Boolean(clean(payload.reflection, 20)),
    next_step_present: Boolean(clean(payload.next_step, 20)),
    today_present: Boolean(clean(payload.today, 20)),
    week_present: Boolean(clean(payload.this_week, 20)),
    content_seed_present: Boolean(clean(payload.content_seed && payload.content_seed.hook, 20) && outline.length),
    secrets_exposed: false,
  }, visitorPathReady ? 200 : 503);
}
