# Igor AI + Story Plane Implementation Plan

> **Required execution discipline:** implement test-first, preserve current production, and do not deploy the primary AppDeploy app unless the owner gives the explicit production-chain command.

**Goal:** Make the canonical corpus the single factual source for the public life story and Digital Igor, separate public Story Plane from internal Control Plane, and add executable quality gates that inspect the current candidate build.

**Architecture:** Preserve the current AppDeploy React/Vite + backend architecture. Reconcile the current live snapshot into Git history before broad source changes. Add typed canon projections, provenance-aware agent responses, a disclosed first-person Digital Igor contract, and executable tests. Public UI remains media-first; diagnostics remain available but outside the default story journey.

**Current live baseline:** AppDeploy app `697a008fddc309b142`, observed snapshot `1787467519973`, runtime ready, no current frontend/backend/network errors, no E2E job found for the applied version.

---

## Task 1 — Reconcile the current live source without touching production

**Files:**
- Create: `ops/source-alignment/2026-08-23-live-baseline.md`
- Create: `ops/source-alignment/appdeploy-1787467519973.manifest.json`
- Future export target: `appdeploy-live/1787467519973/**`
- Compare against: GitHub `main`

**Step 1: Record the failing invariant**

Document that GitHub root is not currently byte/source-equivalent to AppDeploy snapshot `1787467519973` and that production release metadata reports source alignment pending GitHub export.

**Step 2: Inventory current AppDeploy source**

Capture file paths, version, release marker, app ID and domains. Do not copy secrets or database contents.

**Step 3: Reconstruct/export candidate snapshot into the feature branch**

Copy only source/config/test files necessary to reproduce the live build. Preserve the current AppDeploy source unmodified.

**Step 4: Compare with GitHub root**

Generate a deterministic changed/missing/extra file report. Classify unrelated legacy/course material separately rather than deleting it in the same change.

**Step 5: Establish mapping**

Record `AppDeploy version → Git commit` once the snapshot is reproducible.

**Verification:** No write to primary AppDeploy app; branch contains the source-alignment manifest and a reproducible source baseline.

---

