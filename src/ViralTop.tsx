import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import LazyYouTube from './LazyYouTube';
import { pageHref, useLocale, type Locale } from './locale';
import './viral-top.css';

type Local = Record<Locale, string>;
type RankedItem = {
    id: string;
    platform: string;
    source: string;
    title: Local;
    display: string;
    date: string;
    ownership: Local;
    verification: string;
    url: string;
    videoId?: string;
    embed?: 'facebook' | 'instagram';
};

const ranked: RankedItem[] = [
    { id: 'nawan-513m', platform: 'YouTube Shorts', source: 'Nawan1', title: { he: 'הרגע שעבר חמישה מיליון', en: 'The moment that passed five million', ru: 'Момент, который перешёл пять миллионов' }, display: '5.13M', date: '17.08.2026', ownership: { he: 'הופעה אצל יוצר חיצוני · המדד שייך ל־upload של Nawan', en: 'Appearance on an external creator upload · metric belongs to Nawan', ru: 'Появление у внешнего автора · метрика принадлежит загрузке Nawan' }, verification: 'EXTERNAL CREATOR SOURCE · VERIFIED SNAPSHOT', url: 'https://www.youtube.com/shorts/k9haTADKG3M', videoId: 'k9haTADKG3M' },
    { id: 'russian-education-750k', platform: 'YouTube', source: 'Igor Vepretski', title: { he: 'חינוך רוסי. אחד השורשים הוויראליים שלי.', en: 'Russian education. One of my viral roots.', ru: 'Русское воспитание. Один из моих вирусных корней.' }, display: '750K', date: 'CREATOR ARCHIVE', ownership: { he: 'וידאו ציבורי בבעלות · legacy', en: 'Owned public video · legacy', ru: 'Собственное публичное видео · legacy' }, verification: 'SOURCE-LOCAL COUNTER · VERIFIED', url: 'https://www.youtube.com/watch?v=5qxA4hgUhV8', videoId: '5qxA4hgUhV8' },
    { id: 'excel-129k', platform: 'YouTube', source: 'Ron Nesher × Igor Vepretski', title: { he: 'מת על אקסל', en: 'Crazy about Excel', ru: 'Без ума от Excel' }, display: '129.4K', date: '2020 · SNAPSHOT 19.08.2026', ownership: { he: 'שיתוף יצירה', en: 'Co-creation', ru: 'Совместная работа' }, verification: 'VERIFIED CURRENT PUBLIC', url: 'https://www.youtube.com/watch?v=2HGMUN2jDwQ', videoId: '2HGMUN2jDwQ' },
    { id: 'facebook-43k', platform: 'Facebook', source: 'Legacy public video', title: { he: '#7YA / 2LONGATDE', en: '#7YA / 2LONGATDE', ru: '#7YA / 2LONGATDE' }, display: '43K', date: 'SNAPSHOT 20.08.2026', ownership: { he: 'וידאו Facebook מארכיון legacy', en: 'Legacy Facebook archive video', ru: 'Видео из legacy-архива Facebook' }, verification: 'PUBLIC INDEX COUNTER', url: 'https://www.facebook.com/igor7vepretski/videos/1069464309366360/', embed: 'facebook' },
    { id: 'russian-father-31k', platform: 'YouTube Shorts', source: 'Igor Vepretski', title: { he: 'אבא רוסי', en: 'Russian father', ru: 'Русский папа' }, display: '31K', date: 'CREATOR ARCHIVE', ownership: { he: 'Short ציבורי בבעלות · legacy', en: 'Owned public Short · legacy', ru: 'Собственный публичный Short · legacy' }, verification: 'SOURCE-LOCAL COUNTER', url: 'https://www.youtube.com/shorts/xQBFuu5qE6E', videoId: 'xQBFuu5qE6E' },
    { id: 'pose-24k', platform: 'YouTube', source: 'Igor Vepretski', title: { he: 'הפוזה לא משתלמת 😂💸', en: 'The pose does not pay 😂💸', ru: 'Поза не окупается 😂💸' }, display: '24K', date: '≈2022 PUBLIC INDEX', ownership: { he: 'וידאו ציבורי בבעלות', en: 'Owned public video', ru: 'Собственное публичное видео' }, verification: 'ROUNDED COUNTER FOUND', url: 'https://www.youtube.com/watch?v=0O3tpLwJg4Y', videoId: '0O3tpLwJg4Y' },
    { id: 'bizzi-19k', platform: 'YouTube', source: 'NAWAN ft. VEPRETSKI', title: { he: 'BIZZI', en: 'BIZZI', ru: 'BIZZI' }, display: '19.9K', date: '2025', ownership: { he: 'קליפ רשמי · שיתוף יצירה', en: 'Official video · co-creation', ru: 'Официальный клип · совместная работа' }, verification: 'SOURCE-LOCAL COUNTER', url: 'https://www.youtube.com/watch?v=jRjZjpqAgEw', videoId: 'jRjZjpqAgEw' },
    { id: 'facebook-party-14k', platform: 'Facebook', source: 'ישראל ביתנו', title: { he: 'איפה הניצחון המוחלט?', en: 'Where is the total victory?', ru: 'Где абсолютная победа?' }, display: '≈14K', date: '29.01.2026', ownership: { he: 'הפצה חיצונית בעמוד מפלגתי', en: 'External distribution on a party page', ru: 'Внешнее распространение на партийной странице' }, verification: 'PUBLIC INDEX SNAPSHOT', url: 'https://www.facebook.com/beytenu/videos/26702411802682636/', embed: 'facebook' },
    { id: 'prank-14k', platform: 'YouTube', source: 'Igor Vepretski', title: { he: 'פיצוץ של מתיחה!', en: 'An explosive prank!', ru: 'Взрывной розыгрыш!' }, display: '14K', date: '≈2022 PUBLIC INDEX', ownership: { he: 'וידאו ציבורי בבעלות', en: 'Owned public video', ru: 'Собственное публичное видео' }, verification: 'MIXED ROUNDED COUNTER FOUND', url: 'https://www.youtube.com/watch?v=OlRQXxjvTfA', videoId: 'OlRQXxjvTfA' },
    { id: 'ido-9k', platform: 'YouTube', source: 'Igor Vepretski', title: { he: 'אני עידו', en: 'I Am Ido', ru: 'Я — Идо' }, display: '9.3K', date: 'SNAPSHOT 19.08.2026', ownership: { he: 'וידאו ציבורי בבעלות', en: 'Owned public video', ru: 'Собственное публичное видео' }, verification: 'VERIFIED CURRENT PUBLIC', url: 'https://www.youtube.com/watch?v=R58T4DQu33w', videoId: 'R58T4DQu33w' },
    { id: 'instagram-story-5k', platform: 'Instagram', source: '@vepretski.igor', title: { he: 'שלום שבת | #7YA — הסיפור מתחיל', en: 'Shabbat Shalom | #7YA — the story begins', ru: 'Шаббат шалом | #7YA — история начинается' }, display: '5K', date: '31.07.2026', ownership: { he: 'Reel בבעלות · owner insights', en: 'Owned Reel · owner insights', ru: 'Собственный Reel · owner insights' }, verification: 'OWNER INSIGHTS · CANONICAL REEL', url: 'https://www.instagram.com/reel/DbDfpb6orUt/', embed: 'instagram' },
];

