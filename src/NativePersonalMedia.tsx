import { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowUpRight } from 'lucide-react';
import { deepMedia, type DeepMediaItem } from './deep-media-data';
import LazyYouTube from './LazyYouTube';
import { itemText, pageHref, rootHref, useLocale, type Locale } from './locale';
import './native-personal-media.css';

type NativePersonalMediaProps = {
    mode?: 'home' | 'media';
};

type VisualRegistryItem = {
    id: string;
    canonicalId?: string;
    chapter: string;
    year: string;
    source: string;
    sourceUrl: string;
    imageUrl: string;
    label?: string;
    origin: string;
    verification: string;
    platform?: string;
    mediaType?: string;
    titles?: Partial<Record<Locale, string>>;
    summaries?: Partial<Record<Locale, string>>;
};

type ProjectionItem = {
    id: string;
    canonicalId?: string;
    title?: Partial<Record<Locale, string>>;
    summary?: Partial<Record<Locale, string>>;
    date?: string;
    year?: string;
    platform?: string;
    publisher?: string;
    mediaType?: string;
    sourceKind?: string;
    sourceUrl?: string;
    imageUrl?: string;
    screenshotUrl?: string;
    trust?: string;
};

type DiscoveryItem = {
    id: string;
    title: string;
    platform: string;
    publisher: string;
    date: string;
    year: string;
    relationship: string;
    url: string;
    verification: string;
    imageUrl: string;
};

type Copy = {
    eyebrow: string;
    title: string;
    body: string;
    owner: string;
    source: string;
    all: string;
    photoLife: string;
    photoStage: string;
    allPlatforms: string;
    allChapters: string;
    showMore: string;
    showing: string;
    assets: string;
};

const copy: Record<Locale, Copy> = {
    he: {
        eyebrow: 'IGOR · קול · וידאו · רגעים',
        title: 'לראות ולשמוע אותי, לא רק לקרוא.',
        body: 'זרם חזותי חי מתוך Instagram, TikTok, Facebook, YouTube, LinkedIn, X, Threads, Telegram והארכיון הציבורי — מחובר לפרקי החיים, לתאריך ולמקור. אין כאן הדמיות במקום חומר אמיתי.',
        owner: 'ארכיון ציבורי אישי',
        source: 'למקור',
        all: 'לכל המדיה',
        photoLife: 'רגע מתוך החיים',
        photoStage: 'איגור על הבמה',
        allPlatforms: 'כל הפלטפורמות',
        allChapters: 'כל פרקי החיים',
        showMore: 'להציג עוד',
        showing: 'מוצגים',
        assets: 'נכסים מקוריים / מקוריים־ציבוריים',
    },
    en: {
        eyebrow: 'IGOR · VOICE · VIDEO · MOMENTS',
        title: 'See and hear me, not only read about me.',
        body: 'A living visual stream from Instagram, TikTok, Facebook, YouTube, LinkedIn, X, Threads, Telegram and the public archive — connected to life chapters, dates and original sources. No simulation replaces real material.',
        owner: 'Personal public archive',
        source: 'Open source',
        all: 'All media',
        photoLife: 'A frame from life',
        photoStage: 'Igor on stage',
        allPlatforms: 'All platforms',
        allChapters: 'All life chapters',
        showMore: 'Show more',
        showing: 'Showing',
        assets: 'authentic / source-bound assets',
    },
    ru: {
        eyebrow: 'ИГОРЬ · ГОЛОС · ВИДЕО · МОМЕНТЫ',
        title: 'Увидеть и услышать меня, а не только прочитать.',
        body: 'Живой визуальный поток из Instagram, TikTok, Facebook, YouTube, LinkedIn, X, Threads, Telegram и публичного архива — с привязкой к этапам жизни, датам и первоисточникам. Никаких симуляций вместо реальных материалов.',
        owner: 'Личный публичный архив',
        source: 'Источник',
        all: 'Все медиа',
        photoLife: 'Кадр из жизни',
        photoStage: 'Игорь на сцене',
        allPlatforms: 'Все платформы',
        allChapters: 'Все этапы жизни',
        showMore: 'Показать ещё',
        showing: 'Показано',
        assets: 'подлинных / привязанных к источнику материалов',
    },
};

