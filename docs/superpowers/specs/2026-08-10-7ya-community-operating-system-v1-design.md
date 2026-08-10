# 7YA Community Operating System v1 — Design

**Status:** Design candidate for human review  
**Date:** 2026-08-10  
**Owner:** 7YA  
**Scope:** Community growth operating system, human-growth graph, first-value loop, matching, measurement, safeguarding, and operating model.  
**Production impact:** None. Documentation only.

---

## 1. Executive intent

7YA is not a political membership system, fan club, generic social network, newsletter, or chat product. It is an apolitical human-growth operating system designed to help people convert lived experience, friction, ambition, skills, and relationships into meaningful progress, creation, contribution, and opportunity.

The core transformation is:

> **Experience / adversity → reflection → meaning → capability → action → creation → contribution → growth**

The system is intended to support a wide opportunity ecology: youth with constrained access, young adults in transition, creators, builders, engineers, mentors, educators, senior professionals, researchers, companies, municipalities, institutions, and partners. Users may play different roles at different times.

7YA does not define people by deficit. Its operating principles are:

1. **Belonging before exclusion.**
2. **Capability before stigma.**
3. **Verification before circulation.**
4. **Human agency before optimization.**

StartOn is a physical/social implementation of part of this logic for youth. 7YA generalizes the logic into a digital system that can support multiple populations without collapsing them into one undifferentiated audience.

---

## 2. Product thesis

The principal product is not content and not AI conversation. The principal product is a **progress loop**.

A person should be able to enter 7YA, explain what they are trying to change, receive a useful next move, act, return, record progress, and eventually connect to relevant people, projects, tools, and opportunities.

The minimum viable loop is:

`Visit → Understand → First Value → First Action → Return → Progress Event`

The community loop extends this to:

`Progress → Proof → Contribution → Connection → New Progress`

The long-term network effect is:

`More useful participants → more knowledge/offers/opportunities → better matches → more progress → stronger evidence/trust → more useful participants`

---

## 3. North-star metric

### Meaningful Progress Events per Active Human (MPE/AH)

A **Meaningful Progress Event (MPE)** is a user-confirmed or appropriately verified event showing movement toward a self-selected goal. Examples include:

- completing an agreed next action;
- creating or publishing a concrete artifact;
- learning or demonstrating a skill;
- resolving a blocker;
- beginning or completing a project;
- receiving relevant feedback or mentorship;
- obtaining an opportunity;
- helping another participant make progress.

MPEs must not be reduced to engagement metrics such as clicks, time-on-site, messages sent, streaks, or likes.

Supporting metrics:

- Intake completion rate
- First-value completion rate
- First-action rate
- 7-day / 30-day return rate
- MPEs per active human
- Creation rate
- Contribution rate
- Match acceptance rate
- Match success rate
- Time-to-first-value
- Time-to-first-MPE
- Cost / human-operator minutes per MPE
- Safeguarding incidents and false-positive/false-negative matching review rates

The operational optimization target is:

> **Increase meaningful progress while reducing unnecessary human intervention, without reducing safety, trust, autonomy, or quality.**

---

## 4. Human model

Each participant receives one canonical internal `Person` identity. A person is not permanently classified as a single persona.

### 4.1 Dynamic roles

A person can hold one or more current roles:

- **Grower** — seeking personal progress, direction, capability, or transition.
- **Builder / Creator** — making a project, product, work, piece of art, research, or initiative.
- **Guide** — able to mentor, teach, review, advise, or support.
- **Catalyst** — able to unlock high-leverage access, expertise, capital, institutional reach, or opportunity.
- **Institution** — an organization that can provide infrastructure, programs, opportunities, resources, or scale.

Roles are contextual, not hierarchical. A senior engineer may be a Guide in software and a Grower in public speaking. A teenager may be a Grower in coding and a Guide in gaming, music, or youth culture.

### 4.2 Human Growth Graph

The core internal graph is:

`Person ↔ Goal ↔ Skill ↔ Need ↔ Offer ↔ Opportunity ↔ Project ↔ Relationship ↔ Progress Event`

