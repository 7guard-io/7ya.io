# 7YA Album First, Evidence Always Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 7YA homepage’s dossier-like experience with a beautiful, personal, source-backed nine-moment public album that works in Hebrew, English, and Russian.

**Architecture:** Keep the established static-site pipeline and canonical routes. The root page becomes a small semantic shell; `scripts/album-first-20260821.js` reads a reviewed public JSON album and renders the personal sequence with safe DOM APIs. A dedicated stylesheet owns the album’s visual system, while the existing evidence, museum, StartOn, research, and archive routes remain linked as secondary depth.

**Tech Stack:** Static HTML, modern browser JavaScript, CSS, Node.js contract checks, existing 7YA static artifact builder.

**Spec:** `docs/superpowers/specs/2026-08-21-7ya-album-first-evidence-always-design.md`

## Global Constraints

- Use only public, already approved repository imagery and public source thumbnails identified in the data manifest.
- Do not publish private family material, intimate details, third-party personal data, unredacted service details, legal, medical, or financial material.
- No stock imagery, generated imagery, visual collage, invented dates, invented metrics, or uncited factual claim.
- The first five visual moments must have five different repository image paths; never reuse an image in the album sequence.
- Hebrew, English, and Russian must be selectable without duplicate pages; Hebrew must render RTL and English/Russian LTR.
- Evidence must be available per moment but visually subordinate to the personal story.
- Preserve all existing canonical routes and static artifact integrity; source changes must pass `npm run release:gate`.
- The homepage must not introduce a horizontal native scrollbar at 390 px, 768 px, or 1440 px.
- Respect `prefers-reduced-motion`; all source links open safely with `noopener noreferrer`.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `index.html` | Semantic public shell, metadata, language control, accessible album mount, and links to established depth routes. |
| `data/album-moments-20260821.json` | Reviewed canonical records for the nine public moments, including translations, approved media, source URLs, and evidence state. |
| `scripts/album-first-20260821.js` | Fetch, validate, localize, and safely render the album; manage language selection, source drawers, and reduced-motion behavior. |
| `styles/album-first-20260821.css` | Album-first layout, single-frame photography treatment, responsive typography, source drawer, and motion preferences. |
| `scripts/site-contract.mjs` | Adds the new JSON, CSS, and JS files to the governed static artifact. |
| `scripts/check-album-first-20260821.mjs` | Fails release checks for missing localization, unsafe/duplicate media, missing sources, forbidden collage/scroll rules, or absent responsive and motion contracts. |
| `package.json` | Runs the album contract check as part of `check-all`. |

### Task 1: Establish a clean, reproducible baseline

**Files:**
- Modify: none.
- Test: existing `package.json` release gate.

**Interfaces:**
- Consumes: branch `design/album-first-evidence-always`.
- Produces: a clean baseline result for all later changes.

- [ ] **Step 1: Create an isolated checkout on the approved branch**

Run:

```bash
git clone --branch design/album-first-evidence-always --single-branch https://github.com/7guard-io/7ya.io.git 7ya-album-first
cd 7ya-album-first
git status --short --branch
```

Expected: the branch line names `design/album-first-evidence-always` and no tracked changes are listed.

- [ ] **Step 2: Install the repository’s locked dependencies**

Run:

```bash
npm ci --no-audit --no-fund
```

Expected: exit status 0 with a generated local `node_modules` directory that remains untracked.

- [ ] **Step 3: Run the pre-change release gate**

Run:

```bash
npm run release:gate
```

Expected: every existing check passes and the output ends with static artifact verification success.

- [ ] **Step 4: Record the starting revision**

Run:

```bash
git rev-parse HEAD
```

Expected: the output is the design-branch revision that contains the approved design specification.

### Task 2: Define the reviewed public album corpus

**Files:**
- Create: `data/album-moments-20260821.json`.
- Create: `scripts/check-album-first-20260821.mjs`.
- Modify: `package.json`.

**Interfaces:**
- Consumes: the already public repository images under `assets/personal-hero-20260716/` and public YouTube thumbnail/source URLs.
- Produces: `AlbumMoment[]` JSON records that satisfy the exact record shape below.

