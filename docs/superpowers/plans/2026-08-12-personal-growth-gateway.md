# Personal Growth Gateway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a homepage gateway that adapts to anonymous vs returning Growth Path users and hands explicit personal context into the existing Digital Igor Companion without adding a new backend system.

**Architecture:** AppDeploy v96 is the current runtime source-of-truth for this release because the production snapshot contains files absent from GitHub `main`. Add one isolated homepage component plus one stylesheet, wire it into `GalaxyHome.tsx`, and add bounded `sessionStorage` launch-context support to `StoryCompanion.tsx`. Reuse existing AppDeploy auth and `GET /api/growth/profile`; no new backend routes or schemas.

**Tech Stack:** React 19, TypeScript, Vite, `@appdeploy/client`, AppDeploy auth/API, existing HE/EN/RU locale helpers, CSS.

## Global Constraints

- Product promise: **Igor’s story → your story → your next move.**
- Reuse existing `StoryCompanion`, Creator Path, Growth Path, auth and `/api/growth/profile`.
- No new persistent user graph schema.
- No new public profiles, feeds or rankings.
- Goal + optional detail must use `sessionStorage`, not URL query text.
- Saved Growth Path remains private and auth-gated.
- Existing adult/minor boundary remains unchanged.
- HE / EN / RU required.
- Minimum 44px touch targets, visible keyboard focus, no mobile horizontal overflow, reduced-motion support.
- No new external assets or third-party AI provider.
- All existing AppDeploy E2E tests must remain green and runtime error arrays empty.
- Previous AppDeploy version must remain available for rollback.

---

### Task 1: Add anonymous and returning-user gateway

**Files:**
- Create in AppDeploy snapshot: `src/PersonalGrowthGateway.tsx`
- Create in AppDeploy snapshot: `src/personal-growth-gateway.css`
- Modify in AppDeploy snapshot: `src/GalaxyHome.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `auth.isSignedIn()`, `api.get('/api/growth/profile')`, `useLocale()`, `pageHref('growth', locale)`.
- Produces: browser-local launch payload under `7ya.personal.launch.v1.<locale>` with shape `{mode:'new'|'returning',goal?:string,detail?:string,title?:string,next?:string,mpeCount?:number}`.

- [ ] **Step 1: Add the changed-behavior E2E test before implementation**

Update the first homepage test so mobile QA requires:

```text
## Test 1 - Anonymous personal gateway opens contextual Digital Igor [sanity]
Viewport: mobile (375x667)
Covers: homepage personal gateway, explicit goal selection, browser-local launch context, companion handoff, mobile stacking
Description: Verifies a new visitor can choose a growth goal on the homepage and enter Digital Igor with context without leaking free text into the URL.
Steps:
1. Navigate to the app with ?lang=he
2. Scroll to the personal gateway and confirm "מה אתה מנסה לשנות עכשיו?" is visible
3. Choose "קריירה"
4. Enter "אני לא יודע מה הצעד הבא שלי" in the optional blocker field
5. Activate "לדבר עם Digital Igor"
6. Confirm the Companion owns the mobile viewport and its first message refers to the Career/קריירה focus
7. Confirm the current browser URL does not contain the blocker text
Expected: The anonymous visitor enters Digital Igor with a contextual first message, private launch detail remains out of the URL, and the mobile experience has no navigation overlap or horizontal overflow.
```

Expected before implementation: FAIL because the personal gateway does not exist.

- [ ] **Step 2: Create `PersonalGrowthGateway.tsx`**

Implement these exact states:

```ts
type LaunchPayload={mode:'new'|'returning';goal?:string;detail?:string;title?:string;next?:string;mpeCount?:number};
type GrowthProfileResponse={profile?:{plan?:{title?:string};currentNextAction?:string}|null;mpeCount?:number};
```

Behavior:
- on mount, if `auth.isSignedIn()` then call `api.get('/api/growth/profile')`;
- if response contains a profile, render returning state with plan title, `currentNextAction`, MPE count, `My Growth Path` link and `Talk to Digital Igor` action;
- if auth is false, request fails, or no profile exists, render anonymous state;
- anonymous goal ids: `career`, `money`, `create`, `learn`, `project`, `unsure`;
- optional detail max length: 280 characters;
- on launch, write JSON to `sessionStorage` key `7ya.personal.launch.v1.<locale>` inside try/catch;
- navigate with `window.location.href='./?lang='+locale+'&chat=open&personal=1'`;
- do not place goal detail in the URL.

- [ ] **Step 3: Create `personal-growth-gateway.css`**

Required CSS characteristics:
- graphite/dark-glass panel distinct from archive sections;
- responsive 2-column desktop / 1-column mobile;
- 44px+ controls;
- selected goal state visible without relying only on color;
- explicit `:focus-visible` outlines;
- `@media (prefers-reduced-motion: reduce)` disables nonessential transitions;
- no fixed width that can overflow 375px viewport.

- [ ] **Step 4: Wire the component into `GalaxyHome.tsx`**

Add exactly:

```ts
import PersonalGrowthGateway from './PersonalGrowthGateway';
```

Place:

```tsx
<PersonalGrowthGateway/>
```

after `<IgorExperience/>` and before archive-heavy depth sections.

- [ ] **Step 5: Run AppDeploy validation/deploy and verify the test fails only if Companion context is still missing**

Expected intermediate state: homepage gateway renders, but Test 1 may still fail at contextual first-message assertion until Task 2 is implemented.

---

### Task 2: Add bounded personal launch context to Digital Igor

**Files:**
- Modify in AppDeploy snapshot: `src/StoryCompanion.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `sessionStorage['7ya.personal.launch.v1.<locale>']` created by Task 1.
- Produces: contextual first assistant message; clears launch payload after consumption; existing `/api/companion` request contract unchanged.

