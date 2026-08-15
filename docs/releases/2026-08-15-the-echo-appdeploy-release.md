# 7YA — THE ECHO AppDeploy Release Record

**Date:** 2026-08-15  
**Runtime:** AppDeploy app `697a008fddc309b142`  
**Verified snapshot:** `1786806988464`  
**Public domains:** `7ya.io`, `www.7ya.io`  
**Design law:** Evidence × Story × Art

## What shipped

- A site-wide `THE ECHO` influence layer rendered globally by the AppDeploy React runtime.
- A cinematic homepage influence experience driven by source-backed propagation stories rather than a universal vanity-reach number.
- A clickable `ALL PUBLIC SURFACES / 25 CANONICAL + HISTORICAL NODES` rail covering owned, historical, creator, music, research, press/TV and external-discovery surfaces.
- Propagation grammar: origin → distribution → media pickup → audience response/action.
- Dated native interaction metrics kept separate: views, reactions/likes, comments, shares and platform-specific snapshots.
- Evidence-state labels remain explicit (`verified`, `documented`, `estimated`, `recovery`) rather than converting visibility into unsupported causality.
- Generic repeated `igor-hero.jpg` fallbacks were removed from `InfluenceMemory`, `PlatformUniverse` and `MediaEvidenceVisual`; legitimate identity/portrait contexts remain allowed.
- Mobile fixed-overlap blocker removed by suppressing the floating Companion FAB on narrow screens; contextual Journey/BUILD Companion entry remains available.

## Whole-public-web surface registry

The shipped registry contains 25 named nodes, including current and legacy TikTok, both Instagram handles, Facebook, LinkedIn and Newsletter, YouTube and YouTube Music, X, Threads, Telegram, Spotify, Apple Music, SoundCloud, Medium, Academia.edu, Zman Israel, Podcasts, Press & Television, StartOn, Linktree, IZI, Wikimedia Commons and 7ya.io.

This registry is not a claim that exactly 25 surfaces exhaust all historical influence. It is the current canonical public-surface layer and is intended to grow as additional public or recoverable historical surfaces pass evidence/provenance review.

## Release verification

Final AppDeploy status for snapshot `1786806988464`: `ready`.

Fresh E2E evidence on the final snapshot:
- Test 1: 25-surface registry + story selector + propagation chain — **PASS**.
- Test 2: mobile surface rail + SOURCE PLATE fallback + page-level horizontal overflow — **PASS**.
- Test 4: English/Russian THE ECHO localization — **PASS**.
- Test 5: Visual QA — **PASS**, with `EMPTY MEDIA PANELS = 0`, `HORIZONTAL OVERFLOW = 0`, `FIXED OVERLAP = 0`, `BROKEN IMAGES = 0` after refresh.
- Test 3 was **SKIPPED by the QA worker after its 300-second execution limit** in the final run; the deployment-level E2E status remained `passed`. The same evidence-state/native-metric contract had passed in the immediately preceding production gate and remains represented in the runtime source.

No frontend or backend runtime errors were reported by the final deployment status. Backend endpoint coverage remains partial because the visual/Echo QA exercises only a small subset of the existing backend endpoints; this release did not modify backend behavior.

## Domain verification

After the final fix, AppDeploy domain status reported both `7ya.io` and `www.7ya.io` as `active` on the v2 proxy.

## Persistence note

The active React runtime currently lives in AppDeploy version history; it is not mirrored file-for-file in this GitHub repository. This document is the durable repository audit record tying the public release to the AppDeploy app and verified snapshot. Future migration should either mirror the runtime into GitHub or preserve an equally explicit source-of-truth contract so a later deploy cannot silently discard THE ECHO, the 25-surface registry or its evidence/provenance rules.