## Task 2 — Add a real test harness before production-code refactors

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/canonical-projections.test.ts`
- Create: `tests/unit/digital-igor-policy.test.ts`
- Create: `tests/e2e/home-story.spec.ts`
- Create: `tests/e2e/digital-igor.spec.ts`
- Keep: `tests/tests.txt` as human-readable acceptance scenarios

**Step 1: Write failing smoke tests**

Tests must initially demonstrate missing executable coverage:

- homepage renders the primary life story;
- no primary Story Plane copy contains operator/control labels;
- Digital Igor disclosure is visible;
- mobile page has no horizontal overflow;
- story projection exposes canonical IDs and source status.

**Step 2: Install/configure test tooling**

Add `test`, `test:unit`, `test:e2e`, and a consolidated local CI script. Do not count `tests/tests.txt` as execution.

**Step 3: Run and preserve RED evidence**

Record the expected initial failures before implementing behavior changes.

**Step 4: Add only the minimum test infrastructure needed**

Avoid unrelated framework migration.

**Verification:** test runner actually executes and reports test counts; no false PASS based on documentation files.

---

## Task 3 — Create canon-driven story projection helpers

**Files:**
- Create: `shared/story-projections.ts`
- Test: `tests/unit/canonical-projections.test.ts`
- Modify later: `src/life-first/LifeFirstHero.tsx`
- Modify later: chronology/moments components as applicable

**Step 1: Write failing projection tests**

Cover:

- service era derives from canonical service records;
- exact dates retain precision metadata;
- unresolved/quarantined metrics never project as verified;
- localized title/summary selection;
- media carries canonical/source/authenticity metadata;
- projection order follows canonical story order, not component-local arrays.

**Step 2: Implement typed projection functions**

Start with:

- `projectHeroFrames`
- `projectLifeTimeline`
- `projectStoryMoments`

Return display data plus canonical provenance.

**Step 3: Refactor hero to consume projections**

Keep layout/focus/crop choices local, but remove duplicated factual date/role definitions where canon owns them.

**Verification:** unit tests green; hero still renders real media and first-person narrative.

---

## Task 4 — Implement Digital Igor policy as data, not prompt folklore

**Files:**
- Create: `shared/digital-igor-policy.ts`
- Test: `tests/unit/digital-igor-policy.test.ts`
- Modify: `backend/index.ts`
- Modify: `src/StoryCompanion.tsx`

**Step 1: Write failing policy tests**

Cases:

1. verified public biography → first-person allowed;
2. owner-reported metric → first-person allowed only with dated/source qualification;
3. unresolved/quarantined claim → no assertive first-person claim;
4. private memory not in canon → prohibited;
5. sensitive/private material → neutral/minimized response path;
6. agent must remain disclosed as AI representation.

**Step 2: Add typed policy evaluator**

The evaluator should accept canonical truth/provenance and return an allowed voice mode plus required qualification.

**Step 3: Replace current blanket “do not impersonate” copy with the approved contract**

Visitor-facing disclosure:

`הגרסה הדיגיטלית שלי — AI שנבנה מהקאנון הציבורי והמאומת שלי.`

Equivalent EN/RU copy required.

The system prompt must still state that the system is an AI representation and cannot claim to be the live human.

**Step 4: Change brand/UI label**

Prefer `IGOR / 7YA AI` and `לדבר עם איגור` / localized equivalents. Keep a compact disclosure in the panel.

**Verification:** policy tests green; UI no longer says merely “not Igor himself,” yet disclosure remains unambiguous.

---

## Task 5 — Make Digital Igor canon-first

**Files:**
- Modify: `backend/index.ts`
- Modify: `shared/content-graph.ts` only if response metadata requires it
- Test: `tests/unit/digital-igor-policy.test.ts`
- Test: `tests/e2e/digital-igor.spec.ts`

**Step 1: Write failing retrieval/provenance tests**

For a biography query, prove the answer path retrieves canonical records before final response. For numeric questions, require snapshot/source metadata.

**Step 2: Add response provenance structure**

Extend agent reply with a bounded public structure such as:

```ts
provenance: {
  canonicalIds: string[];
  truth: 'VERIFIED' | 'STRONGLY_INFERRED' | 'REQUIRES_CONFIRMATION';
  sources: { id: string; label: string; url: string }[];
  metricSnapshots?: { metricType: string; snapshotDate: string }[];
}
```

**Step 3: Phase out duplicate static truth**

Where canon already owns biography, service dates, public metrics, people or projects, generate the chat context from canonical retrieval rather than parallel constants.

Keep action routing/contact configuration separate because it is operational UI configuration, not biography truth.

**Step 4: Preserve provider fallbacks**

AppDeploy tool agent → NVIDIA → deterministic fallback may remain, but all providers receive the same public canon-derived context and policy boundary.

**Verification:** chat produces source-grounded answers and never upgrades low-confidence material by wording alone.

---

## Task 6 — Add site-navigation actions to Digital Igor

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify/create: story navigation helper/event bus
- Modify relevant chapter components to expose stable canonical targets
- Test: `tests/e2e/digital-igor.spec.ts`

**Step 1: Write failing E2E test**

A visitor asks for StartOn or a year/event; the assistant response exposes an internal navigation action; activating it focuses the matching story chapter/event without a page reload.

**Step 2: Add safe action types**

Examples:

- `focus_event`
- `focus_chapter`
- `open_source`
- `open_media`
- `filter_year`
- `open_evidence`

No arbitrary script/action payloads.

**Step 3: Implement UI event bridge**

The chat becomes a natural-language controller of the life archive rather than a detached text box.

**Verification:** E2E proves chat-to-story navigation and browser back/URL state remain coherent.

---

## Task 7 — Separate Story Plane from Control Plane

**Files:**
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify affected child components/copy
- Preserve: diagnostics/control routes
- Test: `tests/e2e/home-story.spec.ts`

**Step 1: Write failing leakage test**

Primary homepage must not visibly contain operator phrases such as:

- `OAUTH NEXT`
- `METADATA RECOVERY`
- `PROVENANCE RULE`
- ingestion/control-plane labels

unless the user explicitly opens diagnostics/evidence detail.

**Step 2: Group the story editorially**

Keep the underlying capabilities but reduce the sense of one top-level module per subsystem. Use human chapters and transitions.

**Step 3: Preserve deep evidence paths**

Evidence is never deleted merely to simplify the homepage; it moves behind progressive disclosure or Archive/Verify interactions.

**Verification:** Stranger test can identify Igor, key life arc and next action without understanding 7YA internals.

---

## Task 8 — Fix Visual QA to audit the candidate build

**Files:**
- Modify: backend visual-QA endpoint in `backend/index.ts`
- Modify: `src/VisualInspector.tsx` only where necessary
- Create: automated visual gate test/scripts

**Step 1: Write failing test for stale-screenshot behavior**

The visual QA endpoint must reject or avoid a screenshot reference that does not correspond to the current candidate/release.

**Step 2: Remove hard-coded historical screenshot version**

Pass current candidate screenshot URL/version through release/QA metadata or an explicit bounded request generated by the deployment QA stage.

**Step 3: Promote current DOM checks into executable E2E assertions**

At minimum:

- overflow;
- broken images;
- fixed-layer occlusion;
- documentary generic fallbacks;
- repeated imagery inside one documentary surface;
- required story media/action presence.

**Step 4: Run AI visual judge only after candidate screenshot identity is verified**

AI analysis supplements deterministic checks; it does not replace them.

**Verification:** report contains candidate version and viewport; stale-build audit cannot silently PASS.

---

## Task 9 — Add media-diversity and evidence gates

**Files:**
- Create: `shared/media-policy.ts`
- Test: unit/e2e media policy tests
- Modify: visual/story projection selection

**Step 1: Write failing duplicate tests**

Same canonical image URL/canonicalized derivative must not appear repeatedly in the main story when approved alternatives exist.

**Step 2: Implement first-stage dedup**

Use canonical URL + event/media identity. Add perceptual hash later when image bytes are available to the pipeline.

**Step 3: Add metric/publication gating**

Projection must suppress or qualify `requires-confirmation`, unresolved, contradicted and quarantined material.

**Verification:** no forbidden aggregate metric or repetitive visual can enter the main story projection accidentally.

---

## Task 10 — Validate multilingual public semantics

**Files:**
- Modify localized Digital Igor and Story Plane copy
- Test: route/meta/chat localization tests

**Step 1: Test HE/EN/RU primary experience**

Ensure localized disclosure, first-person narrative, source labels and action labels are semantically equivalent.

**Step 2: Keep Spanish route isolated until its canon/chat parity is implemented**

Do not falsely advertise Digital Igor language parity if the chat backend supports only HE/EN/RU.

**Verification:** language metadata and UI behavior match actual capabilities.

---

## Task 11 — Candidate QA and regression gate

**Files:**
- Update: `tests/tests.txt`
- Create: release candidate QA receipt under `ops/qa/`

Run fresh candidate checks:

1. unit tests;
2. production build;
3. E2E desktop;
4. E2E mobile;
5. visual deterministic audit;
6. AI visual judge against current-version screenshots;
7. content/evidence gate;
8. control-plane leakage search;
9. source alignment check;
10. regression comparison against accepted production baseline.

Do not call the candidate complete if any required check was not actually run.

---

## Task 12 — Production handoff

Production is a separate gate from implementation.

Before production:

- local/candidate CI green;
- exact Git commit identified;
- current candidate screenshot QA green;
- rollback target recorded;
- AppDeploy version/commit mapping ready.

Only after explicit owner production authorization should the release chain update the primary AppDeploy app. After deployment, verify `7ya.io` and `www.7ya.io`, runtime errors, network errors, current screenshots and key Digital Igor flows.
