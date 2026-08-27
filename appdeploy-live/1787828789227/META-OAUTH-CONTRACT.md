# Meta / Facebook Social Core contract

Release marker: `social-core-20260827-meta-oauth-1`
Graph API version: `v24.0`

## Security boundary

- Meta App ID and App Secret are AppDeploy secrets only.
- OAuth state is signed with the Social Token Encryption Key and expires after 15 minutes.
- Page access tokens are AES-256-GCM encrypted at rest.
- Candidate Page tokens expire from the selection set after 30 minutes.
- UI/API Page options return only Page ID, Page name, task labels and optional linked Instagram Business Account ID.
- OAuth tokens and secret values are never returned to the browser.
- Automatic publishing is OFF. This release is read/ingest/display first.

## Flow

1. Authorized 7YA admin starts `/api/social/oauth/start/facebook`.
2. Meta OAuth requests `public_profile,pages_show_list,pages_read_engagement,business_management`.
3. Callback exchanges the code and attempts a long-lived user token.
4. `/me/permissions` must contain `pages_show_list` and `pages_read_engagement` as granted.
5. `/me/accounts` returns manageable Pages and Page access tokens server-side.
6. One Page auto-selects; multiple Pages are shown in Social Control without tokens.
7. `POST /api/social/facebook/select` stores the selected Page token encrypted.
8. `/api/social-feed` reads the selected Page `/posts` and `/videos`, attaches public source URLs, deduplicates and feeds the existing projection/discovery/visual layers.

## Protected routes

- `GET /api/social/facebook/pages`
- `POST /api/social/facebook/select`

Both require authenticated admin access.
