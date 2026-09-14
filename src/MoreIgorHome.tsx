import { ExternalLink } from 'lucide-react';
import { deepMedia, type DeepMediaItem } from './deep-media-data';
import { categoryText, itemText, pageHref, rootHref, useLocale, type Locale } from './locale';
import './more-igor-home.css';

type ShelfCopy = {
    eyebrow: string;
    title: string;
    body: string;
    href: (locale: Locale) => string;
    ids: readonly string[];
};

type Copy = {
    eyebrow: string;
    title: string;
    body: string;
    routes: string;
    source: string;
    all: string;
    records: string;
    openChapter: string;
    sourceRecord: string;
};

const copy: Record<Locale, Copy> = {
    he: {
        eyebrow: 'IGOR · החיים עצמם · ארכיון פתוח',
        title: 'זה לא תקציר. אלה החיים שלי ברשת.',
        body: 'וידאו, כתבות, פוסטים, ראיונות, מוזיקה, StartOn, שירות, אבהות ורגעים ויראליים — לא כמה דוגמאות שנבחרו כדי לסמן וי. כל מה שכבר נמצא בקורפוס מקבל כאן מקום, מחובר למקור שלו.',
        routes: 'קפיצה לפרק',
        source: 'למקור',
        all: 'לארכיון הציבורי המלא — בלי קיצורים',
        records: 'פריטים מוצגים',
        openChapter: 'לפתיחת הפרק המלא',
        sourceRecord: 'SOURCE RECORD',
    },
    en: {
        eyebrow: 'IGOR · LIFE ITSELF · OPEN ARCHIVE',
        title: 'This is not a summary. It is my life on the public web.',
        body: 'Video, press, posts, interviews, music, StartOn, service, fatherhood and viral moments — not a few examples chosen to tick a box. Everything already present in the corpus gets a place here and stays linked to its source.',
        routes: 'Jump to chapter',
        source: 'Source',
        all: 'Open the full public archive — no shortcuts',
        records: 'records shown',
        openChapter: 'Open the full chapter',
        sourceRecord: 'SOURCE RECORD',
    },
    ru: {
        eyebrow: 'ИГОРЬ · САМА ЖИЗНЬ · ОТКРЫТЫЙ АРХИВ',
        title: 'Это не резюме. Это моя жизнь в публичной сети.',
        body: 'Видео, публикации, посты, интервью, музыка, StartOn, служба, отцовство и вирусные моменты — не несколько примеров для галочки. Всё, что уже есть в корпусе, получает здесь место и остаётся связанным с источником.',
        routes: 'Перейти к главе',
        source: 'Источник',
        all: 'Открыть весь публичный архив — без сокращений',
        records: 'материалов показано',
        openChapter: 'Открыть полную главу',
        sourceRecord: 'SOURCE RECORD',
    },
};

