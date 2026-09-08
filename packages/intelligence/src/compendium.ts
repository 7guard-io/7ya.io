export type CompendiumRecordType = 'activity' | 'content' | 'asset' | 'relation' | 'source' | 'claim' | 'evidence';
export type CompendiumPublicSafety = 'PUBLIC_SAFE' | 'RESTRICTED' | 'PRIVATE' | 'UNKNOWN';
export type CompendiumMetricSnapshot = {
  metricType: string;
  value: number | string;
  unit: string;
  snapshotDate: string;
  sourceId: string;
};
export type CompendiumProvenance = {
  sourceSystem: string;
  sourceRecordId: string;
  observedAt: string;
};
export type CompendiumRecord = {
  id: string;
  recordType: CompendiumRecordType;
  title: string;
  sourceIds: string[];
  provenance: CompendiumProvenance;
  publicSafety: CompendiumPublicSafety;
  verificationStatus: string;
  canonicalUrl?: string;
  nativeId?: string;
  relatedIds?: string[];
  metrics?: CompendiumMetricSnapshot[];
  metadata?: Record<string, unknown>;
};
export type CompendiumValidation = { ok: true } | { ok: false; reasons: string[] };
export type PublicCompendiumExport = {
  contract: '7ya-digital-compendium-v1';
  schemaVersion: 1;
  generatedAt: string;
  records: CompendiumRecord[];
  rejectedCount: number;
  rejectionReasons: Record<string, number>;
};

const recordTypes = new Set<CompendiumRecordType>(['activity', 'content', 'asset', 'relation', 'source', 'claim', 'evidence']);
const blockedVerification = new Set(['VERIFY_BEFORE_PUBLISHING', 'unresolved', 'contradicted', 'quarantined']);
const nonEmpty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function validatePublicCompendiumRecord(record: CompendiumRecord): CompendiumValidation {
  const reasons: string[] = [];
  if (!record || !nonEmpty(record.id) || !recordTypes.has(record.recordType) || !nonEmpty(record.title)) reasons.push('invalid-core');
  if (record.publicSafety !== 'PUBLIC_SAFE') reasons.push('not-public-safe');
  if (!record.provenance || !nonEmpty(record.provenance.sourceSystem) || !nonEmpty(record.provenance.sourceRecordId) || !nonEmpty(record.provenance.observedAt)) reasons.push('missing-provenance');
  if (!Array.isArray(record.sourceIds) || record.sourceIds.length < 1 || record.sourceIds.some((id) => !nonEmpty(id))) reasons.push('missing-source');
  if (!nonEmpty(record.verificationStatus) || blockedVerification.has(record.verificationStatus)) reasons.push('verification-blocked');
  for (const metric of record.metrics ?? []) {
    if (!nonEmpty(metric.metricType) || !nonEmpty(metric.unit) || !nonEmpty(metric.snapshotDate) || !nonEmpty(metric.sourceId)) reasons.push('invalid-metric-snapshot');
  }
  return reasons.length ? { ok: false, reasons: Array.from(new Set(reasons)) } : { ok: true };
}

export function buildPublicCompendiumExport(records: CompendiumRecord[], generatedAt: string): PublicCompendiumExport {
  const accepted: CompendiumRecord[] = [];
  const rejectionReasons: Record<string, number> = {};
  let rejectedCount = 0;
  for (const record of records) {
    const validation = validatePublicCompendiumRecord(record);
    if (validation.ok) {
      accepted.push(record);
      continue;
    }
    rejectedCount += 1;
    for (const reason of validation.reasons) rejectionReasons[reason] = (rejectionReasons[reason] ?? 0) + 1;
  }
  return {
    contract: '7ya-digital-compendium-v1',
    schemaVersion: 1,
    generatedAt,
    records: accepted,
    rejectedCount,
    rejectionReasons,
  };
}
