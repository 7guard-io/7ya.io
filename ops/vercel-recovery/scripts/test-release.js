const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'release-manifest.json');
const ENV_KEYS = ['VERCEL_GIT_COMMIT_SHA','GITHUB_SHA','SOURCE_SHA','RELEASE_SOURCE_SHA','VERCEL_ENV','NODE_ENV'];

function invokeRelease() {
  delete require.cache[require.resolve('../api/release.js')];
  const handler = require('../api/release.js');
  const headers = {}; let body = '';
  const response = { statusCode: 200, setHeader(name,value){headers[name.toLowerCase()]=value;}, end(value){body=String(value||'');} };
  handler({}, response);
  return { statusCode: response.statusCode, headers, body: JSON.parse(body) };
}
function writeManifest(overrides={}) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({
    source_sha:'0123456789abcdef0123456789abcdef01234567',
    source_branch:'fix/p0-integrity-final-20260714', release:'test-release',
    build_time:'2026-07-14T00:00:00.000Z', environment:'preview',
    provenance_source:'VERCEL_GIT_COMMIT_SHA', production_verified:false, ...overrides
  }));
}

const previousEnv = Object.fromEntries(ENV_KEYS.map(key=>[key,process.env[key]]));
const previousManifest = fs.existsSync(MANIFEST_PATH) ? fs.readFileSync(MANIFEST_PATH) : null;
try {
  ENV_KEYS.forEach(key=>delete process.env[key]);
  if (fs.existsSync(MANIFEST_PATH)) fs.unlinkSync(MANIFEST_PATH);
  const unbound=invokeRelease(); assert.equal(unbound.statusCode,503); assert.equal(unbound.body.status,'PROVENANCE_UNBOUND');
  writeManifest({provenance_source:'MANUAL_PREVIEW_SOURCE_SHA'});
  const manual=invokeRelease(); assert.equal(manual.statusCode,503); assert.equal(manual.body.status,'PROVENANCE_NOT_PROVIDER_BOUND');
  writeManifest({provenance_source:'VERCEL_GIT_COMMIT_SHA',environment:'preview'});
  const preview=invokeRelease(); assert.equal(preview.statusCode,200); assert.equal(preview.body.status,'PREVIEW_READY'); assert.equal(preview.body.production_verified,false);
  writeManifest({provenance_source:'GITHUB_SHA',environment:'production',production_verified:true});
  const production=invokeRelease(); assert.equal(production.statusCode,200); assert.equal(production.body.status,'READY'); assert.equal(production.body.production_verified,true);
  assert.deepEqual(production.body.critical_routes,['/','/igor-vepretski/','/talk/','/social/','/pass/','/evidence/','/starton/','/contact/','/radar/']);
  process.env.GITHUB_SHA='fedcba9876543210fedcba9876543210fedcba98';
  const mismatch=invokeRelease(); assert.equal(mismatch.statusCode,503); assert.equal(mismatch.body.status,'PROVENANCE_MISMATCH'); assert.equal(mismatch.body.production_verified,false);
  assert.equal(production.headers['x-content-type-options'],'nosniff');
  assert.equal(production.headers['cache-control'],'public, max-age=0, must-revalidate');
  console.log('RELEASE_PROVENANCE_TEST: PASS');
} finally {
  if (previousManifest) fs.writeFileSync(MANIFEST_PATH, previousManifest); else if (fs.existsSync(MANIFEST_PATH)) fs.unlinkSync(MANIFEST_PATH);
  for (const [key,value] of Object.entries(previousEnv)) { if(value===undefined) delete process.env[key]; else process.env[key]=value; }
}