- [ ] **Step 1: Add launch payload reader**

Add a helper with exact behavior:

```ts
type PersonalLaunch={mode:'new'|'returning';goal?:string;detail?:string;title?:string;next?:string;mpeCount?:number};
const launchKey=(locale:Locale)=>'7ya.personal.launch.v1.'+locale;
function consumePersonalLaunch(locale:Locale):PersonalLaunch|null{
  try{
    const raw=sessionStorage.getItem(launchKey(locale));
    if(!raw)return null;
    sessionStorage.removeItem(launchKey(locale));
    const value=JSON.parse(raw) as PersonalLaunch;
    return value&&value.mode?value:null;
  }catch{return null}
}
```

- [ ] **Step 2: Add localized contextual greeting builder**

Implement a pure helper that:
- for `mode:'new'`, names the selected goal and asks for the smallest useful next move;
- for `mode:'returning'`, references the saved `next` action and offers continue/revise/unblock;
- never echoes more than 160 characters of `detail`;
- falls back to existing `c.first` when launch data is absent or invalid.

- [ ] **Step 3: Seed the Companion only on explicit personal launch**

When `personal=1` and a valid launch payload exists:
- open Companion normally;
- initialize the assistant message with the contextual greeting;
- preserve existing persisted conversation behavior for all ordinary launches;
- remove `personal` query param when the panel closes through existing URL cleanup logic or the first safe URL normalization pass;
- do not alter `/api/companion` payload shape.

- [ ] **Step 4: Re-run Test 1**

Expected: PASS; the contextual first message appears and free text is absent from URL.

---

### Task 3: Verify returning Growth Path personalization

**Files:**
- Modify: `tests/tests.txt`
- No new production file required unless QA exposes a defect.

**Interfaces:**
- Consumes: existing authenticated Growth Path fixture/state supported by current Tests 9–10.
- Produces: acceptance proof that homepage adapts to saved private state.

- [ ] **Step 1: Add a returning-user acceptance test**

Add:

```text
## Test 11 - Returning adult sees private next move on homepage
Viewport: desktop (1280x800)
Covers: authenticated homepage personalization, GET /api/growth/profile, currentNextAction, MPE count, private Growth Path continuation
Description: Verifies a signed-in adult with a saved Growth Path gets a private returning state instead of the generic gateway.
Setup:
1. Create and save a Growth Path through the existing Creator Path adult flow
2. Record one progress event in My Growth Path
Steps:
1. Navigate to the homepage with ?lang=en
2. Scroll to the personal gateway
3. Confirm the saved plan title or direction is shown
4. Confirm the saved current next action is shown
5. Confirm the MPE count is visible
6. Open My Growth Path from the gateway
Expected: The homepage privately resumes the authenticated adult’s saved direction and next action without exposing a public profile or feed.
```

If AppDeploy enforces a 10-test ceiling for the existing suite, consolidate this coverage into the current adult Growth Path test instead of increasing the count.

- [ ] **Step 2: Run full AppDeploy E2E suite**

Required final evidence:
- every test passes;
- frontend errors `[]`;
- backend errors `[]`;
- network errors `[]`;
- backend endpoint coverage remains 100% for declared app-owned endpoints.

---

### Task 4: Publish and preserve rollback

**Files:**
- AppDeploy version metadata only.

**Interfaces:**
- Consumes: verified AppDeploy snapshot from Tasks 1–3.
- Produces: ready live deployment and known rollback version.

- [ ] **Step 1: Record pre-deploy rollback version**

Current baseline at plan creation: AppDeploy v96 / snapshot `1786561247312`.

- [ ] **Step 2: Deploy only changed files**

Use AppDeploy incremental diffs/content according to its current deploy instructions. Do not resend unchanged source files.

- [ ] **Step 3: Poll until terminal status**

Continue `get_app_status` until `ready` or `failed`; `deployed_and_testing` is not final.

- [ ] **Step 4: Inspect final QA evidence**

Confirm:
- E2E status `passed`;
- no runtime error arrays contain entries;
- QA screenshots exist for web and mobile;
- no rollback is required.

- [ ] **Step 5: Leave GitHub provenance explicit**

Do not pretend GitHub `main` now contains the full production runtime. The branch contains the design and implementation plan; full runtime export/reconciliation remains a separate control-plane task.
