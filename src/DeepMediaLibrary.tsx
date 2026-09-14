import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowUpLeft,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    FolderSearch,
    Play,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import {
    deepMedia,
    deepMediaCategories,
    type DeepMediaCategory,
    type DeepMediaItem,
} from './deep-media-data';
import MediaEvidenceVisual from './MediaEvidenceVisual';
import { publicVisual } from './public-visual';
import { loadUnifiedMediaLibrary, type UnifiedMediaSnapshot } from './unified-media-library';
import './deep-media-library.css';

const lens: Record<DeepMediaCategory, string> = {
    טלוויזיה: 'איגור אינו רק נושא הראיון — הוא החוט שמחבר ניסיון אישי, אחריות ציבורית והמשך פעולה.',
    פודקאסטים: 'בשיחה ארוכה איגור בונה סיבתיות: מאיפה הגיע, מה נשבר, ומה אפשר לבנות לאחר מכן.',
    עיתונות: 'כתבה היא תחנת ראיה בתוך מסע ארוך יותר; האדם נשאר קבוע גם כשהכותרת והמו״ל משתנים.',
    כתיבה: 'הכתיבה מאפשרת לאיגור לתרגם חיים, הורות, רשתות וחברה למסגרת שאפשר לחשוב איתה.',
    ויראלי: 'רגע ויראלי הוא לא הזהות כולה. 7YA מחזירה אותו אל האדם, ההקשר והאחריות.',
    מוזיקה: 'Ido Vepretski הוא התדר היצירתי של אותו אדם — מוזיקה, הומור וזיכרון תרבותי.',
    רשתות: 'הפלטפורמות משתנות; איגור, הקול והמקור הקנוני צריכים להישאר ניתנים למציאה.',
    StartOn: 'StartOn היא השליחות שנולדה מהמסע האישי, אך נשארת ישות חברתית נפרדת וברורה.',
};

const initialSnapshot: UnifiedMediaSnapshot = {
    items: deepMedia,
    knownTotal: deepMedia.length,
    projectionTotal: 0,
    sourceCount: new Set(deepMedia.map((item) => item.source)).size,
    status: 'partial',
};

