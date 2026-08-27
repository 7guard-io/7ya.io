import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const pointerPath=path.join(root,'appdeploy-live','META-CANDIDATE.json');
const fail=(message)=>{console.error(message);process.exit(1)};

if(!fs.existsSync(pointerPath))fail('Meta candidate pointer missing');
let pointer;
try{pointer=JSON.parse(fs.readFileSync(pointerPath,'utf8'))}catch{fail('Meta candidate pointer invalid JSON')}
const snapshot=String(pointer.snapshot||'').trim();
if(!/^\d{13}$/.test(snapshot))fail('Meta candidate snapshot invalid');
const base=path.join(root,'appdeploy-live',snapshot);
const required=[
  'shared/social-ingest.ts',
  'backend/meta/client.ts',
  'backend/meta/capabilities.ts',
  'backend/meta/facebook-adapter.ts',
  'backend/meta/instagram-adapter.ts',
  'backend/meta/store.ts',
  'backend/meta/sync.ts',
  'backend/index.ts',
  'cron.json',
  'tests/tests.txt',
];
for(const rel of required){if(!fs.existsSync(path.join(base,rel)))fail(`Meta candidate file missing: ${rel}`)}

const metaDir=path.join(base,'backend','meta');
const metaFiles=fs.readdirSync(metaDir).filter(name=>name.endsWith('.ts')).map(name=>path.join(metaDir,name));
const forbidden=['access_token=','console.log(config)','console.log(token)','JSON.stringify(rawGraph'];
for(const file of metaFiles){
  const source=fs.readFileSync(file,'utf8');
  for(const needle of forbidden){if(source.includes(needle))fail(`Forbidden Meta source pattern ${needle} in ${path.relative(root,file)}`)}
}

const scanFiles=[...metaFiles,path.join(base,'shared','social-ingest.ts'),path.join(base,'backend','index.ts')];
const joined=scanFiles.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const anchors=['META_ALLOWED_PAGE_IDS','META_ALLOWED_INSTAGRAM_IDS','META_INGEST_ENABLED','owner-authorized-api','source-local','Promise.allSettled','Authorization','Bearer'];
for(const anchor of anchors){if(!joined.includes(anchor))fail(`Meta candidate anchor missing: ${anchor}`)}

console.log(`Meta ingestion export integrity OK: ${snapshot} (${pointer.production_applied===true?'production-applied':'candidate'})`);
