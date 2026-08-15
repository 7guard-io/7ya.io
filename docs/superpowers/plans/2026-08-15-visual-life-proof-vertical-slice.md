# Visual Life Proof Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved ORIGIN → SERVICE → RETURN path on 7YA from text-led archive sections into a visually alive, source-backed life journey using real source imagery and explicit fallbacks.

**Architecture:** Keep AppDeploy as the live source of truth. Add a focused visual-source registry that binds each life chapter to verified source assets, provenance, crop rules and fallback state; render those assets in the existing journey sections without replacing evidence text. The first slice covers ORIGIN, SERVICE and RETURN only, proving the visual system before scaling it to VOICE/CREATE/IDEAS.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy frontend+backend, existing 7YA evidence/media datasets, CSS, AppDeploy E2E QA.

## Global Constraints

- No collage.
- No fabricated historical photo presented as evidence.
- Original/source media is preferred over generic portraits.
- AI-generated imagery, if ever used, must be labelled internally as `GENERATED REPRESENTATION` and must never satisfy an evidence requirement.
- `CODE PASS != UX PASS != PRODUCTION PASS`.
- Every visible source object keeps provenance, source label and destination link.
- Missing images degrade to designed text/source treatment; never a broken image hole.
- Mobile fixed navigation and Companion must not cover source media or CTAs.
- AppDeploy applied source is authoritative if GitHub source lags.

---

### Task 1: Visual-source registry and failing QA gate

**Files:**
- Create: `src/life-visual-registry.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces: `type LifeVisualAsset`, `lifeVisualRegistry`, `getLifeVisuals(chapter)`.
- Each asset exposes `id`, `chapter`, `label`, `source`, `sourceUrl`, `imageUrl`, `year`, `evidenceStatus`, `alt`, `objectPosition`, `representation`.

- [ ] **Step 1: Write the failing E2E requirements**

Add a test requiring ORIGIN, SERVICE and RETURN each to render at least one visible source-backed image object, with a source label and clickable provenance link. Add a mobile assertion that failed external imagery degrades without an empty black media rectangle.

- [ ] **Step 2: Run AppDeploy QA and verify RED**

Expected: FAIL because the current SERVICE/RETURN implementation is text/card led and does not guarantee a real visible source image in every target chapter.

- [ ] **Step 3: Add the typed registry**

Use only assets already present in 7YA datasets/public source records. Do not invent childhood or military photography. When no verified image exists for a historical sub-period, use a documented publisher/press source visual from that chapter and state its scope accurately.

- [ ] **Step 4: Source verification**

Confirm each selected source URL belongs to the same evidence record as the visual or is explicitly a documented contextual visual. Remove any candidate whose provenance cannot be supported.

- [ ] **Step 5: Commit**

Commit message: `feat: add life visual source registry`.

---

### Task 2: Rebuild ORIGIN as a visual life scene

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/igor-living-record.css`
- Consume: `src/life-visual-registry.ts`

**Interfaces:**
- Consumes: `getLifeVisuals('origin')`.
- Produces: an ORIGIN visual scene with source visual, timeline, evidence label and reflection retained.

- [ ] **Step 1: Add failing visual assertion for ORIGIN**

Require the ORIGIN chapter to contain a source visual object before LIFE/EVIDENCE/MEANING and to keep the reflection reachable without overlap.

- [ ] **Step 2: Verify RED**

Expected: current ORIGIN is primarily timeline/text and fails the source-visual requirement.

- [ ] **Step 3: Implement minimal source-backed scene**

Render one large editorial visual from the verified ORIGIN record, with year/source/evidence status and a source CTA. Keep the timeline alongside or immediately below it. Do not use `igor-hero.jpg` as the evidence visual.

- [ ] **Step 4: Mobile treatment**

Use full-width image, readable caption, fixed aspect ratio and explicit `object-position`. No horizontal overflow; no collision with the bottom dock.

- [ ] **Step 5: Run QA**

Expected: ORIGIN visual test PASS on desktop and mobile.

- [ ] **Step 6: Commit**

