# 7YA Living Asset Projection — Design

## Purpose
Turn 7YA from a site that mainly points at external content into a living projection of Igor Vepretski's public corpus. Every high-value source should appear as an authentic visual object with context, provenance, evidence status and an action path.

## First production slice
SUPERNOAH is the acceptance object because it exposes the failure clearly: a visually rich public manuscript existed while the site mainly exposed a generic Academia link. The new shared asset object is projected on both Home and Research from one source of truth.

## Architecture
- `asset-projection.ts` stores source URL, source cover, local fallback, evidence boundary, localized explanation, owner-analytics snapshot and framework nodes.
- `FeaturedAssetProjection.tsx` renders the same object in Home and Research.
- External cover failure falls back to the existing local 7YA research image; the source object remains readable and actionable.
- Research data points the SUPERNOAH object to its exact public manuscript URL, not the generic author profile.
- Static-first Research markup carries the same object so the page remains meaningful before hydration and to non-JS crawlers.

## Evidence boundary
The manuscript is described as an independent conceptual preprint / Founder Edition and explicitly not peer reviewed. The 20-of-38 value is labeled as an owner-analytics snapshot dated 10 September 2026, not as public reach or virality.

## UX order
Person → current source object → public/viral record → documented influence → public action → StartOn → live social → chronology → visitor path.

## Acceptance
Desktop and mobile must show a strong visual SUPERNOAH feature, exact source link, honest status, nonblank fallback behavior and continued access to the existing life archive and visitor handoff.
