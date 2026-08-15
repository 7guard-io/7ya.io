# 7YA Life-First Home Rearchitecture — Design

**Date:** 2026-08-15
**Status:** Approved direction, implementation pending

## Goal

Rebuild the 7YA home experience so a visitor first **meets Igor Vepretski as a living person and creator**, then chooses depth, and only then opens evidence/provenance. The site must stop reading like a dossier, thesis index, or proof wall while preserving the existing evidence, research, archive, multilingual, and source-safety infrastructure.

## Product principle

**Life first → depth second → proof on demand → user action last.**

The home should feel like entering Igor's world, not opening a catalogue about Igor.

## Non-negotiable constraints

- No collages.
- No fabricated historical imagery presented as evidence.
- No repeated generic portrait used as a substitute for source material.
- Evidence/provenance remains intact and reachable, but does not dominate the default reading path.
- Existing verified relationship semantics remain exact: membership is not sponsorship; proposal is not approval; owner-authored evidence is not independent verification.
- Hebrew, English, and Russian remain first-class.
- Mobile must be a first-class composition, not a compressed desktop page.
- Existing archive/search, research routes, source records, StartOn routes, music/media routes, and influence data are preserved unless a change is explicitly required for the new home.
- AppDeploy is the live execution source of truth; GitHub remains the canonical repository and must be synchronized after validated deployment.

## Recommended approach

Use a **progressive-disclosure rearchitecture** rather than a full rewrite or cosmetic patch.

1. **Life layer:** cinematic, personal, source-backed entry and current activity.
2. **Depth layer:** rooms for feed, life, creation, StartOn, research, influence and archive.
3. **Proof layer:** compact source/evidence controls that expand into provenance details.
4. **User layer:** the experience transitions from Igor to the visitor and offers a concrete next step.

This reuses the strong archive and evidence infrastructure already present while replacing the current dossier-like hierarchy.

## Home information architecture

### 00 — YOU ARE HERE

Purpose: immediate human encounter.

- Large real/source-backed visual or video frame.
- Igor's name and one short human line, not a CV stack.
- Minimal primary actions: enter the world / see what is happening now.
- Evidence badge is available but visually secondary.
- Remove the current "LIVING RECORD / IGOR-001" dossier framing from the top-level first impression.

### 01 — RIGHT NOW

Purpose: prove the site is alive.

- Recent real posts, videos, music, public work, StartOn activity or research updates.
- Prefer connected/live sources where available.
- Every item has source, date and platform, but metadata is not visually louder than the content.

### 02 — ENTER MY WORLD

Purpose: give the visitor a clear mental model.

Rooms:

- LIFE
- FEED / VOICE
- CREATE
- STARTON
- LAB / RESEARCH
- ECHO / IMPACT
- ARCHIVE

Each room is a large editorial doorway using distinct real source imagery or visual language. No numbered thesis index as the primary navigation pattern.

### 03 — LIFE

Purpose: turn biography into lived scenes.

- Kharkiv / immigration / Bat Yam / Holon / Jesse Cohen / service / fatherhood / public work / return.
- Use real press, broadcast, author-owned public material, documents and contextual visuals.
- Timeline becomes supporting navigation, not the main experience.
- Where no historical photo exists, use a clearly labelled source object or designed source poster; never imply it depicts an event it does not depict.

### 04 — THE INTERNET REMEMBERS

Purpose: make influence understandable as movement.

- Show source post → repost/share → comments/reactions → publisher pickup → broadcast/media continuation.
- Keep verified/inferred/unknown states explicit.
- Avoid turning the section into a wall of statistics.

### 05 — CREATE

Purpose: show personality, humour, music and creative range.

- Music videos, collaborations, clips, creator work and selected social content.
- Content-first cards with varied real source imagery.
- Do not bury music below research or CV material.

### 06 — STARTON / RETURN

Purpose: make the social mission emotionally legible before academically explaining it.

Primary framing: Igor returned to where he came from to build access, tools, belonging and opportunity for others.

- Real press/broadcast/project visuals dominate.
- Research framing and partnership status remain available as depth/proof.
- Relationship cards stay contextual; no logo wall.

### 07 — LAB / RESEARCH

Purpose: preserve the academic/intellectual depth without making it the front door.

- The Resonant Self
- SUPERNOAH
- Strategic Sedation
- Gastrocratia
- Opportunity / Adversity

Each object shows question, status, evidence basis, limitations and open questions. Research is explicitly independent where appropriate.

### 08 — YOUR ROOM

Purpose: hand the experience to the visitor.

