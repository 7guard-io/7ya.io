# 7YA Personal Flagship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the currently applied AppDeploy runtime into a technically reliable, multilingual personal flagship for Igor Vepretski, then synchronize that production source back into GitHub with a truthful release contract.

**Architecture:** Treat AppDeploy v96 source as the execution baseline because GitHub `main` does not contain the live React runtime. Make small live changes through AppDeploy with QA after each release. After the runtime stabilizes, mirror the production source and release metadata into the dedicated GitHub branch and only then prepare canonical integration.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind/PostCSS, AppDeploy frontend+backend runtime, AppDeploy client SDK, GitHub.

## Global Constraints

- Homepage subject hierarchy: Igor → StartOn → public proof/media → Digital Igor → contact.
- Hebrew, English and Russian are first-class.
- No unsupported metrics, endorsements or partnership claims.
- Digital Igor must never impersonate the human Igor.
- Critical first-viewport visuals must not depend solely on third-party hosts.
- Mobile and desktop must both pass visual QA.
- Do not claim release completion unless AppDeploy is ready, runtime error arrays are empty and E2E counts are internally consistent.
- Preserve a known rollback version before each production mutation.

---

### Task 1: Establish the immutable production baseline

**Files:**
- Read: AppDeploy v96 source tree
- Create later in GitHub branch: `docs/releases/2026-08-13-appdeploy-v96-baseline.md`

**Interfaces:**
- Consumes: AppDeploy app `697a008fddc309b142`, version `1786620731646`.
- Produces: a baseline record used by all subsequent tasks.

- [ ] **Step 1: Capture current version and health**

Record:
```text
app_id=697a008fddc309b142
baseline_version=1786620731646
baseline_name=v96
```

- [ ] **Step 2: Verify current source paths**

Confirm at minimum:
```text
src/App.tsx
src/ConversionHome.tsx
src/StoryCompanion.tsx
src/conversion-home.css
public/release.json
package.json
```

- [ ] **Step 3: Verify current runtime status**

Expected:
```text
status=ready
frontend_errors=[]
backend_errors=[]
network_errors=[]
```

- [ ] **Step 4: Preserve rollback target**

Use v96 until a newer release has passed all required checks.

### Task 2: Simplify the homepage into a personal flagship

**Files:**
- Modify: `src/ConversionHome.tsx`
- Modify: `src/conversion-home.css`

**Interfaces:**
- Consumes: localized copy from `useLocale`, `deepMedia`, `PersonalGrowthGateway` only where it directly supports the homepage CTA.
- Produces: six-module homepage: hero, selected moments, StartOn, proof, Digital Igor, contact.

- [ ] **Step 1: Define the visible module order**

The rendered order must be:
```tsx
<PersonalHero />
<SelectedMoments />
<StartOnMission />
<PersonalProof />
<DigitalIgorGateway />
<ContactGateway />
```

Implementation may remain in one file initially, but no additional homepage sections may render between these modules.

- [ ] **Step 2: Remove homepage-only duplication**

Do not render these existing homepage blocks on the default home route:
```text
PersonalGrowthGateway as a full standalone section
EditorialEnrichment
full home media rail
full visual archive mosaic
PostPortraitWall
duplicate watch grid
three-card story grid
```

Retain their content on depth routes when already available.

- [ ] **Step 3: Keep a single primary hero action**

Use localized CTA semantics:
```text
HE: "דבר עם Digital Igor"
EN: "Talk with Digital Igor"
RU: "Поговорить с Digital Igor"
```

Secondary action:
```text
HE: "להכיר את איגור"
EN: "Meet Igor"
RU: "Познакомиться с Игорем"
```

- [ ] **Step 4: Curate six selected public moments**

Use only source-linked records already present in `deep-media-data.ts`, prioritizing:
```text
early-2011
starton-14
father-hidabroot
fraud-13
nova-long
instagram-story-20260801
```

Each card must show source, year/date, localized context and source link.

- [ ] **Step 5: Implement responsive composition**

Desktop: hero split 55/45 with media stage.
Mobile: portrait first after identity copy, one-column modules, horizontal selected-moment rail permitted.

- [ ] **Step 6: Verify no homepage element depends on hover to reveal essential information**

Keyboard and touch must expose all CTAs.

### Task 3: Harden public media and multilingual presentation

**Files:**
- Modify: `src/ConversionHome.tsx`
- Modify: `src/deep-media-data.ts` only for metadata corrections or local asset references
- Modify: `src/conversion-home.css`
- Use existing: `public/resources/*`

