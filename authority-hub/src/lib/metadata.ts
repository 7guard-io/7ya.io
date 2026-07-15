import type { Metadata } from 'next';
import { getDictionary, type Locale, type PageSlug } from '@/lib/i18n';

export function pageMetadata(locale: Locale, slug: PageSlug): Metadata {
  const page = getDictionary(locale).pages[slug];
  const prefix = locale === 'he' ? '' : `/${locale}`;
  const canonical = `${prefix}/${slug}/`;

  return {
    title: page.title,
    description: page.lead,
    alternates: {
      canonical,
      languages: {
        he: `/${slug}/`,
        en: `/en/${slug}/`,
        ru: `/ru/${slug}/`
      }
    },
    openGraph: {
      title: page.title,
      description: page.lead,
      url: `https://7ya.io${canonical}`,
      locale: locale === 'he' ? 'he_IL' : locale === 'ru' ? 'ru_RU' : 'en_US'
    }
  };
}
