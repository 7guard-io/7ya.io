import {useState} from 'react';
import {ArrowDown, ArrowUpRight, ExternalLink, MessageCircle, Sparkles} from 'lucide-react';
import {appendQuery, pageHref, rootHref, useLocale, type Locale} from '../locale';
import {deepMedia} from '../deep-media-data';
import {albumChapters, coverMedia, type AlbumChapter, type AlbumDepth, type AlbumMedia} from './album-data';
import BroadcastStream from './BroadcastStream';
import PostsMemoryUniverse from './PostsMemoryUniverse';
import './album.css';
import './album-story-traces.css';

const copy = {
    he: {
        coverTitle: 'החיים שלי. לא גרסה מלוטשת שלהם.',
        coverBody: 'להיכנס לכאן אמור להרגיש כמו לפתוח אלבום התבגרות: בן כמה הייתי, איפה הייתי, מי היה איתי, מה קרה, מה נשאר מהזמן ההוא, מה אנשים החזירו אליי — ומה אני מבין היום.',
        enter: 'להיכנס לחיים',
        talk: 'לדבר / לשתף פעולה',
        opening: 'החיים, בזמן שהם קרו.',
        openingBody: 'שמונה פרקים מחברים ילדות, שירות, אבהות, StartOn, קול ציבורי, יצירה, מנהיגות והווה. בכל פרק האדם קודם למערכת והמקור נשאר פתוח למי שרוצה לבדוק.',
        age: 'גיל',
        place: 'מקום',
        people: 'אנשים',
        moment: 'הרגע',
        response: 'מה חזר מהקהל',
        consequence: 'מה קרה אחר כך',
        reflection: 'מה אני מבין היום',
        value: 'מה אני לוקח הלאה',
        source: 'למקור',
        now: 'מה בונים מכאן?',
        closing: 'האלבום הזה לא אמור להסתיים בצפייה.',
        closingBody: 'אם הסיפור נשאר רק נוסטלגיה, הוא לא עשה את העבודה. המטרה היא להפוך זיכרון, ניסיון וקשרים לצעד הבא.',
        talkIntent: 'לדבר / ראיון / הזמנה',
        partnerIntent: 'שותפות / לבנות משהו',
        createIntent: 'ליצור עם 7YA',
        evidenceIntent: 'לראיות / לארכיון',
        fallback: 'אין כאן תמונה מומצאת. כשאין צילום אותנטי מהתקופה, מוצג Source Frame גלוי במקום לזייף זיכרון.',
        researchTitle: 'הניסיון הפך גם לשאלות שאפשר לבדוק.',
        researchBody: 'המחקר הוא שכבת עומק של ההווה: מסמכים, מסגרות וכתיבה עם סטטוס ומגבלות — לא תחליף לסיפור החיים ולא סמכות מומצאת.',
    },
    en: {
        coverTitle: 'My life. Not the polished version of it.',
        coverBody: 'Entering here should feel like opening a coming-of-age album: how old I was, where I was, who was there, what happened, what survived from that moment, what people sent back — and what I understand now.',
        enter: 'Enter the life',
        talk: 'Talk / collaborate',
        opening: 'THE LIFE, WHILE IT WAS HAPPENING',
        openingBody: 'Eight chapters connect childhood, service, fatherhood, StartOn, public voice, creation, leadership and now. In every chapter the person comes before the system, while the source remains open for anyone who wants to inspect it.',
        age: 'AGE',
        place: 'PLACE',
        people: 'PEOPLE',
        moment: 'THE MOMENT',
        response: 'WHAT PEOPLE SENT BACK',
        consequence: 'WHAT HAPPENED NEXT',
        reflection: 'WHAT I UNDERSTAND NOW',
        value: 'WHAT I CARRY FORWARD',
        source: 'Open source',
        now: 'WHAT DO WE BUILD FROM HERE?',
        closing: 'This album should not end with watching.',
        closingBody: 'If the story stays nostalgia, it has not done its job. The point is to turn memory, experience and relationships into the next move.',
        talkIntent: 'Talk / interview / invite',
        partnerIntent: 'Partner / build something',
        createIntent: 'Create with 7YA',
        evidenceIntent: 'Explore evidence / archive',
        fallback: 'No invented image appears here. When authentic period imagery is missing, an explicit Source Frame appears instead of a fake memory.',
        researchTitle: 'Experience also became questions that can be tested.',
        researchBody: 'Research is a depth layer of the present: documents, frameworks and writing with explicit status and limits — not a substitute for the life story and not invented authority.',
    },
    ru: {
        coverTitle: 'Моя жизнь. Не её отполированная версия.',
        coverBody: 'Вход сюда должен ощущаться как открытие альбома взросления: сколько мне было лет, где я был, кто был рядом, что произошло, что сохранилось, что вернулось от людей — и что я понимаю сегодня.',
        enter: 'Войти в жизнь',
        talk: 'Поговорить / сотрудничать',
        opening: 'ЖИЗНЬ, ПОКА ОНА ПРОИСХОДИЛА',
        openingBody: 'Восемь глав соединяют детство, службу, отцовство, StartOn, публичный голос, творчество, лидерство и настоящее. В каждой главе человек идёт раньше системы, а источник остаётся открытым для проверки.',
        age: 'ВОЗРАСТ',
        place: 'МЕСТО',
        people: 'ЛЮДИ',
        moment: 'МОМЕНТ',
        response: 'ЧТО ВЕРНУЛОСЬ ОТ ЛЮДЕЙ',
        consequence: 'ЧТО БЫЛО ДАЛЬШЕ',
        reflection: 'ЧТО Я ПОНИМАЮ СЕГОДНЯ',
        value: 'ЧТО Я НЕСУ ДАЛЬШЕ',
        source: 'Открыть источник',
        now: 'ЧТО МЫ СТРОИМ ДАЛЬШЕ?',
        closing: 'Этот альбом не должен заканчиваться просмотром.',
        closingBody: 'Если история остаётся только ностальгией, она не выполнила свою работу. Смысл — превращать память, опыт и связи в следующий шаг.',
        talkIntent: 'Разговор / интервью / приглашение',
        partnerIntent: 'Партнерство / создать вместе',
        createIntent: 'Создать с 7YA',
        evidenceIntent: 'Доказательства / архив',
        fallback: 'Здесь нет выдуманных фотографий. Если подлинного кадра эпохи нет, показывается явный Source Frame, а не фальшивая память.',
        researchTitle: 'Опыт стал и вопросами, которые можно проверять.',
        researchBody: 'Исследование — слой глубины настоящего: документы, модели и тексты с явным статусом и ограничениями, а не замена истории жизни и не выдуманный авторитет.',
    },
} as const;

