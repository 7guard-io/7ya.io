import { z } from 'zod';

export const evidenceSourceStatusValues = [
  'verified',
  'source_visible',
  'source_pending',
  'unverified',
  'disputed',
] as const;

export const evidenceVisibilityValues = ['public', 'internal', 'private'] as const;
export const evidenceRiskValues = ['low', 'medium', 'high'] as const;

export const EvidenceOracleReferenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url().optional(),
  observedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const EvidenceOracleClaimSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  claim: z.string().min(1),
  source_status: z.enum(evidenceSourceStatusValues),
  visibility: z.enum(evidenceVisibilityValues).default('public'),
  risk: z.enum(evidenceRiskValues).default('medium'),
  evidence_refs: z.array(EvidenceOracleReferenceSchema).default([]),
  approved_language: z.array(z.string().min(1)).min(1),
  blocked_phrases: z.array(z.string().min(1)).default([]),
  verification_notes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
}).superRefine((claim, context) => {
  if ((claim.source_status === 'verified' || claim.source_status === 'source_visible') && claim.evidence_refs.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['evidence_refs'],
      message: 'verified/source_visible claims require at least one evidence reference',
    });
  }
});

export const EvidenceOracleBatchSchema = z.object({
  schema: z.literal('7ya.evidence-oracle.claims.v1'),
  generated_at: z.string().datetime(),
  claims: z.array(EvidenceOracleClaimSchema),
});

export type EvidenceSourceStatus = typeof evidenceSourceStatusValues[number];
export type EvidenceOracleReference = z.infer<typeof EvidenceOracleReferenceSchema>;
export type EvidenceOracleClaim = z.infer<typeof EvidenceOracleClaimSchema>;
export type EvidenceOracleBatch = z.infer<typeof EvidenceOracleBatchSchema>;

export function parseEvidenceOracleClaim(input: unknown): EvidenceOracleClaim {
  return EvidenceOracleClaimSchema.parse(input);
}

export function parseEvidenceOracleBatch(input: unknown): EvidenceOracleBatch {
  return EvidenceOracleBatchSchema.parse(input);
}

export function findBlockedClaimPhrases(claim: EvidenceOracleClaim, text: string): string[] {
  const normalizedText = text.toLocaleLowerCase();
  return claim.blocked_phrases.filter((phrase) => normalizedText.includes(phrase.toLocaleLowerCase()));
}

export function isEvidenceClaimSafeToPublish(claim: EvidenceOracleClaim, publicText: string): boolean {
  if (claim.visibility !== 'public') return false;
  if (findBlockedClaimPhrases(claim, publicText).length > 0) return false;
  if ((claim.source_status === 'verified' || claim.source_status === 'source_visible') && claim.evidence_refs.length === 0) return false;
  return true;
}
