const representedSourceSha = 'b579599b35258f4cfacf405150eb368367fbdc3f';

const criticalRoutes = [
  '/',
  '/igor-vepretski/',
  '/talk/',
  '/social/',
  '/pass/',
  '/evidence/',
  '/starton/',
  '/contact/',
  '/radar/',
];

module.exports = (_request, response) => {
  const sourceSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.SOURCE_SHA || representedSourceSha;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.statusCode = 200;
  response.end(JSON.stringify({
    service: '7ya-frontend',
    provider: 'vercel',
    source_repository: '7guard-io/7ya.io',
    source_path: 'ops/vercel-recovery',
    source_sha: sourceSha,
    environment: process.env.VERCEL_ENV || 'unknown',
    route_contract_version: '2026-07-14.1',
    critical_routes: criticalRoutes,
  }));
};
