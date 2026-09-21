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
    'Answer in ' + language + '. Be direct, substantive and practical.',
    creator
      ? 'Return ONLY valid JSON with keys reply, spotlight, suggestions, checkpoint and actions. suggestions is an array of up to 3 short strings. checkpoint is {title,items} with up to 4 concrete steps. actions is an array of up to 2 objects with label and an internal 7YA href.'
      : 'Return ONLY valid JSON with keys reply, spotlight, suggestions, actions. suggestions is an array of up to 3 short strings. actions is an array of up to 2 objects with label and an internal 7YA href.'
  ].join(' ');
}

function parseProviderPayload(text, body) {
  const raw = clean(text, 7000).replace(/^\`\`\`json\s*/i, '').replace(/\s*\`\`\`$/i, '').trim();
  let parsed = null;
  try { parsed = JSON.parse(raw); } catch {}
  const source = parsed && typeof parsed === 'object' ? parsed : { reply: raw };
  const suggestions = Array.isArray(source.suggestions) ? source.suggestions.map(item => clean(item, 180)).filter(Boolean).slice(0, 3) : [];
  const actions = Array.isArray(source.actions) ? source.actions.map(item => ({
    label: clean(item && item.label, 100),
    href: safePath(item && item.href),
  })).filter(item => item.label && item.href !== '/') .slice(0, 2) : [];
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

async function callCloudflareNvidia(body, request, env) {
  const key = providerKey(env);
  if (!key) return null;
  const locale = localeOf(body.locale || request.headers.get('accept-language'));
  const creator = body.mode === 'creator';
  const model = providerModel(env);
  const history = Array.isArray(body.messages)
    ? body.messages.slice(-10).map(item => ({
        role: item && item.role === 'assistant' ? 'assistant' : 'user',
        content: clean(item && item.content, 2400),
      })).filter(item => item.content)
    : [];
  const message = clean(body.message, 1600);
  if (!history.length || history[history.length - 1].content !== message) history.push({ role: 'user', content: message });
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
  const startedAt = Date.now();
  try {
    const response = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        messages,
        state: body.state || null,
        locale,
        context: {
          dimension: '7ya',
          section: path,
          path,
          experience: body.experience === 'speak-with-igor' ? 'speak-with-igor' : '7ya-guide',
          purpose: 'Help the visitor clarify what matters, express it in their own voice, and choose one useful next move.',
          principles: [
            'conversation-first',
            'ask before assuming',
            'self-expression over imitation',
            'use Igor public evidence for factual claims',
            'offer modern creation and technology tools when useful',
            'if drawing on the Zohar or Jewish wisdom, label it explicitly and keep it optional',
            'never present the assistant as live Igor'
          ],
        },
        mode: modeOf(body),
        journeyContext: {
          lastMeaningfulStep: message,
          chosenDirection: body.mode === 'creator' || body.experience === 'speak-with-igor' ? message : '',
          visitedChapters: [],
          resonances: []
        },
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(`upstream_http_${response.status}`);
    if (!data || typeof data !== 'object') throw new Error('upstream_invalid_json');
    return { data, locale, path, latencyMs: Date.now() - startedAt };
  } finally {
    clearTimeout(timeout);
  }
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
    return { payload, status: 200, enginePath: 'upstream', engineDetail: 'upstream_ok', engineLatencyMs: proxied.latencyMs };
  } catch (error) {
    return {
      payload: { ...fallback, provider: 'local', model: '7ya-continuity', state: body.state || null },
      status: 200,
      enginePath: 'continuity',
      engineDetail: [directError, engineErrorCode(error)].filter(Boolean).join('+'),
      engineLatencyMs: null,
    };
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid request' }, 400);
  }
  const result = await buildGuideResult(body, request, env);
  return json(result.payload, result.status);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get('probe') !== '1') {
    return json({ status: 'ready', experience: 'speak-with-igor', upstream: 'server-side', secrets_exposed: false });
  }

  const body = {
    message: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.',
    messages: [{ role: 'user', content: 'תן צעד ראשון קטן שאפשר לבצע היום כדי להפוך רעיון לתוצר.' }],
    locale: 'he',
    path: '/',
    mode: 'creator',
    creator_mode: 'momentum',
  };
  const result = await buildGuideResult(body, request, env);
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
    experience: 'speak-with-igor',
    visitor_path_ready: visitorPathReady,
    engine_path: result.enginePath,
    engine_detail: result.engineDetail || null,
    provider_env: {
      nvidia_nim: Boolean(env && env.NVIDIA_NIM_API_KEY),
      nvidia: Boolean(env && env.NVIDIA_API_KEY),
      ngc: Boolean(env && env.NGC_API_KEY),
    },
    upstream_latency_ms: Number.isFinite(result.engineLatencyMs) ? result.engineLatencyMs : null,
    response_present: Boolean(clean(payload.reflection, 20)),
    next_step_present: Boolean(clean(payload.next_step, 20)),
    today_present: Boolean(clean(payload.today, 20)),
    week_present: Boolean(clean(payload.this_week, 20)),
    content_seed_present: Boolean(clean(payload.content_seed && payload.content_seed.hook, 20) && outline.length),
    secrets_exposed: false,
  }, visitorPathReady ? 200 : 503);
}
