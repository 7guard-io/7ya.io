import path from "node:path";
import process from "node:process";
import { verifyReleaseManifest } from "./release-manifest-lib.mjs";

const manifestPath = path.resolve(
  process.argv[2] || ".netlify-api-deploy/public/release-manifest.json",
);
const rootDir = path.resolve(
  process.argv[3] || path.dirname(path.dirname(manifestPath)),
);
const expectedCommit =
  process.env.EXPECTED_COMMIT || process.env.GITHUB_SHA || undefined;

try {
  const manifest = await verifyReleaseManifest({
    rootDir,
    manifestPath,
    expectedCommit,
  });
  console.log(`Release manifest verified: ${manifestPath}`);
  console.log(`Bundle SHA-256: ${manifest.bundle_sha256}`);
  console.log(`Commit: ${manifest.commit}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
