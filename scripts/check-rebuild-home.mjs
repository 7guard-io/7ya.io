import fs from 'node:fs/promises';
import path from 'node:path';

const artifact = process.argv.includes('--artifact');
const base = artifact ? path.join(process.cwd(), 'dist') : process.cwd();
const html = await fs.readFile(path.join(base, 'index.html'), 'utf8');
const failures = [];
const requireText = (text, label = text) => { if (!html.includes(text)) failures.push(`missing ${label}`); };
const forbidText = (text, label = text) => { if (html.includes(text)) failures.push(`forbidden ${label}`); };

requireText('7ya-rebuild-home-20260930-v1', 'rebuild release marker');
requireText('אני איגור.', 'human-first hero copy');
requireText('data-public-echo', 'public Echo section');
requireText('data-now-work', 'Now section');

const h1Count = (html.match(/<h1\b/gi) || []).length;
if (h1Count !== 1) failures.push(`expected exactly 1 H1, found ${h1Count}`);
const navCount = (html.match(/data-seven-human-nav/g) || []).length;
if (navCount !== 1) failures.push(`expected exactly 1 human nav, found ${navCount}`);
const momentCount = (html.match(/data-home-moment/g) || []).length;
if (momentCount < 6 || momentCount > 12) failures.push(`expected 6–12 home moments, found ${momentCount}`);
forbidText('<header class="topbar">', 'duplicate legacy topbar');
for (const token of ['Acceptance Gate','PUBLIC RECORD','DISTRIBUTION INSTANCE','5.1B','6.2B','7B']) forbidText(token);

const cards = [...html.matchAll(/<a\b[^>]*data-home-moment[^>]*>[\s\S]*?<\/a>/gi)].map(m => m[0]);
for (const [index, card] of cards.entries()) {
  if (!/\bhref=["'][^"']+["']/i.test(card)) failures.push(`moment ${index + 1} missing href`);
  if (!/<img\b[^>]*\bsrc=["'][^"']+["'][^>]*>/i.test(card)) failures.push(`moment ${index + 1} missing image`);
  if (!/<img\b[^>]*\balt=["'][^"']+["'][^>]*>/i.test(card)) failures.push(`moment ${index + 1} missing alt`);
  if (!/data-source-context=["'][^"']+["']/i.test(card)) failures.push(`moment ${index + 1} missing source/context label`);
}

if (failures.length) {
  failures.forEach(f => console.error(`REBUILD_HOME_FAIL: ${f}`));
  process.exit(1);
}
console.log(`REBUILD_HOME: PASS (${momentCount} source-bound moments, ${artifact ? 'artifact' : 'source'})`);
