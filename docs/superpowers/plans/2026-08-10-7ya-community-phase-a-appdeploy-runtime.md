# 7YA Community Phase A — AppDeploy Runtime Implementation Plan

> **For agentic workers:** This plan supersedes the Netlify/PostgreSQL implementation mechanics in `2026-08-10-7ya-community-phase-a-first-value-loop.md` and its metrics companion for the **live runtime**. The approved product design remains unchanged. Execute with `superpowers:executing-plans` and verify every AppDeploy deployment to terminal status.

**Goal:** Turn the existing value-first 7YA Creator Path into the first persistent 7YA Growth Loop for an adult creator/builder pilot: `Free value → optional save → return → meaningful progress → contribution signal`.

**Why this wedge:** AppDeploy v95 already contains a multilingual Creator Path that delivers a useful plan before contact capture. Rebuilding a parallel `/join` system would duplicate product logic and increase operational entropy. Phase A therefore proves the community loop on the strongest existing cohort first, then generalizes the human model in later phases.

**Current runtime truth (provider-verified 2026-08-10):**
- App: `697a008fddc309b142`
- Applied version label: `v95`
- Applied immutable version: `1786036715511`
- Runtime: React 19 + Vite + AppDeploy backend
- Status: `ready`
- E2E: `10/10 passed`
- Backend endpoint coverage: `16/16 (100%)`
- Runtime release: `7ya-runtime-truth-20260806-1`
- Runtime itself reports `source_alignment: PENDING_GITHUB_EXPORT`
- GitHub issue #287 is stale where it calls version `1785837698202` “v95”; that immutable version is currently listed by AppDeploy as `v79`.

**Tech stack:** Existing React/Vite UI, `@appdeploy/client`, `@appdeploy/sdk` router/database/auth, AppDeploy QA, existing Creator Path and companion.

## Global constraints

- No parallel Netlify/PostgreSQL community backend is introduced into the live runtime.
- Preserve the existing value-before-contact contract.
- Phase A persistent community pilot is adults 18+ only.
- Minors may continue to receive non-persistent public value where safe, but cannot save into the general adult Growth Graph; they receive a protected StartOn/coming-soon path instead.
- Phase A cohort is creators/builders only; Grower/Guide/Catalyst persistence is deferred until the core loop is evidenced.
- Political affiliation is neither requested nor stored.
- No trauma disclosure is required.
- Saved participant data is private and scoped by AppDeploy authenticated `userId`.
- Frontend uses `auth` and `api` from `@appdeploy/client`; backend uses `requireAuth`, `db`, `router`, `json`, `error` from `@appdeploy/sdk`.
- Never return or list another user's profile/progress records.
- Anonymous pre-save metrics contain no email, name, goal text, blocker text, device fingerprint, IP-derived identity, or arbitrary JSON.
- Public Evidence Wall remains separate from private growth data.
- No matching, direct messaging, youth-adult discovery, ranking, streaks, feeds, or gamification in Phase A.
- No production success claim until AppDeploy terminal QA is clean and the public/custom-domain runtime is verified.
- GitHub source alignment remains a separate governance blocker; this feature must not be described as restoring GitHub/runtime parity.

---

## User-visible capability inventory before change

1. **Creator Path public intake** — 4-step multilingual flow: direction, outcome, assets, execution.
2. **Free plan generation** — `/api/creator-path`, no contact details required.
3. **Execution-interest lead capture** — contact details only after plan, explicit consent, `/api/creator-path/interest`.
4. **Public 7YA companion** — separate conversational product; not used as persistence identity.
5. **Global HE/EN/RU locale layer**.

### Phase A adds

6. **Save My Path** after the free result using AppDeploy sign-in.
7. **Adult-pilot eligibility gate** before persistence, not before free value.
8. **My Growth Path** return view with saved plan, current next action and progress history.
9. **Meaningful Progress Event logging**.
10. **Correct / refresh path** without creating duplicate identities.
11. **Privacy-safe anonymous funnel + usefulness feedback**.
12. **Admin-only aggregate pilot metrics**.

---

## Data model (AppDeploy DB)

### `growth_profiles`
One active record per authenticated `userId` during Phase A.

Fields:
```text
userId
email
locale
cohort = creator_builder_phase_a
adultConfirmed = true
kind
outcome
audience
assets[]
needs[]
pace
help
plan { title, promise, firstProof, steps[], tools[], prompts[], risks[], igorConnection }
currentNextAction
profileVersion = growth-v1
createdAt
updatedAt
```

Lookup rule: `db.list('growth_profiles', { filter: { userId } })` with **no `limit` when using a filter**, per AppDeploy database contract. Reject if more than one active record is found; deduplicate before pilot expansion.

### `growth_progress`
```text
userId
profileId
eventType
note (max 500, optional)
createdAt
```

Allowed `eventType`:
```text
action_completed
artifact_created
skill_demonstrated
blocker_resolved
project_started
project_completed
feedback_received
opportunity_obtained
helped_other
```

### `growth_events`
Anonymous or linked coarse operational events:
```text
flowHash
userId? (only after save)
eventName
locale?
kind?
needsCount?
assetsCount?
pace?
help?
usefulness?
createdAt
```

