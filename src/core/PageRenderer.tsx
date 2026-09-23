import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../locale';
import { getCoreProjection } from './core-client';
import type { CoreProjectionResponse, CoreRecord, CoreRouteKey } from './core-types';

const canonicalPath: Record<CoreRouteKey, string> = { home: '', story: 'story/', media: 'media/', politics: 'politics/', starton: 'starton/', music: 'music/', research: 'research/', archive: 'archive/' };

function setMeta(name: string, content: string) {
    let node = document.head.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null;
    if (!node) { node = document.createElement('meta'); node.name = name; document.head.appendChild(node); }
    node.content = content;
}

function RecordCard({ record, locale, lead = false }: { record: CoreRecord; locale: 'he' | 'en' | 'ru'; lead?: boolean }) {
    const image = record.media.find(media => media.kind === 'image' && media.url);
    const source = record.sources[0];
    const date = record.publishedAt || record.occurredAt;
    return <article className={`core-card${lead ? ' core-card-lead' : ''}`} data-core-record={record.id}>
        {image ? <a className='core-card-media' href={source?.url || image.sourceUrl || image.url} target='_blank' rel='noreferrer'><img src={image.url} alt={image.alt?.[locale] || record.title[locale]} loading={lead ? 'eager' : 'lazy'} referrerPolicy='no-referrer' onError={event => { event.currentTarget.hidden = true; }} /></a> : null}
        <div className='core-card-body'>
            <div className='core-card-meta'><span>{record.status.toUpperCase()}</span><span>{record.trust.toUpperCase()}</span>{date ? <time>{date.slice(0, 10)}</time> : null}</div>
            <h2>{record.title[locale] || record.title.en}</h2>
            <p>{record.story[locale] || record.story.en}</p>
            {record.domains.length ? <div className='core-tags'>{record.domains.slice(0, 5).map(domain => <span key={domain}>#{domain}</span>)}</div> : null}
            {record.metrics.length ? <div className='core-metrics'>{record.metrics.slice(0, 3).map(metric => <span key={`${metric.label}-${metric.value}`}><strong>{metric.value}</strong>{metric.label}</span>)}</div> : null}
            {source ? <a className='core-source-link' href={source.url} target='_blank' rel='noreferrer'>↗ {source.publisher || source.platform || source.label}</a> : null}
        </div>
    </article>;
}

export default function PageRenderer({ route }: { route: CoreRouteKey }) {
    const { locale } = useLocale();
    const [data, setData] = useState<CoreProjectionResponse | null>(null);
    const [error, setError] = useState(false);
    const query = useMemo(() => route === 'archive' ? new URLSearchParams(window.location.search).get('q') || '' : '', [route]);

    useEffect(() => {
        let active = true;
        setData(null);
        setError(false);
        getCoreProjection(route, query).then(value => { if (active) setData(value); }).catch(() => { if (active) setError(true); });
        return () => { active = false; };
    }, [route, query]);

    useEffect(() => {
        if (!data) return;
        const title = data.composition.title[locale] || data.composition.title.en;
        const description = data.composition.description[locale] || data.composition.description.en;
        document.title = route === 'home' ? `Igor Vepretski · 7YA Core` : `${title} · Igor Vepretski`;
        setMeta('description', description);
        let canonical = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
        if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
        const prefix = locale === 'he' ? '' : `${locale}/`;
        canonical.href = `https://7ya.io/${prefix}${canonicalPath[route]}`;
    }, [data, locale, route]);

    if (error) return <section className='core-state core-state-error' role='alert'><strong>CORE TEMPORARILY UNAVAILABLE</strong><p>{locale === 'he' ? 'ה־Core לא נטען. האתר לא מציג שכבת fallback ישנה כאילו הכול תקין.' : locale === 'ru' ? 'Core временно недоступен. Старая система не подменяет результат.' : 'Core could not load. The legacy public system is not silently substituted.'}</p></section>;
    if (!data) return <section className='core-state' aria-live='polite'><span className='core-pulse' />7YA CORE · loading the public record…</section>;

    const heroRecord = data.records.find(record => record.media.some(media => media.kind === 'image')) || data.records[0];
    const heroImage = heroRecord?.media.find(media => media.kind === 'image');
    const title = data.composition.title[locale] || data.composition.title.en;
    const description = data.composition.description[locale] || data.composition.description.en;

    return <>
        <section className='core-hero'>
            <div className='core-hero-copy'>
                <p className='core-kicker'>7YA CORE · ONE PUBLIC RECORD · {data.coreCount} RECORDS</p>
                {route === 'home' ? <h1>IGOR VEPRETSKI</h1> : <h1>{title}</h1>}
                {route === 'home' ? <h2>{title}</h2> : null}
                <p className='core-deck'>{description}</p>
                <div className='core-hero-stats'><span><strong>{data.count}</strong>{locale === 'he' ? ' בפרויקט הנוכחי' : locale === 'ru' ? ' в этой проекции' : ' in this projection'}</span><span><strong>{Object.keys(data.facets).length}</strong>{locale === 'he' ? ' תחומי תוכן' : locale === 'ru' ? ' тематик' : ' content domains'}</span><span><strong>{data.release}</strong>runtime source</span></div>
            </div>
            {heroImage && heroRecord ? <a className='core-hero-media' href={heroRecord.sources[0]?.url || heroImage.sourceUrl || heroImage.url} target='_blank' rel='noreferrer'><img src={heroImage.url} alt={heroImage.alt?.[locale] || heroRecord.title[locale]} referrerPolicy='no-referrer' onError={event => { event.currentTarget.hidden = true; }} /><span>{heroRecord.title[locale] || heroRecord.title.en}</span></a> : null}
        </section>

        {route === 'archive' ? <form className='core-search' method='get'><label htmlFor='core-q'>{locale === 'he' ? 'חיפוש בכל ה־Core' : locale === 'ru' ? 'Поиск по Core' : 'Search the whole Core'}</label><div><input id='core-q' name='q' defaultValue={query} placeholder={locale === 'he' ? 'משטרה, ילדות, StartOn, מוזיקה…' : 'police, childhood, StartOn, music…'} /><button type='submit'>{locale === 'he' ? 'חפש' : locale === 'ru' ? 'Найти' : 'Search'}</button></div></form> : null}

        {data.records.length ? <section className='core-grid' aria-label={title}>{data.records.map((record, index) => <RecordCard key={record.id} record={record} locale={locale} lead={index < 2} />)}</section> : <section className='core-state'><strong>CORE EMPTY FOR THIS VIEW</strong><p>{locale === 'he' ? 'אין כרגע רשומות מתאימות לפרויקט הזה. הרשומות לא מומצאות ולא מוחלפות בתוכן גנרי.' : locale === 'ru' ? 'Для этой проекции пока нет записей. Ничего не выдумывается и не заменяется шаблонным контентом.' : 'There are no matching records for this projection yet. Nothing is invented or replaced with generic content.'}</p></section>}
    </>;
}
