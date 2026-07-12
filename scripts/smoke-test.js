const API_URL = process.env.API_URL || "https://7ya-api.netlify.app/api/chat";
const ORIGIN = process.env.ORIGIN || "https://7ya.io";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);
const PAYLOAD = { message: process.env.SMOKE_MESSAGE || "healthcheck" };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function list(value) {
  return (value || "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function readBodySafely(response) {
  const text = await response.text();
  if (!text) return { text: "", json: null };
  try {
    return { text, json: JSON.parse(text) };
  } catch {
    return { text, json: null };
  }
}

async function run() {
  assert(Number.isFinite(TIMEOUT_MS) && TIMEOUT_MS > 0, "TIMEOUT_MS must be positive");
  console.log(`Smoke target: ${API_URL}`);

  const preflight = await fetchWithTimeout(API_URL, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });

  assert(preflight.status === 204, `OPTIONS expected 204, received ${preflight.status}`);
  const allowOrigin = preflight.headers.get("access-control-allow-origin");
  const allowMethods = list(preflight.headers.get("access-control-allow-methods"));
  const allowHeaders = list(preflight.headers.get("access-control-allow-headers"));
  assert(allowOrigin === "*" || allowOrigin === ORIGIN, `Unexpected CORS origin: ${allowOrigin}`);
  assert(allowMethods.includes("post"), "CORS methods do not allow POST");
  assert(allowHeaders.includes("*") || allowHeaders.includes("content-type"), "CORS headers do not allow content-type");
  console.log("PASS OPTIONS + CORS");

  const post = await fetchWithTimeout(API_URL, {
    method: "POST",
    headers: { Origin: ORIGIN, "Content-Type": "application/json" },
    body: JSON.stringify(PAYLOAD),
  });
  const body = await readBodySafely(post);
  assert(post.status >= 200 && post.status < 300, `POST expected 2xx, received ${post.status}: ${body.text}`);
  assert(body.text.length > 0, "POST returned an empty body");
  assert(body.json !== null, "POST response is not valid JSON");
  assert(body.json.status === "success", `Unexpected POST response: ${body.text}`);
  console.log("PASS POST + JSON");
  console.log("Smoke test passed");
}

run().catch((error) => {
  const message = error?.name === "AbortError" ? `Request timed out after ${TIMEOUT_MS}ms` : error.message;
  console.error(`Smoke test failed: ${message}`);
  process.exitCode = 1;
});
