# 7YA Platform Matrix

Phase B: Platform Alignment / Node Synchronization

This document defines how each public platform node should project the canonical Igor Vepretski / #7YA identity layer.

It is not a marketing strategy. It is an operating map for identity, claims, evidence and platform-specific syntax.

## Gate

Phase B depends on Phase A from Issue #88.

Do not treat this document as active deployment permission until the Root Ontology route is implemented, reviewed, validated and merged to `main`.

Target canonical route after Phase A:

```txt
https://7ya.io/igor-vepretski
```

Fallback until the route is live:

```txt
https://7ya.io
```

## Core axiom

> The child the system failed to read became the man who reads systems.

Every platform may translate this axiom into its own syntax, but no platform should invent a separate narrative.

## Verification states

Every public claim inside the 7YA ecosystem should carry one of the following verification states:

```txt
source_verified
source_pending
public_source
internal_record
evidence_pending
```

These states are shared language for site content, code, GitHub issues, pull requests, evidence cards, media-kit copy and platform deployment.

## Governance rule

Narrative inflation is treated as a system bug.

If a claim is added without an evidence state, the PR must explain why the claim is allowed and how it will be verified.

Builder proof before personal branding.

## Platform node table

| Node | Role | Function | Allowed claim types | Verification expectation | Link behavior |
| --- | --- | --- | --- | --- | --- |
| `7ya.io/igor-vepretski` | Root | Canonical identity graph | Founder identity, 7YA, StartOn, 7YA Files, AI ecosystem developer layer | JSON-LD plus evidence-card states | Single Source of Truth |
| `7ya.io/evidence` | Evidence | Public trust archive | Claims, source records, public signals, internal records | Every item should carry a status label | Links back to root where relevant |
| `7ya.io/media-kit` | Matrix | Platform copy source | Approved bios, headlines, platform descriptions, press lines | Copy blocks inherit root status discipline | Feeds all external nodes |
| GitHub | Proof | Builder proof and governance | Code, docs, schemas, verification model, PRs, CI, issues | No exposure metrics unless routed to evidence | Link to root and evidence only |
| LinkedIn | Credibility | Institutional/professional trust | Systems architecture, AI ecosystems, StartOn, public trust infrastructure | Claims should map to root/media-kit | Link to canonical root |
| Instagram | Visual identity | Public magazine and identity surface | Roots, field, culture, StartOn, 7YA, evidence, AI | Avoid unverified numeric claims in bio | Link to canonical root |
| TikTok | Hook | Cultural signal and short-form influence | Direct public voice, story hooks, 7YA Files teasers | Captions can be sharp, but claims must remain bounded | Link to root or first signal page |
| YouTube | Archive | Long-form memory and witness layer | Episodes, descriptions, transcripts, playlists, source context | Episode claims should link to evidence/root | Link to root and episode evidence |
| X / Threads | Signal | Short public commentary | Signals, notes, civic framing, build notes, episode drops | Avoid unsupported escalation | Link to root/evidence as needed |
| Newsletter | Dispatch | Owned audience and periodic synthesis | Weekly signal, evidence item, StartOn update, build update | Reference evidence state where claims appear | Link to root/evidence |
| Press | Legitimacy | External media framing | Short/medium/long bio, one-liners, interview topics | Must use media-kit language | Link to root and contact |

## Node-specific syntax

### GitHub — Proof Layer

GitHub is not an amplification surface. It is the proof layer.

Allowed:

- code architecture
- typed evidence states
- JSON-LD / schema implementation
- docs and governance
- issues, PRs, CI and validation notes
- verification model

Avoid:

- exposure metrics
- inflated founder language
- sponsor/partner claims not backed by evidence
- broad personal myth without system proof

Approved line:

```txt
I build evidence-first systems where AI infrastructure, public trust, media intelligence and social impact operate as one structured layer.
```

Design constraint:

```txt
Builder proof before personal branding.
```

### LinkedIn — Credibility Layer

LinkedIn translates the root axiom into professional capability.

Allowed:

- complex systems architecture
- AI ecosystem development
- evidence-first systems
- civic/public trust infrastructure
- StartOn and youth-impact infrastructure
- security/public-service background when framed professionally

Approved headline:

```txt
Founder of 7YA & StartOn | Evidence-first AI systems | Complex systems architecture | Civic tech, public trust & youth-impact infrastructure
```

