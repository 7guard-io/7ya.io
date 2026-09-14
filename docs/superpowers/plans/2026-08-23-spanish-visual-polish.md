# Spanish + Visual Polish Implementation Plan

> **For agentic workers:** implement as one provenance-preserving AppDeploy release; do not reconstruct production from stale GitHub source.

**Goal:** Add a real Spanish public entrance and improve shared visual resilience without removing canonical content.

**Architecture:** Keep the existing React HE/EN/RU locale contract intact. Add `/es/` as a dedicated static LTR gateway, expose it from the shared language switcher, add SEO discovery, and apply additive route-safe CSS rather than broad component rewrites.

**Global constraints:** Canonical/source media only; no generic or fabricated documentary imagery; no unsupported aggregate metrics; preserve evidence fallbacks; mobile width 375px must not create page-level horizontal overflow; preserve rollback to the pre-release AppDeploy snapshot.

- [x] Add Spanish gateway with hero, life line, public sources, StartOn, research, music and CTA.
- [x] Add ES to the shared language surface without expanding the React Locale union.
- [x] Add `hreflang=es`, sitemap entry and release-language metadata.
- [x] Remove stale automatic VQA error injection from the frontend.
- [x] Add shared wrapping, spacing, image and mobile-menu polish.
- [x] Verify build/runtime status and frontend/backend/network logs; AppDeploy generated fresh desktop/mobile QA screenshots.
- [x] Record rollback to the pre-release AppDeploy snapshot.
- [ ] Independently probe the custom-domain build marker when an external HTTP runner is available; AppDeploy reports both custom domains active.
