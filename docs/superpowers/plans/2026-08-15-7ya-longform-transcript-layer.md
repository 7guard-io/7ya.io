# 7YA Longform Voice & Transcript Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the scale of Igor Vepretski's interviews, podcasts, radio, television and transcript/caption corpus visible inside the Life-First homepage instead of reducing it to a few representative cards or burying it in Media/Archive.

**Architecture:** Reuse `deepMedia` as the canonical longform media registry and add a dedicated `LongformVoice` composition between LIFE and THE ECHO. The component uses a focused selected-record stage plus a compact source index rather than a card wall. Transcript/caption availability is a separate evidence field with conservative statuses: `SRT RECOVERED`, `TRANSCRIPT AVAILABLE`, or `TRANSCRIPT PENDING`; no transcript is invented from a title or summary.

**Tech Stack:** React 19, TypeScript, existing `deep-media-data.ts`, AppDeploy E2E/VisualInspector, existing media route.

## Corpus evidence incorporated

- Canonical public-work index identifies Mindset, Glass Ceilings, Moving Minds, Nadlan & Yerusha, Channel 13, Channel 14, StartOn television, October 7 longform and additional public interviews as verified records.
- Existing runtime `deepMedia` already contains television, podcast, radio-trace and long-form records that are not materially visible on the homepage.
- Owner Instagram export contains SRT caption-file references; the 103FM/Barak Seri tagged reel has a recovered SRT path in the owner export.
- Prior 7YA product strategy calls for dedicated media episode pages with transcript support for SEO and internal linking.

## Constraints

- No invented transcript text.
- A publisher caption is not relabeled as a verbatim transcript.
- `SRT RECOVERED` means an owner export records an SRT artifact; it does not imply editorial review.
- `TRANSCRIPT PENDING` stays explicit where full transcript bytes have not been recovered/reviewed.
- Longform count is derived from canonical records, not a vanity reach total.
- Non-YouTube items without reliable source imagery use designed source plates, not repeated Igor portraits.
- HE/EN/RU and mobile remain first-class.

---

### Task 1: Add a failing longform acceptance test

**Files:**
- Modify: `tests/tests.txt`

- [ ] Replace one slower acceptance test with a focused longform test:

```text
## Test 3 - Voice and longform exposes the real interview corpus and transcript states
Viewport: desktop
Covers: longform interview corpus, podcast/TV/radio source index, transcript-state integrity, section order
Description: Verifies interviews and podcasts are materially visible rather than reduced to a few sample cards.
Steps:
1. Open ?lang=he and locate VOICE / LONGFORM after LIFE and before THE ECHO
2. Verify the section exposes at least 10 distinct source-linked interview/podcast/TV/radio records and includes Mindset, מוחות בתנועה, נדל״ן וירושה, Channel 13 or חדשות 13, and Channel 14 or ערוץ 14
3. Select a longform record and verify its source, date/year, medium and evidence status remain visible
4. Verify transcript/caption states are explicit and include at least one SRT RECOVERED / SRT שוחזר and at least one TRANSCRIPT PENDING / תמלול בהמתנה
Expected: A substantial longform corpus is visible between LIFE and THE ECHO; transcript availability is honest and no missing transcript is represented as complete.
```

- [ ] Deploy tests only and verify RED because `#longform` does not exist in the current runtime.

### Task 2: Implement LongformVoice from the canonical registry

**Files:**
- Create: `src/life-first/LongformVoice.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/WorldRooms.tsx`
- Modify: `src/life-first/life-first.css`

**Interfaces:**
- Consumes `deepMedia` and `DeepMediaItem` from `../deep-media-data`.
- Longform predicate includes all `פודקאסטים`, all `טלוויזיה`, and verified StartOn interview/video IDs `starton-14`, `starton-day`, `starton-13-page`.
- Produces section id `longform`.

- [ ] Filter and de-duplicate canonical longform records by URL.
- [ ] Show one selected source stage with source/title/year/medium/status and source link.
- [ ] Show a compact indexed rail of at least 10 distinct records; source plates replace generic portrait fallbacks.
- [ ] Add medium filters: ALL, TV, PODCAST, RADIO/LONGFORM.
- [ ] Add transcript status map. At minimum `barak-seri-103fm-trace` is `SRT RECOVERED · OWNER EXPORT`; records with no recovered full transcript are `TRANSCRIPT PENDING`.
- [ ] Link `FEED / VOICE` world doorway to `#longform`.
- [ ] Insert `<LongformVoice/>` after `<LifeScenes/>` and before `<InfluenceUniverse mode='cinematic'/>`.

### Task 3: Update QA ordering and transcript integrity checks

**Files:**
- Modify: `src/VisualInspector.tsx`
- Modify: `tests/tests.txt`

- [ ] Set order IDs to `you-are-here → right-now → world-rooms → life → longform → echo → create → starton-return → lab-research → your-room → deep-archive`.
- [ ] Keep overflow, overlap, broken media and repeated-image checks.
- [ ] Ensure no longform source plate is treated as empty media.
- [ ] Deploy and require terminal results for the longform test; do not treat timeout/skipped as proof.

### Task 4: Next transcript-ingestion slice

**Files:**
- Future focused data files under `src/data/transcripts/` after bytes are recovered and reviewed.

- [ ] Inventory all SRT references in owner social exports and map each to its media/post record.
- [ ] Recover actual SRT bytes where the underlying export artifact is accessible.
- [ ] Normalize to timestamped transcript segments without rewriting the words.
- [ ] Mark language and review state.
- [ ] Add per-episode transcript views and search only after source bytes are present.
