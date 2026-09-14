import { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import {
    ArrowUpRight,
    ExternalLink,
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    Play,
    Radio,
    Send,
    Youtube,
} from 'lucide-react';
import { pageHref, useLocale, type Locale } from './locale';
import { canonicalCorpusSeed } from '../shared/canonical-corpus';
import { mergePublicRegisterIntoCanon } from '../shared/public-register-canon';
import './live-social.css';

type SocialPlatform = 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn' | 'X' | 'Threads' | 'Telegram';
type StoryChapterId = 'origin' | 'service' | 'return' | 'fatherhood' | 'oct7' | 'creation' | 'now';
type ProjectionLayer = 'CANON' | 'DISCOVERY' | 'LIVE' | 'LEGACY' | 'PENDING';
type LocalizedText = Record<Locale, string>;

type Account = {
    id: string;
    platform: string;
    handle: string;
    url: string;
    mode: 'live' | 'canonical';
    label: string;
};

type FeedItem = {
    id: string;
    platform: SocialPlatform;
    account: string;
    title: string;
    publishedAt: string;
    url: string;
    thumbnail: string;
    kind: 'video' | 'image' | 'post';
    status: 'live-source' | 'canonical-source';
    rank?: number;
    layer?: ProjectionLayer;
    sourceKind?: string;
    topics?: string[];
    searchText?: string;
};

type FeedStatus = {
    status: string;
    source: string;
    items: FeedItem[];
};

type Payload = {
    release: string;
    checkedAt: string;
    accounts: Account[];
    feeds: {
        youtube: FeedStatus;
        instagramPrimary: FeedStatus;
        instagramSecondary: FeedStatus;
        tiktok: FeedStatus;
        facebook: FeedStatus;
        linkedin: FeedStatus;
    };
    items: FeedItem[];
};

type ProjectionItem = {
    id: string;
    layer: ProjectionLayer;
    title?: Partial<Record<Locale, string>>;
    summary?: Partial<Record<Locale, string>>;
    date: string;
    year: string;
    platform: string;
    publisher: string;
    mediaType: string;
    sourceKind?: string;
    sourceUrl: string;
    imageUrl: string;
    screenshotUrl: string;
    trust: string;
    topics?: string[];
    relationships?: string[];
};

type ProjectionPayload = {
    items?: ProjectionItem[];
    knownTotal?: number;
};

type ChapterDefinition = {
    id: StoryChapterId;
    index: string;
    period: string;
    title: LocalizedText;
    statement: LocalizedText;
    pattern: RegExp;
};

const platformOrder: SocialPlatform[] = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook', 'X', 'Threads', 'Telegram'];

const fallbackAccounts: Account[] = [
    { id: 'instagram-primary', platform: 'Instagram', handle: '@igor.vepretski', url: 'https://www.instagram.com/igor.vepretski/', mode: 'canonical', label: 'PRIMARY' },
    { id: 'instagram-secondary', platform: 'Instagram', handle: '@vepretski.igor', url: 'https://www.instagram.com/vepretski.igor/', mode: 'canonical', label: 'SECOND ACCOUNT' },
    { id: 'tiktok', platform: 'TikTok', handle: '@igor.vepretski', url: 'https://www.tiktok.com/@igor.vepretski', mode: 'canonical', label: 'CURRENT' },
    { id: 'youtube', platform: 'YouTube', handle: '@IgorVepretski', url: 'https://www.youtube.com/channel/UCyxk2AupRjm7KQ5EeWrV1Fw', mode: 'live', label: 'LIVE FEED' },
    { id: 'linkedin', platform: 'LinkedIn', handle: '/in/vepretski', url: 'https://www.linkedin.com/in/vepretski/', mode: 'canonical', label: 'PROFESSIONAL' },
    { id: 'facebook', platform: 'Facebook', handle: 'Igor Vepretski', url: 'https://www.facebook.com/vepretski7', mode: 'canonical', label: 'PRIMARY PUBLIC' },
    { id: 'x', platform: 'X', handle: '@igorvepretski', url: 'https://x.com/igorvepretski', mode: 'canonical', label: 'REAL-TIME' },
    { id: 'threads', platform: 'Threads', handle: '@igor.vepretski', url: 'https://www.threads.net/@igor.vepretski', mode: 'canonical', label: 'CONVERSATION' },
    { id: 'telegram', platform: 'Telegram', handle: '@vepretski', url: 'https://t.me/vepretski', mode: 'canonical', label: 'COMMUNITY' },
];

const chapters: ChapterDefinition[] = [
    {
        id: 'origin',
        index: '01',
        period: '1990 → 2007',
        title: { he: 'חרקוב → ישראל → ג׳סי כהן', en: 'Kharkiv → Israel → Jesse Cohen', ru: 'Харьков → Израиль → Джесси Коэн' },
        statement: {
            he: 'זהות, עלייה, שכונה ושייכות. פרסומים מאוחרים חוזרים לכאן כדי להסביר מאיפה הסיפור התחיל.',
            en: 'Identity, migration, neighborhood and belonging. Later posts return here to explain where the story began.',
            ru: 'Идентичность, репатриация, район и принадлежность. Поздние публикации возвращаются сюда, чтобы объяснить начало пути.',
        },
        pattern: /חרקוב|חארקוב|kharkiv|kharkov|харьков|ג[׳']?סי|jesse cohen|джесси|ילדות|childhood|детств|עולה|עלייה|immigr|migration|репат|רוסי מסריח|russian|identity|belong|שייכות|идентич|принадлеж/i,
    },
    {
        id: 'service',
        index: '02',
        period: '2008 → 2021',
        title: { he: 'שירות, ביטחון ומשטרה', en: 'Service, security and policing', ru: 'Служба, безопасность и полиция' },
        statement: {
            he: 'הצבא, מערכות הביטחון והמשטרה לא מוצגים כטייטלים — אלא כתקופה שבה אחריות, שטח ומערכת הפכו לשפה מקצועית.',
            en: 'Military, security and police work are not shown as titles, but as the period when responsibility, field work and systems became a professional language.',
            ru: 'Армия, безопасность и полиция показаны не как титулы, а как период, когда ответственность, полевая работа и системы стали профессиональным языком.',
        },
        pattern: /משטרה|police|полици|צבא|military|army|арм|ביטחון|security|безопас|שירות|service|служб|סיירת|recon|intelligence|מודיעין|consul|קונסול|mfa/i,
    },
    {
        id: 'return',
        index: '03',
        period: '2022 →',
        title: { he: 'לחזור לשכונה → StartOn', en: 'Return to the neighborhood → StartOn', ru: 'Возвращение в район → StartOn' },
        statement: {
            he: 'החזרה לג׳סי כהן הפכה את הסיפור האישי לשאלה מעשית: איך מייצרים לצעירים גישה, טכנולוגיה, מנטורים ושייכות.',
            en: 'Returning to Jesse Cohen turned biography into a practical question: how to create access, technology, mentors and belonging for young people.',
            ru: 'Возвращение в Джесси Коэн превратило биографию в практический вопрос: как дать молодёжи доступ, технологии, наставников и принадлежность.',
        },
        pattern: /starton|סטארט.?און|נוער|youth|молод|innovation hub|מרכז חדשנות|קהילה|community|microsoft|president.?s residence|בית הנשיא|נשיא המדינה/i,
    },
    {
        id: 'fatherhood',
        index: '04',
        period: '2023 →',
        title: { he: 'אבהות, נוכחות וקול אישי', en: 'Fatherhood, presence and a personal voice', ru: 'Отцовство, присутствие и личный голос' },
        statement: {
            he: 'כאן התוכן מפסיק להיות רק מקצועי. הורות, משפחה ונוכחות הופכות לשיחה ציבורית — בלי להפוך את הילדים למוצר תוכן.',
            en: 'Here the content stops being only professional. Parenting, family and presence become public conversation without turning children into content products.',
            ru: 'Здесь контент перестаёт быть только профессиональным. Родительство, семья и присутствие становятся публичным разговором без превращения детей в продукт.',
        },
        pattern: /אבא|אבהות|הורות|father|parent|отцов|родител|משפחה|family|семь|ילדים|children|дети|בן 26/i,
    },
    {
        id: 'oct7',
        index: '05',
        period: '2023 → 2024',
        title: { he: '7 באוקטובר משנה את הקול', en: 'October 7 changes the voice', ru: '7 октября меняет голос' },
        statement: {
            he: 'מלחמה, ביטחון, אחריות אזרחית ושאלות הנהגה נכנסות לאותו רצף. זה פרק של תגובה למציאות, לא מיתוג מחדש.',
            en: 'War, security, civic responsibility and leadership questions enter the same timeline. This is a response to reality, not a rebrand.',
            ru: 'Война, безопасность, гражданская ответственность и вопросы лидерства входят в одну линию. Это реакция на реальность, а не ребрендинг.',
        },
        pattern: /7 באוקטובר|october 7|7 october|7 октября|מלחמה|war|войн|חמאס|hamas|хамас|חטופ|hostage|залож|פיקוד העורף|home front|אזעק|siren|terror|טרור|террор/i,
    },
    {
        id: 'creation',
        index: '06',
        period: '2020 → 2025',
        title: { he: 'יצירה, מוזיקה והאינטרנט', en: 'Creation, music and the internet', ru: 'Творчество, музыка и интернет' },
        statement: {
            he: 'הומור, וידאו, TikTok, מוזיקה ושירים הם לא סטייה מהביוגרפיה. הם הדרך שבה הקול נבדק מול קהל אמיתי.',
            en: 'Humor, video, TikTok, music and songs are not a detour from the biography. They are how the voice was tested with a real audience.',
            ru: 'Юмор, видео, TikTok, музыка и песни — не отклонение от биографии. Это способ проверять голос на реальной аудитории.',
        },
        pattern: /מוזיקה|שיר|יצירה|יוצר תוכן|music|song|creative|creator|музык|песн|творч|bizzi|nawan|rap|hip.?hop|рэп|tiktokmarketing|digital influence|viral|ויראל/i,
    },
    {
        id: 'now',
        index: '07',
        period: '2026 → NOW',
        title: { he: '7YA, מחקר ומנהיגות ציבורית', en: '7YA, research and public leadership', ru: '7YA, исследования и общественное лидерство' },
        statement: {
            he: 'הפרק הנוכחי מחבר אדם, משימה ומערכת: 7YA, StartOn, מחקר, AI, מדיה ומחשבה על מנהיגות — עם מקור פתוח לכל טענה.',
            en: 'The current chapter connects person, mission and system: 7YA, StartOn, research, AI, media and public leadership with an open source behind every claim.',
            ru: 'Текущая глава соединяет человека, миссию и систему: 7YA, StartOn, исследования, AI, медиа и общественное лидерство с открытым источником за каждым утверждением.',
        },
        pattern: /7ya|supernoah|academia|research|מחקר|исслед|algorithm|אלגורית|ai\b|civic ai|מנהיגות|leadership|лидер|ישראל ביתנו|israel beitenu|liberman|ליברמן|politic|פוליט/i,
    },
];

const copy = {
    he: {
        kicker: 'SOCIAL STORY ATLAS · ALL NETWORKS → LIFE',
        title: 'כל הרשתות.\nסיפור אחד.',
        body: 'לא עוד קיר פוסטים. כל פרסום, וידאו ותמונה נכנסים למקום שבו הם שייכים במסע החיים — עם המקור המקורי, התאריך והפלטפורמה. LIVE כשאפשר, Canon או Recovery כשצריך.',
        chapterLabel: 'פרקי החיים',
        networksLabel: 'כל משטחי המקור',
        open: 'פתח מקור',
        journey: 'חזור לפרק במסע',
        traces: 'עקבות ציבוריות',
        networks: 'רשתות בפרק',
        archive: 'פתח את הארכיון המלא',
        empty: 'אין עדיין פריט ממופה לפרק הזה. משטחי המקור נשארים זמינים ישירות.',
        sourceMap: 'המקור קודם לסיפור',
        sourceMapBody: 'פריט LIVE נשאר LIVE. פריט Canon נשאר Canon. חומר משוחזר מסומן ככזה. שום פוסט לא הופך לעובדה ביוגרפית רק כי הוא קיים ברשת.',
        known: 'פריטים ציבוריים ידועים במקרן',
        live: 'LIVE',
    },
    en: {
        kicker: 'SOCIAL STORY ATLAS · ALL NETWORKS → LIFE',
        title: 'Every network.\nOne story.',
        body: 'Not another post wall. Every publication, video and image is placed where it belongs in the life journey, with its original source, date and platform. LIVE when possible, Canon or Recovery when needed.',
        chapterLabel: 'Life chapters',
        networksLabel: 'All source surfaces',
        open: 'Open source',
        journey: 'Return to journey chapter',
        traces: 'public traces',
        networks: 'networks in chapter',
        archive: 'Open the full archive',
        empty: 'No mapped item is available for this chapter yet. The source surfaces remain directly accessible.',
        sourceMap: 'Source before story',
        sourceMapBody: 'A LIVE item stays LIVE. Canon stays Canon. Recovered material stays labeled as recovered. A post never becomes a biographical fact merely because it exists online.',
        known: 'known public items in projection',
        live: 'LIVE',
    },
    ru: {
        kicker: 'SOCIAL STORY ATLAS · ALL NETWORKS → LIFE',
        title: 'Все сети.\nОдна история.',
        body: 'Не ещё одна стена постов. Каждая публикация, видео и изображение попадает в свою главу жизненного пути — с исходным источником, датой и платформой. LIVE, когда возможно; Canon или Recovery, когда необходимо.',
        chapterLabel: 'Главы жизни',
        networksLabel: 'Все источники',
        open: 'Открыть источник',
        journey: 'Вернуться к главе пути',
        traces: 'публичных следов',
        networks: 'сетей в главе',
        archive: 'Открыть полный архив',
        empty: 'Для этой главы пока нет сопоставленного материала. Публичные источники остаются доступны напрямую.',
        sourceMap: 'Сначала источник, потом история',
        sourceMapBody: 'LIVE остаётся LIVE. Canon остаётся Canon. Восстановленный материал помечается как восстановленный. Пост не становится биографическим фактом только потому, что он существует в сети.',
        known: 'известных публичных объектов в проекции',
        live: 'LIVE',
    },
} as const;

const isPlatform = (value: string | undefined): value is SocialPlatform =>
    Boolean(value && platformOrder.includes(value as SocialPlatform));

const platformFrom = (url: string, hint = ''): SocialPlatform | null => {
    const value = `${url} ${hint}`.toLowerCase();
    if (/youtube|youtu\.be/.test(value)) return 'YouTube';
    if (/instagram/.test(value)) return 'Instagram';
    if (/tiktok/.test(value)) return 'TikTok';
    if (/facebook/.test(value)) return 'Facebook';
    if (/linkedin/.test(value)) return 'LinkedIn';
    if (/x\.com|twitter/.test(value)) return 'X';
    if (/threads/.test(value)) return 'Threads';
    if (/t\.me|telegram/.test(value)) return 'Telegram';
    return null;
};

const youtubeThumb = (raw: string) => {
    try {
        const url = new URL(raw);
        const id = url.hostname === 'youtu.be'
            ? url.pathname.split('/').filter(Boolean)[0]
            : url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1];
        return id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : '';
    } catch {
        return '';
    }
};

const platformIcon = (name: string) => {
    if (name === 'Instagram') return <Instagram aria-hidden='true' />;
    if (name === 'YouTube') return <Youtube aria-hidden='true' />;
    if (name === 'LinkedIn') return <Linkedin aria-hidden='true' />;
    if (name === 'Facebook') return <Facebook aria-hidden='true' />;
    if (name === 'Telegram') return <Send aria-hidden='true' />;
    if (name === 'Threads') return <MessageCircle aria-hidden='true' />;
    if (name === 'X') return <Radio aria-hidden='true' />;
    return <Play aria-hidden='true' />;
};

const urlKey = (raw: string) => {
    try {
        const url = new URL(raw);
        ['fbclid', 'igshid', 'si', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => url.searchParams.delete(key));
        url.hash = '';
        return `${url.origin}${url.pathname}${url.search}`.replace(/\/$/, '').toLowerCase();
    } catch {
        return raw.toLowerCase().replace(/\/$/, '');
    }
};

const yearFrom = (value: string) => Number(value.match(/(?:19|20)\d{2}/)?.[0] || 0);

const chapterFor = (item: FeedItem): StoryChapterId => {
    const value = [item.title, item.account, item.platform, item.url, item.searchText || '', ...(item.topics || [])].join(' ').toLowerCase();
    const explicit = chapters.find(chapter => chapter.pattern.test(value));
    if (explicit) return explicit.id;
    const year = yearFrom(item.publishedAt);
    if (year && year <= 2014) return 'origin';
    if (year >= 2015 && year <= 2021) return 'service';
    if (year === 2022) return 'return';
    if (year === 2023) return 'fatherhood';
    if (year === 2024) return 'oct7';
    if (year === 2025) return 'creation';
    return 'now';
};

const sourceMode = (item: FeedItem) => {
    if (/owner-authorized-api/i.test(item.sourceKind || '')) return 'OWNER API';
    if (item.status === 'live-source' || item.layer === 'LIVE') return 'LIVE SOURCE';
    if (item.layer === 'CANON') return 'CANON';
    if (item.layer === 'LEGACY') return 'RECOVERED';
    if (item.layer === 'DISCOVERY') return 'DISCOVERY';
    return 'PUBLIC SOURCE';
};

const itemScore = (item: FeedItem) =>
    (item.rank || 0) +
    (item.thumbnail ? 80 : 0) +
    (item.kind === 'video' ? 35 : item.kind === 'image' ? 20 : 0) +
    (item.status === 'live-source' ? 25 : 0) +
    (item.layer === 'CANON' ? 20 : item.layer === 'LIVE' ? 15 : 0);

const selectDiverse = (items: FeedItem[], limit = 7) => {
    const sorted = [...items].sort((a, b) => itemScore(b) - itemScore(a) || (b.publishedAt || '').localeCompare(a.publishedAt || ''));
    const selected: FeedItem[] = [];
    const platforms = new Set<SocialPlatform>();
    for (const item of sorted) {
        if (selected.length >= limit) break;
        if (platforms.has(item.platform)) continue;
        selected.push(item);
        platforms.add(item.platform);
    }
    for (const item of sorted) {
        if (selected.length >= limit) break;
        if (selected.some(candidate => candidate.id === item.id)) continue;
        selected.push(item);
    }
    return selected;
};

const formatDate = (value: string, locale: Locale) => {
    if (!value) return '';
    try {
        return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : locale === 'ru' ? 'ru-RU' : 'en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(value));
    } catch {
        return value.slice(0, 10);
    }
};

export default function LiveSocial() {
    const { locale } = useLocale();
    const c = copy[locale];
    const [data, setData] = useState<Payload | null>(null);
    const [projection, setProjection] = useState<ProjectionPayload | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<StoryChapterId>('origin');

    useEffect(() => {
        let active = true;
        Promise.allSettled([
            api.get('/api/social-feed'),
            api.get('/api/public-projection?limit=300&sort=newest'),
        ]).then(results => {
            if (!active) return;
            const social = results[0];
            const projected = results[1];
            if (social.status === 'fulfilled') setData(social.value.data as Payload);
            if (projected.status === 'fulfilled') setProjection(projected.value.data as ProjectionPayload);
        });
        return () => {
            active = false;
        };
    }, []);

    const accounts = data?.accounts?.length ? data.accounts : fallbackAccounts;

    const canonicalItems = useMemo<FeedItem[]>(() => {
        const seen = new Set<string>();
        return mergePublicRegisterIntoCanon(canonicalCorpusSeed)
            .flatMap(event => event.sources.flatMap(source => {
                const platform = source.platform;
                if (!source.public || !/^https:\/\//i.test(source.url) || !isPlatform(platform)) return [];
                const media = event.media.find(item => item.sourceUrl === source.url && item.url)?.url || '';
                const kind: FeedItem['kind'] = source.kind === 'broadcast' || source.kind === 'public-video' ? 'video' : media ? 'image' : 'post';
                const searchText = [
                    event.title.he,
                    event.title.en,
                    event.title.ru,
                    event.summary.he,
                    event.summary.en,
                    event.summary.ru,
                    ...(event.tags || []),
                ].join(' ');
                return [{
                    id: `canon-social-${event.id}-${source.id}`,
                    platform,
                    account: source.label,
                    title: event.title[locale],
                    publishedAt: source.publishedAt || event.canonicalDate,
                    url: source.url,
                    thumbnail: media || youtubeThumb(source.url),
                    kind,
                    status: 'canonical-source' as const,
                    layer: 'CANON' as const,
                    sourceKind: source.kind,
                    topics: event.tags || [],
                    searchText,
                    rank: kind === 'video' ? 70 : media ? 45 : 20,
                }];
            }))
            .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
            .filter(item => {
                const key = urlKey(item.url);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }, [locale]);

    const projectionItems = useMemo<FeedItem[]>(() => {
        return (projection?.items || []).flatMap(item => {
            const platform = platformFrom(item.sourceUrl, item.platform);
            if (!platform || !item.sourceUrl) return [];
            const verified = /VERIFIED|CANON/i.test(`${item.trust} ${item.layer}`);
            const highSignal = /news|חדשות|channel|ערוץ|mynet|hidabroot|הידברות|podcast|פודקאסט|spotify/i.test(`${item.publisher} ${item.platform}`);
            const rank =
                (item.mediaType === 'video' ? 65 : item.imageUrl || item.screenshotUrl ? 35 : 0) +
                (item.layer === 'CANON' ? 55 : item.layer === 'LIVE' ? 45 : item.layer === 'DISCOVERY' ? 20 : 10) +
                (verified ? 25 : 0) +
                (highSignal ? 20 : 0);
            const title = item.title?.[locale] || item.publisher || platform;
            const searchText = [
                item.title?.he || '',
                item.title?.en || '',
                item.title?.ru || '',
                item.summary?.he || '',
                item.summary?.en || '',
                item.summary?.ru || '',
                item.publisher,
                item.platform,
                item.sourceKind || '',
                ...(item.topics || []),
                ...(item.relationships || []),
            ].join(' ');
            return [{
                id: `projection-${item.id}`,
                platform,
                account: item.publisher || item.platform,
                title,
                publishedAt: item.date || item.year,
                url: item.sourceUrl,
                thumbnail: item.imageUrl || item.screenshotUrl || youtubeThumb(item.sourceUrl),
                kind: item.mediaType === 'video' ? 'video' : item.mediaType === 'image' ? 'image' : 'post',
                status: item.layer === 'LIVE' ? 'live-source' as const : 'canonical-source' as const,
                layer: item.layer,
                sourceKind: item.sourceKind,
                topics: item.topics || [],
                searchText,
                rank,
            }];
        });
    }, [projection, locale]);

    const allItems = useMemo(() => {
        const seen = new Set<string>();
        return [...projectionItems, ...(data?.items || []), ...canonicalItems]
            .map(item => ({
                ...item,
                searchText: item.searchText || [item.title, item.account, item.platform, item.url].join(' '),
            }))
            .filter(item => {
                const key = urlKey(item.url);
                if (!key || seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }, [projectionItems, data, canonicalItems]);

    const chapterItems = useMemo(() => {
        const buckets = Object.fromEntries(chapters.map(chapter => [chapter.id, [] as FeedItem[]])) as Record<StoryChapterId, FeedItem[]>;
        for (const item of allItems) buckets[chapterFor(item)].push(item);
        for (const chapter of chapters) buckets[chapter.id] = selectDiverse(buckets[chapter.id]);
        return buckets;
    }, [allItems]);

    const platformCounts = useMemo(() => {
        const counts = Object.fromEntries(platformOrder.map(platform => [platform, 0])) as Record<SocialPlatform, number>;
        for (const item of allItems) counts[item.platform] += 1;
        return counts;
    }, [allItems]);

    const chapter = chapters.find(candidate => candidate.id === selectedChapter) || chapters[0];
    const selectedItems = chapterItems[chapter.id];
    const lead = selectedItems.find(item => Boolean(item.thumbnail)) || selectedItems[0];
    const supporting = selectedItems.filter(item => item.id !== lead?.id).slice(0, 4);
    const chapterNetworks = new Set(selectedItems.map(item => item.platform)).size;
    const liveCount = (data?.items || []).filter(item => item.status === 'live-source').length;

    return (
        <section className='live-social social-story-atlas' id='social-story-atlas' aria-labelledby='social-story-atlas-title'>
            <div className='live-social-shell'>
                <header className='story-atlas-header'>
                    <div>
                        <span><Radio aria-hidden='true' />{c.kicker}</span>
                        <h2 id='social-story-atlas-title'>{c.title}</h2>
                    </div>
                    <div className='story-atlas-intro'>
                        <p>{c.body}</p>
                        <div className='story-atlas-health'>
                            <b>{liveCount}</b>
                            <span>{c.live}</span>
                            <i />
                            <b>{projection?.knownTotal || allItems.length}</b>
                            <span>{c.known}</span>
                        </div>
                    </div>
                </header>

                <div className='story-atlas-network-block' aria-label={c.networksLabel}>
                    <div className='story-atlas-label'>{c.networksLabel}</div>
                    <div className='story-atlas-networks'>
                        {platformOrder.map(platform => {
                            const platformAccounts = accounts.filter(account => account.platform === platform);
                            const primary = platformAccounts[0] || fallbackAccounts.find(account => account.platform === platform);
                            if (!primary) return null;
                            const handles = platformAccounts.length > 1
                                ? platformAccounts.map(account => account.handle).join(' · ')
                                : primary.handle;
                            return (
                                <a href={primary.url} target='_blank' rel='noreferrer' key={platform} className='story-atlas-network'>
                                    <div>{platformIcon(platform)}<span>{platform}</span></div>
                                    <strong>{platformCounts[platform]}</strong>
                                    <small>{handles}</small>
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className='story-atlas-chapters'>
                    <div className='story-atlas-label'>{c.chapterLabel}</div>
                    <div className='story-atlas-rail' role='tablist' aria-label={c.chapterLabel}>
                        {chapters.map(candidate => (
                            <button
                                type='button'
                                role='tab'
                                aria-selected={candidate.id === chapter.id}
                                className={candidate.id === chapter.id ? 'is-active' : ''}
                                key={candidate.id}
                                onClick={() => setSelectedChapter(candidate.id)}
                            >
                                <span>{candidate.index}</span>
                                <small>{candidate.period}</small>
                                <strong>{candidate.title[locale]}</strong>
                                <em>{chapterItems[candidate.id].length}</em>
                            </button>
                        ))}
                    </div>
                </div>

                <article className='story-atlas-scene' aria-live='polite'>
                    <div className='story-atlas-context'>
                        <div className='story-atlas-context-index'>
                            <span>CHAPTER {chapter.index}</span>
                            <time>{chapter.period}</time>
                        </div>
                        <h3>{chapter.title[locale]}</h3>
                        <p>{chapter.statement[locale]}</p>
                        <div className='story-atlas-stats'>
                            <div><strong>{selectedItems.length}</strong><span>{c.traces}</span></div>
                            <div><strong>{chapterNetworks}</strong><span>{c.networks}</span></div>
                        </div>
                        <a className='story-atlas-journey-link' href={`#journey-${chapter.id}`}>
                            {c.journey}<ArrowUpRight aria-hidden='true' />
                        </a>
                    </div>

                    <div className='story-atlas-media-stage'>
                        {lead ? (
                            <a className='story-atlas-lead' href={lead.url} target='_blank' rel='noreferrer'>
                                <figure>
                                    <div className='story-atlas-media-fallback'>{lead.platform}</div>
                                    {lead.thumbnail && (
                                        <img
                                            src={lead.thumbnail}
                                            alt={lead.title}
                                            loading='lazy'
                                            decoding='async'
                                            referrerPolicy='no-referrer'
                                            onError={event => { event.currentTarget.style.display = 'none'; }}
                                        />
                                    )}
                                    <div className='story-atlas-source-badge'>{platformIcon(lead.platform)}<span>{lead.platform}</span><b>{sourceMode(lead)}</b></div>
                                    {lead.kind === 'video' && <div className='story-atlas-play'><Play fill='currentColor' aria-hidden='true' /></div>}
                                </figure>
                                <div className='story-atlas-lead-copy'>
                                    <time>{formatDate(lead.publishedAt, locale)}</time>
                                    <h4>{lead.title}</h4>
                                    <span>{lead.account}</span>
                                    <b>{c.open}<ExternalLink aria-hidden='true' /></b>
                                </div>
                            </a>
                        ) : (
                            <div className='story-atlas-empty'><p>{c.empty}</p></div>
                        )}

                        {supporting.length > 0 && (
                            <div className='story-atlas-support' aria-label={locale === 'he' ? 'עקבות תומכות' : locale === 'ru' ? 'Связанные следы' : 'Supporting traces'}>
                                {supporting.map(item => (
                                    <a href={item.url} target='_blank' rel='noreferrer' key={item.id}>
                                        <figure>
                                            <div className='story-atlas-media-fallback'>{item.platform}</div>
                                            {item.thumbnail && (
                                                <img
                                                    src={item.thumbnail}
                                                    alt=''
                                                    loading='lazy'
                                                    decoding='async'
                                                    referrerPolicy='no-referrer'
                                                    onError={event => { event.currentTarget.style.display = 'none'; }}
                                                />
                                            )}
                                            <span>{platformIcon(item.platform)}{item.platform}</span>
                                        </figure>
                                        <div>
                                            <time>{formatDate(item.publishedAt, locale)}</time>
                                            <h5>{item.title}</h5>
                                            <small>{sourceMode(item)}</small>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                <div className='story-atlas-footer'>
                    <div>
                        <strong>{c.sourceMap}</strong>
                        <p>{c.sourceMapBody}</p>
                    </div>
                    <a href={pageHref('library', locale)}>{c.archive}<ArrowUpRight aria-hidden='true' /></a>
                </div>
            </div>
        </section>
    );
}
