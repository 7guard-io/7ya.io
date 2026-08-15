import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);
const read = relative => {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { fail(`${relative} missing`); return ''; }
  pass(`${relative} exists`);
  return fs.readFileSync(file, 'utf8');
};
const requireText = (body, text, label) => body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
const excludeText = (body, text, label) => !body.includes(text) ? pass(`${label} excludes ${text}`) : fail(`${label} contains ${text}`);

const html = read('influence-graph/index.html');
for (const required of [
  '<link rel="canonical" href="https://7ya.io/influence-graph/">',
  'INFLUENCE GRAPH',
  'מה נשאר אחרי שהפיד מוחק?',
  'id="surfaceGrid"',
  'id="dimensionGrid"',
  'id="cascadeGrid"',
  'id="outcomeGrid"',
  '/knowledge/influence-graph-v1.json',
  '/scripts/influence-graph-v1.js',
  '/styles/influence-graph-v1.css?v=1'
]) requireText(html, required, 'influence graph page');

for (const forbidden of ['310M+', '7B+', 'כולם הושפעו', 'unique people reached']) excludeText(html, forbidden, 'influence graph page');
const h1Count = (html.match(/<h1\b/gi) || []).length;
h1Count === 1 ? pass('influence graph page has one H1') : fail(`influence graph page has ${h1Count} H1 elements`);

const css = read('styles/influence-graph-v1.css');
css.length >= 3500 ? pass('influence graph CSS is substantial') : fail('influence graph CSS too thin');
requireText(css, '@media(max-width:900px)', 'influence graph CSS');
requireText(css, '@media(prefers-reduced-motion:reduce)', 'influence graph CSS');

const script = read('scripts/influence-graph-v1.js');
for (const required of [
  "fetch('/knowledge/influence-graph-v1.json'",
  'renderSurfaces',
  'renderDimensions',
  'renderCascades',
  'renderOutcomes',
  'BLOCKED',
  'UNKNOWN_HISTORICAL',
  'grand_total_unique_people'
]) requireText(script, required, 'influence graph script');
excludeText(script, 'localStorage', 'influence graph script');
excludeText(script, 'sessionStorage', 'influence graph script');

if (failures) {
  console.error(`\nINFLUENCE_GRAPH_PAGE_GATE: FAIL (${failures})`);
  process.exit(1);
}
console.log('\nINFLUENCE_GRAPH_PAGE_GATE: PASS');
