import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getPool, query } from "./db.js";

const GITHUB_API_VERSION = "2026-03-10";
const FLOW_COOKIE = "7ya_github_oauth";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return value;
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function parseCookies(req) {
  const header = req.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}

function getCallbackUrl(req) {
  return (
    process.env.GITHUB_CALLBACK_URL ||
    `${new URL(req.url).origin}/api/github-auth-callback`
  );
}

function getAllowedLogins() {
  return new Set(
    (process.env.GITHUB_ALLOWED_LOGINS || "vepretski")
      .split(",")
      .map((login) => login.trim().toLowerCase())
      .filter(Boolean)
  );
}

function tokenEncryptionKey() {
  const raw = requireEnv("GITHUB_TOKEN_ENCRYPTION_KEY").trim();
  const hex = /^[a-f0-9]{64}$/i.test(raw) ? Buffer.from(raw, "hex") : null;
  const base64 = hex || Buffer.from(raw, "base64");
  if (base64.length !== 32) {
    throw new Error(
      "GITHUB_TOKEN_ENCRYPTION_KEY must be a 32-byte key encoded as base64 or 64 hex characters"
    );
  }
  return base64;
}

export function encryptGitHubToken(token) {
  if (!token) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", tokenEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decryptGitHubToken(value) {
  if (!value) return null;
  const [ivPart, tagPart, ciphertextPart] = value.split(".");
  if (!ivPart || !tagPart || !ciphertextPart) {
    throw new Error("Invalid encrypted GitHub token");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    tokenEncryptionKey(),
    Buffer.from(ivPart, "base64url")
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextPart, "base64url")),
    decipher.final()
  ]).toString("utf8");
}

export function createGitHubAuthorization(req, returnTo) {
  const clientId = requireEnv("GITHUB_CLIENT_ID");
  const jwtSecret = requireEnv("JWT_SECRET");
  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(64));
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const callbackUrl = getCallbackUrl(req);

  const flowToken = jwt.sign(
    { state, verifier, returnTo: returnTo || null },
    jwtSecret,
    { expiresIn: "10m", issuer: "7ya-github-oauth" }
  );

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", callbackUrl);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("allow_signup", "false");

  return {
    url: url.toString(),
    cookie: cookie(FLOW_COOKIE, flowToken, {
      maxAge: 600,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax"
    })
  };
}

export function consumeGitHubAuthorization(req, state) {
  const jwtSecret = requireEnv("JWT_SECRET");
  const flowToken = parseCookies(req)[FLOW_COOKIE];
  if (!flowToken) {
    const err = new Error("Missing GitHub authorization state");
    err.status = 400;
    err.publicMessage = "github_oauth_state_missing";
    throw err;
  }

  let flow;
  try {
    flow = jwt.verify(flowToken, jwtSecret, { issuer: "7ya-github-oauth" });
  } catch {
    const err = new Error("Invalid or expired GitHub authorization state");
    err.status = 400;
    err.publicMessage = "github_oauth_state_invalid";
    throw err;
  }

  const expected = Buffer.from(String(flow.state));
  const actual = Buffer.from(String(state || ""));
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    const err = new Error("GitHub authorization state mismatch");
    err.status = 400;
    err.publicMessage = "github_oauth_state_mismatch";
    throw err;
  }

  return flow;
}

export function clearGitHubAuthorizationCookie() {
  return cookie(FLOW_COOKIE, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax"
  });
}

async function githubJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "7ya.io",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(`GitHub request failed with ${response.status}`);
    err.status = 502;
    err.publicMessage = "github_api_error";
    err.github = data;
    throw err;
  }
  return data;
}

export async function exchangeGitHubCode(req, code, verifier) {
  const body = new URLSearchParams({
    client_id: requireEnv("GITHUB_CLIENT_ID"),
    client_secret: requireEnv("GITHUB_CLIENT_SECRET"),
    code,
    redirect_uri: getCallbackUrl(req),
    code_verifier: verifier
  });

  const token = await githubJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!token.access_token) {
    const err = new Error(`GitHub token exchange failed: ${token.error || "unknown_error"}`);
    err.status = 401;
    err.publicMessage = "github_token_exchange_failed";
    throw err;
  }
  return token;
}

