# 7YA Personal Marketing Album System — Design

**Date:** 2026-08-21  
**Status:** Implemented on AppDeploy; PR remains draft pending automated browser E2E availability.  
**Repository:** `7guard-io/7ya.io`  
**Branch:** `feat/personal-marketing-album-system`  
**Builds on:** `docs/superpowers/specs/2026-08-15-life-journey-engine-ux-design.md`

## 0. Relationship to the prior Life Journey spec

This specification extends and partially supersedes the presentation layer of the 2026-08-15 Life Journey Engine design. The seven transformation chapters, source-backed evidence rules, privacy/public-safety boundaries, Companion disclosure, poster-first media loading and deep Media/Music/Research/StartOn/Evidence routes remain intact. The homepage's dominant visual grammar is now explicitly Igor Vepretski's personal marketing album.

## 1. Product thesis

7ya.io must feel like **Igor Vepretski's living personal album — curated to market the person, the work, the ideas, the credibility and the invitation to act**.

The canonical experience grammar is:

`REAL MOMENT → PERSONAL MEANING → PUBLIC VALUE → PROOF → NEXT ACTION`

The first-visit journey is:

`MEET IGOR → FEEL THE LIFE → SEE THE WORK → UNDERSTAND THE RANGE → TRUST THE PROOF → SEE WHY IT MATTERS → CHOOSE HOW TO ENGAGE`

Evidence remains available, but it no longer dominates the emotional hierarchy. The story leads; evidence closes the trust gap.

## 2. Product rules

- Personal album first; marketing relevance second; evidence underneath.
- Real Igor/source media first.
- No flattened collages.
- No invented childhood or service photography.
- Documentary before decorative.
- Public-safe personal material only.
- Major claims remain source-linked or explicitly editorial/personal.
- No heterogeneous platform metrics collapsed into one universal reach claim.
- HE RTL and EN/RU LTR remain supported.
- Deep archive/product routes remain accessible.

## 3. Homepage sequence

1. **Cover** — one dominant authentic portrait/source frame, human positioning, Enter the story, Talk/collaborate.
2. **A Life That Became Systems** — concise opening spread previewing Origin, Service, Voice, StartOn and Research/Build.
3. **Seven authored chapters** — Origin, Service, Voice, Create, StartOn, Research, Now.
4. **What This Built in Me** — one capability/public-value bridge in every chapter.
5. **What Moved Beyond Me** — curated source-local public propagation stories, not a vanity-metric wall.
6. **Research bridge** — experience → framework → limits → depth.
7. **Closing spread** — distinct visitor intents for talk/interview, partnership/building, creation and evidence/archive.

## 4. Media behavior

Every chapter uses one dominant authentic/source visual where available. If a visual fails or no verified visual exists, the UI renders an explicit editorial source frame with the source action still visible. It never substitutes an unrelated repeated Igor portrait.

## 5. Navigation

Desktop primary:

- Igor
- Journey
- Impact
- Ideas
- Create

Mobile dock — exactly four destinations:

- Home
- Journey
- Create
- Talk

Full menu preserves Archive, Research, Media, Music, Speaker, Blog, Evidence and StartOn.

## 6. Canon implementation

The first slice is implemented through:

- `src/album/album-data.ts` — typed public-safe HE/EN/RU album records.
- `src/album/AlbumHome.tsx` — authored homepage orchestration.
- `src/album/album.css` — editorial responsive layout.
- `src/App.tsx` — AlbumHome as the default home renderer + SEO descriptions.
- `src/GlobalNav.tsx` — intent-led desktop and four-destination mobile navigation.
- `tests/tests.txt` — personal-album acceptance contract.

## 7. Verification state

AppDeploy deployment version `1787334877640` reached `ready`. Runtime QA reported zero frontend, backend and network errors. Fresh source-contract verification found the required cover, opening spread, value bridge, conversion CTA strings, AlbumHome routing and four-item mobile navigation.

The AppDeploy runner returned `e2e_tests.status = not_found`, so no automated-browser-E2E pass is claimed. PR #299 remains draft on that boundary.

## 8. Final principle

> **Does this make a visitor feel closer to the real person, understand the value more clearly, trust the story more strongly, and know what to do next?**

If not, it does not belong in the personal marketing album.