**Interfaces:**
- Consumes: existing public source records and first-party resources.
- Produces: resilient selected media with deterministic fallbacks.

- [ ] **Step 1: Keep first viewport on first-party assets**

Hero image must resolve from:
```text
/resources/igor-hero.jpg
```

- [ ] **Step 2: Add deterministic fallback behavior for selected moments**

For every selected card:
```tsx
<img onError={event => { event.currentTarget.src = rootHref('resources/igor-hero.jpg'); }} />
```

- [ ] **Step 3: Localize supporting copy**

Every homepage heading, explanatory sentence and CTA must come from the HE/EN/RU copy object; public source names and titles may remain source-accurate.

- [ ] **Step 4: Prevent third-party embeds above the fold**

No iframe is allowed in the first viewport. Video playback remains click-to-open or on the media depth page.

### Task 4: Make Digital Igor useful without impersonation

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify companion stylesheet already imported by the component

**Interfaces:**
- Consumes: current `/api/companion` endpoint and saved journey state.
- Produces: disclosed personal-growth companion with stable fallback behavior.

- [ ] **Step 1: Change identity disclosure**

The visible subtitle must explicitly communicate the equivalent of:
```text
AI companion based on Igor Vepretski's public work and 7YA principles — not Igor himself.
```
Localized in HE/EN/RU.

- [ ] **Step 2: Preserve direct human routes**

The details panel must retain a distinct contact/speaker/media route to the real Igor.

- [ ] **Step 3: Preserve cancellation and local fallback**

Abort must restore the user's draft. API failure must return a local fallback without deleting the current conversation state.

- [ ] **Step 4: Verify mobile viewport handling**

Opening the dialog must use `visualViewport` height, lock background scrolling and restore it on close.

### Task 5: Truthful release metadata and QA gate

**Files:**
- Modify: `src/App.tsx`
- Modify: `public/release.json`
- Modify: `public/static-health.json` if present and inconsistent

**Interfaces:**
- Consumes: applied AppDeploy version after Tasks 2–4.
- Produces: release metadata matching the actual build.

- [ ] **Step 1: Set a unique build identifier**

Use:
```text
7ya-personal-flagship-20260813-1
```

- [ ] **Step 2: Align health response**

Expected JSON fields:
```json
{
  "status": "ok",
  "service": "7ya-independent",
  "provider": "appdeploy",
  "release": "7ya-personal-flagship-20260813-1",
  "build": "7ya-personal-flagship-20260813-1"
}
```

- [ ] **Step 3: Deploy and poll until terminal**

Do not stop at `deployed_and_testing`; wait for `ready` or terminal failure.

- [ ] **Step 4: Validate runtime arrays**

Expected:
```text
frontend_errors=0
backend_errors=0
network_errors=0
```

- [ ] **Step 5: Validate E2E consistency**

Completion requires:
```text
e2e.status=passed
passed_jobs == total_jobs
running_jobs == 0
```

If the provider reports `passed` with a smaller `passed_jobs`, record the discrepancy and do not claim technical completion.

- [ ] **Step 6: Inspect mobile and web QA screenshots**

Reject the release for clipped hero content, unreadable RTL/LTR, obstructed CTA, horizontal overflow, broken image, or modal viewport defect.

### Task 6: Synchronize the production source to GitHub

**Files:**
- Create/update on branch `agent/7ya-personal-flagship-v1-20260813`: production files from the applied AppDeploy snapshot.
- Create: `docs/releases/2026-08-13-personal-flagship-release.md`

**Interfaces:**
- Consumes: exact source snapshot from the final verified AppDeploy version.
- Produces: reviewable GitHub representation of the production runtime.

- [ ] **Step 1: Export the final AppDeploy source tree**

Capture all source-controlled text files required to rebuild the runtime, including:
```text
src/**
backend/**
shared/**
public/** excluding generated/binary resources already identical
package.json
index.html
postcss.config.js
```

- [ ] **Step 2: Create/update files on the dedicated GitHub branch**

No production source write is made directly to `main`.

- [ ] **Step 3: Add release receipt**

Record:
```text
AppDeploy app id
applied version
build identifier
QA timestamp
E2E total/passed
frontend/backend/network error counts
rollback version
source branch
```

- [ ] **Step 4: Compare GitHub branch contents to the applied AppDeploy snapshot**

Any mismatch in runtime-critical files blocks merge.

- [ ] **Step 5: Only after parity, prepare branch for review/integration**

Do not call GitHub canonical until this parity check is complete.