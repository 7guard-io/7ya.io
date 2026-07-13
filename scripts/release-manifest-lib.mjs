import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const MANIFEST_SCHEMA = "7ya.release-manifest.v1";
const HASH_ALGORITHM = "sha256";

function sha256(buffer) {
  return createHash(HASH_ALGORITHM).update(buffer).digest("hex");
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function assertInside(root, candidate, label) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must be inside the release root`);
  }
}

async function collectFiles(root, current = root) {
  const entries = await fs.readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;

    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(root, absolute)));
      continue;
    }

    if (entry.isSymbolicLink()) {
      throw new Error(`Symlinks are not allowed in release bundles: ${absolute}`);
    }

    if (!entry.isFile()) {
      throw new Error(`Unsupported filesystem entry in release bundle: ${absolute}`);
    }

    files.push(absolute);
  }

  return files;
}

function generatedAtUtc() {
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;
  if (!sourceDateEpoch) return new Date().toISOString();

  const epochSeconds = Number(sourceDateEpoch);
  if (!Number.isFinite(epochSeconds) || epochSeconds < 0) {
    throw new Error("SOURCE_DATE_EPOCH must be a non-negative number of seconds");
  }

  return new Date(epochSeconds * 1000).toISOString();
}

export async function buildReleaseManifest({
  rootDir,
  manifestPath,
  service = process.env.RELEASE_SERVICE || "7ya-api",
  commit = process.env.GITHUB_SHA || process.env.COMMIT_SHA || "local",
}) {
  const root = path.resolve(rootDir);
  const output = path.resolve(manifestPath);
  assertInside(root, output, "Manifest path");

  const allFiles = await collectFiles(root);
  const releaseFiles = allFiles
    .filter((absolute) => absolute !== output)
    .sort((left, right) =>
      toPosix(path.relative(root, left)).localeCompare(
        toPosix(path.relative(root, right)),
      ),
    );

  if (releaseFiles.length === 0) {
    throw new Error(`Release bundle is empty: ${root}`);
  }

  const files = [];
  for (const absolute of releaseFiles) {
    const content = await fs.readFile(absolute);
    files.push({
      path: toPosix(path.relative(root, absolute)),
      bytes: content.byteLength,
      sha256: sha256(content),
    });
  }

  const bundlePayload = files
    .map((file) => `${file.path}\0${file.bytes}\0${file.sha256}\n`)
    .join("");

  return {
    schema: MANIFEST_SCHEMA,
    service,
    commit,
    generated_at_utc: generatedAtUtc(),
    algorithm: HASH_ALGORITHM,
    file_count: files.length,
    bundle_sha256: sha256(Buffer.from(bundlePayload, "utf8")),
    files,
  };
}

export async function writeReleaseManifest(options) {
  const manifest = await buildReleaseManifest(options);
  const output = path.resolve(options.manifestPath);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

export async function verifyReleaseManifest({
  rootDir,
  manifestPath,
  expectedCommit,
}) {
  const root = path.resolve(rootDir);
  const output = path.resolve(manifestPath);
  assertInside(root, output, "Manifest path");

  const raw = await fs.readFile(output, "utf8");
  const observed = JSON.parse(raw);

  if (observed.schema !== MANIFEST_SCHEMA) {
    throw new Error(`Unsupported manifest schema: ${observed.schema}`);
  }
  if (observed.algorithm !== HASH_ALGORITHM) {
    throw new Error(`Unsupported hash algorithm: ${observed.algorithm}`);
  }
  if (expectedCommit && observed.commit !== expectedCommit) {
    throw new Error(
      `Manifest commit mismatch: expected ${expectedCommit}, observed ${observed.commit}`,
    );
  }

  const rebuilt = await buildReleaseManifest({
    rootDir: root,
    manifestPath: output,
    service: observed.service,
    commit: observed.commit,
  });

  if (observed.file_count !== rebuilt.file_count) {
    throw new Error(
      `Manifest file count mismatch: expected ${observed.file_count}, observed ${rebuilt.file_count}`,
    );
  }
  if (observed.bundle_sha256 !== rebuilt.bundle_sha256) {
    throw new Error(
      `Bundle SHA-256 mismatch: expected ${observed.bundle_sha256}, observed ${rebuilt.bundle_sha256}`,
    );
  }
  if (JSON.stringify(observed.files) !== JSON.stringify(rebuilt.files)) {
    throw new Error("Release file inventory or file hashes do not match the manifest");
  }

  return observed;
}
