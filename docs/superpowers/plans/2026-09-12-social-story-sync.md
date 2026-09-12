# 7YA Social Story Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 7ya.io continuously use authentic public social media across Igor Vepretski’s platforms as structured autobiographical story material instead of showing a tiny hand-picked subset.

**Architecture:** Keep the current AppDeploy canonical/social/discovery stack, but change selection and projection policy. Expand the existing visual registry into a chapter-aware, platform-aware public media stream; keep Canon authoritative, Discovery non-canonical, and API/OAuth restrictions explicit. Home uses diversified editorial selection; Media/Archive uses progressive full-corpus disclosure.

**Tech Stack:** React + TypeScript + AppDeploy SDK/client + existing canonical corpus + social-feed + visual-registry + public-projection APIs.

**Spec:** `docs/superpowers/specs/2026-09-12-social-story-sync-design.md`

## Global Constraints
- Authentic public media first; no generic AI imagery when real source media exists.
- No private-source auto-publication.
- Metrics remain source-local and dated.
- Blocked crawlers must not be interpreted as absent content.
- Preserve single-writer production discipline against the currently applied AppDeploy snapshot.
- Verify canonical `https://7ya.io/` after deployment on mobile and desktop.

---

### Task 1: Lock the active production baseline

**Files:**
- Read only: active AppDeploy snapshot source

**Interfaces:**
- Consumes: AppDeploy active version.
- Produces: exact baseline version and current behavior inventory.

- [ ] **Step 1: Read the active `NativePersonalMedia.tsx` and backend social/visual code.**
- [ ] **Step 2: Confirm the hard truncation behavior is still present.**
- [ ] **Step 3: Record current QA/error state before changing production.**

### Task 2: Add selection behavior tests first

**Files:**
- Create/modify: existing project test contract under `tests/` or `tests/tests.txt` according to AppDeploy project conventions.
- Modify later: `src/NativePersonalMedia.tsx`.

**Interfaces:**
- Consumes: `VisualRegistryItem[]`.
- Produces: deterministic selection behavior that preserves chapter/platform diversity and allows more than one asset per chapter.

- [ ] **Step 1: Add a failing test/acceptance contract asserting that a registry containing multiple assets per chapter does not collapse to one-per-chapter and is not hard-limited to 5/7.**
- [ ] **Step 2: Run the test/validation and confirm the baseline fails for the intended reason.**
- [ ] **Step 3: Extract a minimal `selectStoryVisuals(rows, mode)` helper or equivalent behavior in `NativePersonalMedia.tsx`.**
- [ ] **Step 4: Make Home choose a diverse but richer set across chapters/platforms; make Media expose a substantially larger set with progressive expansion.**
- [ ] **Step 5: Re-run tests/validation and confirm green.**

### Task 3: Strengthen story classification in the visual registry

**Files:**
- Modify: `backend/index.ts` visual registry/social projection section.

**Interfaces:**
- Consumes: canonical corpus events, live social feed items, Meta owner-authorized projection records, public Discovery records.
- Produces: `VisualRecord[]` with `chapter`, `platform/source`, `year`, `canonicalId`, `sourceUrl`, `imageUrl`, `origin`, `verification`.

- [ ] **Step 1: Add a failing validation/contract for chapter classification of representative social titles: service/police, StartOn/youth, fatherhood, civic/politics, music/creation, research/7YA, current-life fallback.**
- [ ] **Step 2: Confirm it fails under the existing title classifier.**
- [ ] **Step 3: Replace the narrow music/2026-only live classifier with a deterministic story classifier using title/account/platform/year plus existing canonical signals.**
- [ ] **Step 4: Preserve unclassified assets as `live/archive` instead of dropping them.**
- [ ] **Step 5: Re-run validation and confirm expected chapter mapping.**

### Task 4: Feed public Discovery visuals into the registry without promoting them to Canon

**Files:**
- Modify: `backend/index.ts` visual registry builder.

**Interfaces:**
- Consumes: `buildDiscoveryLibrary()` public-only records.
- Produces: `VisualRecord` entries with `origin: public-source` or a distinct discovery-safe origin and explicit non-canonical verification.

- [ ] **Step 1: Add a failing contract showing a public Discovery record with a resolvable visual can appear in the registry while retaining Discovery status.**
- [ ] **Step 2: Confirm baseline does not include it.**
- [ ] **Step 3: Merge deduplicated Discovery visuals after live/owner-approved/canonical media and before fallback drive seeds.**
- [ ] **Step 4: Do not convert Discovery verification into verified Canon.**
- [ ] **Step 5: Re-run validation and confirm source URL, year, platform and non-canonical trust survive projection.**

### Task 5: Make the UI tell story, not dump cards

**Files:**
- Modify: `src/NativePersonalMedia.tsx`.
- Modify if needed: `src/native-personal-media.css`.

**Interfaces:**
- Consumes: richer visual registry.
- Produces: Home chapter-diverse story strip and Media progressive visual corpus.

- [ ] **Step 1: Add visible platform/year/chapter context to each asset.**
- [ ] **Step 2: Home: render a materially richer editorial sequence without an infinite wall.**
- [ ] **Step 3: Media: render an initial larger batch and a user-controlled “show more/show all” progressive expansion.**
- [ ] **Step 4: Keep every asset linked to the original source.**
- [ ] **Step 5: Keep image failures from replacing unrelated chapters with the same generic fallback wherever a valid source preview exists.**

### Task 6: Deploy from the active AppDeploy snapshot and verify live production

**Files:**
- AppDeploy update only against the currently applied snapshot.

**Interfaces:**
- Produces: new AppDeploy version and canonical live result.

- [ ] **Step 1: Call AppDeploy deploy instructions before code generation/write.**
- [ ] **Step 2: Apply only targeted diffs to the exact active source files.**
- [ ] **Step 3: Wait for terminal deployment state.**
- [ ] **Step 4: Verify frontend/backend/network errors are zero or explain any unrelated pre-existing failures.**
- [ ] **Step 5: Run live visual acceptance for Home and Media on mobile and desktop.**
- [ ] **Step 6: Verify `https://7ya.io/` serves the new release and that the active AppDeploy snapshot did not change underneath the work.**
- [ ] **Step 7: Report exact platform coverage: live API/feed, public Discovery/search, OAuth-required/restricted-read, and what remains blocked by external permissions.**
