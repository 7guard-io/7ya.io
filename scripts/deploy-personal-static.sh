#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# 7YA safe static production deploy.
# Builds the governed dist artifact, proves its integrity, links only to the
# approved personal Vercel scope, deploys a temporary copy, and performs
# unauthenticated smoke tests. It never changes DNS or custom domains.

PERSONAL_SCOPE="${VERCEL_PERSONAL_SCOPE:-igor-vepretskis-projects}"
EXPECTED_PERSONAL_ORG_ID="${VERCEL_PERSONAL_ORG_ID:-team_0lHRQwvDzYt3C6UwXUibzmcP}"
BLOCKED_TEAM_SCOPE="${VERCEL_BLOCKED_TEAM_SCOPE:-7ya}"
BLOCKED_TEAM_ORG_ID="${VERCEL_BLOCKED_TEAM_ORG_ID:-team_iNIgNZ4YWL66QZRdZn2IihaL}"
PROJECT_NAME="${VERCEL_STATIC_PROJECT:-7ya-static-personal-safe}"
ALLOW_NON_MAIN="${ALLOW_NON_MAIN:-0}"
ALLOW_DIRTY_TREE="${ALLOW_DIRTY_TREE:-0}"
ALLOW_DISABLE_PROTECTION="${ALLOW_DISABLE_PROTECTION:-0}"
SKIP_INSTALL="${SKIP_INSTALL:-0}"

log() { printf '\n[7YA] %s\n' "$*"; }
die() { printf '\n[7YA:BLOCKED] %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

for command in git node npm vercel curl; do require_cmd "$command"; done

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || die "Run inside the 7YA Git repository."
cd "$ROOT"

CURRENT_BRANCH="$(git branch --show-current)"
CURRENT_SHA="$(git rev-parse HEAD)"

if [[ "$CURRENT_BRANCH" != "main" && "$ALLOW_NON_MAIN" != "1" ]]; then
  die "Refusing production deploy from '$CURRENT_BRANCH'. Merge to main or set ALLOW_NON_MAIN=1 explicitly."
fi

if [[ "$ALLOW_DIRTY_TREE" != "1" ]]; then
  git diff --quiet || die "Tracked working tree changes exist. Commit or stash them first."
  git diff --cached --quiet || die "Staged changes exist. Commit or unstage them first."
fi

[[ "$PERSONAL_SCOPE" != "$BLOCKED_TEAM_SCOPE" ]] || die "Blocked Vercel team scope selected: $BLOCKED_TEAM_SCOPE"
[[ "$EXPECTED_PERSONAL_ORG_ID" != "$BLOCKED_TEAM_ORG_ID" ]] || die "Personal and blocked Vercel organization IDs are identical."

log "Authenticated Vercel user"
VERCEL_USER="$(vercel whoami --no-color 2>/dev/null | tail -n 1 | tr -d '\r')"
[[ -n "$VERCEL_USER" ]] || die "Vercel authentication is missing. Run 'vercel login' once, then rerun."
printf '[7YA] user=%s scope=%s project=%s\n' "$VERCEL_USER" "$PERSONAL_SCOPE" "$PROJECT_NAME"

if [[ "$SKIP_INSTALL" != "1" ]]; then
  log "Installing locked dependencies"
  npm ci
fi

log "Running full release gate and building immutable dist artifact"
npm run release:gate

[[ -f dist/artifact-manifest.json ]] || die "dist/artifact-manifest.json was not produced."
[[ -f dist/sitemap.xml ]] || die "dist/sitemap.xml is missing."
[[ -f dist/evidence/index.html ]] || die "dist/evidence/index.html is missing."
[[ -f dist/knowledge/public-universe-records-20260715.json ]] || die "Public Universe dataset is missing from dist."

if find dist -type l -print -quit | grep -q .; then
  die "Symlink found inside dist. Static artifact must contain regular files only."
fi

sha256_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

MANIFEST_SHA="$(sha256_file dist/artifact-manifest.json)"
EVIDENCE_DIR="$ROOT/.release-evidence/${CURRENT_SHA:0:12}-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$EVIDENCE_DIR"
cp dist/artifact-manifest.json "$EVIDENCE_DIR/artifact-manifest.json"
printf '%s\n' "$MANIFEST_SHA" > "$EVIDENCE_DIR/artifact-manifest.sha256"

WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/7ya-static-release.XXXXXX")"
cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT
cp -a dist/. "$WORK_DIR/"

log "Linking disposable artifact copy to approved personal scope"
vercel link "$WORK_DIR" \
  --yes \
  --project "$PROJECT_NAME" \
  --scope "$PERSONAL_SCOPE" \
  --no-color | tee "$EVIDENCE_DIR/vercel-link.log"

PROJECT_FILE="$WORK_DIR/.vercel/project.json"
[[ -f "$PROJECT_FILE" ]] || die "Vercel did not create project linkage metadata."

node - "$PROJECT_FILE" "$EXPECTED_PERSONAL_ORG_ID" "$BLOCKED_TEAM_ORG_ID" <<'NODE'
const fs = require('node:fs');
const [file, expected, blocked] = process.argv.slice(2);
const project = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!project.orgId) throw new Error('Linked Vercel project has no orgId');
if (project.orgId === blocked) throw new Error(`Refusing blocked 7ya team orgId: ${blocked}`);
if (project.orgId !== expected) throw new Error(`Unexpected Vercel orgId ${project.orgId}; expected personal ${expected}`);
if (!project.projectId) throw new Error('Linked Vercel project has no projectId');
process.stdout.write(`PERSONAL_SCOPE_LINK: PASS (${project.orgId} / ${project.projectId})\n`);
NODE

