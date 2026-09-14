export type LifeAtlasLocale = 'he' | 'en' | 'ru';
export type ProjectionLayer = 'CANON' | 'DISCOVERY' | 'LIVE' | 'LEGACY' | 'PENDING';
export type LocalText = Record<LifeAtlasLocale, string>;

export type ProjectionMetric = {
    name?: string;
    metricType?: string;
    value: number | string;
    unit?: string;
    asOf?: string;
    snapshotDate?: string;
    scope?: string;
};

export type ProjectionItem = {
    id: string;
    layer: ProjectionLayer;
    canonicalId?: string;
    title: LocalText;
    summary?: LocalText;
    date?: string;
    year?: string;
    platform?: string;
    publisher?: string;
    mediaType?: string;
    sourceKind?: string;
    sourceUrl: string;
    imageUrl?: string;
    screenshotUrl?: string;
    trust?: string;
    evidenceGrade?: string;
    topics?: string[];
    relationships?: string[];
    relatedLabels?: string[];
    metrics?: ProjectionMetric[];
    origins?: string[];
};

export type MomentEvidence = {
    id: string;
    layer: ProjectionLayer;
    sourceUrl: string;
    publisher: string;
    platform: string;
    trust: string;
    evidenceGrade: string;
};

export type LifeMoment = {
    id: string;
    canonicalId?: string;
    layer: ProjectionLayer;
    title: LocalText;
    summary: LocalText;
    date: string;
    year: string;
    platform: string;
    publisher: string;
    mediaType: string;
    sourceKind: string;
    sourceUrl: string;
    mediaUrl: string;
    trust: string;
    evidenceGrade: string;
    topics: string[];
    relationships: string[];
    relatedLabels: string[];
    metrics: ProjectionMetric[];
    evidence: MomentEvidence[];
};

export type LifeAtlasEra = {
    id: string;
    year: string;
    label: LocalText;
    momentIds: string[];
};

export type LifeAtlas = {
    moments: LifeMoment[];
    eras: LifeAtlasEra[];
    layerCounts: Record<ProjectionLayer, number>;
};

const layerWeight: Record<ProjectionLayer, number> = {
    CANON: 50,
    LIVE: 40,
    LEGACY: 30,
    DISCOVERY: 20,
    PENDING: 10,
};

const clean = (value?: string) => String(value || '').trim();
const uniq = (values: string[]) => [...new Set(values.map(clean).filter(Boolean))];

const normalizedUrl = (value: string) => {
    try {
        const url = new URL(value);
        url.hash = '';
        return (url.origin + url.pathname + url.search).replace(/\/$/, '').toLowerCase();
    } catch {
        return clean(value).replace(/\/$/, '').toLowerCase();
    }
};

const yearOf = (item: ProjectionItem) => {
    const direct = clean(item.year).match(/(?:19|20)\d{2}/)?.[0];
    if (direct) return direct;
    return clean(item.date).match(/(?:19|20)\d{2}/)?.[0] || '';
};

const dateRank = (moment: LifeMoment) => {
    if (/^\d{4}-\d{2}-\d{2}/.test(moment.date)) return moment.date.slice(0, 10);
    if (moment.year) return `${moment.year}-99-99`;
    return '9999-99-99';
};

const score = (item: ProjectionItem) =>
    layerWeight[item.layer] +
    (clean(item.imageUrl) ? 9 : 0) +
    (clean(item.screenshotUrl) ? 3 : 0) +
    (/video/i.test(clean(item.mediaType)) ? 3 : 0) +
    (clean(item.trust) ? 2 : 0);

const emptyLocal: LocalText = {he: '', en: '', ru: ''};

const localizedFrom = (values: ProjectionItem[], field: 'title' | 'summary'): LocalText => {
    const result = {...emptyLocal};
    (['he', 'en', 'ru'] as LifeAtlasLocale[]).forEach(locale => {
        for (const item of values) {
            const candidate = clean(item[field]?.[locale]);
            if (candidate) {
                result[locale] = candidate;
                break;
            }
        }
        if (!result[locale]) result[locale] = result.he || result.en || result.ru;
    });
    return result;
};

