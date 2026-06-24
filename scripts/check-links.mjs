import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkedExtensions = new Set(['.html', '.md']);
const ignoredInternalTargets = new Set(['/#', '#']);
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(relative));
    if (entry.isFile() && checkedExtensions.has(path.extname(entry.name))) files.push(relative);
  }
  return files;
}

function stripHashAndQuery(href) {
  return href.split('#')[0].split('?')[0];
}

function resolveInternalTarget(href) {
  const clean = stripHashAndQuery(href);
  if (!clean || ignoredInternalTargets.has(clean)) return null;
  if (!clean.startsWith('/')) return null;

  const decoded = decodeURIComponent(clean.replace(/^\/+/, ''));
  const candidates = [];

  if (decoded.endsWith('/')) {
    candidates.push(path.join(root, decoded, 'index.html'));
    candidates.push(path.join(root, decoded, 'README.md'));
  } else if (path.extname(decoded)) {
    candidates.push(path.join(root, decoded));
  } else {
    candidates.push(path.join(root, decoded));
    candidates.push(path.join(root, `${decoded}.html`));
    candidates.push(path.join(root, `${decoded}.md`));
    candidates.push(path.join(root, decoded, 'index.html'));
  }

  return { clean, candidates };
}

function extractLinks(content) {
  const links = [];
  const patterns = [
    /\bhref=["']([^"']+)["']/gi,
    /\bsrc=["']([^"']+)["']/gi,
    /\[[^\]]+\]\(([^)]+)\)/g
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content))) {
      const value = match[1].trim();
      if (!value || value.startsWith('mailto:') || value.startsWith('tel:')) continue;
      if (value.startsWith('javascript:') || value.startsWith('data:')) continue;
      links.push(value);
    }
  }
  return links;
}

const files = walk('.');
let internalCount = 0;
const externalLinks = new Set();

for (const filePath of files) {
  const content = fs.readFileSync(path.join(root, filePath), 'utf8');
  for (const href of extractLinks(content)) {
    if (/^https?:\/\//i.test(href)) {
      externalLinks.add(href);
      continue;
    }
    const target = resolveInternalTarget(href);
    if (!target) continue;
    internalCount += 1;
    const exists = target.candidates.some(candidate => fs.existsSync(candidate));
    if (exists) {
      pass(`${filePath} -> ${target.clean}`);
    } else {
      fail(`${filePath} has broken internal link: ${href}`);
    }
  }
}

console.log(`\nLINK_AUDIT_INTERNAL_COUNT: ${internalCount}`);
console.log(`LINK_AUDIT_EXTERNAL_COUNT: ${externalLinks.size}`);

if (failures > 0) {
  console.error(`LINK_AUDIT: FAIL (${failures} issue${failures === 1 ? '' : 's'})`);
  process.exit(1);
}

console.log('LINK_AUDIT: PASS');
