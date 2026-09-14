import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const required = [
    'PERSONAL ALBUM / IGOR VEPRETSKI',
    'AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION',
    "aria-label='מסלול החיים'",
    '03 · 2015—2021',
    'משטרה / אחריות ציבורית',
    '09 · 2026 → NOW',
    "content='7ya-stabilization-20260913-v2'",
];

const missing = required.filter((marker) => !html.includes(marker));
const legacyTemplateIsIndexable = html.includes("<template id='legacy-recovery-inert'>");
const legacyTextareaIsIndexable = html.includes("id='legacy-recovery-inert'");

if (missing.length || legacyTemplateIsIndexable || legacyTextareaIsIndexable) {
    console.error('7YA root first-paint invariant failed');
    if (missing.length) console.error('Missing markers:', missing.join(' | '));
    if (legacyTemplateIsIndexable) console.error('Legacy recovery remains indexable as HTML template');
    if (legacyTextareaIsIndexable) console.error('Legacy recovery remains crawlable as hidden textarea');
    process.exit(1);
}

console.log('7YA root first-paint invariant passed');
