import Link from 'next/link';
import claimsData from '@/data/claims.json';
import { EvidenceCard } from '@/components/EvidenceCard';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader } from '@/components/SiteHeader';
import { getDictionary, type Locale, type PageSlug } from '@/lib/i18n';
import { personSchema, startonSchema } from '@/lib/schema';
import type { ClaimsDataset } from '@/types/claim';

const dataset = claimsData as ClaimsDataset;

function localizedHome(locale: Locale) {
  return locale === 'he' ? '/' : `/${locale}`;
}

export function AuthorityPage({ locale, slug }: { locale: Locale; slug: PageSlug }) {
  const dictionary = getDictionary(locale);
  const page = dictionary.pages[slug];
  const isEvidence = slug === 'evidence-wall';
  const schema = slug === 'igor-vepretski'
    ? personSchema(locale)
    : slug === 'starton'
      ? startonSchema(locale)
      : undefined;

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <SiteHeader locale={locale} activeSlug={slug} />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.10),transparent_30rem),radial-gradient(circle_at_85%_0%,rgba(80,120,255,0.14),transparent_28rem)]" />
          <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-36">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">{page.eyebrow}</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
              {page.title}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-300 lg:text-xl">{page.lead}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link className="border border-white bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200" href={localizedHome(locale)}>
                {dictionary.nav.home}
              </Link>
              {!isEvidence ? (
                <Link className="border border-zinc-700 px-5 py-3 text-sm font-black text-white transition hover:border-white" href={locale === 'he' ? '/evidence-wall' : `/${locale}/evidence-wall`}>
                  {dictionary.nav.evidence}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {isEvidence ? (
          <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">DATA SOURCE · src/data/claims.json</p>
                <h2 className="mt-3 text-3xl font-black text-white">{dataset.claims.length} canonical trust cards</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-zinc-500">
                Last updated {dataset.lastUpdated.slice(0, 10)} · Baseline {dataset.baselineDate}. Quarantined cards remain visible so absence of proof cannot be mistaken for proof.
              </p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {dataset.claims.map((claim) => (
                <EvidenceCard key={claim.id} claim={claim} locale={locale} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto grid max-w-7xl gap-px border-x border-b border-zinc-800 bg-zinc-800 md:grid-cols-3">
            {page.sections.map(([title, body], index) => (
              <article key={title} className="min-h-72 bg-black p-7 lg:p-10">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-zinc-600">0{index + 1}</span>
                <h2 className="mt-16 text-2xl font-black uppercase text-white">{title}</h2>
                <p className="mt-5 text-base leading-7 text-zinc-400">{body}</p>
              </article>
            ))}
          </section>
        )}
      </main>
      <footer className="border-t border-zinc-900 px-5 py-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
        7YA.IO · NOT FASHION. FORCE. · EVIDENCE BEFORE AMPLIFICATION
      </footer>
    </>
  );
}
