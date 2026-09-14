# Rich Life Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed-chapter representation of Igor Vepretski's life with a rich, expandable, source-linked chronological atlas that projects as much safe public and owner-authorized material as the existing 7YA corpus can expose.

**Architecture:** Public Projection remains the breadth layer and Canon remains the truth anchor. A deterministic client-side Life Moment Resolver converts projection records into dated moments and dynamic eras, clusters only true source duplicates, prefers authentic media, preserves evidence status and source-local metrics, and never invents place, people, dates or aggregate reach. The new Rich Life Timeline becomes the primary chronology on the homepage, deep album and Igor profile; the old curated chapters survive only as a resilient canonical-anchor fallback/depth layer, not as a ceiling on the biography.

**Tech Stack:** React 19, TypeScript, @appdeploy/client, existing `/api/public-projection`, existing 7YA album/canon data, CSS, AppDeploy e2e/visual QA.

**Spec:** `docs/superpowers/specs/2026-09-12-unified-public-media-design.md` plus the user-approved 2026-09-12 extension: `Public Projection → Life Moment Resolver → Rich Chronological Timeline → original media first → evidence attached → no fixed chapter ceiling`.

## Global Constraints

- Canon is authoritative but must not cap the number of visible life moments.
- DISCOVERY remains explicitly non-canonical; it is never silently upgraded to fact.
- Prefer original/source media and owner-authorized media; never generate an event image or fake a memory.
- Every visible metric remains source-local and attached to the source that owns it; never synthesize cross-platform reach.
- Never infer a place, person, exact age, event date or endorsement from a social post when the source does not support it.
- Private documents may verify claims but do not auto-publish.
- The timeline has no fixed chapter ceiling. Eras are derived from the years actually present in the projection and can grow as the corpus grows.
- Mobile 375×667 must not create page-level horizontal overflow.
- Production success is judged on the canonical live 7ya.io experience, not only source code or build status.

---

### Task 1: Lock the Rich Life Atlas acceptance contract

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current homepage, `/igor-vepretski/`, `/api/public-projection`.
- Produces: acceptance contract for the Rich Life Atlas and its failure guardrail.

- [x] **Step 1: Write the failing tests**

The updated e2e suite requires a visible `LIFE ATLAS / PUBLIC PROJECTION` chronology, dynamic eras, evidence-layer labels, source actions, media-first moment cards, shared profile integration and a projection-failure canonical fallback.

- [ ] **Step 2: Run the tests and verify RED**

Run the AppDeploy e2e contract against the current v94-equivalent UI before production code changes.

Expected: FAIL because the homepage still declares eight fixed chapters and no Rich Life Atlas component exists.

- [ ] **Step 3: Preserve unrelated museum coverage**

Keep the existing museum Story Mode workflow covered so the timeline change cannot accidentally remove the public-projection narrative experience.

---

### Task 2: Build the deterministic Life Moment Resolver

**Files:**
- Create: `src/album/life-moment-resolver.ts`

**Interfaces:**
- Consumes: `ProjectionItem[]` from `/api/public-projection`.
- Produces: `resolveLifeAtlas(items): LifeAtlasEra[]`, `LifeMoment`, `LifeAtlasEra`, layer/media helpers.

- [ ] **Step 1: Satisfy the failing chronology assertions with a minimal data model**

Define projection input fields already returned by the server and a `LifeMoment` shape that preserves `date`, `year`, `layer`, `trust`, `sourceUrl`, `imageUrl`, `mediaType`, `publisher`, `metrics`, `topics`, `relationships` and multilingual title/summary.

- [ ] **Step 2: Exclude navigation-only surfaces from biography moments**

Filter `mediaType === 'profile'`. Keep dated/year-bearing source objects in chronology. Put undated records into an explicit open-record bucket rather than assigning invented dates.

- [ ] **Step 3: Resolve real duplicates without collapsing distinct life posts**

Cluster canonical records sharing the same `canonicalId` into one moment with multiple evidence sources. For non-canonical items, only collapse identical normalized source URLs; otherwise keep each publication as a distinct moment.

- [ ] **Step 4: Prefer authentic visual evidence**

Choose `imageUrl` from the strongest source in CANON → LIVE → LEGACY → DISCOVERY → PENDING order while keeping the selected source URL and layer visible. Do not manufacture a replacement visual.

- [ ] **Step 5: Derive dynamic eras from observed years**

Create an era for every observed year from 2011 onward, plus sparse historical origin ranges when present, with deterministic multilingual labels derived from the year and dominant topics. No hard-coded maximum number of eras or moments.

---

### Task 3: Make the Rich Life Timeline the primary homepage/deep-album chronology

**Files:**
- Create: `src/album/RichLifeTimeline.tsx`
- Create: `src/album/rich-life-timeline.css`
- Modify: `src/album/AlbumHome.tsx`

**Interfaces:**
- Consumes: `api.get('/api/public-projection?sort=oldest&limit=300&cursor=...')`, `resolveLifeAtlas`.
- Produces: visible dynamic chronology with evidence/media/source actions and canonical fallback.

- [ ] **Step 1: Fetch all accessible projection pages**

Use `api.get` only. Start with `sort=oldest&limit=300`; follow `nextCursor` until exhausted with a bounded safety cap. Keep `knownTotal`, `streamCounts` and layer facets for truthful UI context.

- [ ] **Step 2: Render media-first eras and moments**

Render `LIFE ATLAS / PUBLIC PROJECTION`, truthful loaded moment count, dynamic era navigation, moment cards with date/year, approximate age only when derived from year, title/summary, source media, platform/publisher, evidence layer/trust, related labels when present and source-local metrics.

- [ ] **Step 3: Add useful density controls without hiding the life**

Default to a substantial initial number of moments and expose a clear “show more” action that expands in-place. Filtering by layer must not silently discard the existence of other layers; labels explain CANON/LIVE/LEGACY/DISCOVERY.

- [ ] **Step 4: Remove the fixed-eight-chapter claim**

Replace copy such as “eight chapters” with language that explains a living chronology. Keep the old curated chapter stories after the Atlas as optional anchor stories/depth, explicitly labeled as curation rather than the complete life.

- [ ] **Step 5: Preserve a safe failure mode**

If Public Projection fails, show a visible temporary-unavailable message and render the existing curated canonical anchor stories so the life story never becomes blank.

---

### Task 4: Share the same chronology with the Igor profile

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`

**Interfaces:**
- Consumes: `RichLifeTimeline`.
- Produces: the same evidence-backed chronology on `/igor-vepretski/` without duplicating a separate fixed biography model.

- [ ] **Step 1: Insert the Rich Life Atlas near the top of the living record**

Place it after the identity hero/personal-content entrance so a visitor can immediately move from “who” to the chronological record.

- [ ] **Step 2: Demote the seven-room index to thematic depth**

Keep the existing rooms as thematic interpretation/depth, but label them as lenses rather than the complete chronology and remove wording that implies `01—07` is the full life path.

---

### Task 5: Verify production, mobile and source integrity

**Files:**
- Modify: `tests/tests.txt` only if QA reveals a contract bug rather than an implementation bug.

**Interfaces:**
- Consumes: deployed snapshot and canonical 7ya.io.
- Produces: terminal ready status plus live visual verification.

- [ ] **Step 1: Run AppDeploy build/e2e and reach terminal status**

Expected: `ready`, no frontend/backend errors, acceptance tests green.

- [ ] **Step 2: Inspect desktop and mobile screenshots**

Check hierarchy, authentic image density, readable layer labels, source buttons, dynamic era rail, no generic-image substitution and no page-level horizontal overflow.

- [ ] **Step 3: Verify canonical 7ya.io**

Open the live domain and confirm the visible homepage and profile expose the Rich Life Atlas rather than the old fixed-count life model.

- [ ] **Step 4: Reconcile the acceptance map**

Coverage map after implementation: homepage chronology → Test 1; evidence/source interaction → Test 2; mobile density/expansion → Test 3; profile reuse → Test 4; projection outage fallback → Test 5.
