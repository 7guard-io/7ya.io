# 7YA Personal Flagship — Production Release Receipt

Date: 2026-08-13

## Applied production

- AppDeploy app: `697a008fddc309b142`
- AppDeploy release name: `v97`
- Applied immutable version: `1786631990978`
- Build / release: `7ya-personal-flagship-20260813-1`
- Provider status: `ready`
- Runtime provider: AppDeploy
- Source synchronization branch: `agent/7ya-personal-flagship-v1-20260813`

## Acceptance evidence

- E2E: `10/10` passed
- Running E2E jobs: `0`
- Backend endpoint coverage: `22/22 (100%)`
- Unused declared endpoints: `0`
- Safe diagnostics contract: `15/15 PASS`
- Frontend errors: `0`
- Backend errors: `0`
- Network errors: `0`
- Desktop visual QA: captured and accepted
- Mobile visual QA: captured and accepted
- Languages exercised: Hebrew / English / Russian

## Product changes

- Homepage repositioned as Igor Vepretski's personal flagship.
- Hero copy and primary action localized in Hebrew, English and Russian.
- Archive-heavy duplicate homepage sections removed from the visible experience.
- Homepage media density reduced.
- Digital Igor explicitly disclosed as an AI system based on Igor Vepretski's public work, not Igor himself, in all three languages.
- Private Growth Path adult persistence and deletion boundaries retained and accepted.

## Rollback

- Provider: AppDeploy
- Rollback version: `1786631307607`
- Label: verified personal-flagship snapshot before final acceptance-test and release-metadata updates.

## Source provenance status

AppDeploy v97 remains the authoritative execution source. The final production files were read directly from immutable snapshot `1786631990978`. This branch contains the design, implementation plan and this release receipt. Attempts to mirror the large runtime source files through the connected GitHub write APIs were blocked before commit by the tool safety gateway; therefore full runtime-source parity is **not claimed** here.

Until a complete AppDeploy source export is written to GitHub and compared byte-for-byte (or equivalently by stable content hash) against v97, GitHub must not be described as the canonical runtime source.
