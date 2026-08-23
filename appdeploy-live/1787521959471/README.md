# 7YA AppDeploy production-truth repair snapshot

- AppDeploy app id: `697a008fddc309b142`
- Immutable snapshot: `1787521959471`
- Snapshot time: `2026-08-24 00:52:39 Asia/Jerusalem`
- AppDeploy display label at verification: `v98` (rolling label; not immutable provenance)
- Global production release: `7ya-production-truth-20260824-1`
- Production domains: `7ya.io`, `www.7ya.io`

## Exact repair delta

The production-truth repair changed these runtime surfaces across the TDD contract + GREEN deploy sequence:

- `tests/tests.txt` — added Test 8 for the native `/journey/` critical route before route implementation.
- `public/journey/index.html` — added crawlable native Journey route with canonical/hreflang metadata and no meta-refresh.
- `src/App.tsx` — unified frontend global release id.
- `backend/index.ts` — unified backend global release id.
- `index.html` — unified homepage release/build metadata.
- `public/release.json` — unified global release/build marker, added `/journey/`, and corrected the E2E contract to reflect that current AppDeploy QA reports `e2e_tests=null`.

## Verification

Fresh AppDeploy QA after snapshot `1787521959471` returned:

- deployment status: `ready`;
- frontend errors: 0;
- network errors: 0;
- backend errors: 0;
- desktop QA capture: generated;
- mobile QA capture: generated;
- executable E2E result: not reported (`e2e_tests=null`).

Source verification confirmed `public/journey/index.html` exists in this snapshot and the global release id is present in `src/App.tsx`, `backend/index.ts`, `index.html`, `public/journey/index.html` and `public/release.json`.

## Scope boundary

This directory preserves the exact **repair delta and provenance**, not the entire AppDeploy tree. Full text-source parity and binary-resource parity remain pending. GitHub `main` must not be described as deployment-identical until those gates pass.

The frozen pre-repair recovery baseline is `appdeploy-live/1787521286005/`.