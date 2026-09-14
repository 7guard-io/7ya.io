import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import IgorHeroMosaic from './IgorHeroMosaic';
import LifeThroughline, { JOURNEY_CHAPTER_IDS, JOURNEY_STORAGE_KEY, type JourneyChapterId } from './LifeThroughline';
import LiveSocial from './LiveSocial';
import { pageHref, rootHref, useLocale, type Locale } from './locale';
import './master-experience.css';

type MasterCopy = {
    kicker: string;
    title: string;
    statement: string;
    intro: string;
    start: string;
    continue: string;
    now: string;
    proof: string;
    nowKicker: string;
    nowTitle: string;
    nowIntro: string;
    nowCards: Array<{ title: string; body: string; cta: string; href: 'starton' | 'research' | 'leadership' }>;
    liveKicker: string;
    liveTitle: string;
    askKicker: string;
    askTitle: string;
    askBody: string;
    askCta: string;
    trust: string;
    deep: string;
};

const copy: Record<Locale, MasterCopy> = {
    he: {
        kicker: '#7YA🥷 · IGOR VEPRETSKI · 1990 → NOW',
        title: 'איגור ופרצקי.',
        statement: 'לא תיק עבודות. מסע חיים שהפך לעשייה.',
        intro: 'מחרקוב וג׳סי כהן, דרך שירות, ביטחון ומשטרה, אל StartOn, יצירה, מדיה ו־7YA. כאן לא צריך לבחור בין הסיפור לבין ההוכחות — עוברים במסע, פוגשים את המדיה המקורית ופותחים את המקור כשצריך.',
        start: 'התחל את המסע',
        continue: 'המשך את המסע',
        now: 'מה אני בונה עכשיו',
        proof: '7 פרקים · מדיה מקורית · מקורות פתוחים · מסלול שנשמר בדפדפן שלך בלבד',
        nowKicker: 'NOW · 2026 →',
        nowTitle: 'כל מה שהיה צריך להוביל למשהו.',
        nowIntro: 'הפרק הנוכחי הוא לא סיכום. הוא ניסיון להפוך ניסיון חיים, שירות, יצירה ורשת ציבורית למערכות שנותנות לאחרים גישה, קול והזדמנות.',
        nowCards: [
            { title: 'StartOn', body: 'נוער, טכנולוגיה, יצירה ושייכות — החזרה לג׳סי כהן הופכת לתשתית הזדמנות לצעירים.', cta: 'למשימה החברתית', href: 'starton' },
            { title: '7YA', body: 'חיים, מקורות, מדיה ומחקר מתחברים לזיכרון ציבורי שאפשר לפתוח, לבדוק ולהמשיך ממנו.', cta: 'למחקר ולמערכת', href: 'research' },
            { title: 'מנהיגות ציבורית', body: 'לא רק עמדה. ניסוי פתוח בשאלה מה הייתי עושה אחרת, איך מודדים תוצאה ואיך הופכים אחריות לפעולה.', cta: 'למעבדת המנהיגות', href: 'leadership' },
        ],
        liveKicker: 'LIVE PUBLIC SIGNAL',
        liveTitle: 'המסע לא נעצר בארכיון.',
        askKicker: 'AI · PUBLIC SOURCES',
        askTitle: 'רוצה להבין את החיבור?',
        askBody: 'שאלו על פרק בחיים, StartOn, ראיון, יצירה או מקור. זה כלי AI שמבוסס על הקורפוס הציבורי — לא איגור עצמו, והוא לא אמור להמציא עמדה בשמו.',
        askCta: 'שאלו את איגור',
        trust: 'עובדה → מקור · חוסר ודאות → נאמר במפורש · Discovery אינו הופך לקאנון',
        deep: 'להעמיק',
    },
    en: {
        kicker: '#7YA🥷 · IGOR VEPRETSKI · 1990 → NOW',
        title: 'Igor Vepretski.',
        statement: 'Not a portfolio. A life journey turned into work.',
        intro: 'From Kharkiv and Jesse Cohen through service, security and policing to StartOn, creation, media and 7YA. The story and the proof stay together: move through the journey, meet the original media and open the source when you need it.',
        start: 'Start the journey',
        continue: 'Continue the journey',
        now: 'What I am building now',
        proof: '7 chapters · original media · open sources · progress stored only in your browser',
        nowKicker: 'NOW · 2026 →',
        nowTitle: 'Everything before this had to lead somewhere.',
        nowIntro: 'The current chapter is not a summary. It is an attempt to turn lived experience, service, creation and a public network into systems that give other people access, voice and opportunity.',
        nowCards: [
            { title: 'StartOn', body: 'Youth, technology, creation and belonging — returning to Jesse Cohen becomes an opportunity infrastructure for young people.', cta: 'Open the social mission', href: 'starton' },
            { title: '7YA', body: 'Life, sources, media and research become public memory that people can open, examine and continue from.', cta: 'Open research and systems', href: 'research' },
            { title: 'Public leadership', body: 'More than a position: an open experiment in what I would do differently, how outcomes should be measured and how responsibility becomes action.', cta: 'Open the leadership lab', href: 'leadership' },
        ],
        liveKicker: 'LIVE PUBLIC SIGNAL',
        liveTitle: 'The journey does not stop at the archive.',
        askKicker: 'AI · PUBLIC SOURCES',
        askTitle: 'Want to understand the connection?',
        askBody: 'Ask about a life chapter, StartOn, an interview, creation or a source. This is an AI tool grounded in the public corpus — not Igor himself — and it must not invent positions on his behalf.',
        askCta: 'Ask Igor',
        trust: 'Fact → source · uncertainty → explicit · Discovery does not become canon',
        deep: 'Go deeper',
    },
    ru: {
        kicker: '#7YA🥷 · ИГОРЬ ВЕПРЕЦКИЙ · 1990 → NOW',
        title: 'Игорь Вепрецкий.',
        statement: 'Не портфолио. Жизненный путь, превращённый в действие.',
        intro: 'От Харькова и Джесси Коэн через службу, безопасность и полицию к StartOn, творчеству, медиа и 7YA. История и доказательства остаются вместе: проходите путь, смотрите исходные материалы и открывайте источник, когда он нужен.',
        start: 'Начать путь',
        continue: 'Продолжить путь',
        now: 'Что я строю сейчас',
        proof: '7 глав · оригинальные медиа · открытые источники · прогресс хранится только в вашем браузере',
        nowKicker: 'NOW · 2026 →',
        nowTitle: 'Всё, что было раньше, должно было куда-то привести.',
        nowIntro: 'Текущая глава — не итог. Это попытка превратить жизненный опыт, службу, творчество и публичную сеть в системы, которые дают другим людям доступ, голос и возможности.',
        nowCards: [
            { title: 'StartOn', body: 'Молодёжь, технологии, творчество и принадлежность — возвращение в Джесси Коэн становится инфраструктурой возможностей.', cta: 'Открыть социальную миссию', href: 'starton' },
            { title: '7YA', body: 'Жизнь, источники, медиа и исследования становятся публичной памятью, которую можно открыть, проверить и продолжить.', cta: 'Открыть исследования', href: 'research' },
            { title: 'Общественное лидерство', body: 'Не только позиция: открытый эксперимент о том, что я сделал бы иначе, как измерять результат и превращать ответственность в действие.', cta: 'Открыть лабораторию лидерства', href: 'leadership' },
        ],
        liveKicker: 'LIVE PUBLIC SIGNAL',
        liveTitle: 'Путь не заканчивается архивом.',
        askKicker: 'AI · PUBLIC SOURCES',
        askTitle: 'Хотите понять связь?',
        askBody: 'Спросите о главе жизни, StartOn, интервью, творчестве или источнике. Это AI-инструмент на основе публичного корпуса — не сам Игорь — и он не должен придумывать позицию от его имени.',
        askCta: 'Спросить Игоря',
        trust: 'Факт → источник · неопределённость → явно · Discovery не становится каноном',
        deep: 'Углубиться',
    },
};

