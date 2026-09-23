import { db } from '@appdeploy/sdk';
import { migrateProjectionItems } from './migrate';
import { CORE_ROUTES, type CoreComposition, type CoreIndexEntry, type CoreRecord, type CoreRouteComposition, type CoreRouteKey, type LocalizedText } from './types';

const CORE_RELEASE = '7ya-core-20260912-v1';
const SEED_VERSION = 'public-projection-convergence-v1';
const RECORDS_TABLE = 'core_records_v1';
const META_TABLE = 'core_meta_v1';
const MAX_LEGACY_PAGES = 6;
const LEGACY_PAGE_SIZE = 300;

type CoreRecordRow = { key: string; record: CoreRecord; updatedAt: number; seedVersion: string };
type CoreIndexRow = { key: 'index'; entries: CoreIndexEntry[]; seedVersion: string; seededAt: number; updatedAt: number; legacyCount: number };
type CoreCompositionRow = { key: 'composition'; value: CoreComposition; updatedAt: number };
type MetaRow = CoreIndexRow | CoreCompositionRow;
type Stored<T> = T & { id: string };

const localized = (he: string, en: string, ru: string): LocalizedText => ({ he, en, ru });

const defaultComposition = (): CoreComposition => ({
    schemaVersion: 1,
    release: CORE_RELEASE,
    routeOrder: [...CORE_ROUTES],
    routes: {
        home: { title: localized('איגור ופרצקי — חיים, עשייה והשפעה', 'Igor Vepretski — life, work and public record', 'Игорь Вепрецкий — жизнь, работа и публичный архив'), description: localized('אותו אדם, אותו סיפור, אותם מקורות — עכשיו דרך מקור אמת אחד.', 'One person, one story, one source-backed record — now projected from one Core.', 'Один человек, одна история и один архив источников — теперь из единого Core.'), domainPriority: ['childhood', 'origin', 'army', 'police', 'public-service', 'starton', 'fatherhood', 'music', 'media', 'research'], featuredIds: [], hiddenIds: [], limit: 48 },
        story: { title: localized('הסיפור', 'Story', 'История'), description: localized('ילדות, הגירה, שירות, משטרה, אבהות, יצירה ובנייה מחדש — מתוך אותם רשומות מקור.', 'Childhood, immigration, service, police, fatherhood, creation and rebuilding — from the same source records.', 'Детство, иммиграция, служба, полиция, отцовство, творчество и строительство — из тех же исходных записей.'), domainPriority: ['childhood', 'origin', 'army', 'police', 'fatherhood', 'starton'], featuredIds: [], hiddenIds: [], limit: 60 },
        media: { title: localized('מדיה ותוכן', 'Media & Content', 'Медиа и контент'), description: localized('וידאו, פוסטים, ראיונות, כתבות ומוזיקה — מקוריים ומקושרים למקור.', 'Video, posts, interviews, press and music — source-linked and projected from Core.', 'Видео, посты, интервью, пресса и музыка — с привязкой к источникам из Core.'), domainPriority: ['media', 'social', 'music', 'starton'], featuredIds: [], hiddenIds: [], limit: 72 },
        politics: { title: localized('שירות ציבורי ופוליטיקה', 'Public Service & Politics', 'Государственная служба и политика'), description: localized('צבא, משטרה, שירות ציבורי, הנהגה ופעילות פוליטית — כרצף אחד.', 'Army, police, public service, leadership and politics as one continuous record.', 'Армия, полиция, государственная служба, лидерство и политика как единая линия.'), domainPriority: ['army', 'police', 'public-service', 'politics'], featuredIds: [], hiddenIds: [], limit: 60 },
        starton: { title: localized('StartOn', 'StartOn', 'StartOn'), description: localized('הדרך מחוויה אישית לבניית תשתית לנוער, טכנולוגיה ושייכות.', 'From lived experience to infrastructure for youth, technology and belonging.', 'От личного опыта к инфраструктуре для молодежи, технологий и чувства принадлежности.'), domainPriority: ['starton', 'childhood', 'public-service', 'media'], featuredIds: [], hiddenIds: [], limit: 60 },
        music: { title: localized('מוזיקה ויצירה', 'Music & Creation', 'Музыка и творчество'), description: localized('שירים, קליפים ושיתופי פעולה כחלק מאותו ארכיון חיים.', 'Songs, videos and collaborations inside the same living archive.', 'Песни, клипы и коллаборации в том же живом архиве.'), domainPriority: ['music', 'media'], featuredIds: [], hiddenIds: [], limit: 60 },
        research: { title: localized('מחקר ורעיונות', 'Research & Ideas', 'Исследования и идеи'), description: localized('מחקר, תיאוריה ומסגרות חשיבה המחוברות לעשייה.', 'Research, theory and frameworks connected to the work.', 'Исследования, теория и модели мышления, связанные с практикой.'), domainPriority: ['research', 'public-service', 'media'], featuredIds: [], hiddenIds: [], limit: 60 },
        archive: { title: localized('הארכיון הציבורי', 'Public Archive', 'Публичный архив'), description: localized('כל מה שנקלט ל־Core הציבורי — רשומה אחת לכל אובייקט, בלי יקומים מקבילים.', 'Everything ingested into the public Core — one record per object, without parallel universes.', 'Все, что попало в публичный Core — одна запись на объект, без параллельных систем.'), domainPriority: ['childhood', 'army', 'police', 'starton', 'media', 'music', 'research'], featuredIds: [], hiddenIds: [], limit: 84 }
    },
    updatedAt: Date.now(),
    updatedBy: '7ya-core-default'
});