const shelfCopy: Record<Locale, ShelfCopy[]> = {
    he: [
        {
            eyebrow: '01 · STARTON / YOUTH / FIELD',
            title: 'מהשכונה לשליחות.',
            body: 'החזרה לג׳סי כהן, בניית StartOn, ראיונות, הרצאות ותיעוד של הרעיון כשהוא יוצא מהסיפור האישי אל השטח.',
            href: locale => pageHref('starton', locale),
            ids: ['mynet-return', 'starton-13-page', 'starton-14', 'starton-day', 'nitzotzot', 'linkedin-starton', 'starton-personal-interview-2022', 'shlomi-haster-interview-2022'],
        },
        {
            eyebrow: '02 · VOICE / INTERVIEWS / LONG FORM',
            title: 'השיחות שבהן אפשר באמת להכיר אותי.',
            body: 'פודקאסטים, רדיו ושיחות ארוכות שבהן יש זמן לדבר על הדרך, נוער, מנהיגות, בירוקרטיה, אחריות וזהות בלי לדחוס הכול לסאונדבייט.',
            href: locale => pageHref('speaker', locale),
            ids: ['mindset-page', 'glass-ceilings', 'glass-ceilings-54', 'creators-home-youtube-2023', 'kan-reka-ru-2022', 'moving-minds', 'nadlan-interview', 'nova-long', 'youth-radio', 'oren-agmon-interview-2023'],
        },
        {
            eyebrow: '03 · VIRAL / PUBLIC VOICE / CULTURE',
            title: 'הרגעים שיצאו משליטה — במובן הטוב.',
            body: 'ויראליות, הומור רוסי, אבהות, מאבקים ציבוריים והופעות חיצוניות. לא מספר אחד גדול, אלא פריטים ספציפיים עם המקור והמדד שלהם.',
            href: locale => pageHref('media', locale),
            ids: ['nawan-external-2026', 'russian-education-legacy', 'russian-father-short', 'father-hidabroot', 'mial-maakav-2023', 'fraud-13', 'fraud-12', 'hazinor-hit', 'police-reel'],
        },
        {
            eyebrow: '04 · MUSIC / CLIPS / COLLABORATIONS',
            title: 'המוזיקה לא יושבת בפוטר.',
            body: 'קליפים, שיתופי פעולה וקטלוגים רשמיים — מהיצירה המוקדמת ועד BIZZI, כולל החומרים ברוסית והארכיון המוזיקלי.',
            href: () => rootHref('music/'),
            ids: ['excel-video', 'bizzi-video', 'flower-video', 'supaporp-video', 'spotify-artist', 'apple-artist', 'soundcloud', 'excel'],
        },
        {
            eyebrow: '05 · WRITING / IDEAS / DIGITAL GENERATION',
            title: 'מה כתבתי לפני שהכול הפך למערכת.',
            body: 'טורים ומאמרים על הורות, טיקטוק, חינוך, שינוי כללי המשחק, השפעה דיגיטלית והמסע האישי — כתיבה שמראה איך הרעיונות נבנו לאורך זמן.',
            href: locale => pageHref('research', locale),
            ids: ['zman-author', 'zman-tiktok', 'zman-rules', 'medium-story', 'linkedin-media'],
        },
        {
            eyebrow: '06 · ORIGINS / SERVICE / IDENTITY',
            title: 'השורשים, השירות והזהות.',
            body: 'התיעוד המוקדם, המשטרה, העלייה והזהות הרוסית, 7 באוקטובר והקול הציבורי שנבנה לאורך השנים. זה החיבור בין מי שהייתי לבין מה שבניתי אחר כך.',
            href: () => rootHref('igor-vepretski/'),
            ids: ['early-2011', 'police-exit-2023', 'dna-710', 'ndi-repatriation-2024', 'barak-seri-103fm-trace', 'wikimedia', 'tiktok-engine'],
        },
    ],
    en: [
        {
            eyebrow: '01 · STARTON / YOUTH / FIELD',
            title: 'From the neighbourhood to a mission.',
            body: 'The return to Jesse Cohen, the build-up of StartOn, interviews, speaking and the record of an idea moving from personal story into the field.',
            href: locale => pageHref('starton', locale),
            ids: ['mynet-return', 'starton-13-page', 'starton-14', 'starton-day', 'nitzotzot', 'linkedin-starton', 'starton-personal-interview-2022', 'shlomi-haster-interview-2022'],
        },
        {
            eyebrow: '02 · VOICE / INTERVIEWS / LONG FORM',
            title: 'The conversations where you can actually know me.',
            body: 'Podcasts, radio and long-form conversations about the journey, youth, leadership, bureaucracy, responsibility and identity without compressing everything into a soundbite.',
            href: locale => pageHref('speaker', locale),
            ids: ['mindset-page', 'glass-ceilings', 'glass-ceilings-54', 'creators-home-youtube-2023', 'kan-reka-ru-2022', 'moving-minds', 'nadlan-interview', 'nova-long', 'youth-radio', 'oren-agmon-interview-2023'],
        },
        {
            eyebrow: '03 · VIRAL / PUBLIC VOICE / CULTURE',
            title: 'The moments that escaped the feed — in a good way.',
            body: 'Viral culture, Russian humour, fatherhood, civic campaigns and external appearances. Not one giant reach number: specific items with their own source and metric.',
            href: locale => pageHref('media', locale),
            ids: ['nawan-external-2026', 'russian-education-legacy', 'russian-father-short', 'father-hidabroot', 'mial-maakav-2023', 'fraud-13', 'fraud-12', 'hazinor-hit', 'police-reel'],
        },
        {
            eyebrow: '04 · MUSIC / CLIPS / COLLABORATIONS',
            title: 'The music does not belong in the footer.',
            body: 'Videos, collaborations and official catalogues — from earlier releases through BIZZI, including Russian-language work and the music archive.',
            href: () => rootHref('music/'),
            ids: ['excel-video', 'bizzi-video', 'flower-video', 'supaporp-video', 'spotify-artist', 'apple-artist', 'soundcloud', 'excel'],
        },
        {
            eyebrow: '05 · WRITING / IDEAS / DIGITAL GENERATION',
            title: 'What I wrote before it became a system.',
            body: 'Columns and essays on parenting, TikTok, education, changing rules, digital influence and the personal journey — a record of ideas forming over time.',
            href: locale => pageHref('research', locale),
            ids: ['zman-author', 'zman-tiktok', 'zman-rules', 'medium-story', 'linkedin-media'],
        },
        {
            eyebrow: '06 · ORIGINS / SERVICE / IDENTITY',
            title: 'Origins, service and identity.',
            body: 'Early documentation, police service, immigration and Russian identity, October 7 and the public voice built across the years — the bridge between who I was and what I built next.',
            href: () => rootHref('igor-vepretski/'),
            ids: ['early-2011', 'police-exit-2023', 'dna-710', 'ndi-repatriation-2024', 'barak-seri-103fm-trace', 'wikimedia', 'tiktok-engine'],
        },
    ],
    ru: [
        {
            eyebrow: '01 · STARTON / YOUTH / FIELD',
            title: 'Из района — к миссии.',
            body: 'Возвращение в Джесси Коэн, создание StartOn, интервью, выступления и история того, как личный опыт превратился в работу на земле.',
            href: locale => pageHref('starton', locale),
            ids: ['mynet-return', 'starton-13-page', 'starton-14', 'starton-day', 'nitzotzot', 'linkedin-starton', 'starton-personal-interview-2022', 'shlomi-haster-interview-2022'],
        },
        {
            eyebrow: '02 · VOICE / INTERVIEWS / LONG FORM',
            title: 'Разговоры, в которых меня можно действительно узнать.',
            body: 'Подкасты, радио и длинные беседы о пути, молодёжи, лидерстве, бюрократии, ответственности и идентичности — без сжатия до одного клипа.',
            href: locale => pageHref('speaker', locale),
            ids: ['mindset-page', 'glass-ceilings', 'glass-ceilings-54', 'creators-home-youtube-2023', 'kan-reka-ru-2022', 'moving-minds', 'nadlan-interview', 'nova-long', 'youth-radio', 'oren-agmon-interview-2023'],
        },
        {
            eyebrow: '03 · VIRAL / PUBLIC VOICE / CULTURE',
            title: 'Моменты, которые вышли за пределы ленты.',
            body: 'Вирусные ролики, русский юмор, отцовство, общественные кампании и внешние появления. Не одна огромная цифра, а конкретные публикации со своими источниками и метриками.',
            href: locale => pageHref('media', locale),
            ids: ['nawan-external-2026', 'russian-education-legacy', 'russian-father-short', 'father-hidabroot', 'mial-maakav-2023', 'fraud-13', 'fraud-12', 'hazinor-hit', 'police-reel'],
        },
        {
            eyebrow: '04 · MUSIC / CLIPS / COLLABORATIONS',
            title: 'Музыка не должна жить в подвале сайта.',
            body: 'Клипы, коллаборации и официальные каталоги — от ранних работ до BIZZI, включая русскоязычные треки и музыкальный архив.',
            href: () => rootHref('music/'),
            ids: ['excel-video', 'bizzi-video', 'flower-video', 'supaporp-video', 'spotify-artist', 'apple-artist', 'soundcloud', 'excel'],
        },
        {
            eyebrow: '05 · WRITING / IDEAS / DIGITAL GENERATION',
            title: 'Что я писал до того, как всё стало системой.',
            body: 'Колонки и статьи об отцовстве, TikTok, образовании, новых правилах, цифровом влиянии и личном пути — история того, как формировались идеи.',
            href: locale => pageHref('research', locale),
            ids: ['zman-author', 'zman-tiktok', 'zman-rules', 'medium-story', 'linkedin-media'],
        },
        {
            eyebrow: '06 · ORIGINS / SERVICE / IDENTITY',
            title: 'Истоки, служба и идентичность.',
            body: 'Ранние публикации, полиция, репатриация и русская идентичность, 7 октября и публичный голос, который формировался годами.',
            href: () => rootHref('igor-vepretski/'),
            ids: ['early-2011', 'police-exit-2023', 'dna-710', 'ndi-repatriation-2024', 'barak-seri-103fm-trace', 'wikimedia', 'tiktok-engine'],
        },
    ],
};

