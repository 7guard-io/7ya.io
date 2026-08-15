import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'knowledge/influence-graph-v1.json');
let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

if (!fs.existsSync(dataPath)) {
  fail('knowledge/influence-graph-v1.json missing');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  pass('influence graph parses as JSON');
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
  process.exit(1);
}

const allowedStatuses = new Set(['ACTIVE', 'RENAMED', 'BLOCKED', 'REMOVED', 'INACTIVE', 'UNKNOWN_HISTORICAL']);
const allowedEvidence = new Set(['PUBLIC_INDEX', 'OWNER_EXPORT', 'PUBLIC_SNAPSHOT', 'CANONICAL_LINK', 'OWNER_REPORT', 'EXTERNAL_SYNDICATION', 'MEDIA_RECORD', 'HISTORICAL_REFERENCE']);
const allowedConfidence = new Set(['HIGH', 'MEDIUM', 'LOW']);
const allowedClaimClasses = new Set(['OBSERVED', 'INFERRED', 'ATTRIBUTED', 'DECLARED_ACTION']);
const allowedDimensions = new Set(['EXPOSURE', 'RESONANCE', 'PROPAGATION', 'TRANSFORMATION']);

if (data.schema_version === '1.0') pass('schema version is 1.0'); else fail('schema version must be 1.0');
if (data.privacy?.raw_private_interactions_published === false) pass('private raw interaction publication disabled'); else fail('private raw interaction publication must be false');
if (data.privacy?.unique_person_totals_require_deduplication === true) pass('unique-person deduplication safeguard enabled'); else fail('unique-person deduplication safeguard missing');

const arrays = ['surface_nodes', 'content_families', 'interaction_signals', 'propagation_edges', 'declared_outcomes'];
for (const key of arrays) {
  if (Array.isArray(data[key])) pass(`${key} is an array`); else fail(`${key} must be an array`);
}

const allIds = new Set();
const registerId = (id, label) => {
  if (!id) return fail(`${label} missing id`);
  if (allIds.has(id)) return fail(`duplicate id ${id}`);
  allIds.add(id);
};

for (const surface of data.surface_nodes || []) {
  registerId(surface.id, 'surface');
  if (!surface.platform || !surface.label) fail(`${surface.id} missing platform/label`);
  if (!allowedStatuses.has(surface.status)) fail(`${surface.id} invalid status ${surface.status}`);
  if (!allowedEvidence.has(surface.status_evidence_class)) fail(`${surface.id} invalid status evidence ${surface.status_evidence_class}`);
  if (!allowedConfidence.has(surface.confidence)) fail(`${surface.id} invalid confidence ${surface.confidence}`);
  if (!Array.isArray(surface.sources) || surface.sources.length === 0) fail(`${surface.id} needs at least one source`);
  for (const source of surface.sources || []) {
    if (!allowedEvidence.has(source.evidence_class)) fail(`${surface.id} source has invalid evidence class`);
    if (!/^https:\/\//.test(source.url || '')) fail(`${surface.id} source must be HTTPS`);
  }
  for (const metric of surface.metrics || []) {
    if (!metric.name || typeof metric.value !== 'number' || !metric.unit || !metric.as_of) fail(`${surface.id} has malformed metric`);
    if (!allowedEvidence.has(metric.evidence_class)) fail(`${surface.id} metric evidence invalid`);
    if (!allowedConfidence.has(metric.confidence)) fail(`${surface.id} metric confidence invalid`);
    if (!/^https:\/\//.test(metric.source_url || '')) fail(`${surface.id} metric source must be HTTPS`);
  }
  if (['BLOCKED', 'REMOVED', 'RENAMED', 'INACTIVE', 'UNKNOWN_HISTORICAL'].includes(surface.status) && !surface.historical_note) {
    fail(`${surface.id} historical surface needs historical_note`);
  }
}

for (const family of data.content_families || []) {
  registerId(family.id, 'content family');
  if (!family.title || !Array.isArray(family.surface_ids) || family.surface_ids.length === 0) fail(`${family.id} malformed content family`);
  for (const surfaceId of family.surface_ids || []) {
    if (!(data.surface_nodes || []).some(surface => surface.id === surfaceId)) fail(`${family.id} references missing surface ${surfaceId}`);
  }
}

for (const signal of data.interaction_signals || []) {
  registerId(signal.id, 'interaction signal');
  if (!allowedDimensions.has(signal.dimension)) fail(`${signal.id} invalid dimension ${signal.dimension}`);
  if (!allowedClaimClasses.has(signal.claim_class)) fail(`${signal.id} invalid claim class ${signal.claim_class}`);
  if (!allowedConfidence.has(signal.confidence)) fail(`${signal.id} invalid confidence ${signal.confidence}`);
  if (!/^https:\/\//.test(signal.source_url || '')) fail(`${signal.id} source must be HTTPS`);
  if (signal.raw_private_identity === true) fail(`${signal.id} must not expose private identity`);
}

for (const edge of data.propagation_edges || []) {
  registerId(edge.id, 'propagation edge');
  if (!edge.from || !edge.to) fail(`${edge.id} missing endpoints`);
  if (!allowedClaimClasses.has(edge.claim_class)) fail(`${edge.id} invalid claim class`);
  if (!allowedConfidence.has(edge.confidence)) fail(`${edge.id} invalid confidence`);
  if (!/^https:\/\//.test(edge.source_url || '')) fail(`${edge.id} source must be HTTPS`);
}

for (const outcome of data.declared_outcomes || []) {
  registerId(outcome.id, 'declared outcome');
  if (outcome.claim_class !== 'DECLARED_ACTION') fail(`${outcome.id} must be DECLARED_ACTION`);
  if (outcome.dimension !== 'TRANSFORMATION') fail(`${outcome.id} must use TRANSFORMATION dimension`);
  if (!allowedConfidence.has(outcome.confidence)) fail(`${outcome.id} invalid confidence`);
  if (!/^https:\/\//.test(outcome.source_url || '')) fail(`${outcome.id} source must be HTTPS`);
  if (outcome.raw_private_identity === true) fail(`${outcome.id} must not expose private identity`);
}

const legacyTikTok = (data.surface_nodes || []).find(surface => surface.handle === '@igor_vepretski');
if (legacyTikTok && ['BLOCKED', 'REMOVED', 'INACTIVE', 'UNKNOWN_HISTORICAL'].includes(legacyTikTok.status)) {
  pass('legacy TikTok preserved as historical surface');
} else {
  fail('legacy TikTok historical node missing');
}

const dimensions = new Set((data.interaction_signals || []).map(signal => signal.dimension));
for (const dimension of allowedDimensions) {
  dimensions.has(dimension) ? pass(`dimension ${dimension} represented`) : fail(`dimension ${dimension} missing`);
}

if (data.coverage?.grand_total_unique_people === null) pass('unsupported unique-person grand total is not published'); else fail('grand_total_unique_people must remain null until deduplicated');

if (failures) {
  console.error(`\nINFLUENCE_GRAPH_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nINFLUENCE_GRAPH_GATE: PASS');
