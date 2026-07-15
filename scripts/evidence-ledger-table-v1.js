const STATUS_MAP = {
  'VERIFIED': { key: 'verified', label: 'VERIFIED' },
  'PARTIALLY VERIFIED': { key: 'documented', label: 'PARTIAL' },
  'DOCUMENTED': { key: 'documented', label: 'DOCUMENTED' },
  'SOURCE PENDING': { key: 'pending', label: 'SOURCE PENDING' },
  'PRIVATE': { key: 'private', label: 'PRIVATE' },
  'REJECTED': { key: 'rejected', label: 'REJECTED' },
};

function canonicalRecord(record) {
  const ordered = {};
  for (const key of Object.keys(record).sort()) ordered[key] = record[key];
  return JSON.stringify(ordered);
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function truncateHash(hash) {
  if (!hash || hash === 'N/A') return 'N/A';
  return `${hash.slice(0, 10)}…${hash.slice(-10)}`;
}

function safeText(value) {
  return typeof value === 'string' ? value : '';
}

function escapeHtml(value) {
  return safeText(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusFor(value) {
  return STATUS_MAP[value] || { key: 'documented', label: safeText(value) || 'DOCUMENTED' };
}

function sourceHref(record) {
  const source = safeText(record.sourceLink);
  if (!source || source.startsWith('SOURCE PENDING') || source.startsWith('PRIVATE')) return null;
  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith('packages/') || source.startsWith('api/') || source.startsWith('data/')) {
    return `https://github.com/7guard-io/7ya.io/tree/main/${source.replace(/\/$/, '')}`;
  }
  return null;
}

function buildSourceCell(record) {
  const href = sourceHref(record);
  if (!href) return `<span class="ledger-source-muted">${escapeHtml(record.sourceType) || 'No public source'}</span>`;
  return `<a class="ledger-source-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">פתיחת מקור ↗</a>`;
}

function copyButton(hash, id) {
  return `<button class="ledger-copy" type="button" data-copy-hash="${escapeHtml(hash)}" aria-label="העתקת hash מלא עבור ${escapeHtml(id)}" title="העתקת hash מלא"><span aria-hidden="true">⧉</span><span class="ledger-copy-label">COPY</span></button>`;
}

function rowTemplate(record, hash) {
  const state = statusFor(record.status);
  const id = safeText(record.id);
  return `
    <tr data-ledger-row="${escapeHtml(id)}">
      <td class="ledger-time"><time datetime="${escapeHtml(record.date)}">${escapeHtml(record.date)}</time><small>${escapeHtml(id)}</small></td>
      <td class="ledger-claim"><strong>${escapeHtml(record.title)}</strong><span>${escapeHtml(record.category)} · ${escapeHtml(record.classification)}</span></td>
      <td class="ledger-hash-cell"><div class="ledger-hash"><code title="${escapeHtml(hash)}">${escapeHtml(truncateHash(hash))}</code>${copyButton(hash, id)}</div></td>
      <td>${buildSourceCell(record)}</td>
      <td class="ledger-state"><span class="ya-badge ya-badge-${state.key}">${escapeHtml(state.label)}</span></td>
    </tr>
    <tr class="ledger-detail-row">
      <td colspan="5"><details><summary>הקשר והסבר</summary><p>${escapeHtml(record.explanation)}</p><div class="ledger-meta"><span>${escapeHtml(record.sourceType)}</span><code>${escapeHtml(hash)}</code></div></details></td>
    </tr>`;
}

function setCopyFeedback(button, copied) {
  const label = button.querySelector('.ledger-copy-label');
  button.classList.toggle('copied', copied);
  if (label) label.textContent = copied ? 'COPIED' : 'COPY';
  const icon = button.querySelector('[aria-hidden="true"]');
  if (icon) icon.textContent = copied ? '✓' : '⧉';
}

async function handleCopy(button) {
  const hash = button.dataset.copyHash;
  if (!hash) return;
  try {
    await navigator.clipboard.writeText(hash);
    setCopyFeedback(button, true);
    window.setTimeout(() => setCopyFeedback(button, false), 1800);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = hash;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setCopyFeedback(button, true);
    window.setTimeout(() => setCopyFeedback(button, false), 1800);
  }
}

async function renderLedger() {
  const host = document.querySelector('[data-evidence-ledger]');
  const count = document.querySelector('[data-ledger-count]');
  const error = document.querySelector('[data-ledger-error]');
  if (!host) return;

  try {
    const response = await fetch('/data/evidence-claims.json', { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Evidence data returned HTTP ${response.status}`);
    const records = await response.json();
    if (!Array.isArray(records)) throw new Error('Evidence data is not an array');

    const rows = await Promise.all(records.map(async record => ({ record, hash: await sha256(canonicalRecord(record)) })));
    rows.sort((a, b) => safeText(b.record.date).localeCompare(safeText(a.record.date)) || safeText(a.record.id).localeCompare(safeText(b.record.id)));
    host.innerHTML = rows.map(({ record, hash }) => rowTemplate(record, hash)).join('');
    if (count) count.textContent = String(rows.length);

    host.addEventListener('click', event => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('[data-copy-hash]');
      if (button instanceof HTMLButtonElement) handleCopy(button);
    });
  } catch (cause) {
    console.error('7YA evidence ledger render failed', cause);
    if (error) {
      error.hidden = false;
      error.textContent = 'הטבלה המפורטת לא נטענה. רשומות הסיכום והמקורות הציבוריים נשארו זמינים בעמוד.';
    }
  }
}

renderLedger();
