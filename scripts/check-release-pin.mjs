import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const proxyPath = 'ops/vercel-canonical-proxy/api/proxy.js';
const releasePath = 'ops/vercel-canonical-proxy/api/release.js';
const readmePath = 'ops/vercel-canonical-proxy/README.md';

const proxy = fs.readFileSync(proxyPath, 'utf8');
const release = fs.readFileSync(releasePath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

const proxySha = proxy.match(/const SOURCE_SHA = '([0-9a-f]{40})'/i)?.[1];
const releaseSha = release.match(/source_sha: '([0-9a-f]{40})'/i)?.[1];
const releaseId = release.match(/release_id: '([^']+)'/)?.[1];
const pullRequest = release.match(/pull_request: (\d+)/)?.[1];

const failures = [];
if (!proxySha) failures.push(`${proxyPath} has no full immutable SOURCE_SHA`);
if (!releaseSha) failures.push(`${releasePath} has no full immutable source_sha`);
if (proxySha && releaseSha && proxySha !== releaseSha) failures.push('proxy and release endpoint pin different source SHAs');
if (releaseSha && !readme.includes(releaseSha)) failures.push('canonical proxy README does not name the pinned source SHA');
if (!releaseId || !/^igor-[a-z0-9-]+-\d{8}$/.test(releaseId)) failures.push('release_id is not a dated Igor release identifier');
if (!pullRequest || Number(pullRequest) < 1) failures.push('release endpoint has no valid content pull request');
if (pullRequest && !readme.includes(`#${pullRequest}`)) failures.push('canonical proxy README does not name the content pull request');
if (!proxy.includes("const BLOCKED_PUBLIC_PREFIXES = new Set(['admin', 'api'])")) {
  failures.push('canonical proxy does not fail closed for private admin and repository API paths');
}

for (const required of [
  "'/response-ai/'",
  'response_signal_count: 11',
  'positive_external_signal_count: 3',
  'validated_tiktok_live_comment_records: 10273',
  'raw_comment_text_publication: false',
  'human_review_required_for_comment_text: true',
  "'UNDETERMINED_FROM_AGGREGATES'",
  "'HUMAN_REVIEW_REQUIRED'",
]) {
  if (!release.includes(required)) failures.push(`release endpoint missing ${required}`);
}

const require = createRequire(import.meta.url);
const proxyHandler = require(path.resolve(proxyPath));

async function invokeProxy(requestPath) {
  const result = { statusCode: 200, headers: {}, body: '' };
  const response = {
    setHeader(name, value) { result.headers[name.toLowerCase()] = value; },
    end(body = '') { result.body = String(body); },
    get statusCode() { return result.statusCode; },
    set statusCode(value) { result.statusCode = value; },
  };
  await proxyHandler({ method: 'GET', url: `/api/proxy?path=${encodeURIComponent(requestPath)}` }, response);
  return result;
}

for (const blockedPath of ['admin/', 'admin/private.json', 'api/private']) {
  const result = await invokeProxy(blockedPath);
  if (result.statusCode !== 404 || result.headers['x-robots-tag'] !== 'noindex, nofollow') {
    failures.push(`canonical proxy did not fail closed for /${blockedPath}`);
  }
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  const value = String(url);
  if (value.endsWith('/response-ai/index.html')) {
    return new Response('<!doctype html><title>Public Response AI</title>', { status: 200 });
  }
  if (value.endsWith('/missing-route/index.html')) return new Response('', { status: 404 });
  if (value.endsWith('/404.html')) return new Response('<!doctype html><title>Not Found</title>', { status: 200 });
  throw new Error(`Unexpected test fetch: ${url}`);
};
try {
  const responseAi = await invokeProxy('response-ai/');
  if (
    responseAi.statusCode !== 200 ||
    responseAi.headers['x-7ya-source-sha'] !== releaseSha ||
    responseAi.headers['x-7ya-source-path'] !== 'response-ai/index.html' ||
    responseAi.headers['x-robots-tag'] !== 'index, follow'
  ) {
    failures.push('canonical proxy does not serve Public Response AI from the pinned source');
  }

  const missing = await invokeProxy('missing-route/');
  if (
    missing.statusCode !== 404 ||
    missing.headers['x-robots-tag'] !== 'noindex, nofollow' ||
    missing.headers['cache-control'] !== 'no-store'
  ) {
    failures.push('canonical proxy does not mark controlled HTML 404 responses noindex and no-store');
  }
} finally {
  globalThis.fetch = originalFetch;
}

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`RELEASE_PIN_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`PASS immutable source SHA ${releaseSha}`);
console.log(`PASS release ${releaseId} from PR #${pullRequest}`);
console.log('PASS Public Response AI provenance and stance controls');
console.log('RELEASE_PIN_CONTRACT: PASS');
