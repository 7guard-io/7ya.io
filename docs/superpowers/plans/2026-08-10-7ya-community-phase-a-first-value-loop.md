# 7YA Community Phase A — First-Value Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-capable 7YA community vertical slice: `/join/ → Your Next Move → explicit save/opt-in → `/growth/` return state → Meaningful Progress Event`, with adult-only pilot safety, measurable funnel instrumentation, and no dependency on AI for the initial baseline.

**Architecture:** Extend the existing static-first 7YA frontend, Netlify Functions API, PostgreSQL store, `zod` validation, and current release-gate conventions. Phase A deliberately uses a deterministic next-move engine first so product usefulness can be measured without model variance; AI enrichment is a later experiment behind a separate plan and feature flag. All public participant state remains private by default; no participant profile or progress event is published to the Evidence Wall.

**Tech Stack:** Static HTML/CSS/ES modules, Netlify Functions, Node.js ESM, PostgreSQL via existing `netlify/functions/_lib/db.js`, `zod`, `node:test`, existing static artifact builder and `npm run release:gate`.

## Global Constraints

- The design source is `docs/superpowers/specs/2026-08-10-7ya-community-operating-system-v1-design.md` on PR #291.
- Do not begin production promotion until issue #287 / AppDeploy source reconciliation establishes a trustworthy runtime/source baseline.
- General Phase A pilot is **18+ only**. Minors must not be saved into the general community graph or exposed to adult matching.
- Political affiliation is not collected as a 7YA community identity field.
- No trauma disclosure is required to receive value.
- First value is delivered **before** email, profile-save, or communication consent is requested.
- One canonical `Person` record per saved human; organizations are separate actor types and are out of the Phase A UI.
- AI output must not be required for Phase A launch. Deterministic baseline first.
- Every AI-derived field in later phases must remain distinguishable from user facts; this plan stores no AI-derived fields.
- Public evidence publication and private participant data remain separate systems.
- No participant goal text, blocker text, email, resume token, or progress detail is written to public static files, logs, analytics payloads, PR bodies, or release receipts.
- Existing `JWT_SECRET` admin authentication remains separate from participant resume tokens.
- Participant resume tokens are opaque random secrets; only SHA-256 hashes are stored server-side.
- The release gate remains `npm run release:gate`; do not claim PASS unless it actually executes on the exact head SHA.
- If GitHub Actions still fail before checkout, treat that as infrastructure status, not code PASS/FAIL.
- No merge/deploy claim without source provenance, route verification, privacy review, and runtime verification.

---

## File Structure

### New database / domain files

- `sql/003_community_phase_a.sql` — Phase A private community schema.
- `netlify/functions/_lib/community/contracts.js` — canonical zod schemas and enums shared by community functions.
- `netlify/functions/_lib/community/next-move.js` — deterministic first-value engine.
- `netlify/functions/_lib/community/session.js` — opaque participant resume-token generation, hashing, and authentication.
- `netlify/functions/_lib/community/repository.js` — all Phase A community SQL access; functions do not embed ad-hoc SQL elsewhere.

### New API functions

- `netlify/functions/community-intake.js` — stateless first-value generation; no contact data required or persisted.
- `netlify/functions/community-save.js` — explicit adult save/opt-in transaction; returns one opaque resume token.
- `netlify/functions/community-profile.js` — GET current saved state; POST correction/update + regenerated next move.
- `netlify/functions/community-progress.js` — record a validated MPE and return updated state.
- `netlify/functions/community-admin-stats.js` — admin-only aggregate pilot metrics; no contact data.

### New public surfaces

- `join/index.html` — adult pilot intake and first-value experience.
- `growth/index.html` — returning participant progress surface.
- `styles/7ya-community-v1.css` — shared community route visual layer.
- `scripts/community-join.js` — browser state machine for intake → value → save.
- `scripts/community-growth.js` — browser state machine for resume → progress → correction.

### New tests / checks / runbook

- `test/community/next-move.test.mjs`
- `test/community/session.test.mjs`
- `test/community/repository-contract.test.mjs`
- `test/community/api-contract.test.mjs`
- `scripts/check-community-phase-a.mjs`
- `scripts/community-pilot-report.mjs` — local/admin aggregate report client; never emits PII.
- `docs/operations/COMMUNITY_PHASE_A_PILOT_RUNBOOK.md`

### Existing files to modify

- `package.json` — add community tests/checks to deterministic gates.
- `scripts/site-contract.mjs` — add `/join/`, `/growth/`, CSS, JS and artifact paths.
- `sitemap.xml` — add `/join/`; do **not** index `/growth/` as a discovery page.
- `robots.txt` only if required to explicitly disallow `/growth/`; otherwise use page-level `noindex,nofollow`.

---

### Task 0: Canonical Runtime Preflight Gate

**Files:**
- Read: `AGENTS.md`
- Read: `docs/CONTROL_PLANE_STATE.json`
- Read: issue #287 and newest release receipt
- No code changes in this task

