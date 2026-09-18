import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');
const forbidden = [
  ['AppDeploy client package', '@appdeploy/client'],
  ['AppDeploy browser global', 'window.appdeploy'],
  ['AppDeploy runtime host', '.appdeploy.ai'],
  ['AppDeploy runtime host', '.appdeploy.com'],
  ['legacy AppDeploy provider marker', '"provider":"appdeploy"'],
];

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

const textExtensions = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml', '.webmanifest']);
const failures = [];
for (const file of await walk(root)) {
  if (!textExtensions.has(path.extname(file)) && path.basename(file) !== 'CNAME') continue;
  const body = await fs.readFile(file, 'utf8');
  for (const [label, needle] of forbidden) {
    if (body.toLowerCase().includes(needle.toLowerCase())) {
      failures.push(`${path.relative(root, file)} contains ${label}`);
    }
  }
}

if (failures.length) {
  failures.forEach(failure => console.error(`FAIL ${failure}`));
  console.error(`PROVIDER_INDEPENDENT_RUNTIME: FAIL (${failures.length})`);
  process.exit(1);
}

console.log('PROVIDER_INDEPENDENT_RUNTIME: PASS (static artifact has no AppDeploy runtime dependency)');