const remainderShelf: Record<Locale, Omit<ShelfCopy, 'ids'>> = {
    he: { eyebrow: '07 · עוד מהארכיון הציבורי', title: 'ומה שלא נכנס לתווית — עדיין חלק מהחיים.', body: 'כל פריט ציבורי נוסף שכבר נמצא בקורפוס מוצג כאן אוטומטית במקום להיעלם רק מפני שלא שובץ ידנית בפרק.', href: locale => pageHref('library', locale) },
    en: { eyebrow: '07 · MORE FROM THE PUBLIC ARCHIVE', title: 'What does not fit a label still belongs to the life.', body: 'Every additional public record already present in the corpus is surfaced here automatically instead of disappearing because it was not manually assigned to a chapter.', href: locale => pageHref('library', locale) },
    ru: { eyebrow: '07 · ЕЩЁ ИЗ ПУБЛИЧНОГО АРХИВА', title: 'То, что не помещается в ярлык, всё равно часть жизни.', body: 'Каждый дополнительный публичный материал, уже находящийся в корпусе, автоматически показывается здесь, а не исчезает из-за отсутствия ручной категории.', href: locale => pageHref('library', locale) },
};

const routeSet = (locale: Locale) => locale === 'he'
    ? [
        ['המסע שלי', 'סיפור וחיים', rootHref('igor-vepretski/')],
        ['StartOn', 'שליחות חברתית', pageHref('starton', locale)],
        ['מדיה', 'ראיונות ופודקאסטים', pageHref('media', locale)],
        ['מוזיקה', 'קליפים וקטלוג', pageHref('music', locale)],
        ['כתיבה', 'טורים ומאמרים', pageHref('blog', locale)],
        ['מחקר', 'רעיונות ומסגרות', pageHref('research', locale)],
        ['ארכיון', 'כל הרשומות', pageHref('library', locale)],
        ['ראיות', 'מקורות וסטטוס', pageHref('evidence', locale)],
        ['מוזיאון', 'המסע החזותי', pageHref('museum', locale)],
        ['הרצאות', 'קול ובמות', pageHref('speaker', locale)],
        ['יצירה', 'להפוך רעיון לצעד', pageHref('create', locale)],
        ['קשר', 'לדבר איתי', rootHref('contact/')],
    ]
    : locale === 'ru'
        ? [
            ['Мой путь', 'История и жизнь', rootHref('igor-vepretski/')],
            ['StartOn', 'Социальная миссия', pageHref('starton', locale)],
            ['Медиа', 'Интервью и подкасты', pageHref('media', locale)],
            ['Музыка', 'Клипы и каталог', pageHref('music', locale)],
            ['Тексты', 'Колонки и статьи', pageHref('blog', locale)],
            ['Исследования', 'Идеи и модели', pageHref('research', locale)],
            ['Архив', 'Все записи', pageHref('library', locale)],
            ['Доказательства', 'Источники и статус', pageHref('evidence', locale)],
            ['Музей', 'Визуальный путь', pageHref('museum', locale)],
            ['Выступления', 'Голос и сцена', pageHref('speaker', locale)],
            ['Создать', 'От идеи к шагу', pageHref('create', locale)],
            ['Контакт', 'Связаться', rootHref('contact/')],
        ]
        : [
            ['My journey', 'Story and life', rootHref('igor-vepretski/')],
            ['StartOn', 'Social mission', pageHref('starton', locale)],
            ['Media', 'Interviews and podcasts', pageHref('media', locale)],
            ['Music', 'Videos and catalogue', pageHref('music', locale)],
            ['Writing', 'Columns and articles', pageHref('blog', locale)],
            ['Research', 'Ideas and frameworks', pageHref('research', locale)],
            ['Archive', 'Every record', pageHref('library', locale)],
            ['Evidence', 'Sources and status', pageHref('evidence', locale)],
            ['Museum', 'Visual journey', pageHref('museum', locale)],
            ['Speaking', 'Voice and stages', pageHref('speaker', locale)],
            ['Create', 'Turn ideas into action', pageHref('create', locale)],
            ['Contact', 'Talk to me', rootHref('contact/')],
        ];

