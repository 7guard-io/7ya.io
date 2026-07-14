import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'index.html',
  'igor-vepretski/index.html',
  'journey/index.html',
  'starton/index.html',
  'influence/index.html',
  'evidence/index.html',
  '7ya/index.html',
  'speaker/index.html',
  'talk/index.html',
  'media/index.html',
  'articles/index.html',
  'contact/index.html',
  'delta-audit/index.html',
  'legacy/index.html',
  'about/index.html',
  'social/index.html',
  'oracle/index.html',
  'business/index.html',
  'pass/index.html',
  'member-pass/index.html',
  'radar/index.html',
  'work/index.html',
  'systems/index.html',
  'public-service/index.html',
  'music/index.html',
];

let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function extract(content) {
  const links = [];
  const pattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(content))) links.push(match[1].trim());
  return links;
}

function candidates(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || !clean.startsWith('/')) return [];
  const relative = clean.replace(/^\/+/, '');
  if (!relative) return [path.join(root, 'index.html')];
  if (relative.endsWith('/')) return [path.join(root, relative, 'index.html')];
  if (path.extname(relative)) return [path.join(root, relative)];
  return [
    path.join(root, relative),
    path.join(root, `${relative}.html`),
    path.join(root, relative, 'index.html'),
  ];
}

let internal = 0;
let external = 0;

for (const file of files) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    fail(`${file} missing from link audit`);
    continue;
  }

  const body = fs.readFileSync(absolute, 'utf8');
  for (const href of extract(body)) {
    if (/^(https?:|mailto:|tel:|data:)/i.test(href)) {
      external += 1;
      continue;
    }

    const paths = candidates(href);
    if (!paths.length) continue;
    internal += 1;
    paths.some(candidate => fs.existsSync(candidate))
      ? pass(`${file} -> ${href}`)
      : fail(`${file} broken internal link: ${href}`);
  }
}

console.log(`\nLINK_AUDIT_INTERNAL_COUNT: ${internal}`);
console.log(`LINK_AUDIT_EXTERNAL_COUNT: ${external}`);
if (failures) {
  console.error(`LINK_AUDIT: FAIL (${failures})`);
  process.exit(1);
}
console.log('LINK_AUDIT: PASS');
