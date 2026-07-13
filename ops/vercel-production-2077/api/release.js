const RELEASE = '2026-07-14.8-canonical-runtime';
const routes = ['/', '/igor-vepretski/', '/talk/', '/social/', '/pass/', '/evidence/', '/starton/', '/contact/', '/radar/'];
module.exports = (_request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify({service:'7ya-frontend',provider:'vercel',status:'READY',release:RELEASE,source_repository:'7guard-io/7ya.io',source_path:'ops/vercel-production-2077',source_sha:null,bundle_id:RELEASE,provenance:'manual-reviewed-bundle',environment:process.env.VERCEL_ENV||'unknown',critical_routes:routes,crawl_controls:['/robots.txt','/sitemap.xml'],claim_policy:'evidence-status-required'}));
};
