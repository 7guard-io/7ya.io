import {useEffect, useMemo, useState} from 'react';
import {api} from '@appdeploy/client';
import {ArrowUpRight, ChevronDown, ImageOff, Layers3, Play, ShieldCheck} from 'lucide-react';
import {useLocale, type Locale} from '../locale';
import {deepMedia} from '../deep-media-data';
import {resolveLifeAtlas, type LifeMoment, type ProjectionItem, type ProjectionLayer} from './life-moment-resolver';
import './rich-life-timeline.css';
import './media-resolver.css';

type ProjectionPayload = {
    knownTotal?: number;
    filteredTotal?: number;
    nextCursor?: string | null;
    streamCounts?: Record<string, number>;
    items?: ProjectionItem[];
};

type MetaArchivePayload = {
    nextCursor?: string | null;
    indexedMonths?: number;
    items?: ProjectionItem[];
};

type Props = {context?: 'album' | 'profile'};

const INITIAL_MOMENTS = 30;
const MORE_MOMENTS = 48;
const PAGE_LIMIT = 300;
const MAX_PAGES = 10;
const MAX_META_ARCHIVE_PAGES = 80;
const layers: Array<'ALL' | ProjectionLayer> = ['ALL', 'CANON', 'LIVE', 'LEGACY', 'DISCOVERY', 'PENDING'];
const sourcePlatform = (source: string, url: string) => { const text = `${source} ${url}`.toLowerCase(); if (text.includes('youtube') || text.includes('youtu.be')) return 'YOUTUBE'; if (text.includes('linkedin')) return 'LINKEDIN'; if (text.includes('instagram')) return 'INSTAGRAM'; if (text.includes('facebook')) return 'FACEBOOK'; if (text.includes('spotify')) return 'SPOTIFY'; if (text.includes('tiktok')) return 'TIKTOK'; if (text.includes('zman.co.il')) return 'ZMAN ISRAEL'; return 'PUBLIC WEB'; };
const labelDate = (value: string) => { const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/); return match ? `${match[3]}-${match[2]}-${match[1]}` : ''; };
const curatedArchive: ProjectionItem[] = deepMedia.map(item => ({ id: `legacy:${item.id}`, layer: 'LEGACY', title: {he: item.title, en: item.title, ru: item.title}, summary: {he: item.summary, en: item.summary, ru: item.summary}, date: labelDate(item.year), year: item.year, platform: sourcePlatform(item.source, item.url), publisher: item.source, mediaType: item.youtubeId ? 'video' : item.category === 'מוזיקה' ? 'audio' : item.category === 'כתיבה' || item.category === 'עיתונות' ? 'article' : item.category === 'רשתות' ? 'post' : 'record', sourceKind: 'curated-public-archive', sourceUrl: item.url, imageUrl: item.image.startsWith('./resources/') ? '' : item.image, trust: item.status, evidenceGrade: item.status, topics: [item.category], relationships: [], relatedLabels: [], metrics: item.metric ? [{value: item.metric, scope: 'source-local'}] : [], origins: ['deep-media-curated'] }));

