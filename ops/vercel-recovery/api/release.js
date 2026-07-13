const sourceSha = '2c65a181a666b6fad7f0d431877c2154b7bfd3b5';
const routes = [
  '/',
  '/igor-vepretski/',
  '/journey/',
  '/starton/',
  '/evidence/',
  '/influence/',
  '/speaker/',
  '/talk/',
  '/social/',
  '/pass/',
  '/radar/',
  '/contact/',
];

module.exports = (_request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.statusCode = 200;
  response.end(JSON.stringify({
    service: '7ya-frontend',
    provider: 'vercel',
    source_repository: '7guard-io/7ya.io',
    source_path: 'ops/vercel-recovery',
    source_sha: sourceSha,
    release: '2026-07-14.2',
    critical_routes: routes,
  }));
};
