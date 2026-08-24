# 7YA — Igor AI + Story Plane Design

**Date:** 2026-08-23  
**Status:** approved design baseline; isolated branch only  
**Production app:** AppDeploy `697a008fddc309b142`  
**Observed live snapshot:** `1787467519973`  

## 1. Product definition

7YA is a living visual biography and public evidence system for Igor Vepretski. It is not a dashboard, résumé, generic personal-brand page, or technical control surface.

The public experience must let a visitor:

1. meet the human before the system;
2. move through life chronologically and emotionally;
3. see authentic photographs, video, writing, people, places and projects;
4. verify material claims without being forced into audit UI;
5. talk to a clearly disclosed AI representation of Igor that can explain, navigate, verify and build with the visitor;
6. reach StartOn, media, research, creation and collaboration through the life story rather than disconnected product cards.

North-star shorthand:

> **ONE IGOR / ONE CANON / ONE VISUAL LANGUAGE / MANY OUTPUTS**

## 2. Governing principles

- **Canon before component.** Dates, roles, metrics, people, places, sources and media provenance must derive from the canonical corpus or a typed canonical projection whenever available.
- **Person before system.** Control-plane concepts must not dominate visitor-facing copy.
- **Evidence behind emotion.** The front end may be cinematic; every material factual claim still has a source path and verification state.
- **First person with disclosure.** The AI may speak in first person when expressing canon-grounded public biography, public work, published ideas and documented methods, but it must never claim to be the live human or fabricate private memories.
- **Real media first.** Authentic public/approved owner media outranks generic/generated imagery for documentary surfaces.
- **No aggregate mythology.** Cross-platform totals, modeled reach or historical scale claims are shown only when their publication gate explicitly allows them.
- **Control plane is private/secondary.** Ingestion labels, OAuth state, provenance recovery, gap queues and operator diagnostics do not belong in the primary story flow.
- **No production success claim without rendered verification.** Build success is not product success.

## 3. Source-of-truth hierarchy

### Level A — Canonical public truth

`shared/canonical-corpus.ts` + validated DB overlay + public-register merge.

The existing v2 schema is retained and extended rather than replaced. It already models:

- canonical date + precision + basis;
- life periods;
- localized title/summary;
- visibility;
- verification state;
- public sources;
- authentic media;
- dated metrics;
- impact signals;
- related events.

### Level B — Canonical entities

`shared/canonical-entities.ts` supplies typed people, places and institutions with truth status and related events.

### Level C — Projections

`shared/content-graph.ts`, story projections, visual registry and chat retrieval are read models of the canon. They must not become independent truth stores.

### Level D — Discovery / forensic / vault

Drive forensic workbooks, discovery CSVs, archived reports and public-web discovery are candidate/evidence layers. They can propose updates but must pass canonical validation/publication gates before becoming visitor claims.

### Level E — Private evidence

Private official records may verify a public fact without exposing the underlying personal document. Public UI receives the verified conclusion and safe public corroboration, not private identifiers or raw files.

## 4. Public architecture

### 4.1 Story Plane

The homepage becomes an editorial journey rather than a stack of internal modules.

Visitor chapters:

1. **NOW** — current human state and recent public activity;
2. **LIFE** — chronological autobiography;
3. **CREATE** — posts, music, writing and creator identity;
4. **STARTON** — lived experience translated into social infrastructure;
5. **IDEAS / LAB** — research, frameworks and open questions;
6. **MEDIA / ECHO** — interviews, third-party coverage, propagation and public response;
7. **ARCHIVE** — deeper evidence and source exploration.

These are visitor concepts. Internal labels such as corpus, provenance, ingestion, source-object, OAuth, recovery queue and control matrix remain outside the default public journey.

### 4.2 Editorial rhythm

Target visual balance: approximately 70% authentic media, 20% editorial typography/story, 10% interface.

A long page must alternate composition instead of repeating one card template:

