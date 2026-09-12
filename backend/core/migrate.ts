import { createHash } from 'node:crypto';
import type { CoreMedia, CoreMetric, CoreRecord, CoreSource, CoreStatus, CoreTrust, LocalizedText } from './types';

const asObject = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const asString = (value: unknown) => typeof value === 'string' ? value.trim() : value === null || value === undefined ? '' : String(value).trim();
const asArray = (value: unknown) => Array.isArray(value) ? value : [];
const unique = (values: string[]) => [...new Set(values.map(value => value.trim()).filter(Boolean))];

function localized(value: unknown, fallback = ''): LocalizedText {
    const row = asObject(value);
    if (Object.keys(row).length) {
        const he = asString(row.he) || fallback;
        const en = asString(row.en) || he || fallback;
        const ru = asString(row.ru) || en || he || fallback;
        return { he, en, ru };
    }
    const text = asString(value) || fallback;
    return { he: text, en: text, ru: text };
}

export function normalizeSourceUrl(raw: string) {
    try {
        const url = new URL(raw.trim());
        url.hash = '';
        const remove: string[] = [];
        url.searchParams.forEach((_value, key) => {
            const lower = key.toLowerCase();
            if (lower.startsWith('utm_') || ['fbclid', 'gclid', 'igshid', 'si', 'feature'].includes(lower)) remove.push(key);
        });
        remove.forEach(key => url.searchParams.delete(key));
        url.searchParams.sort();
        url.hostname = url.hostname.toLowerCase();
        return url.toString().replace(/\/$/, '');
    } catch {
        return raw.trim();
    }
}

function trustOf(value: unknown, layer: string): CoreTrust {
    const trust = asString(value).toLowerCase();
    if (trust.includes('verified')) return 'verified';
    if (trust.includes('support')) return 'supported';
    if (trust.includes('owner')) return 'owner-reported';
    if (trust.includes('unresolved') || trust.includes('pending')) return 'unresolved';
    if (trust.includes('live') || layer === 'LIVE') return 'live';
    return layer === 'CANON' ? 'verified' : 'discovery';
}

function statusOf(layer: string): CoreStatus {
    if (layer === 'CANON') return 'canonical';
    if (layer === 'LIVE') return 'live';
    if (layer === 'LEGACY') return 'recovered';
    return 'pending';
}

function inferDomains(item: Record<string, unknown>) {
    const topics = asArray(item.topics).map(asString);
    const related = asArray(item.relatedLabels).map(asString);
    const text = [asString(item.platform), asString(item.publisher), asString(item.category), asString(item.mediaType), ...Object.values(localized(item.title)), ...Object.values(localized(item.summary)), ...topics, ...related].join(' ').toLowerCase();
    const domains = [...topics.map(value => value.toLowerCase())];
    const add = (domain: string, pattern: RegExp) => { if (pattern.test(text)) domains.push(domain); };
    add('starton', /starton|סטארט.?און/);
    add('music', /music|spotify|apple music|מוזיק|bizzi|супапорп|soundcloud/);
    add('research', /research|academia|מחקר|paper|theory/);
    add('police', /police|משטרת|משטרה|שוטר|officer|полици/);
    add('army', /\bidf\b|צבא|צה.?ל|401|pal.?sar|military/);
    add('public-service', /public service|שירות ציבורי|משטרת|משטרה|\bidf\b|צה.?ל|municipal|עיריית/);
    add('politics', /politic|yisrael beiteinu|ישראל ביתנו|knesset|כנסת|בחירות|election|party/);
    add('childhood', /childhood|ילדות|ג.?סי כהן|jessie cohen|khark|חרקוב/);
    add('origin', /origin|מסע חיים|life story|מנער בסיכון|youth at risk|troubled beginnings/);
    add('fatherhood', /father|אבהות|אבא|parenting|הורות/);
    add('media', /interview|ראיון|press|כתבה|podcast|פודקאסט|youtube|instagram|tiktok|facebook|телев/);
    add('social', /instagram|tiktok|facebook|threads|linkedin|social/);
    return unique(domains.map(domain => domain.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]/gu, '').slice(0, 60)));
}

function routeHints(domains: string[], mediaType: string) {
    const hints = ['home', 'archive'];
    if (domains.some(domain => ['childhood', 'origin', 'army', 'police', 'public-service', 'fatherhood', 'starton'].includes(domain))) hints.push('story');
    if (domains.includes('politics') || domains.includes('police') || domains.includes('army') || domains.includes('public-service')) hints.push('politics');
    if (domains.includes('starton')) hints.push('starton');
    if (domains.includes('music')) hints.push('music');
    if (domains.includes('research')) hints.push('research');
    if (domains.includes('media') || domains.includes('social') || ['video', 'audio', 'image', 'article', 'post'].includes(mediaType)) hints.push('media');
    return unique(hints);
}

function metricsOf(value: unknown, sourceUrl: string): CoreMetric[] {
    if (Array.isArray(value)) {
        return value.slice(0, 12).map((entry, index) => {
            const row = asObject(entry);
            return { label: asString(row.label || row.name) || `metric-${index + 1}`, value: typeof row.value === 'number' ? row.value : asString(row.value || row.count || row.text), observedAt: asString(row.observedAt || row.date), sourceUrl: asString(row.sourceUrl) || sourceUrl };
        }).filter(metric => metric.value !== '');
    }
    const row = asObject(value);
    return Object.entries(row).slice(0, 12).map(([label, raw]) => ({ label, value: typeof raw === 'number' ? raw : asString(raw), sourceUrl })).filter(metric => metric.value !== '');
}

