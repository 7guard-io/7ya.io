# Yisrael Beiteinu Evidence Dossier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public, static-first, evidence-led 7YA route at `/evidence/yisrael-beiteinu/` that documents Igor Vepretski's contribution to Yisrael Beiteinu from 2023–2026 with auditable claims, progressive evidence disclosure, HE/EN/RU support, and strict claim boundaries.

**Architecture:** Keep the narrative path static HTML so it remains useful without JavaScript. Store canonical dossier records in one structured JSON file, use a small progressive-enhancement script only for filtering/disclosure, and isolate route-specific styling in one stylesheet. The existing static builder already copies `evidence/` recursively and injects shared 7YA assets; route verification, sitemap coverage, and artifact checks will be extended explicitly for this nested canonical route.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, JSON, Node.js validation scripts, existing 7YA static artifact builder and release gates.

**Spec:** `docs/superpowers/specs/2026-09-07-yisrael-beiteinu-evidence-dossier-design.md`

## Global Constraints

- Production runtime source of truth remains AppDeploy snapshot `1788556953194` until a complete source export is reconciled.
- Do not deploy stale GitHub runtime over AppDeploy production.
- Implementation may begin only after the source-alignment gate in Task 0 passes.
- Primary public route: `/evidence/yisrael-beiteinu/`.
- Human-first hero; no proof-grid overload in the first mobile viewport.
- No collage, autoplay media, decorative 3D, or campaign-style logo wallpaper.
- Yisrael Beiteinu colors may appear only as restrained source/semantic accents; do not recolor 7YA globally.
- Strong claims render only from `VERIFIED` or `STRONGLY_SUPPORTED` evidence. `OPEN` records never feed hero counters or synthesis language.
- Unknown metrics remain unknown; render `counter not recovered` rather than inventing numbers.
- Igor's macro creator reach remains separate from party-specific observed reach.
- Static core narrative remains readable with JavaScript disabled.
- HE/EN/RU pages use identical evidence IDs and invariant metrics/source URLs.
- WCAG 2.2 AA target; full keyboard navigation, visible focus, semantic headings, reduced-motion support.
- Run `npm run ci:local` before any merge candidate is treated as release-ready.

---

## File Structure

**Create**
- `evidence/yisrael-beiteinu/index.html` — Hebrew canonical narrative page.
- `evidence/yisrael-beiteinu/en/index.html` — English language page.
- `evidence/yisrael-beiteinu/ru/index.html` — Russian language page.
- `knowledge/yisrael-beiteinu-evidence-20260907.json` — canonical structured evidence records and summary counters.
- `styles/yisrael-beiteinu-evidence-20260907.css` — route-specific editorial/responsive system.
- `scripts/yisrael-beiteinu-evidence-20260907.js` — progressive filters/disclosure only.
- `scripts/check-yisrael-beiteinu-evidence.mjs` — content integrity, language parity, claim boundaries and route-asset checks.

**Modify**
- `scripts/site-contract.mjs` — nested canonical routes, route-specific assets, critical artifact entries.
- `scripts/verify-routes.mjs` — verify nested route and language subroutes.
- `package.json` — add `check-party-evidence` and include it in `check-all`/`lint`.
- `sitemap.xml` — add HE/EN/RU dossier URLs.
- `evidence/index.html` — add one restrained entry point.

**Do not modify as part of this feature**
- `appdeploy-live/CURRENT.json` except during a separately verified source-export/reconciliation operation.
- AppDeploy production runtime.
- Global 7YA homepage visual system.

---

### Task 0: Source-Alignment Gate

**Files:**
- Read: `appdeploy-live/CURRENT.json`
- Read: `docs/CONTROL_PLANE_STATE.json`
- Read: current complete AppDeploy export once available
- Modify only if source reconciliation itself is separately approved: `appdeploy-live/CURRENT.json`

**Interfaces:**
- Consumes: AppDeploy production snapshot metadata.
- Produces: a binary decision: `SAFE_TO_IMPLEMENT_FROM_GITHUB=true` or stop.

