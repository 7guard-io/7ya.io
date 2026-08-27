# 7YA content distribution resilience cutover — 2026-08-27

## Production authority
- AppDeploy app: `697a008fddc309b142`
- Applied version: `v98`
- Applied snapshot: `1787809708783`
- Pre-cutover rollback snapshot: `1787808444264`
- Canonical repository: `7guard-io/7ya.io`

## Root cause
Several public components consumed `fetchCanonicalCorpus()` directly. A `/api/corpus` request or contract failure rejected the client call and pushed otherwise recoverable public sections into unavailable / evidence-safety states even though the build already bundled the public canonical seed and migrated public-register corpus.

## Applied behavior
- Live `/api/corpus` remains first choice.
- Request or contract failure falls back read-only to `mergePublicRegisterIntoCanon(canonicalCorpusSeed)`.
- Fallback is filtered to public visibility, requested surface and caller limit, preserving canonical story order.
- Existing source links, verification states and dated source-local metrics are preserved.
- No synthetic cross-platform reach is introduced.
- NVIDIA / Digital Igor remains additive and is not required for canonical content rendering.

## Fresh verification in deployment chain
- AppDeploy deployment reached `ready`.
- `get_app_status` reported 0 frontend errors and 0 backend errors after the final deploy.
- Source readback from applied snapshot `1787809708783` confirmed the fallback imports, bundled public corpus and try/catch fallback are present in `src/canonical-corpus-client.ts`.
- Test readback confirmed Test 7 faults `GET /api/corpus` with HTTP 503 and requires PostPortraitWall, ViralFrontispiece and The Echo to remain populated in HE / EN / RU.
- Public web search crawled 7ya.io today and returned a populated media/public-record experience rather than a blank site.

## Verification boundary
AppDeploy returned no automated E2E run and no QA screenshot for this deployment. Direct fetching of the app's visual-acceptance endpoint was not available through the current web fetch path. Therefore this receipt does not claim a fresh pixel-level PASS for the final snapshot. Runtime/source verification is green; pixel QA remains an explicitly separate evidence class.

## GitHub CI boundary
The execution environment could not resolve `github.com` from its local shell, so `npm run ci:local` could not be executed from a cloned checkout. The PR head also had no GitHub Actions run/status attached. This chain used the available equivalent gates: prior RED→GREEN TypeScript harness, AppDeploy validation/build, runtime error gate, applied-source readback, regression manifest readback and live public-web content check.
