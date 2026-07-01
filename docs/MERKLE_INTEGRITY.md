# Merkle Integrity Anchor for Evidence Cockpit

The `merkle_integrity_anchor` is the tamper-evidence layer for the #7YA Evidence Cockpit. It makes the evidence trail append-only: old records are never edited or deleted; corrections are added as new records and the cryptographic roots expose any historical change.

## Goals

- **Tamper evidence:** a one-byte change in a claim, source, or capture changes its leaf hash and every hash up to the batch root.
- **Append-only operation:** new evidence creates new ledger rows and new batches instead of rewriting history.
- **Fast verification:** a user can verify one record with a Merkle proof in `O(log n)` hashes.
- **Public anchoring:** batch roots can be signed or published to an external timestamping service, blockchain, or signed Git commit.

## Recommended data model

```sql
CREATE TABLE integrity_batches (
    batch_id TEXT PRIMARY KEY,
    batch_type TEXT NOT NULL CHECK (batch_type IN ('claim', 'source', 'capture', 'daily', 'weekly')),
    record_count INTEGER NOT NULL CHECK (record_count >= 0),
    previous_batch_hash TEXT,
    merkle_root TEXT NOT NULL,
    merkle_tree_snapshot JSONB,
    anchored_at TIMESTAMP,
    anchor_proof TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE append_only_evidence_ledger (
    ledger_id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    previous_record_hash TEXT,
    record_hash TEXT NOT NULL,
    batch_id TEXT REFERENCES integrity_batches(batch_id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Hashing rules

1. Canonicalize evidence payloads as sorted JSON with compact separators.
2. Compute `payload_hash = SHA256(canonical_payload)`.
3. Compute `record_hash = SHA256(previous_record_hash || payload_hash)`.
4. Compute Merkle leaves with domain separation: `SHA256(0x00 || record_hash)`.
5. Compute internal nodes with domain separation: `SHA256(0x01 || left || right)`.
6. If a level has an odd number of nodes, duplicate the last node for that level.

The prefix bytes prevent ambiguity between leaves and internal nodes. The duplicate-last rule keeps batch construction deterministic without requiring a power-of-two batch size.

## Batch workflow

1. `append_only_ledger_writer` receives a new claim, source, or capture.
2. The writer hashes the canonical payload and links it to `previous_record_hash`.
3. A timer or threshold job selects pending records, usually 256-1024 rows per batch.
4. The job builds a Merkle tree and writes `integrity_batches` with the root and optional JSON snapshot.
5. The job updates selected ledger rows with `batch_id`.
6. The anchoring worker signs or publishes the root and stores `anchored_at` plus `anchor_proof`.
7. Verification returns the record, its proof, and the known batch root.

## Python implementation

The repository includes a dependency-free reference implementation in `tools/merkle_integrity.py`:

```python
from tools.merkle_integrity import MerkleTree, chained_record_hash, verify_proof

records = [
    chained_record_hash(None, {"claim": "source captured", "source_id": "src_001"}),
    chained_record_hash(None, {"claim": "review completed", "source_id": "src_002"}),
]

tree = MerkleTree(records)
root = tree.build()
proof = tree.get_proof(0)
assert verify_proof(records[0], proof, root)
```

## API endpoints

- `POST /api/evidence/ledger` — append a canonical evidence record and return `record_hash`.
- `POST /api/evidence/integrity/batches` — seal pending records into a Merkle batch.
- `GET /api/evidence/integrity/batches/:batch_id` — return root, metadata, and anchor proof.
- `GET /api/evidence/ledger/:ledger_id/proof` — return the record hash, Merkle proof, and batch root.
- `POST /api/evidence/integrity/verify` — verify a submitted record hash/proof/root tuple.

## Publication Gate integration

The Publication Gate should require a valid integrity status before public release:

- **Draft:** evidence can be edited, but not published.
- **Sealed:** record hash is in an integrity batch.
- **Anchored:** batch root has an external signature, timestamp, or commit proof.
- **Publishable:** all required claims have `Sealed` or `Anchored` status according to risk level.
- **Correction required:** create a new correction record; never mutate the old record.

## Operational notes

- Do not place sensitive raw content in Merkle leaves; hash canonical payloads and store access-controlled metadata separately.
- Keep tree snapshots for convenient proof generation, but treat the root and record hashes as the source of truth.
- Use SHA-256 by default. BLAKE3 can be added later for high-throughput internal jobs, but SHA-256 is easier to verify across platforms.
- For millions of records, move from batch trees to a dynamic Merkle service such as Trillian or a sparse Merkle tree.
