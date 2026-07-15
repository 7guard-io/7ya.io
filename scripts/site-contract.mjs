export const canonicalRoutes = [
  '',
  'museum',
  'create',
  'history',
  'igor-vepretski',
  'journey',
  'starton',
  'influence',
  'evidence',
  '7ya',
  'speaker',
  'talk',
  'media',
  'articles',
  'contact',
  'delta-audit',
];

export const aliasRoutes = new Map([
  ['about', '/igor-vepretski/'],
  ['social', '/influence/'],
  ['oracle', '/evidence/'],
  ['business', '/7ya/'],
  ['pass', '/7ya/'],
  ['member-pass', '/7ya/'],
  ['radar', '/evidence/'],
  ['work', '/#tracklist'],
  ['systems', '/7ya/'],
  ['public-service', '/journey/'],
  ['music', '/influence/'],
]);

export const publicRouteDirectories = [
  ...new Set([
    ...canonicalRoutes.filter(Boolean),
    ...aliasRoutes.keys(),
    'legacy',
  ]),
].sort();

export const publicRootFiles = [
  '.nojekyll',
  '404.html',
  'CNAME',
  'favicon.svg',
  'index.html',
  'release.json',
  'robots.txt',
  'service-worker.js',
  'sitemap.xml',
  'sw.js',
];

export const publicDataDirectories = ['assets', 'knowledge'];

export const publicStyleFiles = [
  'creatorverse-20260714.css',
  'creatorverse-depth-20260714.css',
  'history-song-20260714.css',
  'igor-embodiment-20260714.css',
  'igor-personal-20260713.css',
  'igor-rich-media-20260714.css',
  'influence-wall-20260714.css',
  'legacy-universe-20260714.css',
  'layout.css',
  'positive-creator-20260715.css',
  'public-content-museum-20260715.css',
];

export const publicScriptFiles = [
  'creatorverse-20260714.js',
  'history-song-20260714.js',
  'legacy-universe-20260714.js',
  'positive-creator-20260715.js',
  'public-content-museum-20260715.js',
];

export const criticalArtifactPaths = [
  'index.html',
  'museum/index.html',
  'create/index.html',
  'history/index.html',
  '7ya/index.html',
  'styles/history-song-20260714.css',
  'styles/public-content-museum-20260715.css',
  'styles/positive-creator-20260715.css',
  'scripts/history-song-20260714.js',
  'scripts/public-content-museum-20260715.js',
  'scripts/positive-creator-20260715.js',
  'knowledge/history-song-records-5.json',
  'robots.txt',
  'sitemap.xml',
  'release.json',
];

export const forbiddenArtifactEntries = [
  '.git',
  '.github',
  '.vercel',
  'admin',
  'api',
  'docs',
  'netlify',
  'node_modules',
  'ops',
  'package.json',
  'packages',
  'scripts/check-site.mjs',
];
