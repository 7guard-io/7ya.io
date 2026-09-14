import { useState } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { deepMedia, type DeepMediaItem } from './deep-media-data';
import { pageHref, useLocale, type Locale } from './locale';
import './home-archive-highlights.css';

type MomentCopy = {
    title: string;
    body: string;
};

type SectionCopy = {
    kicker: string;
    title: string;
    intro: string;
    source: string;
    archive: string;
    boundary: string;
    moments: Record<string, MomentCopy>;
};

const ids = [
    'early-2011',
    'mynet-return',
    'starton-14',
    'father-hidabroot',
    'fraud-13',
    'russian-education-legacy',
    'excel-video',
] as const;

const copy: Record<Locale, SectionCopy> = {
    he: {
        kicker: 'PUBLIC MEMORY · 7 DEFINING MOMENTS',
        title: '7 רגעים שמסבירים את איגור.',
        intro: 'לא קורות חיים ולא קיר לינקים. שבע תחנות מהעבר שמחברות אדם, קול, שירות, משפחה, יצירה ופעולה — וכל אחת נשארת מחוברת למקור שלה.',
        source: 'למקור הציבורי',
        archive: 'לכל הארכיון הציבורי',
        boundary: 'מקור ציבורי · תאריך והקשר נשמרים בנפרד',
        moments: {
            'early-2011': {
                title: 'לפני המותג כבר היה סיפור.',
                body: 'הרשומה העיתונאית המוקדמת מציבה את הילדות, ההתמודדות והבחירה להתקדם שנים לפני TikTok, StartOn ו־7YA.',
            },
            'mynet-return': {
                title: 'לחזור למקום שממנו יצאת.',
                body: 'החזרה לג׳סי כהן מחברת בין המקום שממנו התחיל חלק מהסיפור לבין ההחלטה לבנות אפשרות חדשה לצעירים.',
            },
            'starton-14': {
                title: 'משירות לשליחות.',
                body: 'המעבר משירות ציבורי לבניית StartOn מקבל פנים וקול בראיון — לא רק שורת ביוגרפיה.',
            },
            'father-hidabroot': {
                title: 'אבהות שהפכה לשיחה ציבורית.',
                body: 'פוסט אישי על נטישה ונוכחות הורית חצה פלטפורמות וקיבל חיים חדשים בתוך שיחה ציבורית רחבה יותר.',
            },
            'fraud-13': {
                title: 'מהפיד אל האולפן.',
                body: 'סיפור אישי על הונאות קשישים עבר מתוכן ברשת לדיון תקשורתי והמחיש איך תשומת לב יכולה להפוך לאחריות אזרחית.',
            },
            'russian-education-legacy': {
                title: 'הזהות הרוסית הייתה שם מההתחלה.',
                body: 'משפחה, שפה והומור רוסי היו חלק משפת היוצר עוד לפני שהזיכרון הדיגיטלי קיבל שם, ארכיון ומערכת.',
            },
            'excel-video': {
                title: 'המוזיקה היא חלק מהביוגרפיה.',
                body: 'שיתוף הפעולה עם רון נשר מחבר הומור, תרבות וזהות אמן ומבהיר שהיצירה אינה תחביב שמתחבא בפוטר.',
            },
        },
    },
    en: {
        kicker: 'PUBLIC MEMORY · 7 DEFINING MOMENTS',
        title: '7 moments that explain Igor.',
        intro: 'Not a résumé and not a link wall. Seven past moments connect person, voice, service, family, creation and action, each kept attached to its public source.',
        source: 'Open public source',
        archive: 'Open the full public archive',
        boundary: 'Public source · date and context remain separate',
        moments: {
            'early-2011': {
                title: 'The story existed before the brand.',
                body: 'An early press record places childhood, adversity and forward movement years before TikTok, StartOn and 7YA.',
            },
            'mynet-return': {
                title: 'Return to where you came from.',
                body: 'The return to Jesse Cohen connects the place where part of the story began with the decision to build a new opportunity for young people.',
            },
            'starton-14': {
                title: 'From service to mission.',
                body: 'The move from public service into building StartOn receives a face and a voice rather than remaining a résumé line.',
            },
            'father-hidabroot': {
                title: 'Fatherhood became a public conversation.',
                body: 'A personal post about absence and parental presence crossed platforms and continued as a wider public conversation.',
            },
            'fraud-13': {
                title: 'From the feed to the studio.',
                body: 'A personal story about elder fraud moved from social content into media discussion and showed how attention can become civic responsibility.',
            },
            'russian-education-legacy': {
                title: 'Russian identity was there from the start.',
                body: 'Family, language and Russian humour were part of the creator voice before the digital memory had a name, archive or system.',
            },
            'excel-video': {
                title: 'Music belongs in the biography.',
                body: 'The collaboration with Ron Nesher connects humour, culture and artist identity, showing that creation is not a hobby buried in the footer.',
            },
        },
    },
    ru: {
        kicker: 'PUBLIC MEMORY · 7 DEFINING MOMENTS',
        title: '7 моментов, которые объясняют Игоря.',
        intro: 'Не резюме и не стена ссылок. Семь эпизодов прошлого соединяют человека, голос, службу, семью, творчество и действие — каждый со своим публичным источником.',
        source: 'Открыть источник',
        archive: 'Открыть весь публичный архив',
        boundary: 'Публичный источник · дата и контекст разделены',
        moments: {
            'early-2011': {
                title: 'История появилась раньше бренда.',
                body: 'Ранняя публикация фиксирует детство, трудности и движение вперёд задолго до TikTok, StartOn и 7YA.',
            },
            'mynet-return': {
                title: 'Вернуться туда, откуда вышел.',
                body: 'Возвращение в Джесси Коэн соединяет место, где началась часть истории, с решением создать новую возможность для молодёжи.',
            },
            'starton-14': {
                title: 'От службы к миссии.',
                body: 'Переход от общественной службы к созданию StartOn получает лицо и голос, а не остаётся строкой биографии.',
            },
            'father-hidabroot': {
                title: 'Отцовство стало общественным разговором.',
                body: 'Личный пост об отсутствии и родительском присутствии вышел за пределы платформ и продолжился в широкой публичной беседе.',
            },
            'fraud-13': {
                title: 'Из ленты в студию.',
                body: 'Личная история о мошенничестве против пожилых перешла из соцсетей в медиа и показала, как внимание может стать гражданской ответственностью.',
            },
            'russian-education-legacy': {
                title: 'Русская идентичность была с самого начала.',
                body: 'Семья, язык и русский юмор были частью авторского голоса ещё до того, как цифровая память получила имя, архив и систему.',
            },
            'excel-video': {
                title: 'Музыка — часть биографии.',
                body: 'Коллаборация с Роном Нешером соединяет юмор, культуру и музыкальную идентичность и не оставляет творчество в подвале сайта.',
            },
        },
    },
};

