#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const desiredStateUrl = new URL('../infra/cloudflare-appdeploy/desired-records.json', import.meta.url);
const desiredState = JSON.parse(await readFile(desiredStateUrl, 'utf8'));

const token = process.env.CLOUDFLARE_API_TOKEN;
const configuredZoneId = process.env.CLOUDFLARE_ZONE_ID;
const apply = process.argv.includes('--apply');
const confirmation = process.env.CONFIRM_7YA_DNS_CUTOVER;
const requestTimeoutMs = Number(process.env.CLOUDFLARE_REQUEST_TIMEOUT_MS || 15_000);
const maxAttempts = Number(process.env.CLOUDFLARE_MAX_ATTEMPTS || 5);
const mutableTypes = new Set(['A', 'AAAA', 'CNAME']);
const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);
const audit = [];

function fail(message, code = 1) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(code);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(value) {
  return String(value ?? '').replace(/\.$/, '').toLowerCase();
}

function delayFromHeaders(response, attempt) {
  const retryAfter = Number(response?.headers?.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter >= 0) return retryAfter * 1000;
  const exponential = Math.min(8_000, 350 * (2 ** (attempt - 1)));
  return exponential + Math.floor(Math.random() * 250);
}

function validateDesiredState() {
  assert(desiredState.zone === '7ya.io', 'Desired state zone must be exactly 7ya.io.');
  assert(desiredState.confirmation === '7YA-APPDEPLOY-20260716', 'Unexpected confirmation value.');
  assert(Array.isArray(desiredState.records) && desiredState.records.length === 2, 'Exactly two desired records are required.');

  const expected = new Map([
    ['A:7ya.io', '18.232.7.146'],
    ['CNAME:www.7ya.io', 'proxy-v2.appdeploy.ai'],
  ]);

  for (const record of desiredState.records) {
    const key = `${record.type}:${normalize(record.name)}`;
    assert(expected.has(key), `Unexpected desired record ${key}.`);
    assert(normalize(record.content) === normalize(expected.get(key)), `Unexpected target for ${key}.`);
    assert(record.proxied === false, `${key} must remain DNS-only during verification.`);
    assert(Number(record.ttl) === 1, `${key} must use Cloudflare automatic TTL (1).`);
  }
}

if (!token) {
  fail('CLOUDFLARE_API_TOKEN is required. Use a least-privilege token limited to zone 7ya.io with Zone:Read and DNS:Edit.', 2);
}

if (!Number.isFinite(requestTimeoutMs) || requestTimeoutMs < 1_000 || requestTimeoutMs > 120_000) {
  fail('CLOUDFLARE_REQUEST_TIMEOUT_MS must be between 1000 and 120000.', 2);
}

if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 8) {
  fail('CLOUDFLARE_MAX_ATTEMPTS must be an integer between 1 and 8.', 2);
}

if (apply && confirmation !== desiredState.confirmation) {
  fail(`Refusing DNS mutation. Set CONFIRM_7YA_DNS_CUTOVER=${desiredState.confirmation} and pass --apply.`, 3);
}

validateDesiredState();

async function cloudflare(path, options = {}) {
  const method = String(options.method || 'GET').toUpperCase();
  const allowRetry = options.allowRetry ?? method !== 'POST';
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error(`Request timed out after ${requestTimeoutMs}ms`)), requestTimeoutMs);
    let response;

    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': '7ya-cloudflare-appdeploy-cutover/20260716',
          ...(options.headers ?? {}),
        },
      });

      const requestId = response.headers.get('cf-ray') || response.headers.get('x-request-id') || 'unknown';
      const payload = await response.json().catch(() => null);
      audit.push({ method, path, attempt, status: response.status, requestId });

      if (response.ok && payload?.success) return payload.result;

      const details = payload?.errors?.map((error) => `${error.code ?? 'unknown'}:${error.message}`).join('; ') || response.statusText;
      const retryable = retryableStatuses.has(response.status) && allowRetry && attempt < maxAttempts;
      if (!retryable) throw new Error(`Cloudflare API ${response.status} [${requestId}]: ${details}`);

      await sleep(delayFromHeaders(response, attempt));
    } catch (error) {
      lastError = error;
      const networkFailure = response === undefined;
      const retryable = networkFailure && allowRetry && attempt < maxAttempts;
      if (!retryable) throw error;
      await sleep(delayFromHeaders(undefined, attempt));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error(`Cloudflare request failed after ${maxAttempts} attempts.`);
}

