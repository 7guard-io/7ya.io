import assert from 'node:assert/strict';
import fs from 'node:fs';

const controlPage = fs.readFileSync('control/index.html', 'utf8');
const controlRuntime = fs.readFileSync('scripts/7ya-control-layer-20260726.js', 'utf8');
const controlDashboard = fs.readFileSync('scripts/7ya-control-page-20260726.js', 'utf8');
const controlCss = fs.readFileSync('styles/7ya-control-layer-20260726.css', 'utf8');
const dashboardCss = fs.readFileSync('styles/7ya-control-page-20260726.css', 'utf8');
const manifest = JSON.parse(fs.readFileSync('site.webmanifest', 'utf8'));
const worker = fs.readFileSync('sw.js', 'utf8');
const build = fs.readFileSync('scripts/build-static-site.mjs', 'utf8');
const contract = fs.readFileSync('scripts/site-contract.mjs', 'utf8');

assert.match(controlPage, /<title>7YA Control \| מצב אתר, גרסה ותקינות<\/title>/);
assert.match(controlPage, /<meta name="robots" content="index,follow,max-image-preview:large">/);
assert.match(controlPage, /<link rel="canonical" href="https:\/\/7ya\.io\/control\/">/);
assert.match(controlPage, /id="refreshButton"/);
assert.match(controlPage, /id="routeGrid"/);
assert.match(controlPage, /id="downloadReportButton"/);
assert.doesNotMatch(controlPage, /OPENAI_API_KEY|GITHUB_TOKEN|VERCEL_TOKEN|password|secret/i);

for (const required of [
  "event.metaKey || event.ctrlKey",
  "event.key.toLowerCase() === 'k'",
  "navigator.serviceWorker.register('/sw.js'",
  "window.addEventListener('beforeinstallprompt'",
  "navigator.share",
  "navigator.clipboard.writeText",
  "fetch('/release.json'",
  "url: '/control/'",
]) assert.ok(controlRuntime.includes(required), `control runtime missing ${required}`);
assert.doesNotMatch(controlRuntime, /localStorage|sessionStorage|OPENAI_API_KEY|GITHUB_TOKEN|VERCEL_TOKEN/);

for (const required of [
  "fetchJson('/release.json')",
  "fetchJson('/api/health/')",
  'Promise.all(criticalRoutes.map',
  'diagnosticSnapshot()',
  'new Blob(',
]) assert.ok(controlDashboard.includes(required), `control dashboard missing ${required}`);
assert.doesNotMatch(controlDashboard, /document\.cookie|localStorage|sessionStorage|Authorization|Bearer /);

assert.equal(manifest.id, '/');
assert.equal(manifest.scope, '/');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.theme_color, '#080a0d');
assert.ok(Array.isArray(manifest.icons) && manifest.icons.some(icon => icon.src === '/assets/7ya-app-icon.svg'));
assert.ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.some(shortcut => shortcut.url === '/control/'));

assert.match(worker, /^const CACHE_VERSION = '7ya-shell-[a-z0-9-]+';/m);
for (const required of [
  "request.mode === 'navigate'",
  'networkFirst(request)',
  'staleWhileRevalidate(request)',
  "url.pathname === '/release.json'",
  "event.data?.type === 'CLEAR_7YA_CACHE'",
]) assert.ok(worker.includes(required), `service worker missing ${required}`);
assert.doesNotMatch(worker, /registration\.unregister\(\)/);

for (const required of [
  'site.webmanifest',
  '7ya-control-layer-20260726.css',
  '7ya-control-layer-20260726.js',
  'injectSharedAssets',
]) assert.ok(build.includes(required), `static build missing ${required}`);

for (const required of [
  "'control'",
  "'site.webmanifest'",
  "'7ya-control-layer-20260726.css'",
  "'7ya-control-layer-20260726.js'",
  "'control/index.html'",
]) assert.ok(contract.includes(required), `site contract missing ${required}`);

assert.ok(controlCss.length > 5000, 'command palette stylesheet is unexpectedly thin');
assert.ok(dashboardCss.length > 5000, 'Control dashboard stylesheet is unexpectedly thin');
assert.match(controlCss, /@media \(max-width: 760px\)/);
assert.match(controlCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(dashboardCss, /@media \(max-width: 680px\)/);

console.log('CONTROL_LAYER_GATE: PASS');
