import type { ProjectionMoment, StoryMoment } from './museum-narrative-core';

export type ImpactLedgerRecord = {
    platform: string;
    account?: string;
    scope: 'account' | 'post' | 'site';
    url: string;
    title?: string;
    metric_name: string;
    metric_display: string;
    metric_unit: string;
    published_at?: string | null;
    collected_at: string;
    verification_status: string;
    public_claim_ok?: boolean;
};

export type TraceSurface = {
    id: string;
    url: string;
    platform: string;
    publisher: string;
    title: string;
    trust: string;
    year: string;
};

export type TraceMetric = {
    sourceUrl: string;
    platform: string;
    metricName: string;
    metricDisplay: string;
    metricUnit: string;
    date: string;
    verification: string;
    source: 'projection' | 'impact-ledger';
};

export type ImpactTrace = {
    canonicalId: string;
    surfaces: TraceSurface[];
    metrics: TraceMetric[];
    syntheticTotal: null;
};

export type GalaxyCluster = {
    canonicalId: string;
    label: string;
    year: string;
    index: number;
    sourceCount: number;
    metricCount: number;
    gravity: number;
    surfaces: TraceSurface[];
    metrics: TraceMetric[];
};

const normalizeUrl = (raw = '') => {
    try {
        const url = new URL(raw);
        return (url.origin + url.pathname).replace(/\/$/, '').toLowerCase();
    } catch {
        return String(raw).replace(/\/$/, '').toLowerCase();
    }
};

const localizedTitle = (item: ProjectionMoment) => item.title?.he || item.title?.en || item.title?.ru || '';

const uniqueBy = <T,>(items: T[], keyFor: (item: T) => string) => {
    const seen = new Set<string>();
    return items.filter(item => {
        const key = keyFor(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

export function buildImpactTrace(
    moment: StoryMoment,
    projectionItems: ProjectionMoment[],
    impactRecords: ImpactLedgerRecord[],
): ImpactTrace {
    const chapterItems = projectionItems.filter(item => item.canonicalId === moment.canonicalId && Boolean(item.sourceUrl));
    const preferred = [moment, ...chapterItems];
    const surfaces = uniqueBy(preferred.map(item => ({
        id: item.id || item.canonicalId,
        url: item.sourceUrl,
        platform: item.platform || '',
        publisher: item.publisher || item.platform || '',
        title: 'displayTitle' in item ? item.displayTitle : localizedTitle(item),
        trust: item.trust || '',
        year: item.year || String(item.date || '').slice(0, 4),
    })), item => normalizeUrl(item.url));

    const surfaceKeys = new Set(surfaces.map(item => normalizeUrl(item.url)));
    const projectionMetrics: TraceMetric[] = chapterItems.flatMap(item => (item.metrics || []).map(metric => ({
        sourceUrl: item.sourceUrl,
        platform: item.platform || '',
        metricName: metric.label || '',
        metricDisplay: String(metric.value ?? ''),
        metricUnit: metric.unit || '',
        date: metric.date || '',
        verification: item.trust || 'source-bound',
        source: 'projection' as const,
    })));
    const ledgerMetrics: TraceMetric[] = impactRecords
        .filter(record => record.public_claim_ok !== false && surfaceKeys.has(normalizeUrl(record.url)))
        .map(record => ({
            sourceUrl: record.url,
            platform: record.platform || '',
            metricName: record.metric_name || '',
            metricDisplay: record.metric_display || '',
            metricUnit: record.metric_unit || '',
            date: record.collected_at || record.published_at || '',
            verification: record.verification_status || '',
            source: 'impact-ledger' as const,
        }));

    const metrics = uniqueBy(
        [...projectionMetrics, ...ledgerMetrics].filter(item => item.metricName && item.metricDisplay),
        item => [normalizeUrl(item.sourceUrl), item.metricName, item.metricDisplay, item.date].join('|'),
    );

    return {
        canonicalId: moment.canonicalId,
        surfaces,
        metrics,
        syntheticTotal: null,
    };
}

export function buildGalaxyClusters(
    moments: StoryMoment[],
    projectionItems: ProjectionMoment[],
    impactRecords: ImpactLedgerRecord[],
): GalaxyCluster[] {
    return moments.map((moment, index) => {
        const trace = buildImpactTrace(moment, projectionItems, impactRecords);
        return {
            canonicalId: moment.canonicalId,
            label: moment.chapterLabel || moment.displayTitle || moment.canonicalId,
            year: moment.year || String(moment.date || '').slice(0, 4),
            index,
            sourceCount: trace.surfaces.length,
            metricCount: trace.metrics.length,
            gravity: 1 + (trace.surfaces.length * 2) + trace.metrics.length,
            surfaces: trace.surfaces,
            metrics: trace.metrics,
        };
    });
}
