import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const allowedExtensions = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.txt', '.xml', '.svg']);
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.release-evidence']);
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (ignoredDirectories.has(entry.name)) continue;

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }

    if (!allowedExtensions.has(extname(entry.name).toLowerCase())) continue;
    await inspect(path);
  }
}

async function inspect(path) {
  const metadata = await stat(path);
  if (metadata.size > 5_000_000) return;

  const buffer = await readFile(path);
  const displayPath = relative(root, path);

  if (buffer.includes(0)) {
    failures.push(`${displayPath}: contains a NUL byte`);
    return;
  }

  const text = buffer.toString('utf8');
  if (text.includes('\uFFFD')) {
    failures.push(`${displayPath}: contains Unicode replacement characters (possible binary/encoding corruption)`);
  }

  const controlMatch = text.match(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/u);
  if (controlMatch) {
    failures.push(`${displayPath}: contains an unexpected control character U+${controlMatch[0].codePointAt(0).toString(16).padStart(4, '0').toUpperCase()}`);
  }

  if (extname(path).toLowerCase() === '.css') {
    const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, '');
    let depth = 0;
    for (const character of withoutComments) {
      if (character === '{') depth += 1;
      if (character === '}') depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) failures.push(`${displayPath}: unbalanced CSS braces (${depth})`);
  }
}

await walk(root);

if (failures.length) {
  console.error('Text integrity check failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Text integrity check passed.');
