import { getComposition, getCoreIndex, getCoreRecords, CORE_RELEASE } from './store';
import type { CoreIndexEntry, CoreProjection, CoreRouteKey } from './types';

const routeMatch = (entry: CoreIndexEntry, route: CoreRouteKey) => route === 'home' || route === 'archive' || entry.routeHints.includes(route) || entry.domains.includes(route);
const dateValue = (value: string) => { const parsed = Date.parse(value); return Number.isFinite(parsed) ? parsed : 0; };

export async function projectCoreRoute(route: CoreRouteKey, options: { q?: string; limit?: number } = {}): Promise<CoreProjection> {
    const [index, composition] = await Promise.all([getCoreIndex(), getComposition()]);
    const config = composition.routes[route];
    const hidden = new Set(config.hiddenIds);
    const featured = new Map(config.featuredIds.map((id, position) => [id, position] as const));
    const domainPriority = new Map(config.domainPriority.map((domain, position) => [domain, position] as const));
    const query = (options.q || '').trim().toLowerCase();
    const matches = index.entries.filter(entry => entry.visibility === 'public' && !hidden.has(entry.id) && routeMatch(entry, route) && (!query || entry.searchText.includes(query)));
    const domainRank = (entry: CoreIndexEntry) => Math.min(...entry.domains.map(domain => domainPriority.get(domain) ?? 999), 999);
    matches.sort((a, b) => {
        const featuredA = featured.get(a.id) ?? 9999;
        const featuredB = featured.get(b.id) ?? 9999;
        if (featuredA !== featuredB) return featuredA - featuredB;
        const domainA = domainRank(a);
        const domainB = domainRank(b);
        if (domainA !== domainB) return domainA - domainB;
        if (a.importance !== b.importance) return b.importance - a.importance;
        return dateValue(b.publishedAt) - dateValue(a.publishedAt);
    });
    const limit = Math.max(12, Math.min(100, Number(options.limit) || config.limit));
    const selected = matches.slice(0, limit);
    const records = await getCoreRecords(selected);
    const recordMap = new Map(records.map(record => [record.id, record] as const));
    const orderedRecords = selected.map(entry => recordMap.get(entry.id)).filter((record): record is NonNullable<typeof record> => Boolean(record));
    const facets: Record<string, number> = {};
    matches.forEach(entry => entry.domains.forEach(domain => { facets[domain] = (facets[domain] || 0) + 1; }));
    return { release: CORE_RELEASE, source: '7ya-core', route, composition: config, count: matches.length, coreCount: index.entries.length, facets, records: orderedRecords };
}
