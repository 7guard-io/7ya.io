# 7YA Companion Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the 7YA Companion as a production-grade, journey-aware AI guide before any further final website-design/process polish.

**Architecture:** Keep the existing AppDeploy frontend+backend runtime and current `StoryCompanion` surface, but make the Companion an explicit three-mode system: `GUIDE`, `REFLECT`, `BUILD`. Add a small device-local `JourneyContext`, pass only explicit/low-risk context to `/api/companion`, ground Igor/StartOn answers in audited public records, and preserve the existing provider order `appdeploy-agent → NVIDIA → local`. Bot completion is a separate gate; navigation/site-process redesign resumes only after that gate passes.

**Tech Stack:** React 19 + TypeScript + AppDeploy `@appdeploy/client` / `@appdeploy/sdk`, AppDeploy AI run/scrape, localStorage/sessionStorage, existing HE/EN/RU localization, AppDeploy E2E/visual QA.

## Global Constraints

- Companion must disclose that it is AI based on Igor Vepretski's public work and is not Igor himself.
- Modes are exactly `GUIDE`, `REFLECT`, `BUILD`.
- No forced onboarding questionnaire.
- Reflection is optional and must use only explicit user responses / non-sensitive journey interactions.
- Do not store passwords, medical data, minor data, or private third-party data in `JourneyContext`.
- Pre-auth context is device-local; persistent account storage remains behind existing consent/auth boundaries.
- Metrics are dated/source-local; never sum cross-platform reach and never resurrect quarantined exact claims.
- Current audited public baseline governs social numbers: LinkedIn `4K+` rounded public profile; TikTok `12,655 followers / 273,860 likes / 904 exported items` as of 2026-06-02; YouTube `≈2.57K` subscribers; other exact figures only when audit status allows.
- Provider fallback order remains `appdeploy-agent → NVIDIA → local`.
- Companion failure/abort must preserve the draft and journey context.
- HE/EN/RU, RTL/LTR, keyboard Escape/close, mobile safe area, and 44×44 practical touch targets are release blockers.
- No final site/nav/process polish until this plan's Done Gate is green.

---

### Task 1: Canonical Companion contracts and device-local journey context

**Files:**
- Create: `src/companion-contracts.ts`
- Create: `src/companion-context.ts`
- Modify: `src/StoryCompanion.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `type CompanionMode='guide'|'reflect'|'build'`
- Produces: `type JourneyContext={visitedChapters:string[];resonances:Array<{chapter:string;choice?:string;text?:string}>;chosenDirection?:string;lastMeaningfulStep?:string;locale:Locale}`
- Produces: `readJourneyContext(locale)`, `writeJourneyContext(context)`, `mergeJourneyContext(context,patch)`, `clearJourneyContext(locale)`
- Consumes: existing `Locale` and browser storage only.

- [ ] **Step 1: Write the failing E2E requirement**

Add/replace a Companion test in `tests/tests.txt`:

```text
## Test 1 - Companion opens in chapter-aware GUIDE mode and keeps explicit journey context [sanity]
Viewport: desktop
Covers: GUIDE mode, chapter context handoff, device-local context persistence, no generic reset
Description: Verifies a journey-launched Companion knows the exact chapter interaction and resumes it after reload.
Steps:
1. Open ?lang=he&journeyChapter=return&journeyChoice=קושי%20יכול%20להפוך%20למשאב&chat=open
2. Verify the Companion shows GUIDE as the active mode and the first assistant message references RETURN / STARTON and the explicit choice without inventing extra personal facts
3. Close the Companion, reload the same language, and open it again from #talk
4. Verify the saved journey context still contains the return chapter and does not reset to a generic onboarding questionnaire
Expected: GUIDE mode is visible, explicit chapter context survives locally, and the user can continue without starting over.
```

- [ ] **Step 2: Run AppDeploy QA to verify RED**

Expected: FAIL because explicit `GUIDE` mode and canonical `JourneyContext` persistence are not yet user-visible.

- [ ] **Step 3: Add contracts**

Create `src/companion-contracts.ts` with the exact mode/context types and a sanitized companion request shape. Keep all free text bounded to existing UI/backend limits.

- [ ] **Step 4: Add storage helpers**

Create `src/companion-context.ts` using versioned keys `7ya.journey.context.v1.<locale>`. Deduplicate `visitedChapters`, cap resonances to 12, cap reflection text to 500 chars, and never infer context from page content.

- [ ] **Step 5: Wire chapter launch into the context store**

On `journeyChapter` launch, append only the supplied chapter and optional explicit `journeyChoice`. Do not persist query parameters after consumption.

- [ ] **Step 6: Re-run E2E**

Expected: Test 1 passes and existing Companion close/reload behavior remains intact.

- [ ] **Step 7: Commit**

```bash
git add src/companion-contracts.ts src/companion-context.ts src/StoryCompanion.tsx tests/tests.txt
git commit -m "feat: add journey-aware companion context"
```

---

### Task 2: Explicit GUIDE / REFLECT / BUILD mode UX

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify: `src/story-companion.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `CompanionMode`, `JourneyContext` from Task 1.
- Produces: one active mode pill and deterministic transitions: chapter launch → `guide`; reflection action → `reflect`; user direction/action request → `build`.

