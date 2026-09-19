import fs from 'node:fs/promises';
import path from 'node:path';

const artifactMode = process.argv.includes('--artifact');
const root = process.cwd();
const base = artifactMode ? path.join(root,'dist') : root;
const failures = [];
const fail = message => failures.push(message);

async function readJson(relative){
  try{return JSON.parse(await fs.readFile(path.join(base,relative),'utf8'));}
  catch(error){fail(`missing/invalid JSON ${relative}: ${error.message}`);return null;}
}
async function readText(relative){
  try{return await fs.readFile(path.join(base,relative),'utf8');}
  catch(error){fail(`missing file ${relative}: ${error.message}`);return '';}
}

const contract = await readJson('knowledge/content-os-contract-20260918.json');
const master = await readJson('knowledge/master-public-record-20260918.json');
const curated = await readJson('knowledge/social-corpus-20260918.json');

if(contract && master && curated){
  const masterRecords = Array.isArray(master.records) ? master.records : [];
  const curatedRecords = Array.isArray(curated.moments) ? curated.moments : [];
  const publicUrls = masterRecords.filter(r=>r?.url).length;

  if(masterRecords.length < Number(contract.canonical_corpora?.master?.minimum_records||0)){
    fail(`master corpus too small: ${masterRecords.length}`);
  }
  if(publicUrls < Number(contract.canonical_corpora?.master?.minimum_public_urls||0)){
    fail(`master public URL coverage too small: ${publicUrls}`);
  }
  if(curatedRecords.length < Number(contract.canonical_corpora?.curated?.minimum_records||0)){
    fail(`curated corpus too small: ${curatedRecords.length}`);
  }

  const platformCounts = new Map();
  for(const record of masterRecords){
    const platform = String(record?.platform||'').trim();
    if(platform) platformCounts.set(platform,(platformCounts.get(platform)||0)+1);
  }
  for(const [platform,minimum] of Object.entries(contract.platform_minimums||{})){
    const count = platformCounts.get(platform)||0;
    if(count < Number(minimum)) fail(`${platform} coverage below contract: ${count} < ${minimum}`);
  }

  for(const [relative,markers] of Object.entries(contract.required_source_markers||{})){
    const body = await readText(relative);
    for(const marker of markers){
      if(!body.toLowerCase().includes(String(marker).toLowerCase())){
        fail(`${relative} missing required marker ${marker}`);
      }
    }
  }

  const masterBlob = JSON.stringify(masterRecords).toLowerCase();
  const curatedBlob = JSON.stringify(curatedRecords).toLowerCase();
  const combined = masterBlob + '\n' + curatedBlob;
  const requiredDomains = ['facebook','instagram','youtube','tiktok','linkedin','spotify','academia','starton'];
  for(const token of requiredDomains){
    if(!combined.includes(token)) fail(`canonical corpora missing domain/category token: ${token}`);
  }

  if(artifactMode){
    for(const relative of contract.impact_layer_routes||[]){
      const body = await readText(relative);
      if(!body.includes('data-seven-proof-layer')) fail(`${relative} missing evidence/proof layer`);
      if(!body.includes('site-impact-layer-20260918.js')) fail(`${relative} missing shared impact runtime`);
      if(!body.includes('https://igorvepretski.academia.edu/')) fail(`${relative} missing Academia fallback link`);
      if(!body.includes('/research/')) fail(`${relative} missing Research fallback link`);
      if(!body.includes('/media/')) fail(`${relative} missing Media fallback link`);
      if(!body.includes('/starton/')) fail(`${relative} missing StartOn fallback link`);
      if(!body.includes('data-seven-human-nav')) fail(`${relative} missing consistent 7YA navigation`);
      if(!body.includes('href="/contact/"')) fail(`${relative} missing working contact CTA`);
      if(!body.includes('דברו איתי')) fail(`${relative} missing Hebrew contact CTA label`);
    }

    for(const relative of contract.personal_identity_routes||[]){
      const body = await readText(relative);
      if(!body.includes('data-seven-person-anchor')) fail(`${relative} missing person-first Igor identity anchor`);
      if(!body.includes('/assets/igor-home-portrait-20260712.webp')) fail(`${relative} missing photographic Igor identity asset`);
      if(body.includes('data-seven-proof-layer')) fail(`${relative} must not receive the generic proof layer`);
      if(!body.includes('data-seven-human-nav')) fail(`${relative} missing consistent 7YA navigation`);
      if(!body.includes('href="/contact/"')) fail(`${relative} missing working contact CTA`);
    }

    const home = await readText('index.html');
    if(!home.includes('data-first-fold-life')) fail('index.html missing personal first fold');
    if(!home.includes('assets/igor-home-portrait-20260712.webp')) fail('index.html missing photographic Igor hero');
    if(home.includes('data-seven-proof-layer')) fail('index.html must stay person-first, not generic proof-first');

    const influence = await readText('influence/index.html');
    if(!influence.includes('class="live-social-media"')) fail('influence/index.html missing static source-media fallback');
    if(!influence.includes('id="liveSocialCount">4<')) fail('influence/index.html missing non-empty static social fallback');
  }
}

if(failures.length){
  failures.forEach(message=>console.error(`FAIL ${message}`));
  console.error(`CONTENT_OS_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`CONTENT_OS_CONTRACT: PASS (${artifactMode?'artifact':'source'} mode)`);
