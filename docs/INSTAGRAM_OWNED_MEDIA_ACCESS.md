# Instagram owned-media access

This integration gives 7YA authenticated access to media from an Instagram account that Igor owns or administers. It uses OAuth and the official Instagram API flow. It does not scrape Instagram or bypass access controls.

## Netlify environment variables

Set these in the production site environment:

- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET`
- `INSTAGRAM_STATE_SECRET` — a long random value
- `INSTAGRAM_REDIRECT_URI` — `https://7ya.io/.netlify/functions/instagram-access?action=callback`
- `DATABASE_URL`
- `INSTAGRAM_SUCCESS_REDIRECT` — optional, defaults to `https://7ya.io/?instagram=connected`
- `INSTAGRAM_SCOPES` — optional; defaults to `instagram_business_basic`
- `INSTAGRAM_AUTH_URL`, `INSTAGRAM_TOKEN_URL`, `INSTAGRAM_MEDIA_URL` — optional overrides so Meta endpoint changes do not require a code release

Never commit app secrets or access tokens.

## Meta app setup

1. Create or use a Meta developer app that supports Instagram login/API access.
2. Add the exact redirect URI above to the app's allowed OAuth redirect URIs.
3. Add the Instagram account as a tester/admin while the app is in development mode, or complete the permissions review required for production use.
4. Configure the scopes approved for the account type. The default can be overridden through `INSTAGRAM_SCOPES`.

## Connect Igor's account

After deployment, open:

`https://7ya.io/.netlify/functions/instagram-access?action=authorize&account=igor.vepretski`

Complete Instagram authorization. The callback stores the token server-side in PostgreSQL.

## Endpoints

Connection status:

`GET /.netlify/functions/instagram-access?action=status&account=igor.vepretski`

Owned media feed:

`GET /.netlify/functions/instagram-access?action=media&account=igor.vepretski&limit=25`

The media response includes IDs, captions, media type, media URL, permalink, thumbnail, timestamp and username when the granted API permissions expose those fields.

## Security notes

- OAuth state is signed and expires after ten minutes.
- Tokens stay server-side and are not returned by the status endpoint.
- Media responses are private-cacheable for only 60 seconds.
- This initial version creates the required database table automatically.
- Before broad internal use, add an authenticated 7YA admin check to the `media` and `status` actions.

## Next implementation step

Connect the media endpoint to the 7YA content collector so a Reel permalink or media ID can be resolved into its caption, thumbnail and authorized media URL for analysis. Add token refresh according to the token type issued by the configured Meta product.