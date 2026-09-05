# 7YA Living Intelligence Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working, source-grounded 7YA Intelligence slice that ingests three normalized source formats into deterministic Evidence Atoms, stores and retrieves them with privacy-safe lexical ranking, surfaces contradictions, and exposes local CLI/internal API contracts without production deployment.

**Architecture:** Extend the existing Evidence Oracle rather than duplicating it. New `packages/intelligence` code owns semantic-memory contracts, ingestion, storage, retrieval and contradiction assembly while reusing Evidence Oracle canonicalization/hash/record primitives. Filesystem persistence is the only Phase 1 storage backend; external vector/graph databases remain extension points.

**Tech Stack:** TypeScript ES2022/NodeNext, Node.js built-in test runner, Node filesystem APIs, existing `packages/evidence-oracle` primitives, existing repository `npm run ci:local` gate.

**Spec:** `docs/superpowers/specs/2026-09-05-7ya-living-intelligence-organism-design.md`

## Global Constraints

- No production deployment in Phase 1.
- Do not replace or fork Evidence Oracle cryptographic primitives.
- Public retrieval returns only `visibility=public` atoms.
- Re-ingesting the same source identity + source-record hash must not create duplicate atoms.
- Ingestion is not publication approval.
- Private/restricted corpus files and generated atom stores remain gitignored unless explicitly approved for publication.
- Retrieval must remain correct without embeddings or an external vector database.
- Retrieved text is untrusted data and must not be executed or promoted to system instructions.
- `npm run typecheck`, intelligence tests, existing Evidence Oracle tests and `npm run ci:local` are mandatory before merge/deploy consideration.

---

## File map

### Create

- `packages/intelligence/src/atom.ts` — Evidence Atom types, canonical identity/hash derivation and validation.
- `packages/intelligence/src/privacy.ts` — visibility policy and public/internal retrieval guard.
- `packages/intelligence/src/adapter.ts` — normalized source record and adapter contracts.
- `packages/intelligence/src/adapters/collector.ts` — adapter for `data/archives/latest_collection.json`.
- `packages/intelligence/src/adapters/evidence-claims.ts` — adapter for current evidence claims JSON.
- `packages/intelligence/src/adapters/local-corpus.ts` — JSON/NDJSON prepared-corpus adapter.
- `packages/intelligence/src/store.ts` — `AtomStore`, filesystem store, ingest manifest persistence and rebuildable index file helpers.
- `packages/intelligence/src/ingest.ts` — incremental ingest orchestration and Evidence Oracle linkage.
- `packages/intelligence/src/retrieve.ts` — deterministic lexical retrieval, filters, ranking and Evidence Pack assembly inputs.
- `packages/intelligence/src/contradictions.ts` — contradiction grouping by normalized claim key/value.
- `packages/intelligence/src/query.ts` — public/internal query service returning `EvidencePack`.
- `packages/intelligence/src/index.ts` — package exports.
- `packages/intelligence/test/atom.test.ts`
- `packages/intelligence/test/ingest.test.ts`
- `packages/intelligence/test/retrieve.test.ts`
- `packages/intelligence/test/privacy.test.ts`
- `packages/intelligence/test/contradictions.test.ts`
- `scripts/intelligence/ingest.mjs`
- `scripts/intelligence/query.mjs`
- `api/intelligence/query.ts`

### Modify

- `packages/evidence-oracle/src/index.ts` — export canonicalization/hash helpers needed by Intelligence if not already exported.
- `tsconfig.json` — include `packages/intelligence/src/**/*.ts` and `packages/intelligence/test/**/*.ts`.
- `package.json` — add intelligence build/test CLI scripts while preserving the existing release gate.
- `.gitignore` — ignore generated/private `data/intelligence/atoms`, manifests and indexes while retaining an optional tracked README/fixtures lane.

---

### Task 1: Evidence Atom identity and privacy contract

