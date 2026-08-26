# 7YA Canonical Homepage Cutover — Design

## Problem
The production homepage has been replaced repeatedly across overlapping home systems while global/mobile CSS layers remain active. The result is split-brain behavior: the current `DocumentaryHome` is conceptually correct, but mobile hero composition, primary Watch behavior, media density, and legacy presentation rules are inconsistent.

## Decision
Keep one production homepage: `src/documentary-home/DocumentaryHome.tsx`. Keep existing deep routes and AppShell/locale infrastructure. Do not introduce another homepage implementation.

## User-visible contract
1. First mobile screen identifies Igor immediately and uses a stable portrait composition rather than viewport-dependent cover cropping.
2. Primary hero commands include Story/Archive, Watch, and Talk.
3. Watch opens an in-site viewer first. The viewer supports embedded YouTube, visible source/provenance, previous/next navigation, close, and an explicit Open Source escape hatch.
4. Impact/proof appears immediately after the hero and does not invent aggregate reach.
5. The homepage exposes a materially varied corpus: press, TV/video, StartOn, personal/life context, social/viral, podcast/music.
6. At least two distinct human/family/life-context visuals appear in the current-life area.
7. StartOn remains a prominent narrative chapter and links to the StartOn route.
8. HE/EN/RU preserve the same information architecture.

## Architecture
- `App.tsx` continues to route the root homepage to `DocumentaryHome` only.
- Homepage styles remain under the `dh-` namespace in `documentary-home.css`.
- Existing global brand/device CSS may style shared chrome but must not impose homepage hero height/crop rules on `dh-*` selectors.
- `visual-corpus.ts` remains the deterministic source for real/fallback media.
- `DocumentaryHome` owns viewer state and opens curated media by index/id.
- External sources are secondary actions, not the default Watch behavior.

## Mobile composition
Use a bounded portrait stage with a 3:4/4:5 visual ratio and focal-point positioning. Avoid `86svh`/`92vh` hero media cover behavior. Copy and commands must remain readable without hiding the subject.

## Verification
The existing AppDeploy QA contract in `tests/tests.txt` already defines the intended red state, especially Test 6 (hero + Watch viewer), Test 7 (impact + mobile Digital Igor), and Test 8 (richer visual corpus). Implementation is complete only after build/runtime checks and live production verification are clean.