# 7YA Personal Growth Gateway — Design

## Purpose
Turn the 7YA homepage from an Igor-first historical experience into an Igor-first **personal growth entry point**. The visitor should understand Igor’s story, then immediately receive a clear path for their own next move.

## Product promise
**Igor’s story → your story → your next move.**

The first release must feel personal without creating a second AI stack or weakening the existing evidence/privacy boundaries.

## Current capabilities reused
- `StoryCompanion` already provides HE/EN/RU conversational UX, local conversation memory, suggestions, actions, provider status and `/api/companion` integration.
- `CreatorPathPage` already generates a free personalized creation plan and can save an adult Growth Path after value is delivered.
- `GrowthPathPage` already exposes private saved direction, `currentNextAction`, first proof, MPE count, progress recording and deletion.
- AppDeploy auth and `/api/growth/profile` already provide private persistence.
- Homepage already contains the Igor historical experience introduced in v96.

## Approaches considered

### A. Cosmetic “open chat” redesign
Add a larger chat CTA and futuristic styling only.
- Pros: very low risk.
- Cons: not genuinely personal; does not use saved Growth Path state.
- Rejected.

### B. Adaptive Personal Gateway — recommended
Add a homepage component that adapts to anonymous/new vs signed-in/returning users, reuses the existing Growth Path and launches Digital Igor with browser-local launch context.
- Pros: meaningful personalization, small backend surface, reuses working systems, reversible.
- Cons: first-release personalization is bounded to explicit goals + saved Growth Path state.
- Selected.

### C. Full Growth OS orchestration layer
Build a new long-term profile graph, opportunity engine, planner and proactive agent loop now.
- Pros: maximum future capability.
- Cons: too broad for one safe release; would duplicate and destabilize existing systems.
- Deferred.

## Experience design

### 1. Homepage placement
Place the new gateway **after the living Igor historical section and before archive-heavy depth**. The sequence becomes:

`Igor → Journey → Personal Gateway → Proof / Archive → Depth`

### 2. Anonymous / new visitor state
Show a high-contrast futuristic panel with one question:

**“What are you trying to change right now?”**

Localized choices:
- Career
- Money
- Create
- Learn
- Build a project
- I’m not sure yet

Optional short detail input: “What feels stuck?”

Primary action: **Talk to Digital Igor**.

The selection is stored in `sessionStorage`, not in the URL, so sensitive free text is not exposed in navigation history or analytics query strings.

### 3. Returning signed-in state
If AppDeploy auth is signed in, fetch `GET /api/growth/profile`.

If a saved profile exists, replace the generic prompt with:
- saved plan title / direction,
- `currentNextAction`,
- MPE count,
- action to continue My Growth Path,
- action to talk with Digital Igor about the saved next move.

No public profile, ranking, feed or social comparison is introduced.

### 4. Digital Igor handoff
The gateway stores an ephemeral launch payload in `sessionStorage` and navigates to the existing homepage with `chat=open`.

`StoryCompanion` reads the launch payload on mount/open and uses it only to create a contextual first assistant message. It then clears the launch payload.

Examples:
- New visitor: “You chose Career. Tell me what feels blocked and I’ll help identify the smallest useful next move.”
- Returning visitor: “Your saved next move is X. We can continue from there, revise it, or remove the blocker.”

The launch payload is not automatically persisted to Growth Path data.

## Architecture

### New component: `src/PersonalGrowthGateway.tsx`
Responsibilities:
- determine auth state,
- fetch existing private Growth Path only when signed in,
- render anonymous vs returning state,
- capture explicit goal + optional short detail,
- write ephemeral launch context to `sessionStorage`,
- navigate into `chat=open` or existing Growth Path.

Dependencies:
- `@appdeploy/client` (`auth`, `api`),
- `useLocale`, `pageHref`,
- existing `/api/growth/profile`.

### New stylesheet: `src/personal-growth-gateway.css`
Responsibilities:
- dark glass / graphite visual system,
- strong focus state and touch targets,
- responsive one-column mobile behavior,
- reduced-motion compliance,
- no dependency on new external assets.

### Modify: `src/GalaxyHome.tsx`
Only:
- import `PersonalGrowthGateway`,
- place `<PersonalGrowthGateway/>` after the Igor living-history experience.

### Modify: `src/StoryCompanion.tsx`
Add bounded launch-context support:
- read one ephemeral payload from `sessionStorage`,
- localize a contextual first response,
- clear payload after consuming,
- preserve existing conversation persistence and provider behavior.

No new backend route is required.

## Data handling and privacy
- Goal + optional detail remain browser-local in `sessionStorage` until consumed by the Companion.
- Existing saved Growth Path data remains behind AppDeploy auth.
- No minors are persisted into the adult Growth Graph; existing Creator Path boundary remains unchanged.
- No medical, password, secret or sensitive-data collection is added.
- No public member identity layer is added.

## Error handling
- If auth is unavailable: render anonymous gateway normally.
- If `/api/growth/profile` fails: do not block the homepage; show generic gateway.
- If `sessionStorage` is unavailable: open Companion without launch context.
- If Companion API fails: existing local fallback behavior remains authoritative.

## Localization
HE / EN / RU are required for:
- headline,
- goal choices,
- returning-user labels,
- contextual launch greeting,
- primary/secondary actions.

## Accessibility
- All goal choices are real buttons.
- Keyboard focus must be visible.
- Minimum touch target 44px.
- `aria-live` only for loading/error state where needed.
- Mobile viewport must not horizontally overflow.
- Respect `prefers-reduced-motion`.

## Testing / acceptance
Update AppDeploy `tests/tests.txt` with the smallest changed-behavior coverage:

1. **Anonymous personal gateway [sanity]**
   - mobile,
   - select a goal,
   - open Digital Igor,
   - verify contextual first message and no navigation overlap.

2. **Returning Growth Path state**
   - desktop,
   - existing authenticated saved profile,
   - homepage shows private next move + MPE count,
   - continue action reaches My Growth Path.

3. Existing companion, Creator Path, Growth Path, trust routes and diagnostics tests must continue passing.

## Non-goals for this release
- No new persistent user graph schema.
- No proactive notifications.
- No recommendation marketplace.
- No new public profiles or feeds.
- No replacement of `/api/companion`.
- No new third-party AI provider.
- No removal of archive/evidence depth.

## Success criteria
The release is accepted only if:
- anonymous users get an explicit personal starting point,
- returning adults with saved Growth Paths see their own next move on the homepage,
- Digital Igor opens with context from the chosen/saved goal,
- the context is not leaked via URL query text,
- HE/EN/RU and mobile remain usable,
- all AppDeploy E2E tests pass,
- frontend/backend/network error lists are empty,
- rollback to the previous AppDeploy version remains available.
