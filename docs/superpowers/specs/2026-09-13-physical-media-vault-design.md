# 7YA Physical Media Vault — Design

Date: 2026-09-13
Status: DESIGN APPROVED IN CHAT; WRITTEN SPEC AWAITING FINAL USER REVIEW
Owner: Igor Vepretski / 7YA

## Purpose

7YA must stop behaving like a directory of external links and become a durable public archive that physically holds and serves Igor Vepretski's original media. The first production wave will import 300–500 source files from owner-authorized archives, beginning with the connected Facebook/Meta photo archive, while preserving provenance and preventing private or unsafe material from becoming public by accident.

Success is user-visible: a visitor repeatedly encounters real photographs and media from different periods of Igor's life, and the website loads those media from 7YA-managed storage rather than relying on Dropbox/Facebook thumbnails or AI-generated substitutes.

## Scope

The first wave covers 300–500 original image assets across the historical span represented in the connected Meta photo archive, with deliberate coverage of early Facebook years, military-era material, 2012–2017, 2020–2022, StartOn/public work, 2023–2024, and 2025–2026.

Video binaries are not part of the first storage wave unless a source file is already available in a safe, technically reasonable size. Existing public video embeds and source frames remain valid until a separate video-ingest pass.

This project does not publish private documents, identity documents, private family albums, raw platform exports as a whole, or media whose public status cannot be established safely.

## Architecture

### 1. Physical storage

Use AppDeploy app-scoped storage, not the Git repository, as the canonical binary store.

Originals:

`media/originals/<sha256>.<ext>`

Web derivatives:

`media/web/<sha256>.webp`

Optional future poster/thumbnail variants:

`media/thumb/<sha256>.webp`

The content hash is the durable identity of the bytes. This prevents duplicate imports when the same file appears in more than one archive surface.

### 2. Media index

Maintain a `physical_media_index` record for each imported asset. Minimum fields:

- `assetId`
- `sha256`
- `storagePathOriginal`
- `storagePathWeb`
- `mimeType`
- `byteSize`
- `width` / `height` when known
- `capturedAt` or best source date
- `sourcePlatform`
- `sourceArchive`
- `sourceFileId`
- `sourcePath`
- `canonicalSourceUrl` when known
- `title` / `caption` when source-supported
- `era`
- `topics[]`
- `visibilityStatus`
- `evidenceStatus`
- `importedAt`

No narrative fact may be inferred from the image alone and written as verified metadata. File date, archive path, album title, public post URL and other source metadata may be stored as evidence; interpretation is separate.

### 3. Public serving

Frontend code references a stable 7YA route:

`/api/media/<assetId>`

The backend resolves the media index entry and returns/redirects to a short-lived AppDeploy Storage signed URL. The visitor-facing HTML therefore points to a 7YA-controlled asset route while the bytes remain physically stored inside the 7YA AppDeploy storage namespace.

The original provenance link remains separately visible as `Source` / `מקור` and never gets replaced by the storage URL.

### 4. Ingest pipeline

First-wave ingestion is batch-oriented and idempotent:

1. Discover candidate files from the connected owner archive.
2. Apply publishability gate before upload.
3. Download the original bytes.
4. Compute SHA-256.
5. Skip if hash already exists.
6. Produce a web-optimized derivative without altering the original.
7. Upload original + derivative to AppDeploy Storage.
8. Write/update the media index.
9. Verify the 7YA media route returns the asset.
10. Only then project it into public pages.

The importer must be resumable. A failed file must not abort the whole batch; successes remain committed and failures receive an explicit error state.

### 5. Temporary importer boundary

The first physical import may use a temporary, narrowly scoped backend import route invoked by the execution agent. It must require an unpredictable one-time batch credential, accept only supported image MIME types, enforce per-file and per-batch size limits, and be removed/disabled immediately after the first wave finishes.

The one-time credential must not be committed in plaintext or retained after the import window.

Long-term ingestion should move to a dedicated authorized connector/worker rather than a permanently open upload endpoint.

## Publishability gate

An asset is `PUBLIC_READY` only when at least one safe condition is met:

- it is already available at a public source URL owned by Igor;
- it can be matched to a public owner post/album/publication;
- its archive context is explicitly public and contains no conflicting privacy signal;
- Igor has explicitly approved the asset/category for public display.

Default to `HOLD` when public status is uncertain.

Always hold or exclude:

- identity documents, financial/legal records and account screenshots;
- raw location/private-address material;
- private messages or contacts;
- sensitive operational/security material;
- private family media that has no verified public source;
- material involving children when public context/appropriateness is uncertain;
- duplicates, corrupted files and tiny unusable thumbnails.

This gate protects against the failure mode of treating an owner export as automatically public.

## Selection strategy for the 300–500 first wave

The goal is coverage, not a random 500-file dump. Build a balanced historical set with a minimum representation from every available era, then add density around strong documented periods.

Priority signals:

1. original file rather than screenshot;
2. known date / album context;
3. public-source match;
4. meaningful historical coverage;
5. source-supported connection to an existing Life Atlas moment, article, interview, StartOn event, service period, music/public activity or creator record;
6. visual quality sufficient for web display.

No fixed chapter ceiling is introduced. The media layer is an expanding pool consumed by all relevant pages.

## Site integration

All major surfaces consume the same physical media index rather than maintaining separate hard-coded photo inventories:

- Home / Igor profile: human first, high-value real media throughout the journey.
- Life Atlas: chronological media attached to resolved moments.
- Museum: visual exploration by era/topic/source.
- Media: searchable archive objects with physical image previews.
- Library: evidence-oriented view with source + physical asset metadata.
- StartOn: original project/event media where public and source-supported.
- Speaker / Blog / Research / Music: contextual real media selected from the same index when relevant.

The pages do not automatically show all 500 assets at once. They query a bounded subset, lazy-load images and expose more through pagination/filtering.

## Performance

- Keep originals untouched but serve optimized WebP derivatives by default.
- Lazy-load below-the-fold images.
- Use fixed aspect-ratio boxes to reduce layout shift.
- Initial page render must not request hundreds of assets.
- Use bounded queries and pagination.
- Preserve accessible alt text; when context is unknown, use neutral source-based alt text rather than invented descriptions.

## Failure handling

- Storage failure: index record does not become PUBLIC_READY.
- Derivative failure: original remains stored but public projection waits or falls back only if technically safe.
- Source link missing: asset can remain stored but stays HOLD unless an independent public-source condition is satisfied.
- Duplicate hash: reuse the existing asset and append provenance rather than creating another binary.
- Broken public route: existing external source remains available and the UI must not render a broken image shell.

## Verification gates

The first wave is complete only when:

- 300–500 unique original assets are physically present in 7YA-managed storage;
- each has a media-index record and hash;
- every PUBLIC_READY asset has a source/provenance trail;
- duplicate import is proven idempotent on a sample re-run;
- `/api/media/<assetId>` resolves successfully for sampled assets across old/new eras;
- Home, Life Atlas, Museum and Media visibly use physical assets;
- mobile and desktop QA show no broken images or page-level overflow;
- frontend/backend/network QA reports no new production errors;
- the temporary import capability is removed or disabled after the batch.

## Rollback

The media index is additive and existing source-linked content remains intact during migration. If projection code causes regressions, roll back the frontend/backend release without deleting stored originals. Storage deletion is a separate, explicit operation and is not part of ordinary rollback.

## Non-goals

- No bulk publication of every Dropbox/Meta file.
- No AI-generated replacement images.
- No re-encoding that destroys the original source bytes.
- No rewriting historical context based only on visual interpretation.
- No loading hundreds of full-resolution images into a single page view.
