import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../entity/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/master-entity-index-20260715.css', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const homepageScript = readFileSync(new URL('./history-song-20260714.js', import.meta.url), 'utf8');

assert.match(page, /<title>Master Entity Index — Igor Vepretski \| 7YA<\/title>/);
assert.match(page, /<meta name="description" content="[^"]+">/);
assert.match(page, /<meta name="robots" content="index,follow,max-image-preview:large">/);
assert.match(page, /<link rel="canonical" href="https:\/\/7ya\.io\/entity\/">/);
assert.match(page, /<h1>איגור ופרצקי\.<em>לא שורה אחת\.<\/em><\/h1>/);

const imageSources = [...page.matchAll(/<img src="([^"]+)"/g)].map(match => match[1]);
assert.ok(new Set(imageSources).size >= 5, `expected at least 5 distinct visual sources, found ${new Set(imageSources).size}`);
assert.match(page, /PRESS · RETURN TO THE NEIGHBORHOOD/);
assert.match(page, /TV · SERVICE → STARTON/);
assert.match(page, /RU · GENERATION 1\.5/);
assert.match(page, /MUSIC · PUBLIC CREATIVE IDENTITY/);

assert.match(page, /Hebrew University B\.A\. Honors[\s\S]*SOURCE-PENDING/);
assert.match(page, /Tel Aviv University M\.A\.[\s\S]*SOURCE-PENDING/);
assert.match(page, /Bar-Ilan Information Science[\s\S]*SOURCE-PENDING/);
assert.match(page, /Gastocratic Governance[\s\S]*CONCEPT DRAFT/);
assert.match(page, /מת על אקסל · פרח במדבר · חצופה[\s\S]*VERIFY BEFORE PUBLISHING/);
assert.match(page, /IPFS \/ Pinata \/ Solidity[\s\S]*SOURCE-PENDING/);

for (const privateName of ['Ariela', 'אריאלה', 'Leon', 'Miel', 'Tai', 'ליאון', 'מיאל', 'טאי']) {
  assert.ok(!page.includes(privateName), `private family identifier leaked: ${privateName}`);
}

assert.match(page, /CONSENT REQUIRED/);
assert.match(page, /DO NOT PUBLISH/);
assert.match(sitemap, /<loc>https:\/\/7ya\.io\/entity\/<\/loc>/);
assert.match(homepageScript, /href = '\/entity\/'/);
assert.match(homepageScript, /Master Entity Index/);
assert.ok(css.length > 6000, 'entity visual system is unexpectedly thin');
assert.match(css, /\.visual-atlas/);
assert.match(css, /\.gallery/);
assert.match(css, /\.verification-table/);

console.log(`ENTITY_INDEX_GATE: PASS (${new Set(imageSources).size} distinct visual sources)`);