const depthHref = (depth: AlbumDepth, locale: Locale) => {
    if (depth === 'media') return pageHref('media', locale);
    if (depth === 'music') return pageHref('music', locale);
    if (depth === 'research') return rootHref('research/?lang=' + locale);
    if (depth === 'starton') return rootHref('starton/');
    if (depth === 'evidence') return rootHref('evidence/');
    if (depth === 'archive') return rootHref('restoration/');
    if (depth === 'leadership') return rootHref('if-igor-were-on-the-list/');
    return pageHref('create', locale);
};

const chapterTraceIds: Record<AlbumChapter['id'], readonly string[]> = {
    origin: ['school-note-reflection-2022', 'childhood-gilat-starton-2023', 'ndi-repatriation-2024', 'mindset-page'],
    service: ['police-exit-2023', 'police-uniform-fatherhood-2024', 'police-public-values-2022', 'police-reel'],
    fatherhood: ['early-fatherhood-reflection', 'father-comments', 'zman-tiktok', 'linkedin-article-children-watch-2022'],
    starton: ['microsoft-startups-first-door-2022', 'starton-six-month-transition-2022', 'starton-day', 'starton-section46-2023', 'starton-team-founders-2022'],
    voice: ['fraud-13', 'fraud-12', 'linkedin-platform-learning-2022', 'linkedin-dna-oct7-2023', 'glass-ceilings-54'],
    create: ['excel-video', 'bizzi-video', 'flower-video', 'supaporp-video', 'russian-education-legacy'],
    leadership: ['politics-entry-2023', 'holon-politics-why-2023', 'holon-candidacy-2023', 'political-video', 'safety-ru'],
    now: ['instagram-story-20260801', 'nawan-external-2026', 'tiktok-engine', 'youtube-channel', 'linkedin-media'],
};

