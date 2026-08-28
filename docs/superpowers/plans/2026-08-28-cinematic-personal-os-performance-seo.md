# 7YA Cinematic Personal OS — Performance + SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the crawlable/static first paint, release metadata, sitemap freshness and structured data with the live Cinematic Personal OS so users, crawlers and hydration all receive the same current story and route signals.

**Architecture:** Keep the existing rich static-first route shells and hydration system. Do not rewrite route pages that are already crawlable. Fix the actual drift at the root: synchronize `index.html`, `src/App.tsx`, `public/release.json`, `public/sitemap.xml` and `public/llms.txt` around one release marker and the current cinematic hero contract; add route-level machine-readable CollectionPage/ItemList data only where it materially improves discovery without duplicating the application data layer.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, static HTML, JSON-LD / schema.org, XML sitemap, AppDeploy.

**Spec:** `docs/superpowers/specs/2026-08-28-cinematic-personal-os-design.md`

## Global Constraints

- Production app: AppDeploy `697a008fddc309b142`.
- Execution baseline: applied production snapshot `1787938474434` or a newer applied snapshot if production advances before execution.
- Never deploy stale GitHub runtime source over AppDeploy.
- Canonical public domain remains `https://7ya.io/`.
- HE / EN / RU runtime routes and Arabic / Spanish public gateways remain intact.
- Existing static-first route shells remain the fallback when hydration fails.
- No crawler/index refresh timing is promised; this plan improves crawl signals but cannot force third-party caches to refresh immediately.
- No change to backend ingestion, social sync, NVIDIA, Canon/Discovery semantics or Impact metric values.
- Do not add speculative structured-data claims. Use only existing public route descriptions and source URLs already present in the current static shells.
- Release marker for this slice: `7ya-cinematic-os-20260828-v1`.
- `ProfilePage.dateModified` and sitemap `lastmod` for materially changed routes become `2026-08-28`.
- No success claim without a fresh AppDeploy build/runtime verification.

---

### Task 1: Add SEO/first-paint regression coverage

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Adds Test 10 for static-first / hydrated home consistency.
- Adds Test 11 for rich static room fallback.

- [ ] **Step 1: Add Test 10**

Append:

```text
## Test 10 - Static first paint matches the Cinematic Personal OS home
Viewport: mobile
Covers: root static-first HTML, current cinematic headline, two-action mobile contract, release marker, hydration stability
Description: Verifies the crawlable first response and hydrated React home tell the same current story instead of flashing an older homepage hierarchy.
Steps:
1. Open /?lang=he at 375x667 from a cold navigation and inspect the first visible home block
2. Continue until the React home has hydrated and inspect the hero again
3. Inspect the document release marker and the first two visible actions
Expected: The first response and hydrated home both use the Cinematic Personal OS headline and story thesis; Story and Evidence are the two first-fold mobile actions; release metadata is 7ya-cinematic-os-20260828-v1; no page-level horizontal overflow or contradictory old hero copy appears.
```

- [ ] **Step 2: Add Test 11**

Append:

```text
## Test 11 - Core public routes remain useful without hydration
Viewport: desktop
Covers: static-first Media and Research shells, title/description/canonical/hreflang, source-linked fallback content
Description: Verifies the SEO fallback remains substantive when the React bundle cannot hydrate.
QA Faults:
```json
[
  {
    "method": "GET",
    "path": "/",
    "status": 503,
    "body_json": { "error": "simulated_root_hydration_failure" }
  }
]
```
Steps:
1. Open /media/ and /research/ under the fault
2. Inspect the visible static hero, at least one source-linked card and route metadata
3. Open one static source link from each route
Expected: Both routes remain readable and navigable with route-specific title, description, canonical/hreflang and public source links; the page does not collapse to a redirect notice or blank root.
```

---

### Task 2: Synchronize the release marker across runtime and static HTML

**Files:**
- Modify: `src/App.tsx`
- Modify: `index.html`
- Modify: `public/release.json`

