import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import { aliasRoutes, canonicalRoutes } from "./site-contract.mjs";

const baseUrl = (process.argv[2] || "https://7ya.io").replace(/\/$/, "");
const timeoutMs = Number(process.env.TIMEOUT_MS || 15000);
const maxBodyBytes = 128 * 1024;

const routes = canonicalRoutes.map(route => [
  `/${route ? `${route}/` : ''}`,
  route ? `${route}/index.html` : 'index.html',
]);

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

async function expectedTitles() {
  const result = new Map();
  for (const [route, file] of routes) {
    const html = await fs.readFile(file, "utf8");
    result.set(route, extractTitle(html));
  }
  return result;
}

function request(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.get(
      url,
      {
        timeout: timeoutMs,
        headers: { "user-agent": "7ya-route-verifier/2.0" },
      },
      (res) => {
        const chunks = [];
        let bytes = 0;
        res.on("data", (chunk) => {
          if (bytes >= maxBodyBytes) return;
          const remaining = maxBodyBytes - bytes;
          const bounded = chunk.subarray(0, remaining);
          chunks.push(bounded);
          bytes += bounded.length;
        });
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({
            url,
            statusCode: res.statusCode,
            location: res.headers.location || null,
            contentType: res.headers["content-type"] || null,
            title: extractTitle(body),
            body,
          });
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (error) => resolve({ url, error: error.message }));
  });
}

const titles = await expectedTitles();
let failures = 0;

for (const [route] of routes) {
  const result = await request(`${baseUrl}${route}`);
  if (result.error) {
    failures += 1;
    console.error(`FAIL ${result.url}: ${result.error}`);
    continue;
  }
  if (result.statusCode !== 200) {
    failures += 1;
    console.error(`FAIL ${result.url}: HTTP ${result.statusCode}`);
    continue;
  }
  const expectedTitle = titles.get(route);
  if (!result.title || result.title !== expectedTitle) {
    failures += 1;
    console.error(
      `FAIL ${result.url}: title mismatch; expected ${JSON.stringify(expectedTitle)}, got ${JSON.stringify(result.title)}`,
    );
    continue;
  }
  console.log(`PASS ${result.url}: HTTP 200; title ${JSON.stringify(result.title)}`);
}

for (const [alias, target] of aliasRoutes) {
  const route = `/${alias}/`;
  const result = await request(`${baseUrl}${route}`);
  if (result.error) {
    failures += 1;
    console.error(`FAIL ${result.url}: ${result.error}`);
  } else if ([301, 302, 307, 308].includes(result.statusCode)) {
    const location = String(result.location || "");
    if (location.includes(target)) {
      console.log(`PASS ${result.url}: HTTP ${result.statusCode} -> ${result.location}`);
    } else {
      failures += 1;
      console.error(`FAIL ${result.url}: unexpected location ${result.location || "<missing>"}`);
    }
  } else if (
    result.statusCode === 200 &&
    (result.title === titles.get(target) ||
      (result.body?.includes(`<link rel="canonical" href="https://7ya.io${target}">`) &&
        result.body?.includes('http-equiv="refresh"')))
  ) {
    console.log(`PASS ${result.url}: HTTP 200 canonical fallback; title ${JSON.stringify(result.title)}`);
  } else {
    failures += 1;
    console.error(`FAIL ${result.url}: expected redirect to ${target} or matching fallback page, got HTTP ${result.statusCode}`);
  }
}

if (failures) {
  console.error(`\nROUTE_VERIFY: FAIL (${failures})`);
  process.exit(1);
}

console.log("\nROUTE_VERIFY: PASS");
