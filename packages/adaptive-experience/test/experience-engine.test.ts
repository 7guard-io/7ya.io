import test from 'node:test';
import assert from 'node:assert/strict';
import {
  experiencePlan,
  persistentExperienceSnapshot,
  companionExperienceContext,
  applyExperiencePatch,
  rankProjectionItem,
} from '../src/experience-engine.js';

test('four intents produce distinct module orders and primary actions', () => {
  const intents = ['know-igor', 'verify', 'collaborate', 'grow'] as const;
  const plans = intents.map(experiencePlan);
  assert.equal(new Set(plans.map(plan => plan.modules.join('|'))).size, 4);
  assert.equal(new Set(plans.map(plan => plan.primaryAction.id)).size, 4);
});

test('persistence strips free text and arbitrary fields', () => {
  const snapshot = persistentExperienceSnapshot({
    intent: 'grow',
    locale: 'he',
    entry: '/',
    scene: 'story',
    recentActions: ['story-opened', 'chat-opened'],
    detail: 'secret free text',
    arbitrary: 'nope',
  });

  assert.deepEqual(snapshot, {
    version: 1,
    intent: 'grow',
    locale: 'he',
    entry: '/',
    scene: 'story',
    recentActions: ['story-opened', 'chat-opened'],
  });
  assert.equal('detail' in snapshot, false);
  assert.equal('arbitrary' in snapshot, false);
});

test('verify and grow rank mixed projection differently without mutation', () => {
  const evidence = {
    id: 'e',
    mediaType: 'article',
    sourceKind: 'press',
    topics: ['evidence', 'source', 'verification'],
    layer: 'CANON',
    trust: 'VERIFIED',
    sourceUrl: 'https://example.com/e',
  };
  const growth = {
    id: 'g',
    mediaType: 'video',
    sourceKind: 'owned-public-post',
    topics: ['growth', 'creator', 'learning'],
    layer: 'CANON',
    trust: 'VERIFIED',
    sourceUrl: 'https://example.com/g',
  };
  const before = JSON.stringify([evidence, growth]);

  assert.ok(rankProjectionItem(evidence, 'verify') > rankProjectionItem(growth, 'verify'));
  assert.ok(rankProjectionItem(growth, 'grow') > rankProjectionItem(evidence, 'grow'));
  assert.equal(JSON.stringify([evidence, growth]), before);
});

test('companion receives the same intent and bounded context', () => {
  const current = {
    intent: 'collaborate',
    locale: 'en',
    entry: '/speaker/',
    scene: 'media',
    recentActions: ['speaker-opened'],
  } as const;

  assert.deepEqual(companionExperienceContext(current), {
    intent: 'collaborate',
    locale: 'en',
    entry: '/speaker/',
    scene: 'media',
    recentActions: ['speaker-opened'],
  });
});

test('patch accepts only known intent and bounded action', () => {
  const current = {
    intent: 'know-igor',
    locale: 'he',
    entry: '/',
    scene: 'igor',
    recentActions: [],
  } as const;

  const next = applyExperiencePatch(current, {
    intent: 'verify',
    action: 'source-opened',
    detail: 'must-not-leak',
  });

  assert.equal(next.intent, 'verify');
  assert.deepEqual(next.recentActions, ['source-opened']);
  assert.equal('detail' in next, false);
  assert.throws(() => applyExperiencePatch(current, { intent: 'admin' }), /invalid experience intent/);
});