**Files:**
- Create: `packages/intelligence/src/atom.ts`
- Create: `packages/intelligence/src/privacy.ts`
- Create: `packages/intelligence/test/atom.test.ts`
- Create: `packages/intelligence/test/privacy.test.ts`
- Modify: `packages/evidence-oracle/src/index.ts`
- Modify: `tsconfig.json`

**Interfaces:**
- Consumes: `canonicalize(value: unknown): string`, `sha256Hex(value: string): string` from Evidence Oracle.
- Produces: `createEvidenceAtom(input: CreateEvidenceAtomInput): EvidenceAtom`, `computeAtomId(input: AtomIdentityInput): string`, `computeAtomContentHash(input: AtomContentHashInput): string`, `assertPublicVisibility(requested: Visibility): 'public'`, `canReadVisibility(scope: 'public'|'internal', visibility: Visibility, authorizedPrivate?: boolean): boolean`.

- [ ] **Step 1: Write failing deterministic identity and privacy tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAtom } from '../src/atom.js';

const base = {
  subjectId: 'igor-vepretski',
  kind: 'statement' as const,
  content: 'StartOn works with youth at risk.',
  source: {
    sourceId: 'fixture:statement:1',
    sourceType: 'fixture',
    observedAt: '2026-09-05T12:00:00.000Z',
  },
  entities: ['StartOn'],
  topics: ['youth-at-risk'],
  claims: [],
  visibility: 'public' as const,
  verification: { level: 'self-report' as const },
  provenance: {
    adapter: 'fixture',
    sourceRecordHash: 'source-hash-1',
    ingestedAt: '2026-09-05T12:01:00.000Z',
  },
};

test('equivalent atom identity is deterministic and ignores ingest timestamp', () => {
  const one = createEvidenceAtom(base);
  const two = createEvidenceAtom({
    ...base,
    entities: ['StartOn'],
    provenance: { ...base.provenance, ingestedAt: '2026-09-05T12:02:00.000Z' },
  });
  assert.equal(one.atomId, two.atomId);
  assert.equal(one.provenance.contentHash, two.provenance.contentHash);
});
```

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicVisibility, canReadVisibility } from '../src/privacy.js';

test('public scope cannot request private visibility', () => {
  assert.throws(() => assertPublicVisibility('private'), /public query/i);
  assert.equal(canReadVisibility('public', 'public'), true);
  assert.equal(canReadVisibility('public', 'private'), false);
  assert.equal(canReadVisibility('public', 'restricted'), false);
});
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:
```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/atom.test.js dist/packages/intelligence/test/privacy.test.js
```
Expected: compile failure because Intelligence files/exports do not yet exist.

- [ ] **Step 3: Implement minimal atom and privacy contracts**

`atom.ts` must validate non-empty subject/content/source ID/source type/observed timestamp, normalize content whitespace, derive `contentHash` from canonicalized `{kind, content, language, entities, topics, claims}`, and derive `atomId` from canonicalized `{subjectId, kind, content, sourceId, locator}` using the namespace prefix `7ya:atom:v1:`.

`privacy.ts` must reject any non-public request at the public contract and allow internal private/restricted reads only when `authorizedPrivate === true`.

- [ ] **Step 4: Export required Evidence Oracle helpers and include Intelligence in TypeScript compilation**

`packages/evidence-oracle/src/index.ts` must export `canonicalize` and `sha256Hex` from the existing modules rather than reimplementing them.

`tsconfig.json` include list becomes:
```json
[
  "packages/evidence-oracle/src/**/*.ts",
  "packages/evidence-oracle/test/**/*.ts",
  "packages/intelligence/src/**/*.ts",
  "packages/intelligence/test/**/*.ts",
  "api/**/*.ts"
]
```

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run:
```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/atom.test.js dist/packages/intelligence/test/privacy.test.js
```
Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/intelligence packages/evidence-oracle/src/index.ts tsconfig.json
git commit -m "feat(intelligence): add evidence atom contract"
```

---

### Task 2: Source adapters and incremental ingest

