# 7YA Social Story Sync — AppDeploy Production Receipt

Date: 2026-09-12
Canonical domain: https://7ya.io/
AppDeploy app: `697a008fddc309b142`
Applied snapshot verified: `1789218399550`
Release marker: `7ya-social-story-sync-20260912-v1`
Visual registry release: `visual-registry-20260912-story-sync-1`
Social release: `social-story-sync-20260912-v1`

## What changed in production

- Preserved the concurrently updated `NativePersonalMedia` UI that merges Visual Registry, Public Projection and Discovery.
- Home presentation now selects a story-diverse authentic-media sequence (up to 18 items) instead of one item per chapter capped at five.
- Media presentation starts with 36 source-bound visual items, supports platform and life-chapter filters, and progressively expands in batches.
- YouTube public Atom ingestion expanded from 8 to 15 current entries.
- Instagram ingestion expanded from one 25-item page to up to four 100-item pages per configured account, with `CAROUSEL_ALBUM` children expanded into separate visual assets when the API returns them.
- TikTok Display API ingestion now follows cursor pagination for up to ten 20-item pages (maximum 200 recent videos per authorized refresh).
- Facebook direct feed window expanded to request up to 100 posts plus 100 videos and retain up to 160 deduplicated current items.
- Combined social-feed projection ceiling expanded from 100 to 1,000 items.
- Visual Registry now merges public Discovery visuals alongside live social, owner-approved, canonical and public-source media while preserving Discovery as non-canonical.
- Live and Discovery assets are classified into story chapters (origin, service, fatherhood, StartOn, civic, culture, research/system, identity, voice, now/archive) without inventing canonical event IDs.
- Visual deduplication now uses normalized source URL + image identity rather than collapsing by chapter/canonical ID.

## Platform truth boundaries

- YouTube: public live feed.
- Instagram: deep live API path when per-account access tokens are configured; otherwise public projection/Discovery remains available.
- TikTok: deep Display API path when owner OAuth token is connected; historical owner-export and Discovery layers remain separate.
- Facebook: owner-authorized Page API / Meta sync when connected; public Discovery remains separate.
- LinkedIn: OAuth identity path exists, but public member-post API reading remains subject to LinkedIn `r_member_social` approval; indexed public posts stay in Discovery/Canon.
- X and Threads: represented as official public surfaces and Discovery sources; no unsupported claim of a live owner-authorized post API connection.
- Telegram: public channel feed path remains available.

## Verification evidence

After deployment AppDeploy reported terminal `ready` state with:
- frontend errors: 0
- backend errors: 0
- network errors: 0

Fresh source verification on snapshot `1789218399550` confirmed the release marker, Instagram four-page loop, TikTok ten-page loop, 1,000-item social merge ceiling, `discovery-public` visual origin, story classifier, and Discovery merge inside Visual Registry.

The newest AppDeploy version check after verification showed `1789218399550` as the latest snapshot, so no later writer had replaced this release at that gate.

## Known external limits

This release does not pretend that every platform grants unlimited historical API access. Historical depth comes from the combined Canon + Discovery + owner exports + public mirrors/reposts + live API/feed layers. Direct live access remains constrained by each platform's permissions and connected credentials.
