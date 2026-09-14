import { ArrowUpRight, Instagram, Play, Radio } from 'lucide-react';
import LazyYouTube from './LazyYouTube';
import { pageHref, useLocale, type Locale } from './locale';
import './massive-content-runway.css';

type LiveSocialItem = {
    id?: string;
    platform?: string;
    account?: string;
    title: string;
    publishedAt?: string;
    url: string;
    thumbnail?: string;
    kind?: string;
};

type Props = {
    mode?: 'home' | 'media';
    liveItems?: LiveSocialItem[];
};

type SocialItem = {
    id: string;
    platform: 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube' | 'Telegram';
    publisher: string;
    date: string;
    url: string;
    embed: string;
    image?: string;
    title: Record<Locale, string>;
    context: Record<Locale, string>;
    metric?: string;
};

type VideoItem = {
    id: string;
    videoId: string;
    source: string;
    year: string;
    url: string;
    title: Record<Locale, string>;
    context: Record<Locale, string>;
};

type VisualItem = {
    id: string;
    source: string;
    year: string;
    url: string;
    image: string;
    title: Record<Locale, string>;
    context: Record<Locale, string>;
};

const socialItems: SocialItem[] = [
    {
        id: 'instagram-service-2023',
        platform: 'Instagram',
        publisher: '@igor.vepretski',
        date: '17.10.2023',
        url: 'https://www.instagram.com/reel/CyhEU1kMUuH/',
        embed: 'https://www.instagram.com/reel/CyhEU1kMUuH/embed/captioned/',
        title: { he: 'משטרת ישראל הם גיבורי העל של התקופה', en: 'Israel Police are the heroes of this moment', ru: 'Полиция Израиля — герои этого периода' },
        context: { he: 'ריל ציבורי בבעלות איגור שמחבר ניסיון שירות להוקרה לאנשים שפעלו בשטח.', en: 'An Igor-owned public Reel connecting service experience with gratitude to people acting in the field.', ru: 'Публичный Reel Игоря, связывающий опыт службы с благодарностью людям, работавшим на месте.' },
    },
    {
        id: 'instagram-identity-2023',
        platform: 'Instagram',
        publisher: 'סטטוסים מצייצים',
        date: '2023',
        url: 'https://www.instagram.com/p/CsnfS5WoSw8/',
        embed: 'https://www.instagram.com/p/CsnfS5WoSw8/embed/captioned/',
        title: { he: 'רוסי מסריח — נגזרת Instagram', en: 'Identity and belonging — Instagram distribution', ru: '«Русский вонючий» — распространение в Instagram' },
        context: { he: 'אותו סיפור זהות שהופץ בפייסבוק קיבל חיים גם באינסטגרם.', en: 'The same identity story that circulated on Facebook also travelled through Instagram.', ru: 'Та же история идентичности, разошедшаяся в Facebook, получила продолжение в Instagram.' },
    },
    {
        id: 'instagram-fraud-2023',
        platform: 'Instagram',
        publisher: 'סטטוסים מצייצים',
        date: '07.02.2023',
        url: 'https://www.instagram.com/p/CoXykBwq3Zr/',
        embed: 'https://www.instagram.com/p/CoXykBwq3Zr/embed/captioned/',
        metric: '1,489 likes · indexed snapshot',
        title: { he: 'סבתא שלי נפלה קורבן להונאה', en: 'My grandmother fell victim to fraud', ru: 'Моя бабушка стала жертвой мошенничества' },
        context: { he: 'נגזרת Instagram מתועדת של הסיפור שהמשיך בהמשך לטלוויזיה ולראיונות.', en: 'A documented Instagram distribution of the story that later continued into television and interviews.', ru: 'Зафиксированное распространение в Instagram истории, которая затем вышла на телевидение и в интервью.' },
    },
    {
        id: 'tiktok-current-2026',
        platform: 'TikTok',
        publisher: '@igor.vepretski',
        date: '21.06.2026',
        url: 'https://www.tiktok.com/@igor.vepretski/video/7653793755757169941',
        embed: 'https://www.tiktok.com/player/v1/7653793755757169941?autoplay=0&loop=0&music_info=1&description=1',
        title: { he: 'הקול הנוכחי של איגור ב־TikTok', en: 'Igor’s current TikTok voice', ru: 'Текущий голос Игоря в TikTok' },
        context: { he: 'פריט ציבורי מהחשבון הנוכחי. המדדים נשארים לא מוצגים עד שיש צילום מצב אמין.', en: 'A public item from the current account. Metrics stay unstated until a reliable snapshot exists.', ru: 'Публичный материал текущего аккаунта. Метрики не показываются без надежного снимка.' },
    },
];