Allowed `eventName`:
```text
path_started
free_plan_rendered
free_plan_feedback
save_started
profile_saved
growth_returned
progress_recorded
path_corrected
```

No free text in this table.

---

## Task A0 — Correct Runtime Governance Truth

**Files / systems:** GitHub issue #287, PR #291 comment only. No runtime code.

- [ ] Record that current AppDeploy `v95 = 1786036715511`; old `1785837698202 = v79`.
- [ ] Record current `ready`, `10/10 E2E`, `16/16 backend coverage`.
- [ ] Keep #287 open because full source export/reconciliation is still incomplete.
- [ ] Do not overwrite `main` from AppDeploy source during this feature.

**Acceptance:** governance records no longer instruct agents to reconcile against the wrong immutable version.

---

## Task A1 — Add Platform Auth Configuration for Growth Persistence

**Files:**
- Create: `appdeploy.auth-login.json`

Use platform auth rather than custom resume tokens.

Required config:
```json
{
  "methods": ["google", "apple", "x"],
  "headline": "שומרים את מסלול הצמיחה שלך",
  "subtitle": "הכניסה נדרשת רק כדי לשמור ולחזור. התוכנית החינמית נשארת זמינה גם בלי חשבון.",
  "style": {
    "mode": "dark",
    "accentColor": "#d9ff4f",
    "backgroundColor": "#080a0d",
    "panelColor": "#10130f",
    "textColor": "#f5f3ea",
    "borderRadius": 18
  }
}
```

No login wall may appear before the free plan is generated.

**Acceptance:** sign-in is invoked only from explicit `Save my path / שמירת המסלול / Сохранить путь` action.

---

## Task A2 — Backend Growth Domain

**Files:**
- Create: `backend/growth.ts`
- Modify: `backend/index.ts`

### `backend/growth.ts` exports
```ts
export type GrowthEventType = 'action_completed'|'artifact_created'|'skill_demonstrated'|'blocker_resolved'|'project_started'|'project_completed'|'feedback_received'|'opportunity_obtained'|'helped_other';
export async function getGrowthProfile(userId:string): Promise<GrowthProfile|null>;
export async function saveGrowthProfile(userId:string,email:string|undefined,raw:unknown): Promise<GrowthProfile>;
export async function recordGrowthProgress(userId:string,raw:unknown): Promise<{profile:GrowthProfile;progress:GrowthProgress[];mpeCount:number}>;
export async function recordGrowthEvent(raw:unknown,userId?:string): Promise<void>;
export async function getGrowthState(userId:string): Promise<{profile:GrowthProfile|null;progress:GrowthProgress[];mpeCount:number}>;
```

### Validation rules
- bounded strings using the existing `clean()` philosophy;
- `adultConfirmed === true` required for save;
- `cohort` forced server-side to `creator_builder_phase_a`;
- never trust client-supplied `userId`, `email`, profile version, or timestamps;
- generated plan arrays are length/size bounded before persistence;
- correction/update replaces the single current profile record using `db.update`, preserving its database `id`.

### Routes added to `backend/index.ts`
```text
POST /api/growth/event                 public, coarse allowlisted payload only
GET  /api/growth/profile               requireAuth()
POST /api/growth/profile               requireAuth()
POST /api/growth/progress              requireAuth()
GET  /api/growth/admin-stats           requireAuth() + admin email allowlist
```

All authenticated data is scoped using `ctx.user!.userId` only.

Admin allowlist for the pilot: `igor.vepretski@gmail.com`.

**Acceptance:** there is no endpoint capable of reading an unscoped list of private participant records to a normal user.

---

## Task A3 — Anonymous Funnel + First-Value Usefulness

**Files:**
- Modify: `src/CreatorPathPage.tsx`
- Backend route from A2

Browser creates one ephemeral `flowId` with `crypto.randomUUID()` and stores it in component state/sessionStorage only for the current flow.

Send coarse events:
```text
path_started
free_plan_rendered
free_plan_feedback
save_started
```

Backend hashes `flowId` using SHA-256 before DB write and never stores plaintext.

Immediately below the free plan hero render:
```text
כמה זה שימושי לך כרגע?
מאוד שימושי / שימושי / ניטרלי / לא שימושי
```

Equivalent localized copy in EN/RU.

**Acceptance:** pre-save analytics cannot reconstruct the user's goal, blocker, identity or device.

---

## Task A4 — Save Existing Free Plan into Growth Profile

**Files:**
- Modify: `src/CreatorPathPage.tsx`

After plan generation, add a distinct community block **before** the paid execution-interest block:

```text
7YA GROWTH PATH
רוצה שהמסלול הזה לא ייעלם?
שמור אותו, חזור אליו, וסמן התקדמות אמיתית לאורך הדרך.
```

Flow:
1. User clicks Save My Path.
2. Confirm `18+` in clear UI.
3. If not adult: no persistence; show protected message and StartOn link.
4. If adult: call `auth.signIn()` only then.
5. After successful auth, `api.post('/api/growth/profile', { adultConfirmed:true, form, plan, flowId })`.
6. Render success + link to `?page=growth&lang=<locale>`.

