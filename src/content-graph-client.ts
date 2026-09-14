import { api } from '@appdeploy/client';

export type GraphTruth = 'VERIFIED' | 'STRONGLY_INFERRED' | 'REQUIRES_CONFIRMATION';
export type GraphSource = { id: string; label: string; url: string; kind: string; platform?: string; publishedAt?: string };
export type GraphMedia = { kind: string; label: string; sourceUrl: string; url?: string; authenticity: string; captureDate?: string; publicationDate?: string };
export type GraphMetric = { metricType: string; value: number | string; unit: string; snapshotDate: string; sourceUrl: string; platform?: string; verification: string };
export type ContentRecord = { id: string; canonicalId: string; kind: string; canonicalType: string; canonicalDate: string; truthStatus: GraphTruth; title: { he: string; en: string; ru: string }; summary: { he: string; en: string; ru: string }; tags: string[]; surfaces: string[]; platforms: string[]; sources: GraphSource[]; media: GraphMedia[]; metrics: GraphMetric[]; relatedEventIds: string[]; impact: { state: string; signals: string[] } };
export type CoverageRow = { domain: string; known: number; published: number; missing: boolean; weak: number; unverified: number };
export type GraphResponse = { release: string; count: number; results: ContentRecord[] };

type ProjectionMetric = { label: string; value: string; unit: string; date: string };
type ProjectionItem = {
    id: string;
    layer: 'CANON' | 'DISCOVERY' | 'LIVE' | 'LEGACY' | 'PENDING';
    canonicalId: string;
    title: { he: string; en: string; ru: string };
    summary: { he: string; en: string; ru: string };
    date: string;
    year: string;
    platform: string;
    publisher: string;
    mediaType: string;
    sourceKind: string;
    sourceUrl: string;
    imageUrl: string;
    trust: string;
    topics: string[];
    relationships: string[];
    metrics: ProjectionMetric[];
};
type ProjectionPayload = {
    release: string;
    knownTotal?: number;
    items?: ProjectionItem[];
    facets?: { layers?: Array<[string, number]> };
};

type SearchValues = { q?: string; kind?: string; type?: string; year?: string; topic?: string; platform?: string; verification?: string; surface?: string; limit?: number };

const params = (values: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
        if (value !== undefined && String(value).trim()) query.set(key, String(value));
    }
    return query.toString();
};

const truthFromProjection = (item: ProjectionItem): GraphTruth => {
    const trust = item.trust.toUpperCase();
    if (trust.includes('VERIFIED')) return 'VERIFIED';
    if (trust.includes('SUPPORTED') || trust.includes('INFERRED')) return 'STRONGLY_INFERRED';
    return 'REQUIRES_CONFIRMATION';
};

const canonicalTypeFromProjection = (mediaType: string) => {
    if (mediaType === 'article') return 'writing';
    if (mediaType === 'video' || mediaType === 'audio') return 'media';
    if (mediaType === 'post') return 'post';
    if (mediaType === 'document') return 'research';
    return 'event';
};

const graphKindFromProjection = (canonicalType: string) => {
    if (canonicalType === 'writing') return 'Article';
    if (canonicalType === 'media') return 'MediaMention';
    if (canonicalType === 'post') return 'Post';
    if (canonicalType === 'research') return 'Research';
    return 'Event';
};

const projectionRecord = (item: ProjectionItem): ContentRecord => {
    const truthStatus = truthFromProjection(item);
    const canonicalType = canonicalTypeFromProjection(item.mediaType);
    const canonicalDate = item.date || (item.year ? item.year + '-01-01' : '');
    const media: GraphMedia[] = item.imageUrl ? [{
        kind: 'image',
        label: item.publisher || item.platform,
        sourceUrl: item.sourceUrl,
        url: item.imageUrl,
        authenticity: truthStatus === 'VERIFIED' ? 'verified' : 'public-source',
        publicationDate: canonicalDate,
    }] : [];
    return {
        id: 'projection:' + item.id,
        canonicalId: item.canonicalId || item.id,
        kind: graphKindFromProjection(canonicalType),
        canonicalType,
        canonicalDate,
        truthStatus,
        title: item.title,
        summary: item.summary,
        tags: item.topics || [],
        surfaces: [...(item.topics || []), item.mediaType, item.platform].filter(Boolean),
        platforms: item.platform ? [item.platform] : [],
        sources: item.sourceUrl ? [{
            id: 'projection-source:' + item.id,
            label: item.publisher || item.platform || 'Public source',
            url: item.sourceUrl,
            kind: item.sourceKind || 'public-source',
            platform: item.platform,
            publishedAt: item.date || undefined,
        }] : [],
        media,
        metrics: (item.metrics || []).map(metric => ({
            metricType: metric.label,
            value: metric.value,
            unit: metric.unit,
            snapshotDate: metric.date,
            sourceUrl: item.sourceUrl,
            platform: item.platform,
            verification: truthStatus === 'VERIFIED' ? 'verified' : 'source-bound',
        })),
        relatedEventIds: [],
        impact: { state: item.layer, signals: item.relationships || [] },
    };
};

const matchesFallbackFilters = (record: ContentRecord, values: SearchValues) => {
    const normalized = (value: string) => value.trim().toLowerCase();
    if (values.kind && normalized(record.kind) !== normalized(values.kind)) return false;
    if (values.type && normalized(record.canonicalType) !== normalized(values.type)) return false;
    if (values.verification && normalized(record.truthStatus.replace(/_/g, '-')) !== normalized(values.verification.replace(/_/g, '-'))) return false;
    if (values.surface && !record.surfaces.some(value => normalized(value) === normalized(values.surface!))) return false;
    return true;
};

async function fetchProjectionSearch(values: SearchValues): Promise<GraphResponse> {
    const limit = Math.max(20, Math.min(100, values.limit || 60));
    const response = await api.get('/api/public-projection?' + params({
        q: values.q,
        year: values.year,
        platform: values.platform,
        topic: values.topic,
        limit,
        sort: 'impact',
    }));
    const payload = response.data as ProjectionPayload;
    const results = (payload.items || [])
        .filter(item => item.layer === 'CANON' && Boolean(item.sourceUrl))
        .map(projectionRecord)
        .filter(record => matchesFallbackFilters(record, values))
        .slice(0, values.limit || 60);
    return { release: payload.release + '+projection-search-fallback', count: results.length, results };
}

export async function fetchGraphSearch(values: SearchValues = {}) {
    try {
        const response = await api.get('/api/graph/search?' + params(values));
        return response.data as GraphResponse;
    } catch {
        return fetchProjectionSearch(values);
    }
}

export async function fetchGraphPosts(values: { q?: string; year?: string; topic?: string; platform?: string; limit?: number } = {}) {
    try {
        const response = await api.get('/api/graph/posts?' + params(values));
        return response.data as GraphResponse;
    } catch {
        return fetchProjectionSearch({ ...values, type: 'post' });
    }
}

export async function fetchGraphCoverage() {
    try {
        const response = await api.get('/api/graph/coverage');
        return response.data as { release: string; coverage: CoverageRow[] };
    } catch {
        const response = await api.get('/api/public-projection?limit=20&sort=impact');
        const payload = response.data as ProjectionPayload;
        const canon = payload.facets?.layers?.find(([layer]) => layer === 'CANON')?.[1] || 0;
        const coverage: CoverageRow[] = canon > 0 ? [{
            domain: 'Canonical sources',
            known: canon,
            published: canon,
            missing: false,
            weak: 0,
            unverified: 0,
        }] : [];
        return { release: payload.release + '+projection-coverage-fallback', coverage };
    }
}
