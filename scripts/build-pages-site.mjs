import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const requiredFiles = ['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'favicon.svg'];
const publicFiles = ['scripts/site-20260713.js'];
const publicDirectories = [
  'assets', 'styles', 'igor-vepretski', 'journey', 'starton', 'evidence',
  'talk', 'contact', '7ya', 'influence', 'articles', 'speaker', 'social',
  'oracle', 'business', 'media', 'pass', 'radar', 'delta-audit'
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of [...requiredFiles, ...publicFiles]) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) throw new Error(`Required publication file is missing: ${file}`);
  const destination = path.join(out, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

for (const directory of publicDirectories) {
  const source = path.join(root, directory);
  if (!fs.existsSync(source)) throw new Error(`Required publication directory is missing: ${directory}`);
  fs.cpSync(source, path.join(out, directory), { recursive: true });
}

fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`Prepared GitHub Pages artifact with ${requiredFiles.length + publicFiles.length} root files and ${publicDirectories.length} directories.`);
