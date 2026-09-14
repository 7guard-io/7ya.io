import { deepMedia, type DeepMediaCategory, type DeepMediaItem } from './deep-media-data';
import {
    fetchPublicProjection,
    type PublicLibraryItem,
    type PublicLibraryPayload,
} from './public-library-model';
import { publicVisual } from './public-visual';

export type UnifiedMediaSnapshot = {
    items: DeepMediaItem[];
    knownTotal: number;
    projectionTotal: number;
    sourceCount: number;
    status: 'live' | 'partial';
};

const socialPlatforms = /instagram|tiktok|facebook|linkedin|threads|telegram|\bx\b/i;
const broadcastSources = /חדשות|ערוץ|channel|103fm|radio|רדיו|broadcast|television|tv/i;
const musicSources = /music|spotify|apple music|soundcloud|song|track|artist|מוזיק|שיר|קליפ/i;
const writingSources = /writing|authored|column|medium|zman|זמן ישראל|research|document|essay|כתיבה|מאמר/i;
const pressSources = /press|article|news|mynet|hidabroot|הידברות|מקור ראשון|עיתונות/i;
const podcastSources = /podcast|spotify episode|podbean|podtail|omny|פודקאסט|ראיון ארוך/i;

function youtubeId(raw: string) {
    try {
        const url = new URL(raw);
        if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
        if (url.hostname.endsWith('youtube.com')) {
            return url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1] || '';
        }
        return '';
    } catch {
        return '';
    }
}

function urlKey(raw: string) {
    const yid = youtubeId(raw);
    if (yid) return `youtube:${yid}`;
    try {
        const url = new URL(raw);
        ['fbclid', 'igshid', 'si', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
            url.searchParams.delete(key);
        });
        url.hash = '';
        const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^il\.linkedin\.com$/, 'linkedin.com');
        return `${host}${url.pathname}${url.search}`.replace(/\/$/, '').toLowerCase();
    } catch {
        return raw.trim().toLowerCase().replace(/\/$/, '');
    }
}

function categoryFor(item: PublicLibraryItem): DeepMediaCategory {
    const text = [
        item.mediaType,
        item.platform,
        item.publisher,
        item.sourceKind,
        item.title.he,
        item.summary.he,
        ...item.topics,
    ].join(' ');
    if (/starton/i.test(text)) return 'StartOn';
    if (musicSources.test(text)) return 'מוזיקה';
    if (podcastSources.test(text) || item.mediaType === 'audio') return 'פודקאסטים';
    if (broadcastSources.test(text) && item.mediaType === 'video') return 'טלוויזיה';
    if (writingSources.test(text) || item.mediaType === 'document') return 'כתיבה';
    if (pressSources.test(text) || item.mediaType === 'article') return 'עיתונות';
    if (socialPlatforms.test(text) || item.mediaType === 'post') return 'רשתות';
    if (item.mediaType === 'video') return 'ויראלי';
    return 'רשתות';
}

function metricFor(item: PublicLibraryItem) {
    const metric = item.metrics[0];
    if (!metric) return undefined;
    return [metric.value, metric.unit].filter(Boolean).join(' ');
}

function projectionItem(item: PublicLibraryItem): DeepMediaItem {
    const yid = youtubeId(item.sourceUrl);
    const image = item.imageUrl || (yid ? `https://i.ytimg.com/vi/${encodeURIComponent(yid)}/hqdefault.jpg` : '') || item.screenshotUrl || publicVisual(item.sourceUrl);
    return {
        id: `projection-${item.id}`,
        category: categoryFor(item),
        source: item.publisher || item.platform || 'Public source',
        title: item.title.he || item.title.en || item.publisher || item.platform,
        year: item.year || item.date.match(/(?:19|20)\d{2}/)?.[0] || 'PUBLIC',
        url: item.sourceUrl,
        summary: item.summary.he || item.summary.en || item.sourceKind || 'רשומה ציבורית המחוברת למקור.',
        status: [item.layer, item.trust || item.sourceKind].filter(Boolean).join(' · '),
        image,
        fallback: item.screenshotUrl || image,
        ...(yid ? { youtubeId: yid } : {}),
        ...(metricFor(item) ? { metric: metricFor(item) } : {}),
    };
}

function merge(curated: DeepMediaItem[], projected: PublicLibraryItem[]) {
    const seen = new Set<string>();
    const items: DeepMediaItem[] = [];
    const add = (item: DeepMediaItem) => {
        const key = urlKey(item.url);
        if (!key || seen.has(key)) return;
        seen.add(key);
        items.push(item);
    };
    curated.forEach(add);
    projected
        .filter((item) => item.mediaType !== 'profile' && /^https?:\/\//i.test(item.sourceUrl))
        .map(projectionItem)
        .forEach(add);
    return items;
}

function sourceCount(items: DeepMediaItem[]) {
    return new Set(items.map((item) => item.source.trim()).filter(Boolean)).size;
}

export async function loadUnifiedMediaLibrary(): Promise<UnifiedMediaSnapshot> {
    const payload: PublicLibraryPayload = await fetchPublicProjection({ sort: 'impact', limit: 300 });
    const items = merge(deepMedia, payload.items);
    return {
        items,
        knownTotal: Math.max(items.length, payload.knownTotal),
        projectionTotal: payload.knownTotal,
        sourceCount: sourceCount(items),
        status: payload.status,
    };
}
