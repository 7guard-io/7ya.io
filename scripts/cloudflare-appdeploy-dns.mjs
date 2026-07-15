#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const desiredStateUrl = new URL('../infra/cloudflare-appdeploy/desired-records.json', import.meta.url);
const desiredState = JSON.parse(await readFile(desiredStateUrl, 'utf8'));

const token = process.env.CLOUDFLARE_API_TOKEN;
const configuredZoneId = process.env.CLOUDFLARE_ZONE_ID;
const apply = process.argv.includes('--apply');
const confirmation = process.env.CONFIRM_7YA_DNS_CUTOVER;
const mutableTypes = new Set(['A', 'AAAA', 'CNAME']);

function fail(message, code = 1) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(code);
}

if (!token) {
  fail(
    'CLOUDFLARE_API_TOKEN is required. Use a least-privilege token limited to zone 7ya.io with Zone:Read and DNS:Edit.',
    2,
  );
}

if (apply && confirmation !== desiredState.confirmation) {
  fail(
    `Refusing DNS mutation. Set CONFIRM_7YA_DNS_CUTOVER=${desiredState.confirmation} and pass --apply.`,
    3,
  );
}

async function cloudflare(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const details = payload?.errors?.map((error) => error.message).join('; ') || response.statusText;
    throw new Error(`Cloudflare API ${response.status}: ${details}`);
  }

  return payload.result;
}

async function resolveZoneId() {
  if (configuredZoneId) return configuredZoneId;

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
    String(current.content).replace(/\.$/, '') === String(desired.content).replace(/\.$/, '') &&
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
    comment: record.purpose,
  };
}

async function buildPlan(zoneId) {
  const plan = [];

  for (const desired of desiredState.records) {
    const existing = await listExactRecords(zoneId, desired.name);
    const mutable = existing.filter((record) => mutableTypes.has(record.type));
    const sameType = mutable.filter((record) => record.type === desired.type);
    const primary = sameType[0];

    for (const record of mutable) {
      if (record.id === primary?.id) continue;
      plan.push({
        action: 'delete_conflict',
        id: record.id,
        current: {
          type: record.type,
          name: record.name,
          content: record.content,
          proxied: record.proxied,
        },
      });
    }

    if (!primary) {
      plan.push({ action: 'create', desired });
    } else if (sameRecord(primary, desired)) {
      plan.push({ action: 'noop', id: primary.id, desired });
    } else {
      plan.push({
        action: 'update',
        id: primary.id,
        current: {
          type: primary.type,
          name: primary.name,
          content: primary.content,
          ttl: primary.ttl,
          proxied: primary.proxied,
        },
        desired,
      });
    }
  }

  return plan;
}

async function executePlan(zoneId, plan) {
  for (const step of plan) {
    if (step.action === 'noop') {
      console.log(`NOOP   ${step.desired.type} ${step.desired.name} -> ${step.desired.content}`);
      continue;
    }

    if (step.action === 'delete_conflict') {
      await cloudflare(`/zones/${zoneId}/dns_records/${step.id}`, { method: 'DELETE' });
      console.log(`DELETE ${step.current.type} ${step.current.name} -> ${step.current.content}`);
      continue;
    }

    if (step.action === 'create') {
      await cloudflare(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        body: JSON.stringify(recordPayload(step.desired)),
      });
      console.log(`CREATE ${step.desired.type} ${step.desired.name} -> ${step.desired.content}`);
      continue;
    }

    if (step.action === 'update') {
      await cloudflare(`/zones/${zoneId}/dns_records/${step.id}`, {
        method: 'PUT',
        body: JSON.stringify(recordPayload(step.desired)),
      });
      console.log(`UPDATE ${step.desired.type} ${step.desired.name} -> ${step.desired.content}`);
    }
  }
}

try {
  const zoneId = await resolveZoneId();
  const plan = await buildPlan(zoneId);

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    zone: desiredState.zone,
    zoneId,
    protectedRecordTypes: desiredState.protected_record_types,
    plan,
  }, null, 2));

  if (!apply) {
    console.log('\nDry-run complete. No DNS records were changed.');
    process.exit(0);
  }

  await executePlan(zoneId, plan);
  console.log('\nDNS reconciliation complete. Next: verify both hostnames in AppDeploy, then test TLS and critical routes.');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