Prompt: what in your life do you want to turn into growth, creation, contribution or a concrete next move?

- Optional reflection, not a mandatory questionnaire.
- Routes into 7YA conversation, creation tools, community or project-building.
- No invented personal facts.

## Component architecture

### New or refactored units

- `LifeFirstHero` — human/source-backed hero with minimal metadata.
- `NowStream` — recent source-backed activity feed.
- `WorldRooms` — visual doorway navigation.
- `LifeScenes` — editorial biography scenes with source context.
- `EchoPath` — propagation/influence chain.
- `ProofChip` / `ProofDrawer` — progressive provenance disclosure.
- `UserHandoff` — visitor next-step transition.

### Existing units to preserve/reuse

- archive/search datasets and routes
- `LiveSocial`
- `DeepArchiveRiver`
- research data/routes
- relationship registry/status semantics
- multilingual locale system
- evidence/integrity routes
- source-backed media utilities

Large existing home components should be decomposed rather than extended indefinitely.

## Visual system

The target is **editorial/cinematic personal web**, not institutional dashboard.

- Use more full-bleed and asymmetric source imagery.
- Keep typography strong but reduce constant all-caps labels, numbering and ledger treatment.
- Maintain 7YA black/white/green identity as an accent system, not as a blanket UI skin.
- Introduce quieter neutral surfaces where source imagery and human material need breathing room.
- Different rooms may have distinct rhythms while sharing spacing, typography and interaction primitives.
- Avoid repeated black card grids.
- Avoid visual duplication of the same portrait across multiple items.

## Data flow

1. Source registries and live connectors provide content objects.
2. Presentation layer selects a small editorial subset for the home.
3. Each object carries source URL, date, type and evidence status.
4. Default UI shows content first and a compact proof indicator.
5. Proof expansion reveals provenance, status and verification detail.
6. Archive/research routes remain the deep canonical destination.

## Error and fallback behaviour

- External image failure must collapse to a designed source card, not a black hole or broken image icon.
- Missing live data must fall back to last known dated source set and visibly avoid claiming freshness.
- Unknown metrics remain unknown; never coerce to zero.
- Unsupported relationship claims are omitted rather than softened into implication.
- If a visual cannot be tied to the same record, label it contextual or do not use it.

## Mobile composition

Mobile is designed independently around:

- one dominant visual per section
- short copy blocks
- tap-sized room navigation
- no horizontal ledger layouts
- no fixed controls covering media or CTAs
- proof drawers that open vertically
- archive/statistics deferred until after the lived journey

## Acceptance criteria

The release passes only when all are true:

1. First viewport reads as a personal encounter, not a dossier/index.
2. No thesis-style `01 / ORIGIN` index appears before the human entry.
3. Real/source-backed imagery dominates the first three major sections.
4. The same generic portrait is not repeated as a fallback across unrelated cards.
5. Evidence remains accessible from every source-backed object without dominating default reading.
6. StartOn reads first as lived mission, then as research/relationship depth.
7. Music/creator identity is visible before the deep archive.
8. The user handoff is clear and optional.
9. Hebrew/English/Russian render correctly.
10. Mobile and desktop E2E/visual QA pass with no fixed overlap, horizontal overflow, broken-image holes or unreadable proof controls.
11. Existing evidence and relationship semantics are unchanged.
12. Production 7ya.io serves the validated release.

## Rollout strategy

### Slice A — Home hierarchy reset

Replace the first-visit order with Hero → Right Now → World Rooms → Life → Echo → Create → StartOn → Research → Your Room. Keep deep archive below the experiential layer.

### Slice B — Evidence progressive disclosure

Convert loud evidence metadata into proof chips/drawers while retaining exact provenance.

### Slice C — Visual de-duplication and source enrichment

Replace repeated generic portraits with real source visuals or designed source fallbacks.

### Slice D — Production visual QA

Verify desktop/mobile screenshots, RTL, crop quality, fixed controls, fallbacks and live domain.

## Out of scope for this rebuild

- Replacing the evidence oracle backend.
- Rewriting every deep route.
- New claims not supported by current records.
- New authentication or account system.
- Fabricated imagery to fill historical gaps.

## Success definition

A first-time visitor should be able to say, within one scroll:

> I met Igor, I understand that this is a living world rather than a CV, I can see what he is doing now, and I know where to go deeper.

After several sections:

> I understand how the life, creation, public work, StartOn, research and digital influence connect — and I can verify the underlying sources if I want.

At the end:

> The site gives me a next move for my own life rather than ending as a monument to its subject.