const videoItems: VideoItem[] = [
    {
        id: 'starton-physical-2022',
        videoId: 'SOpAglwkJ8I',
        source: 'פותחים יום',
        year: '2022',
        url: 'https://www.youtube.com/watch?v=SOpAglwkJ8I',
        title: { he: 'המודל הפיזי של StartOn', en: 'The physical StartOn model', ru: 'Физическая модель StartOn' },
        context: { he: 'ראיון שמציג את החלל האינטראקטיבי ואת החיבור בין טכנולוגיה, קהילה ונוער.', en: 'An interview showing the interactive space and the connection between technology, community and youth.', ru: 'Интервью об интерактивном пространстве и связи технологий, сообщества и молодежи.' },
    },
    {
        id: 'youth-crisis-2023',
        videoId: 'U2d_hulZAC0',
        source: 'רדיו חברתי ראשון',
        year: '2023',
        url: 'https://www.youtube.com/watch?v=U2d_hulZAC0',
        title: { he: 'אם לנו קשה, מה עובר על נוער בסיכון?', en: 'If it is hard for us, what are youth at risk going through?', ru: 'Если трудно нам, что переживают подростки группы риска?' },
        context: { he: 'שיחה על צעירים, משבר והצורך להפוך דאגה למסגרת פעולה.', en: 'A conversation about young people, crisis and turning concern into practical action.', ru: 'Разговор о молодежи, кризисе и превращении тревоги в практическое действие.' },
    },
    {
        id: 'fraud-followup-2023',
        videoId: '3XxoBtSL2pg',
        source: 'ראיון המשך',
        year: '2023',
        url: 'https://www.youtube.com/watch?v=3XxoBtSL2pg',
        title: { he: 'הסיפור שמאחורי המאבק בהונאות קשישים', en: 'The story behind the elder-fraud campaign', ru: 'История борьбы с мошенничеством против пожилых' },
        context: { he: 'שכבת המשך שמרחיבה את הסיפור מעבר לפוסט הראשוני.', en: 'A follow-up layer that expands the story beyond the original post.', ru: 'Продолжение, расширяющее историю за пределы исходного поста.' },
    },
    {
        id: 'israel-dna-2024',
        videoId: '3mG7qVapcII',
        source: 'YouTube',
        year: '2024',
        url: 'https://www.youtube.com/watch?v=3mG7qVapcII',
        title: { he: '7 באוקטובר שינה את ה־DNA הישראלי', en: 'October 7 changed Israel’s DNA', ru: '7 октября изменило ДНК Израиля' },
        context: { he: 'קטע שיחה על השינוי הציבורי והלאומי לאחר 7 באוקטובר.', en: 'A conversation about social and national change after October 7.', ru: 'Разговор об общественных и национальных изменениях после 7 октября.' },
    },
    {
        id: 'flower-desert-2022',
        videoId: 'rQbAXagOZBU',
        source: 'Igor Vepretski',
        year: '2022',
        url: 'https://www.youtube.com/watch?v=rQbAXagOZBU',
        title: { he: 'פרח במדבר', en: 'A flower in the desert', ru: 'Цветок в пустыне' },
        context: { he: 'שכבת היצירה המוזיקלית בתוך אותו סיפור חיים — לא פרויקט נפרד.', en: 'The music-creation layer inside the same life story rather than a separate identity.', ru: 'Музыкальный слой внутри той же жизненной истории, а не отдельная идентичность.' },
    },
    {
        id: 'camp-recovered',
        videoId: 'v2lZeRzHigs',
        source: 'YouTube · owner context',
        year: 'ARCHIVE',
        url: 'https://www.youtube.com/watch?v=v2lZeRzHigs',
        title: { he: 'Camp Henry Horner / Cabin 9 — סרט שנמצא מחדש', en: 'Camp Henry Horner / Cabin 9 — recovered film', ru: 'Camp Henry Horner / Cabin 9 — найденная запись' },
        context: { he: 'שכבת ארכיון מוקדמת שנשמרת עם הקשר בעלים ברור ולא מוצגת כראיה למה שאינה מוכיחה.', en: 'An early archive layer preserved with explicit owner context and no claim beyond what the source can support.', ru: 'Ранний архивный слой с явным контекстом владельца и без утверждений сверх возможностей источника.' },
    },
];

