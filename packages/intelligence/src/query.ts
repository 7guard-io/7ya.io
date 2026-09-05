import type { Visibility } from './atom.js';
import { groupContradictions, type ContradictionGroup } from './contradictions.js';
import { assertPublicVisibility } from './privacy.js';
import type { RankedEvidenceAtom, Retriever } from './retrieve.js';

export type EvidencePack = {
  query: string;
  generatedAt: string;
  subjectId: string;
  atoms: RankedEvidenceAtom[];
  contradictions: ContradictionGroup[];
  coverage: { sourceTypes: string[]; dateMin?: string; dateMax?: string };
  limitations: string[];
};

export type IntelligenceQueryRequest = {
  query: string;
  subjectId: string;
  limit?: number;
  scope: 'public' | 'internal';
  visibility?: Visibility;
  authorizedPrivate?: boolean;
};

export type PublicQueryBody = {
  query: string;
  subjectId: string;
  limit: number;
  visibility: 'public';
};

const MAX_QUERY_LENGTH = 2_000;
const MAX_SUBJECT_ID_LENGTH = 200;

export function validatePublicQueryBody(body: unknown): PublicQueryBody {
  if (!body || typeof body !== 'object') throw new TypeError('invalid request body');
  const value = body as Record<string, unknown>;
  const query = typeof value.query === 'string' ? value.query.trim() : '';
  const subjectId = typeof value.subjectId === 'string' ? value.subjectId.trim() : '';
  if (!query) throw new TypeError('query is required');
  if (!subjectId) throw new TypeError('subjectId is required');
  if (query.length > MAX_QUERY_LENGTH) throw new TypeError(`query must be at most ${MAX_QUERY_LENGTH} characters`);
  if (subjectId.length > MAX_SUBJECT_ID_LENGTH) throw new TypeError(`subjectId must be at most ${MAX_SUBJECT_ID_LENGTH} characters`);
  if (typeof value.visibility !== 'undefined' && value.visibility !== 'public') {
    throw new TypeError('visibility must be public');
  }
  const rawLimit = typeof value.limit === 'number' && Number.isFinite(value.limit)
    ? Math.trunc(value.limit)
    : 25;
  return {
    query,
    subjectId,
    limit: Math.max(1, Math.min(rawLimit, 50)),
    visibility: 'public',
  };
}

export class IntelligenceQueryService {
  constructor(
    private readonly retriever: Retriever,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  async query(request: IntelligenceQueryRequest): Promise<EvidencePack> {
    if (!request.query.trim()) throw new TypeError('query is required');
    if (!request.subjectId.trim()) throw new TypeError('subjectId is required');
    if (request.scope === 'public') assertPublicVisibility(request.visibility ?? 'public');

    const atoms = await this.retriever.search({
      query: request.query,
      subjectId: request.subjectId,
      limit: request.limit,
      scope: request.scope,
      authorizedPrivate: request.authorizedPrivate,
    });
    const dates = atoms
      .flatMap(atom => [atom.eventDate, atom.source.publishedAt].filter((value): value is string => Boolean(value)))
      .sort();

    return {
      query: request.query,
      generatedAt: this.now(),
      subjectId: request.subjectId,
      atoms,
      contradictions: groupContradictions(atoms),
      coverage: {
        sourceTypes: [...new Set(atoms.map(atom => atom.source.sourceType))].sort(),
        dateMin: dates[0],
        dateMax: dates.length ? dates[dates.length - 1] : undefined,
      },
      limitations: atoms.length
        ? []
        : ['No matching evidence atoms were found in the selected visibility scope.'],
    };
  }
}
