import { notFound } from 'next/navigation';
import { HomePage } from '@/components/HomePage';
import { isLocale } from '@/lib/i18n';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'he') notFound();
  return <HomePage locale={locale} />;
}
