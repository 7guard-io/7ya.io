#!/usr/bin/env node

import { promises as dns } from "node:dns";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import tls from "node:tls";
import { performance } from "node:perf_hooks";

const API_URL =
  process.env.API_URL || "https://7ya-api.netlify.app/api/chat";
const ORIGIN = process.env.ORIGIN || "https://7ya.io";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);
const TEST_REGION = process.env.TEST_REGION || "not_provided";
const EVIDENCE_DIR = process.env.EVIDENCE_DIR || "artifacts";
const PAYLOAD_MESSAGE = "healthcheck-do-not-echo";
const MAX_REDIRECTS = 8;

const SAFE_HEADERS = [
  "content-type",
  "content-length",
  "cache-control",
  "strict-transport-security",
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
  "access-control-allow-origin",
  "access-control-allow-methods",
  "access-control-allow-headers",
  "access-control-max-age",
  "vary",
  "server",
  "x-nf-request-id",
];

function assertResult(results, condition, name, observed) {
  results.push({ name, pass: Boolean(condition), observed });
}

function safeHeaders(headers) {
  const output = {};
  for (const name of SAFE_HEADERS) {
    const value = headers.get(name);
    if (value !== null) output[name] = value;
  }
  return output;
}

function splitHeaderList(value) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

async function resolveDns(hostname) {
  const result = { hostname, a: [], aaaa: [], cname: [], errors: [] };
  for (const [key, resolver] of [
    ["a", () => dns.resolve4(hostname)],
    ["aaaa", () => dns.resolve6(hostname)],
    ["cname", () => dns.resolveCname(hostname)],
  ]) {
    try {
      result[key] = await resolver();
    } catch (error) {
      if (!["ENODATA", "ENOTFOUND", "ENOTIMP"].includes(error.code)) {
        result.errors.push(`${key}: ${error.code || error.message}`);
      }
    }
  }
  result.resolves = Boolean(
    result.a.length || result.aaaa.length || result.cname.length,
  );
  return result;
}

function inspectTls(hostname, port) {
  return new Promise((resolve) => {
    const started = performance.now();
    const socket = tls.connect({
      host: hostname,
      port,
      servername: hostname,
      rejectUnauthorized: true,
      timeout: TIMEOUT_MS,
    });

    let finished = false;
    const finish = (payload) => {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve({
        hostname,
        port,
        elapsed_ms: Math.round(performance.now() - started),
        ...payload,
      });
    };

    socket.once("secureConnect", () => {
      const certificate = socket.getPeerCertificate(false);
      finish({
        authorized: socket.authorized,
        authorization_error: socket.authorizationError || null,
        protocol: socket.getProtocol(),
        issuer: certificate.issuer || null,
        subject: certificate.subject || null,
        valid_from: certificate.valid_from || null,
        valid_to: certificate.valid_to || null,
        fingerprint256: certificate.fingerprint256 || null,
      });
    });
    socket.once("timeout", () => finish({ authorized: false, error: "timeout" }));
    socket.once("error", (error) =>
      finish({ authorized: false, error: error.message }),
    );
  });
}

async function fetchWithRedirects(url, options) {
  const chain = [];
  let currentUrl = url;
  let method = options.method || "GET";
  let body = options.body;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const started = performance.now();
    const response = await fetch(currentUrl, {
      ...options,
      method,
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const elapsedMs = Math.round(performance.now() - started);
    const location = response.headers.get("location");
    const rawBody = await response.text();

    chain.push({
      url: currentUrl,
      status: response.status,
      elapsed_ms: elapsedMs,
      location,
      headers: safeHeaders(response.headers),
    });

    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      let parsedJson = null;
      let jsonValid = false;
      try {
        parsedJson = rawBody ? JSON.parse(rawBody) : null;
        jsonValid = rawBody.length > 0;
      } catch {
        parsedJson = null;
      }

      return {
        final_url: currentUrl,
        final_status: response.status,
        total_elapsed_ms: chain.reduce((sum, item) => sum + item.elapsed_ms, 0),
        redirect_chain: chain,
        headers: safeHeaders(response.headers),
        body_summary: {
          byte_length: Buffer.byteLength(rawBody),
          non_empty: rawBody.length > 0,
          valid_json: jsonValid,
          top_level_keys:
            parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
              ? Object.keys(parsedJson).sort()
              : [],
          payload_echo_detected: rawBody.includes(PAYLOAD_MESSAGE),
        },
      };
    }

    currentUrl = new URL(location, currentUrl).toString();
    if ([301, 302, 303].includes(response.status) && !["GET", "HEAD"].includes(method)) {
      method = "GET";
      body = undefined;
    }
  }

  throw new Error(`Too many redirects (>${MAX_REDIRECTS})`);
}

