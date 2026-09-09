# 7YA Cinematic Story + Resilient Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the live 7YA homepage into a single seven-chapter cinematic story, keep known content visible when live API ingress fails, and add a secure Telegram-ready intake endpoint that reuses the existing evidence-first pipeline.

**Architecture:** Keep AppDeploy as the production runtime. Simplify the homepage around one story spine and one curated content handoff. Add a static home projection baseline that the frontend can render immediately and then enrich with live `/api/public-projection`; add a secret-gated Telegram webhook that stores pending intake and does not auto-publish.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy frontend/backend SDK, AppDeploy database and secrets, existing canonical corpus/evidence-first ingestion modules.

**Spec:** `docs/superpowers/specs/2026-09-09-cinematic-story-ingestion-design.md`

## Global Constraints
- Live production authority is AppDeploy app `697a008fddc309b142` until independently changed and verified.
- No collage and no generic imagery.
- Authentic/public-source media only; every major public media object retains a source action.
- Homepage known content must remain visible if `/api/public-projection` fails.
- Telegram intake is pending-by-default; no automatic public publishing.
- Secret values never appear in code, logs or client responses.
- Final acceptance requires fresh mobile + desktop pixel review of `https://7ya.io/`.

---

### Task 1: Reconcile acceptance tests before product code

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Covers homepage cinematic hierarchy, resilient fallback behavior, archive handoff, mobile layout and Telegram-ready intake guardrail.
- Produces a release contract consumed by AppDeploy QA.

- [ ] **Step 1: Replace the current press-only top of the suite with one homepage sanity workflow**
  - Desktop 1280×800.
  - Open the Hebrew homepage.
  - Assert one dominant Igor hero, one clear story-entry action, no duplicated second hero, visible chapter progression, at least one authentic media/source action, and a visible deep-archive handoff.
  - Mark this test `[sanity]`.

- [ ] **Step 2: Add a mobile cinematic-flow test**
  - Mobile 375×667.
  - Verify no horizontal clipping, readable hero, chapter cards/scenes stack correctly, source actions remain reachable, and Bro Chat does not cover primary reading/navigation.

- [ ] **Step 3: Add a resilient-content test with injected projection failure**
  - QA Fault: `GET /api/public-projection` returns 503.
  - Expected: curated/source-bound homepage content and chapter visuals remain visible; no blank media universe or raw error is shown.

- [ ] **Step 4: Add a Telegram intake guardrail test**
  - Exercise `GET /api/telegram/inbox/status` and `POST /api/telegram/webhook` without valid secret configuration.
  - Expected: derived status is visible as not configured/disabled and webhook rejects the write without creating public content.

- [ ] **Step 5: Keep the existing digital-compendium authority tests**
  - Preserve their MASTER CANON / MASTER EVIDENCE LEDGER assertions so the new intake path cannot become a third truth store.

### Task 2: Build resilient home projection baseline

**Files:**
- Create: `src/documentary-home/home-projection-baseline.ts`
- Modify: `src/documentary-home/LivingFrontDoor.tsx`
- Modify: `src/documentary-home/DocumentaryHome.tsx`

**Interfaces:**
- Produces: `HOME_PROJECTION_BASELINE`, a typed array of source-bound public moments already present in the runtime corpus/media registry.
- Consumes: existing `deepMedia`, locale helpers and live `loadHomeProjection()`.

- [ ] **Step 1: Define a small typed baseline**
  - Include only durable, already-known source-bound moments needed to keep the homepage coherent: StartOn proof, one viral/public-voice item, one broadcast, one music item, one research/now object where available.
  - Store source URL, image/fallback, title, category, publisher, layer and year/date.

- [ ] **Step 2: Make `loadHomeProjection` optional enrichment rather than a prerequisite**
  - Initialize display data from `HOME_PROJECTION_BASELINE`.
  - Merge live projection records by normalized source URL.
  - Prefer live records when they contain fresher metadata or a better source image.
  - On API rejection, retain the baseline unchanged.

- [ ] **Step 3: Ensure timeline and recent-publication surfaces also have durable input**
  - `DocumentaryHome` must derive its first render from baseline data and then merge live payload data.

- [ ] **Step 4: Confirm no raw API failure copy is exposed**
  - Failed enrichment should be silent to ordinary visitors.

### Task 3: Replace duplicated homepage layers with one seven-chapter story

**Files:**
- Modify: `src/documentary-home/DocumentaryHome.tsx`
- Modify: `src/documentary-home/LivingFrontDoor.tsx`
- Modify: `src/documentary-home/documentary-home.css`
- Modify: `src/documentary-home/living-front-door-20260903.css`

