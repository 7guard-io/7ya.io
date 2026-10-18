# 7YA Digital Museum Integration

## Decision

The standalone museum concept is integrated into 7YA as a native depth page rather than replacing the homepage or being pasted into the existing long-form homepage.

Canonical route: `https://7ya.io/museum/`

Source concept retained for provenance: `https://igor-7ya-digital-museum.igor-vepretski.chatgpt.site/`

## Information hierarchy

1. **Igor Vepretski** — the human core, public journey and voice.
2. **StartOn** — the independent social mission and field action.
3. **7YA** — the public operating layer that organizes evidence, media and action.

## Product behavior

- The homepage receives one restrained bridge section.
- The museum receives its own navigation item and mobile-dock entry.
- The museum is multilingual in Hebrew, English and Russian.
- Every public milestone links to an external source.
- The page preserves the primary CTA `לתיאום שיחה` and secondary CTA `לצפייה בראיות`.
- The original museum remains linked as a provenance/reference surface.
- The canonical Academia URL is `https://igorvepretski.academia.edu/` across the runtime.

## Runtime files

The AppDeploy runtime snapshot is authoritative. The deployment changed:

- `src/MuseumPage.tsx`
- `src/museum-page.css`
- `src/App.tsx`
- `src/locale.tsx`
- `src/GlobalNav.tsx`
- `src/GalaxyHome.tsx`
- `src/PlatformUniverse.tsx`
- `src/ViralFeed.tsx`
- `backend/index.ts`
- `shared/media-impact.ts`
- `public/museum/index.html`
- `public/sitemap.xml`
- `public/release.json`
- `tests/tests.txt`

## Verification and rollback

Release: `7ya-digital-museum-integration-20260803-1`

AppDeploy snapshot: `1785761259243`

Rollback snapshot: `1785570508207`

AppDeploy reached terminal `ready` with zero frontend, backend and network errors. The E2E object reported terminal `passed`; it also reported `3` passed jobs out of `4`, so this counter discrepancy is preserved in the release receipt rather than silently normalized.

## Remaining governance work

The complete AppDeploy runtime source still needs an exact export into the canonical GitHub repository. Until then, AppDeploy remains the execution source of truth and this repository stores deployment receipts, architecture decisions and governance records.
