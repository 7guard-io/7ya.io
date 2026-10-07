const CHAT_RELEASE = '7ya-chat-20261007-v4';
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
const localeOf = value => /^ru/i.test(String(value || '')) ? 'ru' : /^ar/i.test(String(value || '')) ? 'ar' : /^en/i.test(String(value || '')) ? 'en' : 'he';
const modeOf = body => body.mode === 'creator' ? 'build' : 'guide';
const providerKey = env => clean(env && (env.NVIDIA_NIM_API_KEY || env.NVIDIA_API_KEY), 1200);
const providerModel = env => clean(env && env.NVIDIA_MODEL, 160) || 'nvidia/nemotron-3-super-120b-a12b';

function providerInstructions(locale, creator) {
  const language = locale === 'he' ? 'Hebrew' : locale === 'ru' ? 'Russian' : locale === 'ar' ? 'Arabic' : 'English';
  return [
    'You are Speak with Igor, a transparent AI conversation inside 7YA. You are not Igor Vepretski and must never pretend to be a live human or speak on his behalf.',
    'Keep the visitor at the center. Help them clarify what matters, express it in their own voice, and turn it into one responsible executable next move.',
    'Igor public work can be used as a documented example, never as private memory or invented authority.',
    'Never invent metrics, roles, relationships, endorsements, dates or evidence. Never expose private family, minors, medical, legal, financial, credential, address or security information.',
    'When Jewish wisdom or the Zohar is genuinely relevant, label it explicitly as an optional lens; never present spiritual claims as factual certainty.',
    'Use modern AI, research, writing, video and creation tools only when they materially help the visitor act.',
    'Use the whole conversation. A short reply such as sales or yes answers your preceding question; do not restart or ask the same question again. Offer a concrete useful answer before asking at most one relevant follow-up. Do not repeat greetings or generic clarification.',
    'Public source context: Igor Vepretski is the person behind 7YA (public biography: /igor-vepretski/). StartOn is his social mission connecting technology, learning, creation and belonging for youth (/starton/). 7YA organizes his public archive and sources (/evidence/). For facts beyond this context, point to a source or acknowledge that you cannot verify them.',
    'Answer in ' + language + '. Keep the answer under 80 words, finish every sentence, and avoid markdown formatting. Give 2-3 concrete steps, a usable example, or a draft that directly advances the visitor goal. Do not answer a short follow-up by offering another menu of topics. If a business sells to agencies and the visitor says sales, use that context to suggest a focused offer, decision-maker, outreach and follow-up; ask what the business sells only after a useful next step. Your advice is a suggestion, not Igor personal speech.',
    'Never invent internal URLs. Do not link a sales or business question to StartOn. Only use a source route when the visitor is actually asking about that source.',
    creator
      ? 'Return ONLY valid JSON with keys reply, spotlight, suggestions, checkpoint and actions. suggestions is an array of up to 3 short strings. checkpoint is {title,items} with up to 4 concrete steps. actions is an array of up to 2 objects with label and an internal 7YA href.'
      : 'Return the answer as plain text, with short numbered steps when useful. Do not return JSON. Ask at most one focused follow-up question.'
  ].join(' ');
}

