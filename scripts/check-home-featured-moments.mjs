import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const projectionPath = path.join(root, 'knowledge', 'home-featured-moments-20260930.json');
const homePath = path.join(root, 'index.html');
const failures = [];
let projection;
try { projection = JSON.parse(await fs.readFile(projectionPath, 'utf8')); }
catch (error) { console.error(`HOME_MOMENTS_FAIL: projection missing/invalid: ${error.message}`); process.exit(1); }
const items = Array.isArray(projection?.moments) ? projection.moments : [];
if (items.length < 6 || items.length > 12) failures.push(`expected 6–12 moments, found ${items.length}`);
const ids = new Set();
const families = new Set();
for (const item of items) {
  for (const field of ['id','story_family','title','media','source_url','source_context']) if (!String(item?.[field] || '').trim()) failures.push(`${item?.id || 'unknown'} missing ${field}`);
  if (ids.has(item.id)) failures.push(`duplicate id ${item.id}`); ids.add(item.id);
  if (families.has(item.story_family)) failures.push(`duplicate story_family ${item.story_family}`); families.add(item.story_family);
  if (/drive\.google\.com|docs\.google\.com/i.test(item.source_url || '')) failures.push(`${item.id} exposes Drive URL`);
  try { const u = new URL(item.source_url); if (!['http:','https:'].includes(u.protocol)) failures.push(`${item.id} unsupported source protocol`); }
  catch { failures.push(`${item.id} invalid source URL`); }
  if ('aggregate_reach' in item || 'total_reach' in item) failures.push(`${item.id} contains synthetic aggregate reach`);
}
const html = await fs.readFile(homePath, 'utf8');
const homeIds = [...html.matchAll(/data-moment-id=["']([^"']+)["']/g)].map(match => match[1]);
if (homeIds.length !== items.length) failures.push(`homepage/projected count mismatch: ${homeIds.length} vs ${items.length}`);
for (const id of ids) if (!homeIds.includes(id)) failures.push(`projection id ${id} missing from homepage`);
for (const id of homeIds) if (!ids.has(id)) failures.push(`homepage id ${id} missing from projection`);
if (failures.length) {
  failures.forEach(failure => console.error(`HOME_MOMENTS_FAIL: ${failure}`));
  process.exit(1);
}
console.log(`HOME_MOMENTS: PASS (${items.length} distinct source-bound story families)`);
