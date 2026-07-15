import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthorityPage } from '@/components/AuthorityPage';
import { getDictionary, isLocale, isPageSlug, pageSlugs } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return ['en', 'ru'].flatMap((locale) => pageSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === 'he' || !isPageSlug(slug)) return {};
  const page = getDictionary(locale).pages[slug];

  return {
    title: page.title,
    description: page.lead,
    alternates: {
      canonical: `/${locale}/${slug}/`,
      languages: {
        he: `/${slug}/`,
        en: `/en/${slug}/`,
        ru: `/ru/${slug}/`
      }
    },
    openGraph: {
      title: page.title,
      description: page.lead,
      url: `https://7ya.io/${locale}/${slug}/`,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US'
    }
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === 'he' || !isPageSlug(slug)) notFound();
  return <AuthorityPage locale={locale} slug={slug} />;
}