**Files:**
- Create: `packages/intelligence/src/adapter.ts`
- Create: `packages/intelligence/src/adapters/collector.ts`
- Create: `packages/intelligence/src/adapters/evidence-claims.ts`
- Create: `packages/intelligence/src/adapters/local-corpus.ts`
- Create: `packages/intelligence/src/ingest.ts`
- Create: `packages/intelligence/src/store.ts`
- Create: `packages/intelligence/test/ingest.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces `NormalizedSourceRecord`, `SourceAdapter`, `SourceScanInput`, `FileSystemAtomStore`, `IngestManifestStore`, `ingestAdapter(adapter, input, deps): Promise<IngestSummary>`.
- `NormalizedSourceRecord` fields: `sourceId`, `sourceType`, `platform?`, `canonicalUrl?`, `title?`, `author?`, `publishedAt?`, `eventDate?`, `observedAt`, `content`, `language?`, `entities`, `topics`, `claims`, `kind`, `visibility`, `verification`, `sourceRecordHash`, `metadata`.

- [ ] **Step 1: Write failing adapter + deduplication tests**

Tests must cover:
1. collector record becomes a public `document` atom preserving `canonical_url` and `content_sha256`;
2. evidence claim keeps its incoming evidence/claim status as metadata and does not auto-upgrade to `fact`;
3. local NDJSON supports explicit `private` visibility;
4. same `sourceId + sourceRecordHash` is skipped on second ingest;
5. malformed record throws/reports rejection and leaves prior manifest unchanged;
6. changed source hash creates a new atom while retaining the previous atom.

Use temporary directories from `node:fs/promises.mkdtemp` and `node:os.tmpdir`; fixtures must use synthetic IDs and URLs.

- [ ] **Step 2: Run focused ingest tests and confirm RED**

Run:
```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/ingest.test.js
```
Expected: missing adapter/store/ingest modules.

- [ ] **Step 3: Implement adapter contracts and the three adapters**

Collector mapping:
- `sourceId = canonical_url || final_url || target`
- `kind = 'document'`
- `content = text_excerpt || description || title`
- `visibility = 'public'`
- `verification.level = 'independent-source'`
- `sourceRecordHash = content_sha256`

Evidence-claims mapping:
- `sourceId = 'evidence-claim:' + id`
- `kind = 'claim'` unless the input explicitly supplies a supported kind
- `verification.level = status === 'VERIFIED' ? 'official-record' : 'unverified'` only when the input source itself is an official record; otherwise `VERIFIED` remains claim metadata and verification defaults to `independent-source`/`self-report` based on source type. Never infer `fact` from status text alone.

Local corpus mapping requires explicit `sourceId`, `content`, `observedAt`, `visibility` and `verification.level`; missing required fields are rejected.

- [ ] **Step 4: Implement filesystem atom store and transactional manifest update**

`FileSystemAtomStore.put(atom)` writes one JSON file per `atomId` using temp-file + rename, returning `unchanged` when canonical serialized bytes already match. `IngestManifestStore` stores adapter-scoped source hashes. `ingestAdapter` updates a source manifest entry only after every atom derived from that source record has been persisted successfully.

- [ ] **Step 5: Add gitignore protection**

Append:
```gitignore
/data/intelligence/atoms/
/data/intelligence/manifests/
/data/intelligence/indexes/
/data/intelligence/private/
```

- [ ] **Step 6: Run focused ingest tests and confirm GREEN**

Run:
```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/ingest.test.js
```
Expected: all ingest tests pass.

- [ ] **Step 7: Commit**

```bash
git add packages/intelligence/src packages/intelligence/test/ingest.test.ts .gitignore
git commit -m "feat(intelligence): add incremental source ingestion"
```

---

### Task 3: Deterministic lexical retrieval and index rebuild

**Files:**
- Create: `packages/intelligence/src/retrieve.ts`
- Create: `packages/intelligence/test/retrieve.test.ts`
- Modify: `packages/intelligence/src/store.ts`

**Interfaces:**
- Produces `Retriever`, `RetrievalQuery`, `RankedEvidenceAtom`, `LexicalRetriever`, `rebuildLexicalIndex(store, outputPath): Promise<LexicalIndex>`.
- `LexicalRetriever.search(query): Promise<RankedEvidenceAtom[]>` must work entirely from atom storage/index with no embedding provider.

- [ ] **Step 1: Write failing ranking/filter/diversity/rebuild tests**

Tests must prove:
- exact phrase beats loose token match;
- exact person/project name in title/entity/topic outranks only-body mention;
- date token such as `2026-08-31` is searchable;
- public search excludes private/restricted atoms before scoring;
- verification strength contributes a bounded bonus but cannot make unrelated text rank;
- source diversity prevents the top 20 being dominated by one `sourceId` when equivalent alternatives exist;
- deleting the generated index and rebuilding from the atom store yields the same top result set.

- [ ] **Step 2: Run focused retrieval test and confirm RED**

```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/retrieve.test.js
```
Expected: missing retrieval implementation.

- [ ] **Step 3: Implement tokenizer, filters and deterministic score**

Normalize Unicode with `NFKC`, lowercase, collapse whitespace and split on non-letter/non-number boundaries while preserving date tokens. Score components must be returned in `rankingReasons` and include explicit phrase, metadata, body, verification and diversity signals. Add optional `semanticScore?: number` to ranked results but do not require it.

- [ ] **Step 4: Implement rebuildable lexical index**

The generated index contains only derived searchable fields keyed by atom ID. It must be safe to delete and rebuild from `AtomStore.list()` without data loss.

- [ ] **Step 5: Run focused retrieval tests and confirm GREEN**

```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/retrieve.test.js
```
Expected: all retrieval tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/intelligence/src/retrieve.ts packages/intelligence/src/store.ts packages/intelligence/test/retrieve.test.ts
git commit -m "feat(intelligence): add deterministic lexical retrieval"
```

