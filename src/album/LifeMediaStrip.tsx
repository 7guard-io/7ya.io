import { ExternalLink } from 'lucide-react';
import { deepMedia, type DeepMediaItem } from '../deep-media-data';
import { rootHref, useLocale, type Locale } from '../locale';
import './life-media-strip.css';

const lifeMediaIds = [
    'school-note-reflection-2022',
    'early-2011',
    'mfa-miami-consular-2012',
    'police-exit-2023',
    'police-uniform-fatherhood-2024',
    'mynet-return',
    'starton-14',
    'microsoft-startups-first-door-2022',
    'father-hidabroot',
    'mial-maakav-2023',
    'fraud-13',
    'nova-long',
    'ndi-repatriation-2024',
    'excel-video',
    'bizzi-video',
    'politics-entry-2023',
    'instagram-story-20260801',
    'nawan-external-2026',
] as const;

const featuredIndexes = new Set([0, 3, 5, 8, 11, 14, 17]);

const copy: Record<Locale, { eyebrow: string; title: string; body: string; open: string; footer: string }> = {
    he: {
        eyebrow: 'LIFE MEDIA / 18 SOURCE-LINKED MOMENTS',
        title: 'החיים שלי, דרך מה שבאמת נשאר מהם.',
        body: 'לא ארבעה כרטיסים ולא תקציר קריירה. 18 רגעים אמיתיים מתקופות שונות — תמונות, וידאו, כתבות, מסמכים ופוסטים — וכל אחד פותח את המקור שממנו הגיע.',
        open: 'למקור',
        footer: '18 רגעים · ילדות → שירות → משטרה → StartOn → אבהות → יצירה → הנהגה → עכשיו',
    },
    en: {
        eyebrow: 'LIFE MEDIA / 18 SOURCE-LINKED MOMENTS',
        title: 'My life, through what actually survived from it.',
        body: 'Not four cards and not a career summary. Eighteen real moments across different eras — images, video, press, documents and posts — each opening the source it came from.',
        open: 'Open source',
        footer: '18 moments · childhood → service → police → StartOn → fatherhood → creation → leadership → now',
    },
    ru: {
        eyebrow: 'LIFE MEDIA / 18 SOURCE-LINKED MOMENTS',
        title: 'Моя жизнь — через то, что от неё действительно сохранилось.',
        body: 'Не четыре карточки и не краткое резюме. Восемнадцать реальных моментов разных периодов — фото, видео, публикации, документы и посты — каждый ведёт к исходному источнику.',
        open: 'Открыть источник',
        footer: '18 моментов · детство → служба → полиция → StartOn → отцовство → творчество → лидерство → сейчас',
    },
};

const resolveImage = (value: string) => value.startsWith('./resources/') ? rootHref(value.slice(2)) : value;

export default function LifeMediaStrip() {
    const { locale, dir } = useLocale();
    const labels = copy[locale];
    const items = lifeMediaIds
        .map(id => deepMedia.find(item => item.id === id))
        .filter((item): item is DeepMediaItem => Boolean(item));

    return (
        <section className='life-media-strip' id='life-media-strip' aria-labelledby='life-media-strip-title' dir={dir}>
            <header className='life-media-strip-header'>
                <p dir='ltr'>{labels.eyebrow}</p>
                <h2 id='life-media-strip-title'>{labels.title}</h2>
                <span>{labels.body}</span>
            </header>

            <div className='life-media-strip-grid'>
                {items.map((item, index) => (
                    <a
                        className={'life-media-card ' + (featuredIndexes.has(index) ? 'is-featured' : '')}
                        data-life-media-card={item.id}
                        href={item.url}
                        target='_blank'
                        rel='noreferrer'
                        key={item.id}
                    >
                        <figure>
                            <img
                                src={resolveImage(item.image || item.fallback)}
                                alt={item.title}
                                loading={index < 4 ? 'eager' : 'lazy'}
                                decoding='async'
                                referrerPolicy='no-referrer'
                                onError={event => {
                                    const image = event.currentTarget;
                                    if (image.dataset.fallbackApplied === '1') {
                                        image.style.display = 'none';
                                        return;
                                    }
                                    image.dataset.fallbackApplied = '1';
                                    image.src = resolveImage(item.fallback);
                                }}
                            />
                            <span>{item.category}</span>
                        </figure>
                        <div className='life-media-card-copy'>
                            <div className='life-media-card-meta'>
                                <small>{item.year}</small>
                                <small>{item.source}</small>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.summary}</p>
                            {item.metric ? <strong className='life-media-card-metric' dir='ltr'>{item.metric}</strong> : null}
                            <footer>
                                <small>{item.status}</small>
                                <b>{labels.open}<ExternalLink /></b>
                            </footer>
                        </div>
                    </a>
                ))}
            </div>

            <p className='life-media-strip-footer' dir='ltr'>{labels.footer}</p>
        </section>
    );
}
