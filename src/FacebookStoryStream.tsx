import { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowUpRight, Facebook } from 'lucide-react';
import { pageHref, useLocale, type Locale } from './locale';
import './facebook-story-stream.css';

type LiveSocialItem = {
    id?: string;
    platform?: string;
    account?: string;
    title: string;
    publishedAt?: string;
    url: string;
    kind?: string;
    thumbnail?: string;
};

type FacebookStoryStreamProps = {
    mode?: 'home' | 'media';
    liveItems?: LiveSocialItem[];
};

type ProjectionItem = {
    id: string;
    layer?: string;
    title?: Partial<Record<Locale, string>>;
    summary?: Partial<Record<Locale, string>>;
    date?: string;
    platform?: string;
    publisher?: string;
    mediaType?: string;
    sourceKind?: string;
    sourceUrl?: string;
    imageUrl?: string;
    screenshotUrl?: string;
    trust?: string;
};

type FacebookItem = {
    id: string;
    kind: 'post' | 'video';
    publisher: string;
    date: string;
    url: string;
    metric?: string;
    imageUrl?: string;
    statusLabel?: string;
    title: Record<Locale, string>;
    context: Record<Locale, string>;
    relation: Record<Locale, string>;
};

const primaryFacebook = 'https://www.facebook.com/vepretski7';

