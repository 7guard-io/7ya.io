import { writeFileSync } from 'node:fs';

const scenario = process.env.CLOUDFLARE_MOCK_SCENARIO || 'create';
const stateFile = process.env.CLOUDFLARE_MOCK_STATE_FILE;
const zoneId = 'zone-1';
let nextId = 100;
let desiredCreateFailed = false;
const counts = Object.create(null);

function record(type, name, content, extra = {}) {
  return {
    id: extra.id || `record-${nextId++}`,
    type,
    name,
    content,
    ttl: extra.ttl ?? 1,
    proxied: extra.proxied ?? false,
    comment: extra.comment,
    priority: extra.priority,
  };
}

function initialRecords(name) {
  switch (name) {
    case 'create':
      return [];
    case 'update':
      return [
        record('A', '7ya.io', '192.0.2.10', { id: 'apex-a' }),
        record('CNAME', 'www.7ya.io', 'old.example.test', { id: 'www-cname' }),
      ];
    case 'conflict':
      return [
        record('AAAA', '7ya.io', '2001:db8::1', { id: 'apex-aaaa' }),
        record('A', 'www.7ya.io', '192.0.2.55', { id: 'www-a' }),
      ];
    case 'rate-limit':
      return [
        record('A', '7ya.io', '18.232.7.146', { id: 'apex-a' }),
        record('CNAME', 'www.7ya.io', 'proxy-v2.appdeploy.ai', { id: 'www-cname' }),
      ];
    case 'mid-failure':
    case 'rollback-failure':
      return [
        record('A', '7ya.io', '192.0.2.10', { id: 'apex-a' }),
        record('A', 'www.7ya.io', '192.0.2.20', { id: 'www-a' }),
      ];
    default:
      throw new Error(`Unknown mock scenario: ${name}`);
  }
}

let records = initialRecords(scenario);

function count(method, path) {
  const key = `${method} ${path}`;
  counts[key] = (counts[key] || 0) + 1;
  return counts[key];
}

function response(status, result = null, errors = [], headers = {}) {
  const normalizedHeaders = new Map(
    Object.entries({ 'cf-ray': `mock-${Math.random().toString(16).slice(2)}`, ...headers })
      .map(([key, value]) => [key.toLowerCase(), String(value)]),
  );
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Mock failure',
    headers: {
      get(name) {
        return normalizedHeaders.get(String(name).toLowerCase()) ?? null;
      },
    },
    async json() {
      return { success: status >= 200 && status < 300, result, errors };
    },
  };
}

function parseBody(options) {
  if (!options?.body) return null;
  return JSON.parse(String(options.body));
}

function publicRecord(value) {
  return { ...value };
}

function persistState() {
  if (!stateFile) return;
  writeFileSync(stateFile, JSON.stringify({ scenario, records, counts }, null, 2));
}

process.on('exit', persistState);

globalThis.fetch = async (input, options = {}) => {
  const url = new URL(String(input));
  const method = String(options.method || 'GET').toUpperCase();
  const path = url.pathname.replace(/^\/client\/v4/, '') || '/';
  const attempt = count(method, path);

  if (scenario === 'rate-limit' && path === '/user/tokens/verify' && attempt === 1) {
    return response(429, null, [{ code: 10000, message: 'rate limited' }], { 'retry-after': '0' });
  }

  if (method === 'GET' && path === '/user/tokens/verify') {
    return response(200, { status: 'active' });
  }

  if (method === 'GET' && path === '/zones') {
    return response(200, [{ id: zoneId, name: '7ya.io', status: 'active' }]);
  }

  if (method === 'GET' && path === `/zones/${zoneId}`) {
    return response(200, { id: zoneId, name: '7ya.io', status: 'active' });
  }

  if (path === `/zones/${zoneId}/dns_records` && method === 'GET') {
    const name = url.searchParams.get('name');
    return response(200, records.filter((entry) => !name || entry.name === name).map(publicRecord));
  }

  if (path === `/zones/${zoneId}/dns_records` && method === 'POST') {
    const body = parseBody(options);

    if (
      (scenario === 'mid-failure' || scenario === 'rollback-failure') &&
      !desiredCreateFailed &&
      body?.type === 'CNAME' &&
      body?.name === 'www.7ya.io'
    ) {
      desiredCreateFailed = true;
      return response(500, null, [{ code: 9100, message: 'simulated desired-record creation failure' }]);
    }

    if (
      scenario === 'rollback-failure' &&
      desiredCreateFailed &&
      body?.type === 'A' &&
      body?.name === 'www.7ya.io' &&
      body?.content === '192.0.2.20'
    ) {
      return response(500, null, [{ code: 9200, message: 'simulated rollback creation failure' }]);
    }

    const created = record(body.type, body.name, body.content, body);
    records.push(created);
    return response(200, publicRecord(created));
  }

  const recordMatch = path.match(new RegExp(`^/zones/${zoneId}/dns_records/([^/]+)$`));
  if (recordMatch) {
    const id = decodeURIComponent(recordMatch[1]);
    const index = records.findIndex((entry) => entry.id === id);
    if (index < 0) return response(404, null, [{ code: 81044, message: 'record not found' }]);

    if (method === 'DELETE') {
      const [deleted] = records.splice(index, 1);
      return response(200, { id: deleted.id });
    }

    if (method === 'PUT') {
      const body = parseBody(options);
      records[index] = { ...records[index], ...body, id };
      return response(200, publicRecord(records[index]));
    }
  }

  return response(404, null, [{ code: 404, message: `${method} ${path} is not mocked` }]);
};