const traceCopy: Record<Locale, {title: string; note: string; open: string}> = {
    he: {title: 'מה נשאר מהזמן הזה ברשת', note: 'לא עוד גלריה. אלה עקבות מקור שמחברות את הפרק למה שפורסם בזמן אמת או נשמר בארכיון הציבורי.', open: 'למקור'},
    en: {title: 'What survived from this time online', note: 'Not another gallery. These are source traces linking the chapter to what was published in real time or preserved in the public archive.', open: 'Open source'},
    ru: {title: 'Что сохранилось от этого времени в сети', note: 'Не ещё одна галерея. Это следы источников, связывающие главу с тем, что публиковалось тогда или сохранилось в публичном архиве.', open: 'Открыть источник'},
};

const resolveTraceImage = (value: string) => value.startsWith('./resources/') ? rootHref(value.slice(2)) : value;

function ChapterStoryTraces({chapter, locale}: {chapter: AlbumChapter; locale: Locale}) {
    const labels = traceCopy[locale];
    const traces = chapterTraceIds[chapter.id]
        .map(id => deepMedia.find(item => item.id === id))
        .filter(item => Boolean(item) && !(item?.url === chapter.sourceUrl && item?.image === chapter.media?.src))
        .slice(0, 5);

    if (!traces.length) return null;

    return (
        <section className='album-story-traces' aria-label={labels.title}>
            <header>
                <small dir='ltr'>MEMORY STRIP · PUBLIC RECORD</small>
                <strong>{labels.title}</strong>
                <p>{labels.note}</p>
            </header>
            <div className='album-story-trace-grid'>
                {traces.map(item => item ? (
                    <a href={item.url} target='_blank' rel='noreferrer' key={item.id} className='album-story-trace'>
                        <figure>
                            <img
                                src={resolveTraceImage(item.image || item.fallback)}
                                alt={item.title}
                                loading='lazy'
                                decoding='async'
                                referrerPolicy='no-referrer'
                                onError={event => {
                                    event.currentTarget.style.display = 'none';
                                    event.currentTarget.parentElement?.setAttribute('data-source-frame', '1');
                                }}
                            />
                            <span>{item.category}</span>
                        </figure>
                        <div>
                            <small>{item.source} · {item.year}</small>
                            <b>{item.title}</b>
                            {item.metric ? <em>{item.metric}</em> : <em>{item.status}</em>}
                            <strong>{labels.open}<ExternalLink /></strong>
                        </div>
                    </a>
                ) : null)}
            </div>
        </section>
    );
}

function MediaFrame({media, chapter, locale, fallback}: {media?: AlbumMedia; chapter: AlbumChapter; locale: Locale; fallback: string}) {
    const [broken, setBroken] = useState(false);
    if (!media || broken) {
        return (
            <div className='album-media-fallback' role='img' aria-label={chapter.title[locale]}>
                <small dir='ltr'>SOURCE FRAME · {chapter.era}</small>
                <strong>{chapter.title[locale]}</strong>
                <p>{fallback}</p>
                <a href={chapter.sourceUrl} target='_blank' rel='noreferrer'>{chapter.sourceLabel[locale]} <ExternalLink /></a>
            </div>
        );
    }
    return (
        <figure className='album-media-frame'>
            <img
                src={media.src}
                alt={media.alt[locale]}
                loading={chapter.id === 'service' ? 'eager' : 'lazy'}
                decoding='async'
                referrerPolicy='no-referrer'
                style={{objectPosition: media.objectPosition || '50% 50%'}}
                onError={() => setBroken(true)}
            />
            <figcaption>
                <span>{media.caption[locale]}</span>
                <a href={media.sourceUrl} target='_blank' rel='noreferrer'>{media.sourceLabel} <ExternalLink /></a>
            </figcaption>
        </figure>
    );
}