---

### Task 4: Contradictions, Evidence Pack and Evidence Oracle linkage

**Files:**
- Create: `packages/intelligence/src/contradictions.ts`
- Create: `packages/intelligence/src/query.ts`
- Create: `packages/intelligence/test/contradictions.test.ts`
- Modify: `packages/intelligence/src/ingest.ts`
- Modify: `packages/intelligence/src/index.ts`

**Interfaces:**
- Produces `ContradictionGroup`, `groupContradictions(atoms)`, `EvidencePack`, `IntelligenceQueryService.query(request): Promise<EvidencePack>`.
- Ingest linkage uses existing `createEvidenceRecord` and writes its ID to `atom.provenance.evidenceRecordId` when the caller enables integrity linkage.

- [ ] **Step 1: Write failing contradiction + provenance tests**

Use two synthetic claim atoms with the same normalized claim key `igor-vepretski|role|example-role` but incompatible values `active` and `inactive`. Assert both remain stored and appear in one contradiction group with each source/verification level intact.

Add an Evidence Oracle linkage test asserting identical atom payload/provenance inputs generate reproducible Evidence Oracle record hashes/IDs when `createdAt` and chain predecessor are fixed.

- [ ] **Step 2: Run focused tests and confirm RED**

```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/contradictions.test.js
```
Expected: missing contradiction/query implementation.

- [ ] **Step 3: Implement contradiction grouping**

Claims used for contradiction grouping must be explicit structured claim strings formatted as `subject|predicate|value`. Group by normalized `subject|predicate`; create a contradiction only when at least two distinct normalized values exist. Never infer contradictions solely from arbitrary prose sentiment.

- [ ] **Step 4: Implement Evidence Pack assembly**

`IntelligenceQueryService.query` returns:
```ts
{
  query,
  generatedAt,
  subjectId,
  atoms,
  contradictions,
  coverage: { sourceTypes, dateMin, dateMax },
  limitations,
}
```
Public scope invokes `assertPublicVisibility('public')`; source URLs/IDs from non-public atoms never enter a public pack.

- [ ] **Step 5: Implement optional Evidence Oracle linkage**

