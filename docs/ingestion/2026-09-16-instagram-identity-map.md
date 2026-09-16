# Instagram identity map — 2026-09-16

## Owner-provided public surfaces

- Primary personal account: `https://www.instagram.com/igor.vepretski/`
- Secondary 7YA-linked account: `https://www.instagram.com/vepretski.igor/`

## Public discovery snapshot

### `@igor.vepretski`

- Indexed title: `Igor ido Vepretski #7ya`
- Indexed profile snippet observed on 2026-09-16: approximately `7.9K+` followers, `183` following, `1717` posts in one result; a second indexed variant showed `8.2K+` followers, `210` following, `1148` posts.
- Bio snippet includes: `Public figure · Builder · Creator` and links `@vepretski.igor`.
- The bio also contains a `7B+ cumulative reach` claim. Keep this as a profile claim / USER-REPORTED style signal; do not promote it to verified Canon without independent evidence.
- Publicly indexed reels from 2026 were discoverable, including posts dated Aug 7, Aug 11, Aug 17, Aug 18 and Jun 8.

### `@vepretski.igor`

- Indexed title: `7YA (@vepretski.igor)` / fallback `Igor Vepretski | #7YA`.
- Indexed profile snapshot observed on 2026-09-16: approximately `695` followers, `3.2K+` following, `1057` posts; nearby indexed variants showed `693–695` followers and `968–976` posts.
- Bio snippet includes: `Building systems, not noise · Founder · Creator · Strategist`.
- Publicly indexed reels from 2026 were discoverable, including posts dated May 30, Jun 13, Jul 3 and Aug 10.

## Identity relationship

The two accounts must not be silently merged into one handle. The primary account publicly links the secondary account, and the owner supplied both URLs in the same ingestion sequence.

Current 7YA role model:

- `@igor.vepretski` -> `personal-primary` / canonical Instagram identity.
- `@vepretski.igor` -> `7ya-secondary` / linked secondary identity.

Content may overlap, cross-post or reference the other account. Deduplicate by provider post/reel ID and canonical source URL, not by caption similarity alone.

## Media handling

Instagram CDN (`cdninstagram.com` / `scontent*`) URLs are delivery URLs and must not become durable canonical asset IDs. Preserve the original Instagram post/reel URL, provider object ID when available, retrieval timestamp and a 7YA-controlled cached/proxied representation for presentation.

## Metrics policy

Search-engine/indexed follower, following, post and engagement counts are DISCOVERY snapshots only. They may be stale or inconsistent between indexed variants and must not overwrite live authenticated Meta/Instagram metrics when those are available.