function itemsFor(ids: readonly string[]) {
    return ids
        .map(id => deepMedia.find(item => item.id === id))
        .filter((item): item is DeepMediaItem => Boolean(item));
}

function ArchiveCard({ item, locale, index, sourceLabel, sourceRecord }: {
    item: DeepMediaItem;
    locale: Locale;
    index: number;
    sourceLabel: string;
    sourceRecord: string;
}) {
    const local = itemText(item.id, locale, item.title, item.summary);
    const safeImage = /(?:igor-hero\.jpg|7ya-research\.webp|7ya-starton\.webp|chapter-music\.webp|chapter-voice\.webp|7ya-launch\.webp)/.test(item.image) ? '' : item.image;
    const resolvedImage = safeImage || rootHref('api/media-image?v=5&url=' + encodeURIComponent(item.url));

    return (
        <a
            className={`mih-card${index === 0 ? ' mih-card-lead' : ''}`}
            href={item.url}
            target='_blank'
            rel='noreferrer'
            data-deep-record={item.id}
        >
            <figure data-source-poster={undefined}>
                {resolvedImage ? (
                    <img
                        src={resolvedImage}
                        data-image-origin={safeImage ? 'native' : 'source-resolver'}
                        alt={local.title}
                        loading='lazy'
                        decoding='async'
                        referrerPolicy='no-referrer'
                        onError={event => {
                            event.currentTarget.style.display = 'none';
                            event.currentTarget.closest('figure')?.setAttribute('data-source-poster', 'true');
                        }}
                    />
                ) : null}
                <div className='mih-source-poster'>
                    <small>{sourceRecord}</small>
                    <strong>{item.source}</strong>
                    <span>{item.year}</span>
                </div>
                <span className='mih-card-index'>{String(index + 1).padStart(2, '0')}</span>
            </figure>
            <div className='mih-card-copy'>
                <small>{categoryText(item.category, locale)} · {item.source} · {item.year}</small>
                <h4>{local.title}</h4>
                <p>{local.summary}</p>
                {item.metric ? <strong>{item.metric}</strong> : null}
                <footer>
                    <em>{item.status}</em>
                    <b>{sourceLabel}<ExternalLink /></b>
                </footer>
            </div>
        </a>
    );
}