**Interfaces:**
- Consumes resilient projection from Task 2.
- Produces one homepage narrative with sections `origin`, `service`, `return`, `voice`, `creation`, `ideas`, `now`.

- [ ] **Step 1: Keep exactly one first-fold hero**
  - Full-height Igor visual, concise identity line, cinematic title, one primary `Enter the story` action.
  - Secondary Evidence/Contact/Bro Chat controls become visually subordinate.

- [ ] **Step 2: Remove duplicate homepage product layers**
  - Do not render a second hero/identity block.
  - Remove homepage-only Asset Intelligence and repeated generic media/archive sections when the same job is already performed by the story spine.

- [ ] **Step 3: Render seven story chapters**
  - Each chapter: index number, short title, 1–3 lines of editorial copy, one dominant visual/media object, source action.
  - Use existing real Igor/media assets only.
  - Preserve HE/EN/RU copy.

- [ ] **Step 4: Add one `Recent public signals` rail after the narrative**
  - Show fresh/live records when available; baseline remains if live data is absent.

- [ ] **Step 5: Finish with one archive handoff and Bro Chat invitation**
  - Archive explains depth without dumping the whole corpus into the homepage.
  - Bro Chat is contextual assistance, not a competing primary CTA.

- [ ] **Step 6: Mobile polish**
  - 375px width must preserve hero legibility, chapter order, media aspect ratios and source actions without horizontal overflow.

### Task 4: Add secure Telegram-ready Inbox endpoint

**Files:**
- Modify: `backend/index.ts`

**Interfaces:**
- Produces: `GET /api/telegram/inbox/status`, `POST /api/telegram/webhook`.
- Consumes: AppDeploy `secrets`, `db`, existing `normalizeEvidenceFirstInput`/`extractEvidenceFirstInput` semantics where safe.
- Storage: bounded table `telegram_inbox_pending`.

- [ ] **Step 1: Define Telegram intake types and configuration status**
  - Required secret name: `TELEGRAM_WEBHOOK_SECRET`.
  - Optional allowlist secret: `TELEGRAM_ALLOWED_CHAT_IDS` as comma-separated IDs.
  - Status endpoint returns only booleans/counts, never secret values.

- [ ] **Step 2: Validate webhook authenticity**
  - Read `x-telegram-bot-api-secret-token` from request headers.
  - Use timing-safe comparison against configured webhook secret.
  - Reject missing/invalid secret with 401.

- [ ] **Step 3: Validate sender/chat allowlist**
  - If allowlist is configured, reject chat IDs not present.

- [ ] **Step 4: Normalize message payload**
  - Accept text/caption and public URLs only for the first release.
  - Record Telegram update/message/chat IDs, receivedAt, text, extracted URLs, status `PENDING_REVIEW`.
  - Do not auto-publish and do not call canonical commit from the webhook.

- [ ] **Step 5: Persist one pending intake record**
  - Use `db.add('telegram_inbox_pending', [record])`.
  - Return `{ok:true,status:'PENDING_REVIEW',intakeId}` only.

### Task 5: Deploy once, verify public truth, and perform the visual review

**Files:**
- Modify only changed AppDeploy source files and reconciled `tests/tests.txt`.

**Interfaces:**
- Produces a verified public release and the user-facing visual review.

- [ ] **Step 1: Preflight**
  - Confirm only changed files are sent.
  - Confirm all SDK features used were reviewed.
  - Confirm exactly one `[sanity]` test and changed workflows have Covers entries.

- [ ] **Step 2: Deploy to existing AppDeploy app**
  - Use app id `697a008fddc309b142`.
  - Poll until terminal status.
  - If validation/QA fails, inspect details and auto-fix up to three attempts.

- [ ] **Step 3: Public-domain contract checks**
  - Verify `https://7ya.io/` shows the new narrative structure.
  - Verify `/api/release`, `/api/health`, `/api/public-projection`, `/api/visual-registry`, `/api/telegram/inbox/status` return their expected public JSON contracts where applicable.

- [ ] **Step 4: Pixel review**
  - Capture fresh AppDeploy QA screenshots and independently inspect the public domain on mobile and desktop.
  - Review hero, typography, chapter rhythm, image authenticity, source affordances, clipping, archive handoff and Bro Chat obstruction.

- [ ] **Step 5: Report to Igor**
  - Explain each visible section, its purpose, function, appearance and intended user behavior.
  - Clearly separate completed behavior from any remaining credential-dependent Telegram activation or external platform limitation.
