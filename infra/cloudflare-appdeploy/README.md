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

The script can replace only conflicting `A`, `AAAA`, and `CNAME` records at the exact hostnames `7ya.io` and `www.7ya.io`. It does not mutate MX, TXT, SRV, CAA, nameservers, or unrelated names.

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