export default function DeepMediaLibrary() {
    const [library, setLibrary] = useState<UnifiedMediaSnapshot>(initialSnapshot);
    const [category, setCategory] = useState<(typeof deepMediaCategories)[number]>('הכול');
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState('fraud-13');
    const [playing, setPlaying] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const stageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let mounted = true;
        void loadUnifiedMediaLibrary().then((snapshot) => {
            if (mounted) setLibrary(snapshot);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(
        () => library.items.filter((item) =>
            (category === 'הכול' || item.category === category)
            && (!query || [item.title, item.source, item.summary, item.year, item.category, item.status]
                .join(' ')
                .toLowerCase()
                .includes(query.toLowerCase())),
        ),
        [category, query, library.items],
    );
    const active = filtered.find((item) => item.id === activeId) || filtered[0] || library.items[0] || deepMedia[0];
    const visible = expanded ? filtered : filtered.slice(0, 12);
    const activeIndex = Math.max(0, library.items.findIndex((item) => item.id === active.id));

    useEffect(() => setPlaying(false), [active.id]);

    const chooseCategory = (value: (typeof deepMediaCategories)[number]) => {
        setCategory(value);
        setQuery('');
        setExpanded(false);
        const first = value === 'הכול' ? library.items[0] : library.items.find((item) => item.category === value);
        if (first) setActiveId(first.id);
    };

    const chooseItem = (item: DeepMediaItem) => {
        setActiveId(item.id);
        setPlaying(false);
        if (window.innerWidth <= 850) {
            window.setTimeout(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
        }
    };

    return (
        <section className='deep-media-library' id='media' aria-labelledby='deep-media-title'>
            <header className='deep-media-head'>
                <div>
                    <span><FolderSearch />UNIFIED MEDIA LIBRARY · PUBLIC PROJECTION + CURATED</span>
                    <h2 id='deep-media-title'>ספריית המדיה<br /><em>המאוחדת.</em></h2>
                </div>
                <div>
                    <p>91 הרשומות הערוכות נשמרות כשכבת curated, אבל הן כבר לא התקרה. הספרייה מתחברת ל־Public Projection שמאחד Canon, Discovery, Live Social, Meta והגרף הציבורי, ומסירה כפילויות לפי כתובת מקור קנונית.</p>
                    <small><ShieldCheck />מקור ציבורי נשאר מחובר ל־URL המקורי. ויזואל חסום מקבל source-poster מסומן — לא תמונת אירוע מומצאת.</small>
                </div>
            </header>

            <div className='deep-media-ledger' aria-label='נתוני ספריית המדיה המאוחדת'>
                <article><strong>{library.items.length}</strong><span>פריטי מדיה מאוחדים</span></article>
                <article><strong>{deepMedia.length}</strong><span>רשומות curated בסיס</span></article>
                <article><strong>{library.knownTotal}</strong><span>אובייקטים ציבוריים ידועים</span></article>
                <article><strong>{library.sourceCount}</strong><span>גופים ומשטחי מקור</span></article>
                <article><strong>{library.status === 'live' ? 'LIVE' : 'PARTIAL'}</strong><span>Public Projection</span></article>
            </div>

            <div className='deep-source-provenance'>
                <span>PUBLIC PROJECTION</span>
                <span>CANON</span>
                <span>DISCOVERY</span>
                <span>LIVE SOCIAL</span>
                <span>CURATED 91</span>
            </div>

            <div className='deep-media-controls'>
                <label>
                    <Search />
                    <input
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setExpanded(false);
                        }}
                        placeholder='חיפוש: StartOn, אבהות, נובה, מוזיקה…'
                        aria-label='חיפוש בספריית המדיה'
                    />
                    {query && <button type='button' onClick={() => setQuery('')} aria-label='ניקוי החיפוש'><X /></button>}
                </label>
                <nav aria-label='סינון ספריית המדיה'>
                    {deepMediaCategories.map((value) => (
                        <button
                            type='button'
                            key={value}
                            className={category === value ? 'active' : ''}
                            onClick={() => chooseCategory(value)}
                        >
                            {value}
                        </button>
                    ))}
                </nav>
            </div>

            <div ref={stageRef} className='deep-media-stage'>
                <div className='deep-stage-visual'>
                    {active.youtubeId && playing ? (
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                            title={active.title}
                            allow='autoplay; encrypted-media; picture-in-picture'
                            allowFullScreen
                        />
                    ) : (
                        <MediaEvidenceVisual
                            kind={active.youtubeId ? 'video' : 'post'}
                            mode='stage'
                            source={active.source}
                            title={active.title}
                            year={active.year}
                            metric={active.metric}
                            status={active.status}
                            image={active.youtubeId ? active.image : publicVisual(active.url)}
                            tone={active.category}
                            index={activeIndex}
                            disclosure={active.youtubeId ? 'תמונת וידאו מקורית של YouTube' : 'ויזואל ציבורי מהמקור · אם המקור חוסם מוצג source-poster מסומן'}
                        />
                    )}
                    {!playing && active.youtubeId && (
                        <button type='button' className='deep-play' onClick={() => setPlaying(true)}>
                            <Play fill='currentColor' />לצפייה כאן
                        </button>
                    )}
                    {playing && (
                        <button type='button' className='deep-stop' onClick={() => setPlaying(false)} aria-label='סגירת הנגן'>
                            <X />
                        </button>
                    )}
                </div>

                <article className='deep-stage-copy'>
                    <div className='deep-stage-meta'>
                        <span>{active.category}</span>
                        <span>{active.year}</span>
                        {active.language && <span>{active.language}</span>}
                    </div>
                    <small>{active.source}</small>
                    <h3>{active.title}</h3>
                    <p>{active.summary}</p>
                    {active.metric && (
                        <div className='deep-stage-metric'>
                            <b>{active.metric}</b>
                            <span>מדד נקודתי · אינו מחובר לסכום חשיפה כולל</span>
                        </div>
                    )}
                    <div className='deep-stage-status'>
                        <ShieldCheck />
                        <span><small>מעמד הראיה</small><b>{active.status}</b></span>
                    </div>
                    <a href={active.url} target='_blank' rel='noreferrer'>לפתיחת המקור המלא <ExternalLink /></a>
                </article>

                <aside className='deep-igor-thread'>
                    <figure>
                        <img src='./resources/igor-hero.jpg' alt='איגור ופרצקי' loading='lazy' />
                        <span>APPROVED PUBLIC PORTRAIT</span>
                    </figure>
                    <div className='deep-igor-thread-copy'>
                        <small>THE HUMAN THREAD</small>
                        <h4>IGOR VEPRETSKI</h4>
                        <blockquote>{lens[active.category]}</blockquote>
                        <div className='deep-igor-thread-years'>
                            <div><b>HUMAN</b><span>אדם וניסיון חיים</span></div>
                            <div><b>MISSION</b><span>StartOn והזדמנות</span></div>
                            <div><b>SYSTEM</b><span>7YA, מקור וראיה</span></div>
                        </div>
                    </div>
                </aside>
            </div>

            <div className='deep-media-results'>
                <header>
                    <div>
                        <span>{filtered.length} פריטים מוצגים</span>
                        <b>{category === 'הכול' ? 'כל הספרייה המאוחדת' : category}</b>
                    </div>
                    <p>בחרו כרטיס כדי לפתוח אותו בבמה. ה־91 הערוכים וה־Public Projection מוצגים כרצף אחד, בלי לשכפל אותו מקור.</p>
                </header>
                {visible.length ? (
                    <div className='deep-media-grid'>
                        {visible.map((item, index) => (
                            <button
                                type='button'
                                key={item.id}
                                className={`${active.id === item.id ? 'active ' : ''}deep-card deep-card-${index % 7}`}
                                onClick={() => chooseItem(item)}
                                aria-pressed={active.id === item.id}
                            >
                                <div className='deep-card-visual'>
                                    <MediaEvidenceVisual
                                        kind={item.youtubeId ? 'video' : 'post'}
                                        mode='card'
                                        source={item.source}
                                        title={item.title}
                                        year={item.year}
                                        metric={item.metric}
                                        status={item.status}
                                        image={item.youtubeId ? item.image : publicVisual(item.url)}
                                        tone={item.category}
                                        index={index}
                                        disclosure={item.youtubeId ? 'ORIGINAL VIDEO THUMBNAIL' : 'PUBLIC SOURCE VISUAL · SOURCE LINKED'}
                                    />
                                </div>
                                <div>
                                    <small>{item.source} · {item.year}</small>
                                    <strong>{item.title}</strong>
                                    {item.metric && <em>{item.metric}</em>}
                                    <span>{item.category}<ArrowUpLeft /></span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className='deep-media-empty'>
                        <Search />
                        <h3>לא נמצאו פריטים</h3>
                        <p>נסו ניסוח אחר או חזרו ל״הכול״.</p>
                        <button type='button' onClick={() => chooseCategory('הכול')}>איפוס הספרייה</button>
                    </div>
                )}
                {filtered.length > 12 && (
                    <button type='button' className='deep-expand' onClick={() => setExpanded((value) => !value)}>
                        {expanded ? <><ChevronUp />לצמצם את הקיר</> : <><ChevronDown />להציג עוד {filtered.length - 12} פריטים</>}
                    </button>
                )}
            </div>

            <footer className='deep-media-footer'>
                <div>
                    <span>THE UNIFIED PUBLIC DESK</span>
                    <h3>המקור נשאר בחוץ.<br />הספרייה כבר לא נעצרת ב־91.</h3>
                </div>
                <a href='../library/'>לארכיון הציבורי המלא <ExternalLink /></a>
            </footer>
        </section>
    );
}
