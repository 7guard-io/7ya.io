const assert = require('assert');
const site = require('../api/site.js');
const release = require('../api/release.js');

const routes = [
  '/', '/igor-vepretski/', '/journey/', '/work/', '/starton/', '/systems/',
  '/public-service/', '/evidence/', '/influence/', '/music/', '/speaker/',
  '/talk/', '/social/', '/pass/', '/radar/', '/contact/', '/7ya/',
];

function invoke(handler, request = {}) {
  const headers = {};
  let body = '';
  const response = {
    statusCode: 200,
    setHeader(name, value) { headers[String(name).toLowerCase()] = value; },
    end(value) { body = String(value || ''); },
  };
  handler(request, response);
  return { statusCode: response.statusCode, headers, body };
}

for (const route of routes) {
  const result = invoke(site, { query: { route }, url: route });
  assert.equal(result.statusCode, 200, `Expected 200 for ${route}`);
  assert.match(result.headers['content-type'], /text\/html/i);
  assert.match(result.headers['x-robots-tag'], /index, follow/i);
  assert(result.body.length > 2000, `Thin body: ${route}`);
  assert(result.body.includes('<title>'));
  assert(result.body.includes('meta name="description"'));
  assert(result.body.includes('meta name="7ya-source-sha"'));
  assert(!result.body.includes('PROVENANCE_UNBOUND'));
}

const missing = invoke(site, { query: { route: '/missing/' }, url: '/missing/' });
assert.equal(missing.statusCode, 404);
assert.match(missing.headers['x-robots-tag'], /noindex/i);

const releaseResult = invoke(release, {});
assert.equal(releaseResult.statusCode, 200);
const releaseBody = JSON.parse(releaseResult.body);
assert.equal(releaseBody.status, 'READY');
assert.equal(releaseBody.experience, 'IGOR_CREATORVERSE_UNIFIED_PUBLIC_ARCHIVE');
assert.match(releaseBody.source_sha, /^[0-9a-f]{40}$/i);
assert.equal(releaseBody.route_aliases['/7ya/'], '/systems/');

console.log(`UNIFIED_DIRECT_RUNTIME: PASS (${routes.length} public routes)`);
