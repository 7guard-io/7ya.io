# 7YA Canonical Homepage Cutover — Implementation Plan

**Goal:** stabilize the root 7ya.io experience around one documentary homepage with correct mobile hero composition, in-site Watch, richer real media, and no legacy homepage interference.

**Architecture:** preserve `App.tsx` routing and deep routes; change only the canonical documentary homepage, its scoped CSS/data, and the user-visible QA contract when needed. AppDeploy production snapshot is verified first, then mirrored to the feature branch after QA.

## Task 1 — Establish RED from the existing contract
Files: `tests/tests.txt` (read/verify only unless reconciliation is required).
- Confirm Test 6 requires native portrait composition and in-site Watch viewer with PREV/NEXT/Open Source.
- Confirm Test 7 requires impact before archive and usable mobile Digital Igor.
- Confirm Test 8 requires at least 20 curated records / up to 16 visible diverse records.
- Verify current `DocumentaryHome` does not satisfy at least the Watch/hero contract.

## Task 2 — Canonical hero + commands
Files: `src/documentary-home/DocumentaryHome.tsx`, `src/documentary-home/documentary-home.css`.
- Add/normalize primary Watch action wired to viewer state.
- Keep Story/Archive/Talk available and localized.
- Use stable mobile portrait composition rather than viewport-height cover cropping.
- Keep desktop cinematic composition.

## Task 3 — In-site impact-first viewer
Files: `src/documentary-home/DocumentaryHome.tsx`, `src/documentary-home/documentary-home.css`.
- Open curated media in a modal/dialog.
- Embed YouTube when source is YouTube.
- Add PREV/NEXT, Close, verification/source label and Open Source.
- Keep browser route unchanged while viewer is open.

## Task 4 — Rich media and human context
Files: `src/documentary-home/visual-corpus.ts`, `src/documentary-home/DocumentaryHome.tsx`.
- Preserve source-local metrics.
- Ensure diverse press/broadcast/StartOn/social/music/podcast records.
- Ensure current-life section contains at least two distinct human/life visuals.
- Keep graceful local/public fallbacks for unavailable remote images.

## Task 5 — CSS isolation
Files: `src/App.tsx`, `src/documentary-home/documentary-home.css`, and only implicated shared CSS if proven by selector inspection.
- Do not add another homepage stylesheet.
- Remove or override only selectors that demonstrably collide with `dh-*` homepage behavior.
- Preserve deep-route chrome.

## Task 6 — Verify and mirror
- Deploy to AppDeploy and poll until terminal status.
- Inspect QA errors and runtime logs; automatically repair up to three attempts.
- Verify the public `https://7ya.io` content after ready.
- Mirror validated source changes to `fix/homepage-canonical-cutover-20260827`.
- Do not merge/push deployment-chain changes to `main` unless the explicit production-chain command is given.