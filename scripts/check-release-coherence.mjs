import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
const backend = await readFile(new URL('../backend/index.ts', import.meta.url), 'utf8');

const htmlRelease = html.match(/<meta name=['"]7ya-release['"] content=['"]([^'"]+)['"]/)?.[1] || '';
const htmlBuild = html.match(/<meta name=['"]7ya-build['"] content=['"]([^'"]+)['"]/)?.[1] || '';
const appRelease = app.match(/const release=['"]([^'"]+)['"]/)?.[1] || '';
const backendRelease = backend.match(/const release=['"]([^'"]+)['"]/)?.[1] || '';
const values = [htmlRelease, htmlBuild, appRelease, backendRelease];

if (values.some(value => !value) || new Set(values).size !== 1) {
    console.error('7YA release coherence failed:', {htmlRelease, htmlBuild, appRelease, backendRelease});
    process.exit(1);
}

console.log(`7YA release coherence passed: ${htmlRelease}`);
