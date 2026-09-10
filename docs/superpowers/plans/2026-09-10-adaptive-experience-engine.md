# Adaptive Experience Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the deterministic decision layer that turns 7YA's existing corpus and modules into intent-adaptive experiences, then stage the exact AppDeploy integration without touching production.

**Architecture:** A pure TypeScript engine owns intent, module order, primary actions, privacy-safe persistence, companion context, and corpus-ranking weights. React/AppDeploy remains an adapter layer. The engine is source-independent and can be tested before any production wiring.

**Tech Stack:** TypeScript 5.x, Node 22 built-in test runner, React 19 adapter at deployment stage, existing AppDeploy React/Vite runtime.

**Spec:** `docs/superpowers/specs/2026-09-10-adaptive-experience-engine-design.md`

## Global Constraints
- Four explicit intents only: `know-igor`, `verify`, `collaborate`, `grow`.
- No second corpus or AI router.
- No hidden identity inference or anonymous fingerprinting.
- Persistent snapshot must exclude free-text personal detail.
- Canon/LIVE/LEGACY/DISCOVERY trust status must never be mutated by personalization.
- No production deployment until Igor explicitly requests the deployment chain.
- Default experience remains Igor-first.

---

### Task 1: Deterministic experience engine

**Files:**
- Create: `packages/adaptive-experience/src/experience-engine.ts`
- Create: `packages/adaptive-experience/test/experience-engine.test.ts`
- Modify: `tsconfig.json`
- Modify: `package.json`

**Interfaces:**
- Produces: `experiencePlan(intent)`, `rankProjectionItem(item,intent)`, `persistentExperienceSnapshot(context)`, `companionExperienceContext(context)`, `applyExperiencePatch(context,patch)`.

- [ ] **Step 1: Write failing tests** for four distinct plans, privacy-safe persistence, intent-specific ranking, companion context equality, trust immutability and invalid patch rejection.
- [ ] **Step 2: Run the isolated test harness and verify it fails** because `experience-engine` does not exist.
- [ ] **Step 3: Implement the minimal pure TypeScript engine** with no React or AppDeploy imports.
- [ ] **Step 4: Compile with strict TypeScript and run the isolated Node tests.** Expected: all tests pass.
- [ ] **Step 5: Add the package and tests to root `tsconfig.json` and `npm test` coverage.**
- [ ] **Step 6: Commit implementation and tests on the isolated branch.**

### Task 2: Runtime binding contract

**Files:**
- Create: `docs/runtime-bindings/2026-09-10-adaptive-experience-appdeploy.md`

**Interfaces:**
- Consumes the pure engine from Task 1.
- Produces exact binding instructions for current AppDeploy source: `App.tsx`, `PersonalProjectionHome.tsx`, `VisibleCorpus.tsx`, `PersonalGrowthGateway.tsx`, `StoryCompanion.tsx`.

- [ ] **Step 1: Map current AppDeploy runtime call sites** and record exact existing behavior.
- [ ] **Step 2: Define provider placement:** `ExperienceProvider` inside locale/theme providers, above `AppContent`/`StoryCompanion`.
- [ ] **Step 3: Define homepage adapter:** render an Igor-first fixed entry, then order existing modules from `experiencePlan(intent)`; never duplicate a module.
- [ ] **Step 4: Define corpus adapter:** pass intent into ranking without changing source/trust fields.
- [ ] **Step 5: Define Bro Chat adapter:** include `experience` in existing companion context; accept only sanitized `experiencePatch` intent/action values.
- [ ] **Step 6: Define Growth Gateway adapter:** explicit goal selection maps to `grow`; free-text detail stays session-only and is never globally persisted.
- [ ] **Step 7: Record deployment acceptance matrix** for four intents on mobile and desktop.

### Task 3: Verification gate

**Files:**
- Update: `docs/runtime-bindings/2026-09-10-adaptive-experience-appdeploy.md`

- [ ] **Step 1: Verify all Task 1 tests pass from compiled JavaScript.**
- [ ] **Step 2: Verify the four plans have different module orders and primary actions.**
- [ ] **Step 3: Verify persistence output contains no `detail`, `message`, free-text barrier or arbitrary patch keys.**
- [ ] **Step 4: Verify ranking changes between `verify` and `grow` while input trust/source objects remain byte-equivalent.**
- [ ] **Step 5: Verify production remains on the current AppDeploy version; do not call `deploy_app` or `apply_app_version`.**
- [ ] **Step 6: Only after an explicit deployment-chain command, apply the runtime binding, run AppDeploy build/E2E/visual acceptance on mobile+desktop, and reject release on any failed intent route.**
