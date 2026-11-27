import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const read = async path => readFile(resolve(process.cwd(), path), 'utf8');
const album = JSON.parse(await read('dist/knowledge/igor-life-album-20261127.json'));
const expected = ['origin','service','fatherhood','starton','voice','create','leadership','now'];
assert.deepEqual(album.chapters.map(chapter => chapter.id), expected, 'life album must keep the canonical eight-chapter order');
assert.equal(album.chapters.length, 8, 'life album must contain exactly eight chapters');

const required = ['title','age','place','people','moment','story','response','consequence','reflection','capability','publicValue','sourceUrl','sourceLabel'];
for (const chapter of album.chapters) {
  for (const field of required) assert.ok(chapter[field], chapter.id + ' is missing ' + field);
  assert.ok(/^https:\/\//i.test(chapter.sourceUrl), chapter.id + ' must retain a source URL');
  if (chapter.media) {
    assert.ok(chapter.media.src && /^https:\/\//i.test(chapter.media.src), chapter.id + ' media must have an HTTPS source image');
    const host = new URL(chapter.media.src).hostname;
    assert.ok(['i.ytimg.com','pic1.yitweb.co.il'].includes(host), chapter.id + ' uses an unapproved media host: ' + host);
    assert.ok(chapter.media.sourceUrl && /^https:\/\//i.test(chapter.media.sourceUrl), chapter.id + ' media must link to its source');
  }
}
assert.equal(album.chapters.find(chapter => chapter.id === 'origin').media, null, 'do not invent a childhood photograph');
assert.equal(album.chapters.find(chapter => chapter.id === 'fatherhood').media, null, 'keep children and family imagery out of the public album');

const cssPath = 'styles/igor-life-album-20261127.css';
const jsPath = 'scripts/igor-life-album-20261127.js';
const dataPath = 'knowledge/igor-life-album-20261127.json';
const syntax = spawnSync(process.execPath, ['--check', 'scripts/igor-life-album-20261127.js'], { encoding: 'utf8' });
assert.equal(syntax.status, 0, 'life album runtime must pass node --check: ' + (syntax.stderr || syntax.stdout));
const css = await read('dist/' + cssPath);
const js = await read('dist/' + jsPath);
assert.ok(css.includes('.life-album-spread'), 'album spread styles must ship');
assert.ok(js.includes("fetch('/" + dataPath + "'"), 'album runtime must load the canonical data projection');

for (const locale of ['','en/','ru/','ar/']) {
  const path = 'dist/' + locale + 'index.html';
  const html = await read(path);
  assert.ok(html.includes(cssPath), path + ' is missing the album stylesheet');
  assert.ok(html.includes(jsPath), path + ' is missing the album runtime');
  assert.match(html, /<body[^>]*class=["'][^"']*home-page/, path + ' must enable the homepage album runtime');
}
const contract = await read('scripts/site-contract.mjs');
assert.ok(contract.includes(cssPath), 'site contract must ship album CSS');
assert.ok(contract.includes(jsPath), 'site contract must ship album JS');
assert.ok(contract.includes(dataPath), 'site contract must require album data');
console.log('LIFE_ALBUM: PASS (8 canonical chapters · source-linked media only · privacy gates · HE/EN/RU/AR assets · JS syntax)');