**Interfaces:**
- Consumes: current canonical repository/runtime provenance.
- Produces: one exact implementation base SHA and a written statement that production promotion is either `UNBLOCKED` or `BLOCKED`.

- [ ] **Step 1: Verify the current source-control branch and latest AppDeploy/runtime evidence**

Run locally or through connected provider evidence:

```bash
git fetch origin
git rev-parse origin/main
```

Record the exact SHA as `IMPLEMENTATION_BASE_SHA` only after comparing it with the completed AppDeploy export/reconciliation work from issue #287.

- [ ] **Step 2: Fail closed if provenance is unresolved**

Expected decision rule:

```text
IF exact AppDeploy runtime source has not been exported/reconciled
THEN implementation may proceed only as isolated non-production development,
AND production promotion remains BLOCKED.
```

- [ ] **Step 3: Create the implementation branch from the reconciled base**

```bash
git switch --detach "$IMPLEMENTATION_BASE_SHA"
git switch -c feat/community-phase-a-first-value
```

Expected: branch head equals `IMPLEMENTATION_BASE_SHA` before any implementation commit.

- [ ] **Step 4: Run the pre-change release gate**

```bash
npm ci
npm run release:gate
```

Expected: either genuine PASS, or an explicitly captured infrastructure/environment blocker. Never continue under a false PASS.

- [ ] **Step 5: Commit nothing**

This task is a gate. If source provenance is unresolved, stop production execution here and continue only with safe isolated domain/test work.

---

### Task 1: Private Community Schema

**Files:**
- Create: `sql/003_community_phase_a.sql`
- Test: `test/community/repository-contract.test.mjs`

**Interfaces:**
- Consumes: existing PostgreSQL connection through `netlify/functions/_lib/db.js`.
- Produces: tables `community_people`, `community_consents`, `community_goals`, `community_next_moves`, `community_progress_events`, `community_sessions`, `community_events`.

- [ ] **Step 1: Write the failing schema contract test**

Create `test/community/repository-contract.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const sql = fs.readFileSync("sql/003_community_phase_a.sql", "utf8");

for (const table of [
  "community_people",
  "community_consents",
  "community_goals",
  "community_next_moves",
  "community_progress_events",
  "community_sessions",
  "community_events",
]) {
  test(`migration defines ${table}`, () => {
    assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "i"));
  });
}

test("resume tokens are stored as hashes, not plaintext", () => {
  assert.match(sql, /token_hash\s+TEXT\s+NOT NULL/i);
  assert.doesNotMatch(sql, /resume_token\s+TEXT/i);
});

test("community people age class is explicit", () => {
  assert.match(sql, /age_class[^;]+CHECK[^;]+adult[^;]+minor[^;]+unknown/is);
});
```

- [ ] **Step 2: Run the test and verify failure**

```bash
node --test test/community/repository-contract.test.mjs
```

Expected: FAIL because `sql/003_community_phase_a.sql` does not exist.

- [ ] **Step 3: Create the migration**

Create `sql/003_community_phase_a.sql` with this schema contract:

```sql
BEGIN;

CREATE TABLE IF NOT EXISTS community_people (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  email TEXT,
  locale TEXT NOT NULL DEFAULT 'he' CHECK (locale IN ('he','en','ru')),
  age_class TEXT NOT NULL CHECK (age_class IN ('adult','minor','unknown')),
  source_channel TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_people_email_lower_unique
ON community_people ((LOWER(email))) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS community_consents (
  person_id BIGINT PRIMARY KEY REFERENCES community_people(id) ON DELETE CASCADE,
  profile_storage BOOLEAN NOT NULL DEFAULT FALSE,
  communications BOOLEAN NOT NULL DEFAULT FALSE,
  consent_version TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_goals (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES community_people(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL CHECK (char_length(goal_text) BETWEEN 3 AND 1200),
  blocker_text TEXT CHECK (blocker_text IS NULL OR char_length(blocker_text) <= 1200),
  role_intent TEXT NOT NULL CHECK (role_intent IN ('grow','build','guide','contribute','partner')),
  blocker_category TEXT NOT NULL CHECK (blocker_category IN ('clarity','skills','time','people','resources','confidence','other')),
  action_preference TEXT NOT NULL CHECK (action_preference IN ('learn','make','talk','organize','explore')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','superseded','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_goals_person_status_idx
ON community_goals (person_id, status);

CREATE TABLE IF NOT EXISTS community_next_moves (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES community_people(id) ON DELETE CASCADE,
  goal_id BIGINT NOT NULL REFERENCES community_goals(id) ON DELETE CASCADE,
  engine_version TEXT NOT NULL,
  goal_summary TEXT NOT NULL,
  blocker_hypothesis TEXT NOT NULL,
  action_text TEXT NOT NULL,
  tool_text TEXT,
  horizon_hours INTEGER NOT NULL CHECK (horizon_hours BETWEEN 1 AND 168),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','superseded','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_progress_events (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES community_people(id) ON DELETE CASCADE,
  goal_id BIGINT REFERENCES community_goals(id) ON DELETE SET NULL,
  next_move_id BIGINT REFERENCES community_next_moves(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('action_completed','artifact_created','skill_demonstrated','blocker_resolved','project_started','project_completed','feedback_received','opportunity_obtained','helped_other')),
  note TEXT CHECK (note IS NULL OR char_length(note) <= 1000),
  evidence_url TEXT CHECK (evidence_url IS NULL OR char_length(evidence_url) <= 2048),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_progress_person_created_idx
ON community_progress_events (person_id, created_at DESC);

CREATE TABLE IF NOT EXISTS community_sessions (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES community_people(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_events (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  person_id BIGINT REFERENCES community_people(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('intake_started','intake_completed','first_value_rendered','profile_saved','growth_returned','progress_recorded','profile_corrected')),
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_events_name_created_idx
ON community_events (event_name, created_at DESC);

COMMIT;
```

