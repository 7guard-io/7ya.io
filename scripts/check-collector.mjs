import fs from 'node:fs';

const collector = fs.readFileSync('scripts/collector/index.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/digital-museum-collector.yml', 'utf8');
const registry = JSON.parse(fs.readFileSync('data/collector-targets.json', 'utf8'));
const failures = [];

const requireText = (body, text, message) => {
  if (!body.includes(text)) failures.push(message);
};
const forbidText = (body, text, message) => {
  if (body.includes(text)) failures.push(message);
};

requireText(collector, 'MAX_BYTES = 2_000_000', 'collector response cap missing');
requireText(collector, 'TIMEOUT_MS = 15_000', 'collector timeout missing');
requireText(collector, "['http:', 'https:']", 'collector protocol allowlist missing');
requireText(collector, 'content_sha256', 'collector content hash missing');
requireText(collector, 'COLLECTOR_NO_CHANGE', 'collector diff-only behavior missing');
requireText(collector, 'Public metadata only', 'collector evidence policy missing');
forbidText(collector, 'process.env.', 'collector must not require secrets for public metadata');

if (!Array.isArray(registry.targets) || registry.targets.length < 1) failures.push('collector target registry is empty');
for (const target of registry.targets || []) {
  if (!target.id || !target.url || !target.classification) failures.push('collector target missing id, url, or classification');
  try {
    const url = new URL(target.url);
    if (url.protocol !== 'https:') failures.push(`collector target must use https: ${target.url}`);
  } catch {
    failures.push(`collector target is not a valid URL: ${target.url}`);
  }
}

requireText(workflow, "cron: '17 */12 * * *'", '12-hour schedule missing');
requireText(workflow, 'workflow_dispatch:', 'manual collector trigger missing');
requireText(workflow, 'contents: write', 'collector write permission missing');
requireText(workflow, 'git diff --quiet', 'collector no-change gate missing');
requireText(workflow, '[skip ci]', 'collector deployment isolation missing');
forbidText(workflow, 'stefanzweifel/', 'third-party auto-commit action is not allowed');

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`COLLECTOR_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`COLLECTOR_CONTRACT: PASS (${registry.targets.length} approved targets)`);
