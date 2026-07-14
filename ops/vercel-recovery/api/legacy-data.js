const SOURCE = 'https://raw.githubusercontent.com/7guard-io/7ya.io/main/knowledge/igor-vepretski-legacy.json';

module.exports = async (_request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const upstream = await fetch(SOURCE, { headers: { Accept: 'application/json' } });
    if (!upstream.ok) throw new Error(`UPSTREAM_${upstream.status}`);
    const body = await upstream.text();
    JSON.parse(body);
    response.statusCode = 200;
    response.end(body);
  } catch (error) {
    response.statusCode = 503;
    response.end(JSON.stringify({ status: 'LEGACY_DATA_UNAVAILABLE', error: String(error.message || error) }));
  }
};
