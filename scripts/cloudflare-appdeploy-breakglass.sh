#!/usr/bin/env bash
set -Eeuo pipefail

CONFIRMATION_VALUE="7YA-APPDEPLOY-20260716"
HUMAN_PHRASE="APPLY 7YA APPDEPLOY CUTOVER"
EXPECTED_BRANCH="infra/appdeploy-cloudflare-cutover-20260716"
EXPECTED_APEX="18.232.7.146"
EXPECTED_WWW="proxy-v2.appdeploy.ai"
RECONCILER="scripts/cloudflare-appdeploy-dns.mjs"
LOG_DIR="${TMPDIR:-/tmp}/7ya-dns-breakglass"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$LOG_DIR/$TIMESTAMP.log"
DNS_ASSERT_TIMEOUT_SECONDS="${DNS_ASSERT_TIMEOUT_SECONDS:-300}"
DNS_ASSERT_INTERVAL_SECONDS="${DNS_ASSERT_INTERVAL_SECONDS:-5}"
APPROVED_SHA="${BREAKGLASS_APPROVED_SHA:-}"

usage() {
  cat <<'USAGE'
Usage:
  bash scripts/cloudflare-appdeploy-breakglass.sh --approved-sha <40-char commit SHA>

The approved SHA must be copied from the reviewed PR head immediately before execution.
The wrapper refuses a dirty tree, a different branch, an inherited Cloudflare token,
or a missing DNS assertion tool.
USAGE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --approved-sha)
      [ "$#" -ge 2 ] || { usage >&2; exit 2; }
      APPROVED_SHA="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      printf '\nERROR: Unknown argument: %s\n' "$1" >&2
      exit 2
      ;;
  esac
done

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

is_uint() {
  [[ "$1" =~ ^[0-9]+$ ]]
}

normalize_dns_value() {
  tr '[:upper:]' '[:lower:]' | sed -e 's/\.$//' -e '/^[[:space:]]*$/d' | sort -u | paste -sd, -
}

query_dns() {
  local resolver="$1"
  local type="$2"
  local name="$3"
  dig +time=2 +tries=1 +short "@$resolver" "$type" "$name" 2>/dev/null | normalize_dns_value
}

assert_public_dns() {
  local deadline now attempt resolver apex www
  deadline=$(( $(date +%s) + DNS_ASSERT_TIMEOUT_SECONDS ))
  attempt=0

  while :; do
    attempt=$((attempt + 1))
    printf '\nDNS assertion attempt %s\n' "$attempt" | tee -a "$LOG_FILE"
    local converged=1

    for resolver in 1.1.1.1 8.8.8.8; do
      apex="$(query_dns "$resolver" A 7ya.io || true)"
      www="$(query_dns "$resolver" CNAME www.7ya.io || true)"
      printf '  resolver=%s apex_A=%s www_CNAME=%s\n' \
        "$resolver" "${apex:-<empty>}" "${www:-<empty>}" | tee -a "$LOG_FILE"

      if [ "$apex" != "$EXPECTED_APEX" ] || [ "$www" != "$EXPECTED_WWW" ]; then
        converged=0
      fi
    done

    if [ "$converged" -eq 1 ]; then
      printf '\nPublic DNS assertion passed on both resolvers.\n' | tee -a "$LOG_FILE"
      return 0
    fi

    now="$(date +%s)"
    if [ "$now" -ge "$deadline" ]; then
      printf '\nPUBLIC DNS ASSERTION FAILED after %ss.\n' "$DNS_ASSERT_TIMEOUT_SECONDS" | tee -a "$LOG_FILE" >&2
      printf 'The Cloudflare mutation may already have succeeded; do not infer rollback from this exit code.\n' | tee -a "$LOG_FILE" >&2
      printf 'Inspect Cloudflare audit logs and authoritative DNS before any corrective action.\n' | tee -a "$LOG_FILE" >&2
      return 6
    fi

    sleep "$DNS_ASSERT_INTERVAL_SECONDS"
  done
}

command -v git >/dev/null 2>&1 || fail "git is required."
command -v node >/dev/null 2>&1 || fail "Node.js is required."
command -v dig >/dev/null 2>&1 || fail "dig is required before apply so public DNS can be asserted." 2

