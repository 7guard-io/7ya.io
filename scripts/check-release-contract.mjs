import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

const pass = message => console.log(`PASS ${message}`);
const fail = message => {
  failures += 1;
  console.error(`FAIL ${message}`);
};

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`${relativePath} missing`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function parseJson(relativePath) {
  try {
    const parsed = JSON.parse(read(relativePath));
    pass(`${relativePath} parses as JSON`);
    return parsed;
  } catch (error) {
    fail(`${relativePath} invalid JSON: ${error.message}`);
    return {};
  }
}

const criticalRoutes = [
  '/', '/igor-vepretski/', '/talk/', '/social/', '/pass/',
  '/evidence/', '/starton/', '/contact/', '/radar/',
];

for (const file of ['release.json', 'ops/vercel-recovery/release.json']) {
  const manifest = parseJson(file);

  manifest.status === 'SOURCE_READY'
    ? pass(`${file} is source-ready only`)
    : fail(`${file} must use SOURCE_READY, received ${manifest.status || 'missing'}`);

  manifest.production_verified === false
    ? pass(`${file} does not claim verified production`)
    : fail(`${file} must set production_verified=false`);

  manifest.source_sha === null
    ? pass(`${file} does not commit a stale source SHA`)
    : fail(`${file} must keep source_sha null until provider deployment`);

  manifest.environment === 'repository'
    ? pass(`${file} identifies repository environment`)
    : fail(`${file} must use repository environment`);

  const routes = Array.isArray(manifest.critical_routes) ? manifest.critical_routes : [];
  for (const route of criticalRoutes) {
    routes.includes(route)
      ? pass(`${file} includes critical route ${route}`)
      : fail(`${file} missing critical route ${route}`);
  }

  const crawlControls = Array.isArray(manifest.crawl_controls) ? manifest.crawl_controls : [];
  for (const control of ['/robots.txt', '/sitemap.xml']) {
    crawlControls.includes(control)
      ? pass(`${file} includes crawl control ${control}`)
      : fail(`${file} missing crawl control ${control}`);
  }
}

const generator = read('ops/vercel-recovery/scripts/generate-release.js');
for (const required of [
  'VERCEL_GIT_COMMIT_SHA',
  'GITHUB_SHA',
  "ALLOW_MANUAL_SOURCE_SHA !== 'true'",
  "environment === 'production'",
  'Manual source SHA is forbidden for production releases',
  "provenanceSource: 'MANUAL_PREVIEW_SOURCE_SHA'",
  'production_verified: productionVerified'
]) requireText(generator, required, 'release generator');

const releaseApi = read('ops/vercel-recovery/api/release.js');
for (const required of [
  "new Set(['VERCEL_GIT_COMMIT_SHA', 'GITHUB_SHA'])",
  "status: 'PROVENANCE_UNBOUND'",
  "status: 'PROVENANCE_NOT_PROVIDER_BOUND'",
  "status: 'PROVENANCE_MISMATCH'",
  "status: productionVerified ? 'READY' : 'PREVIEW_READY'",
  'production_verified: productionVerified',
  "crawl_controls: ['/robots.txt', '/sitemap.xml']"
]) requireText(releaseApi, required, 'release API');

const releaseTest = read('ops/vercel-recovery/scripts/test-release.js');
for (const expectedState of [
  'PROVENANCE_UNBOUND',
  'PROVENANCE_NOT_PROVIDER_BOUND',
  'PREVIEW_READY',
  'READY',
  'PROVENANCE_MISMATCH'
]) requireText(releaseTest, expectedState, 'release provenance test');

if (failures) {
  console.error(`\nRELEASE_CONTRACT_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nRELEASE_CONTRACT_GATE: PASS');
