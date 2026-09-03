# 7YA Public Site Rebuild — validated design

**Date:** 2026-09-03  
**Status:** approved for implementation and controlled publication  
**Owner:** Igor Vepretski / 7YA

## Decision

Rebuild 7ya.io as an evidence-led public home, not as a collection of unrelated screens or a generic “manager” portal. The site must make the public relationship between Igor Vepretski, #7YA, and StartOn clear without turning sensitive/private material, unverified metrics, or credentials into public content.

## Source-of-truth and rollback

- **Canonical repository:** `7guard-io/7ya.io`, `main`.
- **Working branch:** `rebuild/evidence-first-20260903`.
- **Runtime authority:** AppDeploy app `697a008fddc309b142`; production snapshots remain the deployment rollback point.
- **GitLab:** `7ya-io/7yaio-Igor-Vepretski` is a disaster-recovery mirror only, per its MIRROR-STATUS.md.
- No token, secret, OAuth credential, private message, family detail, legal/financial record, or confidential contact data is copied into the repository or public site.

## Public architecture

1. **Home / 7YA**
   - Strong, human entry: who Igor is, why 7YA exists, and a single next action.
   - Calm, legible visual system; media must use real responsive embeds/posters rather than black iframe blocks.

2. **Evidence and media**
   - Every factual card carries source, date, and evidence status.
   - Status vocabulary: VERIFIED, USER-STATED, INFERENCE, PROPOSAL, UNKNOWN.
   - Video uses consent-aware poster-to-player loading and a direct source link.

3. **StartOn**
   - A distinct mission/work stream, linked to its own public destination.
   - No automatic claims of outcomes that are not measured and sourced.

4. **Archive, research, and contact**
   - Separate public routes for searchable/source-linked media and research context.
   - Contact path is clear and protective of private information.

5. **Language and accessibility**
   - HE/EN/RU already exist; AR/ES gateways are maintained only where copy is curated.
   - Correct `lang`, `dir`, canonical and hreflang metadata; keyboard, focus, contrast, and mobile checks are release gates.

## Editorial controls

- Public claims require primary/credible sources and dates.
- Generated imagery is never presented as historical documentation.
- Metrics name their measure and time period; otherwise omit them.
- “Igor”, “#7YA/7YA”, and “StartOn” retain independent identity and evidence boundaries.
- The live site is evaluated on real devices/viewports, not only file presence.

## Delivery sequence

1. Audit the current source tree and runtime delta; record every broken/dead route and opaque embed.
2. Build an inventory of approved public assets, sources, language content, and live integrations.
3. Implement the home/evidence/media shell on the working branch.
4. Run static, type, route, accessibility, responsive, and live-preview QA; fix regressions.
5. Open a reviewable pull request with a release checklist and rollback point.
6. Merge only after the gate is clean, deploy to AppDeploy, verify `7ya.io` and `www.7ya.io`, then update the GitLab mirror ledger.

## Acceptance criteria

- No black/blank featured video surface; embeds are responsive and have a non-embed fallback.
- All homepage primary actions work; no placeholder, broken route, or console/network error in critical flow.
- Every factual public assertion sampled in the release has source/date/status.
- Hebrew and English primary flows pass; other published language gateways validate their directionality and links.
- Production release has a recorded commit, AppDeploy snapshot, smoke result, and rollback reference.
