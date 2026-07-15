#!/usr/bin/env bash
set -Eeuo pipefail

CONFIRMATION_VALUE="7YA-APPDEPLOY-20260716"
HUMAN_PHRASE="APPLY 7YA APPDEPLOY CUTOVER"
RECONCILER="scripts/cloudflare-appdeploy-dns.mjs"
LOG_DIR="${TMPDIR:-/tmp}/7ya-dns-breakglass"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$LOG_DIR/$TIMESTAMP.log"

mkdir -p "$LOG_DIR"
chmod 700 "$LOG_DIR"
umask 077

cleanup() {
  unset CLOUDFLARE_API_TOKEN || true
  unset CONFIRM_7YA_DNS_CUTOVER || true
}
trap cleanup EXIT INT TERM

fail() {
  printf '\nERROR: %s\n' "$1" >&2
  exit "${2:-1}"
}

command -v node >/dev/null 2>&1 || fail "Node.js is required."
node --check "$RECONCILER" >/dev/null

NODE_MAJOR="$(node -p "Number(process.versions.node.split('.')[0])")"
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node.js 20 or newer is required; found $(node --version)."
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  printf 'Cloudflare API token for zone 7ya.io: ' >&2
  IFS= read -r -s CLOUDFLARE_API_TOKEN
  printf '\n' >&2
  export CLOUDFLARE_API_TOKEN
fi

[ -n "${CLOUDFLARE_API_TOKEN:-}" ] || fail "Cloudflare token was not provided."

printf '\n7YA BREAK-GLASS DNS CUTOVER\n'
printf 'UTC timestamp: %s\n' "$TIMESTAMP"
printf 'Repository reconciler: %s\n' "$RECONCILER"
printf 'Log file: %s\n\n' "$LOG_FILE"

{
  printf '=== PREFLIGHT / DRY RUN ===\n'
  node "$RECONCILER"
} 2>&1 | tee "$LOG_FILE"

printf '\nReview the plan above. It must mention only:\n'
printf '  A      7ya.io       18.232.7.146\n'
printf '  CNAME  www.7ya.io   proxy-v2.appdeploy.ai\n'
printf 'It must not propose changes to MX, TXT, SRV, CAA, nameservers, or unrelated hostnames.\n\n'

printf 'Type exactly "%s" to continue: ' "$HUMAN_PHRASE" >&2
IFS= read -r typed_phrase

if [ "$typed_phrase" != "$HUMAN_PHRASE" ]; then
  fail "Human approval phrase did not match. No DNS mutation was performed." 4
fi

export CONFIRM_7YA_DNS_CUTOVER="$CONFIRMATION_VALUE"

{
  printf '\n=== APPLY ===\n'
  node "$RECONCILER" --apply
} 2>&1 | tee -a "$LOG_FILE"

printf '\n=== PUBLIC DNS READ-BACK ===\n' | tee -a "$LOG_FILE"
if command -v dig >/dev/null 2>&1; then
  {
    printf '\nCloudflare resolver (1.1.1.1), apex A:\n'
    dig +short @1.1.1.1 A 7ya.io
    printf '\nGoogle resolver (8.8.8.8), apex A:\n'
    dig +short @8.8.8.8 A 7ya.io
    printf '\nCloudflare resolver (1.1.1.1), www CNAME:\n'
    dig +short @1.1.1.1 CNAME www.7ya.io
    printf '\nGoogle resolver (8.8.8.8), www CNAME:\n'
    dig +short @8.8.8.8 CNAME www.7ya.io
  } | tee -a "$LOG_FILE"
else
  printf 'dig is not installed. Perform resolver checks manually before AppDeploy verification.\n' | tee -a "$LOG_FILE"
fi

printf '\nBreak-glass mutation completed.\n'
printf 'Next mandatory steps:\n'
printf '  1. Verify 7ya.io and www.7ya.io in AppDeploy.\n'
printf '  2. Confirm valid HTTPS/TLS on both hostnames.\n'
printf '  3. Test homepage, visitor counter, viral archive, StartOn, and Evidence surfaces.\n'
printf '  4. Preserve this log as the incident receipt: %s\n' "$LOG_FILE"
