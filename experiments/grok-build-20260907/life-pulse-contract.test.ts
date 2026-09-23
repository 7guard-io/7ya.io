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
