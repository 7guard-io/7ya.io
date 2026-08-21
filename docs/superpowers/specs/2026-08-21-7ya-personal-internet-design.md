# 7YA Personal Internet — Experience Layer Design

Date: 2026-08-21
Owner: Igor Vepretski
Status: approved direction / implementation-ready
Production app: AppDeploy `697a008fddc309b142`
Applied runtime inspected before design: `1787340269205`

## Purpose

7YA must stop behaving primarily like a well-edited archive and start behaving like a living personal operating system. The existing album, evidence, media, research and StartOn surfaces remain canonical depth layers. The homepage becomes an active experience that answers five questions immediately:

1. What is happening around Igor now?
2. What did a piece of public content cause beyond its original post?
3. How do the people, places, projects, ideas and public records connect?
4. What does StartOn feel like as a system rather than a brochure?
5. What is being built next, and how can a visitor participate?

## Existing state

The applied runtime currently uses `src/album/AlbumHome.tsx` as the homepage. It presents a strong, source-backed linear album: cover, broadcast stream, seven life chapters, source strip, research bridge and participation close. The previous `LifeFirstHome` system and its evidence-aware components remain available in the runtime but are no longer the active home.

The current weakness is not missing content. It is interaction logic: the homepage still moves mostly backward through a curated narrative and treats the present, relationships and future as chapters rather than active navigation states.

## Approaches considered

### A. Full homepage rewrite
Replace AlbumHome with an entirely new component tree and reimplement evidence, media and localization flows.

Pros: maximum design freedom.
Cons: highest regression risk, duplicates mature source/evidence logic, likely breaks the strong personal album already built.

### B. Progressive Living OS — selected
Keep AlbumHome as the Memory layer, add a new `PersonalInternetHome` experience that uses existing canonical components and data where safe, then exposes AlbumHome as a deep-dive surface.

Pros: preserves evidence discipline, minimizes regressions, creates a genuinely different experience, allows incremental QA and rollback.
Cons: requires careful visual hierarchy so the homepage does not become another stacked dashboard.

### C. Separate experimental route
Build `/living/` or `?page=universe` and leave the current homepage unchanged.

Pros: safest rollout.
Cons: fails the product goal because the main experience remains archive-first; users never feel the new operating model unless they discover the hidden route.

## Selected architecture

`App.tsx` continues to own locale, global navigation, diagnostics and companion surfaces. For `home`, it mounts `PersonalInternetHome` instead of `AlbumHome`.

`PersonalInternetHome` is a compositional layer with six independent units:

1. **LivingPulse** — present-tense entry. Shows a compact current-state rail with live public-source access, current build lanes and immediate navigation. It must not fabricate “live” metrics.
2. **HumanEchoMap** — a source-first, emotion-aware echo visualization. It presents documented source paths (post → article / broadcast / institution) and audience-response vocabulary without claiming unverified sentiment counts.
3. **IgorGraph** — an interactive semantic map connecting person, places, public service, fatherhood, StartOn, media, music, research, 7YA and the archive. Nodes navigate to existing routes or page anchors; no sensitive private nodes.
4. **StartOnWalkthrough** — a spatial prototype of the StartOn operating model: Play/Create, Learn/Tools, Transparent Studio, Social/Mentoring and Progress. It explains what a participant does in each room and links to the canonical StartOn surface.
5. **FutureLayer** — forward-looking roadmap that distinguishes current work, target states and participation. Aspirations are labelled as goals, not achievements.
6. **MemoryPortal** — clear handoff into the existing `AlbumHome`, preserving the complete source-backed life narrative.

The page order is intentionally non-linear:

`PULSE → ECHO → GRAPH → STARTON → FUTURE → MEMORY / DEEP ARCHIVE`

The user can enter any layer without consuming the biography first.

## Visual system

The new layer must feel like a calm interactive operating surface rather than a dashboard.

- Full-bleed dark field with restrained grid/light-line treatment.
- One dominant visual idea per viewport; no collage.
- Large typography, short editorial labels, strong whitespace.
- Cards behave as navigable evidence objects rather than decorative tiles.
- Motion is limited to subtle pulse, line tracing, hover/focus expansion and graph activation.
- Mobile must remain first-class with no horizontal overflow.
- Reuse existing authenticated/verified imagery only. Do not introduce AI likeness or generic stock imagery.

## Data and integrity rules

- Existing canonical corpus/evidence APIs remain the truth layer.
- No aggregate reach or sentiment number is shown unless the underlying record carries a verification state and observation date.
- HumanEchoMap may show qualitative reaction categories as interaction vocabulary, but not numerical audience distribution unless sourced.
- FutureLayer must use explicit states: `NOW`, `BUILDING`, `TARGET`, `OPEN QUESTION`.
- StartOnWalkthrough describes the intended program model and must not imply measured outcomes that do not exist.
- Personal/private family, medical, legal, financial and operational-security data remain excluded.

## Localization

Every new public string ships in Hebrew, English and Russian. The interaction model must work in RTL and LTR without changing information hierarchy.

## Accessibility

- Every interactive node is keyboard reachable.
- Graph and echo relationships are duplicated in accessible text, not communicated by lines alone.
- `prefers-reduced-motion` disables non-essential animation.
- Focus states remain visible.

## Failure behavior

- If a source image fails, show a source-labelled text frame rather than a generic replacement.
- If canonical corpus retrieval fails, the homepage remains usable and hides unverifiable quantitative claims.
- If external live feeds fail, LivingPulse falls back to direct source links and static current-work labels.

## Testing

Minimum acceptance gates:

1. Home renders in HE/EN/RU.
2. Mobile width 390px has zero horizontal overflow.
3. No frontend runtime errors.
4. Pulse links reach current public surfaces.
5. Echo cards preserve source URLs and do not show unsourced aggregate numbers.
6. Every IgorGraph node is keyboard reachable and routes correctly.
7. StartOn rooms are understandable without hover.
8. Future items visibly distinguish target from completed work.
9. MemoryPortal opens the source-backed album without losing locale.
10. Existing Museum/Media/Music/Research/Create routes remain unchanged.

## Rollback

AppDeploy version history is the primary rollback mechanism. The current applied runtime must remain available as the immediate rollback target. Repository work is isolated on `personal-internet-20260821` until verification is complete.

## Scope exclusions

This release does not add authentication, persistent visitor profiles, autonomous publishing, private-data ingestion, realtime sockets or unsourced social analytics. Those are separate product decisions.