async function metaRows() {
    const { items } = await db.list<MetaRow>(META_TABLE, { limit: 20 });
    return items;
}

async function findMeta<T extends MetaRow>(key: T['key']): Promise<Stored<T> | null> {
    const rows = await metaRows();
    const matches = rows.filter(row => row.key === key).sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    return (matches[0] as Stored<T> | undefined) || null;
}

async function saveMeta(record: MetaRow) {
    const existing = await findMeta<MetaRow>(record.key);
    if (existing) {
        const [ok] = await db.update(META_TABLE, [{ id: existing.id, record: { ...record } }]);
        if (!ok) throw new Error(`failed to update Core meta ${record.key}`);
        return existing.id;
    }
    const [id] = await db.add(META_TABLE, [{ ...record }]);
    if (!id) throw new Error(`failed to create Core meta ${record.key}`);
    return id;
}

function indexEntry(record: CoreRecord, dbId: string): CoreIndexEntry {
    const searchText = [record.id, record.type, ...Object.values(record.title), ...Object.values(record.story), ...record.domains, ...record.sources.flatMap(source => [source.publisher, source.platform, source.label])].join(' ').toLowerCase().slice(0, 1800);
    return { id: record.id, dbId, domains: record.domains, routeHints: record.routeHints, importance: record.importance, publishedAt: record.publishedAt || record.occurredAt, mediaTypes: [...new Set(record.media.map(media => media.kind))], searchText, visibility: record.visibility };
}

function chunk<T>(items: T[], maxCount = 70, maxBytes = 700000) {
    const chunks: T[][] = [];
    let current: T[] = [];
    let size = 2;
    for (const item of items) {
        const itemSize = JSON.stringify(item).length + 1;
        if (current.length && (current.length >= maxCount || size + itemSize > maxBytes)) {
            chunks.push(current);
            current = [];
            size = 2;
        }
        current.push(item);
        size += itemSize;
    }
    if (current.length) chunks.push(current);
    return chunks;
}

async function persistRecords(records: CoreRecord[], legacyCount: number) {
    const current = await findMeta<CoreIndexRow>('index');
    const entryMap = new Map((current?.entries || []).map(entry => [entry.id, entry] as const));
    const newRecords = records.filter(record => !entryMap.has(record.id));
    const existingRecords = records.filter(record => entryMap.has(record.id));

    for (const batch of chunk(existingRecords.map(record => ({ record, entry: entryMap.get(record.id)! })))) {
        const payload = batch.map(({ record, entry }) => ({ id: entry.dbId, record: { key: record.id, record, updatedAt: Date.now(), seedVersion: SEED_VERSION } }));
        const results = await db.update(RECORDS_TABLE, payload);
        if (!results.every(Boolean)) throw new Error('failed to update one or more Core records');
        batch.forEach(({ record, entry }) => entryMap.set(record.id, indexEntry(record, entry.dbId)));
    }

    for (const batch of chunk(newRecords)) {
        const now = Date.now();
        const ids = await db.add(RECORDS_TABLE, batch.map(record => ({ key: record.id, record, updatedAt: now, seedVersion: SEED_VERSION })));
        ids.forEach((id, index) => {
            if (!id) throw new Error('failed to create one or more Core records');
            const record = batch[index];
            entryMap.set(record.id, indexEntry(record, id));
        });
    }

    const now = Date.now();
    const index: CoreIndexRow = { key: 'index', entries: [...entryMap.values()], seedVersion: SEED_VERSION, seededAt: current?.seededAt || now, updatedAt: now, legacyCount };
    await saveMeta(index);
    return index;
}

type LegacyPage = { items?: unknown[]; count?: number; knownTotal?: number; total?: number; nextCursor?: number | string | null };

