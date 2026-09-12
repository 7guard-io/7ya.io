# 7YA Social Story Sync Design

Date: 2026-09-12
Status: APPROVED BY USER DIRECTION
Owner: Igor Vepretski / 7YA

## Goal
Turn every reachable public social asset connected to Igor Vepretski into structured story material for 7ya.io, rather than a shallow social feed.

## Core rule
The site must use authentic public media first. Every ingested item is classified as a source asset with platform, canonical URL, publication date, media kind, thumbnail/media URL, verification state, story chapter, and narrative role. Generic AI imagery must never displace a real public asset.

## Platforms
Primary public surfaces: Instagram @igor.vepretski, Instagram @vepretski.igor, TikTok @igor.vepretski, YouTube @IgorVepretski, LinkedIn /in/vepretski and public posts, Facebook /vepretski7, X @igorvepretski, Threads @igor.vepretski, Telegram @vepretski. Reposts, mirrors, press embeds, and public third-party appearances may enrich the same story graph when source-safe.

## Ingestion model
1. Owner-authorized APIs and live feeds are preferred when connected.
2. Existing canonical corpus and Public Internet Graph remain authoritative for verified facts.
3. Public Discovery is allowed to surface new candidate URLs and visuals but remains non-canonical until corroborated.
4. Platforms with crawler/API restrictions are represented through canonical public surfaces, public search/index results, mirrors/reposts, owner exports, or approved API/OAuth paths. A blocked crawler is never treated as proof that content does not exist.
5. Deduplication is by normalized canonical URL plus media identity, not by chapter.

## Story classification
Every media asset should be mapped to one or more story chapters when evidence supports it: origin/belonging, service/responsibility, fatherhood/family, public voice, public echo/viral reach, StartOn/return, civic/political work, creation/music, research/ideas, 7YA/system-building, now/current life. Unclassified assets stay in the archive/live layer until a reliable classification exists.

## Display policy
- Homepage: diversified editorial selection across life chapters and platforms; enough media to feel alive, but not an infinite wall.
- Media/Archive: progressive disclosure of the full deduplicated visual corpus with filters and source links.
- Story chapters: authentic media appears at the chapter where it carries meaning.
- Evidence remains available on demand; system terminology must not dominate the human narrative.

## Critical existing defect
`NativePersonalMedia` currently selects one item per chapter using `find()` and then truncates to 5 items on Home or 7 on Media. This discards most valid registry output. The selection policy must be replaced with chapter-diverse multi-item selection and progressive expansion.

## Safety and truth boundaries
- No private-source auto-publication.
- No invented captions, dates, metrics, relationships, endorsements, or partnerships.
- Owner-authored material is labeled owner-authored/public, not independent verification.
- Children and private third parties remain protected.
- Metrics stay source-local and dated.

## Success criteria
1. `visual-registry` can expose the full reachable public visual inventory without one-per-chapter truncation.
2. Home visibly contains materially more authentic Igor media across distinct periods/platforms.
3. Media/Archive can reveal the larger corpus progressively without hard-coded 5/7 limits.
4. Each visible asset opens its original source and carries platform/year/chapter context.
5. Social/API restrictions are surfaced as connection state rather than silently dropping a platform.
6. Live production verification passes with no frontend/backend/network errors and the canonical 7ya.io result is visually checked on mobile and desktop.