Do not require saving to access/download/copy the free plan.

**Acceptance:** anonymous free-value contract remains intact; persistence is a voluntary second step.

---

## Task A5 — `My Growth Path` Return View

**Files:**
- Create: `src/GrowthPathPage.tsx`
- Create: `src/growth-path.css`
- Modify: `src/App.tsx`
- Modify: `src/locale.tsx`
- Optional minimal modification: `src/GlobalNav.tsx` only if a discoverable “My Path” entry is needed; do not crowd the primary dock.

New view: `growth` via `?page=growth`.

Behavior:
- if signed out: explain that this page is private and offer sign-in;
- if signed in: `GET /api/growth/profile`;
- no profile: route user to Creator Path to create first value;
- profile exists: show current promise, first proof, next action, plan steps, MPE count, recent progress;
- allow one-click progress-event type + optional note max 500;
- allow “Correct my path” to return to Creator Path with existing state, but do not create a second person identity.

No feed, rank, followers, streaks or public profile.

**Acceptance:** signed-in user sees only their own saved state after refresh and can create a durable MPE.

---

## Task A6 — Admin Aggregate Pilot Metrics

**Files:** backend A2 plus optional diagnostics view extension.

Return aggregate only:
```text
pathStarted
freePlansRendered
feedbackCount
usefulOrVeryUseful
profilesSaved
activeHumans
meaningfulProgressEvents
sevenDayReturners
rates.firstValueUsefulness
rates.saveAfterValue
rates.mpePerActiveHuman
rates.sevenDayReturn
```

Never return:
```text
email
name
outcome
audience
note
full plan
raw flow id
userId list
```

Pilot decision thresholds remain targets for learning, not efficacy claims.

---

## Task A7 — Reconcile AppDeploy E2E Tests

**Files:**
- Replace/update: `tests/tests.txt`

Keep the suite at 3–5 coverage-complete tests for the changed user-visible scope; exactly one `[sanity]`.

Required tests:

### Test 1 — Free plan remains value-first [sanity]
Covers: Creator Path, `/api/creator-path`, no auth/contact prerequisite, mobile workflow.

### Test 2 — Adult saves and returns to private Growth Path
Covers: platform auth, `/api/growth/profile` POST/GET, persistence after navigation/refresh, private user scope.

### Test 3 — Record meaningful progress and retain it
Covers: `/api/growth/progress`, MPE counter/history, durable DB state.

### Test 4 — Minor cannot save to adult Growth Graph
Covers: adult eligibility guardrail, protected youth/StartOn response, no profile creation.

### Test 5 — Existing public identity/companion remains healthy
Covers: critical regression protection and existing backend surface after route changes.

Backend endpoints introduced in this phase must be covered by the user-visible tests or explicitly internal (`growth/admin-stats`).

---

## Task A8 — Deploy as AppDeploy Feature Version and Verify

Preflight before `deploy_app`:
- current v95 source re-read for every file being changed;
- AppDeploy SDK refs loaded for database and auth;
- tests reconciled;
- no frontend `@appdeploy/sdk` import;
- no backend `@appdeploy/client` import;
- changed files only;
- all diffs have unique anchors or use full replacement for new files;
- no user-provided binary resources required;
- no production secret required.

Deploy update to app `697a008fddc309b142` with:
```text
model: GPT-5.6 Sol
intent: feature - persistent 7YA Growth Path pilot
initiator: agent
type: feature
```

After deploy:
- poll `get_app_status` every >=5 seconds until terminal;
- require `ready`;
- require no frontend/backend/network errors;
- require E2E passed;
- if failed, inspect `get_e2e_qa_run_details`, fix and retry up to 3 times;
- record immutable new version and rollback v95 `1786036715511`.

Do not claim GitHub source parity as part of this deployment.

---

## Task A9 — Controlled Pilot Operations

Initial cohort: 20–30 adults from the existing 7YA creator/builder/professional audience. Expand toward 50–100 only after no critical safety/privacy defects.

Daily operating review:
```text
free plans rendered
first-value usefulness
save conversion
returning saved users
MPEs
manual feedback/corrections
support burden
privacy/safety reports
```

Hard stop:
```text
cross-user data exposure
minor persisted into adult graph
auth bypass
private goal/progress exposed publicly
systemic profile corruption
critical misleading advice pattern
```

Only after the loop works do we spec Phase B: Request/Offer, Guides, adult matching and Circles.

---

## Self-review

### What changed from the previous plan
- runtime implementation moved from Netlify/PostgreSQL to the actual AppDeploy React/backend stack;
- custom opaque resume tokens were replaced with platform auth;
- `/join` is not duplicated; existing Creator Path becomes the Phase A wedge;
- pilot cohort narrowed to adult creators/builders to prove the loop efficiently;
- `/growth` is implemented as an SPA view (`?page=growth`) consistent with current routing;
- anonymous metrics remain privacy-safe and measurable.

### What did not change
- value before lead capture;
- human agency;
- MPE/AH north star;
- private/public separation;
- adult/youth trust-zone separation;
- progressive automation;
- no matching until Phase A is proven.
