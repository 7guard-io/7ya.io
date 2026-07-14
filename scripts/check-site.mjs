import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();let failures=0;
const pass=m=>console.log(`PASS ${m}`);const fail=m=>{failures+=1;console.error(`FAIL ${m}`);};
const read=file=>{const absolute=path.join(root,file);if(!fs.existsSync(absolute)){fail(`${file} missing`);return'';}pass(`${file} exists`);return fs.readFileSync(absolute,'utf8');};
const requireText=(body,text,label)=>body.includes(text)?pass(`${label} includes ${text}`):fail(`${label} missing ${text}`);
const excludeText=(body,text,label)=>!body.includes(text)?pass(`${label} excludes ${text}`):fail(`${label} contains ${text}`);

const canonicalRoutes=['','igor-vepretski','journey','public-service','starton','influence','social','evidence','radar','7ya','pass','speaker','talk','media','articles','contact','delta-audit'];
const aliases=new Map([
  ['about','/igor-vepretski/'],['oracle','/evidence/'],['business','/7ya/'],['member-pass','/7ya/'],
  ['work','/#creations'],['systems','/7ya/'],['music','/influence/'],
]);
const mirroredPages=['igor-vepretski','public-service','starton','social','evidence','radar','pass','talk','contact'];

for(const route of canonicalRoutes){
  const file=route?`${route}/index.html`:'index.html';const html=read(file);const url=`https://7ya.io/${route?`${route}/`:''}`;
  requireText(html,'<!doctype html>',file);
  /<meta\s+name=["']viewport["']/i.test(html)?pass(`${file} has viewport`):fail(`${file} missing viewport`);
  /<title>[^<]{3,}<\/title>/i.test(html)?pass(`${file} has title`):fail(`${file} missing title`);
  /<meta\s+name=["']description["']/i.test(html)?pass(`${file} has description`):fail(`${file} missing description`);
  /<meta\s+name=["']robots["']\s+content=["'][^"']*index\s*,?\s*follow/i.test(html)?pass(`${file} is indexable`):fail(`${file} missing index,follow`);
  requireText(html,`<link rel="canonical" href="${url}"`,file);
  for(const forbidden of ['noindex','http-equiv="refresh"','location.replace(','Living Proof System','Public trust shell'])excludeText(html,forbidden,file);
}

for(const [route,target] of aliases){
  const file=`${route}/index.html`;const html=read(file);const canonical=target.startsWith('/#')?'https://7ya.io/':`https://7ya.io${target}`;
  requireText(html,'<!doctype html>',file);
  /<meta\s+name=["']robots["']\s+content=["']noindex,\s*follow/i.test(html)?pass(`${file} is noindex alias`):fail(`${file} missing noindex,follow`);
  requireText(html,`<link rel="canonical" href="${canonical}"`,file);
  requireText(html,'http-equiv="refresh"',file);requireText(html,'location.replace(',file);
}

const home=read('index.html');for(const marker of ['איגור ופרצקי','IGOR VEPRETSKI','StartOn','Evidence Ledger','Human first'])requireText(home,marker,'homepage');
const identity=read('igor-vepretski/index.html');for(const marker of ['SELF-ATTESTED','הביוגרפיה אינה','PERSON · MISSION · SYSTEM · EVIDENCE'])requireText(identity,marker,'identity');
const social=read('social/index.html');for(const marker of ['PUBLIC CHANNELS','METRICS REQUIRE SNAPSHOT','tiktok.com/@igor.vepretski'])requireText(social,marker,'social');
const passPage=read('pass/index.html');for(const marker of ['NO CREDENTIAL','NO AUTHORITY','אינו מחליף תעודת זהות'])requireText(passPage,marker,'pass');
const radar=read('radar/index.html');for(const marker of ['INTENT','APPROVAL','ALLOCATION','EXECUTION','OUTCOME'])requireText(radar,marker,'radar');
const service=read('public-service/index.html');for(const marker of ['SELF-ATTESTED','SOURCE PENDING','NO OPERATIONAL DETAIL'])requireText(service,marker,'public-service');

for(const asset of ['assets/igor-home-portrait-20260712.jpg','assets/igor-home-og-20260712.jpg','styles/creatorverse-depth-20260714.css','favicon.svg','404.html'])read(asset);
const sitemap=read('sitemap.xml');for(const route of canonicalRoutes)requireText(sitemap,`https://7ya.io/${route?`${route}/`:''}`,'sitemap');for(const route of aliases.keys())excludeText(sitemap,`https://7ya.io/${route}/`,'sitemap aliases');
const robots=read('robots.txt');for(const marker of ['User-agent: *','Allow: /','Sitemap: https://7ya.io/sitemap.xml'])requireText(robots,marker,'robots');

for(const route of mirroredPages){
  const file=`ops/vercel-recovery/${route}/index.html`;const html=read(file);
  requireText(html,'<!doctype html>',file);requireText(html,'creatorverse-depth-20260714-1',file);requireText(html,'/creatorverse-depth-20260714.css?v=1',file);
  /<meta\s+name=["']description["']/i.test(html)?pass(`${file} has description`):fail(`${file} missing description`);
  /<meta\s+name=["']robots["']\s+content=["'][^"']*index\s*,?\s*follow/i.test(html)?pass(`${file} is indexable`):fail(`${file} missing index,follow`);
  requireText(html,`https://7ya.io/${route}/`,file);
}
const recoverySitemap=read('ops/vercel-recovery/sitemap.xml');for(const route of canonicalRoutes.filter(route=>['','igor-vepretski','journey','public-service','starton','influence','social','evidence','radar','7ya','pass','speaker','talk','contact'].includes(route)))requireText(recoverySitemap,`https://7ya.io/${route?`${route}/`:''}`,'recovery sitemap');

let vercel={};try{vercel=JSON.parse(read('ops/vercel-recovery/vercel.json'));pass('vercel.json parses');}catch(error){fail(`vercel.json invalid: ${error.message}`);}
const redirects=Array.isArray(vercel.redirects)?vercel.redirects:[];const rewrites=Array.isArray(vercel.rewrites)?vercel.rewrites:[];const headerMap=new Map((vercel.headers||[]).map(rule=>[rule.source,new Map((rule.headers||[]).map(header=>[header.key,header.value]))]));
for(const [route,target] of aliases){const rule=redirects.find(candidate=>candidate.source===`/${route}/`);rule?.destination===target&&rule.permanent===true?pass(`Vercel redirects /${route}/`):fail(`Vercel alias /${route}/ missing`);}
const criticalStatic=['/igor-vepretski/','/public-service/','/starton/','/social/','/evidence/','/radar/','/pass/','/talk/','/contact/'];
for(const route of criticalStatic){
  redirects.some(rule=>rule.source===route)?fail(`${route} must not redirect`):pass(`${route} has no redirect`);
  rewrites.some(rule=>rule.source===route)?fail(`${route} must not rewrite`):pass(`${route} is static`);
  const headers=headerMap.get(route);headers?.get('X-Robots-Tag')==='index, follow'?pass(`${route} has X-Robots-Tag`):fail(`${route} missing X-Robots-Tag`);
  headers?.get('Cache-Control')==='public, max-age=0, must-revalidate'?pass(`${route} revalidates`):fail(`${route} missing cache policy`);
}
const www=redirects.find(rule=>rule.source==='/:path*'&&rule.destination==='https://7ya.io/:path*'&&rule.permanent===true&&rule.has?.some(item=>item.type==='host'&&item.value==='www.7ya.io'));www?pass('www redirects to apex'):fail('www redirect missing');

const proxy=read('ops/vercel-canonical-proxy/api/proxy.js');for(const [route,target] of aliases)requireText(proxy,`['${route}', '${target}']`,'proxy aliases');for(const removed of ["['social',","['pass',","['radar',","['public-service',"])excludeText(proxy,removed,'proxy critical routes');for(const marker of ['CANONICAL_SOURCE_SHA','VERCEL_GIT_COMMIT_SHA','GITHUB_SHA','PROVENANCE_UNBOUND','response.statusCode=308'])requireText(proxy,marker,'proxy provenance');
read('CNAME').trim()==='7ya.io'?pass('CNAME is 7ya.io'):fail('CNAME mismatch');

if(failures){console.error(`\nSITE_CHECK: FAIL (${failures})`);process.exit(1);}console.log('\nSITE_CHECK: PASS');
