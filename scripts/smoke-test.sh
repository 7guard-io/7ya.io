#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-https://7ya-api.netlify.app/api/chat}"
ORIGIN="${ORIGIN:-https://7ya.io}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"
PAYLOAD_MESSAGE="healthcheck-do-not-echo"

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

header_value() {
  local file="$1"
  local name="$2"
  awk -v key="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')" '
    BEGIN { IGNORECASE=1 }
    {
      line=$0
      sub(/\r$/, "", line)
      split(line, parts, ":")
      header=tolower(parts[1])
      if (header == key) {
        sub(/^[^:]*:[[:space:]]*/, "", line)
        value=line
      }
    }
    END { print value }
  ' "$file"
}

contains_token() {
  local value="$1"
  local expected="$2"
  printf '%s' "$value" | tr '[:upper:]' '[:lower:]' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -Fxq "$(printf '%s' "$expected" | tr '[:upper:]' '[:lower:]')"
}

printf '7YA API curl smoke test\nTarget: %s\nOrigin: %s\n\n' "$API_URL" "$ORIGIN"

options_status="$(curl --silent --show-error --max-time "$TIMEOUT_SECONDS" \
  --dump-header "$workdir/options.headers" \
  --output /dev/null \
  --write-out '%{http_code}' \
  --request OPTIONS "$API_URL" \
  --header "Origin: $ORIGIN" \
  --header 'Access-Control-Request-Method: POST' \
  --header 'Access-Control-Request-Headers: content-type')"

allow_origin="$(header_value "$workdir/options.headers" 'access-control-allow-origin')"
allow_methods="$(header_value "$workdir/options.headers" 'access-control-allow-methods')"
allow_headers="$(header_value "$workdir/options.headers" 'access-control-allow-headers')"

[[ "$options_status" == "204" ]] || { echo "FAIL: OPTIONS expected 204, got $options_status"; exit 1; }
[[ "$allow_origin" == "$ORIGIN" || "$allow_origin" == "*" ]] || { echo "FAIL: unexpected allow-origin: ${allow_origin:-<missing>}"; exit 1; }
contains_token "$allow_methods" POST || { echo "FAIL: POST missing from allow-methods"; exit 1; }
{ contains_token "$allow_headers" content-type || contains_token "$allow_headers" '*'; } || { echo "FAIL: content-type missing from allow-headers"; exit 1; }
echo 'PASS: OPTIONS/CORS'

post_status="$(curl --silent --show-error --max-time "$TIMEOUT_SECONDS" \
  --dump-header "$workdir/post.headers" \
  --output "$workdir/post.body" \
  --write-out '%{http_code}' \
  --request POST "$API_URL" \
  --header "Origin: $ORIGIN" \
  --header 'Content-Type: application/json' \
  --data "{\"message\":\"$PAYLOAD_MESSAGE\"}")"

content_type="$(header_value "$workdir/post.headers" 'content-type')"
post_allow_origin="$(header_value "$workdir/post.headers" 'access-control-allow-origin')"
body_bytes="$(wc -c < "$workdir/post.body" | tr -d ' ')"

[[ "$post_status" =~ ^2[0-9][0-9]$ ]] || { echo "FAIL: POST expected 2xx, got $post_status"; exit 1; }
[[ "$content_type" == *application/json* ]] || { echo "FAIL: POST content-type is ${content_type:-<missing>}"; exit 1; }
[[ "$post_allow_origin" == "$ORIGIN" || "$post_allow_origin" == "*" ]] || { echo "FAIL: POST allow-origin mismatch"; exit 1; }
[[ "$body_bytes" -gt 0 ]] || { echo 'FAIL: POST body is empty'; exit 1; }
! grep -Fq "$PAYLOAD_MESSAGE" "$workdir/post.body" || { echo 'FAIL: API echoed the test message'; exit 1; }

if command -v jq >/dev/null 2>&1; then
  jq -e . "$workdir/post.body" >/dev/null || { echo 'FAIL: POST body is not valid JSON'; exit 1; }
fi

echo "PASS: POST ($body_bytes response bytes; body not printed)"
echo 'RESULT: PASS'