const visualItems: VisualItem[] = [
    {
        id: 'mynet-return-visual',
        source: 'mynet חולון',
        year: '13.05.2022',
        url: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
        image: 'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D1200%2Cq%3D85/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg',
        title: { he: 'חוזר לשכונה', en: 'Returning to the neighborhood', ru: 'Возвращение в район' },
        context: { he: 'צילום העיתונות שמלווה את סיפור החזרה לג׳סי כהן והחזון ל־StartOn.', en: 'The press photograph attached to the return to Jesse Cohen and the StartOn vision.', ru: 'Пресс-фото к истории возвращения в Джесси Коэн и замыслу StartOn.' },
    },
    {
        id: 'fatherhood-visual',
        source: 'הידברות',
        year: '2023',
        url: 'https://www.hidabroot.org/article/1179015',
        image: 'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg',
        title: { he: 'אבא מושלם — זה אבא ששם', en: 'A perfect father is a father who is there', ru: 'Идеальный отец — тот, кто рядом' },
        context: { he: 'התמונה שפורסמה עם הסיפור שהמשיך מהפיד אל כתבה ושיחה ציבורית.', en: 'The published image attached to the story that moved from the feed into an article and wider conversation.', ru: 'Опубликованное изображение к истории, перешедшей из ленты в статью и общественное обсуждение.' },
    },
    {
        id: 'starton-source-visual',
        source: 'StartOn',
        year: '2022',
        url: 'https://starton.org.il/',
        image: 'https://starton.org.il/wp-content/uploads/2022/10/8ce97d_21be9e2c92e343eeb426c535c82efbf3_mv2-1002x1024.jpg',
        title: { he: 'StartOn מתוך המקור הרשמי', en: 'StartOn from the official source', ru: 'StartOn из официального источника' },
        context: { he: 'ויזואל מהמקור הרשמי של המיזם — חלק מהמעבר מסיפור אישי לבנייה עבור צעירים.', en: 'A visual from the initiative’s official source — part of the move from personal story to building for young people.', ru: 'Визуал из официального источника инициативы — часть перехода от личной истории к созданию возможностей для молодежи.' },
    },
];

