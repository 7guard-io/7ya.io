# Vercel Release Provenance Evidence — 2026-07-14

## Scope

Eliminate `source_sha: unbound` from the Vercel production release contract while preserving the live 7YA AI release.

## Canonical source

- Repository: `7guard-io/7ya.io`
- Pull request: `#168`
- Squash merge commit: `511a419addc1658cd345a351743fde0fddf3ea8a`
- Release path: `ops/vercel-recovery`

## Implemented contract

- Build-time generator: `scripts/generate-release.js`
- Runtime endpoint: `api/release.js`
- Build hook: `npm run vercel-build`
- SHA precedence:
  1. `VERCEL_GIT_COMMIT_SHA`
  2. `GITHUB_SHA`
  3. `SOURCE_SHA`
  4. `RELEASE_SOURCE_SHA`
  5. Bundled `release-manifest.json`
- Invalid or missing provenance fails closed.
- Runtime without a valid 40-character SHA returns `503 PROVENANCE_UNBOUND` rather than a false READY result.

## Local contract validation

- JavaScript syntax checks: PASS
- Unbound runtime path: PASS (`503`)
- Bundled manifest path: PASS (`200 READY`)
- Host-provided SHA override: PASS
- Generator without SHA: expected failure PASS
- Generator with valid SHA: PASS

## Production deployment

- Vercel project: `7ya-static-site`
- Deployment ID: `dpl_Dt9ZHt4chFk9AJXYBapsSsQBegQp`
- Deployment state: `READY`
- Target: `production`
- Public alias: `https://7ya-static-site.vercel.app`
- Region: `iad1`

Build log confirmed:

```text
npm run vercel-build
node scripts/generate-release.js
release-manifest.json bound to 511a419addc1658cd345a351743fde0fddf3ea8a
Build Completed
Deployment completed
```

## Live release endpoint

`https://7ya-static-site.vercel.app/release.json` returned HTTP `200` with:

```json
{
  "status": "READY",
  "release": "2026-07-14.4-provenance",
  "source_repository": "7guard-io/7ya.io",
  "source_path": "ops/vercel-recovery",
  "source_sha": "511a419addc1658cd345a351743fde0fddf3ea8a",
  "environment": "production",
  "provenance_source": "bundled_manifest",
  "ai_endpoint": "/api/guide",
  "openai_ready": true,
  "model_default": "gpt-5.6"
}
```

The endpoint also returned `X-Content-Type-Options: nosniff` and `Cache-Control: public, max-age=0, must-revalidate`.

## Regression verification

- Homepage: HTTP `200`
- Homepage release marker: `2026-07-14.4-provenance`
- Canonical URL: `https://7ya.io/`
- Robots policy: `index, follow`
- 7YA AI endpoint GET behavior: expected HTTP `405 Method Not Allowed`
- 7YA AI endpoint cache policy: `no-store`
- No new fatal runtime error group was detected.

## Runtime observation

Vercel reports a Node `DEP0169` deprecation warning for `url.parse()` on `/api/render`. The application renderer does not call `url.parse()` directly; this appears in the Vercel runtime layer. It is non-blocking and did not affect HTTP status, content, deployment readiness or provenance integrity.

## Verdict

- `source_sha` binding: PASS
- False READY without provenance: BLOCKED
- Build-time provenance gate: PASS
- Direct-deployment manifest fallback: PASS
- 7YA AI regression: PASS
- Production deployment: READY
- Canonical-domain cutover: separate domain-permission task
