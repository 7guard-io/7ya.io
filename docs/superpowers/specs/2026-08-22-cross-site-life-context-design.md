# Cross-Site Life Context Design

## Goal
Make time the connective tissue of 7YA: specialist content surfaces must lead back to the canonical life moment that gives them context, while Museum becomes the uninterrupted full-album view and the legacy timeline stops implying the life begins in 2011.

## Architecture
Canonical corpus remains the only dynamic source of truth. A presentation-only moment-link helper generates a home URL with `lang`, `moment=<canonical-id>`, and `#life-moments`. Moment Engine reads that id, selects the requested public corpus event, and temporarily adds a requested non-anchor event to the default eight anchor moments in story order. No corpus, ingestion, database, or backend schema changes.

## Surfaces
- Media: canonical records link to their exact event id; selected legacy records use a conservative explicit mapping only where identity is unambiguous.
- Music: the lens links to `life-music-2025`, without re-dating earlier releases.
- Research: the lens links to `research-collective-imagination-2026`, with independent-research status unchanged.
- Museum: reuses `PersonalChronology` as `FULL ALBUM MODE`; existing visual/system/evidence sections remain secondary layers.
- Timeline: reframed 1990→NOW and adds an origin/belonging station whose retrospective-source boundary is explicit.

## Safety
No invented media, dates, places, ages, metrics, relationships or reflections. Requested ids not present in the public corpus are not rendered as moments. Corpus failure preserves the existing marked chronology fallback and Moment Engine unavailable state.

## UX
Context links are compact and consistent. Deep-linked moments open evidence in place. Existing external sources remain available. Mobile remains single-column and overflow-safe.