# PULL_ALL_PUBLIC

## Purpose

`PULL_ALL_PUBLIC` is the canonical modular refresh operation for Igor Vepretski / #7YA public-impact measurement.

The operation does not create a second evidence store. It updates the existing Google Drive forensic workbook and relies on the `ONE_OPERATION` sheet as the single visual control surface.

## Pipeline

`DISCOVER → PULL → NORMALIZE → IDENTITY-RESOLVE → CLASSIFY → DEDUPE → APPEND → RECALCULATE → DELTA → QA`

## Modules

1. **Inventory** — originals, articles, videos, audio, research artifacts, public records and derivative objects.
2. **Audience** — current and historical follower/subscriber/page-relationship snapshots by platform; raw sums are never described as unique people.
3. **Exposure** — source-local views/impressions/reach events, owned and external, preserved by node and time window.
4. **Interactions** — reactions, likes, comments, shares, LIVE records and other observable audience-response events.
5. **Propagation** — origin → repost → mirror → publisher → media → secondary discussion graph.
6. **Identity** — handles, aliases, legacy accounts, creator/music identities and platform connections.
7. **Evidence** — source provenance, capture date, exactness, evidence class and publication status.
8. **Delta** — every refresh records additions, changes, stale values and unresolved gaps.

## Canonical outputs

- `ONE_OPERATION` — executive control surface.
- `ABSOLUTE_METRICS` — controlled hard-number ledger.
- `PLATFORM_SNAPSHOTS` — time-series telemetry.
- `SOURCE_LEDGER` — provenance registry.
- `INTERACTION_EVENTS` — reaction/event corpus.
- `AMPLIFICATION_GRAPH` — derivative distribution graph.
- `GAP_REGISTER` — explicit unresolved evidence.
- `DISCOVERY_QUERY_LOG` — search memory.

## Four executive numbers

The control surface must always expose these four separate quantities:

- `PUBLIC_OBJECTS_FLOOR`
- `RAW_OWNED_AUDIENCE_RELATIONSHIPS`
- `DOCUMENTED_VIEW_EVENT_FLOOR`
- `SOURCE_RECORD_COUNT`

They must never be collapsed into one fake “total reach” number.

## Current baseline — 2026-08-19

- `PUBLIC_OBJECTS_FLOOR = 2,753+`
- `RAW_OWNED_AUDIENCE_RELATIONSHIPS = 42,954`
- `DOCUMENTED_VIEW_EVENT_FLOOR = 12,920,477`
- `SOURCE_RECORD_COUNT = 33`
- `AUDITED_EVIDENCE_ROWS = 66`
- `OPEN_P0_GAPS = 5`

Historical `30M+ organic views` and `310M social reach` remain preserved as reconstruction targets until their source-chain arithmetic is rebuilt. They are not discarded.

## Refresh contract

Every execution of `PULL_ALL_PUBLIC` must:

1. read existing state first;
2. scan registered platform/surface modules;
3. add only new or changed observations;
4. preserve source-local dates and metric definitions;
5. avoid double-counting derivative or overlapping metrics;
6. append search memory and unresolved gaps;
7. recalculate `ONE_OPERATION` automatically;
8. report delta from the previous run;
9. run QA on formulas, IDs and source references.

## User-facing shorthand

When Igor says **“רענן מדדים”**, **“תמשוך הכול”**, **“כמה אני מחזיק?”**, or **“PULL_ALL_PUBLIC”**, execute this pipeline against the same canonical workbook rather than starting a new analysis.