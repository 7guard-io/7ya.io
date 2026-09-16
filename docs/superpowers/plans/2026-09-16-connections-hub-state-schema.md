# Connections Hub state labels

- `verified_direct`: fresh direct connector read/write available in ChatGPT.
- `verified_metricool`: the social identity is present inside the connected Metricool brand.
- `needs_oauth`: supported through the preferred ingestion layer but not yet authorized.
- `session_needed`: integration exists but a fresh service login/session is required before admin changes.
- `legacy`: retained for history/fallback, not a preferred new connection.

The UI must render the route explicitly (`Direct`, `Metricool`, `Windsor`, `Legacy`) and display the observation date. These labels describe the current known route, not permanent provider availability.