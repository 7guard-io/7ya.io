export const EXPERIENCE_INTENTS = ['know-igor', 'verify', 'collaborate', 'grow'] as const;

export type ExperienceIntent = typeof EXPERIENCE_INTENTS[number];
export type ExperienceLocale = 'he' | 'en' | 'ru';
export type ExperienceModule =
  | 'story'
  | 'featured-assets'
  | 'public-echo'
  | 'influence'
  | 'starton'
  | 'live'
  | 'chronology'
  | 'user-handoff'
  | 'growth-gateway'
  | 'public-action'
  | 'bro-chat-action'
  | 'evidence-examples';

export interface ExperienceContext {
  intent: ExperienceIntent;
  locale: ExperienceLocale;
  entry: string;
  scene: string;
  recentActions: string[];
}

export interface ExperienceAction {
  id: 'continue-story' | 'inspect-evidence' | 'contact-collaborate' | 'open-growth-chat';
  target: 'story' | 'evidence' | 'contact' | 'chat';
}

export interface ExperiencePlan {
  intent: ExperienceIntent;
  modules: ExperienceModule[];
  primaryAction: ExperienceAction;
}

export interface ProjectionLike {
  layer?: string;
  mediaType?: string;
  sourceKind?: string;
  topics?: readonly string[];
  relationships?: readonly string[];
  relatedLabels?: readonly string[];
  trust?: string;
  sourceUrl?: string;
  [key: string]: unknown;
}

const plans: Record<ExperienceIntent, ExperiencePlan> = {
  'know-igor': {
    intent: 'know-igor',
    modules: ['story', 'featured-assets', 'public-echo', 'influence', 'starton', 'live', 'chronology', 'user-handoff'],
    primaryAction: { id: 'continue-story', target: 'story' },
  },
  verify: {
    intent: 'verify',
    modules: ['influence', 'evidence-examples', 'featured-assets', 'public-echo', 'chronology', 'story', 'starton', 'user-handoff'],
    primaryAction: { id: 'inspect-evidence', target: 'evidence' },
  },
  collaborate: {
    intent: 'collaborate',
    modules: ['public-action', 'starton', 'featured-assets', 'public-echo', 'influence', 'chronology', 'story', 'user-handoff'],
    primaryAction: { id: 'contact-collaborate', target: 'contact' },
  },
  grow: {
    intent: 'grow',
    modules: ['growth-gateway', 'story', 'bro-chat-action', 'evidence-examples', 'starton', 'chronology', 'featured-assets', 'user-handoff'],
    primaryAction: { id: 'open-growth-chat', target: 'chat' },
  },
};

const intentKeywords: Record<ExperienceIntent, readonly string[]> = {
  'know-igor': ['igor', 'identity', 'origin', 'story', 'life', 'history', 'fatherhood', 'service', 'chronology', 'biography'],
  verify: ['evidence', 'source', 'verification', 'verified', 'proof', 'method', 'impact', 'provenance', 'research', 'press'],
  collaborate: ['collaborat', 'partner', 'speaker', 'media', 'starton', 'public-action', 'project', 'organization', 'contact', 'interview'],
  grow: ['growth', 'creator', 'learn', 'career', 'build', 'tool', 'personal', 'action', 'education', 'guide'],
};

function isIntent(value: unknown): value is ExperienceIntent {
  return typeof value === 'string' && (EXPERIENCE_INTENTS as readonly string[]).includes(value);
}

function cleanLocale(value: unknown): ExperienceLocale {
  return value === 'en' || value === 'ru' ? value : 'he';
}

function cleanEntry(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/';
  const path = value.split(/[?#]/, 1)[0].slice(0, 160);
  return /^\/[A-Za-z0-9_./:-]*$/.test(path) ? path : '/';
}

function cleanToken(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const token = value.trim().slice(0, 80);
  return /^[A-Za-z0-9:_-]+$/.test(token) ? token : fallback;
}

function cleanActions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const raw of value) {
    const action = cleanToken(raw);
    if (!action || out.includes(action)) continue;
    out.push(action);
    if (out.length === 8) break;
  }
  return out;
}

export function experiencePlan(intent: ExperienceIntent): ExperiencePlan {
  if (!isIntent(intent)) throw new Error('invalid experience intent');
  const plan = plans[intent];
  return {
    intent: plan.intent,
    modules: [...plan.modules],
    primaryAction: { ...plan.primaryAction },
  };
}

export function persistentExperienceSnapshot(input: Partial<ExperienceContext> & Record<string, unknown>) {
  const intent = isIntent(input.intent) ? input.intent : 'know-igor';
  return {
    version: 1 as const,
    intent,
    locale: cleanLocale(input.locale),
    entry: cleanEntry(input.entry),
    scene: cleanToken(input.scene, 'igor'),
    recentActions: cleanActions(input.recentActions),
  };
}

export function companionExperienceContext(input: Partial<ExperienceContext> & Record<string, unknown>): ExperienceContext {
  const snapshot = persistentExperienceSnapshot(input);
  return {
    intent: snapshot.intent,
    locale: snapshot.locale,
    entry: snapshot.entry,
    scene: snapshot.scene,
    recentActions: [...snapshot.recentActions],
  };
}

export function applyExperiencePatch(
  current: Partial<ExperienceContext> & Record<string, unknown>,
  patch: Record<string, unknown>,
): ExperienceContext {
  const base = companionExperienceContext(current);
  if (patch.intent !== undefined && !isIntent(patch.intent)) throw new Error('invalid experience intent');
  const action = cleanToken(patch.action);
  const recentActions = action ? cleanActions([...base.recentActions, action]) : base.recentActions;
  return {
    ...base,
    intent: isIntent(patch.intent) ? patch.intent : base.intent,
    recentActions,
  };
}

export function rankProjectionItem(item: ProjectionLike, intent: ExperienceIntent): number {
  if (!isIntent(intent)) throw new Error('invalid experience intent');
  const layer = String(item.layer || '').toUpperCase();
  const layerWeight: Record<string, number> = { CANON: 70, LIVE: 55, LEGACY: 35, DISCOVERY: 15, PENDING: -100 };
  const media = String(item.mediaType || '').toLowerCase();
  const mediaWeight: Record<string, number> = { video: 35, article: 25, audio: 20, document: 22, post: 12, image: 10 };
  const text = [
    item.sourceKind,
    item.mediaType,
    item.trust,
    ...(item.topics || []),
    ...(item.relationships || []),
    ...(item.relatedLabels || []),
  ].map(value => String(value || '').toLowerCase()).join(' ');

  let score = layerWeight[layer] ?? 0;
  score += mediaWeight[media] ?? 5;
  if (item.sourceUrl) score += 12;
  for (const keyword of intentKeywords[intent]) if (text.includes(keyword)) score += 28;
  if (intent === 'verify' && /press|official|evidence|source|verified|research/.test(text)) score += 55;
  if (intent === 'grow' && /growth|creator|learn|career|build|education|guide/.test(text)) score += 55;
  if (intent === 'collaborate' && /starton|speaker|partner|collaborat|media|interview/.test(text)) score += 55;
  if (intent === 'know-igor' && /identity|origin|story|life|history|fatherhood|service/.test(text)) score += 55;
  return score;
}
