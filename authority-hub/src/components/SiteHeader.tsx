import Link from 'next/link';
import { getDictionary, localeMeta, locales, type Locale, type PageSlug } from '@/lib/i18n';

const navItems: Array<{ slug: PageSlug; key: 'bio' | 'starton' | 'evidence' | 'timeline' | 'press' }> = [
  { slug: 'igor-vepretski', key: 'bio' },
  { slug: 'starton', key: 'starton' },
  { slug: 'evidence-wall', key: 'evidence' },
  { slug: 'timeline', key: 'timeline' },
  { slug: 'press', key: 'press' }
];

function localizedPath(locale: Locale, slug?: string) {
  const suffix = slug ? `/${slug}` : '';
  return locale === 'he' ? `${suffix || '/'}` : `/${locale}${suffix || ''}`;
}

type SiteHeaderProps = {
  locale: Locale;
  activeSlug?: PageSlug;
};

export function SiteHeader({ locale, activeSlug }: SiteHeaderProps) {
  const dictionary = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        <Link href={localizedPath(locale)} className="group flex items-center gap-3" aria-label={dictionary.brand}>
          <span className="grid size-11 place-items-center rounded-full border border-white/20 bg-white text-lg font-black text-black transition group-hover:scale-105">7</span>
          <span>
            <strong className="block text-xs tracking-[0.2em] text-white">{dictionary.brand}</strong>
            <span className="block text-[0.65rem] tracking-[0.16em] text-zinc-500">{dictionary.philosophy}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-zinc-400 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={localizedPath(locale, item.slug)}
              className={activeSlug === item.slug ? 'text-white' : 'transition hover:text-white'}
              aria-current={activeSlug === item.slug ? 'page' : undefined}
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2" aria-label="Language switcher">
          {locales.map((targetLocale) => (
            <Link
              key={targetLocale}
              href={localizedPath(targetLocale, activeSlug)}
              hrefLang={targetLocale}
              className={`border px-2.5 py-1.5 text-xs font-bold transition ${
                locale === targetLocale
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {localeMeta[targetLocale].label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
