import {useEffect, useState} from 'react';
import {ArrowUpRight, Facebook, Play} from 'lucide-react';
import {api} from '@appdeploy/client';
import {useLocale} from '../locale';
import './owner-facebook-archive.css';

type OwnerArchiveItem = {
    id: string;
    date: string;
    title: string;
    context: string;
    sourceUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    imageUrl?: string;
    storage: 'archived' | 'transient' | 'unavailable';
};

type OwnerArchivePayload = {
    items?: OwnerArchiveItem[];
};

const profileUrl = 'https://www.facebook.com/vepretski7';

const copy = {
    he: {
        eyebrow: 'FACEBOOK אישי · אלבום מקור',
        title: 'החיים כפי שתועדו בפייסבוק שלי.',
        body: 'הפריטים כאן מגיעים מהפרופיל האישי של איגור, נשמרים עם התאריך והפוסט המקורי, ומופיעים לפני שכבת הנתונים של האטלס.',
        profile: 'לפרופיל Facebook האישי',
        source: 'לפתיחת הפוסט המקורי',
        unavailable: 'כרגע לא הצלחנו לטעון תצוגה מקדימה. המקור המקורי נשאר פתוח בפרופיל האישי.',
        photo: 'צילום מקור',
        video: 'וידאו מקור',
    },
    en: {
        eyebrow: 'PERSONAL FACEBOOK · SOURCE ALBUM',
        title: 'Life as I documented it on Facebook.',
        body: 'These items come from Igor’s personal profile, remain attached to their dates and original posts, and appear before the data layer of the atlas.',
        profile: 'Open personal Facebook',
        source: 'Open original post',
        unavailable: 'A preview is temporarily unavailable. The original source remains open on the personal profile.',
        photo: 'ORIGINAL PHOTO',
        video: 'ORIGINAL VIDEO',
    },
    ru: {
        eyebrow: 'ЛИЧНЫЙ FACEBOOK · АЛЬБОМ ИСТОЧНИКОВ',
        title: 'Жизнь, как я документировал её в Facebook.',
        body: 'Эти материалы взяты из личного профиля Игоря, сохраняют дату и ссылку на исходную публикацию и стоят перед слоем данных атласа.',
        profile: 'Открыть личный Facebook',
        source: 'Открыть исходный пост',
        unavailable: 'Предпросмотр временно недоступен. Исходный материал остаётся открытым в личном профиле.',
        photo: 'ОРИГИНАЛЬНОЕ ФОТО',
        video: 'ОРИГИНАЛЬНОЕ ВИДЕО',
    },
} as const;

export default function OwnerFacebookArchive() {
    const {locale, dir} = useLocale();
    const c = copy[locale];
    const [items, setItems] = useState<OwnerArchiveItem[]>([]);
    const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading');

    useEffect(() => {
        let active = true;
        void api.get('/api/owner-facebook-archive').then(({data}) => {
            if (!active) return;
            const payload = data as OwnerArchivePayload;
            const next = (payload.items || []).filter(item => Boolean(item.sourceUrl && item.title));
            setItems(next);
            setState(next.length ? 'ready' : 'unavailable');
        }).catch(() => {
            if (!active) return;
            setItems([]);
            setState('unavailable');
        });
        return () => {
            active = false;
        };
    }, []);

    return (
        <section className='owner-facebook-archive' dir={dir} aria-labelledby='owner-facebook-archive-title'>
            <div className='owner-facebook-archive-inner'>
                <header className='owner-facebook-archive-head'>
                    <div>
                        <small dir='ltr'><Facebook />{c.eyebrow}</small>
                        <h2 id='owner-facebook-archive-title'>{c.title}</h2>
                    </div>
                    <div>
                        <p>{c.body}</p>
                        <a href={profileUrl} target='_blank' rel='noreferrer'>{c.profile}<ArrowUpRight /></a>
                    </div>
                </header>

                {state === 'loading' ? (
                    <div className='owner-facebook-archive-grid' aria-busy='true'>
                        {[0, 1, 2, 3].map(item => <div className='owner-facebook-archive-skeleton' key={item} />)}
                    </div>
                ) : null}

                {state === 'ready' ? (
                    <div className='owner-facebook-archive-grid'>
                        {items.map(item => (
                            <a className='owner-facebook-archive-card' href={item.sourceUrl} target='_blank' rel='noreferrer' key={item.id}>
                                <figure>
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            loading='eager'
                                            decoding='async'
                                            onError={event => event.currentTarget.parentElement?.setAttribute('data-unavailable', 'true')}
                                        />
                                    ) : <div className='owner-facebook-archive-source-surface' />}
                                    <span className='owner-facebook-archive-kind' dir='ltr'>
                                        {item.mediaType === 'VIDEO' ? <Play fill='currentColor' /> : null}
                                        {item.mediaType === 'VIDEO' ? c.video : c.photo}
                                    </span>
                                </figure>
                                <div className='owner-facebook-archive-copy'>
                                    <time dir='ltr'>{item.date}</time>
                                    <h3>{item.title}</h3>
                                    <p>{item.context}</p>
                                    <strong>{c.source}<ArrowUpRight /></strong>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : null}

                {state === 'unavailable' ? (
                    <p className='owner-facebook-archive-unavailable'>{c.unavailable} <a href={profileUrl} target='_blank' rel='noreferrer'>{c.profile}<ArrowUpRight /></a></p>
                ) : null}
            </div>
        </section>
    );
}