const copy: Record<Locale, { eyebrow: string; title: string; body: string; featureEyebrow: string; featureTitle: string; featureBody: string; featureArticle: string; featureVideo: string; social: string; video: string; visual: string; source: string; all: string }> = {
    he: {
        eyebrow: 'MORE IGOR · REAL PUBLIC CONTENT · NO PLACEHOLDERS',
        title: 'עוד מהחיים. עוד מהקול. עוד מהמקור.',
        body: 'זהו גל תוכן נוסף מתוך החומרים שכבר תועדו: רילז, TikTok, ראיונות, מוזיקה, StartOn וצילומי מקור. תוכן נטען בהדרגה כדי שהעושר לא יהפוך לעונש ביצועים.',
        featureEyebrow: 'רגע מהחיים · 13.05.2022',
        featureTitle: 'חוזר לשכונה → StartOn',
        featureBody: 'mynet תיעד את החזרה לג׳סי כהן סביב החזון להקים מסגרת חדשה לנוער בסיכון. לצד הכתבה נשמר גם הראיון שמציג את המודל הפיזי של StartOn — חיבור בין טכנולוגיה, קהילה ונוער.',
        featureArticle: 'לכתבת mynet',
        featureVideo: 'הראיון · פותחים יום',
        social: 'רשתות · מוצג כאן',
        video: 'וידאו נוסף · הפעלה במקום',
        visual: 'רגעים חזותיים · מקור אמיתי',
        source: 'למקור',
        all: 'לארכיון המלא',
    },
    en: {
        eyebrow: 'MORE IGOR · REAL PUBLIC CONTENT · NO PLACEHOLDERS',
        title: 'More life. More voice. More source.',
        body: 'Another content wave from already documented material: Reels, TikTok, interviews, music, StartOn and source photography. Content loads progressively so depth does not become a performance penalty.',
        featureEyebrow: 'A life moment · 13.05.2022',
        featureTitle: 'Back to the neighborhood → StartOn',
        featureBody: 'mynet documented the return to Jesse Cohen around the vision for a new framework for youth at risk. Alongside the article, an interview preserves the physical StartOn model — connecting technology, community and young people.',
        featureArticle: 'Read the mynet story',
        featureVideo: 'Interview · Potchim Yom',
        social: 'Social · shown here',
        video: 'More video · play in place',
        visual: 'Visual moments · real source',
        source: 'Open source',
        all: 'Full archive',
    },
    ru: {
        eyebrow: 'БОЛЬШЕ ИГОРЯ · РЕАЛЬНЫЙ ПУБЛИЧНЫЙ КОНТЕНТ',
        title: 'Больше жизни. Больше голоса. Больше источников.',
        body: 'Еще один слой уже задокументированного контента: Reels, TikTok, интервью, музыка, StartOn и исходные фотографии. Материалы загружаются постепенно, чтобы глубина не разрушала производительность.',
        featureEyebrow: 'Момент жизни · 13.05.2022',
        featureTitle: 'Возвращение в район → StartOn',
        featureBody: 'mynet зафиксировал возвращение в Джесси Коэн вокруг идеи создать новую среду для подростков группы риска. Рядом с публикацией сохранено интервью о физической модели StartOn — соединении технологий, сообщества и молодежи.',
        featureArticle: 'Статья mynet',
        featureVideo: 'Интервью · Potchim Yom',
        social: 'Соцсети · прямо здесь',
        video: 'Еще видео · запуск на странице',
        visual: 'Визуальные моменты · реальный источник',
        source: 'Источник',
        all: 'Весь архив',
    },
};

