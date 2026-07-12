import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const outputRoot = path.resolve(
  process.env.NETLIFY_API_OUTPUT || ".netlify-api-deploy",
);
const functionsDir = path.join(outputRoot, "netlify", "functions");
const publicDir = path.join(outputRoot, "public");
const commitSha = process.env.GITHUB_SHA || process.env.COMMIT_SHA || "local";
const generatedAt = new Date().toISOString();

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(functionsDir, { recursive: true });
await fs.mkdir(publicDir, { recursive: true });

await fs.copyFile(
  path.resolve("netlify/functions/chat.js"),
  path.join(functionsDir, "chat.js"),
);

await fs.writeFile(
  path.join(outputRoot, "netlify.toml"),
  `[build]\n  functions = "netlify/functions"\n  publish = "public"\n\n[[redirects]]\n  from = "/api/*"\n  to = "/.netlify/functions/:splat"\n  status = 200\n\n[[headers]]\n  for = "/*"\n  [headers.values]\n    Cache-Control = "no-store"\n    X-Content-Type-Options = "nosniff"\n    X-Frame-Options = "DENY"\n    Referrer-Policy = "no-referrer"\n`,
  "utf8",
);

await fs.writeFile(
  path.join(publicDir, "index.html"),
  `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <meta name="robots" content="noindex,nofollow">\n  <title>7YA API</title>\n</head>\n<body>\n  <main>\n    <h1>7YA API</h1>\n    <p>Production API endpoint.</p>\n  </main>\n</body>\n</html>\n`,
  "utf8",
);

await fs.writeFile(
  path.join(publicDir, "deployment.json"),
  `${JSON.stringify(
    {
      service: "7ya-api",
      commit: commitSha,
      generated_at_utc: generatedAt,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Prepared Netlify API bundle at ${outputRoot}`);
console.log(`Source commit: ${commitSha}`);