cp "$PROJECT_FILE" "$EVIDENCE_DIR/vercel-project.json"

log "Recording deployment-protection state"
vercel project protection "$PROJECT_NAME" \
  --format json \
  --scope "$PERSONAL_SCOPE" \
  --no-color > "$EVIDENCE_DIR/protection-before.json" 2> "$EVIDENCE_DIR/protection-before.stderr" || true

log "Deploying the verified static artifact to Vercel production"
DEPLOY_OUTPUT="$(vercel deploy "$WORK_DIR" \
  --prod \
  --yes \
  --scope "$PERSONAL_SCOPE" \
  --no-color 2>&1 | tee "$EVIDENCE_DIR/vercel-deploy.log")"

DEPLOYMENT_URL="$(printf '%s\n' "$DEPLOY_OUTPUT" | grep -Eo 'https://[^[:space:]]+\.vercel\.app' | tail -n 1 || true)"
[[ -n "$DEPLOYMENT_URL" ]] || die "Could not extract deployment URL. See $EVIDENCE_DIR/vercel-deploy.log"

log "Waiting for Vercel READY state"
vercel inspect "$DEPLOYMENT_URL" \
  --wait \
  --scope "$PERSONAL_SCOPE" \
  --no-color | tee "$EVIDENCE_DIR/vercel-inspect.log"

fetch_public() {
  local path="$1"
  local expected="$2"
  local safe_name
  safe_name="$(printf '%s' "$path" | sed 's#^/##; s#[^A-Za-z0-9._-]#_#g')"
  [[ -n "$safe_name" ]] || safe_name="root"
  local headers="$EVIDENCE_DIR/${safe_name}.headers"
  local body="$EVIDENCE_DIR/${safe_name}.body"
  local status
  status="$(curl -sS -L \
    --connect-timeout 15 \
    --max-time 60 \
    -D "$headers" \
    -o "$body" \
    -w '%{http_code}' \
    "${DEPLOYMENT_URL}${path}")"
  [[ "$status" == "$expected" ]] || return 10
  if grep -Eqi 'Vercel Authentication|vercel-sso|deployment protection' "$body"; then
    return 11
  fi
}

public_root_check() {
  fetch_public "/" "200"
}

if ! public_root_check; then
  if [[ "$ALLOW_DISABLE_PROTECTION" == "1" ]]; then
    log "Public access failed; attempting reversible protection disable because ALLOW_DISABLE_PROTECTION=1"
    vercel project protection disable "$PROJECT_NAME" --sso --scope "$PERSONAL_SCOPE" --yes --no-color || true
    vercel project protection disable "$PROJECT_NAME" --password --scope "$PERSONAL_SCOPE" --yes --no-color || true
    sleep 3
    public_root_check || die "Deployment remains non-public after protection-disable attempt."
  else
    die "Deployment is not publicly reachable. Inspect protection settings or rerun with ALLOW_DISABLE_PROTECTION=1. No DNS change was attempted."
  fi
