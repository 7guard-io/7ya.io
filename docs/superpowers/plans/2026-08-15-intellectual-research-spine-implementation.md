# 7YA Intellectual Research Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 7YA present Igor Vepretski first as an independent interdisciplinary researcher, creator and public-systems builder, with a native research map that connects lived experience, questions, frameworks, evidence, field application and open questions across the homepage and depth routes.

**Architecture:** Add one shared research data contract and two renderers: a compact homepage Research Spine and a full native Research Page. Route `/research/` and `?page=research` through the existing React shell, add Research to global navigation and SEO, then connect StartOn and 7YA back to the relevant research questions without claiming institutional affiliation or peer review. Preserve the existing visual system and source-first evidence rules.

**Tech Stack:** React 19, TypeScript, Vite, existing 7YA CSS system, lucide-react, AppDeploy runtime, GitHub canonical source-control.

## Global Constraints

- Canonical descriptor: `Independent Interdisciplinary Researcher · Creator · Public Systems Builder` / `חוקר רב־תחומי עצמאי · יוצר · בונה מערכות ציבוריות`.
- Core chain: `EXPERIENCE → OBSERVATION → QUESTION → FRAMEWORK → EVIDENCE → APPLICATION → OPEN QUESTIONS`.
- Research must appear before StartOn and before the platform/action layer in the homepage depth sequence.
- Biography may explain the origin of a question but must never be presented as proof of a theory.
- Do not imply university appointment, professorship, institutional affiliation, journal publication or peer review without direct evidence.
- Keep HE/EN/RU, crawlability, mobile usability, source links, claim-safety and existing rollback paths.
- Reuse the current near-black / warm-white / selective acid-green visual grammar; no generic academic stock imagery, fake journal chrome, gradients or SaaS card soup.
- Do not remove or weaken existing Content Core, Live Social, Media, Music, Evidence, StartOn or Creator Path capabilities.

---

## Capability Map

- Covers: Igor-first intellectual hero and claim-safe descriptor.
- Covers: native Research route and research-domain discovery.
- Covers: structured Research Objects with status, question, thesis, application and open questions.
- Covers: Research Spine inserted before StartOn on the homepage.
- Covers: Research navigation and HE/EN/RU SEO metadata.
- Covers: StartOn explicitly framed as field application / empirical environment, not proof.
- Covers: 7YA explicitly framed as a systems response around public memory, provenance, evidence and agency.
- Covers: desktop/mobile visual integrity and no regression to Content Core, Social, Media, Music, Evidence or Create.

---

### Task 1: Acceptance Tests First

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: existing public routes and global navigation.
- Produces: failing user-visible acceptance expectations for Tasks 2–6.

- [ ] **Step 1: Update the homepage sanity test before production code**

Change Test 1 so the hero must visibly contain the multilingual equivalent of `Independent Interdisciplinary Researcher · Creator · Public Systems Builder`, and so a visible Research Spine appears before StartOn with the chain `EXPERIENCE → OBSERVATION → QUESTION → FRAMEWORK → EVIDENCE → APPLICATION → OPEN QUESTIONS`.

- [ ] **Step 2: Update the global-navigation test before production code**

Change the navigation expectation so `מחקר / Research / Исследования` is directly discoverable and opens the native 7YA Research route rather than an external-only profile.

- [ ] **Step 3: Add a research-object acceptance test before production code**

The test must open `/research/?lang=he`, verify at least these named research anchors are visible: `The Resonant Self`, `SUPERNOAH`, `Strategic Sedation`, `Gastrocratia`, and `Opportunity / Adversity`; verify publication-status labels are visible; open one object and verify Research Question, Core Proposition, Evidence / Method, Application and Open Questions are visible.

- [ ] **Step 4: Verify RED**

Deploy the test-only change against the unchanged runtime. Expected: research expectations fail because the hero still says `אדם · אבא · יוצר · מייסד StartOn`, there is no native React Research route, and Research does not precede StartOn.