- [ ] **Step 4: Run the contract test**

```bash
node --test test/community/repository-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Apply migration only to a non-production test database**

```bash
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f sql/003_community_phase_a.sql
```

Expected: transaction commits successfully.

- [ ] **Step 6: Commit**

```bash
git add sql/003_community_phase_a.sql test/community/repository-contract.test.mjs
git commit -m "feat: add private community phase-a schema"
```

---

### Task 2: Canonical Input Contracts and Deterministic Next Move

**Files:**
- Create: `netlify/functions/_lib/community/contracts.js`
- Create: `netlify/functions/_lib/community/next-move.js`
- Create: `test/community/next-move.test.mjs`

**Interfaces:**
- Consumes: raw intake `{ locale, ageClass, goalText, blockerText, roleIntent, blockerCategory, actionPreference }`.
- Produces: `buildNextMove(input)` → `{ engineVersion, goalSummary, blockerHypothesis, actionText, toolText, horizonHours, correctionAllowed }`.

- [ ] **Step 1: Write failing next-move tests**

Create `test/community/next-move.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { buildNextMove } from "../../netlify/functions/_lib/community/next-move.js";

const base = {
  locale: "he",
  ageClass: "adult",
  goalText: "אני רוצה להוציא פרויקט ראשון בפייתון",
  blockerText: "אני לא יודע מאיפה להתחיל",
  roleIntent: "build",
  blockerCategory: "clarity",
  actionPreference: "make",
};

test("returns a bounded 24h-oriented next move", () => {
  const result = buildNextMove(base);
  assert.equal(result.engineVersion, "rules-v1");
  assert.equal(result.correctionAllowed, true);
  assert.ok(result.actionText.length >= 20);
  assert.ok(result.horizonHours >= 1 && result.horizonHours <= 48);
});

test("labels blocker as a hypothesis rather than fact", () => {
  const result = buildNextMove(base);
  assert.match(result.blockerHypothesis, /נראה|ייתכן|hypothesis|likely/i);
});

test("rejects minors from the general pilot engine", () => {
  assert.throws(() => buildNextMove({ ...base, ageClass: "minor" }), /adult pilot/i);
});
```

- [ ] **Step 2: Run tests and verify failure**

```bash
node --test test/community/next-move.test.mjs
```

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Add canonical zod contracts**

`contracts.js` must export:

```js
import { z } from "zod";

export const LocaleSchema = z.enum(["he", "en", "ru"]);
export const AgeClassSchema = z.enum(["adult", "minor", "unknown"]);
export const RoleIntentSchema = z.enum(["grow", "build", "guide", "contribute", "partner"]);
export const BlockerCategorySchema = z.enum(["clarity", "skills", "time", "people", "resources", "confidence", "other"]);
export const ActionPreferenceSchema = z.enum(["learn", "make", "talk", "organize", "explore"]);

export const IntakeSchema = z.object({
  locale: LocaleSchema.default("he"),
  ageClass: AgeClassSchema,
  goalText: z.string().trim().min(3).max(1200),
  blockerText: z.string().trim().max(1200).optional().default(""),
  roleIntent: RoleIntentSchema,
  blockerCategory: BlockerCategorySchema,
  actionPreference: ActionPreferenceSchema,
  sourceChannel: z.string().trim().max(120).optional(),
});
```

- [ ] **Step 4: Implement the smallest deterministic engine**

`next-move.js` must use explicit mappings instead of a model call. Required behavior:

```js
import { IntakeSchema } from "./contracts.js";

const actionByPreference = {
  learn: "בחר משאב אחד בלבד ולמד ממנו 25 דקות; בסיום כתוב שלוש נקודות שהבנת ושאלה אחת שנותרה פתוחה.",
  make: "צור גרסה קטנה שאפשר להראות בתוך 24 שעות: קובץ, סקיצה, דמו, פוסט, מסמך או אב־טיפוס אחד.",
  talk: "בחר אדם אחד רלוונטי ושלח לו בקשה ממוקדת לשיחת 15 דקות עם שאלה אחת ברורה.",
  organize: "פתח מסמך אחד, הגדר תוצאה אחת לשבוע הקרוב ופרק אותה לשלוש פעולות בלבד.",
  explore: "בדוק שלוש אפשרויות בלבד, השווה אותן לפי ערך/עלות/זמן ובחר אחת לניסוי קטן.",
};

