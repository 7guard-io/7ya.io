import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  verifyReleaseManifest,
  writeReleaseManifest,
} from "./release-manifest-lib.mjs";

async function createFixture() {
  const rootDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "7ya-release-manifest-"),
  );
  const publicDir = path.join(rootDir, "public");
  const functionsDir = path.join(rootDir, "netlify", "functions");
  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(functionsDir, { recursive: true });
  await fs.writeFile(
    path.join(publicDir, "index.html"),
    "<h1>7YA</h1>\n",
    "utf8",
  );
  await fs.writeFile(
    path.join(functionsDir, "chat.js"),
    "export default {};\n",
    "utf8",
  );
  return {
    rootDir,
    manifestPath: path.join(publicDir, "release-manifest.json"),
  };
}

test("release manifest verifies an unchanged bundle", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.rootDir, { recursive: true, force: true }));

  const written = await writeReleaseManifest({
    ...fixture,
    service: "7ya-api",
    commit: "fixture-sha",
  });
  const verified = await verifyReleaseManifest({
    ...fixture,
    expectedCommit: "fixture-sha",
  });

  assert.equal(verified.bundle_sha256, written.bundle_sha256);
  assert.equal(verified.file_count, 2);
});

test("release manifest rejects file tampering", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.rootDir, { recursive: true, force: true }));

  await writeReleaseManifest({
    ...fixture,
    service: "7ya-api",
    commit: "fixture-sha",
  });
  await fs.appendFile(
    path.join(fixture.rootDir, "public", "index.html"),
    "tampered\n",
  );

  await assert.rejects(
    verifyReleaseManifest({ ...fixture, expectedCommit: "fixture-sha" }),
    /Bundle SHA-256 mismatch/,
  );
});

test("release manifest rejects extra files and commit mismatch", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.rootDir, { recursive: true, force: true }));

  await writeReleaseManifest({
    ...fixture,
    service: "7ya-api",
    commit: "fixture-sha",
  });

  await assert.rejects(
    verifyReleaseManifest({ ...fixture, expectedCommit: "other-sha" }),
    /Manifest commit mismatch/,
  );

  await fs.writeFile(
    path.join(fixture.rootDir, "unexpected.txt"),
    "unexpected\n",
    "utf8",
  );
  await assert.rejects(
    verifyReleaseManifest({ ...fixture, expectedCommit: "fixture-sha" }),
    /Manifest file count mismatch|Bundle SHA-256 mismatch/,
  );
});
