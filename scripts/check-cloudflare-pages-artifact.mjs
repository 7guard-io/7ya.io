import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');
const maxFileBytes = 25 * 1024 * 1024;
const maxFiles = Number(process.env.CLOUDFLARE_PAGES_MAX_FILES || 20000);

const files = [];

async function walk(directory, prefix = '') {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    const stat = await fs.lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Cloudflare Pages artifact contains symlink: ${relative}`);
    if (entry.isDirectory()) await walk(absolute, relative);
    else if (entry.isFile()) files.push({ relative, size: stat.size });
  }
}

await walk(root);

if (!files.some(file => file.relative === 'index.html')) {
  throw new Error('Cloudflare Pages artifact is missing dist/index.html');
}

const oversized = files.filter(file => file.size > maxFileBytes);
if (oversized.length) {
  for (const file of oversized) {
    console.error(`OVERSIZED ${file.relative}: ${(file.size / 1024 / 1024).toFixed(2)} MiB`);
  }
  throw new Error(`Cloudflare Pages supports individual static assets up to 25 MiB; found ${oversized.length} oversized file(s)`);
}

if (files.length > maxFiles) {
  throw new Error(`Cloudflare Pages artifact has ${files.length} files; conservative project limit is ${maxFiles}`);
}

const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
const largest = [...files].sort((a, b) => b.size - a.size).slice(0, 10);

console.log(`CLOUDFLARE_PAGES_ARTIFACT: PASS (files=${files.length}, total=${(totalBytes / 1024 / 1024).toFixed(2)} MiB)`);
for (const file of largest) {
  console.log(`  ${(file.size / 1024 / 1024).toFixed(2)} MiB  ${file.relative}`);
}