async function verifyToken() {
  const result = await cloudflare('/user/tokens/verify');
  assert(result?.status === 'active', `Cloudflare API token is not active (status: ${result?.status ?? 'unknown'}).`);
}

async function resolveZoneId() {
  if (configuredZoneId) {
    const zone = await cloudflare(`/zones/${configuredZoneId}`);
    assert(zone?.name === desiredState.zone, `CLOUDFLARE_ZONE_ID belongs to ${zone?.name ?? 'unknown'}, not ${desiredState.zone}.`);
    assert(zone?.status === 'active', `Cloudflare zone ${desiredState.zone} is not active.`);
    return configuredZoneId;
  }

  const zones = await cloudflare(`/zones?name=${encodeURIComponent(desiredState.zone)}&status=active&per_page=50`);
  const exact = zones.find((zone) => zone.name === desiredState.zone);
  if (!exact) throw new Error(`Active Cloudflare zone ${desiredState.zone} was not found.`);
  return exact.id;
}

async function listExactRecords(zoneId, name) {
  return cloudflare(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(name)}&per_page=100`);
}

function sameRecord(current, desired) {
  return (
    current.type === desired.type &&
    normalize(current.content) === normalize(desired.content) &&
    Boolean(current.proxied) === Boolean(desired.proxied) &&
    Number(current.ttl) === Number(desired.ttl)
  );
}

function recordPayload(record) {
  return {
    type: record.type,
    name: record.name,
    content: record.content,
    ttl: record.ttl,
    proxied: record.proxied,
    comment: record.purpose || '7YA AppDeploy cutover',
  };
}

function snapshotPayload(record) {
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

async function inspectHost(zoneId, desired) {
  const existing = await listExactRecords(zoneId, desired.name);
  const mutable = existing.filter((record) => mutableTypes.has(record.type));
  const protectedRecords = existing.filter((record) => !mutableTypes.has(record.type));
  const primary = mutable.find((record) => record.type === desired.type);

  if (desired.type === 'CNAME' && protectedRecords.length > 0) {
    const summary = protectedRecords.map((record) => `${record.type}:${record.name}`).join(', ');
    throw new Error(`Cannot safely create CNAME ${desired.name}; protected records coexist at that hostname: ${summary}.`);
  }

  const plan = [];
  if (!primary) plan.push({ action: 'create', desired });
  else if (sameRecord(primary, desired)) plan.push({ action: 'noop', id: primary.id, desired });
  else plan.push({ action: 'update', id: primary.id, current: snapshotPayload(primary), desired });

  for (const record of mutable) {
    if (record.id === primary?.id) continue;
    plan.push({ action: 'delete_conflict', id: record.id, current: snapshotPayload(record) });
  }

  return {
    desired,
    existing: existing.map(snapshotPayload),
    mutable: mutable.map(snapshotPayload),
    protected: protectedRecords.map(snapshotPayload),
    plan,
  };
}

async function buildPlan(zoneId) {
  const hosts = [];
  for (const desired of desiredState.records) hosts.push(await inspectHost(zoneId, desired));
  return hosts;
}

async function verifyHost(zoneId, desired) {
  const records = await listExactRecords(zoneId, desired.name);
  const mutable = records.filter((record) => mutableTypes.has(record.type));
  const matches = mutable.filter((record) => sameRecord(record, desired));
  assert(matches.length === 1, `Read-back failed for ${desired.name}: expected one exact ${desired.type} record, found ${matches.length}.`);
  assert(mutable.length === 1, `Read-back failed for ${desired.name}: ${mutable.length - 1} conflicting mutable record(s) remain.`);
  return matches[0];
}

function snapshotMatches(current, expected) {
  return (
    current.type === expected.type &&
    normalize(current.name) === normalize(expected.name) &&
    normalize(current.content) === normalize(expected.content) &&
    Number(current.ttl) === Number(expected.ttl) &&
    Boolean(current.proxied) === Boolean(expected.proxied)
  );
}

async function verifySnapshot(zoneId, hostname, snapshot) {
  const current = (await listExactRecords(zoneId, hostname)).filter((entry) => mutableTypes.has(entry.type));
  assert(current.length === snapshot.length, `Rollback read-back failed for ${hostname}: expected ${snapshot.length} mutable record(s), found ${current.length}.`);

  const unmatched = [...current];
  for (const expected of snapshot) {
    const index = unmatched.findIndex((record) => snapshotMatches(record, expected));
    assert(index >= 0, `Rollback read-back failed for ${hostname}: ${expected.type} ${expected.content} was not restored.`);
    unmatched.splice(index, 1);
  }
}

async function restoreSnapshot(zoneId, hostname, snapshot) {
  console.error(`ROLLBACK ${hostname}: restoring pre-change mutable DNS snapshot.`);
  const current = await listExactRecords(zoneId, hostname);

  for (const record of current.filter((entry) => mutableTypes.has(entry.type))) {
    await cloudflare(`/zones/${zoneId}/dns_records/${record.id}`, { method: 'DELETE' });
  }

  for (const record of snapshot.filter((entry) => mutableTypes.has(entry.type))) {
    await cloudflare(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      allowRetry: false,
      body: JSON.stringify(record),
    });
  }

  await verifySnapshot(zoneId, hostname, snapshot);
}

async function reconcileHost(zoneId, hostPlan) {
  const { desired, plan } = hostPlan;
  const snapshot = hostPlan.mutable;

  try {
    const update = plan.find((step) => step.action === 'update');
    const create = plan.find((step) => step.action === 'create');
    const conflicts = plan.filter((step) => step.action === 'delete_conflict');
    const noop = plan.find((step) => step.action === 'noop');

    if (update) {
      await cloudflare(`/zones/${zoneId}/dns_records/${update.id}`, {
        method: 'PUT',
        body: JSON.stringify(recordPayload(update.desired)),
      });
      console.log(`UPDATE ${desired.type} ${desired.name} -> ${desired.content}`);
    }

    if (create) {
      for (const conflict of conflicts) {
        await cloudflare(`/zones/${zoneId}/dns_records/${conflict.id}`, { method: 'DELETE' });
        console.log(`DELETE ${conflict.current.type} ${conflict.current.name} -> ${conflict.current.content}`);
      }

      await cloudflare(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        allowRetry: false,
        body: JSON.stringify(recordPayload(create.desired)),
      });
      console.log(`CREATE ${desired.type} ${desired.name} -> ${desired.content}`);
    } else {
      for (const conflict of conflicts) {
        await cloudflare(`/zones/${zoneId}/dns_records/${conflict.id}`, { method: 'DELETE' });
        console.log(`DELETE ${conflict.current.type} ${conflict.current.name} -> ${conflict.current.content}`);
      }
    }

    if (noop) console.log(`NOOP   ${desired.type} ${desired.name} -> ${desired.content}`);
    await verifyHost(zoneId, desired);
  } catch (error) {
    try {
      await restoreSnapshot(zoneId, desired.name, snapshot);
    } catch (rollbackError) {
      throw new Error(`Cutover failed for ${desired.name}: ${error instanceof Error ? error.message : error}. Rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : rollbackError}`);
    }
    throw new Error(`Cutover failed for ${desired.name} and the prior mutable DNS snapshot was restored: ${error instanceof Error ? error.message : error}`);
  }
}

try {
  await verifyToken();
  const zoneId = await resolveZoneId();
  const hosts = await buildPlan(zoneId);

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    zone: desiredState.zone,
    zoneId,
    requestTimeoutMs,
    maxAttempts,
    protectedRecordTypes: desiredState.protected_record_types,
    hosts,
  }, null, 2));

  if (!apply) {
    console.log('\nDry-run complete. No DNS records were changed.');
    process.exit(0);
  }

  const completed = [];
  try {
    for (const hostPlan of hosts) {
      await reconcileHost(zoneId, hostPlan);
      completed.push(hostPlan);
    }
  } catch (error) {
    const rollbackFailures = [];
    for (const hostPlan of completed.reverse()) {
      try {
        await restoreSnapshot(zoneId, hostPlan.desired.name, hostPlan.mutable);
      } catch (rollbackError) {
        rollbackFailures.push(`${hostPlan.desired.name}: ${rollbackError instanceof Error ? rollbackError.message : rollbackError}`);
      }
    }

    if (rollbackFailures.length > 0) {
      throw new Error(`Multi-host cutover failed: ${error instanceof Error ? error.message : error}. Global rollback failures: ${rollbackFailures.join('; ')}`);
    }
    throw new Error(`Multi-host cutover failed and all previously converged hostnames were restored: ${error instanceof Error ? error.message : error}`);
  }

  const finalState = [];
  for (const desired of desiredState.records) {
    const record = await verifyHost(zoneId, desired);
    finalState.push({ type: record.type, name: record.name, content: record.content, proxied: record.proxied, ttl: record.ttl });
  }

  console.log(JSON.stringify({ result: 'converged', finalState, audit }, null, 2));
  console.log('\nDNS reconciliation complete. Next: verify both hostnames in AppDeploy, then test TLS and critical routes.');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
