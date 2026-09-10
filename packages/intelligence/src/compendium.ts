export const LEGACY_COMPENDIUM_RELEASE = 'LEGACY-COMPENDIUM-20260909-1';
export const LEGACY_COMPENDIUM_CONTRACT = '7ya-legacy-compendium-public-v1';

export type PublicSafety = 'PUBLIC_SAFE' | 'PUBLIC_SAFE_METADATA' | 'RESTRICTED' | 'PRIVATE';
export type MetricSnapshot = { metricType: string; value: number | string; unit: string; snapshotDate: string; sourceId: string };
export type PublicRecord = { id: string; sourceIds: string[]; publicSafety: PublicSafety; verificationStatus: string; metrics?: MetricSnapshot[] };
export type LegacySource = { id: string; title: string; sourceType: string; platform: string; url: string; publicSafety: PublicSafety; verificationStatus: string };
export type LegacyPerson = PublicRecord & { recordType: 'person'; name: string; role: string };
export type LegacyOrganization = PublicRecord & { recordType: 'organization'; name: string; role: string };
export type LegacyActivity = PublicRecord & { recordType: 'activity'; activityType: string; title: string; startDate: string; entity: string; project: string; personIds: string[]; organizationIds: string[]; contentIds: string[]; assetIds: string[]; digitalObjectIds: string[] };
export type LegacyContent = PublicRecord & { recordType: 'content'; title: string; contentType: string; language: string; createdDate: string; author: string; originalPlatform: string; originalUrl: string; nativePlatformId: string; activityIds: string[]; assetIds: string[]; rights: string; canonicalStatus: string };
export type LegacyAsset = PublicRecord & { recordType: 'asset'; assetType: string; originalLocation: string; platformFileId: string; canonicalUrl: string; activityIds: string[]; project: string; rights: string };
export type LegacyDigitalObject = PublicRecord & { recordType: 'digital-object'; objectType: string; platform: string; accountHandle: string; accountLineage: string; nativeObjectId: string; canonicalUrl: string; parentObjectId?: string; relationship: string; title: string; publishedAt: string; activityIds: string[]; contentIds: string[]; echoIds: string[]; rights: string; status: string };
export type LegacyRelation = PublicRecord & { recordType: 'relation'; subjectId: string; predicate: string; objectId: string; confidence: string };

export type LegacyCompendiumSnapshot = {
  contract: string;
  release: string;
  schemaVersion: 2;
  status: 'VERIFIED_READBACK';
  generatedAt: string;
  authorities: { narrative: string; catalog: string; publicProjection: string };
  sourceLedger: { spreadsheetId: string; sourceSystem: string; ingestionId: string };
  sources: LegacySource[];
  people: LegacyPerson[];
  organizations: LegacyOrganization[];
  activities: LegacyActivity[];
  content: LegacyContent[];
  assets: LegacyAsset[];
  digitalObjects: LegacyDigitalObject[];
  relations: LegacyRelation[];
};

const text = (value: unknown, max = 2400): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const stableId = (value: string, prefix: string) => new RegExp(`^${prefix}-[A-Z0-9-]+$`).test(value);
const publishSafe = (value: PublicSafety) => value === 'PUBLIC_SAFE' || value === 'PUBLIC_SAFE_METADATA';
const blockedVerification = (value: string) => /VERIFY_BEFORE_PUBLISHING|QUARANTIN|CONTRADICTED/i.test(value);
const privateLocator = (value: string) => /GMAIL:\/\/|GDRIVE:\/\/|external-gdrive:|drive\.google\.com\/drive\/folders\//i.test(value);
const httpsUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};

function assertMetrics(metrics: MetricSnapshot[] | undefined, sourceIds: Set<string>, recordId: string) {
  for (const metric of metrics ?? []) {
    if (!text(metric.metricType, 120) || !text(metric.unit, 80) || !text(metric.snapshotDate, 32) || !text(metric.sourceId, 120) || !sourceIds.has(metric.sourceId)) {
      throw new Error(`invalid dated metric provenance: ${recordId}`);
    }
  }
}

