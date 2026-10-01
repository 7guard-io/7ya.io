# 7YA Visible Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Track every step with checkboxes.

**Goal:** Ship a visibly different, person-first homepage on the rebuild branch and expose it through a Cloudflare preview before production.

**Architecture:** Keep the existing static GitHub → Cloudflare Pages architecture. Rebuild only the public front door in this milestone, using existing real media and canonical source-linked records. Preserve deeper archive/evidence routes. Full corpus ingestion, Life Atlas, Echo route and companion redesign get separate plans.

**Tech Stack:** Static HTML/CSS, Node.js acceptance scripts, existing locale generator, Cloudflare Pages, GitHub.

**Spec:** `docs/superpowers/specs/2026-09-30-7ya-living-archive-rebuild-design.md`

## Global Constraints

- PERSON FIRST, SYSTEM SECOND.
- Work only on `rebuild/7ya-living-archive-20260930` until preview approval.
- Real Igor-owned/public-source media only; no stock or invented biography media.
- Every featured factual moment keeps a source/context link.
- No synthetic cross-platform reach total.
- Hebrew RTL primary; EN/RU homepage output coherent.
- No private Drive URLs, credentials, or sensitive private data in the artifact.
- No Acceptance Gate, release jargon, CANON/DISTRIBUTION labels or dashboard-first metrics in the first experience.
- Mobile-first, keyboard focus and reduced-motion support.

## Review Focus

1. One primary navigation only; remove the current duplicate `seven-human-nav` + `topbar` shell.
2. First viewport shows Igor, not counts/system language.
3. Every featured moment has a real image/video and source/context link.
4. EN/RU output has no new Hebrew UI leakage.
5. No horizontal page scrolling at 390px width.

---

### Task 1: Lock the new homepage contract with a failing gate

**Files:** Create `scripts/check-rebuild-home.mjs`; modify `package.json`.

- [ ] Add assertions: exactly one H1; exactly one `data-seven-human-nav`; release marker `7ya-rebuild-home-20260930-v1`; copy `אני איגור.`; 6–12 `data-home-moment` cards; `data-public-echo`; `data-now-work`; no `<header class="topbar">`; no `Acceptance Gate`, `PUBLIC RECORD`, `DISTRIBUTION INSTANCE`, `5.1B`, `6.2B`, or `7B`.
- [ ] Validate each moment has href, image src, alt text and source/context label.
- [ ] Run `node scripts/check-rebuild-home.mjs`; expected FAIL on the current homepage contract.
- [ ] Add npm commands `check:rebuild-home` and `check:rebuild-home:artifact`; include them around `build:cloudflare` in `release:gate`.
- [ ] Commit `test: lock person-first homepage rebuild contract`.

### Task 2: Build the visibly new homepage

**Files:** Modify `index.html`; create `styles/rebuild-home-20260930.css`; modify `scripts/site-contract.mjs`.

- [ ] Replace duplicate navigation with one human navigation.
- [ ] Build static sections in this order: `#home` Igor hero → `#moments` 6–12 real moments → `#echo` public-response preview → `#work` StartOn/documented work → `#now` current work → `#contact` CTA.
- [ ] First fold contains no archive count, release state, Acceptance Gate or build language.
- [ ] Create documentary/editorial CSS using graphite/black + `#8CFF00`, strong portrait treatment, desktop grid, mobile snap rail, clear Echo styling, focus-visible and reduced-motion rules.
- [ ] Add the stylesheet to `publicStyleFiles` and `criticalArtifactPaths`.
- [ ] Run `npm run check:rebuild-home`; expected PASS.
- [ ] Commit `feat: rebuild homepage around Igor and real moments`.

### Task 3: Source-bind featured moments

**Files:** Create `knowledge/home-featured-moments-20260930.json`; create `scripts/check-home-featured-moments.mjs`; modify `index.html`, `package.json`.

- [ ] Write validator first: require 6–12 items; reject blank media/source/context fields, private Drive URLs, duplicate story families unless intentional, unsupported source URLs, and aggregate reach claims.
- [ ] Run validator; expected FAIL because projection does not exist.
- [ ] Create an 8-item projection using distinct verified story families from current corpora: youth-risk/StartOn origin, public-service transition, fatherhood, Russian-Israeli identity, music/creation, public-action/media continuation, StartOn execution, and current 7YA/research/creation.
- [ ] Each homepage card gets `data-moment-id` matching the projection.
- [ ] Run `npm run check:home-moments && npm run check:rebuild-home`; expected PASS.
- [ ] Commit `feat: source-bind featured homepage moments`.

### Task 4: Localize the rebuilt homepage

**Files:** Modify `scripts/localize-static-site.mjs`, `scripts/check-locale-route-acceptance.mjs`.

- [ ] Change locale acceptance first: EN requires `I’m Igor.` and new section labels; RU requires `Я Игорь.` and equivalents; keep mixed-script/accessibility leakage checks.
- [ ] Run `npm run build:site && npm run check:locale-routes`; expected FAIL before translations.
- [ ] Add exact EN/RU translations for the new homepage UI; preserve original-language source titles where appropriate.
- [ ] Rebuild and rerun locale acceptance; expected PASS.
- [ ] Commit `feat: localize rebuilt homepage experience`.

### Task 5: Build and expose a real preview

**Files:** Operational metadata only if evidence changes it.

- [ ] Run `npm run check:rebuild-home`.
- [ ] Run `npm run build:cloudflare`.
- [ ] Run `npm run check:rebuild-home:artifact && npm run check:artifact && npm run verify:artifact`.
- [ ] Confirm `dist/index.html` contains `7ya-rebuild-home-20260930-v1`; EN contains `I’m Igor.`; RU contains `Я Игорь.`.
- [ ] Obtain the Cloudflare Pages branch-preview URL from deployment/check metadata without changing `main` or 7ya.io.
- [ ] Inspect the actual preview on desktop and 390px mobile: first fold, single nav, media loading/crop, 6–12 moments, Echo separation, CTAs, HE/EN/RU.
- [ ] Record exact preview commit/provider/status if operational metadata needs updating.

## Separate follow-on plans

After homepage preview review: owner-export ingestion; Life Atlas; full Echo/Public Response route; StartOn deep chapter; Create/Think; source-grounded Ask Igor/Bro Chat; analytics/feedback; production cutover.

## Self-review

The plan deliberately implements the first visible milestone only. It preserves the canonical source and deployment path, introduces deterministic tests before code, keeps facts source-bound, and makes visual preview acceptance a separate gate from build success.