- [ ] **Step 1: Write failing mode-flow test**

```text
## Test 2 - Companion moves GUIDE → REFLECT → BUILD without forcing a handoff
Viewport: mobile
Covers: three Companion modes, optional reflection, build checkpoint, mobile interaction
Description: Verifies the Companion visibly changes roles while keeping the user in one conversation.
Steps:
1. Open a chapter-launched Companion on mobile and verify GUIDE is active
2. Activate REFLECT and enter a short optional reflection: "אני דוחה רעיון שאני רוצה להתחיל"
3. Verify the reflection appears in the conversation/context and no questionnaire blocks progress
4. Activate BUILD and ask for the smallest proof to create this week
5. Verify the bot returns a concrete checkpoint/next move inside the Companion; Creator Path may be offered but is not required
Expected: The three modes are visible and functional, reflection is optional, and BUILD produces an actionable result in-place.
```

- [ ] **Step 2: Verify RED**

Expected: FAIL because there is no explicit mode control or deterministic mode transition UI.

- [ ] **Step 3: Add a compact mode rail**

Render exactly three controls labeled `GUIDE`, `REFLECT`, `BUILD` beneath the Companion status header. Mode changes must not erase messages or context.

- [ ] **Step 4: Add contextual mode prompts**

GUIDE: source/story questions. REFLECT: one optional short prompt and Skip. BUILD: outcome/next-proof prompts. No multi-step onboarding form.

- [ ] **Step 5: Add mode-aware visual state**

In `story-companion.css`, keep the same visual language but make the active mode unambiguous, touch-safe, and horizontally scroll-free at 320–430 px.

- [ ] **Step 6: Re-run mobile QA**

Expected: mode flow passes; no horizontal overflow/fixed overlap/broken layout.

- [ ] **Step 7: Commit**

```bash
git add src/StoryCompanion.tsx src/story-companion.css tests/tests.txt
git commit -m "feat: add guide reflect build companion modes"
```

---

### Task 3: Backend mode semantics and audited public knowledge

