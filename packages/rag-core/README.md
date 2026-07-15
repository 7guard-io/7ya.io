# @7ya/rag-core

A deterministic, local-first retrieval package for 7YA evidence and museum data.

## Guarantees

- No network calls, model APIs, embeddings, databases, or GPU requirements.
- Unicode-aware lexical retrieval for Hebrew, Russian, English, and other whitespace-delimited languages.
- Exact source offsets for every returned chunk.
- Stable SHA-256 chunk identifiers.
- JSON-serializable indexes.
- Evidence Ledger ingestion defaults to `PUBLIC` records only.

This package retrieves evidence. It does not generate answers, upgrade verification status, or treat a source-pending claim as verified.

## Commands

```bash
npm run typecheck
npm run test:rag
npm run rag:index:evidence
```

`npm run rag:index:evidence` reads `data/evidence-claims.json` and writes a derived local index to `data/evidence-rag-index.json`.

For a generic document collection:

```bash
npm run build
node dist/packages/rag-core/src/cli.js documents.json index.json
```

The input may be a JSON array or an object containing a `documents` array. Each document follows this contract:

```json
{
  "id": "unique-document-id",
  "title": "Optional title",
  "sourceUrl": "https://example.org/source",
  "text": "The complete source text",
  "metadata": {
    "classification": "PUBLIC"
  }
}
```

## Search usage

```typescript
import { buildRagIndex, searchRagIndex } from './packages/rag-core/src/index.js';

const index = buildRagIndex(documents);
const results = searchRagIndex(index, 'Merkle verification', { limit: 5 });
```

Every result includes its source document ID, chunk ID, original offsets, optional source URL, metadata, and deterministic score.

## Next boundary

An answer-generating agent may consume retrieved chunks later, but it must preserve citations and distinguish `VERIFIED`, `PARTIALLY VERIFIED`, and `SOURCE PENDING` evidence in its output.
