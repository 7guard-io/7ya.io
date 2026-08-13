# 7YA Visual System v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every public 7YA surface into one coherent, premium, authentic-media-led visual system, with independent desktop/mobile visual acceptance.

**Architecture:** Treat the AppDeploy runtime snapshot as the currently observable product and GitHub `7guard-io/7ya.io` as the canonical source that must be reconciled before final acceptance. Build a shared visual foundation first, then migrate routes in bounded batches. Every batch ends with inspectable desktop/mobile screenshots and a visual correction pass before acceptance.

**Tech Stack:** React/TypeScript runtime in AppDeploy, CSS, existing 7YA content/media assets, GitHub canonical repository, AppDeploy deployment + QA snapshots.

## Global Constraints

- No visually empty sections.
- No generic placeholder imagery when real Igor/7YA/StartOn media exists.
- No repeated undifferentiated card grids across the site.
- Mobile receives its own composition decisions; it is not simply compressed desktop.
- Every major viewport contains at least one clear 7YA identity cue.
- Existing content is reused before filler is invented.
- No unsupported reach totals, partnerships, academic authority, or privacy-sensitive material.
- No visual acceptance from E2E alone; both desktop and mobile evidence must be inspectable.
- Do not merge to `main` or declare final release acceptance until runtime and canonical source are reconciled.

---

### Task 1: Reconcile Runtime and Canonical Source

**Files:**
- Inspect runtime: `src/App.tsx`, `src/ConversionHome.tsx`, `src/conversion-home.css`, `src/PostPortraitWall.tsx`, `src/post-portrait-wall.css`
- Inspect canonical repository equivalents or source root discovered from repository tree.
- Create: `docs/visual/runtime-source-map.md`

**Interfaces:**
- Produces: a route/component/source map used by every later task.

- [ ] **Step 1: Inventory the AppDeploy runtime files and all public route entry points.**
- [ ] **Step 2: Inventory the canonical GitHub source tree and identify the actual production web root.**
- [ ] **Step 3: Compare runtime files against GitHub and classify each as canonical, runtime-only, or stale.**
- [ ] **Step 4: Write `docs/visual/runtime-source-map.md` listing route → component → style → media-source ownership.**
- [ ] **Step 5: Verify no implementation task below targets a path that does not exist in the reconciled source.**
- [ ] **Step 6: Commit the source map on the implementation branch.**

Acceptance: every public route has a known source owner; no visual work proceeds against an unidentified deployment lane.

### Task 2: Build the Global Visual Foundation

**Files:**
- Create or normalize shared tokens/style module in the reconciled frontend root.
- Modify global shell/navigation/footer files discovered in Task 1.
- Test: existing frontend tests plus a new visual-shell sanity case.

**Interfaces:**
- Produces shared typography, spacing, color, media cropping, section rhythm, button, focus, RTL/LTR, and responsive primitives.

- [ ] **Step 1: Add a failing shell test asserting shared navigation, footer, language-direction hook, and 7YA identity class are present on representative routes.**
- [ ] **Step 2: Run the test and confirm failure.**
- [ ] **Step 3: Implement shared tokens and shell styles without route-specific visual hacks.**
- [ ] **Step 4: Add intentional desktop and mobile spacing scales and media aspect-ratio utilities.**
- [ ] **Step 5: Add RTL/LTR typography and alignment rules for Hebrew, English, and Russian.**
- [ ] **Step 6: Run tests and capture shell screenshots on desktop/mobile.**
- [ ] **Step 7: Correct clipping, overflow, weak contrast, or generic-looking shell areas found in screenshots.**
- [ ] **Step 8: Commit.**

Acceptance: representative routes visibly belong to one product before route-specific redesign begins.

### Task 3: Homepage — Identity + Posts First

**Files:**
- Modify: reconciled homepage component, including current `ConversionHome` equivalent.
- Modify: homepage styles and media wall components.
- Reuse authentic media dataset already present in runtime/source.

**Interfaces:**
- Consumes: global visual foundation.
- Produces: flagship homepage visual grammar reused by biography/social.

