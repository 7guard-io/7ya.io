# Drive Influence Census Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a privacy-safe, evidence-first census of Igor Vepretski's Google Drive material and connect relevant historical records to the 7YA Influence Graph without exposing private source material.

**Architecture:** Google Drive remains a private evidence reservoir. A normalization layer resolves duplicates, versions, entities, historical handles and public/private status. Only public-safe claims and canonical public URLs are exported to `knowledge/influence-graph-v1.json`; Drive URLs, raw correspondence and sensitive records never enter the public graph.

**Tech Stack:** Google Drive connector, GitHub source repository, static JSON knowledge layer, Node.js release gates.

## Global Constraints

- Do not publish Google Drive or Google Docs source URLs in the public influence graph.
- Do not publish private correspondence, contact data, legal/financial material, credentials, minors' data or private family identifiers.
- Duplicate converted workbooks are versions/copies, not independent evidence.
- Historical deleted, blocked, renamed or inactive surfaces preserve verified historical metrics with explicit status.
- Never convert reach, visibility, likes or reposting into unsupported causal influence.
- Unique-person totals require cross-platform entity deduplication.
- Conflicting metrics remain quarantined; never select the larger number merely because it is stronger.

---

### Task 1: Establish the provenance firewall

**Files:**
- Create: `knowledge/influence-provenance-policy-v1.json`
- Create: `scripts/check-influence-provenance-v1.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `knowledge/influence-graph-v1.json`
- Produces: release-gate enforcement that rejects private Drive leakage and unsafe source handling.

- [x] **Step 1: Write the failing provenance gate**
- [x] **Step 2: Add the provenance policy**
- [x] **Step 3: Wire the gate into `check-all` and `lint`**
- [ ] **Step 4: Execute the gate in a repository runtime and record PASS output**

### Task 2: Drive census and version resolution

**Files:**
- Modify: private evidence registry outside the public repository
- Public output: no raw Drive inventory

**Interfaces:**
- Consumes: accessible Drive file/folder metadata and canonical evidence workbooks.
- Produces: normalized internal source keys and duplicate/version families.

- [x] **Step 1: Inventory the archive intake structure and top-level Drive surfaces**
- [x] **Step 2: Identify canonical forensic workbook, canonical work index, historical master canon and evidence registry**
- [ ] **Step 3: Resolve duplicate converted workbooks into version families**
- [ ] **Step 4: Classify relevant files into PUBLIC_INFLUENCE, PLATFORM_EXPORT, MEDIA_AND_PRESS, STARTON, RESEARCH_AND_WRITING, MUSIC_AND_CULTURE, PUBLIC_SERVICE, LEGACY_AND_GHOST_SURFACE, PRIVATE_CONTEXT or IRRELEVANT_TO_PUBLIC_INFLUENCE**
- [ ] **Step 5: Preserve only internal source keys for private Drive evidence**

### Task 3: Historical / ghost-surface reconstruction

**Files:**
- Modify: `knowledge/influence-graph-v1.json`
- Test: `scripts/check-influence-graph-v1.mjs`

**Interfaces:**
- Consumes: archive traces, historical references, owner exports, public indexes and deleted-page evidence.
- Produces: surface nodes with status ACTIVE, RENAMED, BLOCKED, REMOVED, INACTIVE or UNKNOWN_HISTORICAL.

- [x] **Step 1: Preserve the legacy TikTok account as a historical node**
- [x] **Step 2: Preserve historical Facebook aliases and historical web/domain traces**
- [ ] **Step 3: Recover additional removed/renamed handles from archive and cross-platform references**
- [ ] **Step 4: Link each ghost surface to surviving posts, reposts, articles, media or identity mirrors**
- [ ] **Step 5: Keep historical metrics dated; never present them as current**

### Task 4: Interaction-level influence reconstruction

**Files:**
- Modify: `knowledge/influence-graph-v1.json`
- Modify: public influence UI only after evidence gate passes

**Interfaces:**
- Consumes: views, reactions, comments, saves, shares, reposts, syndication, quotes and declared outcomes.
- Produces: EXPOSURE, RESONANCE, PROPAGATION and TRANSFORMATION signals.

- [x] **Step 1: Model the four influence dimensions**
- [x] **Step 2: Add observed Instagram and TikTok interaction evidence**
- [x] **Step 3: Add cross-platform fatherhood propagation and media pickup**
- [x] **Step 4: Represent declared vote/support outcomes as declarations, not completed behavior**
- [ ] **Step 5: Expand comment semantics into stance, narrative transfer, disagreement, identity disclosure and action-intent classes with human review for sensitive interpretation**

### Task 5: Unique-person and cascade analysis

**Files:**
- Create later: normalized internal actor-resolution dataset (private)
- Public output: aggregate counts and uncertainty bands only after deduplication

**Interfaces:**
- Consumes: platform actor IDs or public handles where legally/publicly available, timestamps and interaction edges.
- Produces: deduplicated actor clusters and propagation cascades.

- [ ] **Step 1: Define actor-resolution keys without exposing private identity**
- [ ] **Step 2: Deduplicate repeat interactions by the same actor on the same asset**
- [ ] **Step 3: Estimate cross-platform overlap with explicit uncertainty**
- [ ] **Step 4: Compute cascade depth, breadth, secondary amplification and institutional pickup**
- [ ] **Step 5: Keep `grand_total_unique_people` null until the deduplication gate is satisfied**

### Task 6: 7ya.io experience integration

**Files:**
- Modify: `influence/index.html`
- Modify: `scripts/influence-graph-v1.js`
- Modify: corresponding influence styles
- Test: `scripts/check-influence-graph-page.mjs`

**Interfaces:**
- Consumes: public-safe influence graph only.
- Produces: a human-readable historical influence experience rather than a vanity-metrics dashboard.

- [ ] **Step 1: Show influence as cascades, not a single magic number**
- [ ] **Step 2: Surface Ghost Profiles / Removed Surfaces with dates and evidence state**
- [ ] **Step 3: Allow traversal from idea → publication → interaction → redistribution → media/institution → declared action**
- [ ] **Step 4: Add topic/language/platform/time filters**
- [ ] **Step 5: Run mobile, accessibility, route, privacy and release gates before merge**

## Verification state

As of 2026-08-15, repository writes are present on `feat/influence-graph-20260815`. A local clone-based test run was attempted but the execution container could not resolve `github.com`; therefore no runtime PASS is claimed for the newly added provenance gate. Merge remains blocked until the gate is executed in a repository-capable runtime.
