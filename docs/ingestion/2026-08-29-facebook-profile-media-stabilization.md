# Facebook profile media stabilization — 2026-08-29

## Approved input
- Canonical public Facebook surface: `https://www.facebook.com/vepretski7`
- Legacy alias: `https://www.facebook.com/vepretski`
- Received Meta CDN asset filename: `380700650_10162533193146729_2379134611963304810_n.jpg`
- Observed payload: `160x160`, `is_silhouette=false`
- CDN URL is signed/ephemeral and must not become canonical site data.
- Observed URL expiry marker resolves to 2026-09-02 21:59:42 UTC.

## Runtime requirements for next AppDeploy release
1. Treat `/vepretski7` as the canonical Facebook account everywhere; preserve `/vepretski` only as a legacy alias.
2. Never expose raw `scontent*.fbcdn.net` URLs as durable public asset identifiers.
3. For Facebook live-ingest thumbnails (`full_picture`, video `picture`, profile imagery), return a 7YA-controlled image URL or runtime proxy URL to the frontend.
4. Persist provenance separately from presentation: canonical source URL + Meta provider object ID + fetched timestamp; CDN delivery URL remains replaceable cache data.
5. Add a stable Facebook profile visual record tied to the canonical account. The 160x160 image is acceptable for avatar/profile use only, not Hero or large editorial cards.
6. Prefer higher-resolution owner-authorized Meta API media when available; otherwise fall back to the existing 7YA portrait asset rather than scaling the 160x160 source beyond avatar use.
7. Keep `facebook.com/vepretski7` in `SOCIAL_ACCOUNTS`, public profile/entity metadata, go/social surfaces, llms metadata and structured `sameAs` output.
8. Add regression checks: no canonical metadata emits `facebook.com/vepretski` as primary; no durable visual record stores an expiring fbcdn URL; avatar fallback renders on mobile and desktop.

## Deployment guard
Current GitHub main is a release ledger and is explicitly marked non-reconstructable from the live AppDeploy runtime. Do not deploy stale GitHub runtime over production. Apply the implementation directly against the current AppDeploy source snapshot only when the explicit 7YA deployment chain is invoked.
