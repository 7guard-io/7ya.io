# Descript as a 7YA Media-Ingestion Provider

Observed: 2026-09-07

Status: CONNECTED / METADATA READS WORKING / AI PROJECT AGENT BLOCKED BY ACCOUNT CREDITS

## Why this exists

Descript should not be treated as a second canonical archive or as a publishing authority for 7YA. It is an **editing, transcription and derivative-media provider** whose outputs can feed the 7YA evidence pipeline.

The canonical chain is:

`SOURCE ASSET -> DESCRIPT PROJECT -> COMPOSITION / CLIP -> TRANSCRIPT / EDIT METADATA -> 7YA MEDIA INGEST -> EVIDENCE / CANON REVIEW -> PUBLIC PROJECTION`

Descript never promotes material directly to Canon.

## Connected corpus discovered

The connected Descript drive already contains meaningful 7YA source material.

### Igor Vepretski — Spoken Corpus 103FM Drive

- Folder: `7YA/Spoken Corpus`
- Primary source media: `103FM Barak Seri`
- Primary source duration: ~250 seconds
- Source composition: `103FM — Barak Seri`, ~250.12 seconds
- Existing derivative compositions:
  - `7YA Clip — 103FM — Hostage Message`, ~68.63 s
  - `7YA Clip — 103FM — Holon Missile`, ~18.62 s
  - `7YA Clip — 103FM — Why I Joined`, ~28.62 s
  - `103FM · Hostage message · 00:46–01:52`, ~65.30 s
- Three derivatives currently have **unlisted** Descript publishes. Their share URLs are intentionally not copied into this public repository document.

### Starton - Tech Centers for Youth at Risk

- One ~74.94-second video composition.
- Contains multiple narration/overdub audio assets and generated illustration assets.
- A public Descript publish already exists.
- Because the project mixes narration, generated imagery and edited composition, 7YA must preserve the distinction between source documentation, generated illustrative assets and the final edited derivative.

### Additional connected 7YA projects

- `Igor Vepretski — Recovered Physical Reel — 59s`
- `Igor Vepretski — Spoken Corpus 103FM`
- `7YA — תמלול מדויק מאודיו משופר`
- `7YA — תמלול דברי איגור 24.07.2026`
- `7YA — Igor Field Note Transcription 2026-07-24`

These are discovery candidates, not automatically canonical records.

## Current connector limitation

A read-only request to the Descript project AI agent was attempted to extract timestamped claims and derivative relationships from the 103FM project. Descript returned `Insufficient AI credits`.

Therefore:

- project/media/composition metadata is currently accessible;
- AI-agent transcript/semantic extraction cannot be relied on at this moment;
- no project was edited or published during this control-plane work;
- the 7YA pipeline must degrade gracefully when Descript AI credits are exhausted.

## Provider contract

Every Descript ingestion record should normalize to a provider-neutral structure similar to:

```ts
export type MediaProvenanceRecord = {
  id: string;
  provider: 'descript';
  providerProjectRef: string; // stored in controlled metadata, not necessarily public
  sourceAsset: {
    label: string;
    mediaType: 'audio'|'video'|'image'|'document';
    durationSeconds?: number;
    originalSourceUrl?: string;
    contentHash?: string;
  };
  derivative?: {
    relationship: 'parentOf'|'componentOf'|'inputTo';
    parentRecordId?: string;
    compositionLabel?: string;
    inPointSeconds?: number;
    outPointSeconds?: number;
    durationSeconds?: number;
  };
  transcript?: {
    textRef?: string;
    language?: string;
    generatedBy?: 'descript'|'human'|'other';
    reviewed: boolean;
  };
  publication: {
    state: 'private'|'unlisted'|'public'|'unknown';
    publicUrl?: string;
  };
  evidence: {
    verification: 'verified'|'supported'|'owner-reported'|'unresolved'|'quarantined';
    visibility: 'public'|'restricted'|'private';
    sourceCapturedAt: string;
  };
};
```

Provider IDs and unlisted/private URLs belong in controlled metadata and should not be exposed through public projections without an explicit publication decision.

## Provenance model

External review of the C2PA Content Credentials model confirms a useful semantic fit for 7YA media lineage:

- source assets are preserved as ingredients;
- edited/exported clips are derivatives;
- relationships can distinguish `parentOf`, `componentOf`, and `inputTo`;
- edit actions should be retained as provenance rather than collapsing every derivative into a new unrelated media object;
- AI-generated or AI-edited ingredients should be explicitly identified rather than represented as documentary source media.

Reference: https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html
Reference: https://spec.c2pa.org/specifications/specifications/2.4/guidance/Guidance.html

7YA is not claiming current C2PA signing compliance. The immediate action is to make the internal media graph **C2PA-shaped** so future cryptographic Content Credentials can be added without redesigning the canon.

## Operational rules

1. Descript is a provider, not the source of truth.
2. Never make an unlisted/private Descript share URL public implicitly.
3. A clip must retain its parent source relationship and time range when known.
4. Transcript text is evidence about spoken content, not automatic proof that every spoken statement is externally verified.
5. Generated images/overdubs must retain their generated/edited status.
6. Canon promotion remains a separate evidence + privacy + approval step.
7. Public 7YA projections consume normalized media records, never provider-specific project state directly.

## Next implementation slice

Create a provider-neutral `MediaProvenanceRecord` adapter alongside the canonical corpus / Evidence Atom bridge, then seed it first from the connected 103FM and StartOn projects without exposing unlisted provider URLs.
