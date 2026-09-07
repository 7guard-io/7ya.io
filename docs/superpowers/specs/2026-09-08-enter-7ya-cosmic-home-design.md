# ENTER 7YA — Cosmic Conversational Home

Date: 2026-09-08
Status: APPROVED DIRECTION / IMPLEMENTATION GATE
Owner: Igor Vepretski
Target: `https://7ya.io/`

## 1. Product thesis

7YA should not introduce Igor through a conventional portfolio homepage. The front door should begin as a sparse, personal, cinematic space centered on one conversational orb. The visitor speaks or chooses a soft entry point; the surrounding universe then reveals the parts of Igor's public story that are relevant to that visitor.

The experience combines three approved concepts:

1. **Journey** — cinematic movement through Igor's life and work.
2. **Universe** — spatial constellations of related public content.
3. **Orb** — one central conversational interface that remains the control surface.

Working product name: **ENTER 7YA**.

North Star: **Every interaction should make the visitor understand Igor a little better than 30 seconds earlier.**

## 2. What changes — and what does not

### Phase 1 changes

- Replace only the root homepage presentation with ENTER 7YA.
- Make conversation the primary interaction rather than a secondary corner widget.
- Reuse the existing StoryCompanion intelligence, journey context and canonical story APIs.
- Surface a small cosmic constellation around the orb.
- Add a cinematic journey rail from origin to now.
- Show a privacy-safe `Your 7YA` summary from session journey state.
- Preserve Hebrew RTL as the primary experience, with equivalent EN/RU behavior.

### Phase 1 does not change

- No rewrite of the canonical corpus.
- No new AI provider.
- No new knowledge-graph backend.
- No changes to the evidence policy.
- No redesign of `/politics`, `/starton`, `/evidence`, `/library`, `/media`, `/research`, `/music`, `/speaker`, or other depth rooms.
- No publication of private records or private-memory personalization.
- No removal of rollback versions.

This is intentionally a **front-door cutover**, not a platform rewrite.

## 3. Existing runtime capabilities to reuse

The applied AppDeploy runtime already contains the core intelligence needed for the product:

- `StoryCompanion.tsx`
  - public-canon-grounded conversation
  - SEE / ALIGN / ACT modes
  - source references
  - story path
  - generated story composition
  - site-scene awareness
  - session persistence
- `companion-context.ts`
  - `visitedChapters`
  - `resonances`
  - `chosenDirection`
  - `lastMeaningfulStep`
- backend endpoints
  - `/api/companion`
  - `/api/story-path`
  - `/api/story-composition`
  - `/api/corpus`
  - `/api/graph/search`
  - `/api/public-internet-graph`
  - `/api/entities`
  - `/api/public-projection`
  - `/api/visual-registry`
  - `/api/intelligence/query`
- canonical story chapters already modeled around origin, service, StartOn, public voice, creation, research and now.

Therefore Phase 1 is primarily a **presentation and orchestration change**.

## 4. User experience

### State A — Arrival

The first viewport is visually quiet.

Visible:

- small `7YA · IGOR VEPRETSKI` identity mark
- language control
- a restrained menu for depth rooms
- central luminous orb
- short disclosure that the conversation is a 7YA AI tool grounded in Igor's public record, not Igor himself
- prompt: `מה הביא אותך לכאן?`
- four soft starts:
  - `להכיר את איגור`
  - `עשייה ושירות`
  - `StartOn`
  - `תפתיע אותי`

The page must not begin with metrics, card grids, archives or a long biography.

### State B — Conversation

Opening the orb makes the conversation the dominant surface.

The existing StoryCompanion remains the intelligence engine. In the homepage presentation it receives a dedicated cosmic/immersive treatment rather than looking like a utility drawer.

The UI must continue to disclose that the speaker is a 7YA AI representation grounded in public evidence. It must never impersonate Igor.

### State C — Universe

A small constellation remains visible around the orb. Initial nodes:

- Origin
- Service
- Public
- StartOn
- Media
- Technology / 7YA
- Creative
- Research
- Record
- Now

Nodes are not decorative tags. Each must lead either into a conversation/journey chapter or a canonical depth room.

Visited or resonant nodes become visually stronger. Unexplored nodes remain quieter. This creates the feeling that the visitor's version of Igor's universe is forming over time.

### State D — Journey

A cinematic rail lets a visitor choose `קח אותי במסע` and move through a canonical narrative:

`Origin → Israel / belonging → Service → Public systems → StartOn → Public voice → Creation / Research → 7YA / Now`

The exact story shown can be composed by existing CANON-ONLY Story Path / Story Composition behavior. No biography may be invented to create narrative smoothness.

### State E — Proof

At any point the visitor can move from story to evidence.

The existing evidence references and `/evidence/` room remain the trust layer. The homepage should expose `מקור / PROVE IT` only when useful; it should not dump the archive into the first viewport.

### State F — Your 7YA

After meaningful exploration, a compact summary appears based only on the browser/session journey state, for example:

- entered through: StartOn
- explored: Service → StartOn → Technology
- current direction: public systems / social impact

This is **behavior-based session personalization**, not external profiling.

The user must have an obvious way to reset/forget the journey.

## 5. Information hierarchy

The root homepage should prioritize:

1. Person
2. Conversation
3. Journey
4. Relevant public work
5. Evidence on demand
6. Current direction
7. Contact / opportunity

Depth routes remain the long-form source of truth.

Minimal top-level navigation target:

- Story
- Universe / Record
- Now
- Contact

Depth links can remain accessible through menu and conversation.

## 6. Frontend architecture

Recommended Phase 1 structure in the AppDeploy runtime:

- `src/enter-7ya/Enter7yaHome.tsx`
  - root experience state and layout
- `src/enter-7ya/CosmicOrb.tsx`
  - central entry/control affordance
- `src/enter-7ya/UniverseConstellation.tsx`
  - topic nodes and journey-aware emphasis
- `src/enter-7ya/JourneyRail.tsx`
  - canonical narrative entry points
- `src/enter-7ya/Your7ya.tsx`
  - session-derived exploration summary/reset
- `src/enter-7ya/enter-7ya.css`
  - all root-home visual treatment, scoped under `.enter-7ya`

Integration changes:

- `DocumentaryHome.tsx` should delegate to `Enter7yaHome` instead of `EngineeringHome`.
- The root-home branch in `App.tsx` must mount `StoryCompanion` so `?chat=open` is functional on `/`.
- `StoryCompanion` may receive a small optional presentation variant such as `variant='cosmic'`; the intelligence and request logic must remain shared rather than copied.
- `companion-context.ts` may emit a same-window `7ya-journey-context-change` event after writes so `Your7ya` can react without page reload.

Do not fork StoryCompanion logic into a second chatbot.

## 7. Visual language

Target: **personal documentary × cosmic field × premium editorial**, not sci-fi dashboard.

Rules:

- deep near-black space rather than saturated blue galaxy wallpaper
- restrained star field and slow parallax; no visual noise
- central orb should feel tactile and luminous
- one strong human image or horizon layer can anchor the space, but Igor must remain human rather than becoming a hologram/avatar
- real existing 7YA media only for story fragments
- no collage wall in the first viewport
- no dense glassmorphism card grid
- typography must stay editorial and readable
- motion must support orientation, not spectacle
- honor `prefers-reduced-motion`

## 8. Mobile contract

Mobile is primary, not a desktop reduction.

At 375px:

- orb remains the dominant control
- no horizontal overflow
- constellation reduces to a navigable orbital rail / compact nodes
- journey steps remain thumb-reachable
- chat composer is always reachable above the keyboard
- no competing global navigation overlays the conversation
- text remains readable without requiring zoom

## 9. Accessibility

- semantic button/link behavior for every constellation node
- visible keyboard focus
- no interaction available only through hover
- reduced-motion alternative
- adequate contrast
- orb has explicit accessible name and AI disclosure
- modal/full-screen conversation retains Escape and focus behavior already present in StoryCompanion

## 10. Privacy and identity boundaries

ENTER 7YA may personalize only from explicit interaction and on-device/session journey state in Phase 1.

Do not infer or expose:

- external identity
- precise location
- private account data
- private family information
- private memory

Required disclosure: the conversational layer is **7YA AI grounded in Igor Vepretski's public record**. It is not the live Igor and cannot invent his private feelings or memories.

## 11. Evidence boundary

- CANON remains authoritative for public biography.
- Discovery remains discovery and must never be silently promoted.
- Generated story composition must remain CANON ONLY.
- Evidence links remain direct and inspectable.
- Metrics are shown only when source-bound and dated under existing evidence rules.

## 12. Release strategy

Because the applied AppDeploy runtime is currently ahead of GitHub `main`, production source alignment is a release prerequisite.

Before production cutover:

1. Preserve the exact currently applied AppDeploy version as rollback.
2. Export/reconcile the current runtime source with GitHub governance state or otherwise produce a provenance-preserving source snapshot accepted by the project contract.
3. Implement ENTER 7YA on a focused source line derived from the applied runtime — never from stale GitHub runtime files.
4. Reconcile `tests/tests.txt` for the changed homepage workflows.
5. Build/deploy a candidate version.
6. Verify terminal AppDeploy `ready` and zero frontend/backend/network errors.
7. Run mobile + desktop visual acceptance for home and chat.
8. Verify canonical depth routes are unchanged and healthy.
9. Probe `7ya.io` itself, not only the AppDeploy origin.
10. Keep the previous applied version as explicit rollback.

## 13. Acceptance tests for Phase 1

### A. Cosmic first fold [sanity]

At mobile width the visitor sees one ENTER 7YA experience with a dominant orb, Igor/7YA identity, AI disclosure and soft starts. No duplicate/legacy Engineering Home hero and no horizontal overflow.

### B. Conversation is the homepage control surface

Opening the orb produces a dominant, readable StoryCompanion experience with SEE / ALIGN / ACT, usable composer, source-aware responses and no competing navigation overlap.

### C. Personal journey state changes the visible universe

Entering at least two journey chapters updates visible exploration state / `Your 7YA`; reset removes that local journey state.

### D. Canonical depth rooms survive the cutover

Existing critical routes such as StartOn, Politics, Evidence, Library, Media, Research and Contact remain reachable and unchanged in their data contracts.

### E. Multilingual/mobile parity

HE/EN/RU share the same interaction architecture with correct directionality, no clipping, and equivalent journey controls.

## 14. Success criteria

The release is successful when a first-time visitor can:

1. understand within seconds that the site is about Igor Vepretski;
2. begin a conversation without hunting for a widget;
3. discover a personally relevant thread of Igor's public record;
4. move from narrative to evidence without losing context;
5. leave with either a clearer understanding, a depth-room path, or a contact opportunity.

The homepage should feel smaller while the underlying world feels larger.