export async function fetchGitHubUser(accessToken) {
  return githubJson("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

export function authorizeGitHubUser(githubUser) {
  const login = String(githubUser.login || "").toLowerCase();
  const allowed = getAllowedLogins();
  const allowAll = process.env.GITHUB_ALLOW_ALL_USERS === "true";
  if (!allowAll && !allowed.has(login)) {
    const err = new Error(`GitHub user ${login || "unknown"} is not allowed`);
    err.status = 403;
    err.publicMessage = "github_user_not_allowed";
    throw err;
  }
  return allowed.has(login) ? "admin" : "user";
}

function expiryDate(seconds) {
  return Number.isFinite(Number(seconds))
    ? new Date(Date.now() + Number(seconds) * 1000)
    : null;
}

export async function linkGitHubUser(githubUser, token, role) {
  const client = await getPool().connect();
  const email =
    githubUser.email || `${String(githubUser.login).toLowerCase()}@users.noreply.github.com`;

  try {
    await client.query("BEGIN");
    const existing = await client.query(
      `
      SELECT id
      FROM users
      WHERE github_id = $1 OR LOWER(email) = LOWER($2)
      ORDER BY (github_id = $1) DESC
      LIMIT 1
      FOR UPDATE
      `,
      [githubUser.id, email]
    );

    let user;
    if (existing.rowCount > 0) {
      const updated = await client.query(
        `
        UPDATE users
        SET email = $2,
            role = $3,
            github_id = $4,
            github_login = $5,
            github_avatar_url = $6,
            auth_provider = CASE
              WHEN password_hash IS NULL THEN 'github'
              ELSE 'password+github'
            END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, role, github_login, auth_provider
        `,
        [
          existing.rows[0].id,
          email,
          role,
          githubUser.id,
          githubUser.login,
          githubUser.avatar_url || null
        ]
      );
      user = updated.rows[0];
    } else {
      const inserted = await client.query(
        `
        INSERT INTO users (
          email, password_hash, role, github_id, github_login,
          github_avatar_url, auth_provider
        )
        VALUES ($1, NULL, $2, $3, $4, $5, 'github')
        RETURNING id, email, role, github_login, auth_provider
        `,
        [email, role, githubUser.id, githubUser.login, githubUser.avatar_url || null]
      );
      user = inserted.rows[0];
    }

    await client.query(
      `
      INSERT INTO github_user_tokens (
        user_id,
        access_token_ciphertext,
        refresh_token_ciphertext,
        access_token_expires_at,
        refresh_token_expires_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET access_token_ciphertext = EXCLUDED.access_token_ciphertext,
          refresh_token_ciphertext = EXCLUDED.refresh_token_ciphertext,
          access_token_expires_at = EXCLUDED.access_token_expires_at,
          refresh_token_expires_at = EXCLUDED.refresh_token_expires_at,
          updated_at = NOW()
      `,
      [
        user.id,
        encryptGitHubToken(token.access_token),
        encryptGitHubToken(token.refresh_token),
        expiryDate(token.expires_in),
        expiryDate(token.refresh_token_expires_in)
      ]
    );

    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function refreshGitHubToken(refreshToken) {
  const body = new URLSearchParams({
    client_id: requireEnv("GITHUB_CLIENT_ID"),
    client_secret: requireEnv("GITHUB_CLIENT_SECRET"),
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });
  return githubJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });
}

export async function getGitHubUserAccessToken(userId) {
  const result = await query(
    `
    SELECT access_token_ciphertext,
           refresh_token_ciphertext,
           access_token_expires_at,
           refresh_token_expires_at
    FROM github_user_tokens
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );
  if (result.rowCount === 0) {
    const err = new Error("GitHub account is not linked");
    err.status = 401;
    err.publicMessage = "github_account_not_linked";
    throw err;
  }

  const record = result.rows[0];
  const expiresAt = record.access_token_expires_at
    ? new Date(record.access_token_expires_at).getTime()
    : null;
  if (!expiresAt || expiresAt > Date.now() + 60_000) {
    return decryptGitHubToken(record.access_token_ciphertext);
  }

  const refreshExpiresAt = record.refresh_token_expires_at
    ? new Date(record.refresh_token_expires_at).getTime()
    : null;
  if (!record.refresh_token_ciphertext || (refreshExpiresAt && refreshExpiresAt <= Date.now())) {
    const err = new Error("GitHub authorization has expired");
    err.status = 401;
    err.publicMessage = "github_reauthorization_required";
    throw err;
  }

  const refreshed = await refreshGitHubToken(
    decryptGitHubToken(record.refresh_token_ciphertext)
  );
  if (!refreshed.access_token) {
    const err = new Error("GitHub token refresh failed");
    err.status = 401;
    err.publicMessage = "github_reauthorization_required";
    throw err;
  }

  await query(
    `
    UPDATE github_user_tokens
    SET access_token_ciphertext = $2,
        refresh_token_ciphertext = COALESCE($3, refresh_token_ciphertext),
        access_token_expires_at = $4,
        refresh_token_expires_at = COALESCE($5, refresh_token_expires_at),
        updated_at = NOW()
    WHERE user_id = $1
    `,
    [
      userId,
      encryptGitHubToken(refreshed.access_token),
      encryptGitHubToken(refreshed.refresh_token),
      expiryDate(refreshed.expires_in),
      expiryDate(refreshed.refresh_token_expires_in)
    ]
  );
  return refreshed.access_token;
}

export async function githubUserRequest(userId, path, options = {}) {
  const accessToken = await getGitHubUserAccessToken(userId);
  const url = path.startsWith("https://") ? path : `https://api.github.com${path}`;
  return githubJson(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {})
    }
  });
}
