# Connections Hub product rules

1. Prefer an already-working aggregator before asking Igor to reconnect a network directly.
2. A social network may be `verified_via_metricool` even when there is no direct 7YA API integration yet; the route must be explicit.
3. Windsor.ai is the preferred read/ingestion expansion layer for missing organic social sources because it can normalize multiple providers into one interface.
4. Metricool remains the preferred publishing/scheduling layer where the brand is already connected.
5. GitHub, Google Drive, GSC and GA4 stay direct because they already have working first-class connectors.
6. Never persist a signed OAuth onboarding URL in the repository. Generate it live when Igor chooses a provider.
7. Static statuses must include an observation date and are snapshots, not claims of perpetual connectivity.
8. The Hub must never collect passwords, API keys or access tokens.