const items: FacebookItem[] = [
    {
        id: 'father-presence',
        kind: 'post',
        publisher: 'סטטוסים מצייצים',
        date: '2023',
        url: 'https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0icaS4EV3EFHPbtTaexx3X4Lo9UGQD22Nvm8xzkpJRqiJSLro9D3zNp1PX6SJ26iPl',
        metric: '4.1K reactions · 148 comments · 26 shares',
        title: { he: 'אבא מושלם — זה אבא ששם', en: 'A perfect father is a father who is there', ru: 'Идеальный отец — тот, кто рядом' },
        context: { he: 'סיפור אישי על אבהות ונוכחות שהמשיך מעבר לעמוד המקורי.', en: 'A personal story about fatherhood and presence that travelled beyond the original post.', ru: 'Личная история об отцовстве и присутствии, вышедшая далеко за пределы исходного поста.' },
        relation: { he: 'הפצה חיצונית', en: 'External repost', ru: 'Внешнее распространение' },
    },
    {
        id: 'mial-kindergarten',
        kind: 'post',
        publisher: 'סטטוסים מצייצים',
        date: 'Archive',
        url: 'https://www.facebook.com/lan2lan.sta2sim/posts/pfbid02FW4Q9ZWvN8K1Q6vpSy9ndnDiXPYgRbEs59JC2XANo2dSnhufQJbxRVWoXzdkcfa9l',
        title: { he: 'תחילת השבוע הגננת מתקשרת', en: 'The week starts with a call from kindergarten', ru: 'Неделя начинается со звонка воспитательницы' },
        context: { he: 'פוסט משפחתי שהמשיך לעמודים נוספים ולרשת מקצועית.', en: 'A family post that continued into additional pages and a professional network.', ru: 'Семейный пост, который продолжил жить на других страницах и в профессиональной сети.' },
        relation: { he: 'הפצה חיצונית', en: 'External repost', ru: 'Внешнее распространение' },
    },
    {
        id: 'identity-russian',
        kind: 'post',
        publisher: 'סטטוסים מצייצים',
        date: 'Archive',
        url: 'https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0VyLgUHZ6KLoY953QnCkSnWkSUtLqmV7NeeW6NmB2bABFh1R7bkRzj8Lw5imUeHckl',
        title: { he: 'רוסי מסריח', en: 'A story about identity and belonging', ru: '«Русский вонючий» — история идентичности' },
        context: { he: 'זיכרון אישי על עלייה, זהות ושייכות שהופץ בכמה פלטפורמות.', en: 'A personal memory about immigration, identity and belonging distributed across platforms.', ru: 'Личное воспоминание о репатриации, идентичности и принадлежности, разошедшееся по нескольким платформам.' },
        relation: { he: 'הפצה חיצונית', en: 'External repost', ru: 'Внешнее распространение' },
    },
    {
        id: 'elder-fraud',
        kind: 'post',
        publisher: 'סטטוסים מצייצים',
        date: '07.02.2023',
        url: 'https://www.facebook.com/lan2lan.sta2sim/posts/igorvepretski-%D7%A1%D7%91%D7%AA%D7%90-%D7%A9%D7%9C%D7%99-%D7%A0%D7%A4%D7%9C%D7%94-%D7%A7%D7%95%D7%A8%D7%91%D7%9F-%D7%9C%D7%94%D7%95%D7%A0%D7%90%D7%94%D7%90%D7%91%D7%9C-%D7%9C%D7%A2%D7%95%D7%92%D7%9E%D7%AA-%D7%94%D7%A0%D7%A4%D7%A9-%D7%94%D7%A2%D7%99%D7%A7%D7%A8%D7%99%D7%AA-%D7%91%D7%9B%D7%95%D7%9C-%D7%94%D7%A1%D7%99%D7%A4%D7%95%D7%A8-%D7%94%D7%96%D7%94-/752380882924243/',
        title: { he: 'סבתא שלי נפלה קורבן להונאה', en: 'My grandmother fell victim to fraud', ru: 'Моя бабушка стала жертвой мошенничества' },
        context: { he: 'פוסט אישי שהפך לשרשרת של סיקור, טלוויזיה וראיונות המשך.', en: 'A personal post that developed into press coverage, television and follow-up interviews.', ru: 'Личный пост, который перерос в публикации, телевидение и последующие интервью.' },
        relation: { he: 'פוסט → מסלול תקשורתי', en: 'Post → media trail', ru: 'Пост → медиа-цепочка' },
    },
    {
        id: 'henry-recognition',
        kind: 'post',
        publisher: 'סטטוסים מצייצים',
        date: '02.10.2023',
        url: 'https://www.facebook.com/lan2lan.sta2sim/posts/pfbid0fLDvPkLmF846Jhme65ETbkcNRTcTK8z3s3XojRtfe3eCdTnmSCK4icTmn5rdxcCRl',
        title: { he: 'תכירו את הנרי האלוף!', en: 'Meet Henry', ru: 'Знакомьтесь: Генри' },
        context: { he: 'פוסט הכרה באדם ובסיפור שהמשיך גם להפצה מקצועית חיצונית.', en: 'A recognition post that later continued into external professional distribution.', ru: 'Пост-признание человеку и его истории, который продолжил распространяться в профессиональной среде.' },
        relation: { he: 'הפצה חיצונית', en: 'External repost', ru: 'Внешнее распространение' },
    },
    {
        id: 'culture-hit',
        kind: 'video',
        publisher: 'הצינור',
        date: 'Archive',
        url: 'https://www.facebook.com/hazinor/videos/10153274636619662/',
        metric: '≈1.5K reactions',
        title: { he: 'זה מתחיל להסתמן כלהיט החדש', en: 'It is starting to look like the new hit', ru: 'Похоже, рождается новый хит' },
        context: { he: 'רגע תרבותי־מוזיקלי עם איגור וקבוצת יוצרים, בהפצה של הצינור.', en: 'A music and culture moment featuring Igor and collaborators, distributed by Hazinor.', ru: 'Музыкально-культурный эпизод с Игорем и другими авторами, распространённый Hazinor.' },
        relation: { he: 'וידאו ויראלי חיצוני', en: 'External viral video', ru: 'Внешнее вирусное видео' },
    },
    {
        id: 'political-voice',
        kind: 'video',
        publisher: 'ישראל ביתנו',
        date: '29.01.2026',
        url: 'https://www.facebook.com/beytenu/videos/26702411802682636/',
        metric: '≈14K views · indexed snapshot',
        title: { he: 'איפה הניצחון המוחלט?', en: 'Where is the total victory?', ru: 'Где абсолютная победа?' },
        context: { he: 'קטע קול ציבורי של איגור שהופץ בעמוד מפלגתי; מוצג כהפצה ולא כהוכחת תמיכה.', en: 'A public-voice clip by Igor distributed on a party page; shown as distribution, not endorsement.', ru: 'Фрагмент публичного высказывания Игоря на партийной странице; это распространение, а не доказательство поддержки.' },
        relation: { he: 'הפצה מפלגתית', en: 'Party distribution', ru: 'Партийное распространение' },
    },
    {
        id: 'russian-safety',
        kind: 'video',
        publisher: 'ישראל ביתנו ברוסית',
        date: 'Archive',
        url: 'https://www.facebook.com/beytenurusskiy/videos/3176491592494318/',
        title: { he: 'מה אסור לעשות בזמן ירי', en: 'What not to do during rocket fire', ru: 'Что нельзя делать во время обстрела' },
        context: { he: 'תוכן ציבורי ברוסית שהופץ בעמוד הרוסי של המפלגה.', en: 'Russian-language public content distributed on the party’s Russian-language page.', ru: 'Русскоязычный публичный материал, распространённый на русской странице партии.' },
        relation: { he: 'הפצה ברוסית', en: 'Russian-language distribution', ru: 'Распространение на русском' },
    },
];

const copy: Record<Locale, { eyebrow: string; title: string; body: string; primary: string; source: string; more: string }> = {
    he: {
        eyebrow: 'FACEBOOK · LIVE GRAPH API · ARCHIVE FALLBACK',
        title: 'פייסבוק לא נשאר קישור בפוטר.',
        body: 'פוסטים וסרטונים מהזיכרון הציבורי מוצגים כאן מתוך המקור עצמו. פרסום בבעלות, הפצה חיצונית והפצה מפלגתית נשארים מסומנים בנפרד — בלי לחבר מדדים ובלי להמציא בעלות.',
        primary: 'Facebook הרשמי',
        source: 'לפתיחת המקור',
        more: 'לעוד Facebook ומדיה',
    },
    en: {
        eyebrow: 'FACEBOOK · LIVE GRAPH API · ARCHIVE FALLBACK',
        title: 'Facebook is not a footer link.',
        body: 'Posts and videos from the public record are shown from their original Facebook source. Owned publishing, external reposts and party distribution remain distinct without combining metrics or inventing ownership.',
        primary: 'Official Facebook',
        source: 'Open source',
        more: 'More Facebook and media',
    },
    ru: {
        eyebrow: 'FACEBOOK · LIVE GRAPH API · АРХИВНЫЙ FALLBACK',
        title: 'Facebook — не ссылка в подвале.',
        body: 'Посты и видео из публичного архива показываются прямо из исходного Facebook-источника. Собственные публикации, внешние репосты и партийное распространение остаются раздельными.',
        primary: 'Официальный Facebook',
        source: 'Открыть источник',
        more: 'Больше Facebook и медиа',
    },
};

const embedUrl = (item: FacebookItem) => {
    const plugin = item.kind === 'video' ? 'video.php' : 'post.php';
    return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(item.url)}&show_text=true&width=560`;
};

const projectionToFacebook = (item: ProjectionItem, locale: Locale): FacebookItem | null => {
    if (!item.sourceUrl || item.platform?.toLowerCase() !== 'facebook') return null;
    const resolvedTitle = item.title?.[locale] || item.title?.he || item.title?.en || item.publisher || 'Facebook';
    const resolvedSummary = item.summary?.[locale] || item.summary?.he || item.summary?.en || '';
    const layer = (item.layer || 'PUBLIC').toUpperCase();
    const owner = item.sourceKind === 'owner-authorized-api';
    const relation = owner ? { he: 'פרסום בבעלות · חיבור חי', en: 'Owned publishing · live connection', ru: 'Собственная публикация · live' } : { he: `Facebook · ${layer}`, en: `Facebook · ${layer}`, ru: `Facebook · ${layer}` };
    const context = resolvedSummary || (owner ? (locale === 'he' ? 'פרסום ציבורי שנקרא ישירות מהחיבור המאושר של איגור.' : locale === 'ru' ? 'Публичная публикация из авторизованного подключения Игоря.' : 'A public post read from Igor’s authorized connection.') : (locale === 'he' ? 'פריט Facebook ציבורי שנשמר עם המקור והמעמד שלו.' : locale === 'ru' ? 'Публичный материал Facebook с сохранённым источником и статусом.' : 'A public Facebook item kept with its source and evidence status.'));
    return {
        id: `projection-${item.id}`,
        kind: item.mediaType === 'video' ? 'video' : 'post',
        publisher: item.publisher || 'Igor Vepretski',
        date: item.date ? item.date.slice(0, 10) : layer,
        url: item.sourceUrl,
        imageUrl: item.imageUrl || item.screenshotUrl || undefined,
        statusLabel: owner || layer === 'LIVE' ? 'LIVE · GRAPH API' : `${layer} · SOURCE`,
        title: { he: resolvedTitle, en: resolvedTitle, ru: resolvedTitle },
        context: { he: context, en: context, ru: context },
        relation,
    };
};

export default function FacebookStoryStream({ mode = 'home', liveItems = [] }: FacebookStoryStreamProps) {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const [projected, setProjected] = useState<FacebookItem[]>([]);
    useEffect(() => {
        let active = true;
        void api.get('/api/public-projection?platform=Facebook&sort=impact&limit=24').then(response => {
            if (!active) return;
            const rows = ((response.data as { items?: ProjectionItem[] }).items || []).map(item => projectionToFacebook(item, locale)).filter((item): item is FacebookItem => Boolean(item));
            setProjected(rows);
        }).catch(() => { if (active) setProjected([]); });
        return () => { active = false; };
    }, [locale]);
    const liveVisible: FacebookItem[] = liveItems
        .filter(item => item.platform === 'Facebook' && item.url && item.title)
        .slice(0, mode === 'home' ? 12 : 48)
        .map(item => ({
            id: 'live-' + (item.id || item.url),
            kind: item.kind === 'video' ? 'video' as const : 'post' as const,
            publisher: item.account || 'Igor Vepretski',
            date: item.publishedAt ? item.publishedAt.slice(0, 10) : 'LIVE',
            url: item.url,
            imageUrl: item.thumbnail,
            statusLabel: 'LIVE · GRAPH API',
            title: { he: item.title, en: item.title, ru: item.title },
            context: {
                he: 'פרסום שנקרא כעת מהחיבור החי של Facebook. המקור נשאר צמוד לפריט.',
                en: 'A publication read now from the live Facebook connection, with its source kept attached.',
                ru: 'Публикация получена сейчас из живого подключения Facebook; исходный источник сохранён рядом.',
            },
            relation: { he: 'חיבור חי', en: 'Live connection', ru: 'Живое подключение' },
        }));
    const archiveVisible = items;
    const seen = new Set<string>();
    const visible = [...projected, ...liveVisible, ...archiveVisible].filter(item => {
        const key = item.url.trim().replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, mode === 'home' ? 4 : 18);

    return (
        <section className={`facebook-story-stream facebook-story-stream-${mode}`} dir={dir} data-facebook-stream={mode} aria-labelledby={`facebook-stream-title-${mode}`}>
            <div className='public-shell facebook-story-shell'>
                <header className='facebook-story-head'>
                    <div>
                        <small dir='ltr'><Facebook />{c.eyebrow}</small>
                        <h2 id={`facebook-stream-title-${mode}`}>{c.title}</h2>
                    </div>
                    <div>
                        <p>{c.body}</p>
                        <a href={primaryFacebook} target='_blank' rel='noreferrer'>{c.primary}<ArrowUpRight /></a>
                    </div>
                </header>

                <div className='facebook-story-grid'>
                    {visible.map(item => (
                        <article className='facebook-story-card' key={item.id} data-facebook-item={item.id} data-render-method={mode === 'home' ? 'native-card' : 'source-embed'}>
                            <div className='facebook-story-meta'>
                                <span>Facebook · {item.publisher}</span>
                                <span>{item.date}</span>
                            </div>
                            <h3>{item.title[locale]}</h3>
                            <p>{item.context[locale]}</p>
                            {mode === 'home' && item.imageUrl ? <figure className='facebook-story-thumb'><img src={item.imageUrl} alt={item.title[locale]} loading='lazy' decoding='async' referrerPolicy='no-referrer' onError={event => { event.currentTarget.closest('figure')?.remove(); }} /></figure> : null}
                            <div className='facebook-story-relation'>
                                <b>{item.relation[locale]}</b>
                                <small dir='ltr'>{item.statusLabel || 'ARCHIVE FALLBACK'}</small>
                            </div>
                            {mode === 'media' ? (
                                <div className={`facebook-embed-shell facebook-embed-${item.kind}`} data-facebook-embed={item.kind}>
                                    <iframe
                                        src={embedUrl(item)}
                                        title={`${item.publisher} · ${item.title[locale]}`}
                                        loading='lazy'
                                        allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
                                        allowFullScreen
                                    />
                                </div>
                            ) : null}
                            <a className='facebook-story-source' href={item.url} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight /></a>
                        </article>
                    ))}
                </div>

                {mode === 'home' ? <a className='facebook-story-more' href={pageHref('media', locale)}>{c.more}<ArrowUpRight /></a> : null}
            </div>
        </section>
    );
}
