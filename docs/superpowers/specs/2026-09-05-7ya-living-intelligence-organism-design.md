# 7YA Living Intelligence Organism — Design

## Decision

Build **7YA Ω / Igor Living Intelligence** as the canonical intelligence and retrieval layer inside the existing `7guard-io/7ya.io` repository.

This is an extension of the current collector and Evidence Oracle, not a replacement stack and not a separate chatbot product.

The subsystem must turn Igor Vepretski's distributed record into a continuously ingestible, source-grounded, queryable corpus while preserving provenance, privacy, correction history and the distinction between fact, claim and inference.

The existing repository already contains the correct primitives to extend:

- `scripts/collector/index.js` performs public-web collection with target validation, SSRF protections, response-size limits and SHA-256 change detection.
- `packages/evidence-oracle/` provides canonicalization, hashing, chained evidence records, Merkle proof support, logging and verification.
- `api/evidence/verify.ts` exposes evidence verification.
- `npm run ci:local` is the release gate and remains mandatory for deployable changes.

## Product objective

A user or internal 7YA agent should be able to ask a question such as:

> What have we ever learned about Igor Vepretski's work with youth at risk?

The system must retrieve the best evidence across heterogeneous sources, distinguish direct evidence from interpretation, surface contradictions, and return a compact evidence pack suitable for Bro Chat, research, biography, timeline, content generation or human review.

The system must not depend on a language model remembering Igor's history. Models receive selected evidence; the corpus remains the source of truth.

## Primary success criteria

The first implementation slice is successful when all of the following are true:

1. The system can ingest normalized records from at least three source adapters without changing the Evidence Oracle's integrity model.
2. Re-ingesting unchanged material produces no duplicate Evidence Atoms.
3. Each atom carries immutable source/provenance fields and a deterministic content hash.
4. Retrieval supports exact/lexical matching plus semantic-ready ranking interfaces, with deterministic local fallback when embeddings are unavailable.
5. Query results preserve source references and evidence classification.
6. Contradictory claims can coexist and be surfaced as contradictions rather than overwritten.
7. Private material cannot be returned through the public query contract.
8. Tests prove the ingest, deduplication, retrieval, privacy and contradiction behaviors.
9. The feature passes the repository's existing TypeScript/test gates before any production deployment is considered.

## Scope — first implementation slice

### In scope

- Evidence Atom schema.
- Source adapter contract.
- Local JSON/NDJSON ingestion adapter for exports and prepared corpora.
- Adapter for the existing public collector output.
- Adapter for existing `data/evidence-claims.json`-style evidence records.
- Incremental deduplication by canonical content hash and source identity.
- Canonical atom store abstraction with a filesystem implementation for tests and local operation.
- Retrieval index abstraction with lexical retrieval first and a semantic/vector extension point.
- Evidence classification and privacy filtering.
- Contradiction grouping.
- Internal query service returning an Evidence Pack.
- CLI commands for ingest and query.
- Unit/integration tests.
- Documentation of future Gmail, Google Drive, Dropbox, social, transcript and media adapters.

### Explicitly out of scope for this slice

- Bulk ingestion of the user's live Gmail, Drive or Dropbox accounts.
- Browser automation or scraping authenticated social platforms.
- Face recognition.
- Automatic publication to 7ya.io.
- Automatic rewriting of biography pages.
- Neo4j, Qdrant or another external database as a hard runtime dependency.
- New production secrets.
- Production deployment.
- Replacing the current Evidence Oracle record chain.

The first slice must prove the data contract and retrieval behavior before external infrastructure is introduced.

## Architectural principle

**RAW SOURCE → NORMALIZED SOURCE RECORD → EVIDENCE ATOM → INDEX → RETRIEVAL → EVIDENCE PACK → MODEL/UI**

A model never becomes the database and never silently promotes inference to fact.

## Evidence Atom contract

The Evidence Atom is the smallest retrievable unit. It is a semantic record linked to source provenance and, where appropriate, to an Evidence Oracle record.