```ts
type LocalizedCopy = { he: string; en: string; ru: string };
type AlbumMoment = {
  id: string;
  chapter: 'present' | 'builder' | 'service' | 'voice' | 'starton' | 'accountability';
  order: number;
  media: {
    kind: 'repository-image' | 'public-video-thumbnail';
    src: string;
    alt: LocalizedCopy;
    provenance: string;
  };
  title: LocalizedCopy;
  body: LocalizedCopy;
  source: {
    label: LocalizedCopy;
    href: string;
    status: 'VERIFIED' | 'PUBLIC_SOURCE';
  };
};
```

- [ ] **Step 1: Write the failing album-data contract**

Create `scripts/check-album-first-20260821.mjs` with this initial assertion:

```js
import fs from 'node:fs';

const file = 'data/album-moments-20260821.json';
const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(payload.moments) || payload.moments.length !== 9) {
  throw new Error('ALBUM_CORPUS: expected exactly nine reviewed moments');
}
```

Add `&& node scripts/check-album-first-20260821.mjs` immediately after `npm run check-home-universe` in the `check-all` value in `package.json`.

- [ ] **Step 2: Run the new check to verify it fails**

Run:

```bash
node scripts/check-album-first-20260821.mjs
```

Expected: a nonzero exit with `ENOENT` for `data/album-moments-20260821.json`.

- [ ] **Step 3: Add the nine reviewed moments**

Create `data/album-moments-20260821.json` with a `schema_version` of `1`, a `generated_at` value of `2026-08-21`, and exactly these media/source pairings in order:

```json
{
  "moments": [
    {"id":"present","order":1,"media":{"kind":"repository-image","src":"/assets/personal-hero-20260716/igor-hero.webp","provenance":"7guard-io/7ya.io repository asset"},"source":{"href":"/igor-vepretski/","status":"VERIFIED"}},
    {"id":"builder","order":2,"media":{"kind":"repository-image","src":"/assets/personal-hero-20260716/igor-executive.webp","provenance":"7guard-io/7ya.io repository asset"},"source":{"href":"/create/","status":"VERIFIED"}},
    {"id":"service","order":3,"media":{"kind":"repository-image","src":"/assets/personal-hero-20260716/igor-public-service.webp","provenance":"7guard-io/7ya.io repository asset"},"source":{"href":"/journey/","status":"VERIFIED"}},
    {"id":"voice","order":4,"media":{"kind":"repository-image","src":"/assets/personal-hero-20260716/igor-speaker.webp","provenance":"7guard-io/7ya.io repository asset"},"source":{"href":"/media/","status":"VERIFIED"}},
    {"id":"human-scale","order":5,"media":{"kind":"repository-image","src":"/assets/personal-hero-20260716/igor-closeup.webp","provenance":"7guard-io/7ya.io repository asset"},"source":{"href":"/history/","status":"VERIFIED"}},
    {"id":"starton-return","order":6,"media":{"kind":"public-video-thumbnail","src":"https://i.ytimg.com/vi/O3v309CA4ao/hqdefault.jpg","provenance":"Public YouTube thumbnail for approved source"},"source":{"href":"https://youtu.be/O3v309CA4ao","status":"PUBLIC_SOURCE"}},
    {"id":"starton-space","order":7,"media":{"kind":"public-video-thumbnail","src":"https://i.ytimg.com/vi/SOpAglwkJ8I/hqdefault.jpg","provenance":"Public YouTube thumbnail for approved source"},"source":{"href":"https://www.youtube.com/watch?v=SOpAglwkJ8I","status":"PUBLIC_SOURCE"}},
    {"id":"public-accountability","order":8,"media":{"kind":"public-video-thumbnail","src":"https://i.ytimg.com/vi/AE5hDzLM5XU/hqdefault.jpg","provenance":"Public YouTube thumbnail for approved source"},"source":{"href":"https://www.youtube.com/watch?v=AE5hDzLM5XU","status":"PUBLIC_SOURCE"}},
    {"id":"public-dialogue","order":9,"media":{"kind":"public-video-thumbnail","src":"https://i.ytimg.com/vi/3XxoBtSL2pg/hqdefault.jpg","provenance":"Public YouTube thumbnail for approved source"},"source":{"href":"https://www.youtube.com/watch?v=3XxoBtSL2pg","status":"PUBLIC_SOURCE"}}
  ]
}
```

