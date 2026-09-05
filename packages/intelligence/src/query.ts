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
