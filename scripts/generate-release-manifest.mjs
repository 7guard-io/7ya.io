import path from "node:path";
import process from "node:process";
import { writeReleaseManifest } from "./release-manifest-lib.mjs";

const rootDir = path.resolve(process.argv[2] || ".netlify-api-deploy");
const manifestPath = path.resolve(
  process.argv[3] || path.join(rootDir, "public", "release-manifest.json"),
);

try {
  const manifest = await writeReleaseManifest({ rootDir, manifestPath });
  console.log(`Release manifest written: ${manifestPath}`);
  console.log(`Bundle SHA-256: ${manifest.bundle_sha256}`);
  console.log(`Files: ${manifest.file_count}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