const visualTitles: Record<Locale, Record<string, string>> = {
    he: {
        origin: 'ילדות, עלייה וג׳סי כהן',
        service: 'שירות ואחריות',
        identity: 'זהות ושייכות',
        fatherhood: 'אבהות ומשפחה',
        voice: 'הקול הציבורי',
        starton: 'החזרה ובניית StartOn',
        civic: 'עשייה ציבורית ומנהיגות',
        culture: 'מוזיקה ויצירה',
        research: 'מחקר ורעיונות',
        now: 'החיים עכשיו',
        live: 'מהרשת עכשיו',
        archive: 'הארכיון הציבורי',
        life: 'מתוך החיים',
        stage: 'על הבמה',
    },
    en: {
        origin: 'Childhood, immigration and Jesse Cohen',
        service: 'Service and responsibility',
        identity: 'Identity and belonging',
        fatherhood: 'Fatherhood and family',
        voice: 'Public voice',
        starton: 'Return and building StartOn',
        civic: 'Public work and leadership',
        culture: 'Music and creation',
        research: 'Research and ideas',
        now: 'Life now',
        live: 'Live from the networks',
        archive: 'Public archive',
        life: 'From life',
        stage: 'On stage',
    },
    ru: {
        origin: 'Детство, репатриация и Джесси Коэн',
        service: 'Служба и ответственность',
        identity: 'Идентичность и принадлежность',
        fatherhood: 'Отцовство и семья',
        voice: 'Публичный голос',
        starton: 'Возвращение и создание StartOn',
        civic: 'Общественная работа и лидерство',
        culture: 'Музыка и творчество',
        research: 'Исследования и идеи',
        now: 'Жизнь сейчас',
        live: 'Сейчас в соцсетях',
        archive: 'Публичный архив',
        life: 'Из жизни',
        stage: 'На сцене',
    },
};

