# 7YA Life-First Home — AppDeploy Release Receipt

**Release date:** 2026-08-15

## Runtime identity

- AppDeploy app: `697a008fddc309b142`
- Validated AppDeploy version: `1786819253839` (`v98`)
- Release marker: `7ya-life-first-voice-universe-20260815-4`
- QA run group: `992a8e524dc9099a`
- Rollback version: `1786818843640` (`v97`)

## Product shape

The home now uses the approved sequence:

`YOU ARE HERE → RIGHT NOW → WORLD ROOMS → LIFE → VOICE / LONGFORM → THE ECHO → CREATE → STARTON / RETURN → LAB / RESEARCH → YOUR ROOM → DEEP ARCHIVE`

Evidence remains available on demand rather than dominating the first reading path. Existing deep archive, media, research, StartOn, music, creator-path, influence and Companion capabilities are preserved.

## VOICE / LONGFORM provenance

- `17 VERIFIED LONGFORM SOURCE RECORDS` means canonical source-linked longform records in the cleaned registry. It is **not** a claim of 17 unique interviews.
- `27 DIRECT YOUTUBE VIDEO SOURCES` and `2 YOUTUBE PLAYLISTS` come from the owner-curated recovery list.
- `48+ SRT CAPTION REFERENCES` is a conservative minimum from owner social exports. An SRT reference is **not** a complete, edited or reviewed transcript.
- Unknown recovery-list video IDs retain `METADATA RECOVERY` rather than invented titles.

## Fresh verification

AppDeploy QA group `992a8e524dc9099a` completed with five individual jobs, all `succeeded` / `pass`:

1. Life-first hero, Right Now and world rooms — PASS.
2. Mobile visual QA — PASS; `HORIZONTAL OVERFLOW = 0`, `FIXED OVERLAP = 0`, `BROKEN IMAGES = 0`.
3. Voice Universe / Recovery Index — PASS; verified 17 canonical records, 27 direct YouTube sources, 2 playlists, 48+ SRT references and provenance rules.
4. Section order and source-backed Create/StartOn — PASS.
5. Russian visitor handoff and explicit AI identity boundary — PASS.

Runtime error snapshot for this release reported no frontend or backend errors.

## Backend coverage boundary

This was a frontend/home-composition release and introduced or changed no backend endpoints. AppDeploy's backend manifest reports 26 declared endpoints, of which the current homepage E2E workflows exercised 2. This receipt therefore **does not claim full backend API coverage**; the unused endpoints are pre-existing capabilities outside the changed release surface.

## Domain state

Fresh AppDeploy domain check:

- `7ya.io` — active.
- `www.7ya.io` — active.

## Files synchronized from validated runtime

- `src/life-first/LifeFirstHero.tsx`
- `src/life-first/WorldRooms.tsx`
- `src/life-first/ProofDisclosure.tsx`
- `src/life-first/RightNow.tsx`
- `src/life-first/LifeScenes.tsx`
- `src/life-first/LongformVoice.tsx`
- `src/life-first/CreateRoom.tsx`
- `src/life-first/StartOnRoom.tsx`
- `src/life-first/ResearchRoom.tsx`
- `src/life-first/UserHandoff.tsx`
- `src/life-first/LifeFirstHome.tsx`
- `src/life-first/life-first.css`
- `src/App.tsx`
- `src/VisualInspector.tsx`
- `src/DeepArchiveRiver.tsx`
- `tests/tests.txt`

No unrelated AppDeploy runtime drift is included in this synchronization.
