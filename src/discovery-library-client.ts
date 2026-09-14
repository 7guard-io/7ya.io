import { api } from '@appdeploy/client';

export type DiscoveryOrigin = 'media-master' | 'discovery-max' | 'social-live' | 'world-search-seed';
export type DiscoveryRecord = { id: string; title: string; platform: string; publisher: string; date: string; year: string; relationship: string; url: string; verification: string; origin: DiscoveryOrigin; imageUrl: string };
export type CoverageGap = { id: string; kind: 'discovery-only' | 'unresolved' | 'visual' | 'undated' | 'platform'; subject: string; count: number; priority: number };
export type DiscoveryResponse = { release: string; status: 'live' | 'partial' | 'unavailable'; safeTotal: number; filteredTotal: number; count: number; origins: { mediaMaster: number; discoveryMax: number; socialLive: number; worldSearch: number }; gaps?: { generatedAt: string; totalCandidates: number; items: CoverageGap[] }; items: DiscoveryRecord[] };

type ProjectionItem = {
    id: string;
    layer: 'CANON' | 'DISCOVERY' | 'LIVE' | 'LEGACY' | 'PENDING';
    title: { he: string; en: string; ru: string };
    summary: { he: string; en: string; ru: string };
    date: string;
    year: string;
    platform: string;
    publisher: string;
    sourceKind: string;
    sourceUrl: string;
    imageUrl: string;
    screenshotUrl: string;
    trust: string;
    relatedLabels: string[];
    origins: string[];
};
type ProjectionPayload = {
    release: string;
    status?: 'live' | 'partial';
    items?: ProjectionItem[];
};
type DiscoveryValues = { q?: string; platform?: string; year?: string; type?: string; limit?: number };

const params = (values: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
        if (value !== undefined && String(value).trim()) query.set(key, String(value));
    }
    return query.toString();
};

const originFromProjection = (item: ProjectionItem): DiscoveryOrigin => {
    if (item.origins?.includes('media-master')) return 'media-master';
    if (item.origins?.includes('discovery-max')) return 'discovery-max';
    if (item.origins?.includes('social-live') || item.layer === 'LIVE') return 'social-live';
    return 'world-search-seed';
};

async function fetchProjectionDiscovery(values: DiscoveryValues): Promise<DiscoveryResponse> {
    const limit = Math.max(20, Math.min(100, values.limit || 100));
    const response = await api.get('/api/public-projection?' + params({
        q: values.q,
        platform: values.platform,
        year: values.year,
        type: values.type,
        limit,
        sort: 'newest',
    }));
    const payload = response.data as ProjectionPayload;
    const items = (payload.items || [])
        .filter(item => (item.layer === 'DISCOVERY' || item.layer === 'LIVE') && Boolean(item.sourceUrl))
        .map<DiscoveryRecord>(item => ({
            id: 'projection:' + item.id,
            title: item.title?.he || item.title?.en || item.publisher || item.platform,
            platform: item.platform || 'Web',
            publisher: item.publisher || item.platform || 'Public source',
            date: item.date || '',
            year: item.year || '',
            relationship: [item.sourceKind, ...(item.relatedLabels || []).slice(0, 2)].filter(Boolean).join(' · '),
            url: item.sourceUrl,
            verification: item.trust || (item.layer === 'LIVE' ? 'LIVE-SOURCE' : 'DISCOVERY'),
            origin: originFromProjection(item),
            imageUrl: item.imageUrl || item.screenshotUrl || '',
        }));
    const origins = {
        mediaMaster: items.filter(item => item.origin === 'media-master').length,
        discoveryMax: items.filter(item => item.origin === 'discovery-max').length,
        socialLive: items.filter(item => item.origin === 'social-live').length,
        worldSearch: items.filter(item => item.origin === 'world-search-seed').length,
    };
    return {
        release: payload.release + '+projection-discovery-fallback',
        status: payload.status === 'partial' ? 'partial' : 'live',
        safeTotal: items.length,
        filteredTotal: items.length,
        count: items.length,
        origins,
        items,
    };
}

export async function fetchDiscoveryLibrary(values: DiscoveryValues = {}) {
    try {
        const response = await api.get('/api/discovery-library?' + params(values));
        const payload = response.data as DiscoveryResponse;
        if (payload.status !== 'unavailable') return payload;
    } catch {
        // The unified projection is the resilient read path when the forensic endpoint is degraded.
    }
    return fetchProjectionDiscovery(values);
}
