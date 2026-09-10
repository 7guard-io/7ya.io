# Adaptive Experience Engine Design

## Status
Approved by Igor Vepretski on 2026-09-10. Implementation is isolated from production until an explicit deployment-chain command.

## Problem
7YA already contains rich public content, a canonical corpus, Public Projection, Growth Path, Bro Chat, story composition and evidence-aware routing. The failure is architectural: the page composition is mostly static while user intent is learned only inside Bro Chat. More content therefore increases inventory without materially improving relevance, differentiation or conversion.

## Goal
Make the public 7YA experience adapt the existing corpus, evidence, media and actions to the visitor's declared intent, while preserving one source of truth and avoiding a second AI/corpus stack.

## Non-goals
- No new canonical corpus.
- No second AI/router backend.
- No automatic private-data ingestion.
- No anonymous identity fingerprinting.
- No production deployment in this workstream.
- No synthetic impact/reach claims.

## Core model
The site uses one shared `ExperienceContext` with four explicit visitor intents:

1. `know-igor` — understand Igor, story, chronology and major work.
2. `verify` — inspect sources, evidence, impact methodology and provenance.
3. `collaborate` — assess work, speaking, partnerships, StartOn and contact paths.
4. `grow` — use Igor's public experience, Bro Chat and Growth Path to make personal progress.

`ExperienceContext` also tracks locale, source/entry route, current scene, explicit goal/detail when supplied, and a bounded history of meaningful actions. Anonymous context is device-local and contains no hidden identity inference.

## Architecture

### 1. Shared Experience Context
Create a small React context/provider with a pure reducer and deterministic intent ranking. Persist only explicit user choices and non-sensitive navigation/action state in local/session storage. URL query parameters may initialize context when explicitly provided but must not expose free-text personal detail.

### 2. Adaptive composition
`PersonalProjectionHome` stops being a single fixed sequence. It keeps the same canonical components but computes a deterministic projection plan from `ExperienceContext`. The first fold remains personal to Igor; below it, the order and CTA emphasis change by intent.

Default ordering:
- know-igor: story → featured assets → viral/public echo → influence → StartOn → live → chronology → user handoff
- verify: evidence/impact → featured source-bound assets → public echo → chronology → story → StartOn → user handoff
- collaborate: current work/public action → StartOn → authority/media assets → influence/evidence → chronology → user handoff
- grow: personal growth gateway → story bridge → Bro Chat action → selected evidence/examples → StartOn → chronology

The engine reorders existing modules; it does not invent new biography or duplicate content stores.

### 3. Intent-aware corpus ranking
`VisibleCorpus` accepts optional `experienceIntent`. Ranking adds deterministic weights for content type/topic/source according to intent while retaining trust/layer/media-quality weights. Canon/LIVE/LEGACY/DISCOVERY boundaries remain visible and PENDING/profile objects remain excluded from the main projection.

### 4. Bidirectional Bro Chat handoff
Bro Chat receives the same `ExperienceContext` in the existing `/api/companion` request context. Explicit intent changes learned in Bro Chat may emit a small public-safe `experiencePatch` (intent and action target only) which the front end can apply. No private memory or free-text personal detail is written back into global public state.

### 5. One relevant action
Each intent maps to one primary action and at most one secondary action at any adaptive decision point:
- know-igor → continue story / open source
- verify → inspect evidence / source
- collaborate → contact or speaker/StartOn partnership route
- grow → open Bro Chat or Growth Path

### 6. Measurement
Record only bounded, privacy-safe experience events through the existing event infrastructure:
`experience_intent_selected`, `experience_projection_rendered`, `experience_primary_action`, `experience_intent_changed`.
Success is measured as intent → meaningful action, not raw pageview growth.

## UX constraints
- The site must remain visibly Igor-first; personalization must not turn the homepage into a generic SaaS dashboard.
- No onboarding questionnaire. One compact explicit intent selector is enough.
- No collage and no generic stock imagery.
- Existing authentic/source-bound media remains preferred.
- Hebrew, English and Russian copy must remain supported.
- Mobile must not add a persistent control that obscures content or Bro Chat.

## Safety / evidence constraints
- Intent adaptation never changes fact status.
- Canon, LIVE, LEGACY and DISCOVERY labels remain intact.
- No personalized claim may imply knowledge the user did not explicitly provide.
- No automatic publishing or external writes.
- Existing human-approval gates remain unchanged.

## Acceptance tests
1. Four deterministic intents produce four meaningfully different homepage module orders and primary CTAs.
2. Reload preserves an explicit intent choice without persisting free-text detail globally.
3. `VisibleCorpus` ranks different top items for `verify` versus `grow` when a mixed fixture is supplied.
4. Bro Chat request includes the same intent/context currently driving the page.
5. Changing intent does not alter canonical source/trust fields.
6. Default/no-intent experience remains valid and Igor-first.
7. Mobile rendering keeps selector and primary action reachable without covering Bro Chat.
8. No production deployment occurs until the explicit deployment-chain command is given.
