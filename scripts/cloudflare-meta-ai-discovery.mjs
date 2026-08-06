#!/usr/bin/env node

const API_ROOT = 'https://api.cloudflare.com/client/v4';
const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const confirmation = process.env.CONFIRM_7YA_META_AI_DISCOVERY;
const apply = process.argv.includes('--apply');
const verify = process.argv.includes('--verify');

if (!token) {
  console.error('CLOUDFLARE_API_TOKEN is required.');
  process.exit(2);
}
if (!zoneId) {
  console.error('CLOUDFLARE_ZONE_ID is required.');
  process.exit(2);
}

async function cloudflare(path, init = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(20_000),
  });

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Cloudflare returned non-JSON (${response.status}): ${text.slice(0, 500)}`);
  }

  if (!response.ok || payload.success !== true) {
    const errors = JSON.stringify(payload.errors || payload, null, 2);
    throw new Error(`Cloudflare API ${response.status} for ${path}: ${errors}`);
  }
  return payload.result;
}

function normalizedUserAgents(robots) {
  return Object.fromEntries(
    Object.entries(robots?.userAgents || {}).map(([name, rules]) => [name.toLowerCase(), rules]),
  );
}

function effectiveRules(robots, agent) {
  const agents = normalizedUserAgents(robots);
  return agents[agent.toLowerCase()] || agents['*'] || { allow: [], disallow: [] };
}

function assertMetaAccessible(robots) {
  if (robots?.status !== 200) {
    throw new Error(`Cloudflare parsed robots.txt with status ${robots?.status ?? 'unknown'}, expected 200.`);
  }

  const targets = [
    'meta-externalagent',
    'meta-externalfetcher',
    'facebookbot',
    'facebookexternalhit',
  ];

  for (const target of targets) {
    const rules = effectiveRules(robots, target);
    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [];
    const allow = Array.isArray(rules.allow) ? rules.allow : [];
    if (disallow.includes('/')) {
      throw new Error(`${target} is still disallowed from /`);
    }
    if (!allow.includes('/')) {
      throw new Error(`${target} does not have an effective Allow: / rule`);
    }

    const signals = rules.contentSignals || {};
    if (signals.search && signals.search !== 'yes') {
      throw new Error(`${target} search content signal is ${signals.search}, expected yes`);
    }
    if (signals['ai-input'] && signals['ai-input'] !== 'yes') {
      throw new Error(`${target} ai-input content signal is ${signals['ai-input']}, expected yes`);
    }
  }
}

const desiredBotManagement = {
  ai_bots_protection: 'disabled',
  cf_robots_variant: 'off',
  is_robots_txt_managed: false,
};

const before = await cloudflare(`/zones/${zoneId}/bot_management`);
const robotsBefore = await cloudflare(`/zones/${zoneId}/ai-audit/robots`);

const current = Object.fromEntries(
  Object.keys(desiredBotManagement).map((key) => [key, before?.[key] ?? null]),
);
const changes = Object.fromEntries(
  Object.entries(desiredBotManagement).filter(([key, value]) => current[key] !== value),
);

if (verify) {
  assertMetaAccessible(robotsBefore);
  for (const [key, value] of Object.entries(desiredBotManagement)) {
    if (before?.[key] !== value) {
      throw new Error(`Cloudflare ${key} is ${JSON.stringify(before?.[key])}, expected ${JSON.stringify(value)}`);
    }
  }
  console.log(JSON.stringify({ ok: true, botManagement: current, robots: robotsBefore }, null, 2));
  process.exit(0);
}

if (!apply) {
  console.log(JSON.stringify({
    mode: 'plan',
    current,
    desired: desiredBotManagement,
    changes,
    robotsStatus: robotsBefore?.status ?? null,
    sitemaps: robotsBefore?.sitemaps || [],
  }, null, 2));
  process.exit(0);
}

if (confirmation !== '7YA-META-AI-DISCOVERY-20260806') {
  throw new Error('Explicit production confirmation is missing or invalid.');
}

if (Object.keys(changes).length > 0) {
  await cloudflare(`/zones/${zoneId}/bot_management`, {
    method: 'PUT',
    body: JSON.stringify(desiredBotManagement),
  });
}

const after = await cloudflare(`/zones/${zoneId}/bot_management`);
for (const [key, value] of Object.entries(desiredBotManagement)) {
  if (after?.[key] !== value) {
    throw new Error(`Cloudflare did not converge: ${key}=${JSON.stringify(after?.[key])}, expected ${JSON.stringify(value)}`);
  }
}

console.log(JSON.stringify({
  mode: 'apply',
  changed: Object.keys(changes),
  before: current,
  after: Object.fromEntries(Object.keys(desiredBotManagement).map((key) => [key, after?.[key] ?? null])),
}, null, 2));