- [ ] **Step 1: Assert the current repository is still marked unsafe before implementation**

Run:
```bash
node -e "const fs=require('fs');const x=JSON.parse(fs.readFileSync('appdeploy-live/CURRENT.json','utf8'));if(x.github_runtime_deploy_safe!==false||x.source_export_complete!==false)process.exit(1);console.log('EXPECTED_BLOCK',x.snapshot,x.source_alignment)"
```

Expected before reconciliation:
```text
EXPECTED_BLOCK 1788556953194 CURRENT_APPDEPLOY_DELTA_EXPORTED; FULL_GITHUB_SOURCE_EXPORT_PENDING
```

- [ ] **Step 2: Perform the complete AppDeploy source export/reconciliation as a separate controlled operation**

Required outcome in the reconciled control record:
```json
{
  "source_export_complete": true,
  "github_runtime_deploy_safe": true
}
```

Do not fake these fields. They are written only after complete runtime source export, comparison, and acceptance.

- [ ] **Step 3: Re-run the gate**

Run:
```bash
node -e "const fs=require('fs');const x=JSON.parse(fs.readFileSync('appdeploy-live/CURRENT.json','utf8'));if(x.github_runtime_deploy_safe!==true||x.source_export_complete!==true){console.error('SOURCE_GATE_BLOCKED');process.exit(1)}console.log('SOURCE_GATE_PASS',x.snapshot)"
```

Expected:
```text
SOURCE_GATE_PASS <reconciled-snapshot-id>
```

- [ ] **Step 4: Stop if the gate does not pass**

No feature code is written on stale runtime source. Tasks 1–8 remain blocked until this command passes.

---

### Task 1: Canonical Evidence Data Contract

**Files:**
- Create: `knowledge/yisrael-beiteinu-evidence-20260907.json`
- Create: `scripts/check-yisrael-beiteinu-evidence.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: JSON object with `summary`, `records`, `topics`, and `languages` fields.
- Each record exposes `id`, `year`, `date`, `title`, `claim`, `proves`, `doesNotProve`, `sourceClass`, `confidence`, `publisher`, `platform`, `sourceUrl`, `archiveUrl`, `metric`, `languages`, `tags`, and `officialDistribution`.

- [ ] **Step 1: Write the validator first**

Create `scripts/check-yisrael-beiteinu-evidence.mjs`:

```js
import fs from 'node:fs/promises';

const dataPath = 'knowledge/yisrael-beiteinu-evidence-20260907.json';
const body = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const allowedConfidence = new Set(['VERIFIED', 'STRONGLY_SUPPORTED', 'OPEN']);
const allowedSourceClass = new Set(['PRIMARY', 'INSTITUTIONAL', 'PUBLIC', 'OWNER_EXPORT', 'CONTEXT']);

if (!Array.isArray(body.records) || body.records.length === 0) throw new Error('records missing');
if (!body.summary || body.summary.ownerCorpusCount !== 140) throw new Error('owner corpus count must be 140');
if (!Array.isArray(body.languages) || body.languages.join(',') !== 'he,en,ru') throw new Error('languages must be he,en,ru');

const ids = new Set();
for (const record of body.records) {
  if (!record.id || ids.has(record.id)) throw new Error(`duplicate/missing id: ${record.id}`);
  ids.add(record.id);
  if (!allowedConfidence.has(record.confidence)) throw new Error(`bad confidence: ${record.id}`);
  if (!allowedSourceClass.has(record.sourceClass)) throw new Error(`bad source class: ${record.id}`);
  if (!record.claim || !record.proves || !record.doesNotProve) throw new Error(`claim boundary missing: ${record.id}`);
  if (!Array.isArray(record.languages) || record.languages.length === 0) throw new Error(`languages missing: ${record.id}`);
  if (record.metric && typeof record.metric.value !== 'number') throw new Error(`metric value must be numeric: ${record.id}`);
}

const headlineIds = new Set(body.summary.headlineEvidenceIds || []);
for (const record of body.records) {
  if (headlineIds.has(record.id) && record.confidence === 'OPEN') {
    throw new Error(`OPEN evidence cannot feed headline: ${record.id}`);
  }
}

