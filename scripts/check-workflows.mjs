import fs from 'node:fs';
import path from 'node:path';

const workflowRoot = path.join(process.cwd(), '.github', 'workflows');
const allowed = ['actions-smoke.yml', 'ci.yml', 'digital-museum-collector.yml', 'pages.yml'];
const actual = fs.readdirSync(workflowRoot)
  .filter(file => /\.ya?ml$/i.test(file))
  .sort();

const failures = [];
const fail = message => failures.push(message);

if (JSON.stringify(actual) !== JSON.stringify(allowed)) {
  fail(`workflow allowlist mismatch; expected ${allowed.join(', ')}, got ${actual.join(', ')}`);
}

const bodies = new Map();
for (const file of actual) {
  const body = fs.readFileSync(path.join(workflowRoot, file), 'utf8');
  bodies.set(file, body);
  if (!/^\s{2}workflow_dispatch:/m.test(body)) fail(`${file} is not manual-dispatch capable`);
  for (const event of ['pull_request', 'pull_request_target', 'issues', 'release']) {
    if (new RegExp(`^\\s{2}${event}:`, 'm').test(body)) fail(`${file} enables quarantined ${event} automation`);
  }
  if (/^\s{2}push:/m.test(body) && file !== 'pages.yml') {
    fail(`${file} enables unauthorized push automation`);
  }
  if (/^\s{2}schedule:/m.test(body) && file !== 'digital-museum-collector.yml') {
    fail(`${file} enables unauthorized schedule automation`);
  }
}

const ci = bodies.get('ci.yml') || '';
if (!ci.includes('npm run release:gate')) fail('ci.yml does not execute the shared release gate');

const pages = bodies.get('pages.yml') || '';
for (const required of [
  'push:',
  '- main',
  'workflow_dispatch:',
  'npm run release:gate',
  'actions/upload-pages-artifact@v3',
  'actions/deploy-pages@v4',
]) {
  if (!pages.includes(required)) fail(`pages.yml missing ${required}`);
}

const smoke = bodies.get('actions-smoke.yml') || '';
if (!smoke.includes('ACTIONS_SMOKE_PASS')) fail('actions-smoke.yml lost its runner proof marker');

const collector = bodies.get('digital-museum-collector.yml') || '';
for (const required of [
  'schedule:',
  "cron: '17 */12 * * *'",
  'contents: write',
  'scripts/collector/index.js',
  'data/collector-targets.json',
  'git diff --quiet',
  '[skip ci]',
]) {
  if (!collector.includes(required)) fail(`${file} missing ${required}`);
}
if (collector.includes('stefanzweifel/git-auto-commit-action')) {
  fail('digital-museum-collector.yml uses an unnecessary third-party commit action');
}

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`WORKFLOW_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`WORKFLOW_CONTRACT: PASS (${actual.length} governed workflows)`);
