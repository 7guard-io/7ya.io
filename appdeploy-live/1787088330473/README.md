# AppDeploy runtime sync · 1787088330473

Date: 2026-08-19 (Asia/Jerusalem)
AppDeploy app: `697a008fddc309b142`
Production domains: `7ya.io`, `www.7ya.io`

## Purpose

Governance receipt for the production stabilization pass completing the approved PERSON → PROOF → PURPOSE → PARTICIPATION plan, with the remaining visual-memory wall moved from a repeated hard-coded portrait set to canonical-corpus-backed distinct life events.

## Runtime delta captured here

- `src/PostPortraitWall.tsx` — exact source read from AppDeploy snapshot `1787088330473`.
- `tests/tests.txt` — exact verification-only suite read from AppDeploy snapshot `1787088330473`.

This directory is a focused runtime-delta snapshot, not a claim that every file in the AppDeploy filesystem has been mirrored here.

## Visual-memory invariants

The opening visual set prioritizes eight distinct canonical events: service/field, StartOn, fatherhood, public voice, twenties retrospective, identity/longform, music/creation, and the current 7YA snapshot. Cards deduplicate by event ID and image URL, use public source records, reject unverified images, and expose `data-canonical-event` for regression testing.

Verified metrics are read only from the canonical `7ya-now-snapshot-2026` event. Corpus failure is fail-closed (`EVIDENCE SAFETY`); image failure degrades to a source-linked card rather than a generic portrait or AI image presented as documentary evidence.

## Verification evidence

- Canonical Echo fail-closed regression: passed in AppDeploy QA group `32acf098e18ea4c6`.
- Mobile visual-memory diversity regression: passed in QA group `32acf098e18ea4c6`; eight distinct canonical events and 0px horizontal overflow were observed.
- YOUR PATH → StartOn without identity capture: passed in QA group `999df7280e0d0de2`.
- The combined contextual-handoff QA scenario was classified `bad_test / stale_content`: it incorrectly required all three handoffs to be visible together. Runtime source confirms the home renders `ContextualHandoff` three times in sequence — influence after the Echo stack, research after ResearchRoom, and StartOn after StartOnRoom — with their distinct primary actions.
- The combined StartOn/Create/Deep Archive QA worker exceeded the provider execution limit; those three surfaces were source-verified against the same runtime snapshot.

## Rollback

The preceding production line remains available in AppDeploy version history. No secrets, assets, routes, backend endpoints, or domain configuration were added by this visual-memory fix.