Approved summary line:

```txt
I build systems where public story, evidence, AI infrastructure and social impact meet.
```

### Instagram — Visual Identity Layer

Instagram is the public visual magazine.

Allowed:

- roots
- field experience
- StartOn
- 7YA
- culture
- AI
- media
- evidence
- personal command-site identity

Highlight structure:

```txt
ROOTS
7YA
StartOn
AI
Media
Evidence
Talk
```

Approved bio direction:

```txt
Igor Vepretski / #7YA
Founder of 7YA & StartOn
Field · Culture · AI · Evidence · Public trust
The child the system failed to read became the man who reads systems.
```

### TikTok — Hook Layer

TikTok compresses the root axiom into a cultural strike.

Approved bio:

```txt
הילד שהמערכת לא קראה נכון.
עכשיו אני קורא מערכות.

#7YA
שטח · תרבות · AI · אמת · השפעה
```

Allowed content patterns:

- first-person civic signal
- short story hook
- 7YA Files teaser
- system failure analysis
- direct public voice

Avoid:

- long institutional explanations
- technical schema talk
- claim inflation without evidence path

### YouTube — Archive Layer

YouTube is the long-form historical archive.

Allowed:

- full episodes
- source context
- transcripts
- episode descriptions
- playlists
- documentary framing
- 7YA Files / Tikey 7YA series structure

First flagship payload:

```txt
Tikey 7YA / 7YA Files — Episode 1: The child the system failed to read
```

Hebrew title:

```txt
תיקי 7YA — פרק 1: הילד שהמערכת לא ידעה לפענח
```

YouTube should carry depth. TikTok and Instagram carry hooks back into it.

### X / Threads — Signal Layer

X and Threads are short-form signal surfaces.

Allowed formats:

```txt
Signal:
Evidence note:
Builder note:
System failure:
7YA File:
```

Keep the syntax short. Link back to root or evidence when the statement depends on a claim.

### Newsletter — Dispatch Layer

The newsletter is owned distribution.

Issue structure:

```txt
Signal of the week
Evidence item
Builder note
StartOn update
AI / infrastructure note
One link back to root or evidence
```

### Press — Legitimacy Layer

Press language must use approved media-kit language.

Short bio:

```txt
Igor Vepretski is the founder of 7YA and StartOn, an evidence-first AI ecosystem developer connecting personal story, civic systems, creator culture, public trust and youth-impact infrastructure.
```

Avoid custom one-off descriptions that create conflicting public identities.

## Claim handling

### Allowed without extra escalation

- Founder of 7YA
- Founder of StartOn
- Evidence-first architecture language
- AI ecosystem developer language
- Public trust infrastructure language
- Creator / media archive language

### Requires evidence state

- large audience metrics
- exposure metrics
- platform-specific performance numbers
- institutional roles
- developer-program memberships
- partnerships or collaborations
- press/media claims

### Forbidden unless formally verified

- endorsed by NVIDIA / Microsoft / Google / OpenAI
- sponsored by NVIDIA / Microsoft / Google / OpenAI
- official partner language without evidence
- certified by a platform without proof
- powered by a platform when that implies sponsorship or endorsement

## Deployment checklist

Use only after Phase A is merged and the canonical route is healthy.

- [ ] Confirm canonical root route renders.
- [ ] Confirm media-kit route renders.
- [ ] Confirm evidence route renders.
- [ ] Update GitHub profile README.
- [ ] Update LinkedIn headline and About.
- [ ] Update Instagram bio, highlights and link.
- [ ] Update TikTok bio and link.
- [ ] Update YouTube channel description and playlists.
- [ ] Update X / Threads bios.
- [ ] Prepare first signal payload.
- [ ] Capture screenshots after deployment.

## First Signal Payload

The first public signal should not launch before node synchronization is complete.

Working title:

```txt
Tikey 7YA / 7YA Files — Episode 1: The child the system failed to read
```

Hebrew title:

```txt
תיקי 7YA — פרק 1: הילד שהמערכת לא ידעה לפענח
```

Required payload blocks:

- YouTube title
- YouTube description
- TikTok caption
- Instagram Reel caption
- LinkedIn launch post
- X / Threads signal thread
- pinned comment
- canonical root link
- evidence link if specific claims are made

## Operating rule

Every node is a projection. The root remains the source.
