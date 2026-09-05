# 7YA Community Phase A — Privacy-Safe Metrics Companion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute this companion together with `2026-08-10-7ya-community-phase-a-first-value-loop.md`. This plan corrects the measurement gap discovered in self-review before implementation.

**Goal:** Measure the Phase A anonymous funnel and first-value usefulness without collecting contact data, goal text, blocker text, or IP-derived identity before the user explicitly saves a profile.

**Architecture:** The browser creates a random one-session `flowId`; the server stores only its SHA-256 hash with allowlisted coarse events. The same hash links `intake_started → intake_completed → first_value_rendered → first_value_feedback`; once a user explicitly saves, the save transaction may attach the existing anonymous flow to the new `person_id`. Raw intake text is never stored in the anonymous event stream.

**Tech Stack:** Existing Netlify Functions, PostgreSQL, Node crypto, zod, node:test.

## Global Constraints

- This plan is required before claiming the Phase A intake/usefulness thresholds are measurable.
- `flowId` is random browser-generated entropy, not email, phone, cookie fingerprint, IP, device fingerprint, advertising ID, or political identifier.
- Store only `flow_id_hash`, never plaintext `flowId`.
- Anonymous event properties are allowlisted; arbitrary JSON from the client is rejected.
- Never include `goalText`, `blockerText`, email, resume token, evidence URL, or free-text notes in anonymous event properties.
- Retention of anonymous pre-save funnel events is 90 days maximum for the pilot; a scheduled deletion mechanism can be added at deployment/provider level, and the runbook must record the retention policy.

---

### Task M1: Extend the Phase A Event Schema Before Applying Migration

**Files:**
- Modify before implementation: `sql/003_community_phase_a.sql`
- Modify: `test/community/repository-contract.test.mjs`

**Interfaces:**
- Produces anonymous funnel linkage via `community_events.flow_id_hash`.

- [ ] Add nullable `flow_id_hash TEXT` to `community_events`.

- [ ] Expand `event_name` CHECK to exactly:

```text
intake_started
intake_completed
first_value_rendered
first_value_feedback
profile_saved
growth_returned
progress_recorded
profile_corrected
```

- [ ] Add index:

```sql
CREATE INDEX IF NOT EXISTS community_events_flow_created_idx
ON community_events (flow_id_hash, created_at DESC)
WHERE flow_id_hash IS NOT NULL;
```

- [ ] Extend schema contract test:

```js
assert.match(sql, /flow_id_hash\s+TEXT/i);
assert.match(sql, /first_value_feedback/i);
```

- [ ] Run:

```bash
node --test test/community/repository-contract.test.mjs
```

Expected: PASS.

---

### Task M2: Anonymous Event API

**Files:**
- Create: `netlify/functions/community-event.js`
- Modify: `netlify/functions/_lib/community/contracts.js`
- Modify: `netlify/functions/_lib/community/repository.js`
- Modify: `test/community/api-contract.test.mjs`

**Interfaces:**
- `POST /api/community-event`
- Request: `{ flowId, eventName, properties }`
- Response: `{ ok: true }`

- [ ] Add contracts:

```js
export const AnonymousEventNameSchema = z.enum([
  "intake_started",
  "intake_completed",
  "first_value_rendered",
  "first_value_feedback",
]);

export const AnonymousEventSchema = z.object({
  flowId: z.string().min(20).max(200),
  eventName: AnonymousEventNameSchema,
  properties: z.object({
    locale: LocaleSchema.optional(),
    roleIntent: RoleIntentSchema.optional(),
    blockerCategory: BlockerCategorySchema.optional(),
    actionPreference: ActionPreferenceSchema.optional(),
    sourceChannel: z.string().max(120).optional(),
    usefulness: z.enum(["very_useful", "useful", "neutral", "not_useful"]).optional(),
  }).strict().default({}),
});
```

- [ ] Add `hashFlowId(flowId)` using SHA-256. Do not log `flowId`.

- [ ] Implement repository insert using only:

```text
flow_id_hash
event_name
allowlisted properties
created_at
```

- [ ] API test must reject arbitrary data:

```js
const res = await eventApi(new Request("https://7ya.io/api/community-event", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    flowId: "x".repeat(32),
    eventName: "intake_started",
    properties: { goalText: "must not be accepted" }
  })
}));
assert.equal(res.status, 400);
```

- [ ] Commit with the Task 4 API work or as its own reviewable commit:

```bash
git add netlify/functions/community-event.js netlify/functions/_lib/community test/community/api-contract.test.mjs
git commit -m "feat: add privacy-safe anonymous community events"
```

---

### Task M3: Browser Funnel and Usefulness Instrumentation

**Files:**
- Modify: `scripts/community-join.js`
- Modify: `join/index.html`
- Modify: `scripts/check-community-phase-a.mjs`

**Interfaces:**
- Produces four anonymous events and no hidden contact collection.

- [ ] Generate `flowId` once per join session:

```js
const flowId = crypto.randomUUID();
```

Do not persist it beyond the current join flow unless the page reload recovery requires `sessionStorage`; never use long-lived localStorage for anonymous flow identity.

- [ ] Send `intake_started` when the user begins the first question.

- [ ] Send `intake_completed` immediately before calling `/api/community-intake`, with coarse classifications only.

- [ ] Send `first_value_rendered` only after a successful first-value response is rendered.

- [ ] Render one usefulness question directly beneath the first value:

```text
כמה זה שימושי לך כרגע?
מאוד שימושי / שימושי / ניטרלי / לא שימושי
```

Send `first_value_feedback` with only the enum value.

- [ ] When profile save succeeds, include `flowId` in `/api/community-save`; server hashes it and attaches matching anonymous events to the new `person_id` in the same transaction. Plaintext is never persisted.

- [ ] Extend deterministic checker to assert the usefulness control exists and the script calls `/api/community-event`.

---

### Task M4: Correct Aggregate Metrics

**Files:**
- Modify: `netlify/functions/community-admin-stats.js`
- Modify: `scripts/community-pilot-report.mjs`
- Modify: `test/community/api-contract.test.mjs`

**Interfaces:**
- Produces actual measurable thresholds instead of inferred numbers.

- [ ] Aggregate unique hashed flows for:

```text
intakeStarted
intakeCompleted
firstValueRendered
firstValueFeedbackCount
usefulOrVeryUsefulCount
```

- [ ] Compute:

```js
intakeCompletionRate = intakeStarted ? intakeCompleted / intakeStarted : 0;
firstValueUsefulnessRate = firstValueFeedbackCount
  ? usefulOrVeryUsefulCount / firstValueFeedbackCount
  : 0;
```

- [ ] Keep saved-participant metrics separate:

```text
profilesSaved
activeHumans
sevenDayReturners
meaningfulProgressEvents
mpePerActiveHuman
```

- [ ] Update pilot report decision flags:

```text
intake completion >= 60%
first-value usefulness >= 70%
first meaningful action within 7d >= 35%
7-day saved-participant return >= 25%
0 unresolved critical privacy/safety defects
```

- [ ] Test output still contains no email, free text, evidence URL, token hash, or raw flow id.

---

## Companion Self-Review

This companion closes two gaps in the main Phase A plan:

1. anonymous intake completion is now measurable without contact/goal storage;
2. the approved ≥70% first-value usefulness threshold now has a defined event and denominator.

It does **not** introduce advertising tracking, cross-site tracking, device fingerprinting, or pre-value contact capture.
