import { computeChainHash, computeEvidenceId, type EvidenceRecord } from './record.js';

export function verifyEvidenceRecord(record: EvidenceRecord): boolean {
  const expectedChainHash = computeChainHash({
    payloadHash: record.payloadHash,
    metadataHash: record.metadataHash,
    createdAt: record.createdAt,
    source: record.source,
    status: record.status,
    chainPrevHash: record.chainPrevHash,
  });
  return record.chainHash === expectedChainHash && record.id === computeEvidenceId(expectedChainHash);
}