const fallbackVisuals: VisualRegistryItem[] = [
    { id: 'fallback-life', chapter: 'life', year: '', source: 'OWNER ARCHIVE', sourceUrl: 'igor-vepretski/', imageUrl: 'resources/drive-life-photo.jpg', origin: 'owner-archive', verification: 'OWNER', platform: 'Archive / Press' },
    { id: 'fallback-stage', chapter: 'stage', year: '', source: 'OWNER ARCHIVE', sourceUrl: 'speaker/', imageUrl: 'resources/drive-speaker-photo.jpg', origin: 'owner-archive', verification: 'OWNER', platform: 'Archive / Press' },
    { id: 'fallback-starton', chapter: 'starton', year: '2022', source: 'mynet חולון', sourceUrl: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq', imageUrl: 'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg', origin: 'publisher', verification: 'VERIFIED', platform: 'Archive / Press' },
    { id: 'fallback-fatherhood', chapter: 'fatherhood', year: '2023', source: 'הידברות', sourceUrl: 'https://www.hidabroot.org/article/1179015', imageUrl: 'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg', origin: 'publisher', verification: 'VERIFIED', platform: 'Archive / Press' },
    { id: 'fallback-portrait', chapter: 'identity', year: '', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/960px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png', origin: 'open-public', verification: 'VERIFIED', platform: 'Archive / Press' },
];

const homeVideoIds = [
    'police-exit-2023',
    'starton-personal-interview-2022',
    'bizzi-video',
    'russian-education-legacy',
];

const mediaVideoIds = [
    ...homeVideoIds,
    'starton-14',
    'fraud-13',
    'nova-long',
    'ndi-repatriation-2024',
];

const storyOrder = ['origin', 'service', 'identity', 'fatherhood', 'voice', 'starton', 'civic', 'culture', 'research', 'now', 'live', 'archive'];
const platformOrder = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn', 'X', 'Threads', 'Telegram', 'Archive / Press'];

const selectVideos = (ids: string[]) => ids
    .map(id => deepMedia.find(item => item.id === id))
    .filter((item): item is DeepMediaItem => Boolean(item?.youtubeId));

const normalizedUrl = (value: string) => value.trim().replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

const inferPlatform = (platform = '', source = '', sourceUrl = '') => {
    const value = `${platform} ${source} ${sourceUrl}`.toLowerCase();
    if (value.includes('instagram')) return 'Instagram';
    if (value.includes('tiktok')) return 'TikTok';
    if (value.includes('facebook')) return 'Facebook';
    if (value.includes('youtube') || value.includes('youtu.be')) return 'YouTube';
    if (value.includes('linkedin')) return 'LinkedIn';
    if (value.includes('threads')) return 'Threads';
    if (value.includes('x.com') || value.includes('twitter')) return 'X';
    if (value.includes('telegram') || value.includes('t.me')) return 'Telegram';
    return 'Archive / Press';
};

const canonicalChapter = (canonicalId = '') => {
    const value = canonicalId.toLowerCase();
    if (value.includes('origin')) return 'origin';
    if (value.includes('service')) return 'service';
    if (value.includes('father')) return 'fatherhood';
    if (value.includes('starton')) return 'starton';
    if (value.includes('music')) return 'culture';
    if (value.includes('research')) return 'research';
    if (value.includes('identity')) return 'identity';
    if (value.includes('voice') || value.includes('fraud')) return 'voice';
    if (value.includes('7ya-now')) return 'now';
    return '';
};

const inferChapter = (canonicalId = '', text = '', year = '') => {
    const canonical = canonicalChapter(canonicalId);
    if (canonical) return canonical;
    const value = text.toLowerCase();
    if (/child|childhood|immig|kharkiv|jesse cohen|at.?risk youth|ילדות|עלייה|חרקוב|ג[׳']?סי כהן|נער בסיכון|детств|харьков|репатри/.test(value)) return 'origin';
    if (/police|army|military|service|security|משטר|צבא|שירות|ביטחון|полиц|арм|служб/.test(value)) return 'service';
    if (/father|parent|children|אבא|אבהות|ילדים|הורות|отец|отцов|родител/.test(value)) return 'fatherhood';
    if (/starton|youth center|נוער|סטארט|microsoft for startups|молод|стартап/.test(value)) return 'starton';
    if (/election|politic|civic|leadership|knesset|ישראל ביתנו|בחירות|פוליט|מנהיג|обществен|полит|выбор/.test(value)) return 'civic';
    if (/music|song|spotify|clip|bizzi|supapor|מוזיק|שיר|קליפ|музык|песн|клип/.test(value)) return 'culture';
    if (/research|study|theory|framework|academ|מחקר|אקדמ|מודל|תיאוריה|исслед|академ|теор/.test(value)) return 'research';
    if (/identity|belong|russian|ukrain|זהות|שייכות|רוסי|אוקראינ|идентич|русск|украин/.test(value)) return 'identity';
    if (/viral|interview|media|fraud|public voice|ויראל|ראיון|מדיה|הונא|פוסט|вирус|интервью|медиа/.test(value)) return 'voice';
    if (year === '2026' || /\b7ya\b|current|today|עכשיו|היום|сейчас|сегодня/.test(value)) return 'now';
    return 'archive';
};

const projectionVisual = (item: ProjectionItem): VisualRegistryItem | null => {
    const sourceUrl = String(item.sourceUrl || '');
    const imageUrl = String(item.mediaType === 'profile' ? item.screenshotUrl || item.imageUrl || '' : item.imageUrl || item.screenshotUrl || '');
    if (!sourceUrl || !imageUrl) return null;
    const year = String(item.year || item.date || '').match(/(?:19|20)\d{2}/)?.[0] || '';
    const text = [item.title?.he, item.title?.en, item.title?.ru, item.summary?.he, item.summary?.en, item.summary?.ru, item.publisher, item.platform, item.sourceKind].filter(Boolean).join(' ');
    return {
        id: `projection-${item.id}`,
        canonicalId: item.canonicalId,
        chapter: inferChapter(item.canonicalId, text, year),
        year,
        source: String(item.publisher || item.platform || 'Public source'),
        sourceUrl,
        imageUrl,
        label: item.mediaType === 'profile' ? 'OFFICIAL PUBLIC PROFILE' : 'PUBLIC / SOCIAL SOURCE',
        origin: 'public-projection',
        verification: String(item.trust || 'PUBLIC-SOURCE'),
        platform: inferPlatform(item.platform, item.publisher, sourceUrl),
        mediaType: item.mediaType,
        titles: item.title,
        summaries: item.summary,
    };
};

const discoveryVisual = (item: DiscoveryItem): VisualRegistryItem | null => {
    if (!item.url || !item.imageUrl) return null;
    const text = [item.title, item.relationship, item.publisher, item.platform].join(' ');
    return {
        id: `discovery-${item.id}`,
        chapter: inferChapter('', text, item.year),
        year: item.year,
        source: item.publisher || item.platform || 'Public discovery',
        sourceUrl: item.url,
        imageUrl: item.imageUrl,
        label: item.relationship,
        origin: 'public-discovery',
        verification: item.verification || 'DISCOVERY',
        platform: inferPlatform(item.platform, item.publisher, item.url),
        mediaType: /profile|surface/i.test(item.relationship) ? 'profile' : 'post',
        titles: { he: item.title, en: item.title, ru: item.title },
    };
};

const balanceHome = (items: VisualRegistryItem[]) => {
    const candidates = items.filter(item => item.mediaType !== 'profile' && !/research document/i.test(item.label || ''));
    const chosen: VisualRegistryItem[] = [];
    const used = new Set<string>();
    const platformCounts = new Map<string, number>();
    const add = (item: VisualRegistryItem) => {
        const key = `${normalizedUrl(item.sourceUrl)}|${item.imageUrl}`;
        if (used.has(key)) return false;
        used.add(key);
        chosen.push(item);
        platformCounts.set(item.platform || 'Archive / Press', (platformCounts.get(item.platform || 'Archive / Press') || 0) + 1);
        return true;
    };
    for (const chapter of storyOrder) {
        const match = candidates.find(item => item.chapter === chapter && !used.has(`${normalizedUrl(item.sourceUrl)}|${item.imageUrl}`));
        if (match) add(match);
    }
    for (const item of candidates) {
        if (chosen.length >= 18) break;
        const platform = item.platform || 'Archive / Press';
        if ((platformCounts.get(platform) || 0) >= 4) continue;
        add(item);
    }
    return chosen.slice(0, 18);
};

export default function NativePersonalMedia({ mode = 'home' }: NativePersonalMediaProps) {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const videos = selectVideos(mode === 'media' ? mediaVideoIds : homeVideoIds);
    const [registryVisuals, setRegistryVisuals] = useState<VisualRegistryItem[]>([]);
    const [platformFilter, setPlatformFilter] = useState('all');
    const [chapterFilter, setChapterFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(mode === 'home' ? 18 : 36);

    useEffect(() => {
        let active = true;
        const load = async () => {
            const [registryResult, projectionResult, discoveryResult] = await Promise.allSettled([
                api.get('/api/visual-registry'),
                api.get('/api/public-projection?sort=newest&limit=300'),
                api.get('/api/discovery-library?limit=300'),
            ]);
            if (!active) return;
            const registryRows = registryResult.status === 'fulfilled' && Array.isArray(registryResult.value.data?.items)
                ? registryResult.value.data.items as VisualRegistryItem[]
                : [];
            const projectionRows = projectionResult.status === 'fulfilled' && Array.isArray(projectionResult.value.data?.items)
                ? projectionResult.value.data.items as ProjectionItem[]
                : [];
            const discoveryRows = discoveryResult.status === 'fulfilled' && Array.isArray(discoveryResult.value.data?.items)
                ? discoveryResult.value.data.items as DiscoveryItem[]
                : [];
            const base = registryRows.map(item => ({
                ...item,
                platform: item.platform || inferPlatform('', item.source, item.sourceUrl),
                mediaType: item.mediaType || 'image',
            }));
            const merged = [
                ...base,
                ...projectionRows.map(projectionVisual).filter((item): item is VisualRegistryItem => Boolean(item)),
                ...discoveryRows.map(discoveryVisual).filter((item): item is VisualRegistryItem => Boolean(item)),
            ];
            const seen = new Set<string>();
            const unique = merged.filter(item => {
                if (!item.imageUrl || !item.sourceUrl) return false;
                const key = `${normalizedUrl(item.sourceUrl)}|${item.imageUrl}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            setRegistryVisuals(unique);
        };
        void load().catch(() => {
            if (active) setRegistryVisuals([]);
        });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (mode === 'media') setVisibleCount(36);
    }, [mode, platformFilter, chapterFilter]);

    const platformOptions = useMemo(() => platformOrder.filter(platform => registryVisuals.some(item => item.platform === platform)), [registryVisuals]);
    const chapterOptions = useMemo(() => storyOrder.filter(chapter => registryVisuals.some(item => item.chapter === chapter)), [registryVisuals]);
    const filteredVisuals = useMemo(() => registryVisuals.filter(item =>
        (platformFilter === 'all' || item.platform === platformFilter)
        && (chapterFilter === 'all' || item.chapter === chapterFilter)
    ), [registryVisuals, platformFilter, chapterFilter]);
    const photoVisuals = registryVisuals.length
        ? mode === 'home' ? balanceHome(registryVisuals) : filteredVisuals.slice(0, visibleCount)
        : fallbackVisuals;
    const visualSrc = (value: string) => /^https?:\/\//i.test(value) ? value : rootHref(value.replace(/^\/+/, ''));
    const visualHref = (value: string) => /^https?:\/\//i.test(value) ? value : rootHref(value.replace(/^\/+/, ''));

    return (
        <section
            className={`native-personal-media native-personal-media-${mode}`}
            dir={dir}
            aria-labelledby={`native-personal-media-title-${mode}`}
            data-native-personal-media={mode}
        >
            <div className='public-shell native-personal-media-shell'>
                <header className='native-personal-media-head'>
                    <div>
                        <small dir='ltr'>{c.eyebrow}</small>
                        <h2 id={`native-personal-media-title-${mode}`}>{c.title}</h2>
                    </div>
                    <p>{c.body}</p>
                </header>

                {mode === 'media' && registryVisuals.length ? (
                    <div className='native-media-filters' aria-label={c.owner}>
                        <div className='native-filter-row'>
                            <button type='button' className={platformFilter === 'all' ? 'active' : ''} onClick={() => setPlatformFilter('all')}>{c.allPlatforms}</button>
                            {platformOptions.map(platform => (
                                <button type='button' key={platform} className={platformFilter === platform ? 'active' : ''} onClick={() => setPlatformFilter(platform)}>{platform}</button>
                            ))}
                        </div>
                        <div className='native-filter-row native-filter-chapters'>
                            <button type='button' className={chapterFilter === 'all' ? 'active' : ''} onClick={() => setChapterFilter('all')}>{c.allChapters}</button>
                            {chapterOptions.map(chapter => (
                                <button type='button' key={chapter} className={chapterFilter === chapter ? 'active' : ''} onClick={() => setChapterFilter(chapter)}>{visualTitles[locale][chapter] || chapter}</button>
                            ))}
                        </div>
                        <small className='native-filter-count'>{c.showing} {Math.min(visibleCount, filteredVisuals.length)} / {filteredVisuals.length} {c.assets}</small>
                    </div>
                ) : null}

                <div className='native-owner-photo-grid' aria-label={c.owner} data-visual-registry={registryVisuals.length ? 'live' : 'fallback'}>
                    {photoVisuals.map((visual, index) => {
                        const chapterTitle = visualTitles[locale][visual.chapter] || c.photoLife;
                        const title = visual.titles?.[locale] || chapterTitle;
                        const href = visualHref(visual.sourceUrl);
                        return (
                            <article
                                className='native-owner-photo'
                                data-owner-original='true'
                                data-visual-registry-photo={visual.id}
                                data-visual-origin={visual.origin}
                                data-platform={visual.platform || visual.source}
                                key={`${visual.id}-${index}`}
                            >
                                <img
                                    src={visualSrc(visual.imageUrl)}
                                    alt={title}
                                    loading={mode === 'home' && index === 0 ? 'eager' : 'lazy'}
                                    decoding='async'
                                    referrerPolicy='no-referrer'
                                    onError={event => {
                                        event.currentTarget.hidden = true;
                                        event.currentTarget.closest('.native-owner-photo')?.classList.add('source-poster');
                                    }}
                                />
                                <div>
                                    <small>{visual.platform || visual.source}{visual.year ? ' · ' + visual.year : ''} · {visual.verification}</small>
                                    <span className='native-story-tag'>{chapterTitle}</span>
                                    <h3>{title}</h3>
                                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{c.source}<ArrowUpRight /></a>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {mode === 'media' && filteredVisuals.length > visibleCount ? (
                    <button className='native-show-more' type='button' onClick={() => setVisibleCount(value => Math.min(value + 36, filteredVisuals.length))}>
                        {c.showMore} · {filteredVisuals.length - visibleCount}
                    </button>
                ) : null}

                <div className='native-video-grid'>
                    {videos.map(item => {
                        const local = itemText(item.id, locale, item.title, item.summary);
                        return (
                            <article className='native-video-card' key={item.id} data-native-player={item.id}>
                                <div className='native-video-frame'>
                                    <LazyYouTube
                                        videoId={item.youtubeId!}
                                        title={local.title}
                                        thumbnail={item.image}
                                    />
                                </div>
                                <div className='native-video-copy'>
                                    <small>{item.source} · {item.year}</small>
                                    <h3>{local.title}</h3>
                                    <p>{local.summary}</p>
                                    <a href={item.url} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight /></a>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {mode === 'home' ? (
                    <a className='native-media-all' href={pageHref('media', locale)}>{c.all}<ArrowUpRight /></a>
                ) : null}
            </div>
        </section>
    );
}
