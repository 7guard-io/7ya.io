import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const readJson=(file)=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const acceptance=readJson('config/7ya-acceptance.v1.json');
const voice=readJson('config/digital-igor.voice.v1.json');
const control=readJson('docs/CONTROL_PLANE_STATE.json');
const agents=fs.readFileSync(path.join(root,'AGENTS.md'),'utf8');
const errors=[];
const assert=(ok,message)=>{if(!ok)errors.push(message)};

assert(acceptance.product?.identityHierarchy?.primary==='IGOR VEPRETSKI','primary identity must be IGOR VEPRETSKI');
assert(acceptance.product?.identityHierarchy?.container==='#7YA','#7YA must remain the container');
assert(acceptance.product?.identityHierarchy?.socialExecutionLayer==='StartOn','StartOn must remain social execution layer');
assert(acceptance.digitalIgor?.mustDiscloseAI===true,'Digital Igor AI disclosure must be required');
assert(acceptance.digitalIgor?.mayClaimToBeLiveHuman===false,'Digital Igor may not claim to be live human');
assert(acceptance.digitalIgor?.firstPersonRequiresCanon===true,'first person must require canon');
assert(voice.identity?.liveHumanClaimAllowed===false,'voice kernel must forbid live-human claim');
assert(voice.retrieval?.materialIgorClaimRequiresRetrieval===true,'material Igor claims must retrieve');
assert(voice.retrieval?.privateConnectedSourcesAvailableToPublicAgent===false,'public agent must not access private connected sources');
assert(acceptance.visual?.palette?.black==='#0B0B0B','black visual token drift');
assert(acceptance.visual?.palette?.offWhite==='#F2F2EE','off-white visual token drift');
assert(acceptance.visual?.palette?.grey==='#8A8A8A','grey visual token drift');
assert(acceptance.visual?.palette?.accent==='#FF5A1F','Hazard Orange visual token drift');
assert(acceptance.visual?.emojiInUi==='fail','core UI emoji must fail');
assert(acceptance.visual?.authenticMediaFirst===true,'authentic media must remain first');
for(const gate of ['SOURCE_ALIGNMENT','UNIT_TESTS','BUILD','E2E_DESKTOP','E2E_MOBILE','CURRENT_VERSION_VISUAL_QA','EVIDENCE_GATE','CONTROL_PLANE_LEAKAGE','MEDIA_DIVERSITY','REGRESSION']){
  assert(acceptance.qa?.required?.includes(gate),`missing QA gate: ${gate}`);
}
assert(control.canonical_repository?.name==='7guard-io/7ya.io','canonical repository drift');
assert(control.deployment?.production_app_id===acceptance.deployment?.primaryAppId,'AppDeploy app id mismatch');
assert(control.deployment?.active_provider==='AppDeploy v2','active provider must be AppDeploy v2');
assert(control.canonical_repository?.exact_production_source_aligned===false,'source must remain explicitly unaligned until reconciliation');
assert(agents.includes('may speak in first person'),'AGENTS must encode canon-grounded first-person permission');
assert(agents.includes(acceptance.digitalIgor.disclosure.he),'AGENTS must include the Hebrew AI disclosure');

if(errors.length){
  console.error('7YA_CONTRACTS_FAIL');
  for(const error of errors)console.error('- '+error);
  process.exit(1);
}

console.log('7YA_CONTRACTS_PASS');
