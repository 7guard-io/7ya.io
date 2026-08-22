# AppDeploy v97 checkpoint — localized route metadata

Created before any production code change for the `/he`, `/en`, `/ru` locale-route metadata fix.

- AppDeploy app: `697a008fddc309b142`
- Applied AppDeploy version: `1787398083144` (`v97`)
- Captured date: 2026-08-22
- Production URL: `https://7ya.io`
- Intended bounded change: make locale route determine raw HTML metadata and browser locale, so social crawlers receive the same language as the route.

## Before-state verified

### `index.html`
- `<html lang='he' dir='rtl'>`
- Root Open Graph title is English: `Igor Vepretski — Official Website | 7YA.IO`
- Root Open Graph description is English.
- `og:locale` is `he_IL`.
- alternate URLs are query-based: `/?lang=he`, `/?lang=en`, `/?lang=ru`.

### `src/locale.tsx`
`initialLocale()` resolves locale from `?lang=`, then localStorage, then browser language. It does **not** resolve `/he`, `/en`, or `/ru` from `window.location.pathname`.

### `src/App.tsx`
The React hydration layer already contains localized SEO title/description data for Hebrew, English, and Russian, but applies it with `useEffect()`. This is too late for social crawlers that read the raw HTML response. Home canonicals are also query-based (`/?lang=...`).

## Rollback reference
The immutable AppDeploy rollback point for this before-state is `v97` / version `1787398083144`.

## Scope guard
No redesign, content removal, media change, or production deployment is part of this checkpoint. It exists only to preserve the verified pre-change state and rollback reference.