const windows = [
    { platform: 'Instagram', value: '5.68M', label: { he: 'חלון אנליטיקה חודשי — לא פוסט יחיד', en: 'Monthly analytics window — not one post', ru: 'Месячное окно аналитики — не один пост' } as Local, url: 'https://www.instagram.com/p/DbnS2FdjL4o/?img_index=4' },
    { platform: 'TikTok / LinkedIn', value: '3.877M', label: { he: 'חלון ביצועים של 14 יום — לא פוסט יחיד', en: '14-day performance window — not one post', ru: '14-дневное окно — не один пост' } as Local, url: 'https://www.linkedin.com/posts/vepretski_tiktokmarketing-digitalinfluence-personalbranding-activity-7316474020063760384-0aAl' },
    { platform: 'TikTok 2024', value: '3.8M', label: { he: 'סיכום תקופה שפורסם — לא פוסט יחיד', en: 'Published period recap — not one post', ru: 'Опубликованный отчёт за период — не один пост' } as Local, url: 'https://www.linkedin.com/posts/vepretski_%D7%98%D7%99%D7%A7%D7%98%D7%95%D7%A7-%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%91%D7%99%D7%AA%D7%A0%D7%95-%D7%AA%D7%95%D7%9B%D7%9F%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-activity-7281298986928328705-ELZL' },
];

const recovered = [
    { value: '213K', title: { he: 'Reel מתועד — עדיין מחבר את צילום המדד לכתובת המדויקת', en: 'Documented Reel — exact metric-to-post binding is still pending', ru: 'Зафиксированный Reel — точная привязка метрики к посту ещё не завершена' } as Local, url: 'https://www.instagram.com/igor.vepretski/' },
    { value: 'LEGACY', title: { he: 'TikTok ישן שנשמר בתוך טור זמן ישראל', en: 'Old TikTok preserved inside a Zman Israel column', ru: 'Старый TikTok сохранён в колонке Zman Israel' } as Local, url: 'https://www.tiktok.com/@igor_vepretski/video/7128498401364282625' },
    { value: 'MIRROR', title: { he: 'וידאו מהחשבון הישן שנשמר במראה חיצונית', en: 'Old-account video preserved by an external mirror', ru: 'Видео старого аккаунта сохранено внешним зеркалом' } as Local, url: 'https://viralvideos.xoox.co.il/Video%2C4830' },
];

