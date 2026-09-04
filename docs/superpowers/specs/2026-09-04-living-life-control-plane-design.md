# 7YA Living Life System — Control-Gated Premium Product Design

Date: 2026-09-04
Status: DESIGN FOR REVIEW
Owner: Igor Vepretski
Canonical product: 7YA / LIFE

## 1. North Star

7YA / LIFE is not a biography page and not a dashboard. It is a living human archive that combines premium editorial storytelling, museum-grade evidence, authentic voice, chronology, people/idea graphs and an evidence-grounded archive assistant.

The product must make Igor highly present without turning memory, aspiration, owned copy or marketing language into unsupported historical fact.

Core product sentence:

> Preserve the human being. Verify the evidence. Connect the fragments. Make the lived experience useful to other lives.

## 2. Non-negotiable execution rule

No change is `DONE` because code exists, CI is green, an AppDeploy version is ready, an endpoint returns 200, or a screenshot was generated.

A change is `DONE` only when all applicable gates pass:

`SOURCE → EVIDENCE → BUILD → AUTOMATED QA → LIVE DEPLOY → LIVE DATA → MOBILE VISUAL → DESKTOP VISUAL → ACCESSIBILITY → PUBLICATION GATE → VERIFIED DONE`

If Igor reports that the live result is visually wrong or unchanged, status immediately returns to `FAILED_LIVE_QA` regardless of previous technical success.

## 3. Current architecture boundary

The current AppDeploy production source already contains:

- `backend/corpus-store.ts`
- `backend/evidence-ingestion.ts`
- `backend/life-scenes.ts`
- `public/control/`
- `public/evidence/`
- `public/journey/`
- `public/museum/`
- `public/media/`
- `public/data/evidence-wall.json`
- `public/data/entity-registry.json`
- evidence schemas and existing life-album/evidence-first specs

The Living Life System extends these primitives. It does not create a parallel biography database or duplicate graph.

Critical current defect: production/source drift. Applied AppDeploy source version `1788453751783` is newer than the GitHub production ledger/source representation currently discoverable. New product work must not deepen this drift.

## 4. Product surfaces

### 4.1 `/life/` — premium entry

A cinematic editorial entry into 1990→NOW. One dominant authentic visual per scene. Minimal chrome. The first interaction is time, not a feature grid.

Primary actions:

- Enter the life
- Jump to a year/era
- Hear Igor
- Open proof
- Ask the archive

### 4.2 Timeline

Time is the operating system. Every event has:

- stable event ID
- date/range + precision
- place
- life chapter
- narrative summary
- source IDs
- media IDs
- people IDs
- claim/evidence state
- privacy/publication state
- `THEN` material when contemporaneous material exists
- `NOW` interpretation when explicitly authored later

No false precision is permitted.

### 4.3 THEN / NOW

Signature interaction pairing contemporaneous material with later interpretation.

Rules:

- THEN must be source-bounded and timestamped.
- NOW must be labeled as retrospective interpretation.
- the interface must never visually imply that retrospective text was written at the historical date.

### 4.4 Voice Corpus

Every long-form appearance becomes a structured voice record:

`media → verified transcript → speaker spans → timestamp → topic → claim links → later-position links`

Episode descriptions may establish topics but may not be rendered as direct quotations.

States:

- `MEDIA_MISSING`
- `MEDIA_INCOMPLETE`
- `TRANSCRIPT_PENDING`
- `TRANSCRIBING`
- `TRANSCRIPT_VERIFIED`
- `QUOTE_INDEXED`

Only `TRANSCRIPT_VERIFIED` or `QUOTE_INDEXED` may produce quotation UI.

### 4.5 Evidence Drawer

Every material factual claim exposed in the premium experience must allow evidence inspection.

Minimum fields:

- claim ID
- status
- primary source
- supporting sources
- source class
- observed/published date
- confidence
- contradictions
- publication note

Supported claim states:

- `VERIFIED`
- `CORROBORATED`
- `STRONGLY_SUPPORTED`
- `SELF_REPORTED`
- `DISPUTED`
- `UNRESOLVED`
- `FALSE`

### 4.6 People Graph

People are relationship nodes only when an evidenced edge exists.

No inferred friendship, influence, collaboration or endorsement from mere co-presence or tags.

### 4.7 Ask the Archive

The assistant is a curator over corpus data, not an unrestricted biographical narrator.

Every factual answer must return or internally bind to source/claim IDs. When evidence is mixed, the answer must expose the disagreement. It must distinguish:

- documented fact
- Igor's own account
- third-party interpretation
- unresolved question
- future intent

### 4.8 Private Vault

The public corpus and private preservation layer remain separated.

Visibility states:

- `PUBLIC`
- `PUBLIC_SENSITIVE`
- `PRIVATE`
- `FAMILY`
- `RESTRICTED`

Children, precise addresses, security/police operational detail, raw legal/financial records and sensitive third-party material are private by default.

## 5. Data flow

`FILES / DRIVE / GMAIL / PUBLIC WEB / SOCIAL EXPORTS / MEDIA`

→ discovery
→ provenance capture
→ normalization
→ entity resolution
→ claim extraction
→ evidence classification
→ contradiction detection
→ canonical corpus
→ life timeline / people graph / voice corpus
→ publication gate
→ public presentation

The public UI never reads raw private source systems directly.

## 6. Control Plane

`/control/` becomes the read-only operational truth surface for the product.

It must report five independent dimensions:

