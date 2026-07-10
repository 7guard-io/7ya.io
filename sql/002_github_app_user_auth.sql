BEGIN;

ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS github_id BIGINT,
  ADD COLUMN IF NOT EXISTS github_login TEXT,
  ADD COLUMN IF NOT EXISTS github_avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'password';

CREATE UNIQUE INDEX IF NOT EXISTS users_github_id_unique
ON users (github_id)
WHERE github_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_github_login_lower_unique
ON users ((LOWER(github_login)))
WHERE github_login IS NOT NULL;

CREATE TABLE IF NOT EXISTS github_user_tokens (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token_ciphertext TEXT NOT NULL,
  refresh_token_ciphertext TEXT,
  access_token_expires_at TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
