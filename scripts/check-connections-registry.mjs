import fs from 'node:fs/promises';

const path='data/connections.json';
const allowedModes=new Set(['verified_runtime','manual_auth','informational','not_needed']);
const allowedStates=new Set(['verified_direct','verified_metricool','needs_oauth','session_needed','legacy']);
const allowedActions=new Set(['manage','copy_prompt']);
const forbidden=/token|password|secret|api[_-]?key|access[_-]?token/i;
const data=JSON.parse(await fs.readFile(path,'utf8'));
const ids=new Set();
const failures=[];

for(const r of data.connections||[]){
  if(!r.id||ids.has(r.id))failures.push(`duplicate/missing id: ${r.id}`);
  ids.add(r.id);
  if(!allowedModes.has(r.status_mode))failures.push(`${r.id}: invalid status_mode`);
  if(!allowedStates.has(r.known_state))failures.push(`${r.id}: invalid known_state`);
  if(!allowedActions.has(r.action_mode))failures.push(`${r.id}: invalid action_mode`);
  if(!Array.isArray(r.core_outputs)||!r.core_outputs.length)failures.push(`${r.id}: empty core_outputs`);
  if(!Number.isInteger(r.priority)||r.priority<1||r.priority>100)failures.push(`${r.id}: invalid priority`);
  if(!/^https:\/\//.test(r.manage_url||''))failures.push(`${r.id}: manage_url must be HTTPS`);
  if(!r.route)failures.push(`${r.id}: route missing`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(r.observed_at||''))failures.push(`${r.id}: observed_at must be YYYY-MM-DD`);
  if(!r.evidence_summary)failures.push(`${r.id}: evidence_summary missing`);
  if(r.action_mode==='copy_prompt'&&!r.connect_prompt)failures.push(`${r.id}: copy_prompt requires connect_prompt`);
  for(const key of Object.keys(r))if(forbidden.test(key))failures.push(`${r.id}: forbidden field ${key}`);
}

if(failures.length){failures.forEach(f=>console.error(`FAIL ${f}`));process.exit(1)}
console.log(`CONNECTIONS_REGISTRY: PASS (${ids.size} providers)`);