```ts
export type EvidenceKind =
  | 'fact'
  | 'claim'
  | 'statement'
  | 'event'
  | 'document'
  | 'media'
  | 'observation'
  | 'inference'
  | 'opinion'
  | 'unknown';

export type VerificationLevel =
  | 'primary-source'
  | 'official-record'
  | 'independent-source'
  | 'self-report'
  | 'derived'
  | 'unverified';

export type Visibility = 'public' | 'private' | 'restricted';

export type EvidenceAtom = {
  atomId: string;
  schemaVersion: 1;
  subjectId: string;
  kind: EvidenceKind;
  content: string;
  language?: string;

  source: {
    sourceId: string;
    sourceType: string;
    platform?: string;
    canonicalUrl?: string;
    title?: string;
    author?: string;
    publishedAt?: string;
    observedAt: string;
    locator?: {
      page?: number;
      lineStart?: number;
      lineEnd?: number;
      timestampStart?: number;
      timestampEnd?: number;
    };
  };

  eventDate?: string;
  entities: string[];
  topics: string[];
  claims: string[];

  visibility: Visibility;
  verification: {
    level: VerificationLevel;
    confidence?: number;
    notes?: string;
  };

  provenance: {
    adapter: string;
    sourceRecordHash: string;
    contentHash: string;
    ingestedAt: string;
    evidenceRecordId?: string;
  };
};
```

### Atom identity

`atomId` must be deterministic for equivalent source content.

Recommended derivation:

`sha256("7ya:atom:v1:" + canonicalize({ subjectId, kind, content, source.sourceId, source.locator }))`

The full raw source is not required inside the atom. Large payloads remain in their source archive or object store and are referenced by source identity/hash.

## Source adapter contract

All connectors normalize into one internal contract.

```ts
export interface SourceAdapter {
  readonly id: string;
  scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord>;
}
```

A `NormalizedSourceRecord` must contain:

- stable source identity;
- source type/platform;
- canonical source locator when available;
- raw or normalized text;
- observed timestamp;
- original publication/event timestamp when known;
- visibility;
- source-record hash;
- structured metadata.

Adapters must not publish content or assign unsupported authority labels.

## Initial adapters

### 1. Public collector adapter

Reads records produced by `scripts/collector/index.js` and converts each collected page into one or more Evidence Atoms.

The existing collector remains responsible for network safety and raw public-page acquisition.

### 2. Evidence claims adapter

Reads current structured evidence claims and converts them to atoms without changing their existing claim status.

### 3. Local corpus adapter

Reads JSON or NDJSON exports prepared from conversations, transcripts, documents or connector exports.

This is the bridge for future ChatGPT export, Google Drive export, Gmail export, social export and transcript batches without forcing those integrations into the first slice.

## Incremental ingestion

Every adapter emits a stable `sourceId` and `sourceRecordHash`.

The ingest pipeline performs:

1. validate source record;
2. canonicalize text/metadata;
3. compare source identity/hash to the ingest manifest;
4. skip unchanged records;
5. derive Evidence Atoms;
6. compute deterministic atom IDs/content hashes;
7. persist new atoms;
8. append or link Evidence Oracle integrity records where appropriate;
9. update the ingest manifest only after a successful write.

A failed ingestion must never advance the manifest past unwritten atoms.

## Storage model

The first slice uses interfaces, not a hard dependency on a new database.

```ts
export interface AtomStore {
  put(atom: EvidenceAtom): Promise<'created' | 'unchanged'>;
  get(atomId: string): Promise<EvidenceAtom | null>;
  list(filter?: AtomFilter): AsyncIterable<EvidenceAtom>;
}
```

Filesystem implementation:

- `data/intelligence/atoms/*.json`
- `data/intelligence/manifests/*.json`
- generated indexes under `data/intelligence/indexes/`

Generated/private corpus material must be gitignored unless explicitly approved for publication.

The abstraction must allow later Postgres/Qdrant/Neo4j implementations without changing adapter or query contracts.

## Retrieval design

Retrieval is deliberately layered.

### Stage 1 — candidate recall

Combine:

- exact token matching;
- normalized lexical matching;
- subject/topic/entity filters;
- date ranges;
- source type/platform;
- verification level;
- visibility.

### Stage 2 — ranking

Rank candidates using deterministic signals:

1. exact phrase match;
2. title/entity/topic match;
3. body lexical score;
4. verification strength;
5. source freshness when the question is time-sensitive;
6. source diversity bonus;
7. duplicate/same-source penalty.

Expose a semantic score field but do not require embeddings for correctness.

A future semantic provider can add dense embeddings and reranking behind the same `Retriever` interface.

## Evidence Pack contract

Queries do not return an unstructured blob. They return:

```ts
export type EvidencePack = {
  query: string;
  generatedAt: string;
  subjectId: string;
  atoms: RankedEvidenceAtom[];
  contradictions: ContradictionGroup[];
  coverage: {
    sourceTypes: string[];
    dateMin?: string;
    dateMax?: string;
  };
  limitations: string[];
};
```

Every ranked atom must preserve:

- atom ID;
- source ID;
- source locator/URL where allowed;
- evidence kind;
- verification level;
- visibility check result;
- ranking reasons.

This enables Bro Chat or another model to cite instead of fabricate provenance.

## Contradiction handling

The system must not overwrite claims simply because a later source disagrees.

Atoms that refer to the same normalized claim subject/predicate but contain incompatible values are grouped into a `ContradictionGroup`.

The query layer returns all material sides plus source/verification metadata.

Only an explicit supersession/revocation record may mark an earlier evidence record as superseded; historical source records remain retained.

## Privacy model

Default rules:

- public query surface can retrieve only `visibility=public`;
- internal query surface may retrieve `private`/`restricted` only when the caller explicitly requests and is authorized;
- adapters must assign visibility at ingestion time;
- visibility can become more restrictive automatically, never less restrictive automatically;
- raw secrets, API keys, passwords and authentication material are rejected/redacted before atom creation;
- private source URLs or message IDs must not be exposed through public results.

The system must never infer that content is public merely because Igor is a public person or because a record is present in a connected account.

## Claim-safety taxonomy

The UI/model layer must keep these classes distinct:

- **FACT** — directly supported and externally verifiable.
- **CLAIM** — asserted by a source but not independently established.
- **STATEMENT** — direct utterance or written statement.
- **OBSERVATION** — descriptive record.
- **INFERENCE** — model/human interpretation derived from evidence.
- **OPINION** — subjective view.
- **UNKNOWN** — unresolved.
- **CONTRADICTION** — mutually incompatible supported records.

No automated process may upgrade `inference`, `opinion`, `self-report` or `unverified` material to `fact` solely because an LLM assigns high confidence.

## CLI surface

First slice should expose:

```bash
npm run intelligence:ingest -- --adapter collector --input data/archives/latest_collection.json
npm run intelligence:ingest -- --adapter claims --input data/evidence-claims.json
npm run intelligence:ingest -- --adapter local --input ./path/to/corpus.ndjson
npm run intelligence:query -- --q "youth at risk" --subject igor-vepretski
```

CLI output must support human-readable text and JSON mode.

## Internal API

After the local service passes tests, expose a minimal internal route such as:

`POST /api/intelligence/query`

Request:

```json
{
  "query": "What have we learned about StartOn and youth at risk?",
  "subjectId": "igor-vepretski",
  "limit": 25,
  "visibility": "public"
}
```

Response is an `EvidencePack`.

The route must not call an LLM. Its job is retrieval and evidence assembly. Bro Chat may consume the Evidence Pack in a separate layer.

## Package boundaries

Recommended repository structure:

```text
packages/intelligence/
├── src/
│   ├── atom.ts
│   ├── adapter.ts
│   ├── ingest.ts
│   ├── store.ts
│   ├── retrieve.ts
│   ├── contradictions.ts
│   ├── privacy.ts
│   └── index.ts
└── test/
    ├── atom.test.ts
    ├── ingest.test.ts
    ├── retrieve.test.ts
    ├── privacy.test.ts
    └── contradictions.test.ts

scripts/intelligence/
├── ingest.mjs
└── query.mjs
```

Adapters should be small and independent:

```text
packages/intelligence/src/adapters/
├── collector.ts
├── evidence-claims.ts
└── local-corpus.ts
```

## Evidence Oracle integration

The Intelligence package must depend on the existing Evidence Oracle only through exported canonicalization/hash/record primitives.

