'use strict';

const SOURCE_REPOSITORY = '7guard-io/7ya.io';
const SOURCE_SHA = 'f1946e1eca880f82dc766965bbc5f5ea27eeb27b';
const RAW_BASE = `https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${SOURCE_SHA}/`;

const CANONICAL_ALIASES = new Map([
  ['about', '/igor-vepretski/'],
  ['social', '/influence/'],
  ['oracle', '/evidence/'],
  ['business', '/7ya/'],
  ['pass', '/7ya/'],
  ['member-pass', '/7ya/'],
  ['radar', '/evidence/'],
  ['work', '/#creations'],
  ['systems', '/7ya/'],
  ['public-service', '/journey/'],
  ['music', '/influence/'],
]);

const MIME_TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  mjs: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  ico: 'image/x-icon',
  woff: 'font/woff',
  woff2: 'font/woff2',
  webmanifest: 'application/manifest+json; charset=utf-8',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
};

const IMMUTABLE_ASSET_TYPES = new Set([
  'css', 'js', 'mjs', 'svg', 'png', 'jpg', 'jpeg', 'webp', 'gif',
  'ico', 'woff', 'woff2', 'mp3', 'mp4',
]);

function extension(file) {
  const index = file.lastIndexOf('.');
  return index < 0 ? '' : file.slice(index + 1).toLowerCase();
}

function requestPath(request) {
  let requestUrl;
  try {
    requestUrl = new URL(request.url || '/', 'https://7ya.invalid');
  } catch {
    return null;
  }

  const rawValue = requestUrl.searchParams.get('path') || '';
  const raw = rawValue.replace(/\\/g, '/').replace(/^\/+/, '');
  const segments = raw.split('/').filter(Boolean);

  if (segments.some(segment => segment === '.' || segment === '..' || segment.includes('\0'))) {
    return null;
  }

  return { raw, normalized: segments.join('/') };
}

function resolveSourcePath(pathInfo) {
  if (!pathInfo) return null;
  const { raw, normalized } = pathInfo;
  if (!normalized) return 'index.html';
  if (raw.endsWith('/')) return `${normalized}/index.html`;
  return extension(normalized) ? normalized : `${normalized}/index.html`;
}

function canonicalAlias(pathInfo) {
  if (!pathInfo) return null;
  const key = pathInfo.normalized.replace(/\/+$/, '');
  return CANONICAL_ALIASES.get(key) || null;
}

function setBaseHeaders(response) {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('X-7YA-Source-Repository', SOURCE_REPOSITORY);
  response.setHeader('X-7YA-Source-SHA', SOURCE_SHA);
}

function setResponseHeaders(response, file, statusCode) {
  const type = extension(file);
  const isHtml = type === 'html';

  response.statusCode = statusCode;
  response.setHeader('Content-Type', MIME_TYPES[type] || 'application/octet-stream');
  setBaseHeaders(response);
  response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('X-7YA-Source-Path', file);

  if (isHtml) {
    response.setHeader('X-Robots-Tag', 'index, follow');
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  } else if (IMMUTABLE_ASSET_TYPES.has(type)) {
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  }
}

function sendRedirect(request, response, destination) {
  response.statusCode = 308;
  setBaseHeaders(response);
  response.setHeader('Location', destination);
  response.setHeader('X-Robots-Tag', 'noindex, follow');
  response.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (request.method === 'HEAD') response.end();
  else response.end(`Permanent Redirect: ${destination}`);
}

async function fetchSource(file) {
  return fetch(`${RAW_BASE}${file}`, {
    headers: {
      'User-Agent': '7ya-canonical-recovery/1.2',
      Accept: '*/*',
    },
  });
}

module.exports = async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end();
    return;
  }

  const pathInfo = requestPath(request);
  if (!pathInfo) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ error: 'Invalid path' }));
    return;
  }

  const alias = canonicalAlias(pathInfo);
  if (alias) {
    sendRedirect(request, response, alias);
    return;
  }

  const requestedFile = resolveSourcePath(pathInfo);

  try {
    let upstream = await fetchSource(requestedFile);
    let servedFile = requestedFile;
    let statusCode = upstream.status;

    if (upstream.status === 404 && extension(requestedFile) === 'html') {
      upstream = await fetchSource('404.html');
      servedFile = '404.html';
      statusCode = 404;
    }

    if (!upstream.ok && statusCode !== 404) {
      throw new Error(`Canonical source returned ${upstream.status} for ${requestedFile}`);
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    setResponseHeaders(response, servedFile, statusCode);
    response.setHeader('Content-Length', String(body.length));

    if (request.method === 'HEAD') response.end();
    else response.end(body);
  } catch (error) {
    console.error('7YA canonical proxy failure', error?.message || error);
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.end(JSON.stringify({
      error: 'Canonical source temporarily unavailable',
      source_repository: SOURCE_REPOSITORY,
      source_sha: SOURCE_SHA,
    }));
  }
};