- [ ] **Step 1: Add a failing test for hero → real-media surface → mission → StartOn/7YA → selected stories → social → talk → contact order.**
- [ ] **Step 2: Run and confirm failure.**
- [ ] **Step 3: Recompose hero so Igor identity is visually dominant without excessive copy.**
- [ ] **Step 4: Place authentic media immediately after hero using varied editorial geometry, not a uniform card grid.**
- [ ] **Step 5: Remove visually empty/redundant homepage sections and reuse existing Igor/7YA/StartOn content.**
- [ ] **Step 6: Create independent mobile composition: full-width lead media, reduced simultaneous choices, safe overlays.**
- [ ] **Step 7: Capture desktop/mobile screenshots through hero and `#posts-first`; inspect actual pixels.**
- [ ] **Step 8: Correct cropping, hierarchy, spacing, contrast, text density, and image failures.**
- [ ] **Step 9: Run tests and commit.**

Acceptance: a first-time visitor sees Igor and real proof before encountering dense explanatory content.

### Task 4: Igor Biography — Visual Narrative

**Files:**
- Modify route component for `/igor-vepretski/`.
- Create/refactor reusable story chapter and milestone components.

- [ ] **Step 1: Add failing tests for chaptered biography structure and authentic-media presence.**
- [ ] **Step 2: Implement visual chapters for origin, service/public work, digital creation, StartOn/7YA, and current mission using only sourced existing content.**
- [ ] **Step 3: Break long prose with images, timeline markers, media proof, pull quotes, and clear section transitions.**
- [ ] **Step 4: Create a distinct mobile narrative rhythm with fewer simultaneous elements.**
- [ ] **Step 5: Capture desktop/mobile full-page evidence and correct weak/legacy sections.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: the route reads visually as a life story, not as a long profile document.

### Task 5: Social — Living Media Wall

**Files:**
- Modify `/social/` route and social/media components.

- [ ] **Step 1: Add failing test requiring visual post/media content ahead of the platform directory.**
- [ ] **Step 2: Recompose selected authentic posts/stills into a living editorial wall.**
- [ ] **Step 3: Move platform-directory links into a secondary clear navigation layer.**
- [ ] **Step 4: Add image fallback behavior with no broken-image browser chrome.**
- [ ] **Step 5: Capture desktop/mobile screenshots and correct repetitive geometry or cramped mobile composition.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: `/social/` visually demonstrates the creator footprint rather than merely linking to it.

### Task 6: Talk — Digital Igor Flagship Entry

**Files:**
- Modify `/talk/` route, onboarding, privacy copy presentation, and conversation shell only where needed for visual experience.

- [ ] **Step 1: Add failing test for focused conversation entry, privacy cue, clear primary action, and distraction-free shell.**
- [ ] **Step 2: Remove generic chatbot visual treatment and build a distinctive 7YA conversational entrance.**
- [ ] **Step 3: Use strong typography, subtle identity media, and restrained motion; do not fabricate capabilities.**
- [ ] **Step 4: Optimize mobile one-handed interaction and keyboard-safe layout.**
- [ ] **Step 5: Capture onboarding + active-chat desktop/mobile screenshots and correct visual issues.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: the route feels like entering the flagship personal 7YA layer, not an embedded commodity chat widget.

### Task 7: StartOn — Mission Sub-brand

**Files:**
- Modify `/starton/` route and project/space modules.

- [ ] **Step 1: Add failing test for mission, space model, implementation model, real-world imagery, and sourced supporters/partners only.**
- [ ] **Step 2: Create a related-but-distinct StartOn visual rhythm inside the 7YA system.**
- [ ] **Step 3: Use authentic project imagery and diagrams/screens only where sourced; remove filler.**
- [ ] **Step 4: Build mobile composition around mission → spaces → opportunity → implementation → contact.**
- [ ] **Step 5: Capture desktop/mobile screenshots and correct density/cropping.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: StartOn feels like a credible real initiative with a tangible spatial/program model.

### Task 8: Evidence + Radar — Serious High-Signal Surfaces

**Files:**
- Modify `/evidence/` and `/radar/` route components/styles.
- Reuse source classification/data components.