function parseProviderPayload(text, body) {
  const raw = typeof text === 'string' ? clean(text, 7000).replace(/^\`\`\`json\s*/i, '').replace(/\s*\`\`\`$/i, '').trim() : '';
  let parsed = text && typeof text === 'object' ? text : null;
  if (!parsed) { try { parsed = JSON.parse(raw); } catch {} }
  const source = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : { reply: raw };
  if (typeof source.reply !== 'string' || !clean(source.reply)) throw new Error('provider_empty_reply');
  const suggestions = Array.isArray(source.suggestions) ? source.suggestions.map(item => clean(item, 180)).filter(Boolean).slice(0, 3) : [];
  const actions = Array.isArray(source.actions) ? source.actions.map(item => ({
    label: clean(item && item.label, 100),
    href: safePath(item && item.href),
  })).filter(item => item.label && Object.values(links).some(link => link.href === item.href)).slice(0, 2) : [];
  const checkpointRaw = source.checkpoint && typeof source.checkpoint === 'object' ? source.checkpoint : null;
  const checkpointItems = checkpointRaw && Array.isArray(checkpointRaw.items)
    ? checkpointRaw.items.map(item => clean(item, 260)).filter(Boolean).slice(0, 4)
    : [];
  return {
    reply: clean(source.reply, 5200) || raw,
    spotlight: clean(source.spotlight, 420),
    suggestions,
    actions,
    checkpoint: checkpointItems.length ? { title: clean(checkpointRaw.title, 140) || 'Next move', items: checkpointItems } : null,
    evidence: [],
    provider: 'nvidia',
    model: '',
    state: body.state || null,
  };
}

function conversationHistory(body) {
  const history = Array.isArray(body.messages) ? body.messages.slice(-8)
    .filter(item => item && ['user', 'assistant'].includes(item.role))
    .map(item => ({ role: item.role, content: clean(item.content, 1200) }))
    .filter(item => item.content) : [];
  const message = clean(body.message);
  const last = history[history.length - 1];
  if (!last || last.role !== 'user' || last.content !== message) history.push({ role: 'user', content: message });
  return history;
}

async function callWorkersAI(body, request, env) {
  if (!env?.AI?.run) return null;
  const model = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
  const startedAt = Date.now();
  let timeout;
  try {
    const data = await Promise.race([
      env.AI.run(model, {
        messages: [{ role: 'system', content: providerInstructions(localeOf(body.locale || request.headers.get('accept-language')), body.mode === 'creator') }, ...conversationHistory(body)],
        temperature: 0.2, max_tokens: 850, stream: false,
      }),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('workers_ai_timeout')), 30000); }),
    ]);
    const output = data?.response;
    if (!output) throw new Error('workers_ai_empty');
    const payload = parseProviderPayload(output, body);
    payload.model = model;
    payload.provider = 'cloudflare-ai';
    return { data: payload, latencyMs: Date.now() - startedAt };
  } finally { clearTimeout(timeout); }
}

async function callCloudflareNvidia(body, request, env) {
  const key = providerKey(env);
  if (!key) return null;
  const locale = localeOf(body.locale || request.headers.get('accept-language'));
  const creator = body.mode === 'creator';
  const model = providerModel(env);
  const history = conversationHistory(body);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 13500);
  const startedAt = Date.now();
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: providerInstructions(locale, creator) }, ...history],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: creator ? 1000 : 850,
        stream: false,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error('nvidia_http_' + response.status);
    const output = clean(data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content, 7000);
    if (!output) throw new Error('nvidia_empty');
    const payload = parseProviderPayload(output, body);
    payload.model = model;
    return { data: payload, latencyMs: Date.now() - startedAt };
  } finally {
    clearTimeout(timeout);
  }
}

const engineErrorCode = error => {
  const message = clean(error && error.message, 120).toLowerCase();
  if (error && error.name === 'AbortError') return 'upstream_timeout';
  if (/upstream_http_\d{3}/.test(message)) return message.match(/upstream_http_\d{3}/)[0];
  if (message.includes('upstream_invalid_json')) return 'upstream_invalid_json';
  if (message.includes('fetch') || error instanceof TypeError) return 'upstream_network';
  return 'upstream_error';
};

function fallbackGuide(message, path, locale) {
  const q = message.toLowerCase();
  const copy = {
    he: {
      starton: 'StartOn מחבר טכנולוגיה, יצירה ושייכות לנוער. אפשר להתחיל מהצורך האנושי, לבדוק מה כבר מתועד, ואז לבחור ניסוי קטן שאפשר לבצע.',
      igor: 'הדרך הציבורית של איגור משמשת כאן כדוגמה לתהליך: ניסיון חיים, יצירה, פעולה ציבורית ובנייה. המטרה אינה לחקות אותו אלא להשתמש בשיחה כדי לחדד את הדרך והקול שלכם.',
      evidence: 'מתחילים ממקור, מפרידים עובדה מפרשנות, ואז מחליטים מה אפשר לבנות עליה. אם אין מקור מספיק טוב, מסמנים את הפער ולא ממציאים השלמה.',
      default: 'נמשיך מתוך מה שחשוב לכם: נחדד מה אתם רוצים להבין, לבטא או לשנות, ואז נהפוך את זה לצעד קטן שאפשר לבצע.'
    },
    en: {
      starton: 'StartOn connects technology, creation and belonging for youth. Start with the human need, inspect what is documented, then choose a small executable experiment.',
      igor: 'Igor’s public journey is a working example of lived experience, creation, public action and building. The point is not to imitate him, but to use the conversation to clarify your own path and voice.',
      evidence: 'Start from a source, separate fact from interpretation, then decide what can responsibly be built on it. If evidence is incomplete, mark the gap instead of inventing certainty.',
      default: 'Start with what matters to you: clarify what you want to understand, express or change, then turn it into one small move you can actually take.'
    },
    ru: {
      starton: 'StartOn соединяет технологии, творчество и чувство принадлежности для подростков. Начните с человеческой потребности, проверьте, что уже подтверждено, и выберите небольшой выполнимый эксперимент.',
      igor: 'Публичный путь Игоря здесь служит рабочим примером: жизненный опыт, творчество, общественное действие и создание систем. Цель не в том, чтобы копировать его, а в том, чтобы через разговор точнее найти свой путь и голос.',
      evidence: 'Начните с источника, отделите факт от интерпретации и только потом решайте, что на этом можно строить. Если доказательств не хватает, обозначьте пробел, а не выдумывайте уверенность.',
      default: 'Начнём с того, что важно вам: уточним, что вы хотите понять, выразить или изменить, и превратим это в один небольшой реальный шаг.'
    },
    ar: {
      starton: 'يربط StartOn التكنولوجيا والإبداع والانتماء لدى الشباب. ابدأ بالحاجة الإنسانية، وافحص ما هو موثّق، ثم اختر تجربة صغيرة قابلة للتنفيذ.',
      igor: 'يُستخدم المسار العام لإيغور هنا كمثال عملي يجمع الخبرة الحياتية والإبداع والعمل العام والبناء. الهدف ليس تقليده، بل استخدام الحوار لتوضيح مسارك وصوتك أنت.',
      evidence: 'ابدأ بالمصدر، وافصل الحقيقة عن التفسير، ثم قرر ما الذي يمكن بناؤه بمسؤولية. إذا كانت الأدلة ناقصة، اذكر الفجوة بدل اختراع اليقين.',
      default: 'نبدأ مما يهمك أنت: نوضح ما تريد فهمه أو التعبير عنه أو تغييره، ثم نحوله إلى خطوة صغيرة قابلة للتنفيذ.'
    }
  }[locale] || null;
  const text = copy || {
    starton: 'StartOn connects technology, creation and belonging for youth.',
    igor: 'Use Igor’s public journey as an example, not a template to copy.',
    evidence: 'Separate fact from interpretation before acting.',
    default: 'Clarify what matters, then choose one executable next move.'
  };
  if (/starton|נוער|youth|молод|شباب/.test(q)) return {
    answer: text.starton,
    links: [links.starton, links.evidence, links.contact],
  };
  if (/איגור|igor|игор|إيغور|סיפור|journey|путь|مسار/.test(q)) return {
    answer: text.igor,
    links: [links.identity, links.journey, links.evidence],
  };
  if (/מקור|ראי|evidence|proof|source|доказ|دليل|مصدر/.test(q)) return {
    answer: text.evidence,
    links: [links.evidence, links.influence],
  };
  return {
    answer: text.default,
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

async function buildGuideResult(body, request, env) {
  const message = clean(body && body.message, 1600);
  if (!message) return { payload: { error: 'message required' }, status: 422, enginePath: 'invalid' };

  const locale = localeOf(body.locale || request.headers.get('accept-language'));
  const path = safePath(body.path);
  const creatorMode = ['create', 'momentum', 'impact', 'clarify'].includes(body.creator_mode) ? body.creator_mode : 'clarify';
  const creator = body.mode === 'creator';
  const fallback = creator ? fallbackCreator(message, creatorMode, locale) : fallbackGuide(message, path, locale);

  let directError = null;
  try {
    const direct = await callCloudflareNvidia(body, request, env);
    if (direct) {
      const data = direct.data;
      const payload = creator
        ? creatorShape(data, message, creatorMode, locale, fallback)
        : {
            answer: clean(data.reply, 5200) || fallback.answer,
            links: actionLinks(data, fallback.links),
            mode: '7ya-guide',
            provider: 'nvidia',
            model: clean(data.model, 120) || providerModel(env),
            state: data.state || null,
          };
      return { payload, status: 200, enginePath: 'nvidia', engineDetail: 'nvidia_ok', engineLatencyMs: direct.latencyMs };
    }
  } catch (error) {
    directError = engineErrorCode(error).replace(/^upstream_/, 'nvidia_');
    const messageCode = clean(error && error.message, 80).toLowerCase();
    if (/nvidia_http_\d{3}/.test(messageCode)) directError = messageCode.match(/nvidia_http_\d{3}/)[0];
    else if (messageCode.includes('nvidia_empty')) directError = 'nvidia_empty';
  }

  try {
    const worker = await callWorkersAI(body, request, env);
    if (worker) {
      const data = worker.data;
      const payload = creator ? creatorShape(data, message, creatorMode, locale, fallback) : {
        answer: data.reply, links: actionLinks(data, []), mode: '7ya-guide',
        provider: 'cloudflare-ai', model: data.model, state: null,
      };
      return { payload, status: 200, enginePath: 'cloudflare-ai', engineDetail: 'workers_ai_ok', engineLatencyMs: worker.latencyMs };
    }
  } catch (error) { directError = ['workers_ai_timeout', 'workers_ai_empty', 'provider_empty_reply'].includes(error?.message) ? error.message : 'workers_ai_unavailable'; }

  // Do not disguise a template as a successful conversational AI answer.
  if (!creator) return {
    payload: { error: 'chat_unavailable', retryable: true, provider: 'none' },
    status: 503, enginePath: 'unavailable', engineDetail: directError || 'provider_not_configured',
  };

  return {
    payload: { ...fallback, degraded: true, provider: 'local', model: '7ya-continuity', state: body.state || null },
    status: 200,
    enginePath: 'continuity',
    engineDetail: directError || 'local_first_party_fallback',
    engineLatencyMs: null,
  };
}

// Best-effort bounds per runtime isolate, including the public canary. This is
// deliberately not advertised as a globally atomic account spending limit.
const clients = new Map();
let budgetDay = -1;
let dailyAttempts = 0;
let minuteWindow = -1;
let minuteAttempts = 0;
async function reserveInference(request) {
  const now = Date.now();
  const day = Math.floor(now / 86400000);
  const minute = Math.floor(now / 60000);
  if (day !== budgetDay) { budgetDay = day; dailyAttempts = 0; clients.clear(); }
  if (minute !== minuteWindow) { minuteWindow = minute; minuteAttempts = 0; }
  const ip = request.headers.get('cf-connecting-ip') || 'anonymous';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const key = Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join('');
  const current = clients.get(key) || { minute, attempts: 0, daily: 0, active: false };
  if (current.minute !== minute) { current.minute = minute; current.attempts = 0; }
  if (current.active || current.attempts >= 6 || current.daily >= 20 || dailyAttempts >= 60 || minuteAttempts >= 15 || (!clients.has(key) && clients.size >= 2000)) return null;
  current.attempts++; current.daily++; current.active = true;
  clients.set(key, current); dailyAttempts++; minuteAttempts++;
  return () => { current.active = false; };
}
const limited = () => {
  const response = json({ error: 'rate_limited', retryable: true, release: CHAT_RELEASE }, 429);
  response.headers.set('retry-after', '60');
  return response;
};

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid request' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.message !== 'string' || body.message.length > 1600) return json({ error: 'invalid message' }, 422);
  const release = await reserveInference(request);
  if (!release) return limited();
  try {
    const result = await buildGuideResult(body, request, env);
    return json({ ...result.payload, release: CHAT_RELEASE }, result.status);
  } finally { release(); }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get('probe') !== '1') {
    return json({ release: CHAT_RELEASE, status: providerKey(env) || env?.AI?.run ? 'configured' : 'degraded', experience: 'speak-with-igor', runtime: 'cloudflare-pages', guide_fallback: 'none', creator_fallback: 'first-party-local', rate_limit_scope: 'runtime-isolate', secrets_exposed: false });
  }

  const body = {
    message: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.',
    messages: [{ role: 'user', content: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.' }],
    locale: 'he',
    path: '/',
    mode: 'guide',
  };
  const release = await reserveInference(request);
  if (!release) return limited();
  let result;
  try { result = await buildGuideResult(body, request, env); } finally { release(); }
  const payload = result.payload || {};
  const visitorPathReady = result.status === 200 && ['nvidia', 'cloudflare-ai'].includes(result.enginePath) && Boolean(clean(payload.answer));
  return json({
    release: CHAT_RELEASE,
    status: visitorPathReady ? 'ready' : 'degraded',
    experience: 'speak-with-igor',
    visitor_path_ready: visitorPathReady,
    engine_path: result.enginePath,
    engine_detail: result.engineDetail || null,
    runtime: 'cloudflare-pages',
    external_runtime_dependency: false,
    provider_env: {
      nvidia_nim: Boolean(env && env.NVIDIA_NIM_API_KEY),
      nvidia: Boolean(env && env.NVIDIA_API_KEY),
      ngc: Boolean(env && env.NGC_API_KEY),
      workers_ai: Boolean(env?.AI?.run),
    },
    upstream_latency_ms: Number.isFinite(result.engineLatencyMs) ? result.engineLatencyMs : null,
    response_present: Boolean(clean(payload.answer)),
    secrets_exposed: false,
  }, visitorPathReady ? 200 : 503);
}
