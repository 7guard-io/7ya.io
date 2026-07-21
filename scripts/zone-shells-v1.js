const shell = document.querySelector('[data-zone-shell]');

const stableStringify = value => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const sha256 = async value => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const setText = (selector, value) => {
  const node = shell?.querySelector(selector);
  if (node && typeof value === 'string') node.textContent = value;
};

const renderItems = items => {
  const container = shell?.querySelector('[data-zone-items]');
  if (!container) return;
  const nodes = items.map(item => {
    const article = document.createElement('article');
    article.className = 'zone-item';
    const title = document.createElement('h3');
    const description = document.createElement('p');
    title.textContent = item.title;
    description.textContent = item.description;
    article.append(title, description);
    return article;
  });
  container.replaceChildren(...nodes);
};

const setState = (state, label) => {
  if (!shell) return;
  shell.dataset.state = state;
  setText('[data-zone-state]', label);
};

const boot = async () => {
  if (!shell) return;
  const zoneKey = shell.dataset.zoneKey;
  setState('loading', 'Loading snapshot');

  try {
    const response = await fetch('/data/7ya-content-v1.snapshot.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`snapshot HTTP ${response.status}`);
    const snapshot = await response.json();
    if (snapshot.schema_version !== '7ya-content-v1') throw new Error('unexpected schema');

    const expectedHash = String(snapshot.payload_hash || '').replace('sha256:', '');
    const actualHash = await sha256(stableStringify(snapshot.payload));
    if (!expectedHash || expectedHash !== actualHash) throw new Error('snapshot integrity mismatch');

    const zone = snapshot.payload?.zones?.[zoneKey];
    if (!zone) throw new Error(`zone ${zoneKey} missing`);

    setText('[data-zone-purpose]', zone.purpose);
    setText('[data-zone-routes]', zone.routes.join(' · '));
    setText('[data-zone-sources]', zone.source_tables.join(' · '));
    setText('[data-zone-hash]', snapshot.payload_hash);
    setText('[data-zone-generated]', snapshot.generated_at);

    if (!Array.isArray(zone.items) || zone.items.length === 0) {
      renderItems([]);
      setState('empty', 'Empty snapshot');
      return;
    }

    renderItems(zone.items);
    setState('ready', 'Verified snapshot');
  } catch (error) {
    const fallback = shell.querySelector('[data-zone-items]')?.children.length;
    setText('[data-zone-error]', error instanceof Error ? error.message : 'snapshot unavailable');
    setState(fallback ? 'lkg' : 'error', fallback ? 'Last Known Good' : 'Error');
  }
};

boot();
