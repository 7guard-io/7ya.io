import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'knowledge/personal-media-manifest-20261127.json'),'utf8'));
assert.equal(manifest.schema_version,1);
assert.match(manifest.purpose,/does not replace/);
assert.ok(manifest.records.length>=8);
assert.ok(manifest.videos.length>=4);
const byId=new Map(manifest.records.map(r=>[r.id,r]));
assert.equal(byId.size,manifest.records.length,'media IDs must be unique');

function readWebpDimensions(file){
 const data=fs.readFileSync(file);
 assert.equal(data.toString('ascii',0,4),'RIFF',file+' must be a RIFF image');
 assert.equal(data.toString('ascii',8,12),'WEBP',file+' must be WebP');
 let offset=12;
 while(offset+8<=data.length){
  const kind=data.toString('ascii',offset,offset+4);
  const length=data.readUInt32LE(offset+4);
  const p=offset+8;
  if(kind==='VP8X'&&length>=10)return {width:data.readUIntLE(p+4,3)+1,height:data.readUIntLE(p+7,3)+1};
  if(kind==='VP8 '&&length>=10)return {width:data.readUInt16LE(p+6)&0x3fff,height:data.readUInt16LE(p+8)&0x3fff};
  if(kind==='VP8L'&&length>=5){const bits=data.readUInt32LE(p+1);return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};}
  offset=p+length+(length%2);
 }
 throw new Error('Unsupported WebP dimension header: '+file);
}
const localeSource=fs.readFileSync(path.join(root,'scripts/localize-static-site.mjs'),'utf8');
for(const record of manifest.records){
 for(const locale of ['he','en','ru','ar']){
  assert.ok(localeSource.includes(record.alt[locale]),record.id+' localized alt is missing for '+locale);
 }
}
for(const record of manifest.records){
 assert.ok(record.id&&record.chapter&&record.relationship_to_igor,'relationship metadata is required');
 assert.ok(record.width>0&&record.height>0&&record.aspect_ratio,record.id+' requires dimensions and ratio');
 assert.ok(record.alt?.he&&record.alt?.en&&record.alt?.ru&&record.alt?.ar,record.id+' requires HE/EN/RU/AR alt text');
 assert.ok(record.source_url&&record.date_precision,record.id+' must retain a source/context and date precision');
 if(record.asset_path){
  const file=path.join(root,record.asset_path);
  assert.ok(fs.existsSync(file),record.id+' points to missing file '+record.asset_path);
  assert.deepEqual(readWebpDimensions(file),{width:record.width,height:record.height},record.id+' dimensions must match the actual file');
 }else{
  assert.match(record.asset_url||'',/^https:\/\//,record.id+' preview must use HTTPS');
  assert.match(record.source_url,/^https:\/\//,record.id+' preview needs a public source link');
 }
}
function getSection(html,token){
 const start=html.indexOf(token);assert.ok(start>=0,'missing '+token);
 const end=html.indexOf('</section>',start);assert.ok(end>=0,'unclosed '+token);
 return html.slice(start,end+'</section>'.length);
}
for(const [locale,file] of [['he','index.html'],['en','en/index.html'],['ru','ru/index.html'],['ar','ar/index.html']]){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const hero=html.match(/<img\b[^>]*data-media-id="home-hero"[^>]*>/)?.[0]||'';
 assert.ok(hero,file+' needs the source-backed hero photograph');
 assert.match(hero,/width="1600"[^>]*height="1600"|height="1600"[^>]*width="1600"/,file+' hero needs intrinsic dimensions');
 const moments=getSection(html,'<section class="personal-moments"');
 const cards=[...moments.matchAll(/<a class="personal-moment[^"]*"[^>]*data-media-id="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
 assert.equal(cards.length,7,file+' must contain seven image-backed moments');
 const uniqueSrc=new Set();
 
 for(const [,id,body] of cards){
  const record=byId.get(id);
  assert.ok(record,file+' uses an unregistered asset ID: '+id);
  const attrs=body.match(/<img\b([^>]*)>/)?.[1]||'';
  const src=attrs.match(/\bsrc="([^"]+)"/)?.[1];
  const alt=attrs.match(/\balt="([^"]+)"/)?.[1];
  const width=Number(attrs.match(/\bwidth="(\d+)"/)?.[1]);
  const height=Number(attrs.match(/\bheight="(\d+)"/)?.[1]);
  assert.ok(src&&alt&&width>0&&height>0,id+' requires src, alt and intrinsic dimensions');
  assert.equal(src,record.public_url||record.asset_url,id+' src must match manifest');
  assert.equal(alt,record.alt[locale],id+' alt must match page locale');
  assert.deepEqual({width,height},{width:record.width,height:record.height},id+' dimensions must match manifest');
  assert.ok(attrs.includes(`data-focal-point="${record.object_position}"`),id+' focal point must match manifest');
  assert.ok(!uniqueSrc.has(src),file+' repeats the same image across separate scenes: '+src);
  uniqueSrc.add(src);
 }
 const video=getSection(html,'<section class="first-person-video');
 assert.match(video,/youtube-nocookie\.com\/embed\/fxFAUrb1h0M/,file+' must embed the first-person story');
 assert.match(video,/youtube\.com\/watch\?v=fxFAUrb1h0M/,file+' must retain the direct YouTube source fallback');
 assert.match(video,/loading="eager"/,file+' opening iframe should be prioritized directly below the hero');
 assert.match(video,/playsinline=1/,file+' iframe should support mobile inline playback');
 assert.doesNotMatch(video,/autoplay=1|autoplay;/,file+' video must not autoplay');
}
assert.ok(manifest.social_previews?.length>=10,'manifest should index all existing source-linked social image previews');
for(const preview of manifest.social_previews){
 assert.match(preview.image_url,/^https:\/\//,preview.id+' preview must use HTTPS');
 assert.match(preview.source_url,/^https:\/\//,preview.id+' source must use HTTPS');
 assert.ok(preview.alt?.he&&preview.alt?.en&&preview.alt?.ru&&preview.alt?.ar,preview.id+' needs four-language alt text');
}
for(const video of manifest.videos){
 assert.match(video.source_url,/^https:\/\//,video.id+' needs a public source');
 assert.equal(video.autoplay,false,video.id+' must not autoplay');
}
console.log('MEDIA_INTEGRITY: PASS (manifest, hero, seven media cards, binary WebP dimensions, localized alt and video/source fallback)');