export function buildNextMove(raw) {
  const input = IntakeSchema.parse(raw);
  if (input.ageClass !== "adult") {
    throw new Error("General 7YA adult pilot only");
  }
  return {
    engineVersion: "rules-v1",
    goalSummary: input.goalText,
    blockerHypothesis: `ייתכן שהחסם המרכזי כרגע הוא ${input.blockerCategory}; זו השערה שאפשר לתקן.`,
    actionText: actionByPreference[input.actionPreference],
    toolText: "פתח מסמך/פתק אחד ושמור בו את התוצר והלקח מהפעולה.",
    horizonHours: 24,
    correctionAllowed: true,
  };
}
```

- [ ] **Step 5: Run tests**

```bash
node --test test/community/next-move.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add netlify/functions/_lib/community test/community/next-move.test.mjs
git commit -m "feat: add deterministic community next-move engine"
```

---

### Task 3: Private Repository and Resume Sessions

**Files:**
- Create: `netlify/functions/_lib/community/session.js`
- Create: `netlify/functions/_lib/community/repository.js`
- Create: `test/community/session.test.mjs`

**Interfaces:**
- Consumes: existing `query(text, params)` from `netlify/functions/_lib/db.js`.
- Produces:
  - `issueResumeToken()` → `{ token, tokenHash }`
  - `hashResumeToken(token)` → lowercase hex SHA-256
  - `requireCommunitySession(req, queryFn = query)` → `{ personId }`
  - `saveCommunityProfile(input, nextMove, consent, queryFn = query)`
  - `loadCommunityProfile(personId, queryFn = query)`
  - `replaceActiveGoal(personId, input, nextMove, queryFn = query)`
  - `recordProgress(personId, event, queryFn = query)`
  - `recordCommunityEvent(eventName, personId, properties, queryFn = query)`

- [ ] **Step 1: Write token tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { issueResumeToken, hashResumeToken } from "../../netlify/functions/_lib/community/session.js";

test("resume token is random and only its hash is persistable", () => {
  const a = issueResumeToken();
  const b = issueResumeToken();
  assert.notEqual(a.token, b.token);
  assert.equal(a.tokenHash, hashResumeToken(a.token));
  assert.match(a.tokenHash, /^[a-f0-9]{64}$/);
  assert.ok(a.token.length >= 40);
});
```

- [ ] **Step 2: Run and verify failure**

```bash
node --test test/community/session.test.mjs
```

Expected: FAIL because `session.js` does not exist.

- [ ] **Step 3: Implement token primitives**

Use Node crypto only:

```js
import crypto from "node:crypto";

export function hashResumeToken(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

export function issueResumeToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResumeToken(token) };
}
```

`requireCommunitySession` must read `Authorization: Bearer <opaque-token>`, hash it, query `community_sessions`, reject revoked/expired sessions, and return only the person id.

- [ ] **Step 4: Implement repository transactions**

Repository rules:

```text
saveCommunityProfile:
1. reject non-adult
2. require profile_storage=true
3. BEGIN
4. insert/upsert person by normalized email when email exists; otherwise create person
5. upsert consent
6. insert active goal
7. insert active next move
8. generate/store token_hash with 30-day expiry
9. insert profile_saved event
10. COMMIT
11. return plaintext token once + personId + public-safe profile state
```

All updates that replace a goal must mark previous active goal/next move `superseded` within one transaction.

- [ ] **Step 5: Add a repository test using an injected fake `queryFn`**

The test must assert SQL calls never receive the plaintext resume token. Example assertion:

```js
assert.equal(calls.some(call => call.params?.includes(resume.token)), false);
```

- [ ] **Step 6: Run tests**

```bash
node --test test/community/session.test.mjs test/community/repository-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add netlify/functions/_lib/community test/community/session.test.mjs
git commit -m "feat: add private community repository and resume sessions"
```

---

### Task 4: First-Value, Save, Profile, and Progress APIs

**Files:**
- Create: `netlify/functions/community-intake.js`
- Create: `netlify/functions/community-save.js`
- Create: `netlify/functions/community-profile.js`
- Create: `netlify/functions/community-progress.js`
- Create: `test/community/api-contract.test.mjs`

**Interfaces:**
- `POST /api/community-intake` — stateless, no email; returns first value.
- `POST /api/community-save` — requires explicit storage consent; returns opaque resume token once.
- `GET /api/community-profile` — bearer resume token; returns private-safe saved state.
- `POST /api/community-profile` — bearer resume token; replaces active goal and next move after correction.
- `POST /api/community-progress` — bearer resume token; records one MPE.

