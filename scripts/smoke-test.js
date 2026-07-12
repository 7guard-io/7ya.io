// Requires Node.js 18+
const API_URL = process.env.API_URL || "https://7ya-api.netlify.app/api/chat";
const ORIGIN = process.env.ORIGIN || "https://7ya.io";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);
const PAYLOAD = { message: process.env.SMOKE_MESSAGE || "healthcheck" };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeHeaderValue(value) {
  return (value || "").toLowerCase().trim();
}

function splitHeaderList(value) {
  return normalizeHeaderValue(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function isOriginAllowed(headerValue, expectedOrigin) {
  const normalized = normalizeHeaderValue(headerValue);
  return normalized === "*" || normalized === expectedOrigin.toLowerCase();
}

function isMethodAllowed(headerValue, method) {
  return splitHeaderList(headerValue).includes(method.toLowerCase());
}

function isHeaderAllowed(headerValue, headerName) {
  const headers = splitHeaderList(headerValue);
  return headers.includes("*") || headers.includes(headerName.toLowerCase());
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
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();
  if (!rawText) return { kind: "empty", value: "" };

  if (contentType.toLowerCase().includes("application/json")) {
    try {
      return { kind: "json", value: JSON.parse(rawText) };
    } catch {
      return { kind: "text", value: rawText };
    }
  }

  try {
    return { kind: "json", value: JSON.parse(rawText) };
  } catch {
    return { kind: "text", value: rawText };
  }
}

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function printHeader(name, value) {
  console.log(`${name}: ${value ?? "<missing>"}`);
}

function formatError(error) {
  if (error?.name === "AbortError") {
    return `Request timed out after ${TIMEOUT_MS}ms`;
  }

  const message = error instanceof Error ? error.message : String(error);
  const cause = error?.cause;
  const causeParts = [cause?.code, cause?.hostname, cause?.message].filter(Boolean);
  return causeParts.length ? `${message} (${causeParts.join(" | ")})` : message;
}

async function runOptionsCheck() {
  printSection("OPTIONS preflight");

  const response = await fetchWithTimeout(API_URL, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });

  console.log(`status: ${response.status}`);

  const allowOrigin = response.headers.get("access-control-allow-origin");
  const allowMethods = response.headers.get("access-control-allow-methods");
  const allowHeaders = response.headers.get("access-control-allow-headers");

  printHeader("access-control-allow-origin", allowOrigin);
  printHeader("access-control-allow-methods", allowMethods);
  printHeader("access-control-allow-headers", allowHeaders);

  assert(response.status === 204, `OPTIONS expected 204, got ${response.status}`);
  assert(
    isOriginAllowed(allowOrigin, ORIGIN),
    `CORS origin mismatch. Expected "${ORIGIN}" or "*", got "${allowOrigin ?? "<missing>"}"`,
  );
  assert(
    isMethodAllowed(allowMethods, "POST"),
    `CORS methods missing POST. Got "${allowMethods ?? "<missing>"}"`,
  );
  assert(
    isHeaderAllowed(allowHeaders, "content-type"),
    `CORS headers missing content-type. Got "${allowHeaders ?? "<missing>"}"`,
  );

  console.log("OPTIONS check: PASS");
}

async function runPostCheck() {
  printSection("POST request");

  const response = await fetchWithTimeout(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: ORIGIN,
    },
    body: JSON.stringify(PAYLOAD),
  });

  console.log(`status: ${response.status}`);

  const allowOrigin = response.headers.get("access-control-allow-origin");
  const contentType = response.headers.get("content-type");

  printHeader("access-control-allow-origin", allowOrigin);
  printHeader("content-type", contentType);

  const body = await readBodySafely(response);

  assert(response.ok, `POST expected 2xx, got ${response.status}`);
  assert(
    isOriginAllowed(allowOrigin, ORIGIN),
    `POST response CORS origin mismatch. Expected "${ORIGIN}" or "*", got "${allowOrigin ?? "<missing>"}"`,
  );

  if (body.kind === "json") {
    console.log("response-body-json:");
    console.log(JSON.stringify(body.value, null, 2));
  } else if (body.kind === "text") {
    console.log("response-body-text:");
    console.log(body.value);
  } else {
    console.log("response-body: <empty>");
  }

  console.log("POST check: PASS");
}

async function main() {
  assert(Number.isFinite(TIMEOUT_MS) && TIMEOUT_MS > 0, "TIMEOUT_MS must be positive");

  console.log("Smoke test started");
  console.log(`UTC: ${new Date().toISOString()}`);
  console.log(`Node: ${process.version}`);
  console.log(`API_URL: ${API_URL}`);
  console.log(`ORIGIN: ${ORIGIN}`);
  console.log(`TIMEOUT_MS: ${TIMEOUT_MS}`);

  try {
    await runOptionsCheck();
    await runPostCheck();

    printSection("RESULT");
    console.log("PASS");
  } catch (error) {
    printSection("RESULT");
    console.error("FAIL");
    console.error(formatError(error));
    process.exitCode = 1;
  }
}

main();
