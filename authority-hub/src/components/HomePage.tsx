import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader } from '@/components/SiteHeader';
import { getDictionary, type Locale } from '@/lib/i18n';
import { personSchema, startonSchema } from '@/lib/schema';

function path(locale: Locale, slug: string) {
  return locale === 'he' ? `/${slug}` : `/${locale}/${slug}`;
}

export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <>
      <JsonLd data={[personSchema(locale), startonSchema(locale)]} />
      <SiteHeader locale={locale} />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_34%),radial-gradient(circle_at_80%_25%,rgba(65,105,225,0.22),transparent_32rem)]" />
          <div className="relative mx-auto grid min-h-[78svh] max-w-7xl items-end gap-14 px-5 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-32">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">{dictionary.home.eyebrow}</p>
              <h1 className="mt-7 max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-[-0.07em] text-white sm:text-8xl lg:text-[7.8rem]">
                {dictionary.home.title}
              </h1>
              <p className="mt-9 max-w-3xl text-lg leading-8 text-zinc-300 lg:text-xl">{dictionary.home.lead}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link className="border border-white bg-white px-6 py-3.5 text-sm font-black text-black transition hover:bg-zinc-200" href={path(locale, 'igor-vepretski')}>
                  {dictionary.home.primary}
                </Link>
                <Link className="border border-zinc-700 px-6 py-3.5 text-sm font-black text-white transition hover:border-white" href={path(locale, 'evidence-wall')}>
                  {dictionary.home.secondary}
                </Link>
              </div>
            </div>

            <aside className="border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur lg:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">AUTHORITY MODEL</p>
              <ol className="mt-7 space-y-5">
                {dictionary.home.pillars.map((pillar, index) => (
                  <li key={pillar} className="flex gap-4 border-t border-zinc-800 pt-5 first:border-t-0 first:pt-0">
                    <span className="font-mono text-xs text-zinc-600">0{index + 1}</span>
                    <strong className="text-base text-zinc-100">{pillar}</strong>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-px border-x border-b border-zinc-800 bg-zinc-800 md:grid-cols-5">
          {[
            ['igor-vepretski', dictionary.nav.bio, 'PERSON'],
            ['starton', dictionary.nav.starton, 'ORGANIZATION'],
            ['evidence-wall', dictionary.nav.evidence, 'TRUST'],
            ['timeline', dictionary.nav.timeline, 'HISTORY'],
            ['press', dictionary.nav.press, 'MEDIA']
          ].map(([slug, label, category], index) => (
            <Link key={slug} href={path(locale, slug)} className="group min-h-64 bg-black p-6 transition hover:bg-zinc-950">
              <span className="font-mono text-xs text-zinc-700">0{index + 1}</span>
              <p className="mt-20 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-600">{category}</p>
              <h2 className="mt-3 text-xl font-black uppercase text-white transition group-hover:translate-x-1">{label} →</h2>
            </Link>
          ))}
        </section>
      </main>
      <footer className="border-t border-zinc-900 px-5 py-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
        7YA.IO · NOT FASHION. FORCE. · HUMAN FIRST
      </footer>
    </>
  );
}