- [ ] **Step 1: Write failing API contract tests**

Use real `Request` objects and direct function imports. Example:

```js
import test from "node:test";
import assert from "node:assert/strict";
import intake from "../../netlify/functions/community-intake.js";

const validAdult = {
  locale: "he",
  ageClass: "adult",
  goalText: "לבנות תיק עבודות ראשון",
  blockerText: "אין לי תהליך",
  roleIntent: "build",
  blockerCategory: "clarity",
  actionPreference: "make",
};

test("intake returns value without requesting contact data", async () => {
  const req = new Request("https://7ya.io/api/community-intake", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validAdult),
  });
  const res = await intake(req);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.ok(body.nextMove.actionText);
  assert.equal("email" in body, false);
});

test("minor receives protected-pilot response and is not eligible to save", async () => {
  const req = new Request("https://7ya.io/api/community-intake", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...validAdult, ageClass: "minor" }),
  });
  const res = await intake(req);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.eligibleForGeneralPilot, false);
});
```

- [ ] **Step 2: Run tests and verify failure**

```bash
node --test test/community/api-contract.test.mjs
```

Expected: FAIL because API files do not exist.

- [ ] **Step 3: Implement `community-intake.js` as stateless first value**

Behavior:

```text
POST only
validate IntakeSchema
if ageClass != adult:
  return 200 { ok:true, eligibleForGeneralPilot:false, youthMessage, startOnUrl:"https://starton.org.il/" }
else:
  return 200 { ok:true, eligibleForGeneralPilot:true, nextMove: buildNextMove(input) }
```

Do not call the database from this function.

- [ ] **Step 4: Implement `community-save.js`**

Request schema must require:

```js
{
  intake: IntakeSchema,
  consent: {
    profileStorage: true,
    communications: boolean,
    consentVersion: "community-phase-a-v1"
  },
  email?: valid email
}
```

Rules:

- reject `ageClass !== adult` with 403;
- reject missing `profileStorage: true` with 400;
- generate the next move server-side again; never trust a client-supplied next move;
- persist with repository transaction;
- return `{ ok:true, resumeToken, profile }`;
- never log the resume token.

- [ ] **Step 5: Implement `community-profile.js`**

GET: authenticate opaque resume token, return current goal, active next move, recent MPE count and last 10 progress events.

POST correction schema:

```js
{
  goalText: string,
  blockerText?: string,
  roleIntent,
  blockerCategory,
  actionPreference
}
```

Server regenerates deterministic next move, supersedes previous active goal/move, records `profile_corrected`.

- [ ] **Step 6: Implement `community-progress.js`**

Allowed event types must exactly match the SQL enum. `note` max 1000; optional `evidenceUrl` must be `https://` and max 2048.

Return updated `mpeCount`, active goal, and next move.

- [ ] **Step 7: Run API tests**

```bash
node --test test/community/api-contract.test.mjs
```

Expected: stateless intake tests PASS. DB-dependent save/profile/progress tests use injected repository mocks and PASS without a live DB.

- [ ] **Step 8: Commit**

```bash
git add netlify/functions/community-*.js test/community/api-contract.test.mjs
git commit -m "feat: add community phase-a API"
```

---

### Task 5: `/join/` Value-First Experience

**Files:**
- Create: `join/index.html`
- Create: `styles/7ya-community-v1.css`
- Create: `scripts/community-join.js`
- Create: `scripts/check-community-phase-a.mjs`

**Interfaces:**
- Consumes: `POST /api/community-intake`, then optionally `POST /api/community-save`.
- Produces: first-value UI before contact request; saves `7ya_community_resume_token_v1` in localStorage only after explicit save.

- [ ] **Step 1: Write the failing deterministic HTML contract check**

`check-community-phase-a.mjs` must assert:

```js
import fs from "node:fs";
import assert from "node:assert/strict";

const join = fs.readFileSync("join/index.html", "utf8");
assert.match(join, /מה.*מנסה.*לגרום.*לקרות|What are you trying|Что.*хотите/i);
assert.match(join, /type="email"/i);
assert.match(join, /id="first-value"/i);
assert.match(join, /id="save-profile"/i);
assert.match(join, /privacy|פרטיות|конфиден/i);
assert.match(join, /robots" content="index,follow/i);

const js = fs.readFileSync("scripts/community-join.js", "utf8");
assert.match(js, /\/api\/community-intake/);
assert.match(js, /\/api\/community-save/);
assert.match(js, /7ya_community_resume_token_v1/);
```

- [ ] **Step 2: Run and verify failure**

```bash
node scripts/check-community-phase-a.mjs
```

Expected: FAIL because route/assets do not exist.

- [ ] **Step 3: Build semantic `/join/` HTML**

Required order in the DOM:

```text
1. mission/value proposition
2. age class gate
3. goal
4. blocker category + optional blocker text
5. role intent
6. preferred next-action style
7. Generate My Next Move button
8. first-value result
9. ONLY AFTER result: email + storage consent + optional communications consent
10. Save My Path button
```

