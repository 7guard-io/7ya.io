import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const canonicalHost = 'https://7ya.io';

const requiredRootFiles = [
  'index.html',
  '404.html',
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'favicon.svg',
  'sw.js',
  'service-worker.js',
];

const requiredAssetDirectories = ['assets', 'styles'];
const optionalRootFiles = ['manifest.webmanifest', 'site.webmanifest', 'browserconfig.xml'];

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function copyRequired(relativePath) {
  const source = path.join(root, relativePath);
  const destination = path.join(output, relativePath);
  await fs.access(source);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true, force: true });
}

function extractPublicRoutes(sitemap) {
  const routes = [...sitemap.matchAll(/<loc>(https:\/\/7ya\.io(?:\/[^<]*)?)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .map((pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`));

  if (!routes.includes('/')) {
    throw new Error('sitemap.xml must include the canonical homepage');
  }

  return [...new Set(routes)].sort();
}

async function assertArtifact(routes) {
  const homepage = await fs.readFile(path.join(output, 'index.html'), 'utf8');
  const robots = await fs.readFile(path.join(output, 'robots.txt'), 'utf8');
  const sitemap = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8');
  const cname = (await fs.readFile(path.join(output, 'CNAME'), 'utf8')).trim();

  if (cname !== '7ya.io') throw new Error(`Unexpected CNAME: ${JSON.stringify(cname)}`);
  if (/noindex/i.test(homepage)) throw new Error('Homepage release artifact contains noindex');
  if (/http-equiv=["']refresh["']/i.test(homepage)) throw new Error('Homepage release artifact contains a meta refresh');
  if (/window\.location\.(?:replace|assign)|window\.location\s*=/i.test(homepage)) {
    throw new Error('Homepage release artifact contains a client-side redirect');
  }
  if (!homepage.includes('<link rel="canonical" href="https://7ya.io/">')) {
    throw new Error('Homepage canonical is not https://7ya.io/');
  }
  if (!robots.includes('Sitemap: https://7ya.io/sitemap.xml')) {
    throw new Error('robots.txt does not advertise the canonical sitemap');
  }
  if (!sitemap.includes('<loc>https://7ya.io/</loc>')) {
    throw new Error('sitemap.xml does not contain the canonical homepage');
  }

  for (const route of routes) {
    const relativeIndex = route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html');
    await fs.access(path.join(output, relativeIndex));
  }
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

const sitemapSource = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
const routes = extractPublicRoutes(sitemapSource);
const routeDirectories = [...new Set(routes.filter((route) => route !== '/').map((route) => route.split('/').filter(Boolean)[0]))];

for (const file of requiredRootFiles) await copyRequired(file);
for (const directory of requiredAssetDirectories) await copyRequired(directory);
for (const directory of routeDirectories) await copyRequired(directory);
for (const file of optionalRootFiles) {
  if (await exists(file)) await copyRequired(file);
}

await fs.writeFile(path.join(output, '.nojekyll'), '');
await fs.writeFile(
  path.join(output, 'release.json'),
  `${JSON.stringify({
    schema: '7ya.release.v1',
    commit: process.env.GITHUB_SHA || process.env.COMMIT_REF || 'local',
    canonicalHost,
    generatedAt: new Date().toISOString(),
    routes,
  }, null, 2)}\n`,
);

await assertArtifact(routes);

console.log(`RELEASE_ARTIFACT: PASS (${routes.length} public routes)`);
console.log(`Output: ${path.relative(root, output)}`);
