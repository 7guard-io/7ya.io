export type CoreLocale = 'he' | 'en' | 'ru';
export type CoreTrust = 'verified' | 'supported' | 'owner-reported' | 'discovery' | 'live' | 'unresolved';
export type CoreStatus = 'canonical' | 'live' | 'recovered' | 'pending';
export type CoreVisibility = 'public' | 'private';

export type LocalizedText = Record<CoreLocale, string>;

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
    trust: CoreTrust;
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
    trust: CoreTrust;
    status: CoreStatus;
    visibility: CoreVisibility;
    importance: number;
    routeHints: string[];
    provenance: {
        origins: string[];
        canonicalId?: string;
        migratedAt?: string;
    };
};

export const CORE_ROUTES = ['home', 'story', 'media', 'politics', 'starton', 'music', 'research', 'archive'] as const;
export type CoreRouteKey = typeof CORE_ROUTES[number];

export type CoreRouteComposition = {
    title: LocalizedText;
    description: LocalizedText;
    domainPriority: string[];
    featuredIds: string[];
    hiddenIds: string[];
    limit: number;
};

export type CoreComposition = {
    schemaVersion: 1;
    release: string;
    routeOrder: CoreRouteKey[];
    routes: Record<CoreRouteKey, CoreRouteComposition>;
    updatedAt: number;
    updatedBy: string;
};

export type CoreIndexEntry = {
    id: string;
    dbId: string;
    domains: string[];
    routeHints: string[];
    importance: number;
    publishedAt: string;
    mediaTypes: string[];
    searchText: string;
    visibility: CoreVisibility;
};

export type CoreProjection = {
    release: string;
    source: '7ya-core';
    route: CoreRouteKey;
    composition: CoreRouteComposition;
    count: number;
    coreCount: number;
    facets: Record<string, number>;
    records: CoreRecord[];
};