export default function MoreIgorHome() {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const baseShelves = shelfCopy[locale];
    const assignedIds = new Set(baseShelves.flatMap(shelf => shelf.ids));
    const remainderIds = deepMedia.filter(item => !assignedIds.has(item.id)).map(item => item.id);
    const shelves: ShelfCopy[] = remainderIds.length ? [...baseShelves, { ...remainderShelf[locale], ids: remainderIds }] : baseShelves;
    const totalItems = new Set(shelves.flatMap(shelf => shelf.ids)).size;

    return (
        <section className='more-igor-home' id='more-of-igor' dir={dir} aria-labelledby='more-igor-title' data-archive-complete='true' data-archive-total={totalItems}>
            <div className='more-igor-shell'>
                <header className='more-igor-head'>
                    <div>
                        <small>{c.eyebrow}</small>
                        <h2 id='more-igor-title'>{c.title}</h2>
                    </div>
                    <div className='more-igor-intro'>
                        <p>{c.body}</p>
                        <strong>{totalItems}</strong>
                        <span>{c.records}</span>
                    </div>
                </header>

                <nav className='more-igor-jumps' aria-label={c.routes}>
                    {shelves.map((shelf, index) => (
                        <a href={`#igor-chapter-${index + 1}`} key={shelf.eyebrow}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {shelf.title}
                        </a>
                    ))}
                </nav>

                <nav className='more-igor-routes' aria-label={c.routes}>
                    {routeSet(locale).map(([title, note, href]) => (
                        <a href={href} key={title}>
                            <span>{title}</span>
                            <small>{note}</small>
                            <b>↗</b>
                        </a>
                    ))}
                </nav>

                <div className='more-igor-chapters'>
                    {shelves.map((shelf, shelfIndex) => {
                        const items = itemsFor(shelf.ids);
                        return (
                            <section
                                className='mih-chapter'
                                id={`igor-chapter-${shelfIndex + 1}`}
                                key={shelf.eyebrow}
                                data-archive-shelf={String(shelfIndex + 1)}
                            >
                                <header className='mih-chapter-head'>
                                    <div>
                                        <small>{shelf.eyebrow}</small>
                                        <h3>{shelf.title}</h3>
                                    </div>
                                    <div>
                                        <p>{shelf.body}</p>
                                        <span>{items.length} · {c.records}</span>
                                        <a href={shelf.href(locale)}>{c.openChapter} ↗</a>
                                    </div>
                                </header>
                                <div className='mih-grid'>
                                    {items.map((item, index) => (
                                        <ArchiveCard
                                            key={item.id}
                                            item={item}
                                            locale={locale}
                                            index={index}
                                            sourceLabel={c.source}
                                            sourceRecord={c.sourceRecord}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <a className='more-igor-all' href={pageHref('library', locale)}>
                    {c.all}
                    <span>↗</span>
                </a>
            </div>
        </section>
    );
}
