import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
const root=process.cwd();
const runtime=fs.readFileSync(path.join(root,'scripts/social-first-home-20260916.js'),'utf8');
const corpus=JSON.parse(fs.readFileSync(path.join(root,'knowledge/social-corpus-20260918.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'knowledge/personal-media-manifest-20261127.json'),'utf8'));
class FakeClassList{
 constructor(owner){this.owner=owner;this.values=new Set()}
 replace(value=''){this.values=new Set(String(value).split(/\\s+/).filter(Boolean))}
 contains(value){return this.values.has(value)}
 add(...values){values.forEach(v=>this.values.add(v));this.owner._className=[...this.values].join(' ')}
 remove(...values){values.forEach(v=>this.values.delete(v));this.owner._className=[...this.values].join(' ')}
}
class FakeElement{
 constructor(tagName,{fragment=false}={}){this.tagName=tagName;this.children=[];this.dataset={};this.classList=new FakeClassList(this);this._className='';this.isFragment=fragment;this.parentNode=null;this.listeners={}}
 set className(value){this._className=value;this.classList.replace(value)}get className(){return this._className}
 append(...nodes){for(const node of nodes){if(node?.isFragment){for(const child of node.children){child.parentNode=this;this.children.push(child)}}else{if(node&&typeof node==='object')node.parentNode=this;this.children.push(node)}}}
 prepend(...nodes){for(const node of [...nodes].reverse()){if(node&&typeof node==='object')node.parentNode=this;this.children.unshift(node)}}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(child=>child!==this);this.parentNode=null}
 replaceChildren(...nodes){this.children=[];this.append(...nodes)}
 setAttribute(name,value){this[name]=String(value)}
 addEventListener(type,callback){this.listeners[type]=callback}
 trigger(type){this.listeners[type]?.({type,target:this})}
 querySelectorAll(selector){const results=[];const visit=node=>{if(!node||typeof node!=='object')return;if(selector==='.social-card'&&node.classList?.contains('social-card'))results.push(node);node.children?.forEach(visit)};this.children.forEach(visit);return results}
}
async function render(moments){
 const rail=new FakeElement('div'),section=new FakeElement('section'),count=new FakeElement('span'),head=new FakeElement('p');
 section.querySelector=s=>({'.social-rail':rail,'.feed-controls':null,'[data-feed-count]':count,'.igor-live-head p':head,'[data-feed-filter].is-active':null})[s]??null;
 section.querySelectorAll=()=>[];
 const document={documentElement:{lang:'en'},querySelector:s=>s==='[data-social-first-home]'?section:null,createElement:t=>new FakeElement(t),createDocumentFragment:()=>new FakeElement('#fragment',{fragment:true}),createTextNode:t=>({textContent:t})};
 const socialData={moments,platforms:[]},masterData={records:[],counts:{projected_records:moments.length,public_urls:moments.length}};
 const fetch=async url=>({ok:true,json:async()=>String(url).includes('social-corpus')?socialData:String(url).includes('master-public-record')?masterData:manifest});
 vm.runInNewContext(runtime,{URL,console,document,fetch,Intl,location:{origin:'https://7ya.io'}},{filename:'social-first-home-20260916.js'});
 await new Promise(resolve=>setImmediate(resolve));
 return rail;
}
test('renders a canonical preview registered in the media manifest',async()=>{
 const record=corpus.moments.find(item=>item.id==='linkedin-starton-20260913');
 const indexed=manifest.social_previews.find(item=>item.id===record.id);
 assert.equal(indexed.image_url,record.image);
 const rail=await render([record]),card=rail.children[0],image=card.children.find(item=>item?.tagName==='img');
 assert.ok(image);assert.equal(image.src,record.image);assert.equal(image.loading,'lazy');assert.equal(image.decoding,'async');
 assert.match(image.alt,/LinkedIn publication/);assert.equal(card.dataset.mediaState,'source-media');
});
test('uses a registered source thumbnail when title and date metadata are missing',async()=>{
 const indexed=manifest.social_previews.find(item=>item.id==='linkedin-identity-20260911');
 const rail=await render([{id:indexed.id,platform:indexed.platform,url:indexed.source_url}]);
 const image=rail.children[0].children.find(item=>item?.tagName==='img');
 assert.ok(image);assert.equal(image.src,indexed.image_url);
});
test('rejects an unregistered preview URL and preserves a source frame',async()=>{
 const rail=await render([{id:'unknown-preview',platform:'LinkedIn',title:'Unknown source',url:'https://www.linkedin.com/feed/update/example',image:'https://cdn.example.test/unapproved.jpg'}]);
 const card=rail.children[0];
 assert.equal(card.children.some(item=>item?.tagName==='img'),false);
 assert.equal(card.children.some(item=>item?.className==='social-frame'),true);
 assert.equal(card.dataset.mediaState,'source-fallback');
});
test('falls back to a labeled source frame when an approved image fails',async()=>{
 const record=corpus.moments.find(item=>item.id==='youtube-story-20260421');
 const rail=await render([record]),card=rail.children[0],image=card.children.find(item=>item?.tagName==='img');
 assert.ok(image);image.trigger('error');
 assert.ok(card.children.some(item=>item?.className==='social-frame'));
 assert.equal(card.classList.contains('has-source-media'),false);
 assert.equal(card.dataset.mediaState,'source-fallback');
 assert.equal(card.href,record.url);
});