- [ ] **Step 5: Commit the test contract on the feature branch**

Commit message: `test: require native intellectual research spine`.

---

### Task 2: Shared Research Data Contract

**Files:**
- Create: `src/research-data.ts`

**Interfaces:**
- Produces: `ResearchDomain`, `ResearchObject`, `researchDomains`, `researchObjects`, and `researchCopy` for HE/EN/RU.
- Consumes: no runtime API; source status is static and claim-safe.

- [ ] **Step 1: Define focused types**

Create explicit TypeScript types for domain id, title, question family, work id, title, status, thesis, evidence basis, application, open questions and source URL.

- [ ] **Step 2: Add six domains from the approved spec**

Use: Digital Identity & Algorithmic Mediation; Information Resilience & Human Agency; Governance, Incentives & Threat Perception; Political Economy of Dependency; Opportunity, Adversity & Development; Public Memory, Evidence & Digital Governance.

- [ ] **Step 3: Add claim-safe anchor objects**

Represent `The Resonant Self`, `SUPERNOAH`, `Strategic Sedation`, `Gastrocratia`, `Opportunity / Adversity`, and `7YA / Evidence Governance`. Use conservative status labels such as `CONCEPTUAL PAPER`, `MONOGRAPH / PREPRINT`, `RESEARCH PROGRAM`, or `SYSTEM / DESIGN` only where already supported by the public corpus; never synthesize peer-review or institutional status.

- [ ] **Step 4: Keep source and application boundaries explicit**

Each object must separate `evidenceBasis` from `application`, and every application statement must use design/pilot/system language unless an outcome is independently supported.

---

### Task 3: Native Research Page

**Files:**
- Create: `src/ResearchPage.tsx`
- Create: `src/research-page.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `researchDomains`, `researchObjects`, `researchCopy`.
- Produces: view key `research`, native route `/research/` and query route `?page=research`.

- [ ] **Step 1: Build the Research hero**

Render Igor's claim-safe descriptor, the core framing sentence `Life is the laboratory...`, and the seven-step Research Spine as a typographic sequence rather than cards.

- [ ] **Step 2: Render domains as an intellectual map**

Each domain shows its question family and linked anchor works. Maintain large editorial typography, thin rules, square geometry and deliberate negative space.

- [ ] **Step 3: Render structured Research Objects**

Each object visibly exposes: status, research question, core proposition, evidence/method basis, field/system application, source, and open questions. Do not flatten these into promotional blurbs.

- [ ] **Step 4: Add App routing and multilingual SEO**

Extend `View` with `research`; route `page=research` and `/research`; add HE/EN/RU title, description and canonical entries; render `<ResearchPage/>` through the existing global shell.

- [ ] **Step 5: Verify GREEN for the native research-route test**

Expected: `/research/?lang=he` loads, named anchors and required object fields are visible, and no unsupported academic credential appears.

---

### Task 4: Homepage Intellectual Reframing

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/igor-living-record.css`

**Interfaces:**
- Consumes: shared research data.
- Produces: updated hero descriptor; Research Spine before StartOn; Research replaces the old low-weight Ideas room.

- [ ] **Step 1: Replace the hero role string**

HE: `חוקר רב־תחומי עצמאי · יוצר · בונה מערכות ציבוריות`.
EN: `Independent interdisciplinary researcher · creator · public-systems builder`.
RU: `Независимый междисциплинарный исследователь · автор · создатель общественных систем`.

- [ ] **Step 2: Replace the hero intro with the approved intellectual framing**

The first paragraph must explain that lived experience generates questions, research gives those questions structure, and systems attempt to translate understanding into action.

- [ ] **Step 3: Reorder the seven-room depth sequence**

Use: 01 Origin, 02 Service, 03 Signal, 04 Culture, 05 Research, 06 StartOn, 07 Build. Remove Research from being merely a Content Core lane or old `Ideas` afterthought; keep Content Core Research access but make it point to the native Research route.

- [ ] **Step 4: Add a compact Research Spine section before StartOn**

