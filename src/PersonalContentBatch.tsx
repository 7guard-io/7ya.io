import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { fetchPublicProjection, type PublicLibraryItem, type PublicLibraryPayload } from './public-library-model';
import { rootHref, useLocale } from './locale';
import './personal-content-batch.css';

const MAX_ITEMS = 48;
const ORIGINAL_MEDIA_LEAD = 24;
const ORIGINAL_MEDIA_LABEL = 'ORIGINAL MEDIA';
const SOURCE_PREVIEW_LABEL = 'SOURCE PREVIEW';

const canonicalUrl = (value: string) => value.trim().replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

const hasOriginalMedia = (item: PublicLibraryItem) => Boolean(item.imageUrl);

const usableItem = (item: PublicLibraryItem) =>
    Boolean(item.sourceUrl) &&
    item.layer !== 'PENDING' &&
    item.mediaType !== 'profile';

const buildVisibleBatch = (items: PublicLibraryItem[]) => {
    const usable = items.filter(usableItem);
    const seen = new Set<string>();
    const picked: PublicLibraryItem[] = [];

    const add = (item: PublicLibraryItem) => {
        const key = canonicalUrl(item.sourceUrl);
        if (!key || seen.has(key) || picked.length >= MAX_ITEMS) return;
        seen.add(key);
        picked.push(item);
    };

    usable.filter(hasOriginalMedia).slice(0, ORIGINAL_MEDIA_LEAD).forEach(add);
    usable.forEach(add);

    return picked;
};

const copy = {
    he: {
        eyebrow: 'MY LIFE / ORIGINAL MEDIA FIRST',
        title: 'לא שלוש דוגמאות. החיים עצמם.',
        body: 'התמונות ופריימי הווידאו המקוריים שלי מובילים כאן. כתבות וצילומי־מסך נשארים שכבת מקור משנית — וכל פוסט, וידאו, מוזיקה, StartOn, שירות, אבהות ורגע ציבורי נשאר מחובר למקור ולהקשר.',
        source: 'למקור',
        all: 'לכל הארכיון הציבורי',
        loading: 'טוען את הרשומה הציבורית…',
        empty: 'הזרם החי לא החזיר כרגע פריטים. הארכיון המלא נשאר פתוח.',
        objects: 'אובייקטים מקור־מקושרים',
        known: 'פריטים ציבוריים ידועים במערכת',
    },
    en: {
        eyebrow: 'MY LIFE / ORIGINAL MEDIA FIRST',
        title: 'Not three examples. The life itself.',
        body: 'My original photographs and video frames lead here. Articles and page screenshots stay secondary source previews — while every post, video, music release, StartOn moment, service chapter and public record remains attached to its source and context.',
        source: 'Open source',
        all: 'Open the full public archive',
        loading: 'Loading the public record…',
        empty: 'The live stream returned no objects right now. The full archive remains open.',
        objects: 'source-linked objects',
        known: 'known public objects in the system',
    },
    ru: {
        eyebrow: 'MY LIFE / ORIGINAL MEDIA FIRST',
        title: 'Не три примера. Сама жизнь.',
        body: 'Сначала здесь идут мои оригинальные фотографии и кадры видео. Статьи и скриншоты страниц остаются вторичным превью источника — а посты, музыка, StartOn, служба, отцовство и публичные моменты связаны с источником и контекстом.',
        source: 'Источник',
        all: 'Весь публичный архив',
        loading: 'Загружается публичная запись…',
        empty: 'Живой поток сейчас не вернул объекты. Полный архив остаётся доступен.',
        objects: 'объектов с источниками',
        known: 'известных публичных объектов в системе',
    },
} as const;

const hideBrokenImage = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    image.style.display = 'none';
    image.parentElement?.classList.add('pcb-media-empty');
};

