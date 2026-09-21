import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const locales = ['en','ru','ar'];
const routes = ['contact','influence','talk'];
const allowedHebrew = new Set(['איגור ופרצקי','עברית']);

const strip = html => {
  const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || [,''])[1];
  return body
    .replace(/<(script|style|template|svg)\b[\s\S]*?<\/\1>/gi,'')
    .replace(/<[^>]+>/g,'\n')
    .split(/\n+/)
    .map(x=>x.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim())
    .filter(Boolean);
};

async function htmlFiles(directory) {
  const entries=await fs.readdir(directory,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory())files.push(...await htmlFiles(absolute));
    else if(entry.isFile()&&entry.name.endsWith('.html'))files.push(absolute);
  }
  return files;
}

const failures=[];
for (const locale of locales) {
  for (const route of routes) {
    const file=path.join(dist,locale,route,'index.html');
    const html=await fs.readFile(file,'utf8');
    const leaked=[...new Set(strip(html).filter(text=>/[\u0590-\u05ff]/u.test(text)&&!allowedHebrew.has(text)))];
    const attrValues=[...html.matchAll(/\b(?:aria-label|title|placeholder|alt)=(["'])(.*?)\1/gi)].map(match=>match[2].trim());
    const leakedAttrs=[...new Set(attrValues.filter(text=>/[\u0590-\u05ff]/u.test(text)&&!allowedHebrew.has(text)))];
    if(leaked.length) failures.push(`${locale}/${route}: Hebrew leakage -> ${leaked.slice(0,12).join(' | ')}`);
    if(leakedAttrs.length) failures.push(`${locale}/${route}: Hebrew accessibility attribute leakage -> ${leakedAttrs.slice(0,12).join(' | ')}`);
  }
}

for (const locale of locales) {
  const root=path.join(dist,locale);
  for (const file of await htmlFiles(root)) {
    const html=await fs.readFile(file,'utf8');
    const markupOnly=html.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi,'');
    const attrValues=[...markupOnly.matchAll(/\b(?:aria-label|title|placeholder|alt)=(["'])(.*?)\1/gi)].map(match=>match[2].trim());
    const leaked=[...new Set(attrValues.filter(text=>/[\u0590-\u05ff]/u.test(text)&&text!=='עברית'))];
    if(leaked.length){
      const relative=path.relative(dist,file).split(path.sep).join('/');
      failures.push(`${relative}: Hebrew accessibility attribute leakage -> ${leaked.slice(0,12).join(' | ')}`);
    }
  }
}

const now = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'
}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
const buildDate=`${now.day}.${now.month}.${now.year}`;
const labels={he:'עכשיו',en:'NOW',ru:'СЕЙЧАС',ar:'الآن'};
for (const locale of ['he',...locales]) {
  const file=locale==='he'?path.join(dist,'index.html'):path.join(dist,locale,'index.html');
  const html=await fs.readFile(file,'utf8');
  if(html.includes('BUILD_DATE')) failures.push(`${locale}: BUILD_DATE leaked into homepage`);
  if(!html.includes(`${labels[locale]} / ${buildDate}`)) failures.push(`${locale}: homepage freshness marker is not ${buildDate}`);
}

const redirects=await fs.readFile(path.join(dist,'_redirects'),'utf8');
if(!/^\/feed\s+\/influence\/\s+301$/m.test(redirects) || !/^\/feed\/\s+\/influence\/\s+301$/m.test(redirects)) {
  failures.push('legacy /feed redirect is missing');
}


const widget=await fs.readFile(path.join(dist,'scripts','7ya-signal-key-20260715.js'),'utf8');
for(const required of ['Speak with Igor','ПОГОВОРИТЬ С ИГОРЕМ','تحدّث مع إيغور',"fetch('/api/guide'","experience: 'speak-with-igor'"]){
  if(!widget.includes(required)) failures.push(`Speak with Igor contract missing: ${required}`);
}

if(failures.length){
  for(const failure of failures) console.error('LOCALE_ACCEPTANCE_FAIL:',failure);
  throw new Error(`Locale/route acceptance failed with ${failures.length} issue(s)`);
}
console.log('LOCALE_ROUTE_ACCEPTANCE: PASS (freshness · EN/RU/AR · /feed redirect · Speak with Igor contract)');
,'m').test(redirects)) {
    failures.push(`Speak with Igor redirect missing: ${from} -> ${to}`);
  }
}

const widget=await fs.readFile(path.join(dist,'scripts','7ya-signal-key-20260715.js'),'utf8');
for(const required of ['Speak with Igor','ПОГОВОРИТЬ С ИГОРЕМ','تحدّث مع إيغور',"fetch('/api/guide'","experience: 'speak-with-igor'"]){
  if(!widget.includes(required)) failures.push(`Speak with Igor contract missing: ${required}`);
}

if(failures.length){
  for(const failure of failures) console.error('LOCALE_ACCEPTANCE_FAIL:',failure);
  throw new Error(`Locale/route acceptance failed with ${failures.length} issue(s)`);
}
console.log('LOCALE_ROUTE_ACCEPTANCE: PASS (freshness · EN/RU/AR · /feed redirect · Speak with Igor contract)');
