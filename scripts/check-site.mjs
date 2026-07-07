import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const routes = ['','igor-vepretski','talk','social','pass','evidence','starton','contact','radar'];
let failures = 0;
const fail = m => { failures++; console.error(`FAIL ${m}`); };
const pass = m => console.log(`PASS ${m}`);
function read(file){ const p=path.join(root,file); if(!fs.existsSync(p)){ fail(`${file} missing`); return ''; } pass(`${file} exists`); return fs.readFileSync(p,'utf8'); }
for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;
  for (const snippet of ['<!doctype html>','<meta name="viewport"','<title>','<meta name="description"','<meta name="robots" content="index, follow"',`<link rel="canonical" href="${url}"`]) {
    html.includes(snippet) ? pass(`${file} includes ${snippet}`) : fail(`${file} missing ${snippet}`);
  }
  if (html.includes('noindex')) fail(`${file} contains noindex`);
}
const home = read('index.html');
for (const text of ['Igor Vepretski is the public identity','7YA is the media, systems, evidence, and digital hub','StartOn is presented here as the social-impact lane','Talk is the entry point']) {
  home.includes(text) ? pass(`homepage includes ${text}`) : fail(`homepage missing ${text}`);
}
const sitemap = read('sitemap.xml');
for (const route of routes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  sitemap.includes(loc) ? pass(`sitemap includes ${loc}`) : fail(`sitemap missing ${loc}`);
}
const robots = read('robots.txt');
for (const s of ['User-agent: *','Allow: /','Sitemap: https://7ya.io/sitemap.xml']) robots.includes(s) ? pass(`robots includes ${s}`) : fail(`robots missing ${s}`);
for (const file of ['index.html','igor-vepretski/index.html','talk/index.html','social/index.html','pass/index.html','evidence/index.html','starton/index.html','contact/index.html','radar/index.html']) {
  const body = read(file);
  for (const bad of ['5.1B+','10,000+','Knesset Candidate','Microsoft-backed','candidate for Knesset','verified leader','official partner']) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}
if (failures) { console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`); process.exit(1); }
console.log('\nSITE_PROCESS_HEALTH: PASS');