export default function PersonalContentBatch() {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const [payload, setPayload] = useState<PublicLibraryPayload | null>(null);
    const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

    useEffect(() => {
        let active = true;
        setState('loading');
        fetchPublicProjection({ limit: 100, sort: 'impact' })
            .then((data) => {
                if (!active) return;
                setPayload(data);
                setState('ready');
            })
            .catch(() => {
                if (!active) return;
                setPayload(null);
                setState('failed');
            });
        return () => {
            active = false;
        };
    }, []);

    const items = useMemo(() => buildVisibleBatch(payload?.items || []), [payload]);

    return (
        <section id='personal-content-batch' className='personal-content-batch' dir={dir} aria-labelledby='pcb-title'>
            <div className='pcb-shell'>
                <header className='pcb-header'>
                    <div>
                        <small dir='ltr'>{c.eyebrow}</small>
                        <h2 id='pcb-title'>{c.title}</h2>
                    </div>
                    <p>{c.body}</p>
                </header>

                <div className='pcb-stats' dir='ltr'>
                    <div>
                        <b>{items.length || '—'}</b>
                        <span>{c.objects}</span>
                    </div>
                    <div>
                        <b>{payload?.knownTotal ?? '—'}</b>
                        <span>{c.known}</span>
                    </div>
                    <div>
                        <b>CANON · LIVE · DISCOVERY</b>
                        <span>SOURCE → CONTEXT → STORY</span>
                    </div>
                </div>

                {state === 'loading' && <p className='pcb-state'>{c.loading}</p>}
                {state === 'failed' && <p className='pcb-state pcb-state-error'>{c.empty}</p>}

                {items.length > 0 && (
                    <div className='pcb-grid' data-personal-content-count={items.length}>
                        {items.map((item, index) => {
                            const isOriginalMedia = Boolean(item.imageUrl);
                            const isSourcePreview = !isOriginalMedia && Boolean(item.screenshotUrl);
                            const visual = item.imageUrl || item.screenshotUrl;
                            const topic = item.topics.find((value) => value && value.length < 34);
                            return (
                                <a
                                    className={'pcb-card ' + (visual ? 'pcb-card-visual ' : 'pcb-card-text ') + (isOriginalMedia ? 'pcb-card-original' : isSourcePreview ? 'pcb-card-source-preview' : '')}
                                    href={item.sourceUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                    key={item.id + item.sourceUrl}
                                    data-personal-content-card={index + 1}
                                    data-layer={item.layer}
                                    data-media-type={item.mediaType}
                                    data-visual-kind={isOriginalMedia ? 'original-media' : isSourcePreview ? 'source-preview' : 'text'}
                                >
                                    {visual && (
                                        <div className='pcb-media'>
                                            <img
                                                src={visual}
                                                alt={item.title[locale]}
                                                loading={index < 4 ? 'eager' : 'lazy'}
                                                decoding='async'
                                                referrerPolicy='no-referrer'
                                                onError={hideBrokenImage}
                                            />
                                            <span className='pcb-media-kind' dir='ltr'>{isOriginalMedia ? ORIGINAL_MEDIA_LABEL : SOURCE_PREVIEW_LABEL}</span>
                                            {item.mediaType === 'video' && <span className='pcb-play' aria-hidden='true'>▶</span>}
                                        </div>
                                    )}
                                    <div className='pcb-meta' dir='ltr'>
                                        <span>{String(index + 1).padStart(2, '0')}</span>
                                        <b>{item.mediaType.toUpperCase()}</b>
                                        <time>{item.year || 'PUBLIC'}</time>
                                    </div>
                                    <div className='pcb-copy'>
                                        <div className='pcb-source-line'>
                                            <span>{item.platform || item.publisher || 'PUBLIC'}</span>
                                            <em>{item.layer}</em>
                                        </div>
                                        <h3>{item.title[locale]}</h3>
                                        <p>{item.summary[locale]}</p>
                                        <footer>
                                            <span>{topic || item.publisher}</span>
                                            <b>{c.source} ↗</b>
                                        </footer>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}

                <a className='pcb-all' href={rootHref('library/?lang=' + locale)}>
                    {c.all} <span aria-hidden='true'>↗</span>
                </a>
            </div>
        </section>
    );
}
