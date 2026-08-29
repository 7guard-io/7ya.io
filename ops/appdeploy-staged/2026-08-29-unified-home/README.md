# 7YA Unified Home Upgrade — 2026-08-29

Status: **STAGED — NOT APPLIED TO PRODUCTION**

## Authority

- Repository: `7guard-io/7ya.io`
- Production app: AppDeploy `697a008fddc309b142`
- Live source baseline inspected: `1788013951183`
- Active Home renderer: `src/documentary-home/DocumentaryHome.tsx`
- Current production release before this candidate: `7ya-cinematic-os-20260828-v1`
- Candidate release marker: `7ya-unified-home-20260829-v1`

GitHub `main` is **not** treated as a deployable runtime source until full AppDeploy reconciliation is complete. This folder is an atomic, reconstructable staging bundle against the inspected live snapshot.

## Why this delta exists

The active production Home already contains strong content and systems, but the hierarchy still duplicates several layers:

- Hero contains more actions in markup than the first-fold design needs.
- Home renders the six-scene story before the primary media proof layer.
- `MediaFrontDoor` is followed later by a second 9-card legacy media grid.
- Hero impact preview is followed by the complete `ImpactFrontDoor`, making methodology compete with the person/story.
- Mobile CSS forces the Digital Igor FAB visible even when StoryCompanion's JS intentionally suppresses it on Home.
- A mobile first-fold override shrinks the portrait to a shallow 26–27svh band, conflicting with the approved cinematic/photo-first direction.

## Staged behavior

### 1. IGOR first

The hero keeps the authentic production portrait and current `getHeroExperience()` headline. The first action cluster becomes exactly:

1. Story / start in 1990 — primary.
2. Evidence — secondary.

Contact and Archive remain in the header/deeper navigation. Watch moves into the media experience. Digital Igor remains available deliberately rather than as first-screen chrome.

### 2. SHOW before explain

Home order becomes:

`HERO → MEDIA FRONT DOOR → SIX-SCENE STORY → COMPACT IMPACT → HUMAN/LIFE → NOW → LIVING ARCHIVE`

The existing `MediaFrontDoor` remains the primary editorial proof surface. The legacy 9-card Home frame grid is not rendered; the full corpus remains in Media and Living Archive.

### 3. Compact impact, full depth preserved

Home shows three separate source-linked classes already supplied by `getHeroExperience()` / `impactUniverse`:

- `7B+` cumulative gross-exposure snapshot;
- `397M+` recorded interactions;
- `47+` countries in the distribution range.

The boundary is explicit: `7B+` is **not unique people**, and cumulative snapshots are a time series, not values to sum together.

The full `ImpactFrontDoor` remains available behind a collapsed disclosure one interaction deeper, and Evidence/Archive remain direct actions.

The canonical 7YA North Star is surfaced in the compact layer:

> להפוך השפעה שכבר נצברה למערכת שמייצרת השפעה אצל אחרים.

### 4. Mobile becomes photographic again

The phone hero is restored to roughly `41–43svh` instead of the shallow 26–27svh first-fold crop, while keeping two clear actions and safe face positioning.

### 5. Digital Igor supports rather than covers the story

The staged override restores StoryCompanion's intended launcher state: a FAB without `.is-visible` stays suppressed. When deliberately opened, the mobile companion becomes a larger, cleaner bottom sheet with the status strip removed and more room for substantive answers.

## Files in this bundle

- `tests.append.txt` — acceptance contract written before the implementation delta.
- `unified-home-20260829.css` — final CSS override to copy to `src/unified-home-20260829.css`.
- `appdeploy-diffs.json` — reconstructable source diffs against live snapshot `1788013951183`.

## Deployment lock

This bundle intentionally does **not** apply an AppDeploy version, merge to `main`, or run the production deployment chain. The standing release gate remains the explicit user command:

`בצע את שרשרת הפריסה`

Until then, production remains unchanged.
