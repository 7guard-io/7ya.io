import { canonicalize } from './canonicalize.js';
import { sha256Hex } from './crypto.js';

export type EvidenceStatus = 'created' | 'attested' | 'revoked' | 'superseded' | string;

export type EvidenceRecord = {
  id: string;
  payloadHash: string;
  metadataHash: string;
  createdAt: string;
  source: string;
  status: EvidenceStatus;
  chainPrevHash: string;
  chainHash: string;
};

export type CreateEvidenceRecordInput = {
  payload: unknown;
  metadata?: unknown;
  createdAt?: string;
  source: string;
  status?: EvidenceStatus;
  chainPrevHash?: string;
};

export function computePayloadHash(payload: unknown): string {
  return sha256Hex(canonicalize(payload));
}

export function computeMetadataHash(metadata: unknown = {}): string {
  return sha256Hex(canonicalize(metadata));
}

export function computeChainHash(fields: Omit<EvidenceRecord, 'id' | 'chainHash'>): string {
  return sha256Hex(canonicalize({
    payloadHash: fields.payloadHash,
    metadataHash: fields.metadataHash,
    createdAt: fields.createdAt,
    source: fields.source,
    status: fields.status,
    chainPrevHash: fields.chainPrevHash,
  }));
}

export function computeEvidenceId(chainHash: string): string {
  return sha256Hex(`7ya:evidence:id:${chainHash}`);
}

export function createEvidenceRecord(input: CreateEvidenceRecordInput): EvidenceRecord {
  const recordWithoutIds = {
    payloadHash: computePayloadHash(input.payload),
    metadataHash: computeMetadataHash(input.metadata ?? {}),
    createdAt: input.createdAt ?? new Date().toISOString(),
    source: input.source,
    status: input.status ?? 'created',
    chainPrevHash: input.chainPrevHash ?? '',
  };
  const chainHash = computeChainHash(recordWithoutIds);
  return { ...recordWithoutIds, chainHash, id: computeEvidenceId(chainHash) };
}