1. **Source alignment** — is the deployed source reconstructable from Git?
2. **Corpus integrity** — schema validity, unresolved invalid nodes, evidence coverage.
3. **Experience health** — critical routes, hydration, media resolution, API behavior.
4. **Visual acceptance** — latest mobile/desktop QA evidence for each release.
5. **Publication safety** — no private/restricted record leaked; no unsupported claim promoted.

### 6.1 Release state machine

Allowed release states:

- `DESIGN`
- `IMPLEMENTING`
- `LOCAL_QA`
- `READY_FOR_DEPLOY`
- `DEPLOYING`
- `LIVE_TECH_QA`
- `LIVE_VISUAL_QA`
- `PUBLICATION_REVIEW`
- `VERIFIED_DONE`
- `FAILED_BUILD`
- `FAILED_LIVE_QA`
- `ROLLED_BACK`

Only `VERIFIED_DONE` is green.

### 6.2 Gate record

Each release/gated feature stores:

- feature/release ID
- source commit
- AppDeploy version
- schema version
- affected routes
- evidence migration result
- automated test result
- live endpoint result
- mobile screenshot ref + reviewer state
- desktop screenshot ref + reviewer state
- accessibility result
- privacy/publication result
- final status
- failure reason
- rollback target

## 7. Source-of-truth policy

Git must become reconstructable canonical source before large Living Life changes ship.

Until alignment is complete:

- AppDeploy is the actual runtime source of truth.
- GitHub is the audit/ledger and target canonical source.
- no destructive production refactor is allowed.
- every AppDeploy production change must receive a matching source delta/manifest in Git.

Target state:

`Git commit → CI → deployable source → AppDeploy version → live QA → verified release record`

No undocumented production-only patch is accepted once alignment is restored.

## 8. Premium visual standard

Design language:

`Editorial Luxury × Documentary Cinema × Digital Museum`

Rules:

- no collage-first layouts
- one dominant real/source visual per major moment
- typography and negative space carry hierarchy
- evidence is secondary until requested, but always reachable
- motion is restrained and respects reduced-motion
- avoid generic AI cards and gratuitous gradients
- mobile is a first-class composition, not a compressed desktop page
- a visitor understands time/context within three seconds

## 9. Performance constraints

- Homepage/life-entry critical path must not eagerly load all museum/graph/media code.
- Heavy timelines, graphs and media viewers are route- or interaction-loaded.
- Images use responsive sizes and modern formats where source preservation allows.
- transcript/graph data is paginated or chunked.
- static crawlable narrative/metadata exists for primary routes before hydration.

## 10. Accessibility

Minimum acceptance:

- semantic landmarks/headings
- keyboard navigability
- visible focus
- >=44px practical mobile targets where possible
- contrast suitable for documentary dark mode
- meaningful alt text for historical/source visuals
- transcript alternative for published audio/video where available
- reduced-motion support

## 11. Publication and evidence gates

A public narrative node fails publication if any of the following is true:

- private/restricted source is exposed
- unsupported claim is phrased as verified fact
- verbatim quote lacks transcript/audio verification
- source URL/provenance required by the claim is missing
- image identity/history is materially altered
- exact dates are invented from ranges
- future intent is rendered as achieved outcome
- third-party relationship is inferred without an evidence edge

## 12. Phase decomposition

### Phase A — Control and source alignment

Deliverables:

- execution state machine
- release/gate manifest
- Git/AppDeploy source alignment measurement
- upgraded `/control/` representation
- rollback pointer

Exit criterion: every future feature can be traced from source commit to visual QA.

### Phase B — Canonical Life Corpus integration

Deliverables:

- import v0.2 corpus structures into existing canonical schema/overlay without data duplication
- timeline confidence/date precision
- contradictions and visibility states
- evidence drawer contract

Exit criterion: core public life events are source-addressable.

### Phase C — Premium life experience

Deliverables:

- `/life/`
- timeline
- THEN/NOW
- chapter transitions
- responsive source visuals

Exit criterion: mobile and desktop visual review approved.

### Phase D — Voice Corpus

Deliverables:

- media-status tracking
- transcript ingestion
- quote index
- timestamp player bridges

Exit criterion: no quote UI is sourced from metadata-only descriptions.

### Phase E — People + Ask the Archive

Deliverables:

- evidence-bounded people graph
- archive query API
- answer citations/evidence drawer links

Exit criterion: mixed-evidence questions expose uncertainty rather than flatten it.

## 13. Testing strategy

Three layers are mandatory:

### Contract tests

- corpus schemas
- claim states
- visibility states
- relationship edge whitelist
- quote/transcript state rules

### Route/API tests

- primary life routes return correct content type
- `/api/*` never falls through to SPA HTML
- canonical data loads in HE/EN/RU where supported
- restricted data cannot be fetched publicly

### Live acceptance

For each deployed release:

- fresh live mobile capture
- fresh live desktop capture
- console/network inspection
- critical navigation walkthrough
- real media rendering check
- evidence drawer check
- accessibility smoke pass

The live captures must correspond to the deployed version being approved.

## 14. Rollback rule

Before deploy, record the previous known-good AppDeploy version. If critical live QA fails, rollback is preferred over stacking emergency patches on an unverified release.

## 15. Definition of Done

A premium feature is complete only when:

1. source is recorded;
2. tests pass;
3. deployment reaches terminal ready state;
4. live API/routes are correct;
5. real content renders;
6. mobile visual QA passes;
7. desktop visual QA passes;
8. accessibility smoke gate passes;
9. evidence/publication/privacy gates pass;
10. Git/AppDeploy release mapping is recorded;
11. final state is `VERIFIED_DONE`.

Anything less is not fixed and not finished.