For every object, add nonempty `chapter`, `title`, `body`, `source.label`, and `media.alt` values in `he`, `en`, and `ru`. Use first-person, date-free copy unless the approved public source itself supplies a date. Keep the content bounded to present work, building, public service, public voice, StartOn, and accountable public dialogue.

- [ ] **Step 4: Complete the safety contract**

Extend `scripts/check-album-first-20260821.mjs` with these checks:

```js
const requiredLanguages = ['he', 'en', 'ru'];
const localRepositoryMedia = new Set();
for (const [index, moment] of payload.moments.entries()) {
  if (moment.order !== index + 1) throw new Error(`ALBUM_CORPUS: nonsequential order at ${moment.id}`);
  if (!moment.id || !moment.chapter || !moment.source?.href?.startsWith('/')) {
    if (!moment.source?.href?.startsWith('https://')) throw new Error(`ALBUM_CORPUS: invalid source for ${moment.id}`);
  }
  if (!['repository-image', 'public-video-thumbnail'].includes(moment.media?.kind)) {
    throw new Error(`ALBUM_CORPUS: invalid media kind for ${moment.id}`);
  }
  if (!moment.media.src.startsWith('/assets/') && !moment.media.src.startsWith('https://i.ytimg.com/vi/')) {
    throw new Error(`ALBUM_CORPUS: unapproved media host for ${moment.id}`);
  }
  if (moment.media.kind === 'repository-image' && !localRepositoryMedia.add(moment.media.src)) {
    throw new Error(`ALBUM_CORPUS: repeated repository image ${moment.media.src}`);
  }
  for (const field of [moment.title, moment.body, moment.media.alt, moment.source.label]) {
    for (const language of requiredLanguages) {
      if (typeof field?.[language] !== 'string' || !field[language].trim()) {
        throw new Error(`ALBUM_CORPUS: missing ${language} copy for ${moment.id}`);
      }
    }
  }
}
console.log('ALBUM_CORPUS: PASS (9 reviewed public moments)');
```

- [ ] **Step 5: Run the check to verify it passes**

Run:

```bash
node scripts/check-album-first-20260821.mjs
npm run check-all
```

Expected: `ALBUM_CORPUS: PASS (9 reviewed public moments)` followed by all existing static checks passing.

- [ ] **Step 6: Commit the data contract**

Run:

```bash
git add data/album-moments-20260821.json scripts/check-album-first-20260821.mjs package.json
git commit -m "feat: add reviewed public album corpus"
```

### Task 3: Build the semantic album shell

**Files:**
- Modify: `index.html`.
- Modify: `scripts/site-contract.mjs`.
- Modify: `scripts/check-album-first-20260821.mjs`.

**Interfaces:**
- Consumes: `data/album-moments-20260821.json`.
- Produces: `#album-shell`, `#album-moments`, `#album-source-dialog`, and the language controls consumed by the rendering script.

- [ ] **Step 1: Write the failing shell assertions**

Append the following to `scripts/check-album-first-20260821.mjs`:

```js
const html = fs.readFileSync('index.html', 'utf8');
for (const token of ['id="album-shell"', 'id="album-moments"', 'id="album-source-dialog"', 'data-album-language="he"', 'data-album-language="en"', 'data-album-language="ru"']) {
  if (!html.includes(token)) throw new Error(`ALBUM_SHELL: missing ${token}`);
}
if (html.includes('photo collage') || html.includes('AI-generated')) {
  throw new Error('ALBUM_SHELL: forbidden generic media language');
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run:

```bash
node scripts/check-album-first-20260821.mjs
```

Expected: a nonzero exit naming the first missing shell token.

- [ ] **Step 3: Replace homepage body content with the album shell**

Keep the current canonical metadata and favicon links, then replace the body’s homepage experience with the following semantic structure:

```html
<body>
  <a class="album-skip-link" href="#album-moments">Skip to the album</a>
  <header class="album-header" id="topbar">
    <a class="album-mark" href="/" aria-label="7YA home">7<span>YA</span></a>
    <nav class="album-nav" aria-label="Primary">
      <a href="#album-moments" data-album-copy="navAlbum">Album</a>
      <a href="#album-depth" data-album-copy="navDepth">Depth</a>
      <a href="/evidence/" data-album-copy="navEvidence">Evidence</a>
    </nav>
    <div class="album-language" role="group" aria-label="Language">
      <button type="button" data-album-language="he">עברית</button>
      <button type="button" data-album-language="en">EN</button>
      <button type="button" data-album-language="ru">РУ</button>
    </div>
  </header>
  <main id="album-shell">
    <section class="album-hero" aria-labelledby="album-title">
      <figure class="album-hero-frame"><img id="album-hero-image" alt="" fetchpriority="high"></figure>
      <div class="album-hero-copy">
        <p class="album-kicker" data-album-copy="kicker">Personal public record</p>
        <h1 id="album-title" data-album-copy="title">Igor Vepretski</h1>
        <p data-album-copy="intro"></p>
        <a class="album-primary-action" href="#album-moments" data-album-copy="openAlbum">Open the album</a>
      </div>
    </section>
    <section class="album-sequence" aria-labelledby="album-moments-title">
      <header class="album-section-head"><p data-album-copy="sequenceKicker"></p><h2 id="album-moments-title" data-album-copy="sequenceTitle"></h2></header>
      <div id="album-moments" aria-live="polite"></div>
    </section>
    <section id="album-depth" class="album-depth" aria-labelledby="album-depth-title">
      <h2 id="album-depth-title" data-album-copy="depthTitle"></h2>
      <p data-album-copy="depthBody"></p>
      <div class="album-depth-links">
        <a href="/starton/">StartOn</a><a href="/research/">Research</a><a href="/museum/">Archive</a><a href="/evidence/">Evidence</a>
      </div>
    </section>
  </main>
  <dialog id="album-source-dialog" class="album-source-dialog" aria-labelledby="album-source-title">
    <button type="button" data-album-close-source aria-label="Close">×</button>
    <p id="album-source-status"></p><h2 id="album-source-title"></h2><p id="album-source-provenance"></p><a id="album-source-link" target="_blank" rel="noopener noreferrer"></a>
  </dialog>
</body>
```

Link only `/styles/album-first-20260821.css` and `/scripts/album-first-20260821.js` for the home experience. Retain the artifact builder’s injected shared control assets but remove links to homepage scripts/styles that are no longer used by this page.

- [ ] **Step 4: Add the new files to the static artifact contract**

Add these exact entries to the relevant arrays in `scripts/site-contract.mjs`:

```js
'data/album-moments-20260821.json',
'album-first-20260821.css',
'album-first-20260821.js',
```

The data entry belongs in `publicRootFiles`; the stylesheet in `publicStyleFiles`; the script in `publicScriptFiles`. Add all three output paths to `criticalArtifactPaths` as `data/album-moments-20260821.json`, `styles/album-first-20260821.css`, and `scripts/album-first-20260821.js`.

- [ ] **Step 5: Run shell and artifact checks**

Run:

```bash
node scripts/check-album-first-20260821.mjs
npm run build:site
npm run check:artifact
npm run verify:artifact
```

Expected: shell assertion success and a static artifact containing all three new files.

- [ ] **Step 6: Commit the shell**

Run:

```bash
git add index.html scripts/site-contract.mjs scripts/check-album-first-20260821.mjs
git commit -m "feat: establish album-first homepage shell"
```

### Task 4: Implement safe album rendering and multilingual interaction

**Files:**
- Create: `scripts/album-first-20260821.js`.
- Modify: `scripts/check-album-first-20260821.mjs`.

**Interfaces:**
- Consumes: `/data/album-moments-20260821.json`, `[data-album-language]`, `#album-moments`, and `#album-source-dialog`.
- Produces: `window.__7yaAlbumFirstLoaded`, rendered `.album-moment` elements, and a query/local-storage language contract.