Use `createEvidenceRecord` from the existing package; do not duplicate canonicalization/hashing. Link only after atom persistence succeeds. Failure to create a requested integrity record fails that source transaction before manifest advancement.

- [ ] **Step 6: Run focused tests and confirm GREEN**

```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/contradictions.test.js dist/packages/intelligence/test/ingest.test.js
```
Expected: all focused tests pass.

- [ ] **Step 7: Commit**

```bash
git add packages/intelligence
git commit -m "feat(intelligence): assemble evidence packs and contradictions"
```

---

### Task 5: CLI, internal API and repository gates

**Files:**
- Create: `scripts/intelligence/ingest.mjs`
- Create: `scripts/intelligence/query.mjs`
- Create: `api/intelligence/query.ts`
- Modify: `package.json`
- Modify: `packages/intelligence/src/index.ts`

**Interfaces:**
- CLI ingest flags: `--adapter collector|claims|local --input <path> [--json]`.
- CLI query flags: `--q <text> --subject <id> [--limit <n>] [--json]` and always public visibility.
- API accepts POST body `{query:string, subjectId:string, limit?:number, visibility?:'public'}`; any private/restricted visibility request returns 400 and never calls query retrieval.

- [ ] **Step 1: Add failing contract tests for public API visibility and CLI argument parsing**

Keep argument parsing in exported pure functions where possible so malformed/missing flags can be unit-tested without spawning processes. Assert the public API rejects `visibility:'private'` and returns an Evidence Pack for a valid public request using injected test dependencies.

- [ ] **Step 2: Run focused contract tests and confirm RED**

```bash
tsc -p tsconfig.json && node --test dist/packages/intelligence/test/*.test.js
```
Expected: API/CLI contracts are not yet implemented.

- [ ] **Step 3: Implement CLI scripts**

The scripts load adapters by explicit allow-list, never by dynamic user-controlled module import. Human-readable output summarizes created/skipped/rejected counts or ranked evidence. `--json` emits machine-readable JSON only.

- [ ] **Step 4: Implement internal API route**

The route performs method/body/visibility validation, bounds `limit` to `1..50`, calls no LLM, and returns the `EvidencePack`. Any filesystem path/config is server-owned and not accepted from the public request body.

- [ ] **Step 5: Update package scripts**

Add:
```json
"test:intelligence": "npm run build && node --test dist/packages/intelligence/test/*.test.js",
"intelligence:ingest": "npm run build && node scripts/intelligence/ingest.mjs",
"intelligence:query": "npm run build && node scripts/intelligence/query.mjs"
```
Update the existing `test` script so it runs both the existing Evidence Oracle suite and the Intelligence suite without deleting any prior tests.

- [ ] **Step 6: Run package verification**

```bash
npm run typecheck
npm run test:intelligence
npm test
```
Expected: all pass.

- [ ] **Step 7: Run full repository release gate**

```bash
npm run ci:local
```
Expected: pass with no regressions. If any existing unrelated baseline gate fails, capture the exact failing command/output and do not claim release readiness.

- [ ] **Step 8: Commit**

```bash
git add scripts/intelligence api/intelligence/query.ts package.json packages/intelligence/src/index.ts
git commit -m "feat(intelligence): expose local query and ingest surfaces"
```

---

## Plan self-review

- Spec coverage: Evidence Atom, three adapters, deduplication, filesystem store, lexical retrieval, privacy, contradictions, Evidence Pack, Evidence Oracle linkage, CLI, API, rebuildable index and repository gates are all assigned to explicit tasks.
- No hard Qdrant/Neo4j/Postgres dependency is introduced.
- Public/private boundary is enforced both before retrieval and at API request validation.
- Contradictions require structured claim keys rather than unsafe free-text inference.
- Type/interface names are consistent across tasks: `EvidenceAtom`, `NormalizedSourceRecord`, `SourceAdapter`, `AtomStore`, `LexicalRetriever`, `RankedEvidenceAtom`, `ContradictionGroup`, `EvidencePack`, `IntelligenceQueryService`.
- No production deployment step exists in this plan.