function CoverFrame({locale}: {locale: Locale}) {
    const [broken, setBroken] = useState(false);
    if (broken) {
        return (
            <div className='album-cover-fallback'>
                <b>IGOR VEPRETSKI</b>
                <span>{copy[locale].fallback}</span>
                <a href={coverMedia.sourceUrl} target='_blank' rel='noreferrer'>WIKIMEDIA COMMONS ↗</a>
            </div>
        );
    }
    return (
        <figure className='album-cover-frame'>
            <img src={coverMedia.src} alt={coverMedia.alt[locale]} decoding='async' referrerPolicy='no-referrer' style={{objectPosition: coverMedia.objectPosition}} onError={() => setBroken(true)} />
            <figcaption>
                <b>IGOR VEPRETSKI</b>
                <span>{coverMedia.caption[locale]}</span>
                <a href={coverMedia.sourceUrl} target='_blank' rel='noreferrer'>SOURCE ↗</a>
            </figcaption>
        </figure>
    );
}

export default function AlbumHome() {
    const {locale, dir} = useLocale();
    const c = copy[locale];
    const home = pageHref('home', locale);
    const talkHref = appendQuery(home, 'chat=open&journeyChapter=build&journeyChoice=collaborate');
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    const isDeepAlbum = cleanPath.endsWith('/album') || new URLSearchParams(window.location.search).get('page') === 'album';

    return (
        <main className='album-home' dir={dir}>
            <section className='album-cover' id='album-cover'>
                <div className='album-cover-copy'>
                    <p className='album-eyebrow' dir='ltr'>PERSONAL ALBUM / IGOR VEPRETSKI</p>
                    <h1>{c.coverTitle}</h1>
                    <p className='album-cover-body'>{c.coverBody}</p>
                    <div className='album-actions'>
                        <a className='album-action-primary' href='#album-journey'>{c.enter}<ArrowDown /></a>
                        <a className='album-action-secondary' href={talkHref}>{c.talk}<MessageCircle /></a>
                    </div>
                    <small className='album-cover-proof' dir='ltr'>AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION</small>
                </div>
                <CoverFrame locale={locale} />
            </section>

            <section className='album-opening' id='album-journey'>
                <header>
                    <p dir='ltr'>LIFE / WHILE IT HAPPENED</p>
                    <h2>{c.opening}</h2>
                    <p>{c.openingBody}</p>
                </header>
                <div className='album-opening-grid'>
                    {albumChapters.map((chapter, index) => (
                        <a href={'#album-' + chapter.id} key={chapter.id}>
                            <span dir='ltr'>{String(index + 1).padStart(2, '0')} / {chapter.era}</span>
                            <strong>{chapter.kicker[locale]}</strong>
                            <p>{chapter.age[locale]} · {chapter.place[locale]}</p>
                            <ArrowUpRight />
                        </a>
                    ))}
                </div>
            </section>

            <section className='album-chapters' aria-label='Personal album chapters'>
                {albumChapters.map((chapter, index) => (
                    <article className={'album-chapter ' + (index % 2 ? 'is-flipped' : '')} id={'album-' + chapter.id} key={chapter.id}>
                        <div className='album-chapter-media'>
                            <MediaFrame media={chapter.media} chapter={chapter} locale={locale} fallback={c.fallback} />
                        </div>
                        <div className='album-chapter-copy'>
                            <div className='album-chapter-meta'>
                                <span dir='ltr'>{chapter.index} / {chapter.era}</span>
                                <b>{chapter.kicker[locale]}</b>
                            </div>

                            <div className='album-memory-context'>
                                <div><small>{c.age}</small><strong>{chapter.age[locale]}</strong></div>
                                <div><small>{c.place}</small><strong>{chapter.place[locale]}</strong></div>
                                <div><small>{c.people}</small><strong>{chapter.people[locale]}</strong></div>
                            </div>

                            <h2>{chapter.title[locale]}</h2>

                            <section className='album-moment'>
                                <small>{c.moment}</small>
                                <p>{chapter.moment[locale]}</p>
                            </section>

                            <p className='album-story'>{chapter.story[locale]}</p>

                            <ChapterStoryTraces chapter={chapter} locale={locale} />

                            <div className='album-memory-blocks'>
                                <section className='album-memory-block response'>
                                    <small>{c.response}</small>
                                    <p>{chapter.response[locale]}</p>
                                </section>
                                <section className='album-memory-block consequence'>
                                    <small>{c.consequence}</small>
                                    <p>{chapter.consequence[locale]}</p>
                                </section>
                                <section className='album-memory-block reflection'>
                                    <small>{c.reflection}</small>
                                    <p>{chapter.reflection[locale]}</p>
                                </section>
                            </div>

                            <aside className='album-value'>
                                <small>{c.value}</small>
                                <strong>{chapter.capability[locale]}</strong>
                                <p>{chapter.publicValue[locale]}</p>
                            </aside>

                            <nav className='album-chapter-actions'>
                                <a href={chapter.sourceUrl} target='_blank' rel='noreferrer'>{c.source}<ExternalLink /></a>
                                <a href={depthHref(chapter.depth, locale)}>{chapter.depthLabel[locale]}<ArrowUpRight /></a>
                                {chapter.id === 'now' && <a href={talkHref}>{c.talk}<MessageCircle /></a>}
                            </nav>
                        </div>
                    </article>
                ))}
            </section>

            {isDeepAlbum ? (
                <>
                    <PostsMemoryUniverse />
                    <BroadcastStream />
                </>
            ) : (
                <BroadcastStream mode='portal' />
            )}

            <nav className='album-source-strip' aria-label='Primary public surfaces'>
                <a href='https://www.instagram.com/igor.vepretski/' target='_blank' rel='noreferrer'>Instagram<small>@igor.vepretski</small></a>
                <a href='https://www.tiktok.com/@igor.vepretski' target='_blank' rel='noreferrer'>TikTok<small>@igor.vepretski</small></a>
                <a href='https://www.youtube.com/@IgorVepretski' target='_blank' rel='noreferrer'>YouTube<small>@IgorVepretski</small></a>
                <a href='https://www.linkedin.com/in/vepretski/' target='_blank' rel='noreferrer'>LinkedIn<small>/in/vepretski</small></a>
                <a href='https://www.instagram.com/vepretski.igor/' target='_blank' rel='noreferrer'>Instagram II<small>@vepretski.igor</small></a>
                <a href='https://www.facebook.com/vepretski7' target='_blank' rel='noreferrer'>Facebook<small>/vepretski7</small></a>
                <a href='https://x.com/igorvepretski' target='_blank' rel='noreferrer'>X<small>@igorvepretski</small></a>
                <a href='https://www.threads.net/@igor.vepretski' target='_blank' rel='noreferrer'>Threads<small>@igor.vepretski</small></a>
                <a href='https://t.me/vepretski' target='_blank' rel='noreferrer'>Telegram<small>@vepretski</small></a>
                <a href={pageHref('music', locale)}>Music<small>catalogue</small></a>
                <a href={rootHref('starton/')}>StartOn<small>mission</small></a>
                <a href={pageHref('media', locale)}>Media<small>press / interviews</small></a>
                <a href={rootHref('evidence/')}>Evidence<small>sources / archive</small></a>
            </nav>

            <section className='album-research-bridge' id='album-research'>
                <div>
                    <p dir='ltr'>IDEAS / RESEARCH / BUILD</p>
                    <h2>{c.researchTitle}</h2>
                </div>
                <p>{c.researchBody}</p>
                <a href={rootHref('research/?lang=' + locale)}>{locale === 'he' ? 'למפת המחקר' : locale === 'ru' ? 'К карте исследований' : 'Open research map'}<ArrowUpRight /></a>
            </section>

            <section className='album-closing' id='album-closing'>
                <div className='album-closing-copy'>
                    <p dir='ltr'>{c.now}</p>
                    <h2>{c.closing}</h2>
                    <p>{c.closingBody}</p>
                </div>
                <div className='album-intents'>
                    <a href={talkHref}><span>01</span><strong>{c.talkIntent}</strong><MessageCircle /></a>
                    <a href={rootHref('contact/')}><span>02</span><strong>{c.partnerIntent}</strong><ArrowUpRight /></a>
                    <a href={pageHref('create', locale)}><span>03</span><strong>{c.createIntent}</strong><Sparkles /></a>
                    <a href={rootHref('evidence/')}><span>04</span><strong>{c.evidenceIntent}</strong><ArrowUpRight /></a>
                </div>
                <footer><b dir='ltr'>#7YA🥷</b><span>IGOR VEPRETSKI · LIFE → MEMORY → PEOPLE → CONSEQUENCE → NEXT MOVE</span></footer>
            </section>
        </main>
    );
}