console.log(`YB_EVIDENCE_DATA: PASS (${body.records.length} records)`);
```

- [ ] **Step 2: Run validator and confirm it fails because JSON does not exist**

Run:
```bash
node scripts/check-yisrael-beiteinu-evidence.mjs
```

Expected: `ENOENT` for `knowledge/yisrael-beiteinu-evidence-20260907.json`.

- [ ] **Step 3: Create canonical JSON**

Use this top-level shape exactly:

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-09-07",
  "languages": ["he", "en", "ru"],
  "summary": {
    "documentedYears": 4,
    "ownerCorpusCount": 140,
    "officialDistributionNodes": 7,
    "observedViewsMinimum": 14087,
    "observedEngagementMinimum": 1968,
    "headlineEvidenceIds": ["YB-2023-DIGITAL", "YB-2026-OFFICIAL-FB", "YB-2026-CANDIDACY"]
  },
  "topics": ["security", "service", "liberman", "economy", "holon", "youth", "russian", "membership", "field", "accountability"],
  "records": []
}
```

Populate records only from the approved evidence/source ledger. Preserve uncertainty explicitly. Never convert an Igor-owned party mention into an official-party publication unless `officialDistribution` is true.

- [ ] **Step 4: Run validator until it passes**

```bash
node scripts/check-yisrael-beiteinu-evidence.mjs
```

- [ ] **Step 5: Wire check into package scripts**

Add:
```json
"check-party-evidence": "node scripts/check-yisrael-beiteinu-evidence.mjs"
```

Insert `npm run check-party-evidence` into `check-all` and `lint` before artifact construction.

- [ ] **Step 6: Commit**

```bash
git add knowledge/yisrael-beiteinu-evidence-20260907.json scripts/check-yisrael-beiteinu-evidence.mjs package.json
git commit -m "feat(evidence): add Yisrael Beiteinu dossier data contract"
```

---

### Task 2: Hebrew Static Narrative Page

**Files:**
- Create: `evidence/yisrael-beiteinu/index.html`
- Modify: `evidence/index.html`
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Consumes: canonical evidence IDs from Task 1.
- Produces: complete no-JS Hebrew narrative, stable section anchors, JSON-backed hooks for progressive enhancement.

- [ ] **Step 1: Extend validator to require the Hebrew page and required sections**

```js
const he = await fs.readFile('evidence/yisrael-beiteinu/index.html', 'utf8');
for (const marker of [
  'id="record"', 'id="timeline"', 'id="official-amplification"', 'id="corpus"',
  'id="personal-layer"', 'id="contribution"', 'id="candidacy"', 'id="boundaries"', 'id="closing"'
]) {
  if (!he.includes(marker)) throw new Error(`missing Hebrew section ${marker}`);
}
if (!he.includes('WHAT IGOR ACTUALLY GAVE YISRAEL BEITEINU')) throw new Error('hero title missing');
if (!he.includes('I CONTRIBUTED FIRST.')) throw new Error('closing thesis missing');
```

- [ ] **Step 2: Verify test fails**

```bash
npm run check-party-evidence
```

Expected: missing Hebrew page failure.

- [ ] **Step 3: Create semantic Hebrew HTML**

Required head:

```html
<html lang="he" dir="rtl">
<title>איגור ופרצקי × ישראל ביתנו — ראיות לעבודה, תוכן ומועמדות | 7YA</title>
<meta name="description" content="תיעוד מבוסס ראיות של פעילות איגור ופרצקי בישראל ביתנו בשנים 2023–2026: דיגיטל, תוכן, שטח, הפצה מפלגתית והליך מועמדות לכנסת ה־26.">
<link rel="canonical" href="https://7ya.io/evidence/yisrael-beiteinu/">
<link rel="alternate" hreflang="he" href="https://7ya.io/evidence/yisrael-beiteinu/">
<link rel="alternate" hreflang="en" href="https://7ya.io/evidence/yisrael-beiteinu/en/">
<link rel="alternate" hreflang="ru" href="https://7ya.io/evidence/yisrael-beiteinu/ru/">
<link rel="alternate" hreflang="x-default" href="https://7ya.io/evidence/yisrael-beiteinu/">
<link rel="stylesheet" href="/styles/yisrael-beiteinu-evidence-20260907.css?v=1">
<script src="/scripts/yisrael-beiteinu-evidence-20260907.js?v=1" defer></script>
```

