# Cloudflare → AppDeploy cutover for 7ya.io

This directory defines the desired DNS state for moving the public web traffic of `7ya.io` to AppDeploy without changing nameservers, mail records, or unrelated subdomains.

## Desired records

```text
A      7ya.io       18.232.7.146
CNAME  www.7ya.io   proxy-v2.appdeploy.ai
```

Both records are intentionally `proxied=false` during AppDeploy domain verification and TLS issuance.

## Required Cloudflare token

Create a least-privilege API token restricted to zone `7ya.io` only:

- Zone → Zone → Read
- Zone → DNS → Edit
- Zone Resources → Include → Specific zone → `7ya.io`

Do not use a Global API Key.

## GitHub secrets

The read-only preflight workflow expects:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID` — optional; the script can resolve the zone by name when the token has Zone Read permission

GitHub Actions is currently blocked by an account-level billing lock. Adding secrets alone will not make the workflow run while that control-plane block remains active.

## Governed break-glass path

For an explicitly authorized out-of-band cutover, use:

```bash
bash scripts/cloudflare-appdeploy-breakglass.sh
```

Full procedure:

```text
docs/BREAK_GLASS_CUTOVER_20260716.md
```

The wrapper prompts for the token without echoing it, runs dry-run first, requires an exact human approval phrase, invokes the same Node.js reconciler, checks public DNS, unsets sensitive environment variables, and stores a local incident receipt.

Do not use simplified Python or cURL snippets as the production mutation path.

## Defensive runtime behavior

The reconciler is fail-closed and includes:

- API-token verification before reading the zone;
- validation that `CLOUDFLARE_ZONE_ID`, when supplied, belongs to `7ya.io` and is active;
- a 15-second timeout per request by default;
- exponential backoff with jitter for network failures, HTTP `408`, `429`, and transient `5xx` responses;
- support for Cloudflare's `retry-after` response header;
- no automatic retry for non-idempotent DNS-record creation requests;
- request-attempt audit metadata using Cloudflare request IDs when available;
- a pre-change mutable-record snapshot for each exact hostname;
- compensating rollback when reconciliation fails after a mutation begins;
- transactional rollback across both apex and `www` when a later hostname fails after an earlier hostname converged;
- read-back verification after successful writes and after every rollback;
- post-write convergence requiring exactly one desired mutable record and no conflicting `A`, `AAAA`, or `CNAME` records;
- fail-closed handling when a protected record coexists at `www.7ya.io` and would make a CNAME unsafe.

Optional runtime controls:

```text
CLOUDFLARE_REQUEST_TIMEOUT_MS=15000
CLOUDFLARE_MAX_ATTEMPTS=5
```

Accepted timeout range: 1,000–120,000 ms. Accepted attempt range: 1–8.

## Dry run

```bash
CLOUDFLARE_API_TOKEN=... \
CLOUDFLARE_ZONE_ID=... \
node scripts/cloudflare-appdeploy-dns.mjs
```

Dry run is the default. It prints the exact create/update/delete plan and performs no mutation.

## Apply — explicit approval gate

Apply is deliberately unavailable from the repository workflow. Run it only after Igor explicitly approves the DNS cutover:

```bash
CLOUDFLARE_API_TOKEN=... \
CLOUDFLARE_ZONE_ID=... \
CONFIRM_7YA_DNS_CUTOVER=7YA-APPDEPLOY-20260716 \
node scripts/cloudflare-appdeploy-dns.mjs --apply
```

This is a Node.js `.mjs` script. Do not invoke a nonexistent `reconciliation_script.py` command.

The script can replace only conflicting `A`, `AAAA`, and `CNAME` records at the exact hostnames `7ya.io` and `www.7ya.io`. It does not mutate MX, TXT, SRV, CAA, nameservers, or unrelated names.

## Definition of done — preflight

A valid preflight must show:

1. an active token;
2. the exact active zone `7ya.io`;
3. only the two intended hostnames;
4. the current GitHub Pages apex records as conflicts;
5. the desired AppDeploy apex and `www` targets;
6. no protected-record mutation;
7. no `401`, `403`, timeout, or unresolved rate-limit failure;
8. the final line `Dry-run complete. No DNS records were changed.`

## After apply

1. Verify `7ya.io` in AppDeploy.
2. Verify `www.7ya.io` in AppDeploy.
3. Wait for AppDeploy TLS issuance.
4. Test apex and www over HTTPS.
5. Test critical routes and crawl controls.
6. Keep the prior GitHub Pages addresses available as the rollback set until production acceptance is complete.

## Rollback addresses

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Use the Cloudflare audit log to restore the exact prior `www` record if rollback is required.