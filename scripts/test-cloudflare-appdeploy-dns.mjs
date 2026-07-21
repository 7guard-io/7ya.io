import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(scriptsDir);
const reconciler = join(scriptsDir, 'cloudflare-appdeploy-dns.mjs');
const preload = join(scriptsDir, 'test-support', 'cloudflare-fetch-mock.mjs');

function simplified(records) {
  return records
    .map(({ type, name, content, ttl, proxied }) => ({ type, name, content, ttl, proxied }))
    .sort((left, right) => `${left.name}:${left.type}`.localeCompare(`${right.name}:${right.type}`));
}

function runScenario(scenario, { apply = true } = {}) {
  const directory = mkdtempSync(join(tmpdir(), `7ya-cloudflare-${scenario}-`));
  const stateFile = join(directory, 'state.json');
  const priorNodeOptions = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : '';
  const args = [reconciler];
  if (apply) args.push('--apply');

  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      NODE_OPTIONS: `${priorNodeOptions}--import=${pathToFileURL(preload).href}`,
      CLOUDFLARE_API_TOKEN: 'mock-token',
      CLOUDFLARE_ZONE_ID: 'zone-1',
      CLOUDFLARE_REQUEST_TIMEOUT_MS: '1000',
      CLOUDFLARE_MAX_ATTEMPTS: '2',
      CLOUDFLARE_MOCK_SCENARIO: scenario,
      CLOUDFLARE_MOCK_STATE_FILE: stateFile,
      CONFIRM_7YA_DNS_CUTOVER: apply ? '7YA-APPDEPLOY-20260716' : '',
    },
  });

  const state = JSON.parse(readFileSync(stateFile, 'utf8'));
  rmSync(directory, { recursive: true, force: true });
  return { ...result, state, combined: `${result.stdout}\n${result.stderr}` };
}

const desired = [
  { type: 'A', name: '7ya.io', content: '18.232.7.146', ttl: 1, proxied: false },
  { type: 'CNAME', name: 'www.7ya.io', content: 'proxy-v2.appdeploy.ai', ttl: 1, proxied: false },
];

test('creates both desired records from an empty zone slice', () => {
  const result = runScenario('create');
  assert.equal(result.status, 0, result.combined);
  assert.match(result.stdout, /CREATE A 7ya\.io -> 18\.232\.7\.146/);
  assert.match(result.stdout, /CREATE CNAME www\.7ya\.io -> proxy-v2\.appdeploy\.ai/);
  assert.deepEqual(simplified(result.state.records), simplified(desired));
});

test('updates existing records in place', () => {
  const result = runScenario('update');
  assert.equal(result.status, 0, result.combined);
  assert.match(result.stdout, /UPDATE A 7ya\.io/);
  assert.match(result.stdout, /UPDATE CNAME www\.7ya\.io/);
  assert.deepEqual(simplified(result.state.records), simplified(desired));
});

test('deletes conflicting mutable records before creation', () => {
  const result = runScenario('conflict');
  assert.equal(result.status, 0, result.combined);
  assert.match(result.stdout, /DELETE AAAA 7ya\.io/);
  assert.match(result.stdout, /DELETE A www\.7ya\.io/);
  assert.deepEqual(simplified(result.state.records), simplified(desired));
});

test('retries a 429 response and completes a read-only plan', () => {
  const result = runScenario('rate-limit', { apply: false });
  assert.equal(result.status, 0, result.combined);
  assert.equal(result.state.counts['GET /user/tokens/verify'], 2);
  assert.match(result.stdout, /Dry-run complete\. No DNS records were changed\./);
  assert.deepEqual(simplified(result.state.records), simplified(desired));
});

test('restores both host snapshots when the second hostname fails', () => {
  const result = runScenario('mid-failure');
  assert.notEqual(result.status, 0, result.combined);
  assert.match(result.combined, /all previously converged hostnames were restored/);
  assert.deepEqual(simplified(result.state.records), simplified([
    { type: 'A', name: '7ya.io', content: '192.0.2.10', ttl: 1, proxied: false },
    { type: 'A', name: 'www.7ya.io', content: '192.0.2.20', ttl: 1, proxied: false },
  ]));
});

test('reports a compensating rollback failure without claiming convergence', () => {
  const result = runScenario('rollback-failure');
  assert.notEqual(result.status, 0, result.combined);
  assert.match(result.combined, /Rollback also failed/);
  assert.doesNotMatch(result.combined, /"result":\s*"converged"/);
  assert.deepEqual(simplified(result.state.records), simplified([
    { type: 'A', name: '7ya.io', content: '192.0.2.10', ttl: 1, proxied: false },
  ]));
});