Show the seven-step chain and 4–6 anchor Research Objects with visible status and question, plus a CTA to the full Research map. Keep it visually editorial and readable on 375px width.

- [ ] **Step 5: Reframe StartOn as field application**

Add a visible `FIELD APPLICATION` bridge and language that StartOn can test questions about opportunity density, belonging, adult support, tools and creative agency; explicitly state that the initiative is not automatic proof of the hypotheses.

- [ ] **Step 6: Reframe 7YA / Build as systems application**

Connect the final system/action chapter to public-memory, provenance, evidence-status and agency research questions rather than presenting 7YA as an unrelated product layer.

- [ ] **Step 7: Verify GREEN for homepage desktop/mobile tests**

Expected: descriptor and Research Spine are visible; Research precedes StartOn; no overflow; existing Content Core, Live Social, Signal, Music and StartOn source objects remain reachable.

---

### Task 5: Global Navigation and Cross-Route Coherence

**Files:**
- Modify: `src/GlobalNav.tsx`
- Modify: `src/MuseumPage.tsx`
- Modify: `public/starton/index.html` only if the current applied snapshot contains a static StartOn surface that bypasses the React shell.

**Interfaces:**
- Consumes: native Research route.
- Produces: direct Research discovery from global navigation and internal Research links from depth surfaces.

- [ ] **Step 1: Add Research to desktop navigation**

Add a BookOpen/Library-style item labelled `מחקר / Research / Исследования` and mark it active for the research view. Keep the mobile dock focused; Research must remain reachable through the menu without crowding the dock.

- [ ] **Step 2: Replace external-only research handoffs where appropriate**

Museum Research CTA must point first to the native 7YA Research map; Academia.edu remains a source link inside Research Objects, not the site's only scholarly destination.

- [ ] **Step 3: Add StartOn research bridge if needed**

If the public `/starton/` route is static, add one concise section linking the field model to opportunity/belonging research and the native Research route while preserving its existing mission copy and source status.

- [ ] **Step 4: Verify navigation GREEN**

Expected: Research is discoverable from global navigation in HE/EN/RU, `/research/` remains inside 7YA visual grammar, and existing public rooms still load.

---

### Task 6: Release, Source-Control Sync, and Verification

**Files:**
- Modify: `tests/tests.txt` only if QA reveals a brittle expectation rather than a product defect.
- Sync changed runtime source files into `feat/intellectual-research-spine-20260815` after AppDeploy reaches terminal ready.
- Add: focused release receipt under `docs/releases/` if the existing release process requires one.

**Interfaces:**
- Produces: tested AppDeploy release plus GitHub review branch containing the exact changed source files.

- [ ] **Step 1: Run AppDeploy validation and E2E**

Deploy only changed files. Poll until `ready` or `failed`; if failed, inspect E2E details and runtime errors before changing code.

- [ ] **Step 2: Perform visual QA**

Review AppDeploy desktop and mobile QA snapshots for hero hierarchy, Research Spine order, status readability, section rhythm, portrait crop, no overflow and no generic academic/SaaS styling.

- [ ] **Step 3: Run regression checks**

Confirm Content Core, Live Social, Media, Music, Evidence, StartOn, Blog, Speaker and Create remain available and no frontend/backend/network errors are present.

- [ ] **Step 4: Sync exact changed source to GitHub feature branch**

Fetch the applied AppDeploy files after successful deployment and update the same paths in `feat/intellectual-research-spine-20260815`; do not copy unrelated runtime drift.

- [ ] **Step 5: Open a focused PR**

PR must state scope, claim-safety boundaries, QA result, AppDeploy version/build marker, rollback version and any residual source-control provenance gap.

- [ ] **Step 6: Final verification before completion claim**

Do not say `done`, `live`, `fixed` or `all gaps closed` until AppDeploy reports `ready`, QA/E2E is terminal and clean, runtime errors are empty, and the GitHub feature branch contains the changed source set.
