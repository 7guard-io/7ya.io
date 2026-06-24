import https from 'node:https';

const baseUrl = (process.argv[2] || 'https://7ya.io').replace(/\/$/, '');

const routes = [
  '/',
  '/member-pass/',
  '/member/igor-vepretski/',
  '/talk/',
  '/social/',
  '/labs/visual-ai/',
  '/labs/visual-ai/evidence-card.html',
  '/docs/my-links.md'
];

function request(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ url, statusCode: res.statusCode, body }));
    });
    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', error => resolve({ url, error: error.message }));
  });
}

let failures = 0;

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  const result = await request(url);
  if (result.error) {
    failures += 1;
    console.error(`FAIL ${url} ${result.error}`);
    continue;
  }
  if (result.statusCode < 200 || result.statusCode >= 400) {
    failures += 1;
    console.error(`FAIL ${url} HTTP ${result.statusCode}`);
    continue;
  }
  console.log(`PASS ${url} HTTP ${result.statusCode}`);
}

if (failures > 0) {
  console.error(`\nROUTE_VERIFY: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nROUTE_VERIFY: PASS');
