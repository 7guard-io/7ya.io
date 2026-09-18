#!/usr/bin/env node

const API_ROOT = 'https://api.cloudflare.com/client/v4';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'abdf796a9e763de12ee5195297b4cab1';
const PROJECT = process.env.CLOUDFLARE_PAGES_PROJECT || '7ya-io';
const ZONE = '7ya.io';
const PAGES_HOST = '7ya-io.pages.dev';
const CUSTOM_DOMAINS = ['7ya.io', 'www.7ya.io'];
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!TOKEN) throw new Error('CLOUDFLARE_API_TOKEN is required');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalize = value => String(value || '').replace(/\.$/, '').toLowerCase();
const mutableTypes = new Set(['A', 'AAAA', 'CNAME']);

async function cf(path, options = {}, allow404 = false) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (allow404 && response.status === 404) return null;
  if (!response.ok || payload?.success === false) {
    const detail = payload?.errors?.map(e => `${e.code ?? 'unknown'}:${e.message}`).join('; ') || JSON.stringify(payload) || `HTTP ${response.status}`;
    throw new Error(`Cloudflare API ${options.method || 'GET'} ${path} failed: ${detail}`);
  }
  return payload?.result ?? payload;
}

async function verifyPagesOrigin() {
  const url = `https://${PAGES_HOST}/?emergency-cutover=${Date.now()}`;
  const response = await fetch(url, { redirect: 'follow', headers: { 'Cache-Control': 'no-cache, no-store' } });
  const text = await response.text();
  if (!response.ok) throw new Error(`Pages origin is not healthy: HTTP ${response.status}`);
  if (!/7YA|IGOR VEPRETSKI|איגור ופרצקי/i.test(text)) {
    throw new Error('Pages origin did not contain an expected 7YA identity marker');
  }
  console.log(`PAGES_ORIGIN_OK ${response.status} ${response.url}`);
}

async function resolveZoneId() {
  const zones = await cf(`/zones?name=${encodeURIComponent(ZONE)}&status=active&per_page=50`);
  const zone = zones.find(entry => normalize(entry.name) === ZONE);
  if (!zone) throw new Error(`Active Cloudflare zone ${ZONE} was not found`);
  return zone.id;
}

async function listExactRecords(zoneId, name) {
  return cf(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(name)}&per_page=100`);
}

function snapshotRecord(record) {
  return {
    type: record.type,
    name: record.name,
    content: record.content,
    ttl: record.ttl,
    proxied: Boolean(record.proxied),
    priority: record.priority,
    comment: record.comment || undefined,
  };
}

async function restoreMutableSnapshot(zoneId, hostname, snapshot) {
  console.error(`ROLLBACK ${hostname}: restoring previous web-routing records`);
  const current = await listExactRecords(zoneId, hostname);
  for (const record of current.filter(r => mutableTypes.has(r.type))) {
    await cf(`/zones/${zoneId}/dns_records/${record.id}`, { method: 'DELETE' });
  }
  for (const record of snapshot) {
    const payload = { ...record };
    if (payload.priority == null) delete payload.priority;
    if (payload.comment == null) delete payload.comment;
    await cf(`/zones/${zoneId}/dns_records`, { method: 'POST', body: JSON.stringify(payload) });
  }
}

async function ensureCustomDomains() {
  let domains = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/domains`);
  const names = new Set(domains.map(domain => normalize(domain.name)));

  for (const name of CUSTOM_DOMAINS) {
    if (names.has(name)) {
      console.log(`PAGES_DOMAIN_EXISTS ${name}`);
      continue;
    }
    const created = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    console.log(`PAGES_DOMAIN_ADDED ${name} status=${created?.status || 'unknown'}`);
  }
}

