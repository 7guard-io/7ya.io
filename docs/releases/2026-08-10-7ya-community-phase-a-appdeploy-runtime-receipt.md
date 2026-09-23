# 7YA Community Phase A — AppDeploy Runtime Receipt

**Recorded:** 2026-08-10  
**Status:** Technical Phase A loop verified in AppDeploy QA; human-outcome efficacy not yet established.  
**App:** `697a008fddc309b142`  
**Current immutable runtime version:** `1786367744542`  
**Provider display label at time of receipt:** `v96`  
**Pre-feature full rollback baseline:** `1786036715511`  

> Governance rule: AppDeploy `vNN` display names are not stable release identifiers. During this execution, the same historical immutable version appeared under different `vNN` labels after newer deployments were created. Control-plane and rollback records therefore use the immutable numeric `version` value as authority; `name` is display-only.

## Verified runtime state

Fresh AppDeploy provider verification for immutable version `1786367744542` reported:

- runtime status: `ready`;
- E2E suite: `10/10` jobs succeeded;
- declared backend endpoints observed across QA: `22/22` = `100%` coverage;
- no top-level frontend errors;
- no top-level backend errors;
- no top-level application-network errors in the terminal status snapshot.

QA run group: `c528a800b36a1cf0`.

## Phase A capability verified

The live runtime extends the existing value-first Creator Path rather than introducing a duplicate join product.

### Anonymous first value

E2E Test 8 verified:

- an adult/minor-neutral visitor can complete Creator Path and receive a free plan before account or contact capture;
- first proof and usefulness feedback render before authentication;
- selecting feedback does not block copy/download value;
- a user selecting `under 18` sees the protected youth message and StartOn link;
- no adult Growth Graph save/sign-in action is available in the minor state.

Observed backend routes included `POST /api/creator-path` and privacy-safe `POST /api/growth/event`, both returning 200.

### Adult save and private return

E2E Test 9 verified:

- the free plan is generated before sign-in;
- the user explicitly confirms 18+ before persistence;
- saving uses AppDeploy authentication;
- `POST /api/growth/profile` succeeds;
- `My Growth Path` opens with the saved plan title, first proof and next move;
- the private return surface has no public profile, follower count, rank or feed;
- refresh preserves the same saved plan;
- `GET /api/growth/profile` succeeds for the authenticated actor.

A routing-context defect discovered by this test was fixed before this receipt: internal SPA navigation now preserves non-7YA runtime context parameters while replacing only 7YA-owned `page/lang/chat/diagnostics` parameters.

### Meaningful Progress Event + deletion

E2E Test 10 verified:

- authenticated adult records `action_completed`;
- note `QA completed the first action` is persisted;
- MPE count increases to 1;
- recent progress renders the recorded note;
- participant can delete their own Growth Path data;
- `DELETE /api/growth/profile` succeeds;
- deleted plan/progress no longer render afterward.

Observed Growth routes in this lifecycle returned 200 for profile GET/POST, progress POST and profile DELETE.

## Diagnostics truth boundary

The AppDeploy backend cannot currently prove the custom `7ya.io` domain from its own provider-network self-call. That condition is now represented truthfully:

- `MATCH` → PASS;
- `UNREACHABLE` → DEFERRED;
- `MISMATCH` → FAIL.

Latest diagnostics E2E verified:

`14 PASS · 1 DEFERRED · 0 FAIL`

The one deferred item is Domain Proof / `UNREACHABLE`. This receipt therefore does **not** claim a fresh custom-domain MATCH.

The protected admin metrics endpoint is covered through a no-data `?dryRun=1` branch. Actual aggregate metrics remain behind authentication plus explicit admin-email allowlist.

## Data / safety boundaries in this runtime

- persistence pilot: adults 18+ only;
- initial persistent cohort: creators/builders;
- minors are not persisted into the adult Growth Graph;
- political affiliation is not requested or stored as a community identity field;
- trauma disclosure is not required;
- private growth state is scoped by authenticated `userId`;
- anonymous pre-save telemetry stores coarse allowlisted events and hashes the ephemeral flow id;
- participant growth data is not published to the public Evidence Wall;
- communications contact email is retained by the growth profile only when the user explicitly opts into communications;
- participant can delete their private Growth Path data;
- no matching, direct messaging, ranking, follower graph, streak, public member profile or youth/adult discovery is part of Phase A.

## What this receipt does NOT prove

This is a product/technical acceptance receipt. It does not prove that 7YA improves human outcomes.

The following remain unproven until a real pilot cohort exists:

- first-value usefulness in real users;
- first meaningful action rate;
- seven-day return rate;
- MPE/AH in real usage;
- operator effort per MPE;
- community-to-community value creation;
- matching effectiveness.

Provisional learning targets remain:

- ≥60% intake/first-value completion;
- ≥70% first-value usefulness among respondents;
- ≥35% saved participants with a first meaningful action within 7 days;
- ≥25% saved participants returning within 7 days;
- zero unresolved critical privacy/safeguarding defects.

These are decision thresholds for the pilot, not efficacy claims.

## Source-control boundary

This runtime feature does not establish GitHub/AppDeploy source parity.

GitHub issue #287 remains open for full current-runtime export, deterministic inventory/hash comparison, conflict classification and source reconciliation. Until that work is complete, GitHub must not be described as byte-identical or source-aligned with immutable AppDeploy version `1786367744542`.

## Rollback

For a complete rollback of the Community Phase A runtime feature, use the known pre-feature immutable baseline:

`1786036715511`

Do not use the provider `vNN` display name as the rollback key.
