#!/usr/bin/env node
import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const MAX_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;

function args(argv) {
  const parsed = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[index + 1];
    parsed[key] = value && !value.startsWith('--') ? argv[++index] : true;
  }
  return parsed;
}

function normalizeUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http(s) targets are allowed');
  if (url.username || url.password) throw new Error('Target credentials are not allowed');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only standard web ports are allowed');
  url.hash = '';
  return url.toString();
}

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || a >= 224;
  }
  if (net.isIPv6(address)) {
    const value = address.toLowerCase();
    return value === '::1' || value === '::' || value.startsWith('fc') || value.startsWith('fd') ||
      value.startsWith('fe8') || value.startsWith('fe9') || value.startsWith('fea') || value.startsWith('feb') ||
      value.startsWith('::ffff:127.') || value.startsWith('::ffff:10.') || value.startsWith('::ffff:192.168.');
  }
  return true;
}

async function assertPublicTarget(target) {
  const url = new URL(target);
  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('Local or internal targets are not allowed');
  }
  if (net.isIP(hostname) && isPrivateAddress(hostname)) throw new Error('Private network targets are not allowed');
  const resolved = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!resolved.length || resolved.some(item => isPrivateAddress(item.address))) {
    throw new Error('Target resolves to a private or invalid network address');
  }
}

function decodeEntities(value = '') {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return '';
}

function meta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return firstMatch(html, [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i'),
  ]);
}

function jsonLd(html) {
  const values = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      values.push(JSON.parse(match[1].trim()));
    } catch {
      values.push({ parse_status: 'invalid-json-ld' });
    }
    if (values.length >= 20) break;
  }
  return values;
}

function visibleText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).slice(0, 12_000);
}

async function fetchHtml(target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': '7YA-Digital-Museum-Collector/1.0 (+https://7ya.io/evidence/)',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html') && !type.includes('application/xhtml+xml')) {
      throw new Error(`Unsupported content type: ${type || 'unknown'}`);
    }
    const declared = Number(response.headers.get('content-length') || 0);
    if (declared > MAX_BYTES) throw new Error(`Response exceeds ${MAX_BYTES} bytes`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_BYTES) throw new Error(`Response exceeds ${MAX_BYTES} bytes`);
    return {
      html: buffer.toString('utf8'),
      finalUrl: response.url,
      status: response.status,
      contentType: type,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function collect(target) {
  const normalizedTarget = normalizeUrl(target);
  await assertPublicTarget(normalizedTarget);
  const fetched = await fetchHtml(normalizedTarget);
  const title = firstMatch(fetched.html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const canonical = firstMatch(fetched.html, [/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i]);
  const record = {
    schema_version: 1,
    target: normalizedTarget,
    final_url: fetched.finalUrl,
    http_status: fetched.status,
    content_type: fetched.contentType,
    title,
    description: meta(fetched.html, 'description') || meta(fetched.html, 'og:description'),
    canonical_url: canonical || meta(fetched.html, 'og:url') || fetched.finalUrl,
    open_graph: {
      title: meta(fetched.html, 'og:title'),
      description: meta(fetched.html, 'og:description'),
      image: meta(fetched.html, 'og:image'),
      type: meta(fetched.html, 'og:type'),
    },
    schema_org: jsonLd(fetched.html),
    text_excerpt: visibleText(fetched.html),
  };
  const canonicalBody = JSON.stringify(record);
  return {
    ...record,
    content_sha256: crypto.createHash('sha256').update(canonicalBody).digest('hex'),
  };
}

async function readTargets(options) {
  if (typeof options.target === 'string') return [normalizeUrl(options.target)];
  const configPath = options.config || 'data/collector-targets.json';
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const targets = (config.targets || [])
    .filter(item => item && item.enabled !== false && typeof item.url === 'string')
    .map(item => normalizeUrl(item.url));
  if (!targets.length) throw new Error('No enabled collector targets');
  return [...new Set(targets)];
}

async function writeIfChanged(outputPath, payload) {
  let previous;
  try {
    previous = JSON.parse(await fs.readFile(outputPath, 'utf8'));
  } catch {
    previous = null;
  }

  const previousHashes = (previous?.records || []).map(item => item.content_sha256).sort();
  const nextHashes = payload.records.map(item => item.content_sha256).sort();
  if (JSON.stringify(previousHashes) === JSON.stringify(nextHashes)) {
    console.log(`COLLECTOR_NO_CHANGE: ${outputPath}`);
    return false;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`COLLECTOR_UPDATED: ${outputPath} (${payload.records.length} records)`);
  return true;
}

const options = args(process.argv);
const outputPath = options.out || 'data/archives/latest_collection.json';
const targets = await readTargets(options);
const records = [];
for (const target of targets) records.push(await collect(target));
await writeIfChanged(outputPath, {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  policy: 'Public metadata only. Collection is not publication approval and does not prove partnership, reach, impact, or endorsement.',
  records,
});
