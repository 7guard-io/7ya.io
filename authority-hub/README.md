# 7YA Authority Hub

An isolated Next.js 16 workspace for rebuilding `7ya.io` as a multilingual, evidence-governed authority hub without disrupting the current static production surface.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- TypeScript strict mode
- Native route-based i18n: Hebrew, English and Russian
- Schema.org JSON-LD for `Person` and `Organization`

## Canonical routes

Hebrew uses unprefixed canonical routes:

- `/igor-vepretski/`
- `/starton/`
- `/evidence-wall/`
- `/timeline/`
- `/press/`

English and Russian use `/en/...` and `/ru/...` equivalents.

## Evidence architecture

- Data source: `src/data/claims.json`
- Contract: `src/types/claim.ts`
- Renderer: `src/components/EvidenceCard.tsx`
- Statuses: Verified, verified with attribution, dated baseline, quarantined and capture required
- Every card contains a claim ID, source, status, proof boundary and limitation boundary.

## Local development

```bash
cd authority-hub
npm ci
npm run dev
```

## Release gate

```bash
npm run check
```

The Authority Hub should be deployed as a preview project before any canonical-domain cutover.