const eraLabel = (year: string, moments: LifeMoment[]): LocalText => {
    if (!year) return {he: 'רשומות פתוחות ללא תאריך', en: 'Open records without a date', ru: 'Открытые записи без даты'};
    const text = moments.flatMap(moment => [moment.title.he, moment.title.en, moment.title.ru, ...moment.topics, ...moment.relatedLabels]).join(' ').toLowerCase();
    if (/starton|youth|נוער|ג.?סי כהן|jesse cohen/.test(text)) return {he: `${year} · חזרה, StartOn והזדמנות`, en: `${year} · Return, StartOn & opportunity`, ru: `${year} · Возвращение, StartOn и возможности`};
    if (/police|idf|mfa|service|security|משטר|צה.?ל|שירות|ביטחון/.test(text)) return {he: `${year} · שירות, מערכות ואחריות`, en: `${year} · Service, systems & responsibility`, ru: `${year} · Служба, системы и ответственность`};
    if (/father|family|parent|אבא|אבהות|משפחה|дет|отец|сем/.test(text)) return {he: `${year} · משפחה, אבהות וקול אישי`, en: `${year} · Family, fatherhood & personal voice`, ru: `${year} · Семья, отцовство и личный голос`};
    if (/music|creator|creation|song|video|מוזיק|יציר|קליפ|музык|твор/.test(text)) return {he: `${year} · יצירה, מוזיקה ומדיה`, en: `${year} · Creation, music & media`, ru: `${year} · Творчество, музыка и медиа`};
    if (/polit|leadership|public action|מנהיג|פוליט|בחירות|полит|лидер/.test(text)) return {he: `${year} · חיים ציבוריים ומנהיגות`, en: `${year} · Public life & leadership`, ru: `${year} · Публичная жизнь и лидерство`};
    if (/research|7ya|evidence|מחקר|ראיות|исслед|доказ/.test(text)) return {he: `${year} · מחקר, זיכרון ו־7YA`, en: `${year} · Research, memory & 7YA`, ru: `${year} · Исследования, память и 7YA`};
    if (/identity|belong|origin|child|זהות|שייכ|ילדות|חרקוב|харьков|детств/.test(text)) return {he: `${year} · שורשים, זהות ושייכות`, en: `${year} · Roots, identity & belonging`, ru: `${year} · Корни, идентичность и принадлежность`};
    return {he: `${year} · החיים ברשומה הציבורית`, en: `${year} · Life in the public record`, ru: `${year} · Жизнь в публичной записи`};
};

export function resolveLifeAtlas(input: ProjectionItem[]): LifeAtlas {
    const eligible = input.filter(item => item && item.sourceUrl && item.mediaType !== 'profile');
    const groups = new Map<string, ProjectionItem[]>();

    for (const item of eligible) {
        const urlKey = normalizedUrl(item.sourceUrl);
        const key = item.canonicalId ? `canon:${item.canonicalId}` : `source:${urlKey || item.id}`;
        groups.set(key, [...(groups.get(key) || []), item]);
    }

    const moments: LifeMoment[] = [];
    for (const [key, rows] of groups) {
        const ranked = [...rows].sort((a, b) => score(b) - score(a));
        const representative = ranked[0];
        const visual = ranked.find(item => clean(item.imageUrl)) || ranked.find(item => clean(item.screenshotUrl)) || representative;
        const dated = ranked.find(item => /^\d{4}-\d{2}-\d{2}/.test(clean(item.date))) || ranked.find(item => yearOf(item)) || representative;
        const year = yearOf(dated);
        const evidenceSeen = new Set<string>();
        const evidence: MomentEvidence[] = [];
        for (const row of ranked) {
            const sourceKey = normalizedUrl(row.sourceUrl);
            if (!sourceKey || evidenceSeen.has(sourceKey)) continue;
            evidenceSeen.add(sourceKey);
            evidence.push({
                id: row.id,
                layer: row.layer,
                sourceUrl: row.sourceUrl,
                publisher: clean(row.publisher) || clean(row.platform) || 'Public source',
                platform: clean(row.platform) || 'PUBLIC WEB',
                trust: clean(row.trust) || row.layer,
                evidenceGrade: clean(row.evidenceGrade),
            });
        }
        const title = localizedFrom(ranked, 'title');
        const summary = localizedFrom(ranked, 'summary');
        moments.push({
            id: representative.canonicalId || representative.id || key,
            canonicalId: representative.canonicalId,
            layer: representative.layer,
            title,
            summary,
            date: clean(dated.date),
            year,
            platform: clean(representative.platform) || 'PUBLIC WEB',
            publisher: clean(representative.publisher) || clean(representative.platform) || 'Public source',
            mediaType: clean(visual.mediaType || representative.mediaType) || 'record',
            sourceKind: clean(representative.sourceKind),
            sourceUrl: representative.sourceUrl,
            mediaUrl: clean(visual.imageUrl) || clean(visual.screenshotUrl),
            trust: clean(representative.trust) || representative.layer,
            evidenceGrade: clean(representative.evidenceGrade),
            topics: uniq(ranked.flatMap(item => item.topics || [])),
            relationships: uniq(ranked.flatMap(item => item.relationships || [])),
            relatedLabels: uniq(ranked.flatMap(item => item.relatedLabels || [])),
            metrics: representative.metrics || [],
            evidence,
        });
    }

    moments.sort((a, b) => dateRank(a).localeCompare(dateRank(b)) || a.title.en.localeCompare(b.title.en));

    const byYear = new Map<string, LifeMoment[]>();
    for (const moment of moments) {
        const key = moment.year || '';
        byYear.set(key, [...(byYear.get(key) || []), moment]);
    }

    const yearKeys = [...byYear.keys()].sort((a, b) => {
        if (!a) return 1;
        if (!b) return -1;
        return Number(a) - Number(b);
    });
    const eras = yearKeys.map(year => {
        const rows = byYear.get(year) || [];
        return {id: year || 'undated', year, label: eraLabel(year, rows), momentIds: rows.map(row => row.id)};
    });

    const layerCounts: Record<ProjectionLayer, number> = {CANON: 0, LIVE: 0, LEGACY: 0, DISCOVERY: 0, PENDING: 0};
    moments.forEach(moment => { layerCounts[moment.layer] += 1; });
    return {moments, eras, layerCounts};
}