const copy = {
    he: {
        eyebrow: 'LIFE ATLAS / PUBLIC PROJECTION',
        title: 'מסלול החיים המלא. לא שמונה קופסאות.',
        body: 'הציר מחבר את Public Projection עם ארכיון המקורות הציבורי שכבר נאצר ב־7YA: Canon, פרסומים חיים, Legacy ו־Discovery. הקאנון קובע מה חזק כעובדה — אבל הוא כבר לא מגביל כמה מהחיים אפשר לראות.',
        known: 'רשומות מקור שנטענו למסלול',
        resolved: 'רגעים כרונולוגיים שנפתרו',
        eras: 'תקופות / שנים פעילות',
        allYears: 'כל השנים',
        allLayers: 'כל השכבות',
        loading: 'טוען את המסלול הציבורי ומחבר רגעים למקורות…',
        failed: 'ה־Public Projection לא זמין כרגע. מוצג בינתיים הארכיון הציבורי שנאצר ב־7YA בלבד — בלי להמציא רגעים חלופיים. סיפורי העוגן המאומתים נשארים בהמשך העמוד.',
        source: 'למקור המקורי',
        evidence: 'מקורות לרגע',
        approximateAge: 'גיל משוער',
        showMore: 'עוד רגעים מהחיים',
        showing: 'מוצגים',
        of: 'מתוך',
        moment: 'רגעים',
        noResults: 'אין כרגע רגעים במסנן הזה.',
        sourceLocal: 'מדד של המקור הזה בלבד',
        labels: 'אנשים / מוסדות / קשרים שמופיעים ברשומה',
        layerHelp: 'CANON = עוגן מאומת/מבוקר · LIVE = מקור חי או owner-authorized · LEGACY = ארכיון ציבורי · DISCOVERY = קצה חוט, לא עובדה קאנונית · PENDING = ממתין לבדיקה',
        video: 'וידאו מהמקור',
        sourceFrame: 'SOURCE FRAME · אין תמונה מומצאת',
    },
    en: {
        eyebrow: 'LIFE ATLAS / PUBLIC PROJECTION',
        title: 'The full life path. Not eight boxes.',
        body: 'This chronology joins Public Projection with the source-linked public archive already curated in 7YA: Canon, live publications, Legacy and Discovery. Canon still defines factual strength, but it no longer limits how much of the life can be visible.',
        known: 'source records loaded into the path',
        resolved: 'resolved chronological moments',
        eras: 'active years / eras',
        allYears: 'All years',
        allLayers: 'All layers',
        loading: 'Loading the public path and resolving moments to sources…',
        failed: 'Public Projection is temporarily unavailable. The curated public archive remains visible without invented replacement moments; verified anchor stories remain below.',
        source: 'Open original source',
        evidence: 'sources for this moment',
        approximateAge: 'approx. age',
        showMore: 'More life moments',
        showing: 'showing',
        of: 'of',
        moment: 'moments',
        noResults: 'No moments are available in this filter right now.',
        sourceLocal: 'metric belongs to this source only',
        labels: 'people / institutions / relationships in the record',
        layerHelp: 'CANON = audited anchor · LIVE = live or owner-authorized source · LEGACY = public archive · DISCOVERY = lead, not canonical fact · PENDING = awaiting review',
        video: 'source video',
        sourceFrame: 'SOURCE FRAME · no invented image',
    },
    ru: {
        eyebrow: 'LIFE ATLAS / PUBLIC PROJECTION',
        title: 'Полный жизненный путь. Не восемь коробок.',
        body: 'Хронология объединяет Public Projection с уже собранным в 7YA публичным архивом источников: Canon, живые публикации, Legacy и Discovery. Canon определяет силу факта, но больше не ограничивает объём видимой жизни.',
        known: 'записей источников загружено в путь',
        resolved: 'разрешённых хронологических моментов',
        eras: 'активных лет / периодов',
        allYears: 'Все годы',
        allLayers: 'Все слои',
        loading: 'Загружаю публичный путь и связываю моменты с источниками…',
        failed: 'Public Projection временно недоступен. Публичный архив 7YA остаётся видимым без выдуманных замещающих событий; проверенные опорные истории остаются ниже.',
        source: 'Открыть оригинал',
        evidence: 'источников момента',
        approximateAge: 'примерный возраст',
        showMore: 'Ещё моменты жизни',
        showing: 'показано',
        of: 'из',
        moment: 'моментов',
        noResults: 'В этом фильтре сейчас нет моментов.',
        sourceLocal: 'метрика относится только к этому источнику',
        labels: 'люди / институции / связи в записи',
        layerHelp: 'CANON = проверенная опора · LIVE = живой или owner-authorized источник · LEGACY = публичный архив · DISCOVERY = след, не канонический факт · PENDING = ожидает проверки',
        video: 'видео источника',
        sourceFrame: 'SOURCE FRAME · без выдуманного изображения',
    },
} as const;

