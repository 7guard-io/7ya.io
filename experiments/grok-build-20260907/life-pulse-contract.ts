export type Locale = 'he' | 'en' | 'ru';
export type LocalText = Record<Locale, string>;

export type CorpusSourceLike = {
  id: string;
  label: string;
  url: string;
  kind: string;
  public: boolean;
  platform?: string;
  publishedAt?: string;
};

export type CorpusMediaLike = {
  kind: string;
  sourceUrl: string;
  authenticity: string;
  label: string;
  url?: string;
  captureDate?: string;
  publicationDate?: string;
};

export type CorpusMetricLike = {
  metricType: string;
  value: number | string;
  unit: string;
  snapshotDate: string;
  sourceUrl: string;
  platform?: string;
  verification: string;
};

export type CorpusEventLike = {
  id: string;
  storyOrder: number;
  canonicalDate: string;
  visibility: string;
  title: LocalText;
  summary: LocalText;
  verification: {state: string; note: string};
  sources: CorpusSourceLike[];
  media: CorpusMediaLike[];
  tags: string[];
  metrics?: CorpusMetricLike[];
  subjectPeriod?: string;
  period?: {start: string; end?: string};
};

export type LifePulseNode = {
  canonicalId: string;
  storyOrder: number;
  timeLabel: string;
  title: string;
  summary: string;
  trust: {state: string; note: string; evidenceGrade?: string};
  sources: CorpusSourceLike[];
  primarySource?: CorpusSourceLike;
  media?: CorpusMediaLike;
  tags: string[];
  metrics: CorpusMetricLike[];
};

function evidenceGrade(tags: string[]) {
  const match = tags.find(tag => /^EVIDENCE-[ABCD]$/.test(tag));
  return match?.slice(-1);
}

function timeLabel(event: CorpusEventLike) {
  if (event.subjectPeriod) return event.subjectPeriod;
  if (event.period?.end) return `${event.period.start}—${event.period.end}`;
  if (event.period?.start) return event.period.start;
  return event.canonicalDate.slice(0, 4);
}

export function buildLifePulseNodes(events: CorpusEventLike[], locale: Locale): LifePulseNode[] {
  return events
    .filter(event => event.visibility === 'public')
    .sort((a, b) => a.storyOrder - b.storyOrder)
    .map(event => {
      const sources = event.sources.filter(source => source.public);
      return {
        canonicalId: event.id,
        storyOrder: event.storyOrder,
        timeLabel: timeLabel(event),
        title: event.title[locale],
        summary: event.summary[locale],
        trust: {
          state: event.verification.state,
          note: event.verification.note,
          evidenceGrade: evidenceGrade(event.tags),
        },
        sources,
        primarySource: sources[0],
        media: event.media.find(item => Boolean(item.url)),
        tags: [...event.tags],
        metrics: (event.metrics ?? []).map(metric => ({...metric})),
      };
    });
}
