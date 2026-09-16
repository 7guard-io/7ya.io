# 7YA Connections Hub — Approved Design

## Purpose
A private, noindex control surface for connecting one source at a time to Igor Core. It is not a credential store and does not implement provider OAuth itself.

## UX
The page shows the highest-value next connection first, followed by filterable cards for social, measurement, archive and infrastructure sources. Every card explains what that source contributes to Igor Core and exposes one safe external manage/connect action.

## States
- Connected: existing integration evidence is known, but the page does not claim live capability unless verified.
- Needs connection: Igor must authorize the provider through its official/provider integration flow.
- Not verified: state is unknown.

## Security
No password/token/API-key fields, no browser persistence of secrets, noindex/nofollow, HTTPS outbound actions only. Runtime capability checks, when added, must be same-origin and read-only.

## Delivery
The route is copied into the immutable static artifact after the canonical static build and before GA4 injection/manifest refresh. This avoids restructuring the existing site contract for one private utility route and keeps the slice removable.
