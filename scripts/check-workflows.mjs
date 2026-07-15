import fs from 'node:fs';
import path from 'node:path';

const workflowRoot = path.join(process.cwd(), '.github', 'workflows');
const allowed = ['actions-smoke.yml', 'ci.yml', 'pages.yml'];
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
  for (const event of ['push', 'pull_request', 'pull_request_target', 'issues', 'schedule', 'release']) {
    if (new RegExp(`^\\s{2}${event}:`, 'm').test(body)) fail(`${file} enables quarantined ${event} automation`);
  }
}

const ci = bodies.get('ci.yml') || '';
if (!ci.includes('npm run release:gate')) fail('ci.yml does not execute the shared release gate');

const pages = bodies.get('pages.yml') || '';
for (const required of [
  'release_sha:',
  'npm run release:gate',
  'actions/upload-pages-artifact@v3',
  'actions/deploy-pages@v4',
]) {
  if (!pages.includes(required)) fail(`pages.yml missing ${required}`);
}

const smoke = bodies.get('actions-smoke.yml') || '';
if (!smoke.includes('ACTIONS_SMOKE_PASS')) fail('actions-smoke.yml lost its runner proof marker');

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`WORKFLOW_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`WORKFLOW_CONTRACT: PASS (${actual.length} manual workflows)`);
