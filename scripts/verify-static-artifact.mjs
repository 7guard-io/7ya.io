import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { aliasRoutes, canonicalRoutes, criticalArtifactPaths } from './site-contract.mjs';

const root = path.join(process.cwd(), 'dist');
const mime = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function routeFile(pathname) {
  if (pathname === '/') return 'index.html';
  const clean = pathname.replace(/^\/+/, '');
  return pathname.endsWith('/') ? `${clean}index.html` : clean;
}

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (pathname.includes('..')) throw new Error('invalid path');
    const relative = routeFile(pathname);
    const absolute = path.join(root, relative);
    const body = await fs.readFile(absolute);
    response.statusCode = 200;
    response.setHeader('Content-Type', mime.get(path.extname(relative)) || 'application/octet-stream');
    response.end(body);
  } catch {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(await fs.readFile(path.join(root, '404.html')));
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const failures = [];
const fail = message => failures.push(message);

try {
  for (const route of canonicalRoutes) {
    const pathname = `/${route ? `${route}/` : ''}`;
    const response = await fetch(`${base}${pathname}`);
    const body = await response.text();
    const canonical = `https://7ya.io${pathname}`;
    if (response.status !== 200) fail(`${pathname} returned ${response.status}`);
    if (!body.includes('<meta name="viewport"')) fail(`${pathname} missing viewport`);
    if (!body.includes(`<link rel="canonical" href="${canonical}"`)) fail(`${pathname} canonical mismatch`);
    if (/noindex/i.test(body)) fail(`${pathname} is not indexable`);
  }

  for (const [route, target] of aliasRoutes) {
    const pathname = `/${route}/`;
    const response = await fetch(`${base}${pathname}`);
    const body = await response.text();
    if (response.status !== 200) fail(`${pathname} returned ${response.status}`);
    if (!body.includes('noindex')) fail(`${pathname} alias is indexable`);
    if (!body.includes(`https://7ya.io${target}`)) fail(`${pathname} alias canonical mismatch`);
  }

  for (const relative of criticalArtifactPaths.filter(file => !file.endsWith('index.html'))) {
    const response = await fetch(`${base}/${relative}`);
    if (response.status !== 200) fail(`/${relative} returned ${response.status}`);
  }

  for (const pathname of ['/admin/', '/api/guide', '/definitely-missing-7ya-gate/']) {
    const response = await fetch(`${base}${pathname}`);
    if (response.status !== 404) fail(`${pathname} should fail closed with 404, got ${response.status}`);
  }
} finally {
  await new Promise(resolve => server.close(resolve));
}

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`STATIC_ARTIFACT_ROUTES: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`STATIC_ARTIFACT_ROUTES: PASS (${canonicalRoutes.length} canonical, ${aliasRoutes.size} aliases, admin/API fail closed)`);