Do not render email or consent controls as required prerequisites for generating first value.

- [ ] **Step 4: Implement browser state machine**

`community-join.js` states:

```js
const STATES = Object.freeze({
  INTAKE: "intake",
  LOADING_VALUE: "loading_value",
  VALUE_READY: "value_ready",
  SAVING: "saving",
  SAVED: "saved",
  YOUTH_PROTECTED: "youth_protected",
  ERROR: "error",
});
```

Rules:

- first-value API receives no email;
- `resumeToken` is stored only after successful explicit save;
- URL query params may capture only coarse source tags (`utm_source`, `utm_medium`, `utm_campaign`), each capped at 120 chars;
- never put goal/blocker text in URL, analytics query strings, or console logs;
- user can click “זה לא מה שהתכוונתי” and edit intake before save.

- [ ] **Step 5: Implement the shared CSS**

Minimum requirements:

- mobile-first;
- RTL primary;
- visible keyboard focus;
- no fixed-height form containers;
- reduced-motion support;
- 44px minimum touch targets;
- no dark-pattern consent styling;
- error text adjacent to the affected control.

- [ ] **Step 6: Run deterministic check**

```bash
node scripts/check-community-phase-a.mjs
```

Expected: PASS.

- [ ] **Step 7: Manual local smoke test**

```bash
npm run dev
```

Verify in browser:

```text
/join/ loads
adult can reach First Value without email
minor cannot reach save flow
email/consent appears after value
successful save stores resume token locally
refresh does not leak goal text in URL
```

- [ ] **Step 8: Commit**

```bash
git add join styles/7ya-community-v1.css scripts/community-join.js scripts/check-community-phase-a.mjs
git commit -m "feat: add value-first 7YA community join flow"
```

---

### Task 6: `/growth/` Return, Correction, and MPE Flow

**Files:**
- Create: `growth/index.html`
- Create: `scripts/community-growth.js`
- Modify: `styles/7ya-community-v1.css`
- Modify: `scripts/check-community-phase-a.mjs`

**Interfaces:**
- Consumes: participant resume token from localStorage; GET/POST `/api/community-profile`; POST `/api/community-progress`.
- Produces: returning participant surface with active goal, next move, progress history, correction, and MPE submission.

- [ ] **Step 1: Extend failing checker for `/growth/`**

Add assertions:

```js
const growth = fs.readFileSync("growth/index.html", "utf8");
assert.match(growth, /robots" content="noindex,nofollow/i);
assert.match(growth, /id="current-goal"/i);
assert.match(growth, /id="next-move"/i);
assert.match(growth, /id="record-progress"/i);
assert.match(growth, /id="correct-path"/i);

const growthJs = fs.readFileSync("scripts/community-growth.js", "utf8");
assert.match(growthJs, /\/api\/community-profile/);
assert.match(growthJs, /\/api\/community-progress/);
assert.match(growthJs, /Authorization/);
```

- [ ] **Step 2: Run and verify failure**

```bash
node scripts/check-community-phase-a.mjs
```

Expected: FAIL because `/growth/` is missing.

- [ ] **Step 3: Build `/growth/`**

Required visible hierarchy:

```text
Your direction
Your next move
What happened?
Record progress
Recent progress
Correct my path
Privacy / sign out from this device
```

No feed, follower count, streak, rank, or leaderboard.

- [ ] **Step 4: Implement authenticated fetch helper**

```js
function authHeaders(token) {
  return {
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
}
```

If token is absent or rejected, show a recovery state linking to `/join/`; never invent or guess identity.

- [ ] **Step 5: Implement progress submission**

UI must expose the nine allowed MPE types using human-language labels. On success, update MPE count and recent history from server response.

- [ ] **Step 6: Implement correction flow**

Correction opens an editable compact version of goal/blocker/intent/action preference. POST to `/api/community-profile`; replace the displayed next move only after server success.

- [ ] **Step 7: Implement “remove from this device”**

This action removes only `7ya_community_resume_token_v1` from localStorage. It must explicitly state that this is not server-side deletion.

- [ ] **Step 8: Run checker and local smoke**

```bash
node scripts/check-community-phase-a.mjs
npm run dev
```

Expected: checker PASS; manual return/progress/correction path works against dev API.

- [ ] **Step 9: Commit**

```bash
git add growth scripts/community-growth.js styles/7ya-community-v1.css scripts/check-community-phase-a.mjs
git commit -m "feat: add community growth return and progress flow"
```

---

### Task 7: Pilot Measurement and Admin-Only Aggregate Stats

**Files:**
- Create: `netlify/functions/community-admin-stats.js`
- Create: `scripts/community-pilot-report.mjs`
- Modify: `test/community/api-contract.test.mjs`

**Interfaces:**
- Consumes: existing `requireAdmin(req)` JWT path and aggregate SQL only.
- Produces: funnel/retention/MPE metrics with no participant email, raw goal text, blocker text, notes, evidence URLs, or resume-token data.