Body contains complete narrative without JavaScript. Use semantic elements and keep first phone viewport human-first.

- [ ] **Step 4: Add stable evidence anchors**

```html
<article class="evidence-card" id="YB-2023-DIGITAL" data-evidence-id="YB-2023-DIGITAL" data-confidence="VERIFIED">
```

Do not localize evidence IDs.

- [ ] **Step 5: Add restrained entry point from parent Evidence Wall**

```html
<a href="/evidence/yisrael-beiteinu/">ישראל ביתנו — תיק פעילות וראיות 2023–2026 ←</a>
```

- [ ] **Step 6: Run validator**

```bash
npm run check-party-evidence
```

- [ ] **Step 7: Commit**

```bash
git add evidence/yisrael-beiteinu/index.html evidence/index.html scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "feat(evidence): add Hebrew Yisrael Beiteinu dossier narrative"
```

---

### Task 3: Editorial Visual System

**Files:**
- Create: `styles/yisrael-beiteinu-evidence-20260907.css`
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Consumes: semantic classes from Task 2.
- Produces: human-first editorial layout, dark official-amplification section, responsive timeline, evidence cards, corpus controls and accessible focus states.

- [ ] **Step 1: Add CSS contract checks**

```js
const css = await fs.readFile('styles/yisrael-beiteinu-evidence-20260907.css', 'utf8');
for (const token of ['.yb-hero', '.yb-timeline', '.evidence-card', '.official-amplification', '.corpus-filters', ':focus-visible', '@media (prefers-reduced-motion: reduce)']) {
  if (!css.includes(token)) throw new Error(`CSS contract missing ${token}`);
}
```

- [ ] **Step 2: Run validator and verify stylesheet failure**

```bash
npm run check-party-evidence
```

- [ ] **Step 3: Build route-scoped visual tokens**

```css
.yb-dossier {
  --yb-paper: #f3f0e9;
  --yb-ink: #101113;
  --yb-muted: #696a6d;
  --yb-line: rgba(16,17,19,.16);
  --yb-dark: #0b0c0e;
  --yb-party-blue: #176bb5;
  --yb-party-red: #c9363e;
  background: var(--yb-paper);
  color: var(--yb-ink);
}
```

- [ ] **Step 4: Implement mobile-first hero**

First mobile viewport: title, short support line, one human image, at most one compact proof row. Four counters continue below fold.

- [ ] **Step 5: Implement timeline, evidence cards, dark amplification and contribution synthesis**

Use typography, borders and whitespace rather than card soup or generic icons.

- [ ] **Step 6: Implement focus and reduced motion**

```css
:focus-visible { outline: 3px solid currentColor; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }
}
```

- [ ] **Step 7: Run validator and commit**

```bash
npm run check-party-evidence
git add styles/yisrael-beiteinu-evidence-20260907.css scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "feat(evidence): add dossier editorial visual system"
```

---

### Task 4: Progressive Corpus Explorer

**Files:**
- Create: `scripts/yisrael-beiteinu-evidence-20260907.js`
- Modify: `evidence/yisrael-beiteinu/index.html`
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Consumes: canonical JSON and filter buttons with `data-topic`.
- Produces: progressive filtering/disclosure; no core narrative dependency on JS.

- [ ] **Step 1: Add JS contract check**

```js
const client = await fs.readFile('scripts/yisrael-beiteinu-evidence-20260907.js', 'utf8');
for (const token of ['data-topic', 'aria-pressed', 'fetch(']) {
  if (!client.includes(token)) throw new Error(`client contract missing ${token}`);
}
```

