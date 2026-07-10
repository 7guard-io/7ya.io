import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const files = ['index.html','museum/index.html','igor-vepretski/index.html','evidence/index.html','journey/index.html','starton/index.html','oracle/index.html','business/index.html','talk/index.html','contact/index.html','social/index.html','pass/index.html','radar/index.html','member-pass/index.html'];
let failures = 0;
const fail = m => { failures++; console.error(`FAIL ${m}`); };
const pass = m => console.log(`PASS ${m}`);
function extract(content) { const links=[]; const re=/\b(?:href|src)=["']([^"']+)["']/gi; let m; while((m=re.exec(content))) links.push(m[1].trim()); return links; }
function candidates(href) { const clean = href.split('#')[0].split('?')[0]; if (!clean || !clean.startsWith('/')) return []; const rel = clean.replace(/^\/+/,''); if (!rel) return [path.join(root,'index.html')]; if (rel.endsWith('/')) return [path.join(root, rel, 'index.html')]; if (path.extname(rel)) return [path.join(root, rel)]; return [path.join(root, rel), path.join(root, `${rel}.html`), path.join(root, rel, 'index.html')]; }
let internal = 0, external = 0;
for (const file of files) {
  const body = fs.readFileSync(path.join(root,file),'utf8');
  for (const href of extract(body)) {
    if (/^(https?:|mailto:|tel:|data:)/i.test(href)) { external++; continue; }
    const c = candidates(href); if (!c.length) continue; internal++;
    c.some(p => fs.existsSync(p)) ? pass(`${file} -> ${href}`) : fail(`${file} broken internal link: ${href}`);
  }
}
console.log(`\nLINK_AUDIT_INTERNAL_COUNT: ${internal}`); console.log(`LINK_AUDIT_EXTERNAL_COUNT: ${external}`);
if (failures) { console.error(`LINK_AUDIT: FAIL (${failures})`); process.exit(1); }
console.log('LINK_AUDIT: PASS');
