import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function read(filePath) {
  const absolute = path.join(root, filePath);
  if (!fs.existsSync(absolute)) {
    fail(`${filePath} missing`);
    return '';
  }
  pass(`${filePath} exists`);
  return fs.readFileSync(absolute, 'utf8');
}

function includes(filePath, content, snippets) {
  for (const snippet of snippets) {
    if (content.includes(snippet)) pass(`${filePath} includes ${snippet}`);
    else fail(`${filePath} missing ${snippet}`);
  }
}

function htmlBasics(filePath, content) {
  const checks = ['<!doctype html>', '<meta name="viewport"', '<title>', '<meta name="description"', '<link rel="canonical"'];
  for (const check of checks) includes(filePath, content, [check]);
}

const files = [
  'index.html',
  'member-pass/index.html',
  'member/igor-vepretski/index.html',
  'talk/index.html',
  'articles/index.html',
  'social/index.html',
  'labs/visual-ai/index.html',
  'labs/visual-ai/evidence-card.html',
  'docs/my-links.md',
  'docs/GPU_READINESS.md',
  'docs/FEATURES.md',
  'docs/CI_RUNBOOK.md',
  'wallet/7ya-member-pass.json'
];

const content = new Map(files.map(file => [file, read(file)]));

for (const file of files.filter(file => file.endsWith('.html'))) {
  htmlBasics(file, content.get(file));
}

includes('index.html', content.get('index.html'), [
  '7YA Space Lobby',
  'floating guide',
  '/member-pass/',
  '/talk/',
  '/social/',
  'Complexity by process'
]);

includes('member-pass/index.html', content.get('member-pass/index.html'), [
  '7YA Digital Member Pass',
  'Open Igor Pass',
  'Download pass spec'
]);

includes('member/igor-vepretski/index.html', content.get('member/igor-vepretski/index.html'), [
  'Igor Vepretski Member Pass',
  '7YA-IGOR-0001',
  'Founder Pass'
]);

includes('docs/my-links.md', content.get('docs/my-links.md'), [
  'One clean route map',
  '/member-pass/',
  '/member/igor-vepretski/',
  '/social/',
  'https://www.youtube.com/@IgorVepretski'
]);

includes('social/index.html', content.get('social/index.html'), [
  'Social Signal Wall',
  '7653793755757169941',
  'approved snapshots'
]);

includes('wallet/7ya-member-pass.json', content.get('wallet/7ya-member-pass.json'), [
  '7ya.digitalMemberPass.v0.1',
  '7YA-IGOR-0001'
]);

for (const [file, body] of content.entries()) {
  for (const bad of ['Introduction to Generative AI', 'WT.mc_id=academic-105485-koreyst']) {
    if (body.includes(bad)) fail(`${file} contains deprecated snippet: ${bad}`);
  }
}

if (failures > 0) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