- [ ] **Step 2: Add static representative subset and filters**

```html
<div class="corpus-filters" aria-label="סינון מאגר לפי נושא">
  <button type="button" data-topic="all" aria-pressed="true">הכול</button>
  <button type="button" data-topic="security" aria-pressed="false">ביטחון</button>
  <button type="button" data-topic="youth" aria-pressed="false">צעירים</button>
  <button type="button" data-topic="russian" aria-pressed="false">רוסית</button>
  <button type="button" data-topic="holon" aria-pressed="false">חולון</button>
</div>
<div data-corpus-results aria-live="polite">…static representative records…</div>
```

- [ ] **Step 3: Implement progressive enhancement**

```js
const root = document.querySelector('[data-yb-corpus]');
if (root) {
  const response = await fetch('/knowledge/yisrael-beiteinu-evidence-20260907.json', { credentials: 'same-origin' });
  if (response.ok) {
    const data = await response.json();
    const buttons = [...root.querySelectorAll('[data-topic]')];
    const target = root.querySelector('[data-corpus-results]');
    const render = topic => {
      const records = data.records.filter(record => topic === 'all' || record.tags.includes(topic));
      target.innerHTML = records.slice(0, 24).map(record => `<article data-evidence-id="${record.id}"><a href="#${record.id}">${record.title}</a></article>`).join('');
    };
    for (const button of buttons) button.addEventListener('click', () => {
      for (const peer of buttons) peer.setAttribute('aria-pressed', String(peer === button));
      render(button.dataset.topic);
    });
  }
}
```

Use trusted canonical text only; never inject raw third-party HTML.

- [ ] **Step 4: Keep JS failure non-destructive**

If fetch fails, static representative records remain visible.

- [ ] **Step 5: Run validator and commit**

```bash
npm run check-party-evidence
git add scripts/yisrael-beiteinu-evidence-20260907.js evidence/yisrael-beiteinu/index.html scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "feat(evidence): add progressive party corpus explorer"
```

---

### Task 5: English and Russian Static Versions

**Files:**
- Create: `evidence/yisrael-beiteinu/en/index.html`
- Create: `evidence/yisrael-beiteinu/ru/index.html`
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Consumes: Hebrew section/record IDs and invariant numeric/source data.
- Produces: first-class EN/RU pages with correct directionality and hreflang.

- [ ] **Step 1: Add language parity checks**

```js
const en = await fs.readFile('evidence/yisrael-beiteinu/en/index.html', 'utf8');
const ru = await fs.readFile('evidence/yisrael-beiteinu/ru/index.html', 'utf8');
if (!en.includes('<html lang="en" dir="ltr">')) throw new Error('English lang/dir wrong');
if (!ru.includes('<html lang="ru" dir="ltr">')) throw new Error('Russian lang/dir wrong');
for (const id of body.summary.headlineEvidenceIds) {
  for (const [label, page] of [['he', he], ['en', en], ['ru', ru]]) {
    if (!page.includes(`id="${id}"`)) throw new Error(`${label} missing evidence id ${id}`);
  }
}
for (const page of [he, en, ru]) {
  if (!page.includes('hreflang="he"') || !page.includes('hreflang="en"') || !page.includes('hreflang="ru"')) throw new Error('hreflang set incomplete');
}
```

- [ ] **Step 2: Run validator and confirm missing-language failure**

```bash
npm run check-party-evidence
```

- [ ] **Step 3: Create English version**

Canonical:
```html
<link rel="canonical" href="https://7ya.io/evidence/yisrael-beiteinu/en/">
```

- [ ] **Step 4: Create Russian version**

Canonical:
```html
<link rel="canonical" href="https://7ya.io/evidence/yisrael-beiteinu/ru/">
```

Russian copy should be native political/public prose, not machine-like transliteration.

- [ ] **Step 5: Run parity validation and commit**

```bash
npm run check-party-evidence
git add evidence/yisrael-beiteinu/en/index.html evidence/yisrael-beiteinu/ru/index.html scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "feat(evidence): add English and Russian dossier pages"
```

