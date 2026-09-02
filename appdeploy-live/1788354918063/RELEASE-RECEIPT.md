# 7YA production receipt — 2026-09-02

AppDeploy app: `697a008fddc309b142`
Applied snapshot: `1788354918063`
Previous applied snapshot: `1788353253803`
Canonical domain: `https://7ya.io/`
Release marker: `7ya-cinematic-os-20260828-v1`

## Change

Homepage critical-path repair. `src/App.tsx` now keeps the active `DocumentaryHome`, locale/theme providers and `StoryCompanion` synchronous while route-only rooms are loaded with `React.lazy`/`Suspense`.

Lazy rooms include Album, Personal Internet, Museum, Media, Music, Speaker, Blog, Create, Growth, Research, diagnostics, social control, corpus inspector, Search, Evidence, Public Library, Entity Graph and StartOn.

## Verification

AppDeploy terminal state: `READY`.
QA after deployment: `0 frontend errors`, `0 backend errors`, `0 network errors`.

## Source authority

This receipt records the production delta and applied snapshot. It is **not** a claim that GitHub contains a complete atomic export of snapshot `1788354918063`.

Runtime source of truth remains the AppDeploy snapshot until a complete source export is committed.

Do not deploy stale GitHub runtime files over production.
