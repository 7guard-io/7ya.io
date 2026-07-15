import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://7ya.io'),
  title: {
    default: '7YA Authority Hub — איגור ופרצקי',
    template: '%s | 7YA'
  },
  description: 'מרכז הסמכות הציבורי של איגור ופרצקי, StartOn וקיר הראיות.',
  alternates: {
    canonical: '/',
    languages: {
      he: '/',
      en: '/en',
      ru: '/ru'
    }
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: '7YA Authority Hub',
    title: '7YA Authority Hub — לא אופנה. כוח.',
    description: 'זהות ציבורית, StartOn, מקורות, גבולות הוכחה ודרך פעולה לנוער בסיכון.',
    url: 'https://7ya.io/'
  }
};

export default function HebrewRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
