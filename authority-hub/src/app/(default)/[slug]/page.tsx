import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthorityPage } from '@/components/AuthorityPage';
import { getDictionary, isPageSlug, pageSlugs } from '@/lib/i18n';

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isPageSlug(slug)) return {};
  const page = getDictionary('he').pages[slug];

  return {
    title: page.title,
    description: page.lead,
    alternates: {
      canonical: `/${slug}/`,
      languages: {
        he: `/${slug}/`,
        en: `/en/${slug}/`,
        ru: `/ru/${slug}/`
      }
    },
    openGraph: {
      title: page.title,
      description: page.lead,
      url: `https://7ya.io/${slug}/`,
      locale: 'he_IL'
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPageSlug(slug)) notFound();
  return <AuthorityPage locale="he" slug={slug} />;
}