const copy = {
    he: { eyebrow: 'VIRAL MOMENTS · SOURCE-LINKED', title: 'הרגעים שלא נשארו בפיד.', intro: 'לא לוח נתונים. אלה הפרסומים עצמם — הווידאו, הרגע והמספר שנמדד ליד המקור שלו.', views: 'צפיות', source: 'למקור', archive: 'לכל הרגעים והארכיון', windows: 'מדדי תקופה שנשמרים בנפרד', recovered: 'עוד עקבות בדרך חזרה לפריט המדויק' },
    en: { eyebrow: 'VIRAL MOMENTS · SOURCE-LINKED', title: 'The moments that did not stay in the feed.', intro: 'Not a dashboard. These are the publications themselves — the video, the moment and the source-bound number.', views: 'views', source: 'Open source', archive: 'All moments and archive', windows: 'Period metrics kept separate', recovered: 'More traces being bound back to exact items' },
    ru: { eyebrow: 'VIRAL MOMENTS · SOURCE-LINKED', title: 'Моменты, которые не остались в ленте.', intro: 'Не дашборд. Здесь сами публикации — видео, момент и цифра, привязанная к источнику.', views: 'просмотров', source: 'Источник', archive: 'Все моменты и архив', windows: 'Метрики периода — отдельно', recovered: 'Ещё следы, которые возвращаются к точным публикациям' },
} as const;

function mediaSurface(item: RankedItem, title: string, eager: boolean) {
    if (item.videoId) {
        return <LazyYouTube videoId={item.videoId} title={title} thumbnail={'https://i.ytimg.com/vi/' + item.videoId + '/hqdefault.jpg'} eager={eager} />;
    }
    if (item.embed === 'facebook') {
        return <iframe loading='lazy' title={title} src={'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(item.url) + '&show_text=false&width=1200'} allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share' allowFullScreen />;
    }
    if (item.embed === 'instagram') {
        return <iframe loading='lazy' title={title} src={item.url.replace(/\?.*$/, '').replace(/\/$/, '') + '/embed/captioned/'} allow='autoplay; encrypted-media; picture-in-picture' />;
    }
    return null;
}

export default function ViralTop({ mode = 'home' }: { mode?: 'home' | 'media' }) {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const visible = mode === 'home' ? ranked.slice(0, 3) : ranked;

    return (
        <section className={'viral-top viral-top-' + mode} dir={dir} data-viral-top={mode} aria-labelledby={'viral-top-title-' + mode}>
            <div className='viral-top-shell'>
                <header className='viral-top-head'>
                    <small dir='ltr'>{c.eyebrow}</small>
                    <h2 id={'viral-top-title-' + mode}>{c.title}</h2>
                    <p>{c.intro}</p>
                </header>

                <div className='viral-story-stack'>
                    {visible.map((item, index) => (
                        <article className={'viral-story ' + (index === 0 ? 'viral-story-lead ' : '') + (index % 2 ? 'viral-story-reverse' : '')} key={item.id} data-viral-rank={index + 1} data-viral-story={item.id}>
                            <figure className='viral-story-media'>
                                {mediaSurface(item, item.title[locale], index === 0)}
                                <div className='viral-story-metric' aria-label={item.display + ' ' + c.views}>
                                    <strong dir='ltr'>{item.display}</strong>
                                    <span>{c.views}</span>
                                </div>
                            </figure>
                            <div className='viral-story-copy'>
                                <div className='viral-story-index' dir='ltr'>{String(index + 1).padStart(2, '0')}</div>
                                <small>{item.platform} · {item.source}</small>
                                <h3>{item.title[locale]}</h3>
                                <p>{item.ownership[locale]}</p>
                                <div className='viral-story-proof'><ShieldCheck /><span>{item.verification} · {item.date}</span></div>
                                <a href={item.url} target='_blank' rel='noreferrer'>{c.source}<ArrowUpRight /></a>
                            </div>
                        </article>
                    ))}
                </div>

                {mode === 'home' ? (
                    <a className='viral-top-all' href={pageHref('media', locale)}>{c.archive}<ArrowUpRight /></a>
                ) : (
                    <>
                        <section className='viral-evidence-note' aria-label={c.windows}>
                            <h3>{c.windows}</h3>
                            <div>{windows.map(item => <a href={item.url} target='_blank' rel='noreferrer' key={item.platform + item.value}><strong dir='ltr'>{item.value}</strong><span>{item.platform} · {item.label[locale]}</span><ArrowUpRight /></a>)}</div>
                        </section>
                        <section className='viral-evidence-note viral-recovered' aria-label={c.recovered}>
                            <h3>{c.recovered}</h3>
                            <div>{recovered.map(item => <a href={item.url} target='_blank' rel='noreferrer' key={item.value}><strong dir='ltr'>{item.value}</strong><span>{item.title[locale]}</span><ArrowUpRight /></a>)}</div>
                        </section>
                    </>
                )}
            </div>
        </section>
    );
}
