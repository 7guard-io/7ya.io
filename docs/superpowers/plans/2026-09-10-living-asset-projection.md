# 7YA Living Asset Projection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make authentic source objects visually drive 7YA, beginning with SUPERNOAH on Home and Research.

**Architecture:** A shared projection-data module feeds one reusable editorial component. The component has a source-image fallback, explicit evidence/status labels, owner-analytics boundaries and platform-independent source actions. Static-first Research receives a matching source feature.

**Tech Stack:** React 19, TypeScript, Vite, CSS, AppDeploy static-first hydration.

**Spec:** `docs/superpowers/specs/2026-09-10-living-asset-projection-design.md`

## Global Constraints
- Keep the person first on the homepage.
- Never present SUPERNOAH as peer reviewed.
- Label 20/38 as owner analytics, not synthetic reach.
- Use the exact public Academia manuscript URL.
- Never leave a broken cover region; fall back to the existing local research image.
- Keep HE/EN/RU first-class.

### Task 1: Shared source object
**Files:** Create `src/asset-projection.ts`; Test `tests/tests.txt`.
- [x] Define the exact source URL, cover URL, local fallback, evidence boundary, localized question/summary, owner metric and framework nodes.
- [x] Keep the public claim boundary explicit.

### Task 2: Reusable visual projection
**Files:** Create `src/FeaturedAssetProjection.tsx`, `src/featured-asset-projection.css`.
- [x] Render cover, source provenance, question, status, metric, actions and framework.
- [x] Add deterministic external-image fallback.
- [x] Make the layout single-column and readable on mobile.

### Task 3: Home and Research integration
**Files:** Modify `src/PersonalProjectionHome.tsx`, `src/ResearchPage.tsx`, `src/research-data.ts`.
- [x] Insert current work after the personal story on Home.
- [x] Insert the same source object immediately beneath the Research hero.
- [x] Point the SUPERNOAH research object at the exact manuscript URL.

### Task 4: Static-first and release consistency
**Files:** Modify `public/research/index.html`, `src/App.tsx`, `index.html`.
- [x] Add a static SUPERNOAH feature with local fallback.
- [x] Align runtime and first-paint release markers.

### Task 5: Verification
**Files:** Test `tests/tests.txt`.
- [ ] Build and deploy.
- [ ] Verify desktop and mobile QA snapshots have no frontend/network errors.
- [ ] Verify public 7ya.io and `/research/` expose the new source object.
- [ ] Recheck exact source link, peer-review boundary and fallback behavior.
