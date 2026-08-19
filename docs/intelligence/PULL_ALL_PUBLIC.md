# PULL_ALL_PUBLIC

## Purpose

`PULL_ALL_PUBLIC` is the canonical modular refresh operation for Igor Vepretski / #7YA public-impact measurement.

## Source priority — public-web-first

The live operational source is the public internet itself.

1. **LIVE PUBLIC WEB / PLATFORM PUBLIC SURFACE** — first choice for current profiles, posts, videos, articles, public metrics, reactions, reposts, media coverage and third-party telemetry.
2. **PUBLIC THIRD-PARTY INDEX / SEARCH CACHE** — use when the platform blocks direct crawling; preserve crawl date and metric definition.
3. **OWNED PUBLIC WEB PAGE / PUBLIC ANALYTICS POST** — usable as a public first-party source, explicitly labeled as owner-published when it contains analytics or self-reported totals.
4. **GOOGLE DRIVE / PRIVATE EXPORT / ARCHIVE** — recovery-only. Use only for deleted, blocked, inaccessible, historical or otherwise unrecoverable public material. Drive must never be the default source for a live metric when a current public-web observation exists.

Drive is therefore an **archive and recovery lane**, not the primary telemetry database.

## Pipeline

`DISCOVER → PULL WEB → NORMALIZE → IDENTITY-RESOLVE → CLASSIFY → DEDUPE → MEASURE → DELTA → QA → ARCHIVE-RECOVERY-IF-NEEDED`

## Modules

1. **Inventory** — originals, articles, videos, audio, research artifacts, public records and derivative objects.
2. **Audience** — current/historical follower, subscriber and page-relationship snapshots by platform.
3. **Exposure** — source-local views, impressions and reach events, owned and external, preserved by node and time window.
4. **Interactions** — reactions, likes, comments, shares and observable response events.
5. **Propagation** — origin → repost → mirror → publisher → media → secondary-discussion graph.
6. **Identity** — handles, aliases, legacy accounts, creator/music identities and verified platform connections.
7. **Evidence** — source URL, capture/crawl date, exactness, source class and method.
8. **Delta** — every refresh reports additions, changes, stale values and unresolved gaps.
9. **Recovery** — only when public material is deleted, blocked, inaccessible or historically absent from the live web.

## Executive quantities

Always keep these separate:

- `PUBLIC_OBJECTS_DISCOVERED`
- `CURRENT_PUBLIC_AUDIENCE_RELATIONSHIPS`
- `DOCUMENTED_PUBLIC_VIEW_EVENTS`
- `DOCUMENTED_PUBLIC_INTERACTIONS`
- `INDEPENDENT_AMPLIFICATION_NODES`
- `PUBLIC_SOURCE_COUNT`
- `RECOVERY_ONLY_OBJECT_COUNT`

Never collapse followers, views, impressions, reach and unique people into one synthetic total.

## Refresh contract

Every execution must:

1. search the public web first in HE / EN / RU and known aliases;
2. query current platform/public-index surfaces;
3. discover originals and derivative propagation independently of 7YA and Drive;
4. use owned public pages only as first-party public evidence, not as independent corroboration;
5. use Drive only after a public-web recovery failure or for blocked/deleted historical material;
6. preserve source-local dates and definitions;
7. dedupe by object identity and propagation relationship;
8. report a fresh public-web baseline and delta;
9. maintain unresolved gaps explicitly.

## User-facing shorthand

When Igor says **“רענן מדדים”**, **“תמשוך הכול”**, **“כמה אני מחזיק?”**, **“תבדוק מחדש לבד”**, or **“PULL_ALL_PUBLIC”**, perform a fresh public-web-first pass. Do not begin from Drive-derived metrics. Only invoke archive recovery when the live public web cannot recover a known object.