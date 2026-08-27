# 7YA AppDeploy release receipt — 1787828789227

Date: 2026-08-27
AppDeploy app: 697a008fddc309b142
AppDeploy label: v98
Base GitHub-aligned AppDeploy snapshot: 1787823326631

## Runtime result

AppDeploy reached READY. Terminal QA reported 0 frontend errors, 0 backend errors and 0 network errors. Mobile and desktop QA screenshots were generated. `e2e_tests` was null, therefore this receipt does **not** claim an E2E pass.

Both `7ya.io` and `www.7ya.io` were checked after deployment and remained active on the v2 AppDeploy proxy.

## Arabic

A canonical Arabic public edition was added at `/ar/` with `lang=ar`, `dir=rtl`, Arabic SEO metadata, Arabic source-linked story sections, StartOn, research and creation. HE/EN/RU language controls expose AR, and discovery metadata includes Arabic hreflang/inLanguage/sitemap guidance. Arabic is intentionally a dedicated public gateway rather than a risky forced expansion of every React `Locale` dictionary in one release.

## Meta / Facebook

The existing Social Content Core was upgraded from fixed Facebook Page secrets to a read-first OAuth flow. The backend now supports Meta OAuth, permission verification, `/me/accounts` Page discovery, encrypted Page-token candidates, protected Page selection, and source-linked Facebook posts/videos ingestion. Automatic publishing remains OFF.

Required AppDeploy secret names are `SOCIAL_TOKEN_ENCRYPTION_KEY`, `FACEBOOK_APP_ID`, and `FACEBOOK_APP_SECRET`. Values are never stored in this repository or returned to the frontend.

The Facebook callback is `https://7ya.io/api/social/oauth/callback/facebook`. Requested scopes are `public_profile`, `pages_show_list`, `pages_read_engagement`, and `business_management`; the callback requires the Page-list and Page-read permissions before accepting the connection.

## Source alignment

GitHub records the release pointer, exact Arabic artifacts and the implementation/security contract. The authoritative executable backend source remains AppDeploy snapshot `1787828789227`; this receipt does not falsely claim that a complete atomic backend snapshot was copied into GitHub. The prior exported source base remains `1787823326631`.

Local `npm run ci:local` could not be executed in the prior shell because the execution environment could not resolve GitHub. GitHub combined status also does not report a passing check for this commit line. No CI PASS is claimed.
