import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  criticalArtifactPaths,
  forbiddenArtifactEntries,
  publicDataDirectories,
  publicRootFiles,
  publicRouteDirectories,
} from './site-contract.mjs';

const output = path.join(process.cwd(), 'dist');
const manifestPath = path.join(output, 'artifact-manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

const failures = [];
const fail = message => failures.push(message);

async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
    else fail(`unsupported artifact entry ${relative}`);
  }
  return files;
}

function localCandidates(sourceFile, reference) {
  if (!reference || reference.startsWith('#') || /^%23/i.test(reference)) return [];
  let url;
  try { url = new URL(reference, `https://7ya.io/${sourceFile}`); }
  catch { return []; }
  if (!['http:', 'https:'].includes(url.protocol) || url.hostname !== '7ya.io') return [];

  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return [`INVALID:${reference}`]; }
  const clean = pathname.replace(/^\/+/, '');
  if (!clean) return ['index.html'];
  if (pathname.endsWith('/')) return [`${clean}index.html`];
  if (path.posix.extname(clean)) return [clean];
  return [clean, `${clean}.html`, `${clean}/index.html`];
}

function referencesFrom(file, body) {
  const references = [];
  if (file.endsWith('.html')) {
    for (const match of body.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) references.push(match[1].trim());
    for (const match of body.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
      for (const candidate of match[1].split(',')) references.push(candidate.trim().split(/\s+/)[0]);
    }
  }
  if (file.endsWith('.css')) {
    for (const match of body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1].trim());
  }
  return references;
}

for (const relative of criticalArtifactPaths) {
  try { await fs.access(path.join(output, relative)); }
  catch { fail(`missing critical artifact path ${relative}`); }
}

for (const relative of forbiddenArtifactEntries) {
  try {
    await fs.access(path.join(output, relative));
    fail(`forbidden artifact entry ${relative}`);
  } catch {}
}

const allowedTopLevel = new Set([
  ...publicRootFiles.map(entry => entry.split('/')[0]),
  ...publicDataDirectories,
  ...publicRouteDirectories,
  'styles',
  'scripts',
  'artifact-manifest.json',
]);

for (const entry of await fs.readdir(output)) {
  if (!allowedTopLevel.has(entry)) fail(`unexpected top-level artifact entry ${entry}`);
}

const manifestEntries = Object.entries(manifest.files || {});
const artifactFiles = (await walk(output)).filter(file => file !== 'artifact-manifest.json');
if (manifest.schema_version !== 1) fail('artifact manifest schema mismatch');
if (manifest.artifact !== '7ya-static-site') fail('artifact manifest identity mismatch');
if (manifest.file_count !== manifestEntries.length) fail('artifact manifest file count mismatch');
const manifestedFiles = new Set(manifestEntries.map(([file]) => file));
if (artifactFiles.length !== manifestedFiles.size || artifactFiles.some(file => !manifestedFiles.has(file))) {
  fail('artifact files do not exactly match the immutable manifest');
}

for (const [relative, expectedHash] of manifestEntries) {
  const body = await fs.readFile(path.join(output, relative));
  const actualHash = crypto.createHash('sha256').update(body).digest('hex');
  if (actualHash !== expectedHash) fail(`hash mismatch for ${relative}`);

  if (relative.endsWith('.html') || relative.endsWith('.css')) {
    for (const reference of referencesFrom(relative, body.toString('utf8'))) {
      const candidates = localCandidates(relative, reference);
      if (candidates.length && !candidates.some(candidate => manifest.files?.[candidate])) {
        fail(`${relative} references unpublished path ${reference}`);
      }
    }
  }
}

const cname = (await fs.readFile(path.join(output, 'CNAME'), 'utf8')).trim();
if (cname !== '7ya.io') fail(`CNAME mismatch: ${cname}`);

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`STATIC_ARTIFACT_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`STATIC_ARTIFACT_CONTRACT: PASS (${manifestEntries.length} verified files)`);
