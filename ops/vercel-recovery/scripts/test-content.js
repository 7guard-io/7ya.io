const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const routes = require('../routes.json');
const render = require('../api/render.js');
const release = require('../api/release.js');

const requiredRoutes = [
  '/',
  '/igor-vepretski/',
  '/journey/',
  '/work/',
  '/starton/',
  '/systems/',
  '/public-service/',
  '/evidence/',
  '/influence/',
  '/music/',
  '/speaker/',
  '/talk/',
  '/social/',
  '/pass/',
  '/radar/',
  '/contact/',
];

function invoke(handler, request = {}) {
  const headers = {};
  let body = '';
  const response = {
    statusCode: 200,
    setHeader(name, value) {
      headers[String(name).toLowerCase()] = value;
    },
    end(value) {
      body = String(value || '');
    },
  };
  handler(request, response);
  return { statusCode: response.statusCode, headers, body };
}

for (const route of requiredRoutes) {
  assert(routes[route], `Missing route data: ${route}`);
  const result = invoke(render, { query: { route } });
  assert.equal(result.statusCode, 200, `Expected 200 for ${route}`);
  assert.match(result.headers['content-type'], /text\/html/i, `Missing HTML content type for ${route}`);
  assert.match(result.headers['x-robots-tag'], /index, follow/i, `Route is not indexable: ${route}`);
  assert(result.body.length > 1800, `Route body is unexpectedly thin: ${route}`);
  assert(result.body.includes('<title>'), `Missing title for ${route}`);
  assert(result.body.includes('<meta name="description"'), `Missing description for ${route}`);
  assert(result.body.includes('<h1>'), `Missing H1 for ${route}`);
  assert(
    result.body.includes(`<link rel="canonical" href="https://7ya.io${route}">`),
    `Wrong canonical for ${route}`,
  );
  assert(!result.body.includes('undefined'), `Undefined content leaked into ${route}`);
  assert(!result.body.includes('PROVENANCE_UNBOUND'), `Unbound provenance leaked into ${route}`);
}

const missing = invoke(render, { query: { route: '/definitely-missing/' } });
assert.equal(missing.statusCode, 404);
assert.match(missing.headers['x-robots-tag'], /noindex/i);

const releaseResult = invoke(release, {});
assert.equal(releaseResult.statusCode, 200, 'release.json must be READY during a valid build');
const releaseBody = JSON.parse(releaseResult.body);
assert.equal(releaseBody.status, 'READY');
assert.equal(releaseBody.experience, 'IGOR_CREATORVERSE_COMPLETE_ARCHIVE');
assert.equal(releaseBody.root_experience_release, '2026-07-14.5-creatorverse');
assert.match(releaseBody.source_sha, /^[0-9a-f]{40}$/i);
assert(requiredRoutes.every((route) => releaseBody.critical_routes.includes(route)));
assert.equal(releaseBody.route_aliases['/7ya/'], '/systems/');

const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(index.includes('Creatorverse'));
assert(index.includes('<link rel="canonical" href="https://7ya.io/">'));
assert(index.includes('meta name="description"'));
assert(index.includes('meta name="robots" content="index, follow'));
assert(index.includes('href="/7ya/"'));
assert(index.includes('href="/journey/"'));
assert(index.includes('href="/starton/"'));
assert((index.match(/class="igor-tile"/g) || []).length >= 12);
assert(index.includes('data-agent-prompt'));

const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
assert(!vercel.rewrites.some((entry) => entry.source === '/'), 'Static Creatorverse root must not be shadowed');
assert(vercel.rewrites.some((entry) => entry.source === '/7ya/' && entry.destination.includes('/systems/')));
for (const route of requiredRoutes.filter((route) => route !== '/')) {
  assert(vercel.rewrites.some((entry) => entry.source === route), `Vercel config missing ${route}`);
}

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const route of requiredRoutes) {
  assert(sitemap.includes(`<loc>https://7ya.io${route}</loc>`), `Sitemap missing ${route}`);
}

const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent:\s*\*/i);
assert.match(robots, /Allow:\s*\//i);
assert(robots.includes('https://7ya.io/sitemap.xml'));

console.log(`CREATORVERSE_ARCHIVE_CONTRACT: PASS (${requiredRoutes.length} canonical routes + /7ya/ alias)`);