`hero → full image → short text → video → timeline → document → person → metric → place → quiet/breath → source → current moment`

The system may hold 100+ canonical moments while the public page dynamically selects and weights a smaller editorial sequence. “100 Moments” is a corpus capability, not a requirement to render 100 equal cards.

### 4.3 Visual media policy

Every documentary media surface should carry enough metadata to resolve:

- canonical event;
- source URL;
- capture/publication date and precision;
- authenticity state;
- people/place links when verified;
- usage count or diversity signal.

Near-duplicate detection should use URL canonicalization immediately and perceptual similarity when an asset processing service is available.

## 5. Digital Igor contract

### 5.1 Public identity

Recommended visitor-facing name:

**IGOR / 7YA AI**  
**Talk with Igor**

Persistent disclosure, concise and visible:

> **הגרסה הדיגיטלית שלי — AI שנבנה מהקאנון הציבורי והמאומת שלי.**

Equivalent localized disclosure must exist in English and Russian. The interface must not state that the AI is the live human.

### 5.2 First-person boundary

The agent may use first person for:

- canonical public life facts;
- documented public service chronology;
- StartOn and 7YA work;
- public creative work;
- authored/publicly documented ideas and research;
- public positions or statements when retrieved from an appropriate source;
- explanation of the evidence status itself.

The agent must switch to explicit uncertainty or third-person/source framing for:

- unresolved/contradicted/quarantined claims;
- memories not represented in canon;
- private relationships or private communications;
- sensitive data;
- speculation about motives of third parties;
- legal/medical or other high-stakes conclusions beyond supported information.

Example boundary:

> “בארכיון הציבורי שלי זה מתועד כך…”

is allowed when grounded.

> “אני זוכר ש…”

is not allowed unless an authored/public source explicitly records that memory and the response makes the source basis clear.

### 5.3 Reasoning personality

The voice model should reproduce decision logic, not catchphrases:

1. answer directly;
2. expose the real tension/bottleneck;
3. connect relevant layers instead of flattening them;
4. convert insight into the smallest executable next move when action is useful.

Style: energetic, integrative, intelligent, concise; contextual slang only; no caricature; no imitation of typos.

### 5.4 User modes

Internal routing can preserve GUIDE / REFLECT / BUILD, but visitor-facing affordances should map to goals:

- **EXPLORE** — tell/show the story;
- **VERIFY** — sources, dates, evidence status and methodology;
- **BUILD** — turn a visitor goal into an actionable path;
- **CONNECT** — media, speaking, StartOn, collaboration and contact.

Mode is not a hard wall. The agent should infer intent and let the visitor speak naturally.

### 5.5 Tool contract

The Digital Igor agent should retrieve before making material claims about Igor. Preferred tools:

- canonical corpus search;
- canonical entity search;
- related-event search;
- source/evidence retrieval;
- current public surface reader when freshness matters;
- safe action router;
- story/navigation commands that can focus a chapter, event, person, place, video or source in the UI.

Static duplicate profile/metric tables inside the chat backend should be phased out when the same data exists in canon.

### 5.6 Response provenance

Agent results should carry machine-readable provenance separate from prose:

- canonical IDs used;
- source IDs/URLs;
- truth status;
- metric snapshot date when numeric;
- whether a statement is direct canon, derived projection, current public read or unresolved.

The UI may render this progressively (e.g. “מקורות” drawer) rather than cluttering every answer.

## 6. Canon-driven story projections

Create typed projection helpers instead of hard-coded story facts in components:

- `projectHeroFrames(canon, locale)`
- `projectLifeTimeline(canon, locale)`
- `projectStoryMoments(canon, locale, editorialPolicy)`
- `projectPeople(canon, entities)`
- `projectPlaces(canon, entities)`
- `projectNow(canon, liveSources)`

A component may choose layout, crop/focus and animation; it must not independently redefine a factual date, role or metric already represented in canon.

