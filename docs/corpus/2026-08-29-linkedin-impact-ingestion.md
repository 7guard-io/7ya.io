# LinkedIn Impact Ingestion — 2026-08-29

Purpose: preserve a source-control provenance manifest for public LinkedIn discovery candidates resolved during the 2026-08-29 7YA ingestion session. These records are Discovery inputs, not automatic Canon promotion, and they carry no synthetic cross-platform reach.

## Resolved public seeds

1. `7069590395591999489` — Fatherhood / becoming a parent — https://www.linkedin.com/posts/vepretski_%D7%90%D7%A0%D7%99-%D7%91%D7%9F-26-%D7%95%D7%90%D7%A0%D7%99-%D7%A2%D7%95%D7%9E%D7%93-%D7%9C%D7%94%D7%99%D7%95%D7%AA-%D7%90%D7%91%D7%90-%D7%90%D7%99%D7%96%D7%94-share-7069590395591999489-gIqE/
2. `7240289437606150145` — Public service / public debate — https://www.linkedin.com/posts/vepretski_achacnacpadeacladgabracyacradfacpacl-acpadfadeacgacsachacpadgacwacl-ugcPost-7240289437606150145-i5X1/
3. `7002699174827732992` — Childhood / education / StartOn mission bridge — https://www.linkedin.com/posts/vepretski_%D7%9C%D7%9E%D7%95%D7%A8%D7%94-%D7%A9%D7%A8%D7%A9%D7%9E%D7%94-%D7%9C%D7%90%D7%9E%D7%90-%D7%A9%D7%9C%D7%99-%D7%9C%D7%A4%D7%A0%D7%99%D7%99-%D7%91%D7%99%D7%93%D7%99%D7%95%D7%A7-25-%D7%A9%D7%A0%D7%99%D7%9D-share-7002699174827732992-OyH1/
4. `6965163606975893504` — StartOn origin manifesto — https://www.linkedin.com/posts/vepretski_acxacoacgadeacoacgada-acoacracwaclacsaclaciacpack-ugcPost-6965163606975893504-Iznl/
5. `7001305382035812352` — Public-service transition / leaving police service — https://www.linkedin.com/posts/vepretski_%D7%9E%D7%A9%D7%98%D7%A8%D7%94-activity-7001305382035812352-MW4w
6. `7032741993038372864` — Fatherhood / presence / family values — https://www.linkedin.com/posts/vepretski_%D7%9B%D7%A9%D7%94%D7%94%D7%95%D7%A8%D7%99%D7%9D-%D7%A9%D7%9C%D7%99-%D7%94%D7%AA%D7%92%D7%A8%D7%A9%D7%95-%D7%90%D7%91%D7%90-%D7%A9%D7%9C%D7%99-%D7%97%D7%AA%D7%9D-%D7%93%D7%99%D7%9C-share-7032741993038372864-QyJP/

## Trust boundary

- Layer: `DISCOVERY_NOT_CANONICAL` until independently promoted through the evidence-first ingestion contract.
- Ownership: public owner-authored LinkedIn sources.
- Metrics: no reach, impression, reaction, repost, or cross-platform aggregate is asserted by this manifest.
- Dedup: derivatives/cross-posts must resolve under a canonical content family instead of inflating unique-content counts.
- Production observation: AppDeploy snapshot `1788005385311` exposes the LinkedIn impact discovery release `discovery-library-20260829-linkedin-impact-1` / projection release `public-projection-20260829-linkedin-impact-1`.

## Source-alignment note

At ingestion time, the AppDeploy production snapshot and GitHub `main` were not file-for-file aligned. Production reports `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`. This manifest is intentionally additive and must not be used as justification to overwrite newer AppDeploy source with an older GitHub file snapshot.
