const assert = require('assert');
const site = require('../api/site');
const release = require('../api/release');
function run(handler, req) { return new Promise((resolve) => { const headers={}; const res={statusCode:200,setHeader:(k,v)=>headers[k.toLowerCase()]=v,end:(body='')=>resolve({status:res.statusCode,headers,body})}; handler(req,res); }); }
(async()=>{
  const routes=['/','/igor-vepretski/','/talk/','/social/','/pass/','/evidence/','/starton/','/contact/','/radar/'];
  for (const route of routes) { const r=await run(site,{url:route,query:{route},headers:{host:'7ya.io'}}); assert.equal(r.status,200,route); assert.match(r.body,/<title>.+<\/title>/); assert.match(r.body,/canonical/); assert.match(r.body,/index, follow/); }
  const www=await run(site,{url:'/evidence/',query:{route:'/evidence/'},headers:{host:'www.7ya.io'}}); assert.equal(www.status,308); assert.equal(www.headers.location,'https://7ya.io/evidence/');
  const rel=await run(release,{headers:{}}); assert.equal(rel.status,200); assert.match(rel.body,/canonical-runtime/);
  console.log('PASS: 9 routes, metadata, www redirect, release endpoint');
})().catch((error)=>{console.error(error);process.exit(1)});
