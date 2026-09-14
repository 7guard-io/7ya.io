import { ArrowUpRight } from 'lucide-react';
import { pageHref, rootHref, useLocale, type Locale } from './locale';
import './life-macro-journey.css';

type Chapter = {
    id: string;
    years: string;
    kicker: string;
    title: string;
    body: string;
    image: string;
    route: 'bio' | 'media' | 'music' | 'starton' | 'research' | 'library';
    source?: string;
    sourceLabel: string;
};

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; direction: string; chapters: Chapter[] }> = {
    he: {
        eyebrow: 'THE MACRO JOURNEY · 7 CHAPTERS · ONE LIFE',
        title: 'שבעה פרקים. מסע אחד.',
        intro: 'לא אוסף פרויקטים ולא עוד פיד. זה הציר שמחבר בין המקום שממנו באתי, השירות, האבהות, StartOn, הקול הציבורי, המוזיקה והמערכת שאני בונה עכשיו.',
        direction: 'הכיוון: להפוך ניסיון, מדיה וראיות לתשתית שמאפשרת לאחרים לפעול.',
        chapters: [
            { id: 'origin', years: '1990–2011', kicker: '01 · ORIGIN', title: 'חרקוב → ישראל → ג׳סי כהן', body: 'ילדות, עלייה, שכונה והמסלול שהפך בהמשך לחומר גלם של עשייה ציבורית.', image: 'resources/hero-story.webp', route: 'bio', sourceLabel: 'לסיפור והארכיון' },
            { id: 'service', years: '2015–2021', kicker: '02 · SERVICE', title: 'שירות, משטרה ואחריות', body: 'שנים של עבודה בתוך מערכות ציבוריות, מצבי קצה והיכרות בלתי אמצעית עם ביטחון, חברה ואחריות.', image: 'resources/igor-hero.jpg', route: 'bio', source: 'https://www.linkedin.com/feed/update/urn%3Ali%3Aactivity%3A7001305382035812352/', sourceLabel: 'לפוסט הציבורי' },
            { id: 'fatherhood', years: '2018→', kicker: '03 · FATHERHOOD', title: 'אבהות כנוכחות', body: 'הסיפור האישי נהיה קול ציבורי: משפחה, אחריות, נוכחות והבחירה לא לשחזר את מה שחסר בילדות.', image: 'resources/drive-life-photo.jpg', route: 'media', source: 'https://www.hidabroot.org/article/1179015', sourceLabel: 'לסיקור הציבורי' },
            { id: 'starton', years: '2022→', kicker: '04 · STARTON', title: 'לחזור לשכונה ולבנות', body: 'החזרה לג׳סי כהן הופכת לחזון מעשי: טכנולוגיה, שייכות והזדמנות לצעירים שלא תמיד מקבלים נקודת פתיחה שווה.', image: 'resources/chapter-starton.webp', route: 'starton', source: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq', sourceLabel: 'לכתבת המקור' },
            { id: 'voice', years: '2022→', kicker: '05 · PUBLIC VOICE', title: 'מהשטח למסך ולשיחה הציבורית', body: 'ראיונות, כתיבה, וידאו ותוכן הופכים ניסיון אישי וציבורי לשיחה רחבה יותר — עם מקורות שאפשר לפתוח ולבדוק.', image: 'resources/chapter-voice.webp', route: 'media', sourceLabel: 'למדיה ולראיונות' },
            { id: 'music', years: '2024→', kicker: '06 · MUSIC', title: 'מוזיקה היא עוד שפה של הזהות', body: 'היפ־הופ, קליפים ושיתופי פעולה אינם פרויקט צד. הם שכבה נוספת של קול, הומור, תרבות והופעה.', image: 'resources/chapter-music.webp', route: 'music', source: 'https://www.youtube.com/watch?v=jRjZjpqAgEw', sourceLabel: 'לצפייה ב־BIZZI' },
            { id: 'system', years: '2026→', kicker: '07 · 7YA / FUTURE', title: 'מרשומה ציבורית למערכת חיה', body: '7YA מחבר את הסיפור, המדיה, המקורות, המחקר והעשייה למערכת אחת — לא כדי להסתכל אחורה, אלא כדי לבנות את הצעד הבא.', image: 'resources/7ya-launch.webp', route: 'research', sourceLabel: 'למחקר ולמערכת' },
        ],
    },
    en: {
        eyebrow: 'THE MACRO JOURNEY · 7 CHAPTERS · ONE LIFE',
        title: 'Seven chapters. One journey.',
        intro: 'Not a stack of projects and not another feed. This is the arc connecting where I came from, service, fatherhood, StartOn, public voice, music and the system I am building now.',
        direction: 'Direction: turn experience, media and evidence into infrastructure that helps other people act.',
        chapters: [
            { id: 'origin', years: '1990–2011', kicker: '01 · ORIGIN', title: 'Kharkiv → Israel → Jesse Cohen', body: 'Childhood, immigration and neighborhood life became the raw material for later public work.', image: 'resources/hero-story.webp', route: 'bio', sourceLabel: 'Story and archive' },
            { id: 'service', years: '2015–2021', kicker: '02 · SERVICE', title: 'Service, police and responsibility', body: 'Years inside public systems, high-pressure situations and direct exposure to security, society and responsibility.', image: 'resources/igor-hero.jpg', route: 'bio', source: 'https://www.linkedin.com/feed/update/urn%3Ali%3Aactivity%3A7001305382035812352/', sourceLabel: 'Public post' },
            { id: 'fatherhood', years: '2018→', kicker: '03 · FATHERHOOD', title: 'Fatherhood as presence', body: 'A personal story becomes a public voice about family, responsibility, presence and choosing not to repeat what was missing.', image: 'resources/drive-life-photo.jpg', route: 'media', source: 'https://www.hidabroot.org/article/1179015', sourceLabel: 'Public coverage' },
            { id: 'starton', years: '2022→', kicker: '04 · STARTON', title: 'Return to the neighborhood and build', body: 'Returning to Jesse Cohen becomes a practical vision around technology, belonging and opportunity for young people.', image: 'resources/chapter-starton.webp', route: 'starton', source: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq', sourceLabel: 'Original report' },
            { id: 'voice', years: '2022→', kicker: '05 · PUBLIC VOICE', title: 'From field experience to public conversation', body: 'Interviews, writing, video and social content turn lived experience into a wider conversation with sources that remain inspectable.', image: 'resources/chapter-voice.webp', route: 'media', sourceLabel: 'Media and interviews' },
            { id: 'music', years: '2024→', kicker: '06 · MUSIC', title: 'Music is another language of identity', body: 'Hip-hop, videos and collaborations are not a side project. They are another layer of voice, humour, culture and performance.', image: 'resources/chapter-music.webp', route: 'music', source: 'https://www.youtube.com/watch?v=jRjZjpqAgEw', sourceLabel: 'Watch BIZZI' },
            { id: 'system', years: '2026→', kicker: '07 · 7YA / FUTURE', title: 'From public record to living system', body: '7YA connects story, media, sources, research and action into one system — not to look backward, but to build the next move.', image: 'resources/7ya-launch.webp', route: 'research', sourceLabel: 'Research and system' },
        ],
    },
    ru: {
        eyebrow: 'THE MACRO JOURNEY · 7 CHAPTERS · ONE LIFE',
        title: 'Семь глав. Один путь.',
        intro: 'Не набор проектов и не очередная лента. Это дуга, соединяющая происхождение, службу, отцовство, StartOn, публичный голос, музыку и систему, которую я строю сейчас.',
        direction: 'Направление: превращать опыт, медиа и доказательства в инфраструктуру, которая помогает действовать другим.',
        chapters: [
            { id: 'origin', years: '1990–2011', kicker: '01 · ORIGIN', title: 'Харьков → Израиль → Джесси Коэн', body: 'Детство, репатриация и район стали материалом, из которого позже выросла общественная работа.', image: 'resources/hero-story.webp', route: 'bio', sourceLabel: 'История и архив' },
            { id: 'service', years: '2015–2021', kicker: '02 · SERVICE', title: 'Служба, полиция и ответственность', body: 'Годы внутри общественных систем, ситуации высокого риска и непосредственный опыт безопасности и ответственности.', image: 'resources/igor-hero.jpg', route: 'bio', source: 'https://www.linkedin.com/feed/update/urn%3Ali%3Aactivity%3A7001305382035812352/', sourceLabel: 'Публичный пост' },
            { id: 'fatherhood', years: '2018→', kicker: '03 · FATHERHOOD', title: 'Отцовство как присутствие', body: 'Личная история становится публичным голосом о семье, ответственности и выборе не повторять то, чего не хватало в детстве.', image: 'resources/drive-life-photo.jpg', route: 'media', source: 'https://www.hidabroot.org/article/1179015', sourceLabel: 'Публичный материал' },
            { id: 'starton', years: '2022→', kicker: '04 · STARTON', title: 'Вернуться в район и строить', body: 'Возвращение в Джесси Коэн превращается в практическое видение технологий, принадлежности и возможностей для молодёжи.', image: 'resources/chapter-starton.webp', route: 'starton', source: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq', sourceLabel: 'Исходная публикация' },
            { id: 'voice', years: '2022→', kicker: '05 · PUBLIC VOICE', title: 'От опыта к общественному разговору', body: 'Интервью, тексты, видео и соцсети переводят личный опыт в более широкий разговор с открытыми источниками.', image: 'resources/chapter-voice.webp', route: 'media', sourceLabel: 'Медиа и интервью' },
            { id: 'music', years: '2024→', kicker: '06 · MUSIC', title: 'Музыка — ещё один язык идентичности', body: 'Хип-хоп, клипы и коллаборации — не побочный проект, а ещё один слой голоса, юмора, культуры и сцены.', image: 'resources/chapter-music.webp', route: 'music', source: 'https://www.youtube.com/watch?v=jRjZjpqAgEw', sourceLabel: 'Смотреть BIZZI' },
            { id: 'system', years: '2026→', kicker: '07 · 7YA / FUTURE', title: 'От публичного архива к живой системе', body: '7YA соединяет историю, медиа, источники, исследование и действие в одну систему — не ради прошлого, а ради следующего шага.', image: 'resources/7ya-launch.webp', route: 'research', sourceLabel: 'Исследование и система' },
        ],
    },
};

function chapterHref(route: Chapter['route'], locale: Locale) {
    if (route === 'bio') return rootHref('igor-vepretski/');
    return pageHref(route, locale);
}

export default function LifeMacroJourney() {
    const { locale, dir } = useLocale();
    const c = copy[locale];

    return (
        <section className='life-macro-journey' data-macro-journey='home' dir={dir} aria-labelledby='life-macro-title'>
            <div className='life-macro-shell'>
                <header className='life-macro-head'>
                    <div>
                        <small>{c.eyebrow}</small>
                        <h2 id='life-macro-title'>{c.title}</h2>
                    </div>
                    <p>{c.intro}</p>
                </header>
                <div className='life-macro-grid'>
                    {c.chapters.map((chapter, index) => (
                        <article className={'life-macro-card chapter-' + chapter.id} key={chapter.id} data-macro-chapter={chapter.id}>
                            <a className='life-macro-image' href={chapterHref(chapter.route, locale)}>
                                <img src={rootHref(chapter.image)} alt={chapter.title} loading={index < 2 ? 'eager' : 'lazy'} decoding='async'/>
                                <span>{chapter.years}</span>
                            </a>
                            <div className='life-macro-copy'>
                                <small>{chapter.kicker}</small>
                                <h3>{chapter.title}</h3>
                                <p>{chapter.body}</p>
                                <div className='life-macro-actions'>
                                    <a href={chapterHref(chapter.route, locale)}>{chapter.sourceLabel}<ArrowUpRight/></a>
                                    {chapter.source && <a href={chapter.source} target='_blank' rel='noreferrer'>SOURCE ↗</a>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <footer className='life-macro-direction'>
                    <span>NOW → NEXT</span>
                    <strong>{c.direction}</strong>
                </footer>
            </div>
        </section>
    );
}
