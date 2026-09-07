# Grok Life Pulse Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure, renderer-agnostic adapter that converts the existing canonical 7YA corpus into evidence-preserving Life Pulse nodes so a future Grok spatial renderer can plug in without changing 7YA truth semantics.

**Architecture:** The adapter lives entirely inside the experimental Grok staging directory and has no React, WebGL, routing, network, backend, or production dependency. It accepts corpus-like events compatible with the current AppDeploy `CorpusEvent` contract, filters to public material, preserves verification/source/media/dated metric provenance, and returns sorted renderer-ready nodes. Future Grok code may render these nodes, but cannot redefine their factual meaning.

**Tech Stack:** TypeScript; Node 22 built-in `node:test` for the isolated contract test; existing 7YA canonical corpus semantics.

**Spec:** `docs/experiments/grok-build-20260907-audit.md`

## Global Constraints

- Branch: `experiment/grok-build-20260907` only.
- No production deployment.
- No modification of current `DocumentaryHome`, `PersonalChronology`, `EvidenceGraphExperience`, `InfluenceUniverse`, `StoryCompanion`, backend, or shared canonical graph/corpus modules in this slice.
- No sandbox URL runtime dependency.
- No generated biography, metric, event, testimonial, or evidence.
- Public claims must preserve canonical source and verification state.
- Cross-platform or cross-metric synthetic totals are forbidden.
- Renderer must remain replaceable; this slice contains no graphics library.

---

### Task 1: Canonical Life Pulse adapter

**Files:**
- Create: `experiments/grok-build-20260907/life-pulse-contract.ts`
- Create: `experiments/grok-build-20260907/life-pulse-contract.test.ts`

**Interfaces:**
- Consumes: `buildLifePulseNodes(events: CorpusEventLike[], locale: 'he' | 'en' | 'ru'): LifePulseNode[]`
- Produces: renderer-ready `LifePulseNode[]` sorted by `storyOrder`, each carrying canonical ID, title/summary, time label, trust state/evidence grade, public sources, optional source-linked media, tags, and unchanged dated metrics.

- [ ] **Step 1: Write the failing test**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLifePulseNodes, type CorpusEventLike} from './life-pulse-contract.ts';

const local = (value: string) => ({he: `${value}-he`, en: `${value}-en`, ru: `${value}-ru`});

function event(overrides: Partial<CorpusEventLike> = {}): CorpusEventLike {
  return {
    id: 'moment-a',
    storyOrder: 2,
    canonicalDate: '2024-10-28',
    visibility: 'public',
    title: local('title'),
    summary: local('summary'),
    verification: {state: 'verified', note: 'source checked'},
    sources: [{id: 'source-a', label: 'Source A', url: 'https://example.com/a', kind: 'article', public: true}],
    media: [{kind: 'image', sourceUrl: 'https://example.com/a', authenticity: 'source-linked', label: 'Frame A', url: 'https://example.com/a.jpg'}],
    tags: ['LIFE', 'EVIDENCE-A'],
    ...overrides,
  };
}

test('buildLifePulseNodes sorts by canonical story order and preserves evidence provenance', () => {
  const result = buildLifePulseNodes([
    event({id: 'later', storyOrder: 20, verification: {state: 'supported', note: 'corroborated'}}),
    event({id: 'earlier', storyOrder: 3, verification: {state: 'verified', note: 'primary source'}}),
  ], 'en');

  assert.deepEqual(result.map(node => node.canonicalId), ['earlier', 'later']);
  assert.equal(result[0].trust.state, 'verified');
  assert.equal(result[0].trust.evidenceGrade, 'A');
  assert.equal(result[0].primarySource?.url, 'https://example.com/a');
  assert.equal(result[0].media?.url, 'https://example.com/a.jpg');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --experimental-strip-types --test experiments/grok-build-20260907/life-pulse-contract.test.ts
```

Expected: FAIL because `life-pulse-contract.ts` does not yet exist.

- [ ] **Step 3: Add provenance and metric integrity tests**

```ts
test('buildLifePulseNodes keeps dated metrics source-local instead of synthesizing a total', () => {
  const result = buildLifePulseNodes([event({
    metrics: [
      {metricType: 'views', value: 1200, unit: 'views', snapshotDate: '2026-06-08', sourceUrl: 'https://example.com/ig', platform: 'Instagram', verification: 'verified'},
      {metricType: 'likes', value: 300, unit: 'likes', snapshotDate: '2026-06-08', sourceUrl: 'https://example.com/tt', platform: 'TikTok', verification: 'verified'},
    ],
  })], 'en');

  assert.equal(result[0].metrics.length, 2);
  assert.deepEqual(result[0].metrics.map(metric => metric.platform), ['Instagram', 'TikTok']);
  assert.equal('totalReach' in result[0], false);
  assert.equal('aggregate' in result[0], false);
});

test('buildLifePulseNodes excludes non-public events and private sources', () => {
  const result = buildLifePulseNodes([
    event({id: 'private-event', visibility: 'private'}),
    event({id: 'public-event', sources: [
      {id: 'private-source', label: 'Private', url: 'https://example.com/private', kind: 'note', public: false},
      {id: 'public-source', label: 'Public', url: 'https://example.com/public', kind: 'article', public: true},
    ]}),
  ], 'en');

  assert.deepEqual(result.map(node => node.canonicalId), ['public-event']);
  assert.equal(result[0].sources.length, 1);
  assert.equal(result[0].sources[0].id, 'public-source');
});
```

- [ ] **Step 4: Implement the minimal adapter**

```ts
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
```

- [ ] **Step 5: Run tests to verify green**

Run:

```bash
node --experimental-strip-types --test experiments/grok-build-20260907/life-pulse-contract.test.ts
```

Expected: 3 tests PASS, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add experiments/grok-build-20260907/life-pulse-contract.ts experiments/grok-build-20260907/life-pulse-contract.test.ts
git commit -m "feat(experiment): add evidence-safe Life Pulse contract"
```

### Task 2: Grok renderer gate

**Files:**
- Modify only after Grok source/export becomes inspectable: `docs/experiments/grok-build-20260907-audit.md`
- Future candidate location: `src/experiments/grok-life-pulse/`

**Interfaces:**
- Consumes: `LifePulseNode[]` from Task 1.
- Produces: a replaceable visual renderer with DOM fallback, reduced-motion behavior, keyboard/touch support, and optional lazy spatial/WebGL enhancement.

- [ ] **Step 1: Inspect Grok source/export and record exact upstream files/dependencies**

No implementation is allowed before exact files, dependencies, network calls, environment variables, assets, and licenses are known.

- [ ] **Step 2: Classify exact Grok files A/B/C/D**

A renderer file may be A/B/C only if it can consume the Task 1 contract without inventing factual fields or bypassing verification/source metadata.

- [ ] **Step 3: Write renderer acceptance tests before porting code**

At minimum, tests must prove: DOM fallback exists, reduced-motion disables non-essential continuous motion, keyboard activation reaches every interactive node, trust/source metadata remains accessible, and no sandbox URL is referenced.

- [ ] **Step 4: Port the smallest accepted renderer slice**

Do not copy the whole Grok application shell.

- [ ] **Step 5: Measure and review**

Verify bundle delta, mobile behavior, accessibility, LCP/CLS/interaction impact, API contract integrity, and absence of production/sandbox coupling before any integration beyond the experiment branch.
