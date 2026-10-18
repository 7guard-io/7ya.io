import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  body: JSON.stringify(body),
});

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const signState = (payload) => {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', required('INSTAGRAM_STATE_SECRET')).update(data).digest('base64url');
  return `${data}.${signature}`;
};

const verifyState = (state) => {
  const [data, signature] = String(state || '').split('.');
  if (!data || !signature) throw new Error('Invalid OAuth state');
  const expected = crypto.createHmac('sha256', required('INSTAGRAM_STATE_SECRET')).update(data).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('Invalid OAuth state');
  const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  if (!payload.exp || Date.now() > payload.exp) throw new Error('Expired OAuth state');
  return payload;
};

async function ensureTable() {
  if (!pool) throw new Error('DATABASE_URL is required');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS instagram_connections (
      account_key TEXT PRIMARY KEY,
      instagram_user_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      expires_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function saveConnection(accountKey, userId, accessToken, expiresIn) {
  await ensureTable();
  const expiresAt = expiresIn ? new Date(Date.now() + Number(expiresIn) * 1000) : null;
  await pool.query(
    `INSERT INTO instagram_connections(account_key, instagram_user_id, access_token, expires_at, updated_at)
     VALUES($1,$2,$3,$4,NOW())
     ON CONFLICT(account_key) DO UPDATE SET instagram_user_id=$2, access_token=$3, expires_at=$4, updated_at=NOW()`,
    [accountKey, String(userId), accessToken, expiresAt],
  );
}

async function getConnection(accountKey) {
  await ensureTable();
  const { rows } = await pool.query(
    'SELECT instagram_user_id, access_token, expires_at, updated_at FROM instagram_connections WHERE account_key=$1',
    [accountKey],
  );
  return rows[0] || null;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    client_id: required('INSTAGRAM_APP_ID'),
    client_secret: required('INSTAGRAM_APP_SECRET'),
    grant_type: 'authorization_code',
    redirect_uri: required('INSTAGRAM_REDIRECT_URI'),
    code,
  });
  const response = await fetch(process.env.INSTAGRAM_TOKEN_URL || 'https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_message || data.error?.message || 'Instagram token exchange failed');
  return data;
}

async function fetchMedia(accessToken, limit = 25) {
  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username';
  const url = new URL(process.env.INSTAGRAM_MEDIA_URL || 'https://graph.instagram.com/me/media');
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(Math.min(Math.max(Number(limit) || 25, 1), 100)));
  url.searchParams.set('access_token', accessToken);
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Instagram media request failed');
  return data;
}

export async function handler(event) {
  try {
    const method = event.httpMethod || 'GET';
    if (method !== 'GET') return json(405, { error: 'Method not allowed' });

    const params = event.queryStringParameters || {};
    const action = params.action || 'status';
    const accountKey = params.account || 'igor.vepretski';

    if (action === 'authorize') {
      const state = signState({ accountKey, exp: Date.now() + 10 * 60 * 1000 });
      const auth = new URL(process.env.INSTAGRAM_AUTH_URL || 'https://www.instagram.com/oauth/authorize');
      auth.searchParams.set('client_id', required('INSTAGRAM_APP_ID'));
      auth.searchParams.set('redirect_uri', required('INSTAGRAM_REDIRECT_URI'));
      auth.searchParams.set('response_type', 'code');
      auth.searchParams.set('scope', process.env.INSTAGRAM_SCOPES || 'instagram_business_basic');
      auth.searchParams.set('state', state);
      return { statusCode: 302, headers: { location: auth.toString(), 'cache-control': 'no-store' }, body: '' };
    }

    if (action === 'callback') {
      const { accountKey: verifiedAccountKey } = verifyState(params.state);
      if (!params.code) return json(400, { error: 'Missing authorization code' });
      const token = await exchangeCode(params.code);
      await saveConnection(verifiedAccountKey, token.user_id, token.access_token, token.expires_in);
      const destination = process.env.INSTAGRAM_SUCCESS_REDIRECT || 'https://7ya.io/?instagram=connected';
      return { statusCode: 302, headers: { location: destination, 'cache-control': 'no-store' }, body: '' };
    }

    const connection = await getConnection(accountKey);
    if (action === 'status') {
      return json(200, {
        connected: Boolean(connection),
        account: accountKey,
        expiresAt: connection?.expires_at || null,
        updatedAt: connection?.updated_at || null,
      }, { 'cache-control': 'no-store' });
    }

    if (action === 'media') {
      if (!connection) return json(404, { error: 'Instagram account is not connected', authorize: `/.netlify/functions/instagram-access?action=authorize&account=${encodeURIComponent(accountKey)}` });
      const media = await fetchMedia(connection.access_token, params.limit);
      return json(200, media, { 'cache-control': 'private, max-age=60' });
    }

    return json(400, { error: 'Unknown action' });
  } catch (error) {
    console.error('instagram-access', error);
    return json(500, { error: error instanceof Error ? error.message : 'Unexpected error' }, { 'cache-control': 'no-store' });
  }
}
