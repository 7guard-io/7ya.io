(() => {
  'use strict';

  const criticalRoutes = [
    ['/', 'Homepage'],
    ['/igor-vepretski/', 'Igor'],
    ['/journey/', 'Journey'],
    ['/starton/', 'StartOn'],
    ['/influence/', 'Influence'],
    ['/evidence/', 'Evidence'],
    ['/speaker/', 'Speaker'],
    ['/contact/', 'Contact'],
    ['/api/health/', 'Health API'],
  ];

  const report = {
    generated_at: new Date().toISOString(),
    page: window.location.href,
    user_agent: navigator.userAgent,
    online: navigator.onLine,
    service_worker: 'serviceWorker' in navigator,
    standalone: window.matchMedia('(display-mode: standalone)').matches,
    release: null,
    health: null,
    routes: [],
  };

  const $ = selector => document.querySelector(selector);

  function log(message, data) {
    const node = $('#opsLog');
    if (!node) return;
    const stamp = new Date().toLocaleTimeString('he-IL', { hour12: false });
    const suffix = data === undefined ? '' : `\n${JSON.stringify(data, null, 2)}`;
    node.textContent += `[${stamp}] ${message}${suffix}\n`;
    node.scrollTop = node.scrollHeight;
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }

  function setChip(selector, state, label) {
    const node = $(selector);
    if (!node) return;
    node.classList.remove('ready', 'fail');
    if (state) node.classList.add(state);
    if (label) node.textContent = label;
  }

  async function fetchJson(url) {
    const started = performance.now();
    const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
    const elapsed = Math.round(performance.now() - started);
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return { data: await response.json(), elapsed };
  }

  async function loadRelease() {
    try {
      const { data, elapsed } = await fetchJson('/release.json');
      report.release = data;
      setText('#releaseName', data.release || 'unknown');
      setText('#releaseProvider', data.provider || 'unknown');
      setText('#releaseSha', String(data.source_sha || 'unknown').slice(0, 12));
      setText('#releaseLatency', `${elapsed} ms`);
      setChip('#releaseChip', data.status === 'READY' ? 'ready' : '', `${data.status || 'UNKNOWN'} · RELEASE`);
      log('Release manifest loaded', { release: data.release, status: data.status, elapsed_ms: elapsed });
    } catch (error) {
      setChip('#releaseChip', 'fail', 'RELEASE ERROR');
      setText('#releaseName', 'לא זמין');
      log('Release manifest failed', { error: error.message });
    }
  }

  async function loadHealth() {
    try {
      const { data, elapsed } = await fetchJson('/api/health/');
      report.health = data;
      setText('#healthValue', data.status || data.ok || 'responding');
      setText('#healthLatency', `${elapsed} ms`);
      setChip('#healthChip', 'ready', 'HEALTH · ONLINE');
      log('Health endpoint responding', { elapsed_ms: elapsed, payload: data });
    } catch (error) {
      setChip('#healthChip', 'fail', 'HEALTH · ERROR');
      setText('#healthValue', 'שגיאה');
      log('Health endpoint failed', { error: error.message });
    }
  }

  async function checkRoute(path, label) {
    const row = document.querySelector(`[data-route="${CSS.escape(path)}"]`);
    const state = row?.querySelector('.route-state');
    const started = performance.now();
    try {
      const response = await fetch(path, { method: 'GET', cache: 'no-store', headers: { 'X-7YA-Diagnostic': 'route-check' } });
      const elapsed = Math.round(performance.now() - started);
      const ok = response.ok;
      state?.classList.add(ok ? 'ready' : 'fail');
      row?.querySelector('small')?.replaceChildren(document.createTextNode(`${response.status} · ${elapsed} ms · ${path}`));
      report.routes.push({ path, label, status: response.status, ok, elapsed_ms: elapsed });
      return ok;
    } catch (error) {
      const elapsed = Math.round(performance.now() - started);
      state?.classList.add('fail');
      row?.querySelector('small')?.replaceChildren(document.createTextNode(`ERROR · ${elapsed} ms · ${path}`));
      report.routes.push({ path, label, status: 0, ok: false, elapsed_ms: elapsed, error: error.message });
      return false;
    }
  }

  async function checkRoutes() {
    report.routes = [];
    document.querySelectorAll('.route-state').forEach(node => node.classList.remove('ready', 'fail'));
    log('Starting route verification');
    const results = await Promise.all(criticalRoutes.map(([path, label]) => checkRoute(path, label)));
    const passed = results.filter(Boolean).length;
    setText('#routeValue', `${passed}/${results.length}`);
    setChip('#routesChip', passed === results.length ? 'ready' : 'fail', `${passed}/${results.length} ROUTES`);
    log('Route verification complete', { passed, total: results.length });
    report.generated_at = new Date().toISOString();
  }

  async function inspectServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      setText('#swValue', 'לא נתמך');
      setChip('#swChip', 'fail', 'PWA · UNSUPPORTED');
      return;
    }
    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      const active = Boolean(registration?.active || navigator.serviceWorker.controller);
      setText('#swValue', active ? 'פעיל' : 'ממתין');
      setText('#swScope', registration?.scope || 'scope pending');
      setChip('#swChip', active ? 'ready' : '', active ? 'PWA · ACTIVE' : 'PWA · READY');
      report.service_worker_registration = registration ? { scope: registration.scope, active } : null;
      log('Service worker inspected', report.service_worker_registration);
    } catch (error) {
      setText('#swValue', 'שגיאה');
      setChip('#swChip', 'fail', 'PWA · ERROR');
      log('Service worker inspection failed', { error: error.message });
    }
  }

  function buildRouteGrid() {
    const grid = $('#routeGrid');
    criticalRoutes.forEach(([path, label]) => {
      const link = document.createElement('a');
      link.className = 'route-row';
      link.href = path;
      link.dataset.route = path;
      link.innerHTML = `<span><b>${label}</b><small>PENDING · ${path}</small></span><i class="route-state" aria-label="ממתין לבדיקה"></i>`;
      grid.append(link);
    });
  }

  function diagnosticSnapshot() {
    return {
      ...report,
      generated_at: new Date().toISOString(),
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
      connection: navigator.connection ? {
        effective_type: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        save_data: navigator.connection.saveData,
      } : null,
      storage: navigator.storage ? 'available' : 'unavailable',
    };
  }

  function downloadReport() {
    const snapshot = diagnosticSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `7ya-diagnostic-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    log('Diagnostic report exported');
  }

  async function copyReport() {
    const text = JSON.stringify(diagnosticSnapshot(), null, 2);
    try {
      await navigator.clipboard.writeText(text);
      log('Diagnostic report copied to clipboard');
    } catch {
      window.prompt('העתקת דוח', text);
    }
  }

  async function refreshAll() {
    $('#opsLog').textContent = '';
    await Promise.all([loadRelease(), loadHealth(), inspectServiceWorker()]);
    await checkRoutes();
  }

  function bind() {
    $('#refreshButton')?.addEventListener('click', refreshAll);
    $('#checkRoutesButton')?.addEventListener('click', checkRoutes);
    $('#downloadReportButton')?.addEventListener('click', downloadReport);
    $('#copyReportButton')?.addEventListener('click', copyReport);
    window.addEventListener('online', () => setChip('#networkChip', 'ready', 'NETWORK · ONLINE'));
    window.addEventListener('offline', () => setChip('#networkChip', 'fail', 'NETWORK · OFFLINE'));
  }

  function init() {
    setChip('#networkChip', navigator.onLine ? 'ready' : 'fail', navigator.onLine ? 'NETWORK · ONLINE' : 'NETWORK · OFFLINE');
    buildRouteGrid();
    bind();
    refreshAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
