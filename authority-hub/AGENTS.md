# 7YA Authority Hub — Agent Rules

## Product contract

- The canonical philosophy is **NOT FASHION. FORCE.**
- Human-readable HTML comes before image-led storytelling.
- Every public claim must have a status, source and explicit limitation.
- Quarantined claims remain visible as quarantined; they are never silently promoted.
- StartOn is the organization track. Igor Vepretski is the person/entity track. 7YA is the authority and evidence system.

## Architecture

- Next.js App Router and Server Components by default.
- Tailwind CSS for the visual system.
- Hebrew is canonical at unprefixed routes; English and Russian use `/en` and `/ru`.
- Claims are loaded from `src/data/claims.json` and rendered through `EvidenceCard`.
- JSON-LD is maintained in `src/lib/schema.ts`.

## Safety and truth boundaries

- Do not publish identifying details of minors.
- Do not publish operational security details.
- Do not present proposals, conversations or pilot designs as completed partnerships or outcomes.
- Dynamic social metrics require a snapshot date.
- Do not put biography or claim text only inside images.

## Required gate

Before the first lockfile exists:

```bash
npm install
npm run check
```

After committing `package-lock.json`, CI must use:

```bash
npm ci
npm run check
```
