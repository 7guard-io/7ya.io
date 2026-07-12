import type { RagDocument } from './types.js';

export type EvidenceClaim = {
  id: string;
  title: string;
  category: string;
  status: string;
  sourceType: string;
  date: string;
  classification: string;
  explanation: string;
  sourceLink: string;
};

export type EvidenceClaimIngestionOptions = {
  includeClassifications?: string[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseEvidenceClaim(value: unknown, index: number): EvidenceClaim {
  if (!value || typeof value !== 'object') {
    throw new Error(`evidence claim at index ${index} must be an object`);
  }

  const candidate = value as Record<string, unknown>;
  const requiredFields = [
    'id',
    'title',
    'category',
    'status',
    'sourceType',
    'date',
    'classification',
    'explanation',
    'sourceLink',
  ] as const;

  for (const field of requiredFields) {
    if (!isNonEmptyString(candidate[field])) {
      throw new Error(`evidence claim at index ${index} has invalid ${field}`);
    }
  }

  return candidate as EvidenceClaim;
}

function publicSourceUrl(sourceLink: string): string | undefined {
  try {
    const url = new URL(sourceLink);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function evidenceClaimsToDocuments(
  value: unknown,
  options: EvidenceClaimIngestionOptions = {},
): RagDocument[] {
  if (!Array.isArray(value)) throw new Error('evidence claims input must be an array');

  const allowed = new Set((options.includeClassifications ?? ['PUBLIC']).map((item) => item.toUpperCase()));
  const claims = value.map(parseEvidenceClaim);

  return claims
    .filter((claim) => allowed.has(claim.classification.toUpperCase()))
    .map((claim) => ({
      id: `evidence-claim:${claim.id}`,
      title: claim.title,
      sourceUrl: publicSourceUrl(claim.sourceLink),
      text: [
        claim.title,
        `Category: ${claim.category}`,
        `Verification status: ${claim.status}`,
        `Source type: ${claim.sourceType}`,
        `Date: ${claim.date}`,
        claim.explanation,
      ].join('\n'),
      metadata: {
        kind: 'evidence-claim',
        claimId: claim.id,
        category: claim.category,
        verificationStatus: claim.status,
        sourceType: claim.sourceType,
        sourceReference: claim.sourceLink,
        date: claim.date,
        classification: claim.classification,
      },
    }));
}
