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

function readRequired(filePath) {
  const absolutePath = path.join(root, filePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`${filePath} is missing`);
    return '';
  }
  pass(`${filePath} exists`);
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireIncludes(filePath, content, snippets) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) {
      fail(`${filePath} missing required snippet: ${snippet}`);
    } else {
      pass(`${filePath} includes ${snippet}`);
    }
  }
}

function requireHtmlBasics(filePath, content) {
  const checks = [
    ['doctype', /<!doctype html>/i],
    ['viewport', /<meta\s+name=["']viewport["']/i],
    ['title', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+name=["']description["']/i],
    ['canonical', /<link\s+rel=["']canonical["']/i]
  ];

  for (const [label, pattern] of checks) {
    if (!pattern.test(content)) {
      fail(`${filePath} missing HTML basic: ${label}`);
    } else {
      pass(`${filePath} HTML basic OK: ${label}`);
    }
  }
}

const requiredHtmlPages = [
  'index.html',
  'talk/index.html',
  'articles/index.html',
  'articles/igor-vepretski-7ya-origin.html',
  'articles/7ya-movement-not-project.html',
  'labs/visual-ai/index.html',
  'labs/visual-ai/evidence-card.html',
  'social/index.html'
];

const requiredDocs = [
  'docs/my-links.md',
  'docs/_navbar.md',
  'docs/_sidebar.md',
  'docs/influence.md',
  'docs/GPU_READINESS.md',
  'docs/FEATURES.md',
  'docs/CI_RUNBOOK.md'
];

const contents = new Map();
for (const filePath of [...requiredHtmlPages, ...requiredDocs]) {
  contents.set(filePath, readRequired(filePath));
}

for (const filePath of requiredHtmlPages) {
  requireHtmlBasics(filePath, contents.get(filePath));
}

requireIncludes('index.html', contents.get('index.html'), [
  '7YA Command Site',
  'Start a conversation',
  '/talk/',
  '/articles/',
  '/social/',
  '/docs/my-links.md',
  'Claims stay evidence-aware'
]);

requireIncludes('talk/index.html', contents.get('talk/index.html'), [
  'Talk with Igor',
  '/docs/my-links.md',
  '/articles/',
  'Make it actionable',
  'What proof exists?'
]);

requireIncludes('articles/index.html', contents.get('articles/index.html'), [
  '7YA Knowledge Stream',
  '/articles/igor-vepretski-7ya-origin.html',
  '/articles/7ya-movement-not-project.html',
  '/talk/'
]);

requireIncludes('labs/visual-ai/index.html', contents.get('labs/visual-ai/index.html'), [
  'Visual AI Lab',
  '/labs/visual-ai/evidence-card.html',
  '/docs/GPU_READINESS.md',
  'Claim hygiene'
]);

requireIncludes('labs/visual-ai/evidence-card.html', contents.get('labs/visual-ai/evidence-card.html'), [
  'Visual Evidence Card',
  'No upload, no server, no external API',
  '7ya.visualEvidenceCard.v0.1',
  'Copy JSON',
  'Download JSON'
]);

requireIncludes('social/index.html', contents.get('social/index.html'), [
  'Social Signal Wall',
  'https://www.tiktok.com/@igor.vepretski',
  'https://www.instagram.com/igor.vepretski/',
  'https://www.youtube.com/@IgorVepretski',
  '7653793755757169941',
  'approved snapshots'
]);

requireIncludes('docs/GPU_READINESS.md', contents.get('docs/GPU_READINESS.md'), [
  'NVIDIA Developer Program',
  'developer ecosystem access',
  'GPU readiness',
  'evidence based'
]);

requireIncludes('docs/FEATURES.md', contents.get('docs/FEATURES.md'), [
  'GPU readiness',
  'Visual streaming research',
  'Visual AI lab route',
  'Evidence-aware claims'
]);

requireIncludes('docs/my-links.md', contents.get('docs/my-links.md'), [
  'One signal. All routes.',
  '/talk/',
  '/articles/',
  '/social/',
  '/docs/influence',
  'https://www.instagram.com/igor.vepretski/',
  'https://www.tiktok.com/@igor.vepretski',
  'https://www.youtube.com/@IgorVepretski'
]);

requireIncludes('docs/_navbar.md', contents.get('docs/_navbar.md'), [
  '[Talk](/talk/)',
  '[Knowledge Stream](/articles/)',
  '[כל הקישורים](/docs/my-links)',
  '[קיר השפעה](/docs/influence)'
]);

requireIncludes('docs/_sidebar.md', contents.get('docs/_sidebar.md'), [
  '7YA Public Routes',
  '[Home](/)',
  '[Talk](/talk/)',
  '[Knowledge Stream](/articles/)',
  '[Influence Archive](/docs/influence)'
]);

const forbiddenSnippets = [
  'Introduction to Generative AI',
  'WT.mc_id=academic-105485-koreyst'
];

for (const [filePath, content] of contents.entries()) {
  for (const snippet of forbiddenSnippets) {
    if (content.includes(snippet)) {
      fail(`${filePath} contains deprecated snippet: ${snippet}`);
    }
  }
}

if (failures > 0) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures} issue${failures === 1 ? '' : 's'})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
