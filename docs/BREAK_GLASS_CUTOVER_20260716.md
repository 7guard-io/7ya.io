# 7YA Break-Glass Cutover Runbook — 2026-07-16

Status: **Approved procedure only. Storing this document does not mutate DNS.**

## Purpose

GitHub Actions is currently blocked before job execution because the GitHub account is locked by a billing issue. Repository-hosted preflight and deployment jobs therefore cannot be treated as the active control plane.

The repository remains the source of truth. This break-glass procedure provides a temporary out-of-band execution path that runs the same idempotent reconciler directly from a trusted local shell or authenticated development environment.

## Do not use the simplified Python or cURL examples

The simplified examples circulated in discussion are not accepted for production because they may:

- default to `proxied: true`, which conflicts with AppDeploy domain verification;
- assume a matching record already exists;
- require copying record IDs manually;
- fail to remove conflicting `A`, `AAAA`, or `CNAME` records safely;
- omit token verification, timeouts, retries, rollback, and read-back checks;
- expose credentials in source code, terminal history, screenshots, or logs;
- leave apex and `www` in different states after a partial failure.

The governed reconciler is:

```text
scripts/cloudflare-appdeploy-dns.mjs
```

The human-operated wrapper is:

```text
scripts/cloudflare-appdeploy-breakglass.sh
```

## Required Cloudflare token

Create a Cloudflare Custom API Token with only:

- `Zone → Zone → Read`
- `Zone → DNS → Edit`
- `Zone Resources → Include → Specific zone → 7ya.io`

Do not use a Global API Key. Do not store the token in Git, GitHub Issues, email, screenshots, shell history, or documentation.

## Desired DNS state

```text
A      7ya.io       18.232.7.146             proxied=false
CNAME  www.7ya.io   proxy-v2.appdeploy.ai    proxied=false
```

Cloudflare nameservers must remain unchanged:

```text
anahi.ns.cloudflare.com
dakota.ns.cloudflare.com
```

MX, TXT, SPF, DKIM, DMARC, SRV, CAA, registrar ownership, and unrelated subdomains are outside the cutover scope.

## Trusted execution environment

Use a machine or workspace that satisfies all of the following:

- controlled by Igor Vepretski;
- no shared terminal session;
- Node.js 20 or newer;
- outbound HTTPS access to `api.cloudflare.com`;
- a clean checkout of PR #247's branch;
- no shell recording, public logs, or collaborative screen sharing while entering the token.

Do not run this procedure in an untrusted public Replit workspace or paste the token into chat.

## Checkout and inspect

```bash
git clone https://github.com/7guard-io/7ya.io.git
cd 7ya.io
git fetch origin infra/appdeploy-cloudflare-cutover-20260716
git checkout infra/appdeploy-cloudflare-cutover-20260716

git status --short
node --check scripts/cloudflare-appdeploy-dns.mjs
```

The working tree should be clean before continuing.

## Run the governed wrapper

Invoke the wrapper through Bash; executable file mode is not required:

```bash
bash scripts/cloudflare-appdeploy-breakglass.sh
```

The wrapper:

1. securely prompts for the Cloudflare token without echoing it;
2. runs a read-only dry run;
3. prints the exact reconciliation plan;
4. requires the explicit human phrase:

```text
APPLY 7YA APPDEPLOY CUTOVER
```

5. injects the dated confirmation value only for the apply process;
6. runs the transactional reconciler;
7. checks public DNS through `1.1.1.1` and `8.8.8.8` when `dig` is available;
8. unsets token variables on exit;
9. writes a local incident receipt with permissions restricted by `umask 077`.

## Mandatory dry-run review

Do not approve the phrase unless the plan is limited to these exact hostnames and targets:

```text
7ya.io       → 18.232.7.146
www.7ya.io   → proxy-v2.appdeploy.ai
```

Abort if the plan mentions mutation of:

- MX or mail-related TXT records;
- nameservers;
- unrelated subdomains;
- a zone other than `7ya.io`;
- any target other than the AppDeploy values above.

## Reconciler protections

The Node.js reconciler provides:

- Cloudflare token verification;
- zone-name and active-status verification;
- desired-state invariant validation;
- request timeout controls;
- bounded exponential backoff with jitter;
- retry handling for network failures, `408`, `429`, and transient `5xx` responses;
- support for `retry-after`;
- no blind retry of record-creation POST requests;
- pre-change snapshots for both exact hostnames;
- compensating rollback for a failed hostname;
- multi-host rollback when a later hostname fails after an earlier one converged;
- read-back after successful mutation;
- read-back after rollback;
- fail-closed behavior when protected records make a CNAME unsafe.

## Post-apply verification

Immediately after a successful apply:

```bash
dig +short @1.1.1.1 A 7ya.io
dig +short @8.8.8.8 A 7ya.io
dig +short @1.1.1.1 CNAME www.7ya.io
dig +short @8.8.8.8 CNAME www.7ya.io
```

Expected final answers:

```text
7ya.io A       18.232.7.146
www CNAME      proxy-v2.appdeploy.ai.
```

Then verify both hostnames in AppDeploy:

- App ID: `697a008fddc309b142`
- Apex: `7ya.io`
- Subdomain: `www.7ya.io`

After AppDeploy accepts DNS:

1. wait for TLS issuance;
2. confirm `https://7ya.io/` and `https://www.7ya.io/` load without certificate errors;
3. test the hero, visitor counter, viral feed, matte press archive, StartOn, and Evidence sections;
4. verify `robots.txt`, `sitemap.xml`, canonical metadata, and critical routes;
5. preserve the local break-glass receipt;
6. record the actual state in PR #247 without publishing the token or raw authorization headers.

## Rollback

The reconciler performs compensating rollback automatically when mutation or read-back fails. If an external failure occurs after convergence, use the Cloudflare audit log and the prior GitHub Pages state documented in the cutover receipt:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Restore the exact previous `www` value from the audit log. Do not change nameservers or mail records during rollback.

## Reconciliation after GitHub billing recovery

When GitHub Actions becomes available again:

1. run the read-only workflow from PR #247;
2. confirm the plan reports `noop` for both desired records;
3. merge the infrastructure PR only after the repository and Cloudflare actual state agree;
4. keep the Apply path out of GitHub Actions unless a separate reviewed production-approval design is introduced.

This closes the break-glass event and returns control to the normal GitOps process.

## Official references

- Cloudflare API token creation: `https://developers.cloudflare.com/fundamentals/api/get-started/create-token/`
- Cloudflare DNS record API: `https://developers.cloudflare.com/api/resources/dns/subresources/records/`
- Cloudflare API rate limits: `https://developers.cloudflare.com/fundamentals/api/reference/limits/`