## 7. Control Plane

The following capabilities remain valuable but should move behind an explicit diagnostics/admin surface:

- discovery library;
- OAuth/provider readiness;
- ingestion provenance;
- metadata recovery;
- source-resolution queues;
- publication gates;
- coverage gaps;
- visual QA diagnostics;
- corpus inspector;
- social control;
- release/source-alignment diagnostics.

The public site may expose evidence state in human language, not operator vocabulary.

## 8. Source reconciliation

### Current known state

- `7ya.io` and `www.7ya.io` route to AppDeploy app `697a008fddc309b142`.
- The observed live source snapshot is newer than the executable GitHub root.
- GitHub contains an older AppDeploy delta snapshot under `appdeploy-live/1787005901326/` and later deployment receipts.
- Production release metadata itself reports source alignment pending GitHub export.

### Required invariant

There must be one canonical code history.

Preferred end state:

1. export/reconstruct the current validated AppDeploy source into a dedicated Git branch/directory without modifying production;
2. compare it with GitHub main;
3. reconcile intentionally;
4. make GitHub the auditable canonical source for future work;
5. deploy only a tested commit/version derived from that source;
6. record AppDeploy version → Git commit mapping in the release manifest.

Until reconciliation completes, no stale root should overwrite the newer live snapshot.

## 9. QA architecture

### 9.1 Executable gates

Add a real test runner and browser E2E layer. Text descriptions in `tests/tests.txt` remain acceptance documentation, not executable proof.

Required gates:

- schema/canon unit tests;
- projection tests;
- agent provenance/first-person boundary tests;
- route smoke tests;
- mobile/desktop E2E;
- visual screenshot checks;
- broken-media/overflow/interaction checks;
- public-copy control-plane leakage test;
- regression comparison to last accepted release.

### 9.2 Visual QA

The visual audit must consume screenshots of the **current candidate version**, never a hard-coded historical screenshot prefix.

Visual judges:

- Creative — unique, premium, human;
- Narrative — story understandable without system knowledge;
- Evidence — claims and media traceable;
- Stranger — who/why/where-next understood quickly;
- Mobile — no squeezed desktop or obstructed chat;
- Regression — candidate is not materially worse than accepted baseline.

### 9.3 Automatic fail conditions

Examples:

- broken image or unresolved media panel in a major story section;
- horizontal overflow on supported mobile widths;
- visitor-facing operator language (`OAUTH NEXT`, ingestion/debug/provenance recovery labels) in primary story flow;
- generic decorative image where an approved authentic documentary asset exists;
- materially repeated image within one story journey when alternatives exist;
- unsupported metric or missing snapshot date;
- first-person AI memory claim not grounded in canon;
- current-version visual QA not executed;
- candidate source not mapped to a Git commit after source reconciliation.

## 10. Privacy and safety

- Private Drive/Gmail/other connected sources are not automatically public-agent tools.
- Vault content is evidence/control input, not a public dump.
- Private official documents can support verification while remaining private.
- Sensitive family/person data requires explicit publication basis and minimization.
- Secret values, tokens and credentials never enter the public corpus or client bundle.

## 11. Non-goals

This design does not:

- replace the existing canonical corpus with a new database;
- turn the homepage into a chat-only interface;
- expose the control plane publicly;
- claim modeled reach as verified audience;
- bulk-publish the Drive vault;
- require a full rewrite before improvements can ship;
- change production from this branch.

## 12. Definition of done

A 7YA release is complete only when:

1. code and canon are aligned;
2. material claims are source-grounded;
3. Digital Igor uses the defined disclosure and first-person boundary;
4. public UI reads as a living human story, not a control dashboard;
5. real media diversity and chronology are preserved;
6. executable tests pass;
7. current candidate screenshots are inspected on mobile and desktop;
8. regression gate passes;
9. production domain is verified after an explicitly authorized deployment.
