import fs from 'node:fs';

const routes = [
  '/',
  '/igor-vepretski/',
  '/evidence/',
  '/journey/',
  '/starton/',
  '/oracle/',
  '/business/',
  '/talk/',
  '/contact/',
  '/social/',
  '/pass/',
  '/radar/',
  '/speaker/',
  '/media/',
  '/7ya/',
  '/influence/',
  '/articles/'
];

const baseUrl = new URL(
  process.env.LIVE_BASE_URL || process.argv[2] || 'https://7ya.io/'
);
const maxAttempts = positiveInteger('LIVE_CHECK_ATTEMPTS', 6);
const requestTimeoutMs = positiveInteger('LIVE_CHECK_TIMEOUT_MS', 10_000);
const concurrency = positiveInteger('LIVE_CHECK_CONCURRENCY', 6);
const pending = new Set(routes);
const results = new Map();

function positiveInteger(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const value = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer; received ${raw}`);
  }
  return value;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const expectedCanonical = route => new URL(route, baseUrl).href;

async function mapWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const output = [];

  async function consume() {
    while (queue.length > 0) {
      const item = queue.shift();
      output.push(await worker(item));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, () => consume())
  );
  return output;
}

async function checkRoute(route) {
  const url = new URL(route, baseUrl);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': '7YA-production-smoke/1.0'
      },
      signal: AbortSignal.timeout(requestTimeoutMs)
    });

    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const canonical = expectedCanonical(route);
    const hasCanonical = body.includes(
      `<link rel="canonical" href="${canonical}"`
    );
    const homepageMarkerOk =
      route !== '/' || body.includes('igor-first-mobile-20260712-2');
    const ok =
      response.status === 200 &&
      contentType.toLowerCase().includes('text/html') &&
      hasCanonical &&
      homepageMarkerOk;

    return {
      route,
      url: response.url,
      status: response.status,
      contentType,
      canonical: hasCanonical,
      releaseMarker: homepageMarkerOk,
      durationMs: Date.now() - startedAt,
      ok,
      error: ''
    };
  } catch (error) {
    return {
      route,
      url: url.href,
      status: 0,
      contentType: '',
      canonical: false,
      releaseMarker: false,
      durationMs: Date.now() - startedAt,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

for (let attempt = 1; attempt <= maxAttempts && pending.size > 0; attempt += 1) {
  console.log(
    `LIVE_ROUTE_CHECK attempt ${attempt}/${maxAttempts}; pending=${pending.size}`
  );

  const batch = await mapWithConcurrency([...pending], concurrency, checkRoute);

  for (const result of batch) {
    results.set(result.route, result);

    if (result.ok) {
      pending.delete(result.route);
      console.log(`PASS ${result.route} ${result.status} ${result.durationMs}ms`);
      continue;
    }

    const details =
      result.error ||
      [
        `status=${result.status}`,
        `content-type=${result.contentType || 'missing'}`,
        `canonical=${result.canonical}`,
        `release-marker=${result.releaseMarker}`
      ].join(' ');
    console.error(`RETRY ${result.route} ${details}`);
  }

  if (pending.size > 0 && attempt < maxAttempts) {
    await sleep(Math.min(3_000 * attempt, 12_000));
  }
}

const ordered = routes.map(route => results.get(route));
const failures = ordered.filter(result => !result?.ok);
const summary = [
  '## 7YA live route verification',
  '',
  `Base URL: \`${baseUrl.href}\``,
  '',
  '| Route | Status | Canonical | Release marker | Result |',
  '|---|---:|:---:|:---:|:---:|',
  ...ordered.map(result => {
    if (!result) return '| unknown | 0 | ❌ | ❌ | ❌ |';
    return `| \`${result.route}\` | ${result.status} | ${
      result.canonical ? '✅' : '❌'
    } | ${result.releaseMarker ? '✅' : '❌'} | ${
      result.ok ? '✅' : '❌'
    } |`;
  }),
  ''
].join('\n');

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (failures.length > 0) {
  console.error(`\nLIVE_ROUTE_CHECK: FAIL (${failures.length}/${routes.length})`);
  for (const failure of failures) {
    console.error(JSON.stringify(failure));
  }
  process.exit(1);
}

console.log(`\nLIVE_ROUTE_CHECK: PASS (${routes.length}/${routes.length})`);
