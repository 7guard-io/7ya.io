# 7YA First-Person Living Autobiography — Design

**Date:** 2026-08-18
**Status:** Approved by Igor in chat; implementation authorized

## Goal

Turn 7YA from a biography/evidence interface into a **living first-person autobiography** in which Igor Vepretski narrates his own life with maximum personal depth, while real photographs, posts, viral distribution, interviews, podcasts, broadcasts, music, research and public action appear inside the chronology at the moment they belong.

The experience must explain not only what Igor did, but **what happened to him, what it did to him, what he published from it, how the public responded, and what he understands about it now**.

## Core thesis

**Pain → understanding → responsibility → building → opportunity for others.**

The story is not a monument and not personal branding for its own sake. The governing narrative is that pain becomes useful only when translated into responsibility, construction and service.

## Voice

- First person throughout the primary life narrative.
- Intimate, specific, emotionally exposed and literary, but never fabricated.
- Strong, assertive leadership voice where public responsibility is discussed.
- No corporate biography language, résumé stacks, dossier copy, editorial instructions, provenance jargon or implementation language in the visible story.
- Leadership intensity comes from responsibility, evidence and willingness to act — not shouting or unsupported self-aggrandizement.

## Privacy boundary

The public story may be deeply personal about Igor's own experience, fear, failure, money, ambition, fatherhood, relationships, disappointment and recovery.

It must not expose private details of children, partners, family members or third parties merely for dramatic effect. Public narration owns Igor's perspective and responsibility; it does not turn other people's private lives into content.

## Narrative unit

Every major life scene should be able to express four linked layers:

1. **What I lived** — the first-person memory and lived context.
2. **What I said then** — a post, interview, song, column, clip or public statement from that period.
3. **What the world did with it** — reposts, reactions, publisher pickup, media continuation, interviews or measurable propagation.
4. **What I understand today** — present-day interpretation and the connection to the next stage of the life.

Where appropriate, a fifth forward-looking layer may appear: **what I intend to build from it now**.

## Chronological spine

The default reading experience is chronological and continuous. It must include, where supported by the canon and source corpus:

- Kharkiv birth and immigration to Israel.
- Bat Yam, Holon and Jesse Cohen.
- Schools, ADHD/behavioural difficulty, family instability, violence in the home, divorce and grandmother support.
- Military service and the formation of discipline/responsibility.
- Ministry of Foreign Affairs security / Miami period.
- Israel Police years and the effect of seeing systems, crime, vulnerability and institutional response from inside.
- Criminology studies and the shift from lived intuition to conceptual language.
- Fatherhood and the tension between ambition, presence, responsibility and repair.
- Return to Jesse Cohen and the creation of StartOn as a biographical answer, not a detached project.
- The public-content years: posts, viral moments, reposts, reactions and movement across platforms.
- Elder-fraud public action and broadcast continuation.
- Longform interviews and podcasts as a second voice inside the autobiography.
- October 7 and the change in identity/public discourse.
- Music, clips, humour and creator identity as part of the same life, not an appendix.
- Political/public leadership as a continuation of lived responsibility, not a résumé badge.
- Research, writing, SUPERNOAH and 7YA as the stage where action becomes formulation and system-building.
- A live present-tense ending: **I am still in the middle**.

## Media integration

Media must be embedded at the point of biographical relevance, not separated into a remote gallery.

### Real image priority

1. Real photograph tied to the period or source.
2. Press/broadcast frame tied to the event.
3. Post/reel/video frame tied to the event.
4. Document/source object tied to the event.
5. Contextual/generated illustration only where needed for atmosphere, clearly not represented as historical evidence.

No collages. No repeated generic portrait as a substitute for missing evidence.

### Viral content

Viral posts from Facebook, Instagram, TikTok, YouTube, LinkedIn and other public surfaces should appear along the timeline.

A strong viral insert should show, when evidence exists:

- original item/source,
- publication date,
- visible metric snapshot,
- repost/share/publisher continuation,
- relevant reactions or comments,
- media continuation,
- a short editorial explanation of why this moment matters in the life story.

Never create a synthetic total-reach number by summing incompatible platform metrics.

### Interviews and podcasts

Longform is a narrative voice, not a library block. Relevant items should surface inside the scenes they explain, with the full archive still available deeper in the site.

Known source families include News 12/13, Channel 14, Mindset, radio, podcasts and owner YouTube recovery sources. Source status remains available on demand but does not dominate the visible story.

## Homepage hierarchy

Recommended primary order:

1. **Hero — direct first-person declaration**
2. **Life — deep chronological autobiography**
3. **Selected echo inserts — viral/public response within chronology**
4. **StartOn / return as a major emotional culmination**
5. **Longform voice embedded into the relevant periods, plus compact explorer**
6. **Create / music / culture**
7. **Research / intellectual work**
8. **Public leadership / current action**
9. **I am still in the middle — live present**
10. **Deep archive / proof / search**

Other components may remain, but they must support this hierarchy rather than interrupt it.

## Hero direction

The opening must feel like Igor speaking, not a profile speaking about him.

The Hebrew opening should begin from birth, belonging and the decision to convert pain into responsibility. It should establish that the story is ongoing and that the site's purpose is not self-celebration but public meaning and construction.

Metadata labels such as owner archive, capture-date caveats and provenance states must not be the dominant first impression.

## Visible-language cleanup

Remove or demote from the primary narrative all visible implementation/provenance language such as:

- canonical stream labels,
- backend status,
- owner export/recovery jargon,
- source-local metric rules,
- transcript-state engineering language,
- technical visual labels,
- editorial/design instructions.

The evidence system itself remains intact and reachable.

## Leadership framing

The public/political sections should communicate:

- systems were experienced from inside,
- failure and delay have human costs,
- criticism is insufficient without execution,
- public power is sought as an instrument of responsibility and implementation,
- personal pain is not a claim to entitlement; it is a source of urgency and empathy only when translated into disciplined action.

Avoid campaign-slogan inflation or unverifiable claims about public mandate.

## Multilingual requirement

Hebrew, English and Russian remain first-class. The emotional core must be translated as meaning, not word-for-word syntax.

## Mobile requirement

The mobile experience must preserve the emotional rhythm:

- one dominant image/media object at a time,
- readable first-person paragraphs,
- viral/media inserts that do not create horizontal overflow,
- clear source actions,
- no fixed UI covering copy or media,
- technical proof deferred until requested.

## Acceptance criteria

The release passes when:

1. The hero speaks in first person and immediately establishes a lived story.
2. The primary chronology is materially deeper than résumé-style chapter summaries.
3. No visible design/developer/provenance instruction is mistaken for biography.
4. Real/source-backed visuals dominate wherever available.
5. Viral posts appear in chronological context rather than only in a separate influence wall.
6. Interviews/podcasts are connected to the life scenes they explain.
7. StartOn reads as a biographical return and construction response.
8. Music/creation is part of the chronology.
9. Leadership/public action emerges from the life story rather than preceding it.
10. The ending is present-tense and capable of receiving current activity.
11. Evidence links and canonical data remain intact.
12. Hebrew, English and Russian render correctly.
13. Desktop and mobile QA pass with no broken-image holes, overlap or horizontal overflow.
14. Production/AppDeploy serves the validated release.

## Out of scope for this slice

- Fabricating historical facts or memories that are not supported by Igor's supplied canon/source material.
- Exposing private third-party details.
- Replacing the evidence backend.
- Rebuilding every deep archive route.
- Artificially inflating influence metrics.

## Success definition

A visitor should finish the primary journey with three impressions:

1. **I understand the person, not merely the positions.**
2. **I can see how private pain became public action and construction.**
3. **I can verify the work and follow the story into what is happening now.**