function importanceOf(layer: string, media: CoreMedia[], metrics: CoreMetric[], trust: CoreTrust) {
    const base = layer === 'CANON' ? 88 : layer === 'LIVE' ? 72 : layer === 'LEGACY' ? 64 : 46;
    const trustBonus = trust === 'verified' ? 7 : trust === 'supported' ? 4 : trust === 'owner-reported' ? 3 : 0;
    return Math.min(100, base + trustBonus + (media.length ? 3 : 0) + (metrics.length ? 2 : 0));
}

function mergeByKey<T>(left: T[], right: T[], key: (item: T) => string) {
    const map = new Map<string, T>();
    [...left, ...right].forEach(item => { const value = key(item); if (value) map.set(value, item); });
    return [...map.values()];
}

function betterTrust(left: CoreTrust, right: CoreTrust): CoreTrust {
    const order: CoreTrust[] = ['unresolved', 'discovery', 'live', 'owner-reported', 'supported', 'verified'];
    return order.indexOf(right) > order.indexOf(left) ? right : left;
}

function mergeRecord(left: CoreRecord, right: CoreRecord): CoreRecord {
    const trust = betterTrust(left.trust, right.trust);
    const status: CoreStatus = left.status === 'canonical' || right.status === 'canonical' ? 'canonical' : left.status === 'live' || right.status === 'live' ? 'live' : left.status === 'recovered' || right.status === 'recovered' ? 'recovered' : 'pending';
    return {
        ...left,
        title: Object.values(left.title).join('').length >= Object.values(right.title).join('').length ? left.title : right.title,
        story: Object.values(left.story).join('').length >= Object.values(right.story).join('').length ? left.story : right.story,
        occurredAt: left.occurredAt || right.occurredAt,
        publishedAt: [left.publishedAt, right.publishedAt].filter(Boolean).sort()[0] || '',
        people: unique([...left.people, ...right.people]),
        places: unique([...left.places, ...right.places]),
        domains: unique([...left.domains, ...right.domains]),
        media: mergeByKey(left.media, right.media, media => `${media.kind}|${normalizeSourceUrl(media.url)}`),
        sources: mergeByKey(left.sources, right.sources, source => normalizeSourceUrl(source.url)),
        metrics: mergeByKey(left.metrics, right.metrics, metric => `${metric.label}|${metric.value}|${metric.sourceUrl || ''}`),
        trust,
        status,
        importance: Math.max(left.importance, right.importance),
        routeHints: unique([...left.routeHints, ...right.routeHints]),
        provenance: { origins: unique([...left.provenance.origins, ...right.provenance.origins]), canonicalId: left.provenance.canonicalId || right.provenance.canonicalId, migratedAt: right.provenance.migratedAt || left.provenance.migratedAt }
    };
}

function recordFromProjection(value: unknown): CoreRecord | null {
    const item = asObject(value);
    const rawSourceUrl = asString(item.sourceUrl || item.url);
    if (!rawSourceUrl) return null;
    const sourceUrl = normalizeSourceUrl(rawSourceUrl);
    const layer = asString(item.layer).toUpperCase() || 'DISCOVERY';
    const canonicalId = asString(item.canonicalId);
    const legacyId = asString(item.id);
    const id = canonicalId || `source-${createHash('sha256').update(sourceUrl || legacyId).digest('hex').slice(0, 20)}`;
    const title = localized(item.title, asString(item.publisher) || 'Public record');
    const story = localized(item.summary, title.he);
    const platform = asString(item.platform);
    const publisher = asString(item.publisher) || platform || 'Public source';
    const mediaType = asString(item.mediaType || item.kind).toLowerCase() || 'post';
    const imageUrl = asString(item.imageUrl || item.thumbnail || item.previewUrl);
    const trust = trustOf(item.trust, layer);
    const publishedAt = asString(item.publishedAt || item.date || item.occurredAt);
    const media: CoreMedia[] = [];
    if (imageUrl) media.push({ kind: 'image', url: imageUrl, sourceUrl, alt: title });
    if (mediaType === 'video' || mediaType === 'audio') media.push({ kind: mediaType, url: sourceUrl, previewUrl: imageUrl || undefined, sourceUrl, alt: title });
    const metrics = metricsOf(item.metrics || item.metric, sourceUrl);
    const domains = inferDomains(item);
    const source: CoreSource = { url: sourceUrl, label: asString(item.sourceLabel) || publisher, publisher, platform, kind: mediaType, publishedAt, trust };
    return {
        schemaVersion: 1,
        id,
        type: asString(item.type || item.category || mediaType) || 'public-record',
        title,
        story,
        occurredAt: asString(item.occurredAt || item.date),
        publishedAt,
        people: [],
        places: [],
        domains,
        media,
        sources: [source],
        metrics,
        trust,
        status: statusOf(layer),
        visibility: 'public',
        importance: importanceOf(layer, media, metrics, trust),
        routeHints: routeHints(domains, mediaType),
        provenance: { origins: unique([layer, platform, publisher]), ...(canonicalId ? { canonicalId } : {}), migratedAt: new Date().toISOString() }
    };
}

export function migrateProjectionItems(items: unknown[]) {
    const records = new Map<string, CoreRecord>();
    items.forEach(item => {
        const record = recordFromProjection(item);
        if (!record) return;
        const existing = records.get(record.id);
        records.set(record.id, existing ? mergeRecord(existing, record) : record);
    });
    return [...records.values()];
}
