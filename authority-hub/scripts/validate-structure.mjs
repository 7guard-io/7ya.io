import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'src/app/(default)/layout.tsx',
  'src/app/(default)/page.tsx',
  'src/app/(default)/igor-vepretski/page.tsx',
  'src/app/(default)/starton/page.tsx',
  'src/app/(default)/evidence-wall/page.tsx',
  'src/app/(default)/timeline/page.tsx',
  'src/app/(default)/press/page.tsx',
  'src/app/[locale]/layout.tsx',
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/[slug]/page.tsx',
  'src/components/EvidenceCard.tsx',
  'src/data/claims.json',
  'src/lib/schema.ts',
  'public/press/igor-vepretski-bio-he.txt',
  'public/press/igor-vepretski-bio-en.txt',
  'public/press/igor-vepretski-bio-ru.txt',
  'public/press/starton-fact-sheet.json'
];

const failures = required.filter((relative) => !fs.existsSync(path.join(root, relative)));
const card = fs.readFileSync(path.join(root, 'src/components/EvidenceCard.tsx'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'src/lib/schema.ts'), 'utf8');

for (const token of ['claim.id', 'claim.sourceUrl', 'claim.status', 'whatItProves', 'whatItDoesNotProve']) {
  if (!card.includes(token)) failures.push(`EvidenceCard missing ${token}`);
}
for (const token of ["'@type': 'Person'", "'@type': 'Organization'", '580752814']) {
  if (!schema.includes(token)) failures.push(`Schema missing ${token}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  console.error(`AUTHORITY_STRUCTURE: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`AUTHORITY_STRUCTURE: PASS (${required.length} required paths)`);
