# 7YA Cinematic Story + Resilient Ingestion Design

## Status
Approved by Igor Vepretski on 2026-09-09.

## Product thesis
7YA is not a portfolio, dashboard, or magazine. It is an interactive documentary about Igor Vepretski, backed by a living evidence system. The public experience must lead with the human story and keep system language, evidence mechanics, and archive scale one layer deeper.

## Visitor flow
Primary sequence: **IGOR → STORY → EVIDENCE → IDEAS → ACTION**.

The homepage becomes one authored seven-chapter narrative:
1. Origin — Kharkiv, immigration, Jesse Cohen, belonging.
2. Service — army, security, policing, responsibility.
3. Return — Jesse Cohen, youth, the reason StartOn exists.
4. Voice — viral/public media, distribution, television, public conversation.
5. Creation — music, video, culture and experimentation.
6. Ideas — research, AI, evidence-first thinking and 7YA.
7. Now — StartOn, public leadership, technology, media and the current chapter.

Each chapter uses one dominant authentic visual or source-bound media object, concise copy, optional playable media, and a discreet source action. No collage, no generic imagery, no dashboard-first UI.

## Homepage simplification
The current homepage contains duplicate product layers because `LivingFrontDoor` is rendered inside `DocumentaryHome` and both independently provide hero/story/media/archive structures. The new homepage must have one primary hero, one narrative spine, one recent-publication surface, one deep-archive handoff, and Bro Chat as an optional companion rather than a competing first-fold destination.

System-facing components such as Asset Intelligence, repeated archive entrances, repeated identity copy, duplicate media rails, and visible taxonomy are removed from or moved below the primary narrative.

## Visual language
Cinematic × editorial × raw human × technically precise.

- Real Igor imagery first.
- Full-bleed photography/video where useful.
- Large typography used sparingly.
- Near-black/warm-neutral environment.
- Restrained motion and transitions.
- Source markers behave like documentary footnotes.
- Hebrew, English and Russian remain first-class.
- Technology should disappear until the visitor asks for depth.

## Resilient content projection
The homepage must not depend exclusively on live `/api/*` ingress.

Data path:
`Canonical Corpus → Home Projection Builder → versioned static public snapshot → immediate render → live API enrichment when available`.

The static projection is the durable baseline and must contain curated/source-bound public items required for the homepage. Live API data may enrich, replace fresher equivalents, and add recent records, but an API failure must not make known content disappear.

The page must expose a small visible freshness/status signal only when useful; it must not surface technical failure text to ordinary visitors.

## Ingestion/control path
A Telegram-ready private Inbox is the operational control surface.

Expected flow:
`Telegram update → secure webhook → normalize intake → evidence-first extraction → pending intake record → explicit approval gate → canonical commit → projection rebuild → release → public verification`.

Security and truth rules:
- Webhook is disabled unless required secret configuration exists.
- Secret values never appear in source, logs, or client responses.
- Unknown senders are rejected.
- Intake is pending by default; no automatic public publishing.
- Existing evidence-first validation/publishability rules remain authoritative.
- The Telegram layer must reuse the canonical ingestion engine rather than create a third truth store.

The first implementation may be "Telegram-ready" before a bot credential is bound, but must expose a derived configuration status so activation state is unambiguous.

## Release truth gate
A production change is accepted only when:
1. AppDeploy applied source is updated.
2. Public `https://7ya.io/` visibly shows the intended change.
3. Representative nested routes remain healthy.
4. Required API routes return JSON contracts rather than SPA HTML where public ingress is expected.
5. Mobile and desktop screenshots are inspected.
6. Visual hierarchy, clipping, source affordances and content density are reviewed from pixels.

## Final visual review deliverable
At completion, provide Igor with a visual review that explains:
- what is visible on desktop and mobile;
- each major section’s role and intended user behavior;
- why the visual hierarchy was chosen;
- how authentic media and source actions function;
- how the archive and Bro Chat fit the journey;
- any remaining visual or operational limitations.

The review must be based on fresh live screenshots, not code assumptions.
