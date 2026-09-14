import { ArrowUpLeft } from 'lucide-react';
import { deepMedia, type DeepMediaItem } from './deep-media-data';
import { itemText, pageHref, rootHref, useLocale, type Locale } from './locale';
import './owner-archive-strip.css';

type LocalText = Record<Locale, string>;

type OwnerFrame = {
    id: string;
    src: string;
    label: string;
    title: LocalText;
    note: LocalText;
    href: (locale: Locale) => string;
};

type RenderFrame = {
    id: string;
    src: string;
    label: string;
    title: string;
    note: string;
    href: string;
    external: boolean;
    kind: 'owner' | 'source';
};

const copy: Record<Locale, { eyebrow: string; title: string; body: string; open: string }> = {
    he: {
        eyebrow: 'IGOR MEDIA · ORIGINAL + SOURCE-LINKED',
        title: 'יותר איגור. כבר מהמסך הראשון.',
        body: 'עשרה פריימים אמיתיים במקום שלוש תמונות בודדות: חיים, במה, StartOn, שירות, אבהות, פעולה ציבורית, ויראליות, מוזיקה ושיחות עומק. כל פריים הוא צילום מקורי או ויזואל שמוביל למקור הציבורי שלו.',
        open: 'לפתיחת הרגע',
    },
    en: {
        eyebrow: 'IGOR MEDIA · ORIGINAL + SOURCE-LINKED',
        title: 'More Igor, right from the first screen.',
        body: 'Ten real frames instead of three isolated photographs: life, stage, StartOn, service, fatherhood, civic action, viral culture, music and long-form conversation. Every frame is original or tied directly to its public source.',
        open: 'Open the moment',
    },
    ru: {
        eyebrow: 'IGOR MEDIA · ORIGINAL + SOURCE-LINKED',
        title: 'Больше Игоря — уже с первого экрана.',
        body: 'Десять реальных кадров вместо трёх отдельных фотографий: жизнь, сцена, StartOn, служба, отцовство, общественное действие, вирусный контент, музыка и большие разговоры. Каждый кадр оригинальный или связан с публичным источником.',
        open: 'Открыть момент',
    },
};

const ownerFrames: OwnerFrame[] = [
    {
        id: 'owner-life',
        src: 'resources/drive-life-photo.jpg',
        label: 'OWNER ARCHIVE · LIFE',
        title: { he: 'רגע מתוך החיים.', en: 'A frame from the life.', ru: 'Кадр из жизни.' },
        note: {
            he: 'צילום מקורי מתוך הארכיון הציבורי המאושר.',
            en: 'Original photograph from the approved public owner archive.',
            ru: 'Оригинальный кадр из подтверждённого публичного архива владельца.',
        },
        href: () => rootHref('igor-vepretski/'),
    },
    {
        id: 'owner-stage',
        src: 'resources/drive-speaker-photo.jpg',
        label: 'OWNER ARCHIVE · STAGE',
        title: { he: 'על הבמה.', en: 'On stage.', ru: 'На сцене.' },
        note: {
            he: 'צילום מקורי מתוך ארכיון ההרצאות וההופעות.',
            en: 'Original photograph from the speaking and appearances archive.',
            ru: 'Оригинальный кадр из архива выступлений.',
        },
        href: locale => pageHref('speaker', locale),
    },
];

const sourceIds = [
    'starton-14',
    'police-exit-2023',
    'russian-education-legacy',
    'father-hidabroot',
    'fraud-13',
    'excel-video',
    'bizzi-video',
    'nova-long',
] as const;

const sourceFrames = sourceIds
    .map(id => deepMedia.find(item => item.id === id))
    .filter((item): item is DeepMediaItem => Boolean(item));

export default function OwnerArchiveStrip() {
    const { locale, dir } = useLocale();
    const c = copy[locale];

    const frames: RenderFrame[] = [
        ...ownerFrames.map(frame => ({
            id: frame.id,
            src: rootHref(frame.src),
            label: frame.label,
            title: frame.title[locale],
            note: frame.note[locale],
            href: frame.href(locale),
            external: false,
            kind: 'owner' as const,
        })),
        ...sourceFrames.map(item => {
            const local = itemText(item.id, locale, item.title, item.summary);
            return {
                id: item.id,
                src: item.image,
                label: `${item.source} · ${item.year}`,
                title: local.title,
                note: local.summary,
                href: item.url,
                external: true,
                kind: 'source' as const,
            };
        }),
    ];

    return (
        <section className='owner-archive-strip' dir={dir} aria-labelledby='owner-archive-title'>
            <div className='public-shell owner-archive-shell'>
                <header className='owner-archive-head'>
                    <div>
                        <small dir='ltr'>{c.eyebrow}</small>
                        <h2 id='owner-archive-title'>{c.title}</h2>
                    </div>
                    <p>{c.body}</p>
                </header>
                <div className='owner-archive-grid' aria-label={c.title}>
                    {frames.map((frame, index) => (
                        <a
                            className='owner-archive-card'
                            href={frame.href}
                            key={frame.id}
                            target={frame.external ? '_blank' : undefined}
                            rel={frame.external ? 'noreferrer' : undefined}
                            data-media-kind={frame.kind}
                            data-owner-original={frame.kind === 'owner' ? 'true' : undefined}
                            data-source-id={frame.id}
                        >
                            <figure>
                                <img
                                    src={frame.src}
                                    alt={frame.title}
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                    decoding='async'
                                    referrerPolicy={frame.external ? 'no-referrer' : undefined}
                                    data-owner-original-photo={frame.kind === 'owner' ? 'true' : undefined}
                                    onError={event => {
                                        event.currentTarget.style.display = 'none';
                                        event.currentTarget.closest('figure')?.setAttribute('data-image-failed', 'true');
                                    }}
                                />
                                <figcaption>
                                    <small dir='ltr'>{frame.label}</small>
                                    <strong>{frame.title}</strong>
                                    <span>{frame.note}</span>
                                    <b>{c.open}<ArrowUpLeft /></b>
                                </figcaption>
                            </figure>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