- [ ] **Step 1: Write the failing renderer assertions**

Append:

```js
const script = fs.readFileSync('scripts/album-first-20260821.js', 'utf8');
for (const token of [
  "const SOURCE = '/data/album-moments-20260821.json'",
  'window.__7yaAlbumFirstLoaded',
  'new URLSearchParams(location.search)',
  "localStorage.setItem('7ya.album.language'",
  'document.createElement',
  'dialog.showModal()',
  'prefers-reduced-motion'
]) {
  if (!script.includes(token)) throw new Error(`ALBUM_RENDERER: missing ${token}`);
}
if (script.includes('innerHTML')) throw new Error('ALBUM_RENDERER: innerHTML is forbidden');
```

- [ ] **Step 2: Run the check to verify it fails**

Run:

```bash
node scripts/check-album-first-20260821.mjs
```

Expected: a nonzero exit with `ENOENT` for `scripts/album-first-20260821.js`.

- [ ] **Step 3: Implement the renderer with safe DOM construction**

Create `scripts/album-first-20260821.js`. Start it exactly as follows:

```js
(() => {
  'use strict';
  if (window.__7yaAlbumFirstLoaded) return;
  window.__7yaAlbumFirstLoaded = true;

  const SOURCE = '/data/album-moments-20260821.json';
  const languages = ['he', 'en', 'ru'];
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  const savedLanguage = localStorage.getItem('7ya.album.language');
  let language = languages.includes(queryLanguage) ? queryLanguage : (languages.includes(savedLanguage) ? savedLanguage : 'he');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const text = (value) => value?.[language] || value?.he || '';
  const make = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
```

For each moment, create one `article.album-moment` containing one `figure`, one `img`, one `h3`, one text paragraph, a source-status button, and an external source anchor. Put media first on odd rows and copy first on even rows through a `data-order` attribute and CSS grid placement. The source-status button must fill the existing dialog from the record’s provenance and `source`, then call `dialog.showModal()`. Do not encode claims or dates outside the reviewed JSON.

- [ ] **Step 4: Implement language and direction updates**

In the same file, set the document state with:

```js
document.documentElement.lang = language;
document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
document.documentElement.dataset.albumLanguage = language;
localStorage.setItem('7ya.album.language', language);
history.replaceState(null, '', `${location.pathname}?${new URLSearchParams({ lang: language })}${location.hash}`);
```

Bind every `[data-album-language]` button to update `language`, re-render the visible content, and move focus back to the active button. Mark the active language with `aria-pressed="true"`.

- [ ] **Step 5: Add renderer safety checks**

Add these assertions to `scripts/check-album-first-20260821.mjs`:

```js
for (const forbidden of ['innerHTML', 'http://', 'stock photo', 'generated image']) {
  if (script.toLowerCase().includes(forbidden)) throw new Error(`ALBUM_RENDERER: forbidden token ${forbidden}`);
}
```

- [ ] **Step 6: Run focused verification**

Run:

```bash
node scripts/check-album-first-20260821.mjs
npm run check-all
```

Expected: `ALBUM_CORPUS: PASS`, `ALBUM_SHELL: PASS`, and `ALBUM_RENDERER: PASS` without failures from existing checks.

- [ ] **Step 7: Commit the renderer**

Run:

```bash
git add scripts/album-first-20260821.js scripts/check-album-first-20260821.mjs
git commit -m "feat: render multilingual personal album"
```

### Task 5: Implement the photographic album visual system

**Files:**
- Create: `styles/album-first-20260821.css`.
- Modify: `scripts/check-album-first-20260821.mjs`.

**Interfaces:**
- Consumes: the semantic classes and attributes emitted by Task 4.
- Produces: a responsive single-frame album visual language with no native horizontal scrolling.

- [ ] **Step 1: Write the failing visual-contract assertions**

Append:

```js
const css = fs.readFileSync('styles/album-first-20260821.css', 'utf8');
for (const token of [
  '.album-moment',
  '.album-moment figure',
  '@media (max-width: 768px)',
  '@media (max-width: 420px)',
  'prefers-reduced-motion',
  'object-fit: cover',
  'overflow-x: clip'
]) {
  if (!css.includes(token)) throw new Error(`ALBUM_STYLE: missing ${token}`);
}
for (const forbidden of ['overflow-x: auto', 'scroll-snap-type', 'grid-template-columns: repeat(3']) {
  if (css.includes(forbidden)) throw new Error(`ALBUM_STYLE: forbidden ${forbidden}`);
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run:

```bash
node scripts/check-album-first-20260821.mjs
```

Expected: a nonzero exit with `ENOENT` for `styles/album-first-20260821.css`.

- [ ] **Step 3: Build the base tokens and single-frame rules**

Create `styles/album-first-20260821.css` with this foundation:

```css
:root { --album-ink:#0a0a0a; --album-paper:#f1eee7; --album-accent:#d4a85c; --album-line:rgba(255,255,255,.18); --album-width:1320px; }
html, body { margin:0; min-width:0; background:var(--album-ink); color:var(--album-paper); overflow-x:clip; }
.album-moment { display:grid; grid-template-columns:minmax(0,1.16fr) minmax(300px,.84fr); gap:clamp(26px,7vw,120px); align-items:center; max-width:var(--album-width); margin:0 auto; padding:clamp(66px,11vw,150px) clamp(18px,5vw,72px); border-top:1px solid var(--album-line); }
.album-moment figure { margin:0; aspect-ratio:4/5; overflow:hidden; background:#151515; }
.album-moment img { display:block; width:100%; height:100%; object-fit:cover; }
.album-moment[data-order="even"] figure { order:2; }
```

Use no image overlay that contains a headline. Captions, source state, and links belong in adjacent copy, so faces and photographs remain visually unobstructed. Do not use a masonry grid, collage, carousel, or a horizontal scrolling strip.

- [ ] **Step 4: Add elegant hierarchy and responsive layouts**

Style the hero as a single full-bleed personal frame with copy in a readable scrim-free paper panel on desktop and a stacked paper panel on small screens. Use a serif display face already available through the page’s font declarations and a restrained sans-serif for utility labels. Add `@media (max-width: 768px)` to stack every moment to one column with `figure { order:0 !important; }`. Add `@media (max-width: 420px)` to reduce padding and retain at least 16 px edge clearance. Add `@media (prefers-reduced-motion: reduce)` to remove transforms and transitions.

- [ ] **Step 5: Add accessible source-dialog styling**

Use `dialog::backdrop`, a visible focus outline, and a maximum text measure. The dialog must contain provenance and one clearly labeled source link, not a data table or metrics wall.

- [ ] **Step 6: Run focused and full style verification**

Run:

```bash
node scripts/check-album-first-20260821.mjs
npm run check-all
npm run build:site
npm run check:artifact
npm run verify:artifact
```

Expected: static checks, build, and artifact verification all pass.

- [ ] **Step 7: Commit the visual system**

Run:

```bash
git add styles/album-first-20260821.css scripts/check-album-first-20260821.mjs
git commit -m "feat: add editorial album visual system"
```

### Task 6: Execute real-browser quality assurance

**Files:**
- Modify: only if a failed check identifies a concrete defect.
- Test: served `dist/` site at desktop and mobile viewports.

**Interfaces:**
- Consumes: built `dist/` artifact.
- Produces: evidence that the actual browser view, language state, source dialog, and responsive layout fulfill the specification.

- [ ] **Step 1: Build the final immutable artifact**

Run:

```bash
npm run release:gate
```

Expected: exit 0 with a fresh `dist/artifact-manifest.json`.

- [ ] **Step 2: Serve the built output**

Run:

```bash
cd dist && python3 -m http.server 4173
```

Expected: an HTTP server listening on port 4173.

- [ ] **Step 3: Verify the three language states**

Open `http://127.0.0.1:4173/?lang=he`, `?lang=en`, and `?lang=ru`. For each state verify:
1. the first hero image loads;
2. nine album moments render;
3. the active language is announced by `aria-pressed`;
4. Hebrew uses RTL while English and Russian use LTR;
5. every visible source action opens the reviewed source URL.

Expected: no console errors or broken-image placeholders.

- [ ] **Step 4: Verify responsive visual states**

At widths 390 px, 768 px, and 1440 px, inspect the homepage. Check that:
1. no content is clipped;
2. the page width equals the viewport width without native horizontal scroll;
3. every moment remains a single image plus adjacent/stacked text;
4. the first five moments show five different images;
5. titles do not overlay or crop the photograph;
6. no collage or generic image is present.

Expected: all six checks pass at all three widths.

- [ ] **Step 5: Verify source details and motion preference**

Open the source button for one repository image and one public-video thumbnail. Confirm the dialog shows status, provenance, and a single source link. Enable reduced-motion and refresh; confirm content remains visible with no entrance animation dependency.

Expected: both dialogs are operable by keyboard and motion reduction does not hide content.

- [ ] **Step 6: Make only defect-specific fixes and rerun release gate**

For every observed defect, change the exact owning file, then run:

```bash
npm run release:gate
```

Expected: exit 0 after the final fix.

- [ ] **Step 7: Commit browser-verified corrections**

Run:

```bash
git add index.html data/album-moments-20260821.json scripts/album-first-20260821.js styles/album-first-20260821.css scripts/site-contract.mjs scripts/check-album-first-20260821.mjs package.json
git commit -m "fix: complete album-first visual QA"
```

Only create this commit when there are tracked browser-QA corrections; otherwise leave the prior implementation commits unchanged.

### Task 7: Merge, release, and verify the public deployment

**Files:**
- Modify: none unless required by a proven failed release gate.
- Test: production static deployment and public smoke checks.

**Interfaces:**
- Consumes: a clean feature branch with a passing `npm run release:gate`.
- Produces: the release script’s public deployment URL and immutable manifest evidence.

- [ ] **Step 1: Review the final branch difference**

Run:

```bash
git status --short
git log --oneline main..HEAD
git diff --check main...HEAD
```

Expected: no uncommitted work, one or more focused commits, and no whitespace errors.

- [ ] **Step 2: Merge the verified branch into main**

Run:

```bash
git checkout main
git pull --ff-only origin main
git merge --ff-only design/album-first-evidence-always
git push origin main
```

Expected: main advances by fast-forward only; no history is rewritten.

- [ ] **Step 3: Re-verify main before deployment**

Run:

```bash
npm run release:gate
git status --short
```

Expected: the release gate passes and the working tree is clean.

- [ ] **Step 4: Publish through the guarded personal static deployment**

Run:

```bash
npm run deploy:personal-static
```

Expected: `7YA_PERSONAL_STATIC_DEPLOY: PASS`, a personal-scope Vercel deployment URL, public smoke checks, and an artifact manifest hash. The script must not change DNS or attach a custom domain.

- [ ] **Step 5: Independently inspect the production URL**

Open the deployment URL reported by the script at 390 px, 768 px, and 1440 px. Repeat Task 6’s language, image, source-dialog, and no-horizontal-scroll checks against the deployed site.

Expected: production matches the verified artifact and there are no console errors or broken media.

- [ ] **Step 6: Record the release evidence**

Run:

```bash
git rev-parse HEAD
cat .release-evidence/*/release-evidence.json
```

Expected: evidence identifies the deployed main SHA, the personal Vercel scope, the deployment URL, an artifact hash, and `dns_changed: false`.

## Plan Self-Review

- Spec coverage: Tasks 2–5 implement reviewed real public media, multilingual personal narrative, evidence provenance, no generated/stock/collage media, responsive single-frame layout, and reduced-motion support. Task 6 verifies the required 390 px, 768 px, and 1440 px states. Task 7 preserves the governed release path and verifies public deployment.
- Placeholder scan: this plan contains no deferred implementation markers, unknown file paths, or unspecified tests.
- Interface consistency: `AlbumMoment`, `data/album-moments-20260821.json`, `#album-moments`, `#album-source-dialog`, and the language-control attributes are named consistently in every implementation task.