fi

log "Running unauthenticated production smoke tests"
for path in \
  "/museum/" \
  "/evidence/" \
  "/starton/" \
  "/sitemap.xml" \
  "/robots.txt" \
  "/artifact-manifest.json" \
  "/knowledge/public-universe-records-20260715.json" \
  "/styles/public-universe-20260715.css" \
  "/scripts/public-content-museum-20260715.js"; do
  fetch_public "$path" "200" || die "Smoke test failed for ${DEPLOYMENT_URL}${path}"
done

fetch_public "/api/guide" "404" || die "Pure static contract violated: /api/guide must fail closed with 404."
fetch_public "/definitely-missing-7ya-gate/" "404" || die "Missing route does not return 404."

ROOT_BODY="$EVIDENCE_DIR/root.body"
MUSEUM_BODY="$EVIDENCE_DIR/museum_.body"
SITEMAP_BODY="$EVIDENCE_DIR/sitemap.xml.body"
REMOTE_MANIFEST="$EVIDENCE_DIR/artifact-manifest.json.body"

# Names above are produced by fetch_public's deterministic path sanitizer.
[[ -f "$ROOT_BODY" ]] || ROOT_BODY="$EVIDENCE_DIR/root.body"
[[ -f "$MUSEUM_BODY" ]] || MUSEUM_BODY="$EVIDENCE_DIR/museum_.body"

grep -q 'IGOR VEPRETSKI' "$ROOT_BODY" || die "Homepage identity marker missing."
grep -q 'PUBLIC UNIVERSE' "$MUSEUM_BODY" || die "Museum Public Universe marker missing."
grep -q 'https://7ya.io/evidence/' "$SITEMAP_BODY" || die "sitemap.xml does not include /evidence/."
cmp -s dist/artifact-manifest.json "$REMOTE_MANIFEST" || die "Remote artifact manifest differs from the verified local manifest."

REMOTE_MANIFEST_SHA="$(sha256_file "$REMOTE_MANIFEST")"
[[ "$REMOTE_MANIFEST_SHA" == "$MANIFEST_SHA" ]] || die "Remote manifest SHA-256 mismatch."

log "Checking production error logs"
vercel logs \
  --deployment "$DEPLOYMENT_URL" \
  --level error \
  --since 5m \
  --scope "$PERSONAL_SCOPE" \
  --no-color > "$EVIDENCE_DIR/runtime-errors.log" 2>&1 || true

node - "$EVIDENCE_DIR/release-evidence.json" "$CURRENT_SHA" "$CURRENT_BRANCH" "$PERSONAL_SCOPE" "$PROJECT_NAME" "$DEPLOYMENT_URL" "$MANIFEST_SHA" <<'NODE'
const fs = require('node:fs');
const [file, sourceSha, branch, scope, project, deploymentUrl, manifestSha] = process.argv.slice(2);
const evidence = {
  schema_version: 1,
  result: 'PASS',
  source_sha: sourceSha,
  source_branch: branch,
  vercel_scope: scope,
  vercel_project: project,
  deployment_url: deploymentUrl,
  artifact_manifest_sha256: manifestSha,
  dns_changed: false,
  custom_domain_attached: false,
  static_api_contract: '/api/guide returns 404',
  verified_paths: [
    '/', '/museum/', '/evidence/', '/starton/', '/sitemap.xml', '/robots.txt',
    '/artifact-manifest.json', '/knowledge/public-universe-records-20260715.json',
    '/styles/public-universe-20260715.css', '/scripts/public-content-museum-20260715.js'
  ],
  verified_at: new Date().toISOString(),
};
fs.writeFileSync(file, `${JSON.stringify(evidence, null, 2)}\n`);
NODE

printf '\n7YA_PERSONAL_STATIC_DEPLOY: PASS\n'
printf 'Deployment: %s\n' "$DEPLOYMENT_URL"
printf 'Evidence:   %s\n' "$EVIDENCE_DIR/release-evidence.json"
printf 'Manifest:   %s\n' "$MANIFEST_SHA"
printf 'DNS:        untouched\n'
