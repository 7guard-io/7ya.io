# GitHub App user-to-server authentication

7YA supports GitHub App authorization on behalf of a user. The flow uses OAuth `state`, PKCE (`S256`), an HttpOnly flow cookie, encrypted token storage, expiring-token refresh, and a 7YA HttpOnly session cookie.

## GitHub App settings

Set the callback URL to:

```text
https://7ya.io/api/github-auth-callback
```

Enable **Request user authorization (OAuth) during installation** when authorization should immediately follow installation. Configure only the repository and account permissions the application actually needs.

## Required environment variables

```text
DATABASE_URL=...
JWT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://7ya.io/api/github-auth-callback
GITHUB_ALLOWED_LOGINS=vepretski
GITHUB_TOKEN_ENCRYPTION_KEY=<32-byte base64 or 64-character hex key>
GITHUB_AUTH_SUCCESS_URL=https://7ya.io/admin
FRONTEND_ORIGIN=https://7ya.io
```

Generate the encryption key once and keep it stable:

```bash
openssl rand -base64 32
```

Rotating this key requires reauthorization because existing stored GitHub tokens will no longer decrypt.

Optional settings:

```text
GITHUB_ALLOW_ALL_USERS=false
COOKIE_SECURE=true
```

`GITHUB_ALLOW_ALL_USERS` defaults to false. Logins in `GITHUB_ALLOWED_LOGINS` receive the `admin` role; other users are rejected unless allow-all is explicitly enabled.

## Database migration

Apply:

```text
sql/002_github_app_user_auth.sql
```

The migration allows GitHub-only users, links a GitHub identity to a local user, and creates encrypted token storage.

## Endpoints

Start authorization:

```text
GET /api/github-auth-start?return_to=/admin
```

GitHub callback:

```text
GET /api/github-auth-callback
```

Verify the authorized user's accessible installations (admin only):

```text
GET /api/github-installations
```

Authenticated API calls continue to accept `Authorization: Bearer <7YA JWT>`. Browser sessions can also use the HttpOnly `7ya_session` cookie created by the callback.

## Security properties

- OAuth callback state is signed and expires after 10 minutes.
- PKCE uses SHA-256 and a one-time verifier.
- GitHub access and refresh tokens are encrypted with AES-256-GCM before database storage.
- GitHub tokens are never returned to the browser.
- Redirects are restricted to `FRONTEND_ORIGIN` or safe relative paths.
- The default authorization policy is fail-closed to the configured login allowlist.
