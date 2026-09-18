import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = process.cwd();
const runtime = fs.readFileSync(path.join(root, 'scripts/social-first-home-20260916.js'), 'utf8');
const corpus = JSON.parse(fs.readFileSync(path.join(root, 'knowledge/social-corpus-20260918.json'), 'utf8'));

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.values = new Set();
  }

  replace(value = '') {
    this.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  contains(value) {
    return this.values.has(value);
  }

  add(...values) {
    values.forEach(value => this.values.add(value));
    this.owner._className = [...this.values].join(' ');
  }

  remove(...values) {
    values.forEach(value => this.values.delete(value));
    this.owner._className = [...this.values].join(' ');
  }

  toggle(value, force) {
    const next = force === undefined ? !this.values.has(value) : Boolean(force);
    if (next) this.values.add(value);
    else this.values.delete(value);
    this.owner._className = [...this.values].join(' ');
    return next;
  }
}

class FakeElement {
  constructor(tagName, { fragment = false } = {}) {
    this.tagName = tagName;
    this.children = [];
    this.dataset = {};
    this.classList = new FakeClassList(this);
    this._className = '';
    this.isFragment = fragment;
  }

  set className(value) {
    this._className = value;
    this.classList.replace(value);
  }

  get className() {
    return this._className;
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node?.isFragment) this.children.push(...node.children);
      else this.children.push(node);
    }
  }

  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }

  setAttribute(name, value) {
    this[name] = String(value);
  }

  addEventListener() {}

  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      if (!node || typeof node !== 'object') return;
      if (selector === '.social-card' && node.classList?.contains('social-card')) matches.push(node);
      node.children?.forEach(visit);
    };
    this.children.forEach(visit);
    return matches;
  }
}

async function render(moments) {
  const rail = new FakeElement('div');
  const section = new FakeElement('section');
  const count = new FakeElement('span');
  const head = new FakeElement('p');
  section.querySelector = selector => ({
    '.social-rail': rail,
    '.feed-controls': null,
    '[data-feed-count]': count,
    '.igor-live-head p': head,
    '[data-feed-filter].is-active': null
  })[selector] ?? null;
  section.querySelectorAll = () => [];

  const document = {
    querySelector: selector => selector === '[data-social-first-home]' ? section : null,
    createElement: tagName => new FakeElement(tagName),
    createDocumentFragment: () => new FakeElement('#fragment', { fragment: true })
  };
  const socialData = { moments };
  const masterData = { records: [], counts: { projected_records: moments.length, public_urls: moments.length } };
  const fetch = async url => ({
    ok: true,
    json: async () => String(url).includes('social-corpus') ? socialData : masterData
  });

  vm.runInNewContext(runtime, {
    URL,
    console,
    document,
    fetch,
    Intl,
    location: { origin: 'https://7ya.io' }
  }, { filename: 'social-first-home-20260916.js' });
  await new Promise(resolve => setImmediate(resolve));
  return rail;
}

test('renders attached media from the media object as the social-card visual', async () => {
  const rail = await render([{
    id: 'attached-media',
    platform: 'LinkedIn',
    date: '2026-09-18',
    title: 'פוסט עם מדיה מצורפת',
    summary: 'המדיה הציבורית צריכה להופיע לפני הטקסט.',
    url: 'https://www.linkedin.com/feed/update/example',
    owned: true,
    media: { image: 'https://media.example.test/post-preview.jpg' }
  }]);
  const card = rail.children[0];
  const image = card?.children.find(child => child?.tagName === 'img');

  assert.ok(image, 'an attached-media record should render an image element');
  assert.equal(image.src, 'https://media.example.test/post-preview.jpg');
  assert.equal(card.classList.contains('has-source-media'), true);
});

test('the selected public social posts retain their verified source-preview media', () => {
  const ids = [
    'linkedin-starton-20260913',
    'linkedin-supernoah-20260909',
    'linkedin-identity-20260911'
  ];

  for (const id of ids) {
    const record = corpus.moments.find(item => item.id === id);
    assert.match(record?.image ?? '', /^https:\/\//, `${id} should keep an HTTPS source preview`);
  }
});
