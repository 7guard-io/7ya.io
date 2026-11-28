import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const life=read('knowledge/master-public-record-20260918.json');
const social=read('knowledge/social-corpus-20260918.json');
const universe=read('knowledge/public-universe-records-20260715.json');
const fail=message=>{console.error(`FAIL ${message}`);process.exitCode=1};
const pass=message=>console.log(`PASS ${message}`);
for(const [name,data,key] of [['life archive',life,'records'],['social corpus',social,'moments'],['public universe',universe,'records']]){
  const records=data[key];
  Array.isArray(records)&&records.length?pass(`${name} has ${records.length} records`):fail(`${name} is empty`);
  const ids=records.map(x=>x.id).filter(Boolean);
  new Set(ids).size===ids.length?pass(`${name} has unique IDs`):fail(`${name} has duplicate IDs`);
}
life.counts?.projected_records===life.records.length?pass('life archive declared count matches records'):fail('life archive declared count does not match records');
const page=fs.readFileSync('library/index.html','utf8');
for(const token of ['REALITY &amp; MEDIA EXPLORER','data-living-explorer','living-archive-explorer-20261128.js','הפרדה היא חלק מהראיה'])
  page.includes(token)?pass(`library contains ${token}`):fail(`library missing ${token}`);
const runtime=fs.readFileSync('scripts/living-archive-explorer-20261128.js','utf8');
for(const [token,label] of [
  ['const safeExternalUrl=','external URL validation is explicit'],
  ["url.protocol==='https:'",'external source links require HTTPS'],
  ["url.origin===window.location.origin",'HTTP is limited to same-origin development links'],
  ["link.rel='noopener noreferrer'",'external links are isolated from the opener'],
  ['request!==state.request','stale collection requests cannot overwrite the active layer'],
  ['ui.grid.replaceChildren(fragment)','cards are rendered as DOM nodes'],
  ['Unexpected source schema','unexpected source shapes fail closed']
]) runtime.includes(token)?pass(label):fail(`missing explorer guard: ${label}`);
runtime.includes('innerHTML')?fail('explorer must not interpolate untrusted source text into innerHTML'):pass('explorer does not use innerHTML');
