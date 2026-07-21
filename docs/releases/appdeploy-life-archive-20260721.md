# 7YA AppDeploy Release Receipt — 2026-07-21

## Release identity

- App: `697a008fddc309b142`
- AppDeploy snapshot: `1784664477644`
- Public AppDeploy URL: `https://697a008fddc309b142.v2.appdeploy.ai/`
- Build marker: `igor-life-archive-integrated-20260721-1`
- Provider: AppDeploy v2
- Automated QA: **10/10 passed**
- Frontend errors: none observed
- Backend errors: none observed

## What this release adds

- A source-labelled public life archive for Igor Vepretski.
- A dated influence ledger rather than a fabricated aggregate reach number.
- A public-response pattern map that does not invent quotes or endorsements.
- A clear separation between Igor (human core), StartOn (field mission), 7YA (organizing system), and 7ya.io (public terminal).
- A unified local-only continuity flow from assistant input to the five-step personal journey.
- A visible release marker linked from the footer.

## Dated evidence baselines used

The release uses controlled, dated values from the canonical public-work index and analytics snapshot:

- TikTok owner export, 2026-06-02: 904 posts, 12,655 followers, 273,860 account likes, top exported post 36,694 likes.
- Instagram owner insight, 2023-11-23: 213K views, 7.4K likes, 1.1K comments and 53 shares.
- LinkedIn public crawl, 2026-06-08: safe public wording is 4K+ followers, hundreds of posts and five indexed articles because controlled sources differ slightly.
- YouTube public snapshot, 2026-06-08: approximately 2.57K subscribers.
- Facebook controlled snapshot: approximately 4.1K reactions, 148 comments and 147–148 shares; the one-unit conflict is retained.
- GA4 snapshot, 2026-06-12 through 2026-07-09: 676 active users, 665 new users, 8,848 events and 24.3 seconds average engagement time per active user.

These values are not summed into a universal exposure claim.

## Claim and privacy boundary

The release excludes private family identifiers, information about minors, legal and financial files, private correspondence, credentials, operational information and unsupported claims. Independent manuscripts and conceptual papers retain their actual publication status and are not presented as peer reviewed.

## Production routing state

AppDeploy reports both `7ya.io` and `www.7ya.io` as active custom domains. An independent public fetch performed after the successful AppDeploy release still returned the older GitHub Pages release marker `github-pages-history-song-164c3892f9961aee42ca55ddf1d356d4840a82d2` from `https://7ya.io/release.json`.

Therefore:

- The enriched build is verified live at the AppDeploy URL.
- Custom-domain control-plane activation is verified in AppDeploy.
- Canonical-domain cutover is **not** declared complete until an independent fetch returns `igor-life-archive-integrated-20260721-1` from `7ya.io` and the critical routes are rechecked.
- No DNS change is included in this receipt.

## Repository relationship

This is a provenance receipt for an independent AppDeploy production snapshot. It does not assert that the AppDeploy source is already identical to `main`. Related draft work remains under review in PR #263 (Archive V2) and PR #264 (Creator Path V2).

## Acceptance gate before declaring canonical success

1. `https://7ya.io/release.json` returns `igor-life-archive-integrated-20260721-1`.
2. Root and critical routes return the intended AppDeploy content.
3. TLS remains valid for apex and `www`.
4. The live footer exposes the same release marker as the health endpoint.
5. No private or unsupported claims appear in the public build.
