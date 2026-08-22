# 7YA App Shell v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single static-first global shell for navigation, contextual search, Ask 7YA, performance-safe mobile UX, and shared product logic across all 7YA routes.

**Architecture:** Keep route HTML as canonical content and inject a dependency-free shell during static build. The shell lazy-loads public knowledge only on user intent and sends a bounded set of retrieved public snippets to the optional AI endpoint.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js build/check scripts, Netlify function, OpenAI SDK already present in dependencies.

**Spec:** `docs/superpowers/specs/2026-08-23-7ya-app-shell-v2-design.md`

## Global Constraints
- Preserve static-first rendering and canonical route HTML.
- No new frontend framework.
- No production deployment in this task.
- Local retrieval must remain useful if AI is unavailable.
- Public AI answers must be grounded only in provided public context.
- Mobile dock controls must be at least 44px targets and safe-area aware.

---

### Task 1: Add App Shell contract gate

**Files:**
- Create: `scripts/check-app-shell-v2.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: build script and source assets.
- Produces: `npm run check-shell-v2` gate included in `check-all`.

- [ ] Write checks for required v2 CSS/JS/config files, build injection marker, mobile dock, Ask/Search controls, reduced-motion CSS, and chat retrieval-only contract.
- [ ] Run the new check and verify it fails before implementation assets exist.
- [ ] Add the check to `check-all` and `lint`.

### Task 2: Create shared route/config source

**Files:**
- Create: `scripts/app-shell-v2-config.mjs`

**Interfaces:**
- Produces: `shellRoutes`, `shellKnowledgeSources`, `shellConfig`.

- [ ] Define canonical user-facing routes with Hebrew labels, short labels, keywords, and primary grouping.
- [ ] Define lazy knowledge source URLs.
- [ ] Ensure route URLs are unique and public-facing copy contains no operational dashboard language.

### Task 3: Build global shell runtime and design system

**Files:**
- Create: `scripts/7ya-app-shell-v2.js`
- Create: `styles/7ya-app-shell-v2.css`

**Interfaces:**
- Consumes: JSON config injected by the build.
- Produces: `[data-7ya-shell="v2"]`, desktop rail, contextual links, mobile dock, Search/Ask dialog, lazy retrieval.

- [ ] Capture useful same-page links from legacy topbars before hiding duplicate chrome.
- [ ] Render desktop rail and five-item mobile dock.
- [ ] Implement focus-safe Search/Ask dialog with `Escape`, `Cmd/Ctrl+K`, and `/` shortcuts.
- [ ] Search current headings, routes, and lazy-loaded public knowledge datasets.
- [ ] Ask performs retrieval first and posts bounded snippets to the chat endpoint.
- [ ] Render AI answer when present; otherwise keep retrieval-only results visible.
- [ ] Add responsive, safe-area, focus-visible, high-contrast, and reduced-motion CSS.

### Task 4: Inject shell at static build time

**Files:**
- Modify: `scripts/build-static-site.mjs`
- Modify: `scripts/site-contract.mjs`

**Interfaces:**
- Consumes: `shellConfig`.
- Produces: one config JSON script, one v2 stylesheet, one deferred v2 runtime on every public HTML page except `404.html`.

- [ ] Add v2 CSS/JS to public artifact lists.
- [ ] Import shell config into the build script.
- [ ] Inject v2 assets and config exactly once.
- [ ] Stop globally injecting the old Control runtime to avoid duplicate command palettes; retain legacy assets for route compatibility.

### Task 5: Upgrade chat to grounded optional AI

**Files:**
- Modify: `scripts/test-netlify-chat.mjs`
- Modify: `netlify/functions/chat.js`
- Modify: `package.json`

**Interfaces:**
- Input: `{ message, page?, context? }` with bounded public snippets.
- Output without key: `{ ok: true, status: "retrieval_only", answer: null }`.
- Output with key: `{ ok: true, status: "answered", answer, model }`.

- [ ] Update test contract first for retrieval-only behavior and context validation.
- [ ] Verify the updated test would fail against the current stub response.
- [ ] Implement context sanitization and size limits.
- [ ] If `OPENAI_API_KEY` is absent, return retrieval-only without error.
- [ ] If configured, call the OpenAI SDK with a strict grounding system prompt and bounded context.
- [ ] Add `npm run test:netlify` to `ci:local`.

### Task 6: Verification

**Files:**
- No production files unless a failing gate requires a fix.

- [ ] Compare branch against `main` and review changed files for unintended route/content deletion.
- [ ] Confirm the shell check, Netlify contract test, static build injection, artifact lists, and existing CI contracts are represented in the branch.
- [ ] Use GitHub Actions status as the execution verification surface because the local sandbox cannot resolve github.com.
- [ ] Do not merge or deploy.