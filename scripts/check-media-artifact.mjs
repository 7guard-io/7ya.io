import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dist=path.join(process.cwd(),'dist');
const manifestFile=path.join(dist,'knowledge/personal-media-manifest-20261127.json');
assert.ok(fs.existsSync(manifestFile),'built artifact must package the personal-media manifest');
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
for(const record of manifest.records.filter(item=>item.asset_path)){
 const file=path.join(dist,record.asset_path);
 assert.ok(fs.existsSync(file),'missing packaged image '+record.asset_path);
 const data=fs.readFileSync(file);
 assert.equal(data.toString('ascii',8,12),'WEBP',record.asset_path+' must be a WebP image');
}
for(const [locale,file] of [['he','index.html'],['en','en/index.html'],['ru','ru/index.html'],['ar','ar/index.html']]){
 const html=fs.readFileSync(path.join(dist,file),'utf8');
 assert.match(html,/youtube-nocookie\\.com\\/embed\\/fxFAUrb1h0M/,locale+' first-person embed is missing');
 const start=html.indexOf('<section class="personal-moments"'),end=html.indexOf('</section>',start);
 assert.ok(start>=0&&end>start,locale+' personal-moments section missing');
 assert.equal((html.slice(start,end).match(/data-media-id="home-/g)||[]).length,7,locale+' must package seven image-backed moments');
}
console.log('MEDIA_ARTIFACT: PASS — media manifest, local images and four locale home builds');
