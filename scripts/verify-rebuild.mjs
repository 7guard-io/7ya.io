import fs from 'node:fs';

let failures = 0;
const check = (condition, message) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${message}`);
  if (!condition) failures += 1;
};

const home = fs.readFileSync('index.html', 'utf8');
const page404 = fs.readFileSync('404.html', 'utf8');
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const robots = fs.readFileSync('robots.txt', 'utf8');
const workflow = fs.readFileSync('.github/workflows/pages.yml', 'utf8');

check(home.includes('<html lang="he" dir="rtl">'), 'homepage declares Hebrew RTL');
check(home.includes('<meta name="robots" content="index, follow'), 'homepage is indexable');
check(home.includes('<link rel="canonical" href="https://7ya.io/">'), 'homepage canonical is 7ya.io');
check(!home.includes('http-equiv="refresh"'), 'homepage has no meta redirect');
check(!home.includes('window.location.replace'), 'homepage has no JavaScript redirect');
check(!home.includes('noindex'), 'homepage has no noindex directive');
check(home.includes('/assets/igor-home-portrait-20260712.webp'), 'homepage uses repository portrait');
check(home.includes('/styles/site-20260713.css?v=1'), 'homepage uses rebuilt design system');
check(home.includes('/scripts/site-20260713.js?v=1'), 'homepage uses rebuilt interaction layer');

for (const route of ['journey', 'starton', 'evidence', 'talk', 'contact']) {
  check(home.includes(`/${route}/`), `homepage links to /${route}/`);
  check(sitemap.includes(`https://7ya.io/${route}/`), `sitemap includes /${route}/`);
}

for (const phrase of ['5.1B+', 'Knesset Candidate', 'Microsoft-backed', 'official partner']) {
  check(!home.includes(phrase), `homepage excludes unsupported claim: ${phrase}`);
}

check(page404.includes('noindex, follow'), '404 is excluded from search but preserves crawling');
check(robots.includes('Allow: /'), 'robots allows public crawling');
check(robots.includes('Sitemap: https://7ya.io/sitemap.xml'), 'robots references canonical sitemap');
check(workflow.includes('node scripts/build-pages-site.mjs'), 'Pages workflow builds the full allowlisted site');
check(workflow.includes('path: dist'), 'Pages workflow deploys dist');
check(!workflow.includes('Assemble redirect artifact'), 'legacy redirect artifact is removed');

if (failures) {
  console.error(`REBUILD_VERIFICATION: FAIL (${failures})`);
  process.exit(1);
}
console.log('REBUILD_VERIFICATION: PASS');