---

### Task 6: Static-Site Contract, Route Verification and Sitemap

**Files:**
- Modify: `scripts/site-contract.mjs`
- Modify: `scripts/verify-routes.mjs`
- Modify: `sitemap.xml`
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Produces: nested canonical route coverage in build/verification and explicit public discovery.

- [ ] **Step 1: Add nested canonical route contract**

In `scripts/site-contract.mjs`:

```js
export const nestedCanonicalRoutes = [
  'evidence/yisrael-beiteinu',
  'evidence/yisrael-beiteinu/en',
  'evidence/yisrael-beiteinu/ru',
];
```

Do not add these to `publicRouteDirectories`; `evidence` already copies recursively.

Add `yisrael-beiteinu-evidence-20260907.css` to `publicStyleFiles` and `yisrael-beiteinu-evidence-20260907.js` to `publicScriptFiles`.

Add to `criticalArtifactPaths`:

```js
'evidence/yisrael-beiteinu/index.html',
'evidence/yisrael-beiteinu/en/index.html',
'evidence/yisrael-beiteinu/ru/index.html',
'knowledge/yisrael-beiteinu-evidence-20260907.json',
'styles/yisrael-beiteinu-evidence-20260907.css',
'scripts/yisrael-beiteinu-evidence-20260907.js',
```

- [ ] **Step 2: Extend route verifier**

```js
import { aliasRoutes, canonicalRoutes, nestedCanonicalRoutes } from './site-contract.mjs';

const routes = [...canonicalRoutes, ...nestedCanonicalRoutes].map(route => [
  `/${route ? `${route}/` : ''}`,
  route ? `${route}/index.html` : 'index.html',
]);
```

- [ ] **Step 3: Add sitemap URLs**

```xml
<url><loc>https://7ya.io/evidence/yisrael-beiteinu/</loc><lastmod>2026-09-07</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>
<url><loc>https://7ya.io/evidence/yisrael-beiteinu/en/</loc><lastmod>2026-09-07</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>
<url><loc>https://7ya.io/evidence/yisrael-beiteinu/ru/</loc><lastmod>2026-09-07</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>
```

- [ ] **Step 4: Add sitemap assertions**

```js
const sitemap = await fs.readFile('sitemap.xml', 'utf8');
for (const url of [
  'https://7ya.io/evidence/yisrael-beiteinu/',
  'https://7ya.io/evidence/yisrael-beiteinu/en/',
  'https://7ya.io/evidence/yisrael-beiteinu/ru/'
]) if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap missing ${url}`);
```

- [ ] **Step 5: Build and verify artifact**

```bash
npm run build:site
npm run check:artifact
npm run verify:artifact
```

Expected: all pass and all new critical files exist in `dist/`.

- [ ] **Step 6: Commit**

```bash
git add scripts/site-contract.mjs scripts/verify-routes.mjs sitemap.xml scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "feat(evidence): register dossier routes and artifact contract"
```

---

### Task 7: SEO, Structured Data and Accessibility Integrity

**Files:**
- Modify: all three dossier HTML files
- Modify: `scripts/check-yisrael-beiteinu-evidence.mjs`

**Interfaces:**
- Produces: machine-readable ProfilePage/Person semantics without unsupported office-holder/employment claims.

- [ ] **Step 1: Add metadata assertions**

```js
for (const [label, page] of [['he', he], ['en', en], ['ru', ru]]) {
  if (!page.includes('application/ld+json')) throw new Error(`${label} missing JSON-LD`);
  if (!page.includes('rel="canonical"')) throw new Error(`${label} missing canonical`);
  if (!page.includes('name="description"')) throw new Error(`${label} missing description`);
  if (!page.includes('href="#main"')) throw new Error(`${label} missing skip link`);
  if (!page.includes('<main id="main"')) throw new Error(`${label} missing main landmark`);
}
```

- [ ] **Step 2: Add truthful JSON-LD**

Pattern:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "url": "https://7ya.io/evidence/yisrael-beiteinu/",
      "about": { "@id": "https://7ya.io/#igor" },
      "isPartOf": { "@id": "https://7ya.io/#website" }
    },
    {
      "@type": "Person",
      "@id": "https://7ya.io/#igor",
      "name": "Igor Vepretski"
    }
  ]
}
```

