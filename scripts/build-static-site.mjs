import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  publicDataDirectories,
  publicRootFiles,
  publicRouteDirectories,
  publicScriptFiles,
  publicStyleFiles,
} from './site-contract.mjs';

const root = process.cwd();
const output = path.join(root, 'dist');

async function requireRegularSource(relative) {
  const source = path.join(root, relative);
  const stat = await fs.lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Refusing symlink in public artifact: ${relative}`);
  return source;
}

async function copyFile(relative, destination = relative) {
  const source = await requireRegularSource(relative);
  const target = path.join(output, destination);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function copyDirectory(relative) {
  const source = await requireRegularSource(relative);
  await fs.cp(source, path.join(output, relative), {
    recursive: true,
    dereference: false,
    errorOnExist: false,
  });
}

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

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

for (const file of publicRootFiles) await copyFile(file);
for (const directory of [...publicDataDirectories, ...publicRouteDirectories]) await copyDirectory(directory);
for (const file of publicStyleFiles) await copyFile(`styles/${file}`);
for (const file of publicScriptFiles) await copyFile(`scripts/${file}`);

const artifactFiles = await walk(output);
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

console.log(`STATIC_ARTIFACT_BUILD: PASS (${artifactFiles.length} files + manifest)`);
