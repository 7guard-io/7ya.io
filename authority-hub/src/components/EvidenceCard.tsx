import type { EvidenceClaim } from '@/types/claim';

export type Locale = 'he' | 'en' | 'ru';

type EvidenceCardProps = {
  claim: EvidenceClaim;
  locale: Locale;
};

const statusTone: Record<EvidenceClaim['status'], string> = {
  VERIFIED: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
  VERIFIED_WITH_ATTRIBUTION: 'border-cyan-400/35 bg-cyan-400/10 text-cyan-300',
  DATED_BASELINE: 'border-blue-400/35 bg-blue-400/10 text-blue-300',
  QUARANTINED: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
  CAPTURE_REQUIRED: 'border-violet-400/35 bg-violet-400/10 text-violet-300'
};

const labels = {
  he: {
    proves: 'מה זה מוכיח',
    limits: 'מה זה לא מוכיח',
    source: 'מקור לאימות',
    internal: 'מקור פנימי מוגן',
    snapshot: 'צילום מצב'
  },
  en: {
    proves: 'What this proves',
    limits: 'What this does not prove',
    source: 'Verification source',
    internal: 'Protected internal source',
    snapshot: 'Snapshot'
  },
  ru: {
    proves: 'Что это доказывает',
    limits: 'Чего это не доказывает',
    source: 'Источник проверки',
    internal: 'Защищенный внутренний источник',
    snapshot: 'Снимок состояния'
  }
} satisfies Record<Locale, Record<string, string>>;

export function EvidenceCard({ claim, locale }: EvidenceCardProps) {
  const copy = labels[locale];
  const isExternal = /^https?:\/\//.test(claim.sourceUrl);

  return (
    <article className="group flex h-full flex-col border border-zinc-800 bg-zinc-950/85 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-zinc-600">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em]">
        <div>
          <p className="text-zinc-500">{claim.id}</p>
          <p className="mt-1 text-zinc-300">{claim.entity}</p>
        </div>
        <span className={`border px-2.5 py-1 font-bold ${statusTone[claim.status]}`}>
          {claim.status.replaceAll('_', ' ')}
        </span>
      </div>

      <div className="pt-5">
        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-100">
          {claim.title[locale]}
        </h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
          {claim.evidenceClass}
        </p>
        {claim.snapshotDate ? (
          <p className="mt-3 text-xs text-zinc-400">
            {copy.snapshot}: <time dateTime={claim.snapshotDate}>{claim.snapshotDate}</time>
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 text-sm leading-7">
        <section className="border-s-2 border-emerald-400 ps-4">
          <h3 className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-zinc-500">
            {copy.proves}
          </h3>
          <p className="mt-2 text-zinc-200">{claim.whatItProves[locale]}</p>
        </section>

        <section className="border-s-2 border-zinc-700 ps-4">
          <h3 className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-zinc-500">
            {copy.limits}
          </h3>
          <p className="mt-2 text-zinc-400">{claim.whatItDoesNotProve[locale]}</p>
        </section>
      </div>

      <footer className="mt-auto border-t border-zinc-900 pt-5 text-xs">
        <p className="font-mono uppercase tracking-[0.14em] text-zinc-600">{copy.source}</p>
        {isExternal ? (
          <a
            className="mt-2 inline-flex break-all text-zinc-300 underline decoration-zinc-700 underline-offset-4 transition hover:text-white"
            href={claim.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {claim.sourceName} →
          </a>
        ) : (
          <div className="mt-2">
            <p className="text-zinc-300">{claim.sourceName}</p>
            <code className="mt-1 block break-all text-zinc-600">{copy.internal}: {claim.sourceUrl}</code>
          </div>
        )}
      </footer>
    </article>
  );
}
