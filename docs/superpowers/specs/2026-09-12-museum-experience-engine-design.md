# 7YA Museum Experience Engine — Design

**Date:** 2026-09-12
**Owner:** Igor Vepretski / 7YA
**Scope:** First production vertical slice for `/museum`

## Purpose

Turn the existing digital museum from a mostly static depth page into an interactive, source-bound life-story experience. The museum must make the visitor feel a long personal journey first, while keeping proof and dated impact one click away.

## Product rule

**70% story / emotion, 30% proof / data.** Story earns attention; evidence earns trust.

## Architecture

The Museum Experience Engine is a consumer of the existing unified public content path. It does not create a new truth store.

```text
Public Projection + Media Impact
        ↓
Museum narrative adapter
        ↓
Verified story spine
        ↓
Interactive question / reveal
        ↓
Moment view: story + source + dated impact
```

### Source of truth

- `/api/public-projection` supplies public content, canonical IDs, source URLs, visuals, trust status and source-local metrics.
- `/api/media-impact` supplies public-safe dated impact records.
- Canon and Evidence Ledger remain authoritative upstream systems.
- The museum stores no independent biography or metric authority.

## First production slice

The first release adds one interactive story experience near the top of `/museum`.

### Story spine

The experience attempts to resolve these canonical chapters from Public Projection in order:

1. `origin-belonging-1990s`
2. `service-field-2011-2021`
3. `starton-return-2022`
4. `fatherhood-viral-2023-02-20`
5. `life-music-2025`
6. `7ya-now-snapshot-2026`

Only chapters actually found in the projection are rendered. Missing chapters are skipped rather than fabricated.

### First-person narration

Each resolved chapter receives short first-person editorial narration grounded in the verified public chapter. The narration may connect verified events and explain why the chapter matters, but it may not invent private memories, emotions, quotations or undocumented facts.

### Four-choice interaction

For every chapter except the last, the visitor receives the prompt “What do you think comes next in the documented journey?” with four choices whenever at least four real chapters are available.

Every choice is a real resolved chapter. Distractors are therefore true chapters in the life record, merely not the documented next chapter. A wrong choice must never present a false event.

Correct answer:
- marks the selection as correct;
- reveals the next verified Moment;
- advances progress.

Wrong answer:
- marks the choice as not-next;
- keeps the user in the same chapter;
- allows another attempt.

## Moment view

Each revealed Moment shows:

- year / period;
- chapter title;
- first-person narrative bridge;
- projection summary when available;
- authentic source visual when available;
- platform / publisher;
- trust state;
- direct source action.

## Impact layer

A compact Impact panel displays only public-safe records returned by `/api/media-impact` and only as dated, source-local metrics. It must never sum incompatible platforms into a synthetic total.

Examples include views, reach, followers, likes, subscribers or active users when the endpoint marks the record safe for public claims.

If no public metric exists for a Moment, the UI says so explicitly rather than inventing an impact number.

## Failure behavior

If Public Projection fails or fewer than two story chapters resolve:

- the interactive slice shows a compact unavailable state;
- the existing museum content below remains fully visible and usable;
- no empty full-page loader is allowed.

If Media Impact fails:

- the story still works;
- the Impact panel shows that dated public metrics are temporarily unavailable.

## Mobile

At 375px:

- choices become one-column buttons;
- all tap targets remain comfortably usable;
- no horizontal page overflow;
- source and impact actions remain reachable;
- visual media keeps a stable aspect ratio.

## Non-goals for this release

- no 3D galaxy renderer yet;
- no new ingestion pipeline;
- no new database;
- no social publishing;
- no comments/sentiment inference without authorized comment data;
- no redesign of the homepage or other routes.

## Acceptance

Release is complete only when:

1. `/museum` visibly renders the Story Mode from live Public Projection.
2. A visitor can answer a four-choice question and reveal the next Moment.
3. The revealed Moment has a direct public source.
4. Public-safe dated impact is visibly separated from narrative claims.
5. A simulated Public Projection failure leaves the legacy museum content usable.
6. Desktop and mobile QA show no blocking layout/runtime errors.
7. The canonical `https://7ya.io/museum/` route is verified after deployment.
