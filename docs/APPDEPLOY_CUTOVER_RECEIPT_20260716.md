# 7YA AppDeploy Cutover Receipt — 2026-07-16

Status: **AppDeploy release ready; custom-domain routing pending Cloudflare DNS.**

## Verified target

- AppDeploy app ID: `697a008fddc309b142`
- Preview URL: `https://697a008fddc309b142.v2.appdeploy.ai/`
- AppDeploy stage: `v2`
- AppDeploy proxy host: `proxy-v2.appdeploy.ai`
- AppDeploy fallback IPv4: `18.232.7.146`
- Custom hostnames registered in AppDeploy:
  - `7ya.io`
  - `www.7ya.io`
- AppDeploy status before DNS change: `pending_dns`

## Current public routing observed before cutover

The apex domain still resolves to the GitHub Pages address set:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

This means the public domain does not yet serve the AppDeploy release.

## Desired Cloudflare web records

Initial verification must use DNS-only records so AppDeploy can see the origin directly and issue TLS correctly.

```text
A      7ya.io       18.232.7.146             proxied=false
CNAME  www.7ya.io   proxy-v2.appdeploy.ai    proxied=false
```

Only conflicting `A`, `AAAA`, or `CNAME` records for the exact hostnames `7ya.io` and `www.7ya.io` may be replaced.

## Hard safety boundaries

The cutover must not change:

- Cloudflare nameservers
- MX records
- SPF, DKIM, DMARC, or other mail-related TXT records
- unrelated subdomains
- registrar ownership or transfer state
- application code or AppDeploy data

The domain currently uses these Cloudflare nameservers and they must remain unchanged:

- `anahi.ns.cloudflare.com`
- `dakota.ns.cloudflare.com`

## GitOps gate

The repository includes a dry-run-by-default DNS reconciliation script at:

```text
scripts/cloudflare-appdeploy-dns.mjs
```

The corresponding GitHub Actions workflow performs **read-only preflight only**. It cannot write DNS.

A real mutation requires all of the following outside the default workflow:

1. A Cloudflare API token scoped only to zone `7ya.io`.
2. Permission `Zone:Read` and `DNS:Edit` for that zone only.
3. Explicit invocation with `--apply`.
4. Exact confirmation value:

```text
CONFIRM_7YA_DNS_CUTOVER=7YA-APPDEPLOY-20260716
```

## Acceptance checks after an approved change

1. AppDeploy verifies `7ya.io`.
2. AppDeploy verifies `www.7ya.io`.
3. `https://7ya.io/` returns the new Igor-first AppDeploy experience.
4. `https://www.7ya.io/` follows the approved apex/www policy.
5. TLS is valid on both hostnames.
6. The `/viral` experience, visitor counter, archive, StartOn, and Evidence surfaces load without frontend or backend errors.
7. `robots.txt`, `sitemap.xml`, canonical tags, and critical routes are rechecked before retiring the GitHub Pages fallback.

## Rollback

If AppDeploy verification or HTTPS fails, restore the prior GitHub Pages apex addresses listed above and restore the previous `www` record from the Cloudflare audit log. Do not alter nameservers or mail records during rollback.

## Ownership note

DNS control and registrar ownership are separate. The pending Name.com/Replit internal transfer does not block a Cloudflare DNS cutover while the zone remains active in Igor's Cloudflare account.