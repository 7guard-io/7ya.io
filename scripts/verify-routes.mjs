import http from 'node:http';
import https from 'node:https';
const baseUrl = (process.argv[2] || 'https://7ya.io').replace(/\/$/, '');
const routes = ['/', '/igor/', '/igor-vepretski/', '/journey/', '/starton/', '/influence/', '/evidence/', '/press/', '/speaker/', '/talk/', '/partners/', '/contact/', '/social/', '/pass/', '/radar/'];
function request(url) { return new Promise(resolve => { const lib = url.startsWith('https:') ? https : http; const req = lib.get(url, { timeout: 15000 }, res => { res.resume(); res.on('end', () => resolve({ url, statusCode: res.statusCode })); }); req.on('timeout', () => req.destroy(new Error('timeout'))); req.on('error', error => resolve({ url, error: error.message })); }); }
let failures = 0;
for (const route of routes) { const result = await request(`${baseUrl}${route}`); if (result.error) { failures++; console.error(`FAIL ${result.url} ${result.error}`); } else if (result.statusCode !== 200) { failures++; console.error(`FAIL ${result.url} HTTP ${result.statusCode}`); } else console.log(`PASS ${result.url} HTTP 200`); }
if (failures) { console.error(`\nROUTE_VERIFY: FAIL (${failures})`); process.exit(1); }
console.log('\nROUTE_VERIFY: PASS');
