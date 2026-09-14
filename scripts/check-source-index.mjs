import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const legacyTextarea = /<textarea\b[^>]*\bid=['"]legacy-recovery-inert['"][^>]*>/i;

if (legacyTextarea.test(html)) {
    console.error('7YA source index invariant failed: legacy recovery is still exposed as textarea content.');
    process.exit(1);
}

console.log('7YA source index invariant passed.');