- [ ] **Step 1: Write failing admin stats test**

Test response shape:

```js
{
  ok: true,
  windowDays: 30,
  counts: {
    profilesSaved: Number,
    activeHumans: Number,
    meaningfulProgressEvents: Number,
    sevenDayReturners: Number
  },
  rates: {
    sevenDayReturnRate: Number,
    mpePerActiveHuman: Number
  }
}
```

Test must assert these keys are absent:

```js
for (const forbidden of ["email", "goalText", "blockerText", "note", "evidenceUrl", "tokenHash"]) {
  assert.equal(JSON.stringify(body).includes(forbidden), false);
}
```

- [ ] **Step 2: Implement admin-only aggregate endpoint**

Use `requireAdmin(req)` from existing auth helper. Queries must use counts/aggregates only.

- [ ] **Step 3: Build local pilot report client**

`scripts/community-pilot-report.mjs` accepts:

```bash
COMMUNITY_ADMIN_TOKEN=... node scripts/community-pilot-report.mjs https://7ya.io
```

It requests `/api/community-admin-stats`, prints the metric table, and prints decision flags against provisional thresholds:

```text
7-day return >= 25% ? PASS/BELOW_TARGET
MPE/AH > 0 ? OBSERVED/NOT_OBSERVED
critical safety defects = 0 ? PASS/BLOCK
```

Do not output participant rows.

- [ ] **Step 4: Run tests**

```bash
node --test test/community/api-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/community-admin-stats.js scripts/community-pilot-report.mjs test/community/api-contract.test.mjs
git commit -m "feat: add privacy-safe community pilot metrics"
```

---

### Task 8: Wire Routes, Artifact Contract, and Release Gate

**Files:**
- Modify: `scripts/site-contract.mjs`
- Modify: `package.json`
- Modify: `sitemap.xml`
- Modify: `scripts/check-community-phase-a.mjs`

**Interfaces:**
- Consumes: completed `/join/` and `/growth/` surfaces and community tests.
- Produces: deterministic build/release checks that include the community slice.

- [ ] **Step 1: Add canonical public routes**

Update `canonicalRoutes`:

```js
'join',
'growth',
```

Add community CSS/JS to `publicStyleFiles`, `publicScriptFiles`, and `criticalArtifactPaths`.

- [ ] **Step 2: Preserve privacy indexing boundary**

`/join/` may be in sitemap and indexable.

`/growth/` must contain:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
```

Do **not** add `/growth/` to `sitemap.xml` even though it is a canonical artifact route.

- [ ] **Step 3: Add npm scripts**

Update `package.json`:

```json
"test:community": "node --test test/community/*.test.mjs",
"check:community": "node scripts/check-community-phase-a.mjs"
```

Append both to `check-all` / test orchestration without removing existing gates.

- [ ] **Step 4: Run community gates**

```bash
npm run check:community
npm run test:community
```

Expected: PASS.

- [ ] **Step 5: Run full exact-head release gate**

```bash
npm run release:gate
```

Expected: genuine PASS on the exact current SHA before requesting merge. If environment prevents execution, record BLOCKED and do not claim release readiness.

- [ ] **Step 6: Verify static artifact contains public community assets but not private server code**

```bash
npm run build:site
npm run verify:artifact
```

Expected:

```text
join/index.html included
growth/index.html included
styles/7ya-community-v1.css included
scripts/community-join.js included
scripts/community-growth.js included
sql/ excluded
netlify/ excluded
admin/ excluded
```

- [ ] **Step 7: Commit**

```bash
git add scripts/site-contract.mjs package.json sitemap.xml scripts/check-community-phase-a.mjs
git commit -m "chore: gate community phase-a routes and tests"
```

---

### Task 9: Pilot Runbook and Controlled Launch Gate

**Files:**
- Create: `docs/operations/COMMUNITY_PHASE_A_PILOT_RUNBOOK.md`

**Interfaces:**
- Consumes: working Phase A slice and metrics endpoint.
- Produces: an operator procedure for a maximum 50–100 adult participants with explicit stop conditions.

- [ ] **Step 1: Write the runbook with the exact pilot population**

Required opening:

```text
Population: adults 18+ only.
Cohort ceiling: 100 saved participants.
Initial cohort: 20–30 participants before expansion.
Recruitment: existing 7YA audience, creators/builders, professional network, and consenting adult StartOn ecosystem professionals; no minors in the general pilot.
```

- [ ] **Step 2: Define daily operator review**

Every pilot day review:

```text
intake failures
save failures
profile-return failures
MPE count
manual feedback on usefulness
privacy/safety reports
operator minutes spent per participant
```

- [ ] **Step 3: Define hard stop conditions**

Pilot expansion stops immediately for:

```text
any critical privacy leak
minor accidentally saved into adult graph
resume-token exposure
unauthorized profile access
systemic wrong-user state
critical misleading advice pattern
unresolved safeguarding incident
```

- [ ] **Step 4: Define product decision thresholds**

Use the approved provisional thresholds:

```text
>=60% intake completion
>=70% first-value recipients rate useful/very useful
>=35% saved participants complete/report first meaningful action within 7 days
>=25% saved participants return within 7 days
0 unresolved critical privacy/safeguarding defects
```

Explicit rule:

```text
If thresholds are badly missed, fix the loop before acquiring more traffic.
```

- [ ] **Step 5: Define the AI promotion gate**

No AI-generated next-move experiment until all of the following are true:

```text
at least 30 adult participants have received rules-v1 output
a baseline usefulness rate exists
common correction reasons are categorized
prompt/output schema is reviewed
AI experiment can be A/B compared against rules-v1
AI is fail-closed to rules-v1 when unavailable
```

AI rollout is a separate plan/PR.

- [ ] **Step 6: Commit**

```bash
git add docs/operations/COMMUNITY_PHASE_A_PILOT_RUNBOOK.md
git commit -m "docs: add controlled community phase-a pilot runbook"
```

---

### Task 10: Final Review and Preview — No Production Promotion Yet

**Files:**
- Review all files from Tasks 1–9
- Update PR body / release evidence only; do not create production receipt until an actual deployment is approved and verified

**Interfaces:**
- Consumes: exact implementation head SHA.
- Produces: one reviewable PR with test evidence and a clear production blocker/unblock state.

- [ ] **Step 1: Run all deterministic checks again on exact head**

```bash
npm run test:community
npm run check:community
npm run release:gate
```

Expected: genuine PASS or explicitly recorded blocker.

- [ ] **Step 2: Inspect the diff for sensitive data paths**

```bash
git diff "$IMPLEMENTATION_BASE_SHA"...HEAD -- \
  sql netlify/functions join growth scripts styles docs/operations package.json scripts/site-contract.mjs sitemap.xml
