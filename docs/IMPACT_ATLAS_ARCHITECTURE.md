# 7YA Public Impact Atlas — Architecture and Editorial Contract

## Purpose

The Public Impact Atlas turns Igor Vepretski's dispersed public footprint into one fast, source-linked and privacy-safe archive. The system does not copy entire social platforms and does not depend on brittle scraping. It stores stable public identifiers, canonical links, dates when known, source metadata, topics, language and evidence state.

## Canonical hierarchy

1. Igor Vepretski — the person, story and public voice.
2. StartOn — the social mission.
3. 7YA — the organizing layer for content, provenance, search and evidence.

AI and automation support the archive. They are not the hero and may not manufacture reach, authority, partnerships or outcomes.

## Content contract

The canonical dataset is:

`/knowledge/igor-public-content-map-20260714.json`

Each record contains:

- stable `id`;
- public date or `null`;
- platform and type;
- human-readable title and summary;
- canonical public URL;
- language and themes;
- evidence state;
- source image and credit when available;
- editorial `featured` flag.

## Platform adapter strategy

### YouTube

Use the canonical video ID and public permalink. A platform thumbnail can be derived from `https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg`. Future refresh may use channel RSS or the official YouTube Data API.

### Facebook, Instagram, TikTok, Threads and X

Store public permalinks and owner-approved exports. Use official embeds only when stable and privacy-safe. When a platform blocks indexing, render a text card rather than failing the page or attempting circumvention.

### Press and articles

Use public OpenGraph, RSS or article metadata where available. Preserve publisher, title, publication date, source URL, image credit and evidence state. Do not reproduce full copyrighted articles.

### Podcasts

Prefer episode RSS or public episode pages. Preserve the episode title, date, public URL and description.

### Music

Use official provider links and embeds. Keep music as a distinct creative domain rather than evidence for unrelated claims.

## Refresh pipeline

1. **Discover** — public feed, permalink, press page, podcast RSS or owner export.
2. **Normalize** — map into the canonical JSON schema.
3. **Deduplicate** — compare platform ID, canonical URL and content hash.
4. **Protect** — exclude minors, private family information, legal, medical, financial and operational security data.
5. **Verify** — assign `VERIFIED`, `DOCUMENTED`, `PUBLIC_LINK`, `VERIFIED_ECHO` or `SELF_ATTESTED`.
6. **Publish** — update the JSON manifest and allow the static UI to render it.
7. **Measure** — store reach only as a dated snapshot with source context.

## Failure model

The website is static-first. If the manifest cannot load, core source links remain present in the HTML and the dynamic archive displays a fallback message. Platform blocking must not break navigation, layout or the public story.

## Acceptance gate

- homepage and `/influence/` return crawlable HTML;
- canonical metadata and mobile viewport exist;
- the manifest parses as JSON and every published record has a title and URL;
- no unsupported aggregate reach claim appears;
- all external links open independently of the dynamic renderer;
- the mobile layout has no horizontal overflow;
- the public source SHA is visible in deployment headers;
- rollback remains possible through the previous immutable source SHA.
