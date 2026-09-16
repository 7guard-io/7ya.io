# Connections Hub security contract

The Hub is a navigation/status surface, not an authentication server.

- Never request or store provider passwords, tokens, API keys or cookies.
- Provider authorization happens only in provider/integration-owned flows.
- All external actions are HTTPS and open with `noopener noreferrer`.
- The route is excluded from search indexing.
- Known integration state is descriptive evidence, not proof of current live access.
- Future capability checks must be same-origin, GET/read-only, independently timeout-safe and non-persistent.
