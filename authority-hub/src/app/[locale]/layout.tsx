import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { isLocale, localeMeta } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'he') return {};
  const isRussian = locale === 'ru';

  return {
    metadataBase: new URL('https://7ya.io'),
    title: {
      default: isRussian ? '7YA Authority Hub — Игорь Вепрецкий' : '7YA Authority Hub — Igor Vepretski',
      template: '%s | 7YA'
    },
    description: isRussian
      ? 'Публичный центр авторитета Игоря Вепрецкого, StartOn и стены доказательств.'
      : 'The public authority hub for Igor Vepretski, StartOn and the Evidence Wall.',
    alternates: {
      canonical: `/${locale}/`,
      languages: { he: '/', en: '/en/', ru: '/ru/' }
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: '7YA Authority Hub',
      locale: isRussian ? 'ru_RU' : 'en_US',
      url: `https://7ya.io/${locale}/`
    }
  };
}

export default async function LocalizedRootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'he') notFound();

  return (
    <html lang={locale} dir={localeMeta[locale].dir}>
      <body>{children}</body>
    </html>
  );
}
