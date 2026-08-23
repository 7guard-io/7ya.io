# Igor-Branded Life Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing 100 Moments viewer into an unmistakably Igor Vepretski / #7YA visual atlas that exposes the full filtered archive at once without changing evidence semantics.

**Architecture:** Preserve the existing `HundredMoments` data loading, dedupe, filtering and selected-stage behavior. Add one branded masthead line and a derived contact-sheet renderer from `visibleMoments`; each tile reuses the same `Moment` object and only changes `active`. CSS supplies the desktop/mobile atlas layout and branded visual hierarchy.

**Tech Stack:** React 19, TypeScript, CSS, AppDeploy React/Vite runtime.

**Spec:** `docs/superpowers/specs/2026-08-24-igor-branded-life-atlas-design.md`

## Global Constraints
- Public brand is Igor Vepretski × #7YA🥷 × StartOn; NVIDIA remains invisible infrastructure.
- Preserve Canon / Archive / Discovery / Live boundaries and existing source links.
- Preserve current curation and deduplication logic.
- Do not add unsupported metrics or claims.
- No horizontal page overflow on mobile.

---

### Task 1: Lock the visual behavior in QA

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: existing homepage QA workflow.
- Produces: regression expectations for branded atlas identity, exhaustive filtered contact sheet, tile selection and mobile layout.

- [ ] **Step 1: Add the failing expectation**
Update Test 1 so the first archive scroll must show `IGOR VEPRETSKI × #7YA🥷`, `PUBLIC LIFE ATLAS`, and a contact sheet representing all currently filtered moments; require selecting a tile to update the large stage.
- [ ] **Step 2: Extend mobile coverage**
Update Test 2 so the contact sheet renders as a touch-safe two-column grid with no horizontal overflow.
- [ ] **Step 3: Deploy test-only change and verify it fails for the missing atlas behavior**
Use AppDeploy QA as the red phase.

### Task 2: Implement branded archive masthead and contact sheet

**Files:**
- Modify: `src/life-first/HundredMoments.tsx`

**Interfaces:**
- Consumes: `visibleMoments: Moment[]`, `active`, `setActive`, localized layer labels.
- Produces: `.hm-brandline`, `.hm-atlas`, `.hm-atlas-card` UI; tile click sets `active` and preserves the current evidence filter.

- [ ] **Step 1: Add localized atlas copy**
Add brand label `IGOR VEPRETSKI × #7YA🥷`, atlas label `PUBLIC LIFE ATLAS`, and concise instruction text.
- [ ] **Step 2: Render every filtered moment**
Map `visibleMoments` into buttons after the existing progress control. Each card must expose index/year/layer, use the real image when available, and use a source-poster fallback when absent.
- [ ] **Step 3: Keep selected-state semantics explicit**
Set `aria-current` on the active tile and update `active` on click.

### Task 3: Create the visual system

**Files:**
- Modify: `src/life-first/hundred-moments.css`

**Interfaces:**
- Consumes: new atlas class names from Task 2.
- Produces: dense editorial desktop grid and two-column mobile grid.

- [ ] **Step 1: Add personal masthead styling**
Use the existing #7YA black/acid-green language, oversized Igor typography and mono evidence labels without NVIDIA marks.
- [ ] **Step 2: Add contact-sheet styling**
Desktop uses a responsive 5–7 column editorial grid; cards have fixed visual ratios, source-image crops, index/year overlays and active state.
- [ ] **Step 3: Add mobile rules**
At <=520px use two columns, readable metadata, touch-size controls and no overflow.

### Task 4: Deploy and verify

**Files:**
- AppDeploy live snapshot

**Interfaces:**
- Produces: deployed branded Life Atlas on `7ya.io`.

- [ ] **Step 1: Deploy the TSX + CSS change with the already-updated QA suite**
- [ ] **Step 2: Poll AppDeploy until terminal status**
- [ ] **Step 3: Inspect frontend, network, backend and E2E results**
- [ ] **Step 4: Verify fresh desktop and mobile QA screenshots are generated**
- [ ] **Step 5: Report the applied release only after QA is green**
