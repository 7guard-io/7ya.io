'use strict';

const SOURCE_REPOSITORY = '7guard-io/7ya.io';
const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const CANONICAL_ALIASES = new Map([
  ['about', '/igor-vepretski/'],
  ['oracle', '/evidence/'],
  ['business', '/7ya/'],
  ['member-pass', '/7ya/'],
  ['work', '/#creations'],
  ['systems', '/7ya/'],
  ['music', '/influence/'],
]);
const MIME_TYPES = {
  html:'text/html; charset=utf-8', css:'text/css; charset=utf-8', js:'application/javascript; charset=utf-8',
  mjs:'application/javascript; charset=utf-8', json:'application/json; charset=utf-8', xml:'application/xml; charset=utf-8',
  txt:'text/plain; charset=utf-8', svg:'image/svg+xml', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', webp:'image/webp',
  gif:'image/gif', ico:'image/x-icon', woff:'font/woff', woff2:'font/woff2', mp3:'audio/mpeg', mp4:'video/mp4'
};
const IMMUTABLE = new Set(['css','js','mjs','svg','png','jpg','jpeg','webp','gif','ico','woff','woff2','mp3','mp4']);

function validSha(value){const normalized=String(value||'').trim();return SHA_PATTERN.test(normalized)?normalized:null;}
function sourceSha(){return validSha(process.env.CANONICAL_SOURCE_SHA)||validSha(process.env.VERCEL_GIT_COMMIT_SHA)||validSha(process.env.GITHUB_SHA);}
function extension(file){const index=file.lastIndexOf('.');return index<0?'':file.slice(index+1).toLowerCase();}
function pathInfo(request){
  let url; try{url=new URL(request.url||'/','https://7ya.invalid');}catch{return null;}
  const raw=(url.searchParams.get('path')||'').replace(/\\/g,'/').replace(/^\/+/, '');
  const segments=raw.split('/').filter(Boolean);
  if(segments.some(segment=>segment==='.'||segment==='..'||segment.includes('\0'))) return null;
  return {raw,normalized:segments.join('/')};
}
function sourcePath(info){if(!info)return null;if(!info.normalized)return'index.html';if(info.raw.endsWith('/'))return`${info.normalized}/index.html`;return extension(info.normalized)?info.normalized:`${info.normalized}/index.html`;}
function alias(info){if(!info)return null;return CANONICAL_ALIASES.get(info.normalized.replace(/\/+$/,''))||null;}
function baseHeaders(response,sha){
  response.setHeader('X-Content-Type-Options','nosniff');response.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');response.setHeader('X-7YA-Source-Repository',SOURCE_REPOSITORY);
  if(sha)response.setHeader('X-7YA-Source-SHA',sha);
}
function sendJson(response,status,body){response.statusCode=status;baseHeaders(response,null);response.setHeader('Content-Type','application/json; charset=utf-8');response.setHeader('Cache-Control','no-store');response.end(JSON.stringify(body));}
function redirect(request,response,destination,sha){response.statusCode=308;baseHeaders(response,sha);response.setHeader('Location',destination);response.setHeader('X-Robots-Tag','noindex, follow');response.setHeader('Cache-Control','public, max-age=300, s-maxage=3600');response.setHeader('Content-Type','text/plain; charset=utf-8');request.method==='HEAD'?response.end():response.end(`Permanent Redirect: ${destination}`);}
function responseHeaders(response,file,status,sha){
  const type=extension(file);response.statusCode=status;baseHeaders(response,sha);response.setHeader('Content-Type',MIME_TYPES[type]||'application/octet-stream');
  response.setHeader('Cross-Origin-Resource-Policy','cross-origin');response.setHeader('Access-Control-Allow-Origin','*');response.setHeader('X-7YA-Source-Path',file);
  if(type==='html'){response.setHeader('X-Robots-Tag','index, follow');response.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=86400');}
  else if(IMMUTABLE.has(type))response.setHeader('Cache-Control','public, max-age=31536000, immutable');
  else response.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
}

module.exports=async(request,response)=>{
  if(!['GET','HEAD'].includes(request.method)){response.statusCode=405;response.setHeader('Allow','GET, HEAD');response.end();return;}
  const sha=sourceSha();
  if(!sha){sendJson(response,503,{status:'PROVENANCE_UNBOUND',production_verified:false,repair:'Set CANONICAL_SOURCE_SHA from the exact tested commit or deploy from a provider-linked Git commit.'});return;}
  const info=pathInfo(request);if(!info){sendJson(response,400,{error:'Invalid path'});return;}
  const destination=alias(info);if(destination){redirect(request,response,destination,sha);return;}
  const requested=sourcePath(info);const rawBase=`https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${sha}/`;
  try{
    let upstream=await fetch(`${rawBase}${requested}`,{headers:{'User-Agent':'7ya-canonical-recovery/2.0',Accept:'*/*'}});let served=requested;let status=upstream.status;
    if(upstream.status===404&&extension(requested)==='html'){upstream=await fetch(`${rawBase}404.html`);served='404.html';status=404;}
    if(!upstream.ok&&status!==404)throw new Error(`Canonical source returned ${upstream.status} for ${requested}`);
    const body=Buffer.from(await upstream.arrayBuffer());responseHeaders(response,served,status,sha);response.setHeader('Content-Length',String(body.length));
    request.method==='HEAD'?response.end():response.end(body);
  }catch(error){sendJson(response,502,{error:'Canonical source unavailable',source_sha:sha,detail:String(error.message||error)});}
};
