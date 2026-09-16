# 7YA Connections Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private, lightweight Connections Hub that lets Igor connect and verify one source at a time, while showing exactly what each connection contributes to Igor Core.

**Architecture:** Add one admin-facing static route driven by a small connection registry. The first slice does not implement new OAuth providers; it exposes known connection state, official connect/manage actions, capability checks that already exist, and a normalized status contract that later adapters can update. The page must work even when every external provider is unavailable.

**Tech Stack:** Existing 7YA static build, vanilla HTML/CSS/JS patterns already in the canonical repository, Node.js build/check scripts, existing connector/runtime endpoints where present.

**Spec:** `docs/superpowers/specs/2026-09-16-life-graph-design.md`

## Global Constraints
- `7guard-io/7ya.io` is the single source repository.
- No public placeholder is permitted.
- Do not store passwords, OAuth tokens, API keys or secrets in browser storage, static files or repository data.
- A provider is never marked connected merely because a configuration record exists; connection state requires a successful capability/read check or an explicitly trusted existing integration state.
- Failed providers cannot block the page or site build.
- Hosting/DNS migration is not part of this slice.
- Reuse existing connection/runtime evidence before adding integrations.
- Mobile-first and accessible; reduced-motion respected.

---

### Task 1: Connection registry and contract

**Files:**
- Create: `public/data/connections.json`
- Create: `scripts/check-connections-registry.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces registry entries with `id`, `label`, `category`, `priority`, `purpose`, `core_outputs`, `manage_url`, `status_mode`, and optional `capability_url`.
- `status_mode` is one of `verified_runtime`, `manual_auth`, `informational`, `not_needed`.

- [ ] Write `scripts/check-connections-registry.mjs` first so it fails while the registry is absent. The check must reject duplicate IDs, invalid status modes, non-HTTPS manage URLs, secret-like fields (`token`, `password`, `secret`, `api_key`, `access_token`), empty `core_outputs`, and priorities outside 1-100.
- [ ] Run `node scripts/check-connections-registry.mjs`; expect failure because `public/data/connections.json` does not exist.
- [ ] Create the registry with the first useful providers only: GitHub, Google Search Console, Google Analytics 4, Google Drive, YouTube, Instagram/Facebook (Meta), TikTok, LinkedIn, X, Threads, Telegram, Vercel and AppDeploy. Mark providers according to capability, not optimism; unknown runtime state remains `manual_auth` or `informational`.
- [ ] Add `check:connections` to `package.json` and include it in `check-all`.
- [ ] Run `npm run check:connections`; expect PASS.
- [ ] Commit `feat(connections): add safe provider registry`.

### Task 2: Private Connections Hub projection

**Files:**
- Create: `public/connections/index.html`
- Create: `public/connections/connections.css`
- Create: `public/connections/connections.js`
- Create: `scripts/check-connections-page.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes `/data/connections.json`.
- Produces a mobile-first card grid grouped by `Connect first`, `Content sources`, `Measurement`, and `Infrastructure`.
- Each card renders provider label, purpose, Core outputs, current evidence state, and one safe action.

- [ ] Write `scripts/check-connections-page.mjs` first. It must fail unless the page has `noindex,nofollow`, loads the canonical registry, contains no secret input types, contains no placeholder markers, and exposes accessible status/action labels.
- [ ] Run the check; expect failure because the page does not exist.
- [ ] Build the page with a compact header: `7YA Connections` and a progress summary calculated from registry state. Do not hard-code fake connected counts.
- [ ] Render cards from JSON. `manual_auth` displays `דורש חיבור`; `informational` displays `מידע בלבד`; `not_needed` displays `לא נדרש`; `verified_runtime` displays `ממתין לבדיקת יכולת` until a capability check succeeds in the current session.
- [ ] Actions open only HTTPS official/manage destinations from the registry. The page never asks for credentials.
- [ ] Add a small `What reaches Igor Core` section inside every card from `core_outputs`.
- [ ] Respect `prefers-reduced-motion`; animations are limited to card/status transitions.
- [ ] Add `check:connections-page` to `check-all`.
- [ ] Run `npm run check:connections-page`; expect PASS.
- [ ] Commit `feat(connections): render private connection hub`.

### Task 3: Capability verification without coupling

**Files:**
- Modify: `public/data/connections.json`
- Modify: `public/connections/connections.js`
- Create: `scripts/check-connections-capabilities.mjs`
- Modify: `package.json`

**Interfaces:**
- Optional registry `capability_url` must be same-origin and read-only.
- Browser capability result is `{ ok: boolean, detail: string, checked_at: string }` and exists only in memory for the current page session.

- [ ] Write the capability checker first. It rejects cross-origin capability URLs, mutation-like paths containing `/create`, `/update`, `/delete`, `/deploy`, `/write`, and any registry state that claims a runtime connection without a capability URL.
- [ ] Run it against the Task 2 registry; expect failure for any `verified_runtime` entry that lacks a safe check.
- [ ] Only assign `verified_runtime` where the canonical site already exposes a safe same-origin read endpoint. Leave other integrations manual rather than inventing endpoints.
- [ ] In the page, fetch capability URLs independently with timeout/abort handling. One failed provider must not affect any other card.
- [ ] A successful check changes only that card to `מחובר ומאומת`. A failed check displays `לא אומת כעת` and the safe next action.
- [ ] Do not persist connection results to localStorage/cookies.
- [ ] Add `check:connections-capabilities` to `check-all`.
- [ ] Run the checker and page check; expect PASS.
- [ ] Commit `feat(connections): verify safe runtime capabilities`.

### Task 4: Build integration and no-placeholder gate

**Files:**
- Modify: `scripts/build-static-site.mjs` only if the existing public-directory copy does not already include the new route.
- Modify: `scripts/check-static-artifact.mjs` or add a focused checker if modification would make it less cohesive.

**Interfaces:**
- Produces `dist/connections/index.html`, its assets, and `dist/data/connections.json`.

- [ ] Run the current static build before modifying build code and check whether `public/connections/` and `public/data/connections.json` are already copied. If they are, make no build-code change.
- [ ] Add a failing artifact assertion for the Connections Hub route, `noindex`, registry and zero placeholder markers.
- [ ] Run build + artifact check; expect failure before the focused assertion is satisfied.
- [ ] Make the smallest build/check change required.
- [ ] Run `npm run build:site && npm run check:artifact && npm run verify:artifact`; expect PASS, including the existing GA4 artifact contract.
- [ ] Commit `build(connections): gate hub artifact`.

### Task 5: Reviewable preview, not production cutover

**Files:**
- No production DNS or domain files.

**Interfaces:**
- Produces a reviewable branch/PR and, only if the connected host automatically supports it, a preview deployment.

- [ ] Run `npm run check-all`.
- [ ] Run `npm run typecheck`.
- [ ] Run relevant tests plus `npm run build:site && npm run check:artifact && npm run verify:artifact`.
- [ ] Inspect the final diff and reject any change outside Connections Hub/build gates that is not strictly necessary.
- [ ] Open a PR against `main` describing which providers are actually verifiable and which still require Igor to authenticate.
- [ ] Do not change production DNS or alias as part of this task.
- [ ] On a preview, verify mobile layout, noindex, zero credential collection, independent failure behavior and official connection actions.
- [ ] Commit/review state is the deliverable; production promotion is a separate explicit gate.
