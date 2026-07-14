# 7YA Influence Ingestion Architecture

## Goal

Build a durable public memory layer for Igor Vepretski without copying entire platforms or relying on brittle scraping. The platform remains the source. 7YA stores a normalized public record with provenance, context and a safe fallback.

## Canonical flow

`DISCOVER → NORMALIZE → DEDUPLICATE → PROTECT → VERIFY → PUBLISH → SNAPSHOT`

### 1. Discover

Preferred sources, in order:

1. official API or RSS feed;
2. canonical public permalink;
3. official embed or oEmbed metadata;
4. owner-approved account export;
5. reputable public syndication or press echo.

### 2. Normalize

Every item receives:

- stable internal ID;
- platform and publisher;
- canonical HTTPS URL;
- public date, or an explicit unknown date;
- title and short editorial summary;
- language, format, themes and narrative act;
- optional public image with credit;
- evidence tier;
- optional metric only when `as_of` is present.

### 3. Deduplicate

Compare platform IDs, canonical URLs and normalized titles. Keep syndications when they add independent evidence, but link them to the originating item rather than presenting them as separate achievements.

### 4. Protect

Exclude private family details, minors, medical, financial, legal and operational-security information. Public availability alone is not sufficient justification for republication.

### 5. Verify

- `TIER_1` — external source: press, television, podcast or third-party public distribution.
- `TIER_2` — official source controlled by the public identity.
- `TIER_3` — dated export or analytics snapshot.

A link proves existence of the item. It does not by itself prove reach, influence, authority or outcome.

## Platform adapters

### YouTube

Persist the video ID and canonical watch URL. Use the public thumbnail endpoint as the visual fallback. Refresh from channel RSS or the official Data API when credentials are available.

### TikTok and Instagram

Prefer owner exports, public permalinks and official embeds. Never make the public site depend on a blocked profile crawl. Store dated metrics separately from the content record.

### Facebook, Threads and X

Use a permalink registry and external public echoes. When the platform blocks automated retrieval, render a text card that still opens the source.

### Press and writing

Read OpenGraph, RSS or article metadata where permitted. Preserve publisher, date, source URL and image credit. Do not reproduce full copyrighted articles.

### Podcasts

Prefer podcast RSS and episode pages. Preserve title, date, publisher and canonical episode URL.

### Music

Use official artist and release links or provider embeds. Music remains a distinct creative domain and is not evidence for unrelated professional claims.

## Runtime design

The archive is static-first. Four versioned JSON shards contain the opening dataset. The browser loads them in parallel and fails closed: if dynamic loading fails, the core editorial story and source links remain visible in HTML.

The influence view reuses the same canonical records as `/history/`; it does not create a second competing dataset.

## Release gate

- all JSON shards parse;
- exactly 36 opening records and no duplicate IDs;
- each record has a canonical HTTPS source and evidence tier;
- metrics without a date are rejected;
- homepage, `/history/` and `/influence/` remain indexable and mobile-safe;
- deployment headers expose the pinned source SHA;
- the previous source SHA remains available for rollback.
