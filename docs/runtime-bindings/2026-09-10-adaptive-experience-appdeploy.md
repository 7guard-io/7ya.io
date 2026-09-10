# Adaptive Experience Engine — AppDeploy Binding

## Target
App `697a008fddc309b142`, inspected applied snapshot `1789058893488` (v97). This document does not deploy or change production.

## Verified bottleneck
The applied runtime already contains `PersonalProjectionHome`, `PersonalGrowthGateway`, `VisibleCorpus`, `StoryCompanion`, Public Projection and story composition. Homepage composition is fixed. Corpus ranking uses route context. Goal selection is handed to Bro Chat, where intent and scene context already exist. The missing layer is shared intent driving the page itself.

## Decision contract
Use `packages/adaptive-experience/src/experience-engine.ts` as the canonical deterministic contract. At AppDeploy integration time, copy the same logic into `src/experience/experience-engine.ts`; do not fork the rules.

## Runtime bindings

### `src/App.tsx`
Place an `ExperienceProvider` inside the existing locale/theme providers and above `AppContent` and `StoryCompanion`. Default intent is `know-igor`. Restore only `persistentExperienceSnapshot(...)`. Expose current context, `setIntent`, and `recordAction`. Keep the opening Igor experience independent of intent.

### `src/PersonalProjectionHome.tsx`
Keep `PersonalStoryEntry` as the fixed Igor-first entry. Convert eligible sections below it into a keyed registry and render them using `experiencePlan(intent).modules`, with each module rendered at most once. Preserve current deferred/lazy loading.

Intent emphasis:
- `know-igor`: story and featured public assets; primary action `continue-story`.
- `verify`: evidence/influence and source-bound assets; primary action `inspect-evidence`.
- `collaborate`: public work, StartOn and authority/media; primary action `contact-collaborate`.
- `grow`: growth gateway, story bridge and Bro Chat; primary action `open-growth-chat`.

Add one compact HE/EN/RU selector after the fixed Igor entry. Selection must update the module order without navigation, record a bounded event, and persist only the bounded intent state.

### `src/VisibleCorpus.tsx`
Read the current experience intent and add `rankProjectionItem(item,intent)` to the existing ranking. Keep current layer/trust/media safeguards and continue excluding PENDING/profile objects. Never modify source, trust, metrics or evidence fields.

### `src/PersonalGrowthGateway.tsx`
An explicit goal selection sets intent to `grow`. A bounded goal id may be recorded as an action. Optional free-text detail remains session-only for the chat handoff and must not enter persistent experience state or URLs.

### `src/StoryCompanion.tsx`
Add `experience: companionExperienceContext(experienceContext)` beside existing site/journey context in `/api/companion` requests. If an `experiencePatch` is later returned, pass it through `applyExperiencePatch` before changing shared state. Arbitrary patch fields are ignored; invalid intents are rejected.

## Events
Use bounded names only: `experience_intent_selected`, `experience_projection_rendered`, `experience_primary_action`, `experience_intent_changed`. Event targets must be identifiers rather than user-entered text.

## Release gates
Before production apply: `npm run test:adaptive`; verify all four module orders and CTAs; verify default `know-igor`; verify persistence strips free text; verify ranking is intent-sensitive and non-mutating. Then on an AppDeploy candidate verify build, all four functional flows, mobile and desktop visuals, same intent reaching Bro Chat, and unchanged evidence/source labels.

Do not call `deploy_app` or `apply_app_version` until Igor explicitly requests the deployment chain. After that command, apply one candidate and reject/roll back on any P0 functional or visual failure.