const ageFor = (year: string, locale: Locale) => {
    const value = Number(year);
    if (!Number.isFinite(value) || value < 1990) return '';
    const age = Math.max(0, value - 1990);
    return locale === 'he' ? `≈${age}` : locale === 'ru' ? `≈${age}` : `≈${age}`;
};

const formatMetric = (metric: LifeMoment['metrics'][number]) => {
    const value = String(metric.value ?? '').trim();
    const unit = String(metric.unit || metric.name || metric.metricType || '').trim();
    return [value, unit].filter(Boolean).join(' ');
};

function MomentMedia({moment, locale}: {moment: LifeMoment; locale: Locale}) {
    const [failed, setFailed] = useState(false);
    const [resolvedUrl, setResolvedUrl] = useState('');
    const rawMedia = String(moment.mediaUrl || '');
    const proxySource = rawMedia.startsWith('/api/media-image?') ? new URL(rawMedia, window.location.origin).searchParams.get('url') || '' : '';

    useEffect(() => {
        let active = true;
        setFailed(false);
        setResolvedUrl('');
        if (!proxySource) return () => {
            active = false;
        };
        void api.get('/api/media-data?url=' + encodeURIComponent(proxySource)).then(({data}) => {
            if (!active) return;
            const imageUrl = String((data as {imageUrl?: unknown}).imageUrl || '');
            if (!imageUrl) {
                setFailed(true);
                return;
            }
            setResolvedUrl(imageUrl);
        }).catch(() => {
            if (active) setFailed(true);
        });
        return () => {
            active = false;
        };
    }, [proxySource]);

    const mediaUrl = proxySource ? resolvedUrl : rawMedia;
    const hasImage = Boolean(mediaUrl) && !failed;
    const resolvingOriginal = Boolean(proxySource) && !resolvedUrl && !failed;
    const video = /video/i.test(moment.mediaType);
    return <figure className={'life-moment-media' + (hasImage ? ' has-image' : ' source-frame')}>
        {hasImage ? <img src={mediaUrl} alt={moment.title[locale]} loading='lazy' decoding='async' referrerPolicy='no-referrer' onError={() => setFailed(true)} /> : resolvingOriginal ? <div className='life-media-loading' aria-busy='true'><span>ORIGINAL SOURCE</span></div> : <div className='life-source-poster'><ImageOff/><span>{copy[locale].sourceFrame}</span><strong>{moment.publisher}</strong></div>}
        {video && <span className='life-video-badge'><Play fill='currentColor'/>{copy[locale].video}</span>}
        <figcaption dir='ltr'><b>{moment.layer}</b><span>{moment.mediaType.toUpperCase()} · {moment.platform}</span></figcaption>
    </figure>;
}

