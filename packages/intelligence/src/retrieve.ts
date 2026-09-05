import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { EvidenceAtom, VerificationLevel } from './atom.js';
import { canReadVisibility } from './privacy.js';
import type { AtomStore } from './store.js';

export type RetrievalQuery = {
  query: string;
  subjectId: string;
  limit?: number;
  scope: 'public' | 'internal';
  authorizedPrivate?: boolean;
};

export type RankedEvidenceAtom = EvidenceAtom & {
  score: number;
  semanticScore?: number;
  rankingReasons: string[];
};

export type LexicalIndex = {
  version: 1;
  atoms: Record<string, { tokens: string[]; metadataTokens: string[] }>;
};

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function tokenize(value: string): string[] {
  return normalize(value).split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
}

function verificationBonus(level: VerificationLevel): number {
  switch (level) {
    case 'primary-source': return 2;
    case 'official-record': return 1.8;
    case 'independent-source': return 1.4;
    case 'self-report': return 1;
    case 'derived': return 0.6;
    default: return 0;
  }
}

function scoreAtom(atom: EvidenceAtom, query: string): RankedEvidenceAtom | null {
  const phrase = normalize(query);
  const queryTokens = tokenize(query);
  if (!phrase || !queryTokens.length) return null;

  const body = normalize(`${atom.content} ${atom.eventDate ?? ''} ${atom.source.publishedAt ?? ''}`);
  const metadata = normalize([
    atom.source.title ?? '',
    ...atom.entities,
    ...atom.topics,
    atom.source.sourceId,
    atom.source.sourceType,
    atom.source.platform ?? '',
  ].join(' '));
  const bodyTokens = new Set(tokenize(body));
  const metadataTokens = new Set(tokenize(metadata));
  const reasons: string[] = [];
  let lexical = 0;

  if (body.includes(phrase) || metadata.includes(phrase)) {
    lexical += 8;
    reasons.push('exact-phrase');
  }
  const metadataMatches = queryTokens.filter(token => metadataTokens.has(token)).length;
  if (metadataMatches) {
    lexical += metadataMatches * 4;
    reasons.push(`metadata:${metadataMatches}`);
  }
  const bodyMatches = queryTokens.filter(token => bodyTokens.has(token)).length;
  if (bodyMatches) {
    lexical += bodyMatches;
    reasons.push(`body:${bodyMatches}`);
  }
  if (lexical === 0) return null;

  const verification = verificationBonus(atom.verification.level);
  if (verification > 0) reasons.push(`verification:${atom.verification.level}`);
  return { ...atom, score: lexical + verification, rankingReasons: reasons };
}

export interface Retriever {
  search(query: RetrievalQuery): Promise<RankedEvidenceAtom[]>;
}

export class LexicalRetriever implements Retriever {
  constructor(private readonly store: AtomStore) {}

  async search(query: RetrievalQuery): Promise<RankedEvidenceAtom[]> {
    const limit = Math.max(1, Math.min(query.limit ?? 25, 100));
    const scored: RankedEvidenceAtom[] = [];
    for await (const atom of this.store.list({ subjectId: query.subjectId })) {
      if (!canReadVisibility(query.scope, atom.visibility, query.authorizedPrivate)) continue;
      const ranked = scoreAtom(atom, query.query);
      if (ranked) scored.push(ranked);
    }
    scored.sort((a, b) => b.score - a.score || a.atomId.localeCompare(b.atomId));

    const diverse: RankedEvidenceAtom[] = [];
    const deferred: RankedEvidenceAtom[] = [];
    const seenSources = new Set<string>();
    for (const item of scored) {
      if (!seenSources.has(item.source.sourceId)) {
        seenSources.add(item.source.sourceId);
        diverse.push(item);
      } else {
        deferred.push({
          ...item,
          score: item.score - 0.5,
          rankingReasons: [...item.rankingReasons, 'same-source-penalty'],
        });
      }
    }
    deferred.sort((a, b) => b.score - a.score || a.atomId.localeCompare(b.atomId));
    return [...diverse, ...deferred].slice(0, limit);
  }
}

export async function rebuildLexicalIndex(store: AtomStore, outputPath: string): Promise<LexicalIndex> {
  const index: LexicalIndex = { version: 1, atoms: {} };
  for await (const atom of store.list()) {
    index.atoms[atom.atomId] = {
      tokens: tokenize(`${atom.content} ${atom.eventDate ?? ''} ${atom.source.publishedAt ?? ''}`),
      metadataTokens: tokenize([
        atom.source.title ?? '',
        ...atom.entities,
        ...atom.topics,
        atom.source.sourceId,
        atom.source.sourceType,
      ].join(' ')),
    };
  }
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  return index;
}