function assertPublishable(record: PublicRecord, sourceIds: Set<string>) {
  if (!publishSafe(record.publicSafety)) throw new Error(`public projection requires PUBLIC_SAFE: ${record.id}`);
  if (!text(record.verificationStatus, 160) || blockedVerification(record.verificationStatus)) throw new Error(`record is not publish-compatible: ${record.id}`);
  if (!Array.isArray(record.sourceIds) || record.sourceIds.length < 1 || record.sourceIds.some((id) => !sourceIds.has(id))) throw new Error(`public projection requires valid provenance: ${record.id}`);
  assertMetrics(record.metrics, sourceIds, record.id);
}

export function validateLegacyCompendiumSnapshot(input: LegacyCompendiumSnapshot): LegacyCompendiumSnapshot {
  const serialized = JSON.stringify(input);
  if (privateLocator(serialized)) throw new Error('private locator leaked into public compendium');
  const snapshot = JSON.parse(serialized) as LegacyCompendiumSnapshot;
  if (snapshot.contract !== LEGACY_COMPENDIUM_CONTRACT || snapshot.release !== LEGACY_COMPENDIUM_RELEASE || snapshot.schemaVersion !== 2 || snapshot.status !== 'VERIFIED_READBACK') throw new Error('invalid legacy compendium contract');
  for (const collection of [snapshot.sources, snapshot.people, snapshot.organizations, snapshot.activities, snapshot.content, snapshot.assets, snapshot.digitalObjects, snapshot.relations]) {
    if (!Array.isArray(collection)) throw new Error('legacy compendium collections required');
  }
  const sourceIds = new Set<string>();
  for (const source of snapshot.sources) {
    if (!stableId(source.id, 'SRC') || !text(source.title, 500) || !text(source.sourceType, 240) || !text(source.platform, 120) || !httpsUrl(source.url) || !publishSafe(source.publicSafety) || blockedVerification(source.verificationStatus)) throw new Error(`invalid public compendium source: ${source.id}`);
    if (sourceIds.has(source.id)) throw new Error(`duplicate source id: ${source.id}`);
    sourceIds.add(source.id);
  }
  const objectIds = new Set<string>(sourceIds);
  const add = (id: string) => {
    if (objectIds.has(id)) throw new Error(`duplicate object id: ${id}`);
    objectIds.add(id);
  };
  for (const record of snapshot.people) {
    if (!stableId(record.id, 'PER') || record.recordType !== 'person' || !text(record.name, 240) || !text(record.role, 240)) throw new Error(`invalid person: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const record of snapshot.organizations) {
    if (!stableId(record.id, 'ORG') || record.recordType !== 'organization' || !text(record.name, 240) || !text(record.role, 240)) throw new Error(`invalid organization: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const record of snapshot.activities) {
    if (!stableId(record.id, 'ACT') || record.recordType !== 'activity' || !text(record.title, 500) || !text(record.startDate, 32)) throw new Error(`invalid activity: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const record of snapshot.content) {
    if (!stableId(record.id, 'CNT') || record.recordType !== 'content' || !text(record.title, 500) || !text(record.createdDate, 32) || !httpsUrl(record.originalUrl)) throw new Error(`invalid content: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const record of snapshot.assets) {
    if (!stableId(record.id, 'AST') || record.recordType !== 'asset' || !httpsUrl(record.originalLocation) || !httpsUrl(record.canonicalUrl)) throw new Error(`invalid asset: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const record of snapshot.digitalObjects) {
    if (!stableId(record.id, 'DOBJ') || record.recordType !== 'digital-object' || !text(record.objectType, 80) || !text(record.platform, 120) || !text(record.accountHandle, 240) || !text(record.accountLineage, 500) || !httpsUrl(record.canonicalUrl) || !text(record.relationship, 120) || !text(record.title, 500) || !text(record.publishedAt, 32) || !text(record.status, 120)) throw new Error(`invalid digital object: ${record.id}`);
    assertPublishable(record, sourceIds); add(record.id);
  }
  for (const activity of snapshot.activities) {
    for (const id of [...activity.personIds, ...activity.organizationIds, ...activity.contentIds, ...activity.assetIds, ...activity.digitalObjectIds]) if (!objectIds.has(id)) throw new Error(`activity relation does not resolve: ${activity.id} -> ${id}`);
  }
  for (const content of snapshot.content) {
    for (const id of [...content.activityIds, ...content.assetIds]) if (!objectIds.has(id)) throw new Error(`content relation does not resolve: ${content.id} -> ${id}`);
  }
  for (const asset of snapshot.assets) for (const id of asset.activityIds) if (!objectIds.has(id)) throw new Error(`asset relation does not resolve: ${asset.id} -> ${id}`);
  for (const object of snapshot.digitalObjects) {
    if (object.parentObjectId && !objectIds.has(object.parentObjectId)) throw new Error(`digital object parent does not resolve: ${object.id}`);
    for (const id of [...object.activityIds, ...object.contentIds, ...object.echoIds]) if (!objectIds.has(id)) throw new Error(`digital object relation does not resolve: ${object.id} -> ${id}`);
  }
  for (const relation of snapshot.relations) {
    if (!stableId(relation.id, 'REL') || relation.recordType !== 'relation' || !text(relation.predicate, 120) || !text(relation.confidence, 80) || !objectIds.has(relation.subjectId) || !objectIds.has(relation.objectId)) throw new Error(`invalid relation: ${relation.id}`);
    assertPublishable(relation, sourceIds); add(relation.id);
  }
  return snapshot;
}

const snapshot: LegacyCompendiumSnapshot = {
  contract: LEGACY_COMPENDIUM_CONTRACT,
  release: LEGACY_COMPENDIUM_RELEASE,
  schemaVersion: 2,
  status: 'VERIFIED_READBACK',
  generatedAt: '2026-09-09T03:00:00+03:00',
  authorities: {
    narrative: 'IGOR VEPRETSKI — MASTER CANON v1.0 — LIVING SOURCE OF TRUTH',
    catalog: 'IGOR VEPRETSKI — MASTER EVIDENCE LEDGER v1.0',
    publicProjection: '7ya.io validated public projection',
  },
  sourceLedger: {
    spreadsheetId: '1GTqVhy8iLGW6tvM5wwwso5hFd3JcA6iKz1GYX0CEF3I',
    sourceSystem: 'MASTER_EVIDENCE_LEDGER',
    ingestionId: 'ING-20260909-003',
  },
  sources: [
    { id: 'SRC-006', title: 'Personal interview — StartOn origin story', sourceType: 'Autobiographical video', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=hDcKJ46PBJ4', verificationStatus: 'VERIFIED_PUBLIC_SOURCE', publicSafety: 'PUBLIC_SAFE' },
    { id: 'SRC-016', title: 'Twitter account confirmation metadata — public identity projection', sourceType: 'First-party platform provenance · public metadata projection', platform: 'X / Twitter', url: 'https://x.com/igorvepretski', verificationStatus: 'VERIFIED_PRIVATE_PROVENANCE_PUBLIC_METADATA', publicSafety: 'PUBLIC_SAFE_METADATA' },
    { id: 'SRC-017', title: 'First YouTube upload metadata — public object projection', sourceType: 'First-party platform provenance · public metadata projection', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=feGSc663qww', verificationStatus: 'VERIFIED_PRIVATE_PROVENANCE_PUBLIC_METADATA', publicSafety: 'PUBLIC_SAFE_METADATA' },
    { id: 'SRC-018', title: 'Instagram cross-post preserved by Twitter — public object projection', sourceType: 'First-party cross-platform provenance · public metadata projection', platform: 'X / Twitter', url: 'https://x.com/igorvepretski/status/204513188107124736', verificationStatus: 'VERIFIED_PRIVATE_PROVENANCE_PUBLIC_METADATA', publicSafety: 'PUBLIC_SAFE_METADATA' },
    { id: 'SRC-019', title: 'YouTube account lineage — MrIgor981 to igorvepretski', sourceType: 'First-party account-lineage provenance · public metadata projection', platform: 'YouTube', url: 'https://www.youtube.com/user/MrIgor981', verificationStatus: 'VERIFIED_PRIVATE_PROVENANCE_PUBLIC_METADATA', publicSafety: 'PUBLIC_SAFE_METADATA' },
    { id: 'SRC-020', title: 'Current Instagram account lineage — public identity projection', sourceType: 'Owner-export provenance · public metadata projection', platform: 'Instagram', url: 'https://www.instagram.com/igor.vepretski/', verificationStatus: 'VERIFIED_OWNER_EXPORT_PUBLIC_METADATA', publicSafety: 'PUBLIC_SAFE_METADATA' },
  ],
  people: [
    { id: 'PER-IGOR', recordType: 'person', name: 'Igor Vepretski', role: 'root subject', sourceIds: ['SRC-016'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_IDENTITY' },
  ],
  organizations: [
    { id: 'ORG-STARTON', recordType: 'organization', name: 'StartOn', role: 'social-impact organization founded by Igor Vepretski', sourceIds: ['SRC-006'], publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED_PUBLIC_SOURCE' },
  ],
  activities: [
    { id: 'ACT-2011-000001', recordType: 'activity', activityType: 'DIGITAL_IDENTITY_ORIGIN', title: 'Digital identity origin — Twitter + first YouTube upload', startDate: '2011-10-05', entity: 'Igor Vepretski', project: 'Digital / Creator Identity', personIds: ['PER-IGOR'], organizationIds: [], sourceIds: ['SRC-016', 'SRC-017'], contentIds: ['CNT-000010'], assetIds: [], digitalObjectIds: ['DOBJ-000001', 'DOBJ-000002', 'DOBJ-000003'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM' },
    { id: 'ACT-2012-000001', recordType: 'activity', activityType: 'CROSS_PLATFORM_PUBLISHING', title: 'Instagram photo cross-post preserved via Twitter', startDate: '2012-05-21', entity: 'Igor Vepretski', project: 'Digital / Creator Identity', personIds: ['PER-IGOR'], organizationIds: [], sourceIds: ['SRC-018'], contentIds: ['CNT-000011'], assetIds: [], digitalObjectIds: ['DOBJ-000004', 'DOBJ-000005'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM_ECHO' },
    { id: 'ACT-2015-000001', recordType: 'activity', activityType: 'ACCOUNT_LINEAGE', title: 'YouTube identity continuity — MrIgor981 ↔ igorvepretski', startDate: '2015-01-29', entity: 'Igor Vepretski', project: 'Digital / Creator Identity', personIds: ['PER-IGOR'], organizationIds: [], sourceIds: ['SRC-019'], contentIds: [], assetIds: [], digitalObjectIds: ['DOBJ-000003'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM' },
    { id: 'ACT-2021-000001', recordType: 'activity', activityType: 'ACCOUNT_CREATION', title: 'Current Instagram account creation', startDate: '2021-10-21', entity: 'Igor Vepretski', project: 'Digital / Creator Identity', personIds: ['PER-IGOR'], organizationIds: [], sourceIds: ['SRC-020'], contentIds: [], assetIds: [], digitalObjectIds: ['DOBJ-000006'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_OWNER_EXPORT' },
    { id: 'ACT-2022-000001', recordType: 'activity', activityType: 'INTERVIEW', title: 'Personal interview — StartOn origin story', startDate: '2022-09-09', entity: 'Igor Vepretski', project: 'StartOn', personIds: ['PER-IGOR'], organizationIds: ['ORG-STARTON'], sourceIds: ['SRC-006'], contentIds: ['CNT-000001'], assetIds: ['AST-000001'], digitalObjectIds: [], publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED_PUBLIC_SOURCE' },
  ],
  content: [
    { id: 'CNT-000001', recordType: 'content', title: 'Personal interview — StartOn origin story', contentType: 'VIDEO', language: 'HE', createdDate: '2022-09-09', author: 'Igor Vepretski', originalPlatform: 'YouTube', originalUrl: 'https://www.youtube.com/watch?v=hDcKJ46PBJ4', nativePlatformId: 'hDcKJ46PBJ4', sourceIds: ['SRC-006'], activityIds: ['ACT-2022-000001'], assetIds: ['AST-000001'], rights: 'OWNED_SURFACE_PUBLIC', publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED_PUBLIC_SOURCE', canonicalStatus: 'CANONICAL_SEED' },
    { id: 'CNT-000010', recordType: 'content', title: 'First YouTube upload — title unresolved', contentType: 'VIDEO_METADATA_ONLY', language: 'UNKNOWN', createdDate: '2011-10-27', author: 'Igor Vepretski', originalPlatform: 'YouTube', originalUrl: 'https://www.youtube.com/watch?v=feGSc663qww', nativePlatformId: 'feGSc663qww', sourceIds: ['SRC-017'], activityIds: ['ACT-2011-000001'], assetIds: [], rights: 'OWNED_HISTORICAL_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_PLATFORM_PROVENANCE', canonicalStatus: 'CANONICAL_OBJECT_METADATA' },
    { id: 'CNT-000011', recordType: 'content', title: 'Instagram photo — caption unresolved', contentType: 'PHOTO_METADATA_ONLY', language: 'UNKNOWN', createdDate: '2012-05-21', author: 'Igor Vepretski', originalPlatform: 'Instagram', originalUrl: 'https://www.instagram.com/p/K4nsQfq6Z3/', nativePlatformId: 'K4nsQfq6Z3', sourceIds: ['SRC-018'], activityIds: ['ACT-2012-000001'], assetIds: [], rights: 'OWNERSHIP_LINEAGE_UNRESOLVED', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_PLATFORM_ECHO', canonicalStatus: 'CANONICAL_OBJECT_METADATA' },
  ],
  assets: [
    { id: 'AST-000001', recordType: 'asset', assetType: 'VIDEO_REMOTE', originalLocation: 'https://www.youtube.com/watch?v=hDcKJ46PBJ4', platformFileId: 'hDcKJ46PBJ4', canonicalUrl: 'https://www.youtube.com/watch?v=hDcKJ46PBJ4', sourceIds: ['SRC-006'], activityIds: ['ACT-2022-000001'], project: 'StartOn', rights: 'OWNED_SURFACE_PUBLIC', publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED_PUBLIC_SOURCE' },
  ],
  digitalObjects: [
    { id: 'DOBJ-000001', recordType: 'digital-object', objectType: 'ACCOUNT', platform: 'X / Twitter', accountHandle: '@igorvepretski', accountLineage: 'igorvepretski → current X identity', nativeObjectId: '385563743', canonicalUrl: 'https://x.com/igorvepretski', relationship: 'owned_identity', title: 'Twitter account identity', publishedAt: '2011-10-05', sourceIds: ['SRC-016'], activityIds: ['ACT-2011-000001'], contentIds: [], echoIds: [], rights: 'OWNED_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM', status: 'CANONICAL' },
    { id: 'DOBJ-000002', recordType: 'digital-object', objectType: 'VIDEO', platform: 'YouTube', accountHandle: 'MrIgor981', accountLineage: 'MrIgor981 → igorvepretski', nativeObjectId: 'feGSc663qww', canonicalUrl: 'https://www.youtube.com/watch?v=feGSc663qww', parentObjectId: 'DOBJ-000003', relationship: 'first_upload', title: 'First YouTube upload — title unresolved', publishedAt: '2011-10-27', sourceIds: ['SRC-017'], activityIds: ['ACT-2011-000001'], contentIds: ['CNT-000010'], echoIds: [], rights: 'OWNED_HISTORICAL_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM', status: 'CANONICAL_OPEN_MEDIA' },
    { id: 'DOBJ-000003', recordType: 'digital-object', objectType: 'ACCOUNT', platform: 'YouTube', accountHandle: 'MrIgor981 / igorvepretski', accountLineage: 'MrIgor981 → igorvepretski', nativeObjectId: 'UNKNOWN', canonicalUrl: 'https://www.youtube.com/user/MrIgor981', relationship: 'owned_identity', title: 'YouTube account lineage', publishedAt: '2011-10-27', sourceIds: ['SRC-017', 'SRC-019'], activityIds: ['ACT-2011-000001', 'ACT-2015-000001'], contentIds: ['CNT-000010'], echoIds: ['DOBJ-000002'], rights: 'OWNED_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM', status: 'CANONICAL' },
    { id: 'DOBJ-000004', recordType: 'digital-object', objectType: 'PHOTO', platform: 'Instagram', accountHandle: 'UNRESOLVED_2012_ACCOUNT', accountLineage: 'pre-2016 Instagram lineage unresolved', nativeObjectId: 'K4nsQfq6Z3', canonicalUrl: 'https://www.instagram.com/p/K4nsQfq6Z3/', relationship: 'origin_object', title: 'Instagram photo — caption unresolved', publishedAt: '2012-05-21', sourceIds: ['SRC-018'], activityIds: ['ACT-2012-000001'], contentIds: ['CNT-000011'], echoIds: ['DOBJ-000005'], rights: 'OWNERSHIP_LINEAGE_UNRESOLVED', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_PLATFORM_ECHO', status: 'CANONICAL_OPEN_IDENTITY' },
    { id: 'DOBJ-000005', recordType: 'digital-object', objectType: 'POST', platform: 'X / Twitter', accountHandle: '@igorvepretski', accountLineage: 'igorvepretski → current X identity', nativeObjectId: '204513188107124736', canonicalUrl: 'https://x.com/igorvepretski/status/204513188107124736', parentObjectId: 'DOBJ-000004', relationship: 'cross_post_of', title: 'Just posted a photo', publishedAt: '2012-05-21', sourceIds: ['SRC-018'], activityIds: ['ACT-2012-000001'], contentIds: ['CNT-000011'], echoIds: ['DOBJ-000004'], rights: 'OWNED_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_DIRECT_PLATFORM_ECHO', status: 'CANONICAL_ECHO' },
    { id: 'DOBJ-000006', recordType: 'digital-object', objectType: 'ACCOUNT', platform: 'Instagram', accountHandle: '@igor.vepretski', accountLineage: 'current account lineage created 2021-10-21', nativeObjectId: 'UNKNOWN', canonicalUrl: 'https://www.instagram.com/igor.vepretski/', relationship: 'owned_identity', title: 'Current Instagram account', publishedAt: '2021-10-21', sourceIds: ['SRC-020'], activityIds: ['ACT-2021-000001'], contentIds: [], echoIds: [], rights: 'OWNED_ACCOUNT', publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_OWNER_EXPORT', status: 'CANONICAL' },
  ],
  relations: [
    { id: 'REL-000001', recordType: 'relation', subjectId: 'ACT-2022-000001', predicate: 'produced_content', objectId: 'CNT-000001', sourceIds: ['SRC-006'], publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000002', recordType: 'relation', subjectId: 'CNT-000001', predicate: 'represented_by_asset', objectId: 'AST-000001', sourceIds: ['SRC-006'], publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000021', recordType: 'relation', subjectId: 'ACT-2011-000001', predicate: 'produced_content', objectId: 'CNT-000010', sourceIds: ['SRC-017'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000022', recordType: 'relation', subjectId: 'CNT-000010', predicate: 'derived_from_source', objectId: 'SRC-017', sourceIds: ['SRC-017'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000023', recordType: 'relation', subjectId: 'ACT-2012-000001', predicate: 'produced_content', objectId: 'CNT-000011', sourceIds: ['SRC-018'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000024', recordType: 'relation', subjectId: 'CNT-000011', predicate: 'cross_posted_as', objectId: 'DOBJ-000005', sourceIds: ['SRC-018'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000025', recordType: 'relation', subjectId: 'ACT-2015-000001', predicate: 'links_account_identity', objectId: 'DOBJ-000003', sourceIds: ['SRC-019'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000026', recordType: 'relation', subjectId: 'ACT-2021-000001', predicate: 'established_account', objectId: 'DOBJ-000006', sourceIds: ['SRC-020'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000027', recordType: 'relation', subjectId: 'DOBJ-000004', predicate: 'distributed_as', objectId: 'DOBJ-000005', sourceIds: ['SRC-018'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000028', recordType: 'relation', subjectId: 'DOBJ-000002', predicate: 'belongs_to_account', objectId: 'DOBJ-000003', sourceIds: ['SRC-017', 'SRC-019'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED_LINEAGE', confidence: 'HIGH' },
    { id: 'REL-000029', recordType: 'relation', subjectId: 'ACT-2011-000001', predicate: 'involves', objectId: 'PER-IGOR', sourceIds: ['SRC-016'], publicSafety: 'PUBLIC_SAFE_METADATA', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
    { id: 'REL-000030', recordType: 'relation', subjectId: 'ACT-2022-000001', predicate: 'involves', objectId: 'ORG-STARTON', sourceIds: ['SRC-006'], publicSafety: 'PUBLIC_SAFE', verificationStatus: 'VERIFIED', confidence: 'HIGH' },
  ],
};

export const legacyCompendiumPublicSnapshot = validateLegacyCompendiumSnapshot(snapshot);
