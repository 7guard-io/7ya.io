import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const lockPath = path.join(root, 'package-lock.json');
const packagePath = path.join(root, 'package.json');
const outputPath = path.join(root, 'THIRD_PARTY_NOTICES.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function packageName(lockPathName) {
  const parts = lockPathName.split('node_modules/');
  return parts[parts.length - 1].replace(/\/$/, '');
}

function clean(value) {
  return String(value ?? 'UNKNOWN').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}

const shouldWrite = process.argv.includes('--write');
const pkg = readJson(packagePath);
const lockRaw = fs.readFileSync(lockPath, 'utf8');
const lock = JSON.parse(lockRaw);
const rootLock = lock.packages?.[''] ?? {};
const runtimeDirect = new Set(Object.keys(rootLock.dependencies ?? pkg.dependencies ?? {}));
const devDirect = new Set(Object.keys(rootLock.devDependencies ?? pkg.devDependencies ?? {}));

const rows = Object.entries(lock.packages ?? {})
  .filter(([key]) => key.includes('node_modules/'))
  .map(([key, meta]) => {
    const name = packageName(key);
    const declared = runtimeDirect.has(name) ? 'direct runtime' : devDirect.has(name) ? 'direct dev' : 'transitive';
    const scope = meta.dev ? 'development' : 'runtime';
    return { name, version: meta.version ?? 'unknown', license: meta.license ?? 'UNKNOWN', scope, declared };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const lines = [
  '# Third Party Notices — 7ya.io',
  '',
  'This file is the open-source attribution register for the 7ya.io public site and documentation layer.',
  '',
  'Source of truth:',
  '',
  '- package.json for declared direct dependencies.',
  '- package-lock.json for the installed dependency graph.',
  `- Lockfile SHA-256: ${hash(lockRaw)}`,
  '',
  'Important: use notices from the actual repository dependencies. Do not copy notices from a different product unless the same dependency is present here.',
  '',
  '## Dependency register',
  '',
  '| Package | Version | Scope | Declared as | License from lockfile |',
  '|---|---:|---|---|---|',
  ...rows.map((row) => `| ${clean(row.name)} | ${clean(row.version)} | ${clean(row.scope)} | ${clean(row.declared)} | ${clean(row.license)} |`),
  '',
  '## Compliance rules',
  '',
  '- Preserve required copyright and license notices.',
  '- Preserve warranty and liability disclaimers.',
  '- Preserve NOTICE-file content where applicable.',
  '- Mark modified source files when a license requires it.',
  '- Do not imply upstream endorsement without written permission.',
  ''
];

const output = `${lines.join('\n')}\n`;
if (shouldWrite) {
  fs.writeFileSync(outputPath, output);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
} else {
  process.stdout.write(output);
}
