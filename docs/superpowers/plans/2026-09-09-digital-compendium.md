# 7YA Digital Compendium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing MASTER EVIDENCE LEDGER into the canonical Digital Compendium and expose a validated public projection to 7ya.io without creating another truth store.

**Architecture:** Extend the existing Google Sheet with five normalized catalog/audit tables, preserve MASTER CANON + MASTER EVIDENCE LEDGER routing, add a versioned schema and public-export validator in GitHub, and wire the validated export into the existing corpus/fallback projection path. No source deletion or destructive dedupe.

**Tech Stack:** Google Sheets API, TypeScript/Node repository, existing 7ya.io corpus client/fallback, GitHub version control.

**Spec:** `docs/superpowers/specs/2026-09-09-digital-compendium-design.md`

## Global Constraints
- No competing canonical database.
- MASTER CANON remains narrative/claim authority.
- MASTER EVIDENCE LEDGER remains evidence/control/catalog authority.
- 7ya.io is projection only.
- Provenance and public-safety gating are mandatory for public export.
- Time-varying metrics are dated snapshots.
- No destructive deduplication.

---

### Task 1: Extend MASTER EVIDENCE LEDGER
**Files:** Google Sheet `IGOR VEPRETSKI — MASTER EVIDENCE LEDGER v1.0`
**Produces:** ACTIVITY_LEDGER, CONTENT_MASTER, ASSET_MASTER, RELATION_LEDGER, INGESTION_LOG.
- [ ] Add all five sheets with frozen headers.
- [ ] Write explicit column schemas and validation-friendly enum/status fields.
- [ ] Add one seed ingestion run and normalized seed records derived only from already-verified ledger entries.
- [ ] Read back all ranges and confirm IDs and cross-links resolve.

### Task 2: Canonical routing update
**Files:** Google Doc `7YA Index`; GitHub design docs.
**Produces:** unambiguous routing and operating contract.
- [ ] Update the Index to name the five new tables and projection rules.
- [ ] Read back the exact inserted text.

### Task 3: Schema + validator TDD
**Files:** repository paths determined from current codebase conventions.
**Produces:** typed schema plus validator for public compendium export.
- [ ] Write failing tests for missing provenance, missing PUBLIC_SAFE clearance, VERIFY_BEFORE_PUBLISHING rejection, valid record acceptance and metric snapshot preservation.
- [ ] Verify tests fail for missing implementation.
- [ ] Implement the minimal schema/validator.
- [ ] Run targeted tests and full relevant test suite.

### Task 4: Public projection integration
**Files:** existing corpus/export/client paths discovered in repository.
**Produces:** site projection consumes validated compendium records while preserving bundled fallback.
- [ ] Write failing integration test showing invalid compendium records are excluded and runtime failure retains bundled content.
- [ ] Implement minimal projection adapter/export.
- [ ] Run integration and regression tests.

### Task 5: Release verification
**Produces:** evidence-backed release receipt.
- [ ] Run repository CI/test/build commands.
- [ ] Verify generated/public corpus shape.
- [ ] Deploy through existing production path only if gates pass.
- [ ] Re-read production/API/site state after deployment.
- [ ] Write a release receipt containing exact commit/deploy verification results and any remaining external-source gaps.
