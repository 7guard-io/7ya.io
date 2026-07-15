export const claimStatuses = [
  'VERIFIED',
  'VERIFIED_WITH_ATTRIBUTION',
  'DATED_BASELINE',
  'QUARANTINED',
  'CAPTURE_REQUIRED'
] as const;

export type ClaimStatus = (typeof claimStatuses)[number];

export type EvidenceClaim = {
  id: string;
  entity: 'IGOR' | 'STARTON' | '7YA' | 'IGOR / STARTON' | 'IGOR / 7YA';
  title: Record<'he' | 'en' | 'ru', string>;
  status: ClaimStatus;
  evidenceClass: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  snapshotDate?: string;
  whatItProves: Record<'he' | 'en' | 'ru', string>;
  whatItDoesNotProve: Record<'he' | 'en' | 'ru', string>;
};

export type ClaimsDataset = {
  schemaVersion: 1;
  lastUpdated: string;
  baselineDate: string;
  claims: EvidenceClaim[];
};
