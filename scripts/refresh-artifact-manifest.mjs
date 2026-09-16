import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.join(process.cwd(), 'dist');

async function walk(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported artifact entry: ${relative}`);
  }

  return files;
}

const artifactFiles = (await walk(output)).filter((file) => file !== 'artifact-manifest.json');
if (artifactFiles.length === 0) throw new Error('No built artifact files found under dist');

const hashes = {};
for (const file of artifactFiles) {
  const body = await fs.readFile(path.join(output, file));
  hashes[file] = crypto.createHash('sha256').update(body).digest('hex');
}

const manifest = {
  schema_version: 1,
  artifact: '7ya-static-site',
  file_count: artifactFiles.length,
  files: hashes,
};

await fs.writeFile(
  path.join(output, 'artifact-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`STATIC_ARTIFACT_MANIFEST_REFRESH: PASS (${artifactFiles.length} files)`);
