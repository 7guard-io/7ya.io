# 7YA Influence Graph & Digital Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an evidence-first historical influence graph for Igor Vepretski that preserves active, renamed, blocked, deleted and externally mirrored public surfaces and measures interaction depth without conflating exposure with causal influence.

**Architecture:** Add a versioned knowledge contract for surfaces, content nodes, interaction signals and propagation edges. Keep observations separate from inference and declared/causal outcomes. UI consumes only publishable aggregate/public evidence; private commenter identities and raw private interaction data never ship.

**Tech Stack:** Static JSON knowledge layer, Node.js validation gates, React/TypeScript public UI, existing 7YA static build/release gates.

## Global Constraints

- Evidence-first: every public metric must carry source, date, evidence tier and confidence.
- Never merge views, followers, reactions, comments, shares, saves and actions into one unqualified number.
- Deleted/blocked/renamed surfaces remain historical nodes rather than disappearing from the graph.
- Owner reports are labeled OWNER_REPORT and never upgraded to externally verified without evidence.
- Inferred influence is labeled INFERRED; explicit user declarations/actions are DECLARED_ACTION.
- No raw private commenter identities or private interaction content in public data.
- Cross-platform duplicates must be linkable to a canonical story/content family to avoid double-counting people or content.
- Historical totals are reported as floors/ranges when unique-person deduplication is impossible.

---

### Task 1: Influence Graph Contract

**Files:**
- Create: `knowledge/influence-graph-v1.json`
- Create: `scripts/check-influence-graph-v1.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing `history-song-records-*.json`, `public-response-signals-20260715.json`, owner exports and public indexed evidence.
- Produces: `surface_nodes[]`, `content_families[]`, `interaction_signals[]`, `propagation_edges[]`, `declared_outcomes[]`, `coverage`.

- [ ] **Step 1: Write the failing validation gate**

Validate schema version, unique IDs, allowed surface status, evidence classes, confidence classes, HTTPS/public sources, metric separation, historical-node labeling, and privacy rules.

- [ ] **Step 2: Run gate and verify RED**

Run: `node scripts/check-influence-graph-v1.mjs`
Expected: FAIL because `knowledge/influence-graph-v1.json` does not yet exist.

- [ ] **Step 3: Add minimum evidence-backed dataset**

Seed current TikTok, legacy TikTok `@igor_vepretski`, both Instagram surfaces, Facebook profile/page paths, LinkedIn, YouTube, X, Threads and historical web/domain leads. Seed only metrics already supported by owner export, dated public snapshot or external index.

- [ ] **Step 4: Run gate and verify GREEN**

Run: `node scripts/check-influence-graph-v1.mjs`
Expected: PASS.

- [ ] **Step 5: Add gate to package scripts**

Add `check-influence-graph` and include it in `check-all`.

### Task 2: Ghost Profiles / Removed Surfaces

**Files:**
- Modify: `knowledge/influence-graph-v1.json`
- Create: `docs/influence/ghost-surface-methodology.md`

**Interfaces:**
- Consumes: public search snapshots, archived third-party indexes, historical authored pages, canonical old URLs, owner reports.
- Produces: historical continuity records with `status` one of `ACTIVE`, `RENAMED`, `BLOCKED`, `REMOVED`, `INACTIVE`, `UNKNOWN_HISTORICAL`.

- [ ] **Step 1:** Add legacy TikTok `@igor_vepretski` as `BLOCKED`/historical with external-index metrics separated from owner peak report.
- [ ] **Step 2:** Add historical Facebook paths as separate surface aliases mapped to one person entity unless proven independent.
- [ ] **Step 3:** Add historical/alternate web domains and handles as quarantined leads until independently captured.
- [ ] **Step 4:** Document that disappearance from a platform does not erase previously verified reach/engagement; it changes evidence state and freshness.

### Task 3: Interaction Depth Model

**Files:**
- Modify: `knowledge/influence-graph-v1.json`
- Create: `docs/influence/interaction-depth-model.md`

**Interfaces:**
- Produces four non-substitutable dimensions: `exposure`, `resonance`, `propagation`, `transformation`.

- [ ] **Step 1:** Map views/reach to Exposure.
- [ ] **Step 2:** Map reactions, comments, saves and watch-depth to Resonance without assuming sentiment.
- [ ] **Step 3:** Map shares, reposts, stitches, external syndication and press pickup to Propagation.
- [ ] **Step 4:** Map explicit statements of changed intention/action, participation, collaboration or institutional response to Transformation.
- [ ] **Step 5:** Add confidence and attribution labels to every inference.

### Task 4: Propagation & Story Families

**Files:**
- Modify: `knowledge/influence-graph-v1.json`

**Interfaces:**
- Produces canonical `content_family_id` and edges linking original post -> repost -> cross-platform mirror -> press/media -> downstream reaction.

- [ ] **Step 1:** Seed the fatherhood story family across Facebook, LinkedIn and independent media.
- [ ] **Step 2:** Seed elder-fraud story family across social post -> external repost -> broadcast coverage.
- [ ] **Step 3:** Seed StartOn story family across owned content -> external/organizational amplification -> professional discussion.
- [ ] **Step 4:** Prevent cross-post instances from being summed as unique people without deduplication evidence.

### Task 5: Public Experience

**Files:**
- Create: `src/InfluenceGraph.tsx`
- Create: `src/influence-graph.css`
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `scripts/site-contract.mjs`

**Interfaces:**
- Consumes: `/knowledge/influence-graph-v1.json`.
- Produces: public interactive section showing timeline, active/ghost surfaces, story cascades, evidence class and four influence dimensions.

- [ ] **Step 1:** Add UI contract tests/checks before component implementation.
- [ ] **Step 2:** Render an evidence summary with floors/ranges, never unsupported grand totals.
- [ ] **Step 3:** Render ghost surfaces visually as historical memory, not broken links.
- [ ] **Step 4:** Render story cascades as source -> amplification -> response -> outcome.
- [ ] **Step 5:** Ensure mobile/RTL/HE-EN-RU accessibility and reduced-motion support.

### Task 6: Release Gate & Audit

**Files:**
- Modify: `release.json`
- Modify: `scripts/site-contract.mjs`
- Modify: relevant check scripts.

**Interfaces:**
- Produces a release that fails closed if the graph is missing, malformed, privacy-unsafe or contains unlabeled inferred/owner-reported metrics.

- [ ] **Step 1:** Run `npm run check-influence-graph`.
- [ ] **Step 2:** Run `npm run check-all`.
- [ ] **Step 3:** Run `npm run typecheck`.
- [ ] **Step 4:** Run `npm test`.
- [ ] **Step 5:** Run static build/artifact verification.
- [ ] **Step 6:** Review public wording against source evidence and remove any unsupported causal or unique-person claim.