Minimum person-level data domains:

- stable internal identifier;
- contact / authentication identity;
- consent state and communication preferences;
- age band / safeguarding class where necessary;
- selected goals;
- current blockers;
- skills / experience the person chooses to disclose;
- needs;
- offers / ways they are willing to contribute;
- active path;
- recommended next move;
- progress events;
- accepted relationships/matches;
- last meaningful touch;
- source / acquisition channel;
- privacy classification for each field where required.

The system must not infer sensitive attributes unless they are strictly necessary, consented, and lawful. Political affiliation is not part of the 7YA community identity model.

---

## 5. Entry experience: `/join`

The first product slice is a value-first intake, not a newsletter signup.

### 5.1 Opening question

The primary entry prompt should be semantically equivalent to:

> **What are you trying to make happen in your life, work, or world right now?**

The wording may be localized, but the product intent remains self-directed agency.

### 5.2 Adaptive intake

The user should answer approximately 4–6 lightweight adaptive questions. The exact sequence depends on previous answers. Initial information should include only what is needed to generate useful first value.

Candidate dimensions:

- desired outcome;
- current blocker;
- approximate stage;
- relevant skill / context;
- whether the user wants to grow, build, guide, contribute, or partner;
- preferred form of next action.

The system must avoid trauma extraction. Users are never required to disclose painful history to receive value.

### 5.3 First-value output

Before requesting a deeper commitment, 7YA produces **Your Next Move**:

- one concise goal interpretation;
- one main blocker hypothesis, explicitly labeled as a hypothesis;
- one action that can be taken within roughly 24 hours or another appropriate short horizon;
- one useful tool/resource/template where relevant;
- one optional path for continued support;
- a clear correction control: “This is not what I meant.”

Only after delivering first value should the system invite the user to save the profile, opt into communication, and continue.

### 5.4 Conversion rule

Lead collection is a consequence of delivered value, not a gate placed in front of value.

---

## 6. Return experience

A returning participant should immediately understand:

1. What was I trying to achieve?
2. What did I say I would do?
3. What happened since then?
4. What is my next useful move?

The return surface should prioritize progress over content consumption.

Minimum return state:

- current goal;
- current next move;
- recent progress;
- unresolved blocker;
- one recommended action;
- optional relevant connection/opportunity.

No infinite feed is required for v1.

---

## 7. Community primitives

Community interaction is organized around action rather than popularity.

Core primitives:

### Request
A concrete request for help, feedback, knowledge, access, collaboration, or a resource.

### Offer
A participant declares what they are willing to provide, with limits such as time, subject, format, or eligibility.

### Challenge
A time-bounded path that converts a goal into a small sequence of actions.

### Circle
A small group, normally 5–8 people, working on related goals with explicit purpose and duration.

### Build
A real project or artifact with roles, contribution needs, and visible progress state.

### Win
A meaningful, consented progress event that may be shared as evidence or inspiration.

The desired behavioral loop is:

`Ask → Give → Build → Show → Repeat`

Vanity mechanics, public follower counts, popularity ranking, and engagement bait are out of scope for v1.

---

## 8. Matching engine

Matching is a recommendation system for opportunities, not an autonomous relationship broker.

### 8.1 Matching graph

Primary match types:

- `Need ↔ Offer`
- `Goal ↔ Guide`
- `Person ↔ Opportunity`
- `Person ↔ Project`
- `Builder ↔ Collaborator`
- `Institution ↔ Need cohort`

### 8.2 Progressive automation

Matching follows:

`Human-designed rules → AI-assisted candidate ranking → human review where risk warrants → measured outcomes → selective automation`

Do not automate an unvalidated matching policy.

The system must log:

- why a match was proposed;
- what data was used;
- whether the user accepted it;
- whether contact occurred;
- whether a useful outcome followed;
- whether either participant reported a problem.

---

## 9. AI role

The 7YA AI companion is not Igor and does not impersonate Igor.

Its allowed v1 roles are:

- intake interpretation;
- summarizing a user-defined goal;
- proposing next actions;
- identifying missing information;
- suggesting resources;
- ranking candidate matches;
- creating reflection prompts;
- summarizing progress;
- helping users turn work into artifacts or plans;
- supporting operators with triage and follow-up.

High-impact actions remain bounded by policy and approval requirements.

The system should distinguish:

- user-provided facts;
- system-observed events;
- AI inference;
- verified evidence;
- unverified self-report.

Users must be able to correct the system’s understanding.

---

## 10. StartOn integration

StartOn is not the entire 7YA community and 7YA is not a rebrand of StartOn.

StartOn can function as a physical opportunity node in the graph:

`StartOn participant → protected 7YA growth identity → learning/build path → mentor/tool/opportunity → progress → later contribution`

A desired long-term transition is:

`Recipient → Participant → Creator → Contributor`

However, youth participation is governed by a stricter safeguarding boundary than the general adult community.

---

## 11. Safeguarding and privacy architecture

### 11.1 Core rule

**General 7YA community matching and youth safeguarding environments are not the same trust zone.**

Minors must not be exposed to unrestricted adult discovery or direct matching.

### 11.2 Minimum safeguards

The youth path requires, as applicable:

- age-appropriate data minimization;
- explicit safeguarding classification;
- guardian / program consent where required;
- restricted visibility;
- controlled mentor eligibility;
- operator-reviewed matching;
- communication boundaries;
- reporting and escalation paths;
- audit trail;
- no public disclosure of sensitive youth progress;
- no use of participant adversity as promotional material without appropriate consent and ethical review.

The design should prefer collecting less data rather than attempting to secure unnecessary data.

---

## 12. Operating model

7YA should operate as a **Community Operating Company** with a small human core amplified by software and AI.

Functions:

1. **Mission / Product** — determines user problems, priorities, and product integrity.
2. **Engineering / Data** — builds reliable, observable systems.
3. **Community Operations** — runs onboarding, matching, moderation, and qualitative learning.
4. **Growth / Content** — attracts relevant participants and converts public attention into useful entry paths.
5. **Safety / Evidence** — protects participants, manages evidence standards, consent, privacy, and learning quality.

The operating principle is:

> **Human first → AI-assisted → automate only after the pattern is understood and measured.**

---

## 13. Control plane

One operational control plane should answer:

- Who entered?
- What are they trying to accomplish?
- What next move did the system recommend?
- Did they take it?
- What meaningful progress occurred?
- What needs or offers are unmatched?
- Where are users dropping out?
- Where are humans spending operator time?
- What safety issues require attention?
- What experiment is currently running?

Do not create separate unlinked records for “lead”, “user”, “mentor”, “volunteer”, and “partner” when they represent the same human. One canonical Person identity should anchor those relationships.

---

## 14. Weekly operating cadence

At any given time there may be only:

- **1 Product Objective**
- **1 Growth Objective**
- **1 Operations Objective**

Weekly cycle:

1. **Decide** — identify the dominant bottleneck.
2. **Build / Operate** — ship or run one bounded vertical slice.
3. **Measure** — observe actual user behavior and outcomes.
4. **Learn** — determine why the result occurred.
5. **Compound** — update product, process, evidence, and operating knowledge.

Every week must end with either a tested product increment, a validated/invalidated hypothesis, or a documented operational learning. Activity without learning does not count as progress.

---

## 15. Rollout

### Phase A — Prove the loop (0–30 days)

Goal: prove that a user can receive value and create measurable progress.

Scope:

- `/join` entry;
- adaptive intake;
- initial Growth Profile;
- Your Next Move;
- save/opt-in;
- return state;
- progress-event logging;
- operator review dashboard;
- 50–100 carefully recruited pilot users maximum.

Human operators manually review a meaningful sample of sessions.

Exit criteria:

- users consistently understand the first-value output;
- measurable first-action behavior exists;
- progress events are not merely engagement events;
- 7-day return behavior is observable;
- no unresolved critical safety/privacy defects.

### Phase B — Prove community (30–90 days)

Goal: prove that participants can create value for each other.

Scope:

- Request / Offer;
- limited matching;
- Guide onboarding;
- small Challenges;
- small Circles;
- basic match outcome measurement.

Exit criteria:

- accepted matches generate meaningful outcomes above a defined baseline;
- users voluntarily contribute after receiving value;
- operator burden is measurable and declining for repeated patterns;
- safeguarding controls remain effective.

### Phase C — Scale validated mechanisms (90+ days)

Possible scope only after evidence:

- deeper AI personalization;
- broader opportunity marketplace;
- partner/institution portals;
- internationalization;
- advanced matching;
- richer personal growth portfolio;
- program-level StartOn integrations;
- automation of validated repetitive workflows.

---

## 16. Technical architecture principles

This design intentionally does not choose technology merely for novelty. Implementation must follow current 7YA control-plane truth.

Required boundaries:

- canonical identity store;
- consent/privacy state separated from public profile state;
- progress-event ledger;
- AI inference fields distinguishable from user facts;
- matching service isolated from communication/identity concerns;
- analytics based on explicit product events;
- auditability for high-risk actions;
- public evidence publication separated from private participant data;
- multilingual support designed into data models rather than patched into presentation only.

Do not merge broad product implementation until repository/runtime provenance is reconciled and the applicable release/CI gate is trustworthy. Existing GitHub/AppDeploy source-of-truth work remains a prerequisite for production changes.

---

## 17. Error and failure handling

The system must fail safely.

Examples:

- If AI cannot confidently interpret the goal, ask for clarification rather than inventing a path.
- If no safe/relevant match exists, say so; do not force a match.
- If user state cannot be saved, preserve the user-visible result where possible and provide a retry path.
- If consent is withdrawn, stop non-required processing and communication according to policy.
- If a safeguarding signal is raised, suspend ordinary matching and route to the defined human review process.
- If an operator cannot distinguish fact from inference, default to non-public/internal status.
- If measurement instrumentation fails, do not claim outcome improvement.

---

## 18. Testing strategy

### Product tests

- user can complete intake without unnecessary sensitive disclosure;
- first-value output is understandable and actionable;
- correction flow changes the system’s interpretation;
- return state accurately reflects prior state;
- progress events are recorded once and are attributable;
- opt-in and consent choices are respected.

### Matching tests

- deterministic rules behave as documented;
- unsafe classes are excluded;
- minors cannot enter unrestricted adult matching paths;
- match explanation corresponds to actual inputs;
- rejection/feedback updates future recommendations appropriately.

### Safety/privacy tests

- unauthorized users cannot access private growth data;
- public evidence paths cannot leak private participant data;
- deletion/consent-revocation flows are testable;
- audit events exist for restricted actions;
- prompt-injection or user content cannot override policy boundaries.

### Measurement tests

- funnel events are unambiguous;
- MPE cannot be produced solely by passive engagement;
- duplicate progress events are prevented or reconciled;
- cohort/retention calculations are reproducible.

### Pilot acceptance test

The central validation question is:

> **Can a new participant give 7YA a few minutes and leave with greater clarity and a useful next action — then return and demonstrate meaningful progress?**

If not, the product loop is not proven regardless of visual quality, traffic, or registration volume.

---

## 19. Non-goals for v1

Do not build in the first release:

- native mobile apps;
- infinite social feed;
- public follower/fame mechanics;
- complex points/gamification economy;
- open mentor marketplace for minors;
- autonomous high-impact AI matching;
- generalized messaging platform;
- political targeting or party membership features;
- speculative blockchain/NFT layers;
- broad redesign unrelated to proving the progress loop.

---

## 20. Decision summary

**Recommended architecture:** Community Operating Company + Human Growth Graph + value-first intake + measurable progress loop.

**First vertical slice:**

`/join → adaptive intake → Growth Profile → Your Next Move → opt-in/save → return → Progress Event`

**First pilot size:** 50–100 relevant participants, with substantial qualitative operator review.

**First proof obligation:** demonstrate that the system causes or materially supports useful, self-directed next actions and repeatable meaningful progress.

**Governance rule:** automate repetition; never automate ignorance.