async function fetchLegacyProjection() {
    const all: unknown[] = [];
    let cursor = 0;
    for (let page = 0; page < MAX_LEGACY_PAGES; page += 1) {
        const url = `https://7ya.io/api/public-projection?sort=oldest&limit=${LEGACY_PAGE_SIZE}&cursor=${cursor}`;
        const response = await fetch(url, { headers: { accept: 'application/json', 'cache-control': 'no-cache, no-store' }, cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`legacy projection unavailable (${response.status})`);
        const data = await response.json() as LegacyPage;
        const items = Array.isArray(data.items) ? data.items : [];
        all.push(...items);
        if (!items.length || data.nextCursor === null || data.nextCursor === undefined || items.length < LEGACY_PAGE_SIZE) break;
        const next = Number(data.nextCursor);
        cursor = Number.isFinite(next) && next > cursor ? next : cursor + items.length;
    }
    if (!all.length) throw new Error('legacy projection returned no public records');
    return all;
}

async function ensureComposition() {
    const existing = await findMeta<CoreCompositionRow>('composition');
    if (existing) return existing.value;
    const value = defaultComposition();
    await saveMeta({ key: 'composition', value, updatedAt: value.updatedAt });
    return value;
}

let seedPromise: Promise<void> | null = null;

async function seedCore() {
    const items = await fetchLegacyProjection();
    const records = migrateProjectionItems(items);
    if (!records.length) throw new Error('Core migration produced no records');
    await persistRecords(records, items.length);
    await ensureComposition();
}

export async function ensureCoreSeeded() {
    const existing = await findMeta<CoreIndexRow>('index');
    if (existing?.entries.length) {
        await ensureComposition();
        return;
    }
    if (!seedPromise) seedPromise = seedCore().finally(() => { seedPromise = null; });
    await seedPromise;
}

export async function getCoreIndex() {
    await ensureCoreSeeded();
    const index = await findMeta<CoreIndexRow>('index');
    if (!index) throw new Error('Core index unavailable after seed');
    return index;
}

export async function getCoreRecords(entries: CoreIndexEntry[]) {
    const result: CoreRecord[] = [];
    for (const batch of chunk(entries, 100, 300000)) {
        const rows = await db.get<CoreRecordRow>(RECORDS_TABLE, batch.map(entry => entry.dbId));
        rows.forEach(row => { if (row?.record) result.push(row.record); });
    }
    return result;
}

export async function getCoreRecord(id: string) {
    const index = await getCoreIndex();
    const entry = index.entries.find(item => item.id === id && item.visibility === 'public');
    if (!entry) return null;
    const [row] = await db.get<CoreRecordRow>(RECORDS_TABLE, [entry.dbId]);
    return row?.record || null;
}

export async function getComposition() {
    await ensureCoreSeeded();
    return ensureComposition();
}

function validateRecord(value: unknown): CoreRecord {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Core record must be an object');
    const record = value as CoreRecord;
    if (record.schemaVersion !== 1 || !record.id || !record.type) throw new Error('Core record id, type and schemaVersion=1 are required');
    if (!record.title?.he || !record.title?.en || !record.title?.ru) throw new Error('Core record requires he/en/ru title');
    if (!record.story?.he || !record.story?.en || !record.story?.ru) throw new Error('Core record requires he/en/ru story');
    if (!Array.isArray(record.sources) || !Array.isArray(record.media) || !Array.isArray(record.domains) || !Array.isArray(record.routeHints)) throw new Error('Core record arrays are invalid');
    if (!['public', 'private'].includes(record.visibility)) throw new Error('Core record visibility is invalid');
    const importance = Math.max(0, Math.min(100, Number(record.importance) || 0));
    return { ...record, importance };
}

export async function upsertCoreRecord(value: unknown) {
    const record = validateRecord(value);
    const result = await persistRecords([record], (await getCoreIndex()).legacyCount);
    return { record, coreCount: result.entries.length };
}

export async function refreshCoreFromLegacy() {
    const items = await fetchLegacyProjection();
    const records = migrateProjectionItems(items);
    const index = await persistRecords(records, items.length);
    return { migrated: records.length, legacyCount: items.length, coreCount: index.entries.length, release: CORE_RELEASE };
}

const strings = (value: unknown, max = 200) => Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean).slice(0, max) : undefined;
const textPatch = (value: unknown): LocalizedText | undefined => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    const row = value as Record<string, unknown>;
    const he = typeof row.he === 'string' ? row.he.trim() : '';
    const en = typeof row.en === 'string' ? row.en.trim() : '';
    const ru = typeof row.ru === 'string' ? row.ru.trim() : '';
    return he && en && ru ? { he, en, ru } : undefined;
};

export async function updateComposition(route: CoreRouteKey, rawPatch: unknown, actor: string) {
    if (!CORE_ROUTES.includes(route)) throw new Error('unknown Core route');
    if (!rawPatch || typeof rawPatch !== 'object' || Array.isArray(rawPatch)) throw new Error('composition patch must be an object');
    const patch = rawPatch as Record<string, unknown>;
    const current = await getComposition();
    const previous = current.routes[route];
    const next: CoreRouteComposition = {
        title: textPatch(patch.title) || previous.title,
        description: textPatch(patch.description) || previous.description,
        domainPriority: strings(patch.domainPriority, 60) || previous.domainPriority,
        featuredIds: strings(patch.featuredIds, 200) || previous.featuredIds,
        hiddenIds: strings(patch.hiddenIds, 200) || previous.hiddenIds,
        limit: patch.limit === undefined ? previous.limit : Math.max(12, Math.min(100, Number(patch.limit) || previous.limit))
    };
    const value: CoreComposition = { ...current, routes: { ...current.routes, [route]: next }, updatedAt: Date.now(), updatedBy: actor };
    await saveMeta({ key: 'composition', value, updatedAt: value.updatedAt });
    return value;
}

export { CORE_RELEASE };