[ -n "$APPROVED_SHA" ] || fail "An externally approved SHA is required. Pass --approved-sha <SHA>." 2
[[ "$APPROVED_SHA" =~ ^[0-9a-fA-F]{40}$ ]] || fail "Approved SHA must be exactly 40 hexadecimal characters." 2

is_uint "$DNS_ASSERT_TIMEOUT_SECONDS" || fail "DNS_ASSERT_TIMEOUT_SECONDS must be an integer." 2
is_uint "$DNS_ASSERT_INTERVAL_SECONDS" || fail "DNS_ASSERT_INTERVAL_SECONDS must be an integer." 2
[ "$DNS_ASSERT_TIMEOUT_SECONDS" -ge 10 ] && [ "$DNS_ASSERT_TIMEOUT_SECONDS" -le 1800 ] || fail "DNS assertion timeout must be between 10 and 1800 seconds." 2
[ "$DNS_ASSERT_INTERVAL_SECONDS" -ge 1 ] && [ "$DNS_ASSERT_INTERVAL_SECONDS" -le 60 ] || fail "DNS assertion interval must be between 1 and 60 seconds." 2

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || fail "Run this command from a Git checkout." 2
cd "$REPO_ROOT"

CURRENT_BRANCH="$(git branch --show-current)"
CURRENT_SHA="$(git rev-parse HEAD)"

[ "$CURRENT_BRANCH" = "$EXPECTED_BRANCH" ] || fail "Expected branch $EXPECTED_BRANCH, found ${CURRENT_BRANCH:-detached HEAD}." 3
[ "$CURRENT_SHA" = "$APPROVED_SHA" ] || fail "HEAD $CURRENT_SHA does not match externally approved SHA $APPROVED_SHA." 3

if [ -n "$(git status --porcelain=v1 --untracked-files=all)" ]; then
  git status --short >&2
  fail "Working tree is not clean. Commit, discard, or remove every change before break-glass execution." 3
fi

[ -f "$RECONCILER" ] || fail "Reconciler not found at $RECONCILER." 2
node --check "$RECONCILER" >/dev/null

NODE_MAJOR="$(node -p "Number(process.versions.node.split('.')[0])")"
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node.js 20 or newer is required; found $(node --version)."
fi

if [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  fail "Refusing an inherited CLOUDFLARE_API_TOKEN. Unset it in the parent shell and use the hidden prompt." 5
fi

printf 'Cloudflare API token for zone 7ya.io: ' >&2
IFS= read -r -s CLOUDFLARE_API_TOKEN
printf '\n' >&2
export CLOUDFLARE_API_TOKEN

[ -n "$CLOUDFLARE_API_TOKEN" ] || fail "Cloudflare token was not provided."

printf '\n7YA BREAK-GLASS DNS CUTOVER\n'
printf 'UTC timestamp: %s\n' "$TIMESTAMP"
printf 'Branch: %s\n' "$CURRENT_BRANCH"
printf 'Approved HEAD: %s\n' "$CURRENT_SHA"
printf 'Repository reconciler: %s\n' "$RECONCILER"
printf 'Log file: %s\n\n' "$LOG_FILE"

{
  printf '=== PREFLIGHT / DRY RUN ===\n'
  node "$RECONCILER"
} 2>&1 | tee "$LOG_FILE"

printf '\nReview the plan above. It must mention only:\n'
printf '  A      7ya.io       %s\n' "$EXPECTED_APEX"
printf '  CNAME  www.7ya.io   %s\n' "$EXPECTED_WWW"
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

printf '\n=== PUBLIC DNS ASSERTION LOOP ===\n' | tee -a "$LOG_FILE"
assert_public_dns

printf '\nBreak-glass mutation and resolver assertions completed.\n'
printf 'Next mandatory steps:\n'
printf '  1. Verify 7ya.io and www.7ya.io in AppDeploy.\n'
printf '  2. Confirm valid HTTPS/TLS on both hostnames.\n'
printf '  3. Test homepage, visitor counter, viral archive, StartOn, and Evidence surfaces.\n'
printf '  4. Preserve this log as the incident receipt: %s\n' "$LOG_FILE"
