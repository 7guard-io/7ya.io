import { useState } from 'react';
import { ArrowUpRight, BookOpen, ShieldCheck } from 'lucide-react';
import { rootHref, useLocale } from './locale';
import { supernoahAsset } from './asset-projection';
import './featured-asset-projection.css';

type FeaturedAssetProjectionProps = {
  variant?: 'home' | 'research';
};

export default function FeaturedAssetProjection({ variant = 'home' }: FeaturedAssetProjectionProps) {
  const { locale, dir } = useLocale();
  const asset = supernoahAsset;
  const fallback = rootHref(asset.fallbackImage);
  const [imageSrc, setImageSrc] = useState(asset.coverUrl);
  const researchHref = rootHref((locale === 'he' ? '' : locale + '/') + 'research/');
  const sourcePrefix = locale === 'he' ? 'מקור ציבורי' : locale === 'ru' ? 'Публичный источник' : 'Public source';
  const evidencePrefix = locale === 'he' ? 'סטטוס' : locale === 'ru' ? 'Статус' : 'Status';

  const handleImageError = () => {
    if (imageSrc !== fallback) setImageSrc(fallback);
  };

  return (
    <section className={'featured-asset featured-asset--' + variant} dir={dir} data-projection-asset={asset.id} aria-labelledby={'featured-asset-title-' + variant}>
      <div className='featured-asset__shell'>
        <figure className='featured-asset__media'>
          <div className='featured-asset__media-head'>
            <span>{asset.published}</span>
            <span>{sourcePrefix}</span>
          </div>
          <img src={imageSrc} onError={handleImageError} alt={asset.title + ' — ' + asset.subtitle} loading={variant === 'home' ? 'eager' : 'lazy'} />
          <figcaption>
            <span>{asset.sourceLabel}</span>
            <span>AUTHENTIC SOURCE OBJECT</span>
          </figcaption>
        </figure>

        <div className='featured-asset__copy'>
          <p className='featured-asset__eyebrow' dir='ltr'>{asset.eyebrow[locale]}</p>
          <h2 id={'featured-asset-title-' + variant}>{asset.title}</h2>
          <p className='featured-asset__subtitle'>{asset.subtitle}</p>
          <p className='featured-asset__question'>{asset.question[locale]}</p>
          <p className='featured-asset__summary'>{asset.summary[locale]}</p>

          <div className='featured-asset__status'>
            <ShieldCheck aria-hidden='true' />
            <span><b>{evidencePrefix}</b>{asset.status[locale]}</span>
          </div>

          <div className='featured-asset__metric' aria-label={asset.metric.note[locale]}>
            <strong dir='ltr'>{asset.metric.value}</strong>
            <div>
              <b>{asset.metric.label[locale]}</b>
              <span>{asset.metric.note[locale]}</span>
            </div>
          </div>

          <nav className='featured-asset__actions'>
            <a className='featured-asset__primary' href={asset.sourceUrl} target='_blank' rel='noreferrer'>
              <BookOpen aria-hidden='true' />{asset.primaryAction[locale]}<ArrowUpRight aria-hidden='true' />
            </a>
            {variant === 'home' && (
              <a className='featured-asset__secondary' href={researchHref}>{asset.secondaryAction[locale]}<ArrowUpRight aria-hidden='true' /></a>
            )}
          </nav>
        </div>
      </div>

      <div className='featured-asset__framework' aria-label='SUPERNOAH framework'>
        {asset.framework.map((item) => (
          <article key={item.label}>
            <small dir='ltr'>{item.label}</small>
            <p>{item.body[locale]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