export default function RichLifeTimeline({context = 'album'}: Props) {
    const {locale, dir} = useLocale();
    const c = copy[locale];
    const [items, setItems] = useState<ProjectionItem[]>([]);
    const [knownTotal, setKnownTotal] = useState<number | undefined>();
    const [streamCounts, setStreamCounts] = useState<Record<string, number>>({});
    const [status, setStatus] = useState<'loading' | 'ready' | 'degraded'>('loading');
    const [layer, setLayer] = useState<'ALL' | ProjectionLayer>('ALL');
    const [era, setEra] = useState('ALL');
    const [visibleCount, setVisibleCount] = useState(INITIAL_MOMENTS);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                const rows: ProjectionItem[] = [];
                let cursor = '';
                let firstKnown: number | undefined;
                let latestStreams: Record<string, number> = {};
                for (let page = 0; page < MAX_PAGES; page++) {
                    const suffix = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
                    const {data} = await api.get(`/api/public-projection?sort=oldest&limit=${PAGE_LIMIT}${suffix}`);
                    const payload = (data || {}) as ProjectionPayload;
                    if (!active) return;
                    if (firstKnown === undefined && typeof payload.knownTotal === 'number') firstKnown = payload.knownTotal;
                    if (payload.streamCounts) latestStreams = payload.streamCounts;
                    if (Array.isArray(payload.items)) rows.push(...payload.items);
                    const next = String(payload.nextCursor || '').trim();
                    if (!next || next === cursor) break;
                    cursor = next;
                }
                if (!active) return;
                setItems([...curatedArchive, ...rows]);
                setKnownTotal(firstKnown);
                setStreamCounts(latestStreams);
                setStatus('ready');

                let metaCursor = '';
                let metaArchiveLoaded = 0;
                let indexedMetaMonths = 0;
                try {
                    for (let page = 0; page < MAX_META_ARCHIVE_PAGES; page++) {
                        const suffix = metaCursor ? `&cursor=${encodeURIComponent(metaCursor)}` : '';
                        const {data} = await api.get(`/api/meta-projection-archive?limit=${PAGE_LIMIT}${suffix}`);
                        const payload = (data || {}) as MetaArchivePayload;
                        if (!active) return;
                        if (typeof payload.indexedMonths === 'number') indexedMetaMonths = payload.indexedMonths;
                        if (Array.isArray(payload.items)) {
                            rows.push(...payload.items);
                            metaArchiveLoaded += payload.items.length;
                            setItems([...curatedArchive, ...rows]);
                            setKnownTotal(Math.max(firstKnown || 0, rows.length));
                            setStreamCounts({...latestStreams, metaArchiveLoaded, indexedMetaMonths});
                        }
                        const next = String(payload.nextCursor || '').trim();
                        if (!next || next === metaCursor) break;
                        metaCursor = next;
                    }
                } catch {
                    setStreamCounts({...latestStreams, metaArchiveLoaded, indexedMetaMonths});
                }
            } catch {
                if (active) { setItems(curatedArchive); setStatus('degraded'); }
            }
        };
        void load();
        return () => { active = false; };
    }, []);

    const atlas = useMemo(() => resolveLifeAtlas(items), [items]);
    const erasWithCount = useMemo(() => atlas.eras.map(item => ({...item, count: item.momentIds.length})), [atlas.eras]);
    const filtered = useMemo(() => atlas.moments.filter(moment => (layer === 'ALL' || moment.layer === layer) && (era === 'ALL' || (moment.year || 'undated') === era)), [atlas.moments, layer, era]);
    const visible = filtered.slice(0, visibleCount);
    const visibleByEra = useMemo(() => {
        const map = new Map<string, LifeMoment[]>();
        for (const moment of visible) {
            const key = moment.year || 'undated';
            map.set(key, [...(map.get(key) || []), moment]);
        }
        return map;
    }, [visible]);
    const activeEras = erasWithCount.filter(item => visibleByEra.has(item.id));
    const loadedStreams = Object.values(streamCounts).reduce((sum, value) => sum + (Number(value) || 0), 0);

    const selectLayer = (next: 'ALL' | ProjectionLayer) => { setLayer(next); setVisibleCount(INITIAL_MOMENTS); };
    const selectEra = (next: string) => { setEra(next); setVisibleCount(INITIAL_MOMENTS); };

    return <section id='life-atlas' className={`rich-life-atlas rich-life-atlas-${context}`} dir={dir} aria-labelledby={`life-atlas-title-${context}`}>
        <header className='life-atlas-head'>
            <div><small dir='ltr'>{c.eyebrow}</small><h2 id={`life-atlas-title-${context}`}>{c.title}</h2></div>
            <p>{c.body}</p>
        </header>

        {status === 'loading' && <div className='life-atlas-state' role='status'><Layers3/><p>{c.loading}</p></div>}
        {status === 'degraded' && <div className='life-atlas-state is-failed' role='status'><ShieldCheck/><p>{c.failed}</p></div>}

        {status !== 'loading' && <>
            <div className='life-atlas-stats' dir='ltr'>
                <div><b>{items.length}</b><span>{c.known}</span></div>
                <div><b>{atlas.moments.length}</b><span>{c.resolved}</span></div>
                <div><b>{atlas.eras.length}</b><span>{c.eras}</span></div>
                <div><b>{status === 'ready' ? Object.keys(streamCounts).length : curatedArchive.length}</b><span>{status === 'ready' ? 'PUBLIC SOURCE STREAMS' : 'CURATED ARCHIVE RECORDS'}</span></div>
            </div>

            <nav className='life-layer-rail' aria-label={c.allLayers} dir='ltr'>
                {layers.filter(value => value === 'ALL' || atlas.layerCounts[value] > 0).map(value => <button type='button' key={value} className={layer === value ? 'active' : ''} aria-pressed={layer === value} onClick={() => selectLayer(value)}><b>{value === 'ALL' ? c.allLayers : value}</b><span>{value === 'ALL' ? atlas.moments.length : atlas.layerCounts[value]}</span></button>)}
            </nav>
            <p className='life-layer-help'>{c.layerHelp}</p>

            <nav className='life-era-rail' aria-label={c.allYears}>
                <button type='button' className={era === 'ALL' ? 'active' : ''} onClick={() => selectEra('ALL')}><b>{c.allYears}</b><span>{atlas.moments.length}</span></button>
                {erasWithCount.map(item => <button type='button' className={era === item.id ? 'active' : ''} key={item.id} onClick={() => selectEra(item.id)}><b dir='ltr'>{item.year || 'UNDATED'}</b><span>{item.count}</span><small>{item.label[locale]}</small></button>)}
            </nav>

            {visible.length === 0 ? <p className='life-atlas-empty'>{c.noResults}</p> : <div className='life-era-stack'>
                {activeEras.map(eraItem => <section className='life-era' id={`life-era-${eraItem.id}`} key={eraItem.id}>
                    <header><div><time dir='ltr'>{eraItem.year || 'UNDATED'}</time><h3>{eraItem.label[locale]}</h3></div><span dir='ltr'>{visibleByEra.get(eraItem.id)?.length || 0} / {eraItem.count} MOMENTS</span></header>
                    <div className='life-moment-grid'>
                        {(visibleByEra.get(eraItem.id) || []).map(moment => <article className={`life-moment-card layer-${moment.layer.toLowerCase()}`} key={moment.id} data-life-moment={moment.id} data-layer={moment.layer}>
                            <MomentMedia moment={moment} locale={locale}/>
                            <div className='life-moment-copy'>
                                <div className='life-moment-meta'><span dir='ltr'>{moment.date || moment.year || 'UNDATED'}</span>{moment.year && <span>{c.approximateAge} <b dir='ltr'>{ageFor(moment.year, locale)}</b></span>}</div>
                                <div className='life-evidence-row'><span className={`life-layer layer-${moment.layer.toLowerCase()}`} dir='ltr'>{moment.layer}</span><b dir='ltr'>{moment.trust}</b></div>
                                <h4>{moment.title[locale]}</h4>
                                {moment.summary[locale] && moment.summary[locale] !== moment.title[locale] && <p>{moment.summary[locale]}</p>}
                                <div className='life-source-line'><span>{moment.publisher}</span><b dir='ltr'>{moment.platform}</b></div>
                                {moment.relatedLabels.length > 0 && <div className='life-related'><small>{c.labels}</small><div>{moment.relatedLabels.slice(0, 4).map(label => <span key={label}>{label}</span>)}</div></div>}
                                {moment.metrics.length > 0 && <div className='life-metrics'>{moment.metrics.slice(0, 3).map((metric, index) => <span key={`${formatMetric(metric)}-${index}`}><b dir='ltr'>{formatMetric(metric)}</b><small>{c.sourceLocal}</small></span>)}</div>}
                                <footer><span><ShieldCheck/><b dir='ltr'>{moment.evidence.length}</b> {c.evidence}</span><a href={moment.sourceUrl} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight/></a></footer>
                            </div>
                        </article>)}
                    </div>
                </section>)}
            </div>}

            <footer className='life-atlas-foot'>
                <span>{c.showing} <b dir='ltr'>{visible.length}</b> {c.of} <b dir='ltr'>{filtered.length}</b> {c.moment}</span>
                {visible.length < filtered.length && <button type='button' onClick={() => setVisibleCount(value => value + MORE_MOMENTS)}>{c.showMore}<ChevronDown/></button>}
            </footer>
        </>}
    </section>;
}
