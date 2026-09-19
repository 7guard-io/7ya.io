# Personal Marketing Album Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense 7YA homepage with Igor Vepretski's living personal marketing album while preserving source integrity and the deep archive/product routes.

**Spec:** `docs/superpowers/specs/2026-08-21-personal-marketing-album-system-design.md`

## Global Constraints

- Personal album first; marketing relevance second; evidence underneath.
- Real/source Igor imagery first; no generic AI stand-ins.
- No flattened collages.
- No invented childhood/service photography.
- No private family imagery by default.
- Every major claim remains source-linked or clearly editorial/personal.
- No aggregate vanity reach unless the underlying metric definition supports it.
- Existing Media/Music/Research/StartOn/Evidence routes remain reachable.
- HE RTL and EN/RU LTR remain intact.
- Mobile uses exactly four primary dock destinations.

## Execution status

- [x] Acceptance contract updated before production code.
- [x] Pre-change source check confirmed the new `PERSONAL ALBUM / IGOR VEPRETSKI` marker did not exist.
- [x] Added `src/album/album-data.ts` with typed HE/EN/RU public-safe album records.
- [x] Added `src/album/AlbumHome.tsx`.
- [x] Added `src/album/album.css` with editorial black/cream/acid-green hierarchy.
- [x] Added cover → opening spread → seven authored chapters → public signal → research bridge → conversion closing.
- [x] Added source-preserving media fallbacks; no unrelated portrait is substituted on source failure.
- [x] Switched the default home surface to `AlbumHome`.
- [x] Updated HE/EN/RU home SEO descriptions.
- [x] Changed desktop primary navigation to Igor / Journey / Impact / Ideas / Create.
- [x] Changed mobile navigation to Home / Journey / Create / Talk.
- [x] Preserved full-menu access to archive, research, media, music, speaker, blog, evidence and StartOn.
- [x] AppDeploy version `1787334877640` reached `ready`.
- [x] AppDeploy QA reported zero frontend errors, zero backend errors and zero network errors.
- [x] Fresh deployed-source checks found the album cover marker, opening-spread marker, value bridge and conversion CTA copy.
- [x] Fresh deployed-source checks confirmed `AlbumHome` is the home renderer and the four-item mobile navigation is present.
- [x] Synced implementation source and acceptance contract back to `feat/personal-marketing-album-system` / PR #299.
- [ ] AppDeploy reported `e2e_tests.status = not_found` for version `1787334877640`; therefore automated browser E2E is not represented as passing.

## Verification boundary

The deployment is verified at the build/runtime/source-contract layers. Automated browser E2E remains explicitly unresolved because no E2E job was created by the AppDeploy runner for the deployed version.