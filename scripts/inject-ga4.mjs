import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist';
const measurementId = process.env.GA_MEASUREMENT_ID ?? 'G-1028S7MMGQ';
const marker = '<!-- 7YA_GA4 -->';

if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
  throw new Error(`Invalid GA4 measurement ID: ${measurementId}`);
}

const snippet = `  ${marker}
  <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: true });
  </script>`;

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listHtmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

const files = await listHtmlFiles(root);
if (files.length === 0) throw new Error(`No HTML files found under ${root}`);

let injected = 0;
let alreadyConfigured = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const existingIds = [...html.matchAll(/googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/g)]
    .map((match) => match[1]);

  if (existingIds.some((id) => id !== measurementId)) {
    throw new Error(`${file} contains a conflicting GA4 ID: ${existingIds.join(', ')}`);
  }

  if (html.includes(marker) || existingIds.includes(measurementId)) {
    alreadyConfigured += 1;
    continue;
  }

  if (!html.includes('</head>')) {
    throw new Error(`${file} is missing </head>`);
  }

  await writeFile(file, html.replace('</head>', `${snippet}\n</head>`), 'utf8');
  injected += 1;
}

console.log(`GA4 ${measurementId}: injected=${injected}, already-configured=${alreadyConfigured}, total=${files.length}`);
