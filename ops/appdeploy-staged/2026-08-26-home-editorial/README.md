# 7YA Home Editorial Cutover — staged patch

Target runtime: AppDeploy app `697a008fddc309b142`, base `v100` / `1787689408979`.

This patch is intentionally staged outside the canonical public root because the repository contract states that the current AppDeploy runtime snapshot has not yet been fully reconciled back into `main`.

## Visual intent

- Keep Igor and real media as the first visual signal.
- Reduce above-the-fold text density on mobile.
- Remove the live graph/data module from the primary emotional beat.
- Hide source-layer filters on the homepage while preserving source metadata and deep evidence surfaces.
- Recompose the public-life atlas as one large cinematic stage with larger four-column desktop / two-column mobile thumbnails.
- Keep evidence, archive and system surfaces available as deeper layers.

## Runtime change

1. Add `src/life-first/editorial-cutover-20260826.css` using the staged CSS file in this directory.
2. Import it last from `src/life-first/AutobiographicalCinema.tsx`, after `rtl-typography-20260825.css`.
3. Do not alter backend, corpus, evidence records or routing.

The exact machine-readable patch is in `patch.json`.

## Deployment lock

This patch is **not production-published from this branch**. Production remains locked until the product owner explicitly issues the standing deployment command: `בצע את שרשרת הפריסה`.

## Verification contract

The staged UI contract checks for:

- final editorial CSS import;
- hero mobile density override;
- live graph suppression in the primary flow;
- homepage filter suppression;
- cinematic `hm-stage` override;
- enlarged `hm-atlas` layout.