Do not add `memberOf`, elected office, employment dates, or Knesset office-holder status unless independently supported and intended for public schema.

- [ ] **Step 3: Verify non-color status labels, no autoplay and alt text**

```js
for (const page of [he, en, ru]) {
  if (/autoplay/i.test(page)) throw new Error('autoplay prohibited');
  if (/<img(?![^>]*\balt=)[^>]*>/i.test(page)) throw new Error('image without alt');
}
```

- [ ] **Step 4: Run checks and commit**

```bash
npm run check-party-evidence
git add evidence/yisrael-beiteinu scripts/check-yisrael-beiteinu-evidence.mjs
git commit -m "fix(evidence): harden dossier SEO and accessibility"
```

---

### Task 8: Full Release-Gate and Visual Acceptance

**Files:**
- No code changes unless a failing gate identifies a defect.
- Update release evidence only through the existing release protocol after approval.

**Interfaces:**
- Consumes: finished dossier implementation.
- Produces: verified merge candidate; does not deploy production.

- [ ] **Step 1: Run feature validator**

```bash
npm run check-party-evidence
```

- [ ] **Step 2: Run full local CI**

```bash
npm run ci:local
```

Expected: all checks, typecheck, tests, static build, artifact check and artifact verification pass.

- [ ] **Step 3: Serve built artifact**

```bash
npm run serve:static
```

Inspect:
```text
http://localhost:4173/evidence/yisrael-beiteinu/
http://localhost:4173/evidence/yisrael-beiteinu/en/
http://localhost:4173/evidence/yisrael-beiteinu/ru/
```

- [ ] **Step 4: Visual QA matrix**

Capture separate screenshots — never a collage:

```text
390×844  Hebrew hero + first proof row
390×844  Hebrew official amplification
390×844  Russian hero
1440×1000 English hero + timeline
1440×1000 Hebrew evidence cards + corpus explorer
1440×1000 Hebrew candidacy boundary + closing
```

Acceptance conditions:
- one human image dominates hero rather than metrics;
- no horizontal overflow at 390px;
- timeline is one vertical rail on phone;
- official-amplification tiles are one per row on narrow screens;
- closing thesis has generous whitespace;
- no section resembles a slide deck or SaaS dashboard.

- [ ] **Step 5: No-JS smoke test**

Disable JavaScript and confirm hero, timeline, synthesis, candidacy sequence, evidence boundaries, representative corpus records and source links remain usable.

- [ ] **Step 6: Local route verification**

```bash
node scripts/verify-routes.mjs http://localhost:4173
```

Expected:
```text
ROUTE_VERIFY: PASS
```

- [ ] **Step 7: Rerun complete gate after any correction**

```bash
npm run ci:local
```

- [ ] **Step 8: Keep deployment separate**

Do not deploy because this plan is complete. Production mutation requires the user's explicit release-chain instruction and a passing current source-alignment gate.

---

## Self-Review Checklist

- Spec coverage: hero, timeline, evidence cards, official amplification, 140-record explorer, personal layer, synthesis, candidacy gate, boundaries, closing, HE/EN/RU, SEO, accessibility, performance and mobile behavior map to concrete tasks.
- Claim-boundary coverage: `OPEN` exclusion from headline metrics is enforced by code.
- Metric integrity: owner corpus count and conservative observed metrics live in one canonical JSON layer rather than duplicated counters.
- No-JS coverage: complete core narrative is HTML; only corpus filtering is enhanced by JS.
- Route/build coverage: nested routes are explicitly verified and added to critical artifact paths while `evidence/` continues to copy recursively.
- Source-safety coverage: Task 0 blocks implementation until the repository is reconciled with the complete production runtime source.
- Deployment separation: no task authorizes production deployment.