**Interfaces:**
- Produces one canonical release string: `7ya-cinematic-os-20260828-v1`.

- [ ] **Step 1: Update the React runtime marker**

Change:

```ts
const release='7ya-seo-sync-20260827-v9';
```

to:

```ts
const release='7ya-cinematic-os-20260828-v1';
```

- [ ] **Step 2: Update root metadata markers**

In `index.html` set:

```html
<meta name='7ya-release' content='7ya-cinematic-os-20260828-v1'>
<meta name='7ya-build' content='7ya-cinematic-os-20260828-v1'>
```

Update the first-paint bootstrap key to:

```js
var v='7ya-cinematic-os-20260828-v1-firstpaint';
```

This intentionally invalidates only the old 7YA first-paint bootstrap state once.

- [ ] **Step 3: Update `public/release.json`**

Set:

```json
{
  "release": "7ya-cinematic-os-20260828-v1",
  "build_marker": "7ya-cinematic-os-20260828-v1",
  "deployed_on": "2026-08-28",
  "experience": "CINEMATIC_PERSONAL_OS_V1",
  "source_alignment": "APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT"
}
```

Preserve service/provider/domain/languages/evidence/visual/corpus policies. Update rollback to the immediately previous applied production snapshot at execution time.

---

### Task 3: Align the root static first paint with the live hero contract

**Files:**
- Modify: `index.html`

**Interfaces:**
- Static first paint and React hero use the same current thesis.
- Static mobile-first action priority is Story + Evidence.

- [ ] **Step 1: Replace the stale static headline**

Replace:

```html
<h1>מחרקוב לג׳סי כהן.<br>משירות ל־StartOn.</h1>
```

with:

```html
<h1>חיים אמיתיים.<br>השפעה שאפשר לראות.</h1>
```

- [ ] **Step 2: Replace the stale lead**

Use:

```html
<p>אני איגור. מילדות ועלייה, דרך שירות וחזרה לג׳סי כהן, ועד StartOn, יצירה, מחקר ורשת השפעה שחצתה פלטפורמות ומדינות.</p>
```

- [ ] **Step 3: Align first-paint actions**

Replace the four primary static CTA links with exactly two primary first-paint links:

```html
<nav aria-label='כניסה לסיפור הציבורי'>
  <a href='./#story'>להתחיל בסיפור</a>
  <a href='./evidence/'>ראיות ומקורות</a>
</nav>
```

Keep deeper StartOn / Media / Library navigation in the existing `noscript` block so crawl depth is not lost.

- [ ] **Step 4: Keep the authentic hero image and LCP-friendly inline background**

Do not introduce a new remote hero or generated asset. Keep `./resources/igor-hero.jpg` as first-paint media.

---

### Task 4: Refresh structured data without inflating claims

**Files:**
- Modify: `index.html`
- Modify: `public/media/index.html`
- Modify: `public/research/index.html`

**Interfaces:**
- Root schema remains a single `@graph` with stable `@id`s.
- Media receives a `CollectionPage` + `ItemList` describing only the three source cards already present.
- Research receives a `CollectionPage` describing the existing public research route and Academia/evidence/library relationships.

- [ ] **Step 1: Update root ProfilePage freshness**

Change:

```json
"dateModified":"2026-08-27"
```

to:

```json
"dateModified":"2026-08-28"
```

Do not alter Person or StartOn factual claims in this slice.

- [ ] **Step 2: Add Media CollectionPage JSON-LD**

Add before `</head>` in `public/media/index.html`:

```html
<script type='application/ld+json'>{"@context":"https://schema.org","@type":"CollectionPage","@id":"https://7ya.io/media/#page","url":"https://7ya.io/media/","name":"ראיונות, כתבות ופודקאסטים | איגור ופרצקי · 7YA","dateModified":"2026-08-28","about":{"@id":"https://7ya.io/#igor"},"isPartOf":{"@id":"https://7ya.io/#website"},"mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"ListItem","position":1,"url":"https://holon.mynet.co.il/local_news/article/hjxqegkiq"},{"@type":"ListItem","position":2,"url":"https://prod.13tv.co.il/item/news/haolam-haboker/season-01/clips/u0uoy-903061791/?pid=44"},{"@type":"ListItem","position":3,"url":"https://www.hidabroot.org/article/1179015"}]}}</script>
```

- [ ] **Step 3: Add Research CollectionPage JSON-LD**

Add before `</head>` in `public/research/index.html`:

```html
<script type='application/ld+json'>{"@context":"https://schema.org","@type":"CollectionPage","@id":"https://7ya.io/research/#page","url":"https://7ya.io/research/","name":"מחקר ומסגרות חשיבה | איגור ופרצקי · 7YA","dateModified":"2026-08-28","about":{"@id":"https://7ya.io/#igor"},"isPartOf":{"@id":"https://7ya.io/#website"},"relatedLink":["https://igorvepretski.academia.edu/","https://7ya.io/evidence/","https://7ya.io/library/"]}</script>
```

Do not mark independent frameworks as peer-reviewed scholarly articles unless a source explicitly supports that status.

---

### Task 5: Refresh sitemap and LLM crawl signals

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`

**Interfaces:**
- Sitemap reflects the 2026-08-28 material UI/static changes.
- LLM guide identifies the current experience without changing evidence rules.

- [ ] **Step 1: Update `lastmod` for materially refreshed routes**

Set `2026-08-28` for:

```text
/
/igor-vepretski/
/media/
/library/
/research/
/music/
/speaker/
/evidence/
/museum/
```

Also update their `?lang=en` and `?lang=ru` entries where present. Leave unrelated routes on their actual earlier date unless modified by this slice.

- [ ] **Step 2: Add current experience line to `llms.txt`**

After the opening blockquote add:

```text
Current public experience: Cinematic Personal OS — person-first, source-linked and media-first. The homepage curates six life scenes before Media and Impact depth; Museum and Life Archive preserve the deeper record.
```

Do not change the existing source policy or canonical resource URLs.

---

### Task 6: Verify build, static fallback and runtime consistency

**Files:**
- Modify only if validation exposes errors.

- [ ] **Step 1: Run AppDeploy validation/build**

Expected: candidate builds successfully.

- [ ] **Step 2: Source readback**

Verify the applied candidate contains:

```text
release = 7ya-cinematic-os-20260828-v1
root static headline = חיים אמיתיים. השפעה שאפשר לראות.
root first-paint actions = Story + Evidence
ProfilePage dateModified = 2026-08-28
Media CollectionPage JSON-LD present
Research CollectionPage JSON-LD present
sitemap lastmod = 2026-08-28 on refreshed routes
```

- [ ] **Step 3: Runtime QA**

Require AppDeploy terminal status `ready` with:

```text
frontend errors: 0
backend errors: 0
network errors: 0 attributable to the candidate
```

- [ ] **Step 4: Check home and static route fallbacks**

Verify `/`, `/media/`, `/research/`, `/evidence/` and `/library/` remain reachable. If manual screenshot inspection is unavailable, explicitly report that generated screenshots are not equivalent to visual PASS.

- [ ] **Step 5: Preserve crawler-cache caveat**

External search/crawl tools may continue surfacing an older cached shell after deployment. Treat current AppDeploy source/runtime as the deployment truth and do not promise immediate third-party index refresh.

## Self-review

- Spec coverage: static-first consistency, mobile hierarchy, SEO metadata, structured data, multilingual canonical signals, performance stability and source truth safety are covered.
- YAGNI: existing rich route shells are preserved rather than rewritten.
- No speculative Person/organization claims are introduced.
- No backend or AI behavior changes.
- No placeholders remain.
- Release string, `dateModified` and sitemap dates are internally consistent.
