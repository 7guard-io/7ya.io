import fs from 'node:fs/promises';
import path from 'node:path';
import { GA4_MARKER, GA4_MEASUREMENT_ID } from './inject-ga4.mjs';

const output = path.join(process.cwd(), 'dist');
const failures = [];

async function walk(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
  }

  return files;
}

const htmlFiles = (await walk(output)).filter((file) => file.endsWith('.html'));
if (htmlFiles.length === 0) {
  console.error('GA4_ARTIFACT_CONTRACT: FAIL (no HTML files found)');
  process.exit(1);
}

for (const relative of htmlFiles) {
  const html = await fs.readFile(path.join(output, relative), 'utf8');
  const ids = [...html.matchAll(/googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/g)]
    .map((match) => match[1]);

  if (!html.includes(GA4_MARKER)) failures.push(`${relative} missing ${GA4_MARKER}`);
  if (ids.length !== 1) failures.push(`${relative} must contain exactly one GA4 loader; found ${ids.length}`);
  if (ids.some((id) => id !== GA4_MEASUREMENT_ID)) {
    failures.push(`${relative} contains unexpected GA4 measurement ID: ${ids.join(', ')}`);
  }
  if (!html.includes(`gtag('config', '${GA4_MEASUREMENT_ID}'`)) {
    failures.push(`${relative} missing GA4 config for ${GA4_MEASUREMENT_ID}`);
  }
}

if (failures.length) {
  failures.forEach((message) => console.error(`FAIL ${message}`));
  console.error(`GA4_ARTIFACT_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`GA4_ARTIFACT_CONTRACT: PASS (${htmlFiles.length} HTML files, ${GA4_MEASUREMENT_ID})`);