const moments = ids
    .map((id) => deepMedia.find((item) => item.id === id))
    .filter((item): item is DeepMediaItem => Boolean(item));

function Moment({ item, index, text, sourceLabel, boundary }: {
    item: DeepMediaItem;
    index: number;
    text: MomentCopy;
    sourceLabel: string;
    boundary: string;
}) {
    const [broken, setBroken] = useState(false);

    return (
        <article className='hah-moment' data-archive-highlight={item.id}>
            <a className='hah-visual' href={item.url} target='_blank' rel='noreferrer' aria-label={`${text.title} · ${sourceLabel}`}>
                {!broken && (
                    <img
                        src={item.image}
                        alt={text.title}
                        loading='lazy'
                        decoding='async'
                        referrerPolicy='no-referrer'
                        onError={() => setBroken(true)}
                    />
                )}
                {broken && (
                    <div className='hah-source-poster' data-source-poster='1'>
                        <small>SOURCE RECORD</small>
                        <strong>{item.source}</strong>
                        <span>{item.year}</span>
                    </div>
                )}
                <span className='hah-index'>{String(index + 1).padStart(2, '0')}</span>
            </a>
            <div className='hah-copy'>
                <div className='hah-meta'>
                    <span>{item.year}</span>
                    <span>{item.source}</span>
                </div>
                <h3>{text.title}</h3>
                <p>{text.body}</p>
                <div className='hah-proof'>
                    <ShieldCheck />
                    <span>{boundary}</span>
                </div>
                <a className='hah-source-link' href={item.url} target='_blank' rel='noreferrer'>
                    {sourceLabel}
                    <ExternalLink />
                </a>
            </div>
        </article>
    );
}

export default function HomeArchiveHighlights() {
    const { locale, dir } = useLocale();
    const c = copy[locale];

    return (
        <section className='home-archive-highlights' id='archive-highlights' dir={dir} aria-labelledby='archive-highlights-title'>
            <div className='public-shell'>
                <header className='hah-head'>
                    <div>
                        <small>{c.kicker}</small>
                        <h2 id='archive-highlights-title'>{c.title}</h2>
                    </div>
                    <p>{c.intro}</p>
                </header>
                <div className='hah-list'>
                    {moments.map((item, index) => (
                        <Moment
                            key={item.id}
                            item={item}
                            index={index}
                            text={c.moments[item.id]}
                            sourceLabel={c.source}
                            boundary={c.boundary}
                        />
                    ))}
                </div>
                <footer className='hah-footer'>
                    <span>2011 → CREATOR ARCHIVE</span>
                    <a href={pageHref('library', locale)}>{c.archive} ↗</a>
                </footer>
            </div>
        </section>
    );
}
