import type { Locale } from '../locale';

export type LocalizedText = Record<Locale, string>;
export type CoreRouteKey = 'home' | 'story' | 'media' | 'politics' | 'starton' | 'music' | 'research' | 'archive';

export type CoreMedia = {
    kind: 'image' | 'video' | 'audio' | 'document' | 'embed';
    url: string;
    previewUrl?: string;
    sourceUrl?: string;
    alt?: LocalizedText;
};

export type CoreSource = {
    url: string;
    label: string;
    publisher: string;
    platform: string;
    kind: string;
    publishedAt: string;
    trust: string;
};

export type CoreMetric = {
    label: string;
    value: string | number;
    observedAt?: string;
    sourceUrl?: string;
};

export type CoreRecord = {
    schemaVersion: 1;
    id: string;
    type: string;
    title: LocalizedText;
    story: LocalizedText;
    occurredAt: string;
    publishedAt: string;
    people: string[];
    places: string[];
    domains: string[];
    media: CoreMedia[];
    sources: CoreSource[];
    metrics: CoreMetric[];
    trust: string;
    status: string;
    visibility: 'public' | 'private';
    importance: number;
    routeHints: string[];
};

export type CoreRouteComposition = {
    title: LocalizedText;
    description: LocalizedText;
    domainPriority: string[];
    featuredIds: string[];
    hiddenIds: string[];
    limit: number;
};

export type CoreProjectionResponse = {
    release: string;
    source: '7ya-core';
    route: CoreRouteKey;
    composition: CoreRouteComposition;
    count: number;
    coreCount: number;
    facets: Record<string, number>;
    records: CoreRecord[];
};