**Files:**
- Modify: `backend/index.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes request: `{messages,state,locale,mode,journeyContext}`.
- Produces response: existing `AgentReply` plus `mode` and optional `contextPatch` / checkpoint.
- Preserves provider order: AppDeploy agent, NVIDIA, deterministic local fallback.

- [ ] **Step 1: Write failing grounded-answer test**

```text
## Test 3 - GUIDE answers from audited public data and BUILD returns a concrete checkpoint
Viewport: desktop
Covers: backend mode semantics, audited metrics, tool grounding, checkpoint generation, provider fallback
Description: Verifies public-profile answers do not repeat quarantined claims and BUILD returns useful action even when the primary provider falls back.
Steps:
1. Open the Companion in GUIDE and ask "כמה עוקבים יש לאיגור בלינקדאין ומה אתה באמת יודע על טיקטוק?"
2. Verify LinkedIn is described as 4K+ / rounded public profile rather than the quarantined exact 4,283 or 326-post claims
3. Verify TikTok may state the dated official baseline 12,655 followers, 273,860 likes and 904 exported items as of 02.06.2026
4. Switch to BUILD and ask "תן לי צעד ראשון לפרויקט לנוער שאני יכול להוכיח השבוע"
5. Verify a concrete checkpoint with at least one executable item is rendered and the answer does not require leaving for Creator Path
Expected: GUIDE is audit-safe and source-aware; BUILD produces a useful in-chat checkpoint under the configured provider/fallback chain.
```

- [ ] **Step 2: Verify RED**

Expected: FAIL because backend public-profile/action catalog still contains quarantined LinkedIn exact figures and does not accept explicit mode/context.

- [ ] **Step 3: Extend backend request/response contracts**

Add `mode` and sanitized `journeyContext` to `CompanionBody`; pass them into the system prompt and state transition logic. Reject/ignore unknown mode values by defaulting to `guide`/current intent, not an error page.

- [ ] **Step 4: Make mode behavior explicit in the system prompt**

GUIDE = answer/find/ground. REFLECT = ask at most one useful reflection question and never infer sensitive facts. BUILD = return a next move/checkpoint whenever the user's request supports action.

- [ ] **Step 5: Replace stale metric copy with audited baseline**

Remove `4,283 followers`, `326 posts`, and any other quarantined exact LinkedIn claims from `surfaces`, `actionCatalog`, and local replies. Use `4K+` dated public crawl. Keep TikTok official dated baseline and YouTube approximate snapshot labeling.

- [ ] **Step 6: Add audit-safe tool result metadata**

Public surface tool results must include `asOf`, verification/status text, and source URL. The model can summarize but may not convert approximate/rounded values into exact values.

- [ ] **Step 7: Ensure BUILD fallback is useful**

Local fallback for BUILD must produce a checkpoint such as `{title:'הוכחה ראשונה',items:['נסח תוצאה אחת','בנה גרסה קטנה','הראה אותה לאדם אחד מהקהל']}` rather than generic routing copy.

- [ ] **Step 8: Re-run E2E**

Expected: grounded metrics and in-chat checkpoint pass under normal and fallback behavior.

- [ ] **Step 9: Commit**

```bash
git add backend/index.ts tests/tests.txt
git commit -m "feat: ground companion modes in audited public data"
```

---

### Task 4: Failure, abort, resume, privacy, and accessibility hardening

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify: `src/story-companion.css`
- Modify: `backend/index.ts` only if a response guard is needed
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing AbortController, device-local session/context.
- Produces: retry-safe draft/context retention and predictable dialog accessibility.

- [ ] **Step 1: Write failing guardrail test**

```text
## Test 4 - Companion abort/close/failure never destroys the user's work
Viewport: mobile
Covers: abort preservation, Escape/close, local resume, privacy disclosure, no fixed overlap
Description: Verifies the bot behaves like a reliable work surface rather than a disposable modal.
Steps:
1. Open the Companion and type a draft message, send it, then use Stop while the response is pending
2. Verify the draft is restored and the prior messages/context remain
3. Close with the X button, reopen, then close with Escape
4. Reopen and verify the saved conversation/journey context still exists on this device
5. Verify the visible disclosure says the Companion is AI, not Igor, and has no live Gmail/Drive/Notion/private-source access; verify no horizontal overflow or fixed-control overlap
Expected: Drafts/context survive abort and close, both close mechanisms work, privacy/identity disclosure is explicit, and mobile controls remain usable.
```

- [ ] **Step 2: Verify RED or expose current weak points**

Use AppDeploy QA transcript as the authoritative reproduction. Do not patch without a reproduced failure.

- [ ] **Step 3: Harden dialog lifecycle**

Keep the close button and Escape equivalent. Preserve `messages`, `JourneyContext`, mode and unsent/restored draft. Do not clear state on close; only Reset clears session/context after the user explicitly activates it.

- [ ] **Step 4: Add focus and mobile safety**

On open, focus the composer or first actionable control; on close, return focus to the trigger. Respect `visualViewport`, safe areas, reduced motion and 44×44 controls.

- [ ] **Step 5: Keep failure recoverable**

If `/api/companion` fails, show one concise retryable assistant message while retaining the user's request and mode/context. Never restart the journey.

- [ ] **Step 6: Re-run mobile guardrail test**

Expected: PASS with zero overlap/overflow regressions.

- [ ] **Step 7: Commit**

```bash
git add src/StoryCompanion.tsx src/story-companion.css backend/index.ts tests/tests.txt
git commit -m "fix: harden companion resume and accessibility"
```

---

### Task 5: Bot Done Gate and release provenance

**Files:**
- Modify: `tests/tests.txt`
- Modify: `backend/index.ts` release metadata
- Create/Update after verified deployment: `appdeploy-live/<snapshot>/README.md` and snapshot source mirror in GitHub

**Interfaces:**
- Produces a binary Companion release decision independent of final website polish.

- [ ] **Step 1: Reconcile the complete 5-test suite**

Keep exactly one `[sanity]` test. Fifth test covers HE/EN/RU mode labels and source/action links while preserving canonical corpus/admin guardrails.

- [ ] **Step 2: Deploy the bot-completion snapshot**

Use AppDeploy deployment rules; poll to terminal status in the same turn.

- [ ] **Step 3: Inspect QA even if deployment says ready**

Acceptance requires: no frontend/backend errors; E2E status `passed`; bot close/abort/mobile tests pass; no stale exact quarantined metrics; source/action links are usable; provider status is visible and fallback is functional.

- [ ] **Step 4: Update release metadata**

Set Companion release metadata to a new explicit bot-complete marker and include modes `GUIDE/REFLECT/BUILD`, provider order, privacy model and current audited metric policy.

- [ ] **Step 5: Mirror verified AppDeploy snapshot to GitHub**

Copy only the verified bot-related changed files plus release README/tests under `appdeploy-live/<snapshot>/` so GitHub records what actually ran.

- [ ] **Step 6: Bot Done Gate**

Mark the bot **DONE** only when all of the following are true:

```text
[PASS] GUIDE answers grounded public questions and opens sources
[PASS] REFLECT uses explicit optional input only
[PASS] BUILD returns a concrete next move/checkpoint in-chat
[PASS] chapter context survives locally and resumes
[PASS] AI-not-Igor + no-private-live-access disclosures are visible
[PASS] audited metrics only; no cross-platform total or quarantined exact values
[PASS] provider order appdeploy-agent → NVIDIA → local works
[PASS] Stop / X / Escape / reopen preserve work
[PASS] HE / EN / RU and mobile/desktop QA pass
[PASS] terminal AppDeploy E2E status is passed with no runtime errors
```

Only after this gate is green does work resume on final site navigation, design, journey-process polish and cross-site process completion.