export default function MassiveContentRunway({ mode = 'home', liveItems = [] }: Props) {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const supportedPlatforms = new Set(['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Telegram']);
    const liveSocial: SocialItem[] = liveItems
        .filter(item => supportedPlatforms.has(String(item.platform || '')) && item.url && item.title)
        .slice(0, mode === 'home' ? 48 : 72)
        .map(item => {
            const platform = String(item.platform || 'Instagram') as SocialItem['platform'];
            const tiktokId = item.url.match(/\/video\/(\d+)/)?.[1] || String(item.id || '').replace(/^tiktok-/, '');
            const embed = platform === 'Instagram'
                ? item.url.replace(/\/?$/, '/embed/captioned/')
                : platform === 'TikTok'
                    ? 'https://www.tiktok.com/player/v1/' + encodeURIComponent(tiktokId) + '?autoplay=0&loop=0&music_info=1&description=1'
                    : '';
            return {
                id: 'live-' + (item.id || item.url),
                platform,
                publisher: item.account || '@igor.vepretski',
                date: item.publishedAt ? item.publishedAt.slice(0, 10) : 'LIVE',
                url: item.url,
                embed,
                image: item.thumbnail || undefined,
                title: { he: item.title, en: item.title, ru: item.title },
                context: {
                    he: 'פרסום שנקרא כעת מהמקור החברתי המחובר של ' + platform + '. המקור והמדיה נשארים פתוחים לבדיקה.',
                    en: 'A publication read now from the connected ' + platform + ' source, with the original media and source kept open for inspection.',
                    ru: 'Публикация получена сейчас из подключённого источника ' + platform + '; оригинальная медиа и источник остаются доступными для проверки.',
                },
            };
        });
    const archiveSocial = socialItems;
    const social = liveSocial.length ? liveSocial : archiveSocial;
    const isLive = liveSocial.length > 0;

    return (
        <section className={`massive-runway massive-runway-${mode}`} dir={dir} data-massive-content={mode} aria-labelledby={`massive-runway-title-${mode}`}>
            <div className='public-shell massive-runway-shell'>
                <header className='massive-runway-head'>
                    <div>
                        <small dir='ltr'><Radio />{c.eyebrow} · {isLive ? 'LIVE' : 'ARCHIVE FALLBACK'}</small>
                        <h2 id={`massive-runway-title-${mode}`}>{c.title}</h2>
                    </div>
                    <p>{c.body}</p>
                </header>

                <article className='massive-feature-story' data-feature-story='starton-jesse-cohen-2022'>
                    <a className='massive-feature-image' href={visualItems[0].url} target='_blank' rel='noreferrer'>
                        <img src={visualItems[0].image} alt={visualItems[0].title[locale]} loading='lazy' decoding='async' referrerPolicy='no-referrer' />
                        <span>{visualItems[0].source}</span>
                    </a>
                    <div className='massive-feature-copy'>
                        <small>{c.featureEyebrow}</small>
                        <h3>{c.featureTitle}</h3>
                        <p>{c.featureBody}</p>
                        <div className='massive-feature-actions'>
                            <a href={visualItems[0].url} target='_blank' rel='noreferrer'>{c.featureArticle}<ArrowUpRight /></a>
                            <a href={videoItems[0].url} target='_blank' rel='noreferrer'>{c.featureVideo}<ArrowUpRight /></a>
                        </div>
                        <div className='massive-feature-video'>
                            <LazyYouTube videoId={videoItems[0].videoId} title={videoItems[0].title[locale]} thumbnail={`https://i.ytimg.com/vi/${videoItems[0].videoId}/hqdefault.jpg`} />
                        </div>
                    </div>
                </article>

                <div className='massive-runway-label'><Instagram /><span>{c.social}</span></div>
                <div className='massive-social-grid'>
                    {social.map(item => (
                        <article className='massive-social-card' key={item.id} data-social-embed={item.id} data-render-method={mode === 'home' ? 'native-card' : 'source-embed'}>
                            <header><span>{item.platform} · {item.publisher}</span><time>{item.date}</time></header>
                            {item.image ? <a className='massive-social-thumb' href={item.url} target='_blank' rel='noreferrer'><img src={item.image} alt={item.title[locale]} loading='lazy' decoding='async' referrerPolicy='no-referrer' /></a> : null}
                            <h3>{item.title[locale]}</h3>
                            <p>{item.context[locale]}</p>
                            <small dir='ltr'>{isLive ? 'CONNECTED FEED' : 'ARCHIVE'}</small>
                            {mode === 'media' && item.embed ? (
                                <div className={`massive-social-frame platform-${item.platform.toLowerCase()}`}>
                                    <iframe src={item.embed} title={`${item.platform} · ${item.title[locale]}`} loading='lazy' allow='autoplay; encrypted-media; picture-in-picture; fullscreen' allowFullScreen />
                                </div>
                            ) : null}
                            <a href={item.url} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight /></a>
                        </article>
                    ))}
                </div>

                <div className='massive-runway-label'><Play /><span>{c.video}</span></div>
                <div className='massive-video-grid'>
                    {(mode === 'home' ? videoItems.slice(1) : videoItems).map(item => (
                        <article className='massive-video-card' key={item.id} data-massive-video={item.id}>
                            <div className='massive-video-frame'>
                                <LazyYouTube videoId={item.videoId} title={item.title[locale]} thumbnail={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`} />
                            </div>
                            <div>
                                <small>{item.source} · {item.year}</small>
                                <h3>{item.title[locale]}</h3>
                                <p>{item.context[locale]}</p>
                                <a href={item.url} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight /></a>
                            </div>
                        </article>
                    ))}
                </div>

                <div className='massive-runway-label'><Radio /><span>{c.visual}</span></div>
                <div className='massive-visual-grid'>
                    {visualItems.map(item => (
                        <a className='massive-visual-card' href={item.url} target='_blank' rel='noreferrer' key={item.id} data-source-visual={item.id}>
                            <img src={item.image} alt={item.title[locale]} loading='lazy' decoding='async' referrerPolicy='no-referrer' />
                            <div>
                                <small>{item.source} · {item.year}</small>
                                <h3>{item.title[locale]}</h3>
                                <p>{item.context[locale]}</p>
                                <b>{c.source}<ArrowUpRight /></b>
                            </div>
                        </a>
                    ))}
                </div>

                <a className='massive-runway-all' href={pageHref('library', locale)}>{c.all}<ArrowUpRight /></a>
            </div>
        </section>
    );
}