- [ ] **Step 1: Add failing tests for readable hierarchy, filtering/status affordances, source visibility, and no decorative clutter.**
- [ ] **Step 2: Design Evidence around source, date, type, proof state, and readable detail expansion.**
- [ ] **Step 3: Design Radar around high-signal status/event cards, timeline/data density, and scanability.**
- [ ] **Step 4: Ensure mobile controls remain usable without horizontal overflow.**
- [ ] **Step 5: Capture desktop/mobile screenshots for dense states and correct legibility.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: both routes are information-dense but visually disciplined and recognizably 7YA.

### Task 9: Pass + Contact — Purposeful Conversion

**Files:**
- Modify `/pass/` and `/contact/` routes.

- [ ] **Step 1: Add failing test for intentional Pass gateway and segmented Contact paths.**
- [ ] **Step 2: Rebuild Pass as a premium identity/gateway surface rather than an administrative screen.**
- [ ] **Step 3: Rebuild Contact with visible paths for media, speaking, partnerships, StartOn, professional collaboration, and general contact using existing approved contact methods.**
- [ ] **Step 4: Optimize touch targets and reduce form friction on mobile.**
- [ ] **Step 5: Capture desktop/mobile screenshots and correct dead/empty states.**
- [ ] **Step 6: Run tests and commit.**

Acceptance: both routes communicate purpose immediately and end in a clear next action.

### Task 10: Long-tail Route Migration

**Files:**
- Modify every remaining public route identified in Task 1.
- Remove obsolete one-off styles only after replacement is verified.

- [ ] **Step 1: Create a route checklist from the source map.**
- [ ] **Step 2: For each route, apply shared typography, spacing, nav/footer, media behavior, identity cue, and responsive rules.**
- [ ] **Step 3: Replace generic/empty legacy sections with existing authentic content where available.**
- [ ] **Step 4: Capture desktop/mobile screenshots for each route before marking it migrated.**
- [ ] **Step 5: Remove superseded style rules only after screenshot parity confirms no regression.**
- [ ] **Step 6: Run all frontend tests and commit.**

Acceptance: no public route visibly looks like a legacy or unrelated template.

### Task 11: Site-wide Content and Claim Safety Audit

**Files:**
- Public copy/content datasets across migrated routes.

- [ ] **Step 1: Search public surfaces for aggregate reach claims, unsupported partnerships, unsourced academic authority, and privacy-sensitive data.**
- [ ] **Step 2: For each claim, map it to an existing source/evidence record or soften/remove it from the visual surface.**
- [ ] **Step 3: Verify images/screenshots do not expose private contact, financial, family, or account information.**
- [ ] **Step 4: Run tests and commit corrections.**

Acceptance: the stronger visual site does not amplify unsupported or sensitive claims.

### Task 12: Final Visual Acceptance + Source Reconciliation

**Files:**
- `docs/visual/final-acceptance.md`
- release marker/source files only after the visual build is accepted.

- [ ] **Step 1: Run a desktop and mobile sweep of `/`, `/igor-vepretski/`, `/talk/`, `/social/`, `/pass/`, `/evidence/`, `/starton/`, `/contact/`, `/radar/`, plus every long-tail public route.**
- [ ] **Step 2: Inspect screenshots for hierarchy, authenticity, density, typography, spacing, contrast, cropping, RTL/LTR, broken images, and cross-route identity.**
- [ ] **Step 3: Fix every visual blocker and generate fresh screenshots; never accept stale evidence.**
- [ ] **Step 4: Verify AppDeploy runtime source matches the implementation branch/canonical GitHub source.**
- [ ] **Step 5: Verify the approved release marker is identical in root, `release.json`, live health, AppDeploy, and both domains only after visual acceptance.**
- [ ] **Step 6: Record screenshot references and acceptance results in `docs/visual/final-acceptance.md`.**
- [ ] **Step 7: Run the complete test suite and final claim-safety sweep.**
- [ ] **Step 8: Commit the acceptance record; open a PR for owner/reviewer review. Do not auto-merge.**

Acceptance: every public surface has inspectable desktop/mobile evidence, the visual system is coherent site-wide, and canonical source matches runtime.