Commit message: `feat: make origin chapter visually source-backed`.

---

### Task 3: Rebuild SERVICE around evidence, not badges

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/igor-living-record.css`
- Consume: `src/life-visual-registry.ts`

**Interfaces:**
- Consumes: `getLifeVisuals('service')`.
- Produces: SERVICE hero visual + four service dimensions as secondary context, not the primary visual.

- [ ] **Step 1: Add failing SERVICE assertion**

Require a real source-backed image or documented press frame to dominate the SERVICE chapter. Reject a chapter where the main visual is only a generic portrait plus MILITARY/SECURITY/POLICE/PUBLIC SERVICE labels.

- [ ] **Step 2: Verify RED**

Expected: current SERVICE presentation fails.

- [ ] **Step 3: Implement visual hierarchy**

Place the source image first, then service narrative and the four dimensions. Keep sensitive operational details out. The visual must be tied to an actual public record and labelled as contextual when it does not depict the exact historical service moment.

- [ ] **Step 4: Add resilient image fallback**

On image error, hide the image element and keep the source frame, source title, year and evidence label visible. Never show a black empty rectangle.

- [ ] **Step 5: Run desktop/mobile QA**

Expected: SERVICE visual is visible, captions readable, no duplicate generic portrait, no floating-control overlap.

- [ ] **Step 6: Commit**

Commit message: `feat: replace service badges with evidence-led scene`.

---

### Task 4: Make RETURN / StartOn / President's Residence visually alive

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/ContextualRelationships.tsx`
- Modify: `src/journey-engine.css`
- Consume: `src/life-visual-registry.ts`
- Consume: `src/relationship-registry.ts`

**Interfaces:**
- Consumes: `getLifeVisuals('return')` and existing truthful relationship statuses.
- Produces: StartOn source-media scene plus contextual relationship entries with status, source and optional source visual.

- [ ] **Step 1: Add failing RETURN assertion**

Require the StartOn/RETURN chapter to show at least one real StartOn press/broadcast visual above the relationship rail and preserve exact relationship statuses: President's Residence `DOCUMENTED WORKFLOW`, Microsoft for Startups `ECOSYSTEM / MEMBERSHIP`, AJCatalyst `PILOT PROPOSAL`.

- [ ] **Step 2: Verify RED**

Expected: status text exists but the chapter lacks enough source imagery.

- [ ] **Step 3: Render StartOn proof scene**

Use a verified press/broadcast source visual already present in the archive, crop it cleanly, show source/year/status, and link to the original record.

- [ ] **Step 4: Enrich relationship cards without logo-wall behavior**

Where a documented visual exists, show it as a supporting thumbnail; otherwise stay text-first. Never infer sponsorship from a photo or event appearance.

- [ ] **Step 5: Run desktop/mobile QA**

Expected: RETURN feels like a lived chapter, not a partner directory. Relationship semantics remain unchanged.

- [ ] **Step 6: Commit**

Commit message: `feat: add visual proof to return chapter`.

---

### Task 5: Production visual proof gate

**Files:**
- Modify: `tests/tests.txt` only if the implemented behavior requires stricter acceptance wording.

**Interfaces:**
- Produces: terminal QA evidence for the vertical slice.

- [ ] **Step 1: Run full AppDeploy E2E**

Expected: frontend/backend build clean; new ORIGIN/SERVICE/RETURN visual tests PASS.

- [ ] **Step 2: Inspect mobile and desktop screenshots if the platform exposes viewable screenshots**

Check crop, spacing, RTL, visual repetition, black-hole fallbacks, bottom dock/Companion overlap and source readability.

- [ ] **Step 3: If screenshots are not directly inspectable, do not claim pixel-level completion**

Report semantic QA separately from direct visual QA and ask for/consume a production screenshot only for the remaining visual proof gap.

- [ ] **Step 4: Verify live production route**

Confirm the applied AppDeploy version is ready and `7ya.io` serves the new release.

- [ ] **Step 5: Final completion statement**

Only state `DONE` when source, data, render, visual proof and live production gates are all satisfied.