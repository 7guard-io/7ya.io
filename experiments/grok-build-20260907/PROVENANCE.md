# Grok Build 2026-09-07 — Provenance Manifest

Classification: 7YA Experimental Lab / Non-Production

## Upstream experimental source

Sandbox URL:
`https://hds-tg07g5umr6p4-6014-ioo8r.grok-code-wild.hades-www.grok-sandbox.com/`

Observed external access behavior: Grok preview-auth redirect. Authenticated app source/render not yet imported.

## Canonical destination

Repository: `7guard-io/7ya.io`
Branch: `experiment/grok-build-20260907`

Production deployment from this staging directory is prohibited unless a later reviewed integration commit passes normal 7YA release gates.

## Import rules

When a Grok source export becomes available:

1. Record original export timestamp, upstream commit/reference if available, framework and package-manager lockfile.
2. Place untouched source only in a temporary review workspace; do not bulk-copy it into runtime directories.
3. Inventory every dependency, network request, environment variable, asset, generated file, route and state store.
4. Run secret scanning before any code is staged.
5. Record licenses/provenance for code and generated/third-party assets.
6. Classify each meaningful module A / B / C / D in the audit document.
7. Port only the minimum A/B implementation into an isolated 7YA module.
8. Bind public claims exclusively to existing canonical 7YA data contracts.
9. Keep any 3D/WebGL implementation optional and lazy-loaded with an accessible non-canvas fallback.
10. Never preserve a Grok sandbox URL as a production dependency.

## Candidate staging structure

Do not create runtime files until source inspection justifies them.

Proposed future integration location:

`src/experiments/grok-life-pulse/`

Potential supporting tests:

`tests/experimental/grok-life-pulse/`

## Current baseline protection

Do not blindly replace:

- `src/documentary-home/DocumentaryHome.tsx`
- `src/life-first/PersonalChronology.tsx`
- `src/EvidenceGraphExperience.tsx`
- `src/InfluenceUniverse.tsx`
- `src/StoryCompanion.tsx`
- `backend/index.ts`
- canonical graph/corpus shared modules

## Current first-slice hypothesis

A spatial/canonical Life Pulse is the highest-leverage candidate because the current Living Pulse is intentionally simple while chronology, evidence semantics, influence integrity and Bro Chat are already mature.

This remains provisional until the Grok implementation is directly inspected.