```

Review specifically for:

```text
plaintext secrets
PII in logs
participant data in public files
minor/adult trust-zone collapse
client-supplied next-move persistence
public indexing of growth state
unbounded free-text fields
```

- [ ] **Step 3: Verify API privacy manually in preview/dev**

Required checks:

```text
community-intake works without email
community-save refuses minor
community-save refuses absent storage consent
profile endpoint rejects missing/invalid resume token
progress endpoint rejects invalid MPE type
admin stats rejects participant token
admin stats contains no PII fields
```

- [ ] **Step 4: Verify routes**

On preview URL:

```bash
node scripts/verify-routes.mjs "$PREVIEW_URL"
```

Also manually verify `/growth/` response HTML includes `noindex,nofollow,noarchive`.

- [ ] **Step 5: Update the PR with evidence**

PR body must state:

```text
exact base SHA
exact head SHA
commands executed + result
migration not applied to production unless separately approved
pilot adult-only boundary
AI disabled / rules-v1 baseline
production provenance state from issue #287
rollback statement
```

- [ ] **Step 6: Do not deploy automatically**

Production promotion requires a separate release decision after:

```text
source/runtime provenance is reconciled
preview passes
migration application is approved
privacy review passes
release:gate passes on exact head
rollback target is known
```

---

## Explicitly Deferred to Separate Plans

The following are **not** part of Phase A and must not be smuggled into this PR:

- AI-generated next moves or LLM personalization;
- adult-to-adult matching;
- mentors / Guides onboarding;
- Requests / Offers marketplace;
- Circles;
- Challenges;
- projects / Builds;
- public Wins / evidence publishing;
- organization portals;
- automated email campaigns;
- youth account creation or youth/adult direct messaging;
- gamification, streaks, rankings, follower counts;
- native mobile app;
- broad redesign of the 7YA homepage.

Each becomes its own spec/plan only after Phase A evidence warrants it.

---

## Plan Self-Review

### Spec coverage

Covered in Phase A:

- value-first `/join`;
- adult-only safe pilot;
- Growth Profile core fields;
- deterministic Your Next Move;
- correction control;
- explicit save/consent;
- private resume state;
- return experience;
- Meaningful Progress Events;
- MPE/AH measurement;
- operator aggregate visibility;
- privacy-by-default;
- public/private evidence separation;
- release and provenance gate.

Intentionally deferred because they are Phase B/C concerns:

- matching;
- community primitives beyond progress;
- organizational opportunity graph;
- youth protected implementation;
- AI personalization.

### Placeholder scan

No `TBD`, `TODO`, “implement later”, or unspecified test steps are permitted in this plan. Deferred items are explicitly named as separate scope, not placeholders inside Phase A.

### Type/interface consistency

Canonical Phase A names used throughout:

```text
ageClass: adult | minor | unknown
roleIntent: grow | build | guide | contribute | partner
blockerCategory: clarity | skills | time | people | resources | confidence | other
actionPreference: learn | make | talk | organize | explore
engineVersion: rules-v1
resume localStorage key: 7ya_community_resume_token_v1
```

The server, SQL checks, UI, tests, and runbook must use exactly these names/values.
