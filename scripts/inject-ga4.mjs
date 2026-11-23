import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const GA4_MEASUREMENT_ID = 'G-PVKYN39ZNF';
export const GA4_MARKER = '<!-- 7YA_GA4 -->';

const snippet = [
  '  ' + GA4_MARKER,
  '  <script async src="https://www.googletagmanager.com/gtm.js?id=' + GA4_MEASUREMENT_ID + '"></script>',
  '  <script>',
  '    window.dataLayer = window.dataLayer || [];',
  '    function gtag(){dataLayer.push(arguments);}',
  "    gtag('js', new Date());",
  '  </script>'
].join('\n');

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

export async function injectGa4(root = 'dist') {
  const files = await listHtmlFiles(root);
  if (!files.length) throw new Error('No HTML files found under ' + root);
  let injected = 0;
  let alreadyConfigured = 0;

  for (const file of files) {
    if (file.replaceAll('\\', '/').includes('/api/')) continue;
    const html = await readFile(file, 'utf8');
    const ids = [...html.matchAll(/googletagmanager\.com\/(?:gtm|gtag)\/js\?id=(G-[A-Z0-9]+)/g)].map((match) => match[1]);
    if (ids.some((id) => id !== GA4_MEASUREMENT_ID)) {
      throw new Error(file + ' contains a conflicting Google tag ID: ' + ids.join(', '));
    }
    if (ids.length > 1) throw new Error(file + ' contains more than one Google tag loader');
    if (html.includes(GA4_MARKER) || ids.length === 1) {
      alreadyConfigured += 1;
      continue;
    }
    if (!html.includes('</head>')) throw new Error(file + ' is missing </head>');
    await writeFile(file, html.replace('</head>', snippet + '\n</head>'), 'utf8');
    injected += 1;
  }
  console.log('Google tag ' + GA4_MEASUREMENT_ID + ': injected=' + injected + ', already-configured=' + alreadyConfigured + ', total=' + files.length);
  return { injected, alreadyConfigured, total: files.length };
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) await injectGa4(process.argv[2] ?? 'dist');
