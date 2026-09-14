import { ArrowUpRight, Play } from 'lucide-react';
import { useLocale, type Locale } from './locale';
import './igor-hero-mosaic.css';
import './personal-front-door.css';

type MomentCard = {
    id: string;
    href: string;
    image?: string;
    label: string;
    title: string;
    poster: string;
    tone: 'portrait' | 'starton' | 'service' | 'music';
    external?: boolean;
    video?: boolean;
};

type Copy = {
    kicker: string;
    title: string;
    intro: string;
    proof: string;
    sourceVideo: string;
    sourceRecord: string;
    cards: Record<'portrait' | 'starton' | 'service' | 'music', {
        label: string;
        title: string;
        poster: string;
    }>;
};

const portraitImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/960px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png';
const startonPressImage = 'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg';

const copy: Record<Locale, Copy> = {
    he: {
        kicker: 'חיים · שירות · StartOn · מוזיקה',
        title: 'החיים שלי, במקורות.',
        intro: 'ארבעה רגעים שמספרים את הדרך: קול אישי, שירות, חזרה לשכונה ויצירה.',
        proof: 'כל פריט מחובר למקור הקיים שלו — תמונה אמיתית או מקור פתוח, בלי תמונות שבורות.',
        sourceVideo: 'וידאו מקור',
        sourceRecord: 'מקור ציבורי',
        cards: {
            portrait: {
                label: 'OPEN PUBLIC PORTRAIT · CC0',
                title: 'איגור ופרצקי, בשיחה',
                poster: 'דיוקן · מקור פתוח',
            },
            starton: {
                label: 'MYNET חולון · 2022',
                title: 'חוזר לג׳סי כהן עם StartOn',
                poster: 'כתבת שטח · StartOn',
            },
            service: {
                label: 'YOUTUBE · 2023',
                title: 'למה עזבתי את משטרת ישראל',
                poster: 'שירות · וידאו מקור',
            },
            music: {
                label: 'NAWAN ft. VEPRETSKI · 2025',
                title: 'BIZZI — הקליפ הרשמי',
                poster: 'מוזיקה · וידאו מקור',
            },
        },
    },
    en: {
        kicker: 'LIFE · SERVICE · STARTON · MUSIC',
        title: 'My life, from the source.',
        intro: 'Four moments that tell the path: voice, service, return to the neighborhood and creation.',
        proof: 'Every item stays connected to its existing source — a real image or an open source card, never a broken thumbnail.',
        sourceVideo: 'SOURCE VIDEO',
        sourceRecord: 'PUBLIC SOURCE',
        cards: {
            portrait: {
                label: 'OPEN PUBLIC PORTRAIT · CC0',
                title: 'Igor Vepretski, in conversation',
                poster: 'PORTRAIT · OPEN SOURCE',
            },
            starton: {
                label: 'MYNET HOLON · 2022',
                title: 'Returning to Jesse Cohen with StartOn',
                poster: 'FIELD REPORT · STARTON',
            },
            service: {
                label: 'YOUTUBE · 2023',
                title: 'Why I left the Israel Police',
                poster: 'SERVICE · SOURCE VIDEO',
            },
            music: {
                label: 'NAWAN ft. VEPRETSKI · 2025',
                title: 'BIZZI — official video',
                poster: 'MUSIC · SOURCE VIDEO',
            },
        },
    },
    ru: {
        kicker: 'ЖИЗНЬ · СЛУЖБА · STARTON · МУЗЫКА',
        title: 'Моя жизнь — из источников.',
        intro: 'Четыре эпизода пути: голос, служба, возвращение в район и творчество.',
        proof: 'Каждый материал связан с существующим источником — реальное фото или открытая карточка источника, без сломанных превью.',
        sourceVideo: 'ВИДЕО-ИСТОЧНИК',
        sourceRecord: 'ПУБЛИЧНЫЙ ИСТОЧНИК',
        cards: {
            portrait: {
                label: 'OPEN PUBLIC PORTRAIT · CC0',
                title: 'Игорь Вепрецкий, в разговоре',
                poster: 'ПОРТРЕТ · ОТКРЫТЫЙ ИСТОЧНИК',
            },
            starton: {
                label: 'MYNET HOLON · 2022',
                title: 'Возвращение в Джесси Коэн вместе с StartOn',
                poster: 'РЕПОРТАЖ · STARTON',
            },
            service: {
                label: 'YOUTUBE · 2023',
                title: 'Почему я ушёл из полиции Израиля',
                poster: 'СЛУЖБА · ВИДЕО-ИСТОЧНИК',
            },
            music: {
                label: 'NAWAN ft. VEPRETSKI · 2025',
                title: 'BIZZI — официальный клип',
                poster: 'МУЗЫКА · ВИДЕО-ИСТОЧНИК',
            },
        },
    },
};

export default function IgorHeroMosaic() {
    const { locale, dir } = useLocale();
    const c = copy[locale];

    const cards: MomentCard[] = [
        {
            id: 'open-public-portrait',
            href: 'https://commons.wikimedia.org/wiki/File:Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png',
            image: portraitImage,
            label: c.cards.portrait.label,
            title: c.cards.portrait.title,
            poster: c.cards.portrait.poster,
            tone: 'portrait',
            external: true,
        },
        {
            id: 'mynet-return',
            href: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
            image: startonPressImage,
            label: c.cards.starton.label,
            title: c.cards.starton.title,
            poster: c.cards.starton.poster,
            tone: 'starton',
            external: true,
        },
        {
            id: 'police-exit-2023',
            href: 'https://www.youtube.com/watch?v=kS2CRiqRaXo',
            image: 'https://i.ytimg.com/vi/kS2CRiqRaXo/hqdefault.jpg',
            label: c.cards.service.label,
            title: c.cards.service.title,
            poster: c.cards.service.poster,
            tone: 'service',
            external: true,
            video: true,
        },
        {
            id: 'bizzi-video',
            href: 'https://www.youtube.com/watch?v=jRjZjpqAgEw',
            image: 'https://i.ytimg.com/vi/jRjZjpqAgEw/hqdefault.jpg',
            label: c.cards.music.label,
            title: c.cards.music.title,
            poster: c.cards.music.poster,
            tone: 'music',
            external: true,
            video: true,
        },
    ];

    return (
        <aside
            className='igor-hero-mosaic personal-front-door-media'
            dir={dir}
            aria-label={c.title}
            data-hero-real-media='true'
            data-personal-front-door='true'
        >
            <header>
                <small>{c.kicker}</small>
                <h2>{c.title}</h2>
                <p>{c.intro}</p>
            </header>

            <div className='igor-hero-mosaic-grid personal-front-door-grid'>
                {cards.map((card, index) => (
                    <a
                        className={'personal-front-door-card' + (index === 0 ? ' is-featured' : '')}
                        href={card.href}
                        key={card.id}
                        target={card.external ? '_blank' : undefined}
                        rel={card.external ? 'noreferrer' : undefined}
                        data-content-source={card.external ? 'public-source' : 'owner-archive'}
                        data-has-image={card.image ? 'true' : 'false'}
                        data-card-tone={card.tone}
                    >
                        <figure data-source-poster={card.image ? undefined : '1'}>
                            {card.image ? (
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    loading='eager'
                                    decoding='async'
                                    fetchPriority={index < 3 ? 'high' : 'auto'}
                                    referrerPolicy='no-referrer'
                                    onError={event => {
                                        event.currentTarget.closest('.personal-front-door-card')?.setAttribute(
                                            'data-image-state',
                                            'unavailable',
                                        );
                                    }}
                                />
                            ) : null}
                            <span className='personal-front-door-source-poster' aria-hidden='true'>
                                <small>{card.poster}</small>
                                <b>{String(index + 1).padStart(2, '0')}</b>
                                <em>{card.video ? c.sourceVideo : c.sourceRecord}</em>
                            </span>
                            {card.video ? (
                                <span className='personal-front-door-play' aria-hidden='true'>
                                    <Play />
                                </span>
                            ) : null}
                        </figure>
                        <div>
                            <small>{card.label}</small>
                            <h3>{card.title}</h3>
                            <span className='personal-front-door-link'>
                                {locale === 'he' ? 'לפתוח' : locale === 'ru' ? 'Открыть' : 'Open'}
                                <ArrowUpRight aria-hidden='true' />
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <p className='personal-front-door-proof'>{c.proof}</p>
        </aside>
    );
}
