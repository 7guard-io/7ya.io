#!/usr/bin/env node
import fs from 'node:fs/promises';

const policy = JSON.parse(await fs.readFile('config/autonomy-policy.json', 'utf8'));
const failures = [];

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

requireCondition(policy.schema_version === 1, 'schema_version must be 1');
requireCondition(typeof policy.kill_switch_env === 'string' && policy.kill_switch_env.length > 0, 'kill switch environment variable is required');
requireCondition(policy.mode === 'dry-run', 'initial autonomy mode must remain dry-run');
requireCondition(policy.budgets?.max_runs_per_day <= 2, 'max_runs_per_day must be 2 or lower');
requireCondition(policy.budgets?.max_model_calls_per_run <= 3, 'max_model_calls_per_run must be 3 or lower');
requireCondition(policy.budgets?.max_cost_usd_per_day <= 5, 'max_cost_usd_per_day must be 5 USD or lower');
requireCondition(policy.data_policy?.public_metadata_only === true, 'only public metadata may be ingested');
requireCondition(policy.data_policy?.allow_personal_data === false, 'personal data ingestion must remain disabled');
requireCondition(policy.data_policy?.allow_minor_data === false, 'minor data ingestion must remain disabled');
requireCondition(policy.data_policy?.allow_credentials === false, 'credential ingestion must remain disabled');

for (const action of ['publish_public_content', 'merge_code', 'deploy_production', 'issue_certificate']) {
  requireCondition(policy.actions?.[action]?.autonomous === false, `${action} must not be autonomous`);
  requireCondition(policy.actions?.[action]?.approval_required === true, `${action} must require approval`);
}

requireCondition(policy.actions?.issue_certificate?.minimum_approvals >= 2, 'certificate issuance must require at least two approvals');
requireCondition(policy.provider_policy?.require_pinned_model_for_high_risk === true, 'high-risk model use must be pinned');
requireCondition(policy.provider_policy?.require_eval_pass_before_model_change === true, 'model changes must require an eval pass');

const forbiddenSilentFailover = new Set(policy.provider_policy?.silent_failover_forbidden_for || []);
for (const action of ['publish_public_content', 'merge_code', 'deploy_production', 'issue_certificate']) {
  requireCondition(forbiddenSilentFailover.has(action), `${action} must forbid silent provider failover`);
}

requireCondition(policy.audit?.append_only === true, 'audit trail must be append-only');
requireCondition(policy.audit?.hash_each_run === true, 'every run must be hashed');
requireCondition(policy.audit?.record_prompt_version === true, 'prompt version must be recorded');
requireCondition(policy.audit?.record_model === true, 'model must be recorded');
requireCondition(policy.audit?.record_source_hashes === true, 'source hashes must be recorded');
requireCondition(policy.audit?.record_approvals === true, 'approvals must be recorded');

if (failures.length) {
  console.error('AUTONOMY_POLICY_CHECK: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('AUTONOMY_POLICY_CHECK: PASS');
