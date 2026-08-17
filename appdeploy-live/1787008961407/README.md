# 7YA AppDeploy production release — 1787008961407

Status: **READY / E2E PASSED**

Live application: `https://697a008fddc309b142.v2.appdeploy.ai/`

Release marker: `7ya-living-human-os-20260818-1`

## Release intent

This release consolidates 7YA into the approved **LIVING HUMAN OS** architecture:

- **LIFE** — first-person chronology and lived story
- **ECHO** — public media, propagation and influence
- **LAB** — research, competing schools of thought, evidence and open questions
- **BUILD** — StartOn, creation, visitor action and growth

The 7YA AI Companion is now a first-class entry point rather than a late-scroll utility. It is visible from the first screen on desktop and mobile, receives the current LIFE/ECHO/LAB/BUILD navigation context, remains explicitly an AI system rather than Igor himself, and keeps public-source / dated-metric boundaries.

## Home consolidation

The homepage no longer repeats the same material as parallel Knowledge Commons, Life Scenes, longform, music-room and personal-archive blocks. Their useful content remains accessible through the chronology, dedicated depth pages, ECHO/LAB layers and the deep archive.

## Verification

AppDeploy terminal status: `ready`

E2E suite: `passed`

Frontend errors: `0`

Backend errors: `0`

Network errors in QA snapshot: `0`

QA coverage includes immediate desktop AI visibility, contextual LAB conversation, chronology-integrated media/learning, mobile AI availability with simulated `/api/companion` failure, and canonical corpus/research/admin/source-local safety.

## Source-control note

The repository `main` tree predates several AppDeploy production generations. It is intentionally **not partially overwritten** by this release record, because a partial merge would mix incompatible generations. This folder records the verified production state and establishes the reconciliation target for a later full-tree source sync.
