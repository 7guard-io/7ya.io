import { readFile, writeFile } from 'node:fs/promises';

const indexPath = new URL('../index.html', import.meta.url);
const html = await readFile(indexPath, 'utf8');
const legacyBlock = /(?:<textarea\b[^>]*\bid=['"]legacy-recovery-inert['"][^>]*>[\s\S]*?<\/textarea>|<!-- legacy-recovery-inert -->[\s\S]*?<!-- \/legacy-recovery-inert -->)/i;

if (!legacyBlock.test(html)) {
    console.log('7YA legacy recovery block already absent.');
    process.exit(0);
}

const cleaned = html.replace(legacyBlock, '');
if (legacyBlock.test(cleaned)) {
    console.error('7YA legacy recovery strip failed.');
    process.exit(1);
}

await writeFile(indexPath, cleaned, 'utf8');
console.log('7YA legacy recovery block stripped from root HTML.');