function readExplored(): JourneyChapterId[] {
    try {
        const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((value): value is JourneyChapterId => JOURNEY_CHAPTER_IDS.includes(value as JourneyChapterId));
    } catch {
        return [];
    }
}

export default function MasterExperienceHome() {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const [explored, setExplored] = useState<JourneyChapterId[]>(readExplored);

    useEffect(() => {
        const sync = () => setExplored(readExplored());
        window.addEventListener('7ya:journey-progress', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('7ya:journey-progress', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const nextChapter = useMemo(
        () => JOURNEY_CHAPTER_IDS.find(id => !explored.includes(id)) ?? 'now',
        [explored],
    );
    const journeyHref = explored.length ? `#journey-${nextChapter}` : '#life-throughline';
    const homeHref = pageHref('home', locale);
    const chatHref = `${homeHref}${homeHref.includes('?') ? '&' : '?'}chat=open#digital-igor`;
    const leadershipHref = rootHref('if-igor-were-on-the-list/');

    const resolveNowHref = (kind: MasterCopy['nowCards'][number]['href']) => {
        if (kind === 'starton') return pageHref('starton', locale);
        if (kind === 'research') return pageHref('research', locale);
        return leadershipHref;
    };

    return (
        <main className='master-home' dir={dir}>
            <section className='master-hero' aria-labelledby='master-title'>
                <div className='master-shell master-hero-grid'>
                    <div className='master-hero-copy'>
                        <small dir='ltr'>{c.kicker}</small>
                        <h1 id='master-title'>{c.title}</h1>
                        <p className='master-statement'>{c.statement}</p>
                        <p className='master-intro'>{c.intro}</p>
                        <div className='master-hero-actions'>
                            <a className='master-button master-button-primary' href={journeyHref}>
                                {explored.length ? c.continue : c.start}
                                <ArrowDown aria-hidden='true' />
                            </a>
                            <a className='master-button master-button-quiet' href='#now'>
                                {c.now}
                                <ArrowUpRight aria-hidden='true' />
                            </a>
                        </div>
                        <p className='master-proofline'><ShieldCheck aria-hidden='true' />{c.proof}</p>
                    </div>
                    <div className='master-hero-visual' aria-label={locale === 'he' ? 'איגור ופרצקי · רגעים מהחיים והעשייה' : 'Igor Vepretski · life and work moments'}>
                        <IgorHeroMosaic />
                        <div className='master-hero-index' aria-hidden='true'>
                            <span>01</span><b>1990</b><i>→</i><b>NOW</b><span>07</span>
                        </div>
                    </div>
                </div>
            </section>

            <LifeThroughline />

            <section id='now' className='master-now' aria-labelledby='master-now-title'>
                <div className='master-shell'>
                    <header className='master-section-head'>
                        <div>
                            <small dir='ltr'>{c.nowKicker}</small>
                            <h2 id='master-now-title'>{c.nowTitle}</h2>
                        </div>
                        <p>{c.nowIntro}</p>
                    </header>
                    <div className='master-now-grid'>
                        {c.nowCards.map((card, index) => (
                            <a href={resolveNowHref(card.href)} className='master-now-card' key={card.title}>
                                <span>{String(index + 1).padStart(2, '0')}</span>
                                <h3>{card.title}</h3>
                                <p>{card.body}</p>
                                <b>{card.cta} ↗</b>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <LiveSocial />

            <section className='master-ask' aria-labelledby='master-ask-title'>
                <div className='master-shell master-ask-grid'>
                    <div>
                        <small dir='ltr'>{c.askKicker}</small>
                        <h2 id='master-ask-title'>{c.askTitle}</h2>
                        <p>{c.askBody}</p>
                        <div className='master-trust'><ShieldCheck aria-hidden='true' /><span>{c.trust}</span></div>
                    </div>
                    <a className='master-ask-action' href={chatHref}>
                        <MessageCircle aria-hidden='true' />
                        <span>{c.askCta}</span>
                        <ArrowUpRight aria-hidden='true' />
                    </a>
                </div>
            </section>

            <footer className='master-footer'>
                <div className='master-shell master-footer-grid'>
                    <div><strong>#7YA🥷</strong><span>IGOR VEPRETSKI · LIFE → EVIDENCE → ACTION</span></div>
                    <nav aria-label={c.deep}>
                        <a href={pageHref('evidence', locale)}>{locale === 'he' ? 'ראיות' : locale === 'ru' ? 'Доказательства' : 'Evidence'}</a>
                        <a href={pageHref('library', locale)}>{locale === 'he' ? 'ארכיון' : locale === 'ru' ? 'Архив' : 'Archive'}</a>
                        <a href={pageHref('media', locale)}>{locale === 'he' ? 'מדיה' : locale === 'ru' ? 'Медиа' : 'Media'}</a>
                        <a href={rootHref('contact/')}>{locale === 'he' ? 'יצירת קשר' : locale === 'ru' ? 'Контакт' : 'Contact'}</a>
                    </nav>
                </div>
            </footer>
        </main>
    );
}
