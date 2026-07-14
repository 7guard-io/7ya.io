import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const manifestPath = path.join(root, 'knowledge', 'igor-public-content-map-20260714.json');
const outputPath = path.join(root, 'knowledge', 'igor-public-content-index.json');

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid']) {
    url.searchParams.delete(key);
  }
  return url.toString();
}

function stableHash(record) {
  return createHash('sha256')
    .update(JSON.stringify({ id: record.id, url: record.canonical_url, title: record.title, date: record.date }))
    .digest('hex');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!Array.isArray(manifest.records)) throw new Error('Impact manifest records must be an array');

const seenIds = new Set();
const seenUrls = new Set();
const records = manifest.records.map((record, index) => {
  if (!record || typeof record !== 'object') throw new Error(`Record ${index} is invalid`);
  if (!record.id || !record.title || !record.url) throw new Error(`Record ${index} is missing id, title or url`);
  if (seenIds.has(record.id)) throw new Error(`Duplicate id: ${record.id}`);
  seenIds.add(record.id);

  const canonicalUrl = normalizeUrl(record.url);
  if (seenUrls.has(canonicalUrl)) console.warn(`Duplicate public URL retained for editorial review: ${canonicalUrl}`);
  seenUrls.add(canonicalUrl);

  const normalized = {
    ...record,
    canonical_url: canonicalUrl,
    searchable_text: [record.title, record.summary, record.platform, record.language, ...(record.themes || [])]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('he-IL'),
  };
  normalized.content_hash = stableHash(normalized);
  return normalized;
});

const index = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  source_manifest: '/knowledge/igor-public-content-map-20260714.json',
  record_count: records.length,
  records,
};

fs.writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`Wrote ${records.length} normalized public records to ${path.relative(root, outputPath)}`);