Do not duplicate cryptographic logic.

Where an atom is materially important as an integrity assertion, the ingest layer may create/link an Evidence Oracle record containing the atom's payload/provenance hash. The Evidence Oracle remains the integrity/provenance ledger; Intelligence becomes the retrieval and semantic-memory layer.

## External infrastructure roadmap

Only after the local contracts and tests are stable:

### Phase 2 — live connectors

- Google Drive adapter.
- Gmail adapter.
- Dropbox adapter.
- Chat export adapter.
- YouTube/transcript adapter.
- Social export adapters.

Each connector must preserve source-specific cursors and incremental change detection.

### Phase 3 — scale retrieval

- Postgres canonical metadata/atom store.
- `pgvector` or Qdrant for dense retrieval.
- sparse/lexical search kept in parallel.
- reranker behind provider interface.

### Phase 4 — knowledge graph

Add entity/event/relationship graph only when evidence shows multi-hop graph traversal materially improves queries.

Neo4j is optional, not required for the first implementation.

## Failure handling

- Invalid source record: reject with source identity and reason; continue other records unless strict mode is enabled.
- Duplicate unchanged source: skip without generating a new atom.
- Hash collision/inconsistent deterministic ID: hard failure.
- Unsupported visibility downgrade: reject.
- Missing source provenance: reject atom creation.
- Index write failure: atom remains canonical; index can be rebuilt.
- Partial ingest: manifest advances only for committed records.
- Retrieval provider failure: fall back to local deterministic lexical retrieval.

## Testing strategy

TDD is required for implementation.

Minimum tests:

1. deterministic atom ID for canonical-equivalent input;
2. changed source content produces a new atom/version relation;
3. unchanged source is skipped;
4. source provenance survives ingest and retrieval intact;
5. public query excludes private and restricted atoms;
6. private query cannot be requested through public API contract;
7. exact names/dates/phrases rank correctly under lexical retrieval;
8. source diversity avoids returning 20 duplicates of one page;
9. contradiction groups preserve both sides;
10. Evidence Oracle hash/record linkage is reproducible;
11. malformed input does not corrupt the manifest;
12. indexes can be rebuilt entirely from atom storage.

Repository-level acceptance:

- `npm run typecheck`
- intelligence package tests
- existing Evidence Oracle tests
- `npm run ci:local`

No production claim is allowed until those pass on the actual branch and the deployed runtime is separately verified.

## Security requirements

- Reuse the existing collector's public-target protections for any network collector.
- No connector token is written into atoms, logs, fixtures or Git.
- Fixtures must use synthetic addresses/IDs.
- Normalize and bound input sizes before indexing.
- Escape/encode query output for any HTML consumer.
- Treat retrieved text as untrusted data, never as system instructions.
- Model prompts consuming an Evidence Pack must delimit evidence as data to reduce prompt-injection risk.

## Data governance

The corpus must support correction without erasure of historical provenance.

A correction creates a new atom/evidence relationship and may supersede a previous interpretation, but it does not silently delete the old source record.

Public publication remains a separate approval action. Ingestion is not publication approval.

## First implementation order

1. Add failing tests for atom identity, ingest deduplication, privacy and retrieval.
2. Implement Evidence Atom schema and deterministic IDs using Evidence Oracle canonicalization/hash primitives.
3. Implement filesystem AtomStore and ingest manifest.
4. Implement local corpus adapter.
5. Implement public collector adapter.
6. Implement evidence-claims adapter.
7. Implement lexical retrieval and Evidence Pack.
8. Implement contradiction grouping.
9. Add CLI commands and package scripts.
10. Run focused tests, typecheck and full `ci:local`.
11. Open a review PR; do not deploy as part of this design/implementation slice.

## Definition of done for Phase 1

Phase 1 is done only when a clean checkout can ingest sample collector/claim/local data, re-run without duplicates, query the resulting corpus, return public source-grounded Evidence Packs, hide private atoms, preserve contradictions, rebuild indexes, and pass the repository's full local release gate.

The resulting subsystem becomes the canonical foundation for Bro Chat, biography generation, timeline reconstruction, research, source-grounded content production and later live-account connectors.