async function reconcileHost(zoneId, hostname) {
  const before = await listExactRecords(zoneId, hostname);
  const mutable = before.filter(record => mutableTypes.has(record.type));
  const protectedRecords = before.filter(record => !mutableTypes.has(record.type));

  console.log(`DNS_HOST ${hostname} protected=${protectedRecords.map(r => r.type).join(',') || 'none'} mutable=${mutable.map(r => `${r.type}:${r.content}`).join(',') || 'none'}`);

  const desired = mutable.find(record => record.type === 'CNAME' && normalize(record.content) === PAGES_HOST);

  try {
    let desiredId = desired?.id || null;

    if (desired) {
      const needsUpdate = !desired.proxied || Number(desired.ttl) !== 1;
      if (needsUpdate) {
        await cf(`/zones/${zoneId}/dns_records/${desired.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            type: 'CNAME',
            name: hostname,
            content: PAGES_HOST,
            ttl: 1,
            proxied: true,
            comment: '7YA Cloudflare Pages canonical production',
          }),
        });
        console.log(`DNS_UPDATE CNAME ${hostname} -> ${PAGES_HOST} proxied=true`);
      } else {
        console.log(`DNS_NOOP CNAME ${hostname} -> ${PAGES_HOST}`);
      }
    }

    for (const record of mutable) {
      if (record.id === desiredId) continue;
      await cf(`/zones/${zoneId}/dns_records/${record.id}`, { method: 'DELETE' });
      console.log(`DNS_DELETE ${record.type} ${hostname} -> ${record.content}`);
    }

    if (!desired) {
      const created = await cf(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'CNAME',
          name: hostname,
          content: PAGES_HOST,
          ttl: 1,
          proxied: true,
          comment: '7YA Cloudflare Pages canonical production',
        }),
      });
      desiredId = created.id;
      console.log(`DNS_CREATE CNAME ${hostname} -> ${PAGES_HOST} proxied=true`);
    }

    const after = await listExactRecords(zoneId, hostname);
    const mutableAfter = after.filter(record => mutableTypes.has(record.type));
    const matches = mutableAfter.filter(record => record.type === 'CNAME' && normalize(record.content) === PAGES_HOST && Boolean(record.proxied));
    if (matches.length !== 1 || mutableAfter.length !== 1) {
      throw new Error(`DNS read-back mismatch for ${hostname}: mutable=${mutableAfter.map(r => `${r.type}:${r.content}:proxied=${r.proxied}`).join(',')}`);
    }
  } catch (error) {
    await restoreMutableSnapshot(zoneId, hostname, mutable.map(snapshotRecord));
    throw error;
  }
}

async function getDomainStatus(name) {
  return cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/domains/${encodeURIComponent(name)}`, {}, true);
}

async function probe(url) {
  try {
    const response = await fetch(`${url}?cutover-probe=${Date.now()}`, {
      redirect: 'follow',
      headers: { 'Cache-Control': 'no-cache, no-store' },
    });
    const text = await response.text();
    return {
      ok: response.ok && /7YA|IGOR VEPRETSKI|איגור ופרצקי/i.test(text),
      status: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: '', error: error instanceof Error ? error.message : String(error) };
  }
}

async function waitForActivation() {
  const deadline = Date.now() + 8 * 60 * 1000;
  let last = null;
  while (Date.now() < deadline) {
    const domains = {};
    for (const name of CUSTOM_DOMAINS) {
      const info = await getDomainStatus(name);
      domains[name] = {
        status: info?.status || 'missing',
        validation: info?.validation_data?.status || null,
        error: info?.validation_data?.error_message || null,
      };
    }
    const apexProbe = await probe('https://7ya.io/');
    const wwwProbe = await probe('https://www.7ya.io/');
    last = { domains, apexProbe, wwwProbe };
    console.log('CUTOVER_STATUS ' + JSON.stringify(last));

    const domainReady = CUSTOM_DOMAINS.every(name => ['active', 'pending', 'initializing'].includes(domains[name].status));
    if (domainReady && apexProbe.ok && wwwProbe.ok) return last;
    await sleep(10000);
  }
  return last;
}

await verifyPagesOrigin();
const zoneId = await resolveZoneId();
console.log(`ZONE_OK ${ZONE} ${zoneId}`);

await ensureCustomDomains();
for (const hostname of CUSTOM_DOMAINS) {
  await reconcileHost(zoneId, hostname);
}
await ensureCustomDomains();

const final = await waitForActivation();
console.log('CUTOVER_FINAL ' + JSON.stringify(final));

if (!final?.apexProbe?.ok || !final?.wwwProbe?.ok) {
  throw new Error('DNS now points to Cloudflare Pages, but one or both public HTTPS probes are not healthy yet; inspect CUTOVER_FINAL for domain/certificate status');
}

console.log('CLOUDFLARE_PAGES_CUTOVER: PASS');