async function main() {
  const timestamp = new Date().toISOString();
  const target = new URL(API_URL);
  const evidence = {
    schema_version: "1.1",
    test_timestamp_utc: timestamp,
    target: API_URL,
    origin: ORIGIN,
    environment: {
      node: process.version,
      os: `${os.type()} ${os.release()}`,
      platform: process.platform,
      architecture: process.arch,
      region: TEST_REGION,
    },
    dns: await resolveDns(target.hostname),
    tls: await inspectTls(target.hostname, Number(target.port || 443)),
    requests: {},
    assertions: [],
    pass: false,
  };

  console.log(`7YA API smoke test: ${API_URL}`);
  console.log(`UTC: ${timestamp}`);
  console.log(`Origin: ${ORIGIN}`);
  console.log("Evidence is metadata-only; response bodies are not saved or printed.\n");

  try {
    evidence.requests.options = await fetchWithRedirects(API_URL, {
      method: "OPTIONS",
      headers: {
        Origin: ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

    evidence.requests.post = await fetchWithRedirects(API_URL, {
      method: "POST",
      headers: {
        Origin: ORIGIN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: PAYLOAD_MESSAGE }),
    });
  } catch (error) {
    evidence.transport_error = error instanceof Error ? error.message : String(error);
  }

  const results = evidence.assertions;
  const options = evidence.requests.options;
  const post = evidence.requests.post;

  assertResult(results, evidence.dns.resolves, "DNS resolves", evidence.dns);
  assertResult(results, evidence.tls.authorized, "TLS is authorized", evidence.tls);

  if (options) {
    const headers = options.headers || {};
    assertResult(results, options.final_status === 204, "OPTIONS returns 204", options.final_status);
    assertResult(
      results,
      [ORIGIN, "*"].includes(headers["access-control-allow-origin"]),
      "OPTIONS allows the expected origin",
      headers["access-control-allow-origin"] || null,
    );
    assertResult(
      results,
      splitHeaderList(headers["access-control-allow-methods"]).includes("post"),
      "OPTIONS allows POST",
      headers["access-control-allow-methods"] || null,
    );
    assertResult(
      results,
      splitHeaderList(headers["access-control-allow-headers"]).some(
        (value) => value === "*" || value === "content-type",
      ),
      "OPTIONS allows content-type",
      headers["access-control-allow-headers"] || null,
    );
  }

  if (post) {
    const headers = post.headers || {};
    assertResult(results, post.final_status >= 200 && post.final_status < 300, "POST returns 2xx", post.final_status);
    assertResult(
      results,
      String(headers["content-type"] || "").toLowerCase().includes("application/json"),
      "POST returns JSON",
      headers["content-type"] || null,
    );
    assertResult(
      results,
      String(headers["cache-control"] || "").toLowerCase().includes("no-store"),
      "POST disables caching",
      headers["cache-control"] || null,
    );
    assertResult(results, post.body_summary.non_empty, "POST body is non-empty", post.body_summary.byte_length);
    assertResult(results, post.body_summary.valid_json, "POST body is valid JSON", post.body_summary.valid_json);
    assertResult(
      results,
      !post.body_summary.payload_echo_detected,
      "POST does not echo the test message",
      post.body_summary.payload_echo_detected,
    );
  }

  if (evidence.transport_error) {
    assertResult(results, false, "Transport completed", evidence.transport_error);
  }

  evidence.pass = results.length > 0 && results.every((item) => item.pass);

  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  const filename = `7ya-api-smoke-${timestamp.replace(/[:.]/g, "-")}.json`;
  const outputPath = path.join(EVIDENCE_DIR, filename);
  await fs.writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  for (const result of results) {
    console.log(`${result.pass ? "PASS" : "FAIL"}: ${result.name}`);
  }
  console.log(`\nEvidence: ${outputPath}`);
  console.log(`Overall: ${evidence.pass ? "PASS" : "FAIL"}`);
  process.exitCode = evidence.pass ? 0 : 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
