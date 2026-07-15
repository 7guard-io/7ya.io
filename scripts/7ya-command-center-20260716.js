const STATUS_ENDPOINT = '/data/command-center-status.json';

const stateClass = (state = '') => `state-${String(state).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function sourceLine(label, href) {
  const line = element('p', 'status-source');
  line.append('מקור: ');
  if (href && /^https?:\/\//.test(href)) {
    const link = element('a', '', label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    line.append(link);
  } else {
    line.append(document.createTextNode(label || 'לא צוין'));
  }
  return line;
}

function renderHealth(records) {
  const grid = document.getElementById('health-grid');
  grid.replaceChildren();

  records.forEach((record, index) => {
    const card = element('article', `status-card ${stateClass(record.state)}`);
    const top = element('div', 'status-top');
    top.append(
      element('span', 'status-index', String(index + 1).padStart(2, '0')),
      element('span', 'status-badge', record.state)
    );

    card.append(
      top,
      element('h3', '', record.title),
      element('p', 'status-summary', record.summary),
      sourceLine(record.source, record.href)
    );
    grid.append(card);
  });

  grid.setAttribute('aria-busy', 'false');
}

function renderEntities(records) {
  const grid = document.getElementById('entity-grid');
  grid.replaceChildren();

  records.forEach((record) => {
    const card = element('article', `entity-card ${stateClass(record.state)}`);
    const top = element('div', 'entity-top');
    top.append(
      element('span', 'entity-kind', record.kind),
      element('span', 'status-badge', record.state)
    );

    card.append(
      top,
      element('h3', '', record.title),
      element('p', 'entity-summary', record.summary)
    );

    const source = element('p', 'entity-source', `מקור: ${record.source || 'לא צוין'}`);
    card.append(source);

    if (record.href) {
      const link = element('a', 'card-link', `פתח ${record.title}`);
      link.href = record.href;
      link.setAttribute('aria-label', `פתח ${record.title}`);
      card.append(link);
    }

    grid.append(card);
  });

  grid.setAttribute('aria-busy', 'false');
}

function renderBoundaries(boundaries) {
  const list = document.getElementById('boundary-list');
  list.replaceChildren(...boundaries.map((boundary) => element('li', '', boundary)));
}

function renderCheckedAt(value) {
  const time = document.getElementById('snapshot-time');
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    time.textContent = value || 'לא ידוע';
    return;
  }

  time.dateTime = value;
  time.textContent = new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jerusalem'
  }).format(parsed);
}

function renderError(error) {
  console.error('Command Center snapshot failed to load:', error);
  const health = document.getElementById('health-grid');
  const entities = document.getElementById('entity-grid');
  const message = 'לא ניתן לטעון את קובץ הסטטוס הציבורי. אין להסיק מכך שהמערכת כולה מושבתת.';

  health.replaceChildren(element('p', 'load-error', message));
  entities.replaceChildren(element('p', 'load-error', 'מצבי הישויות אינם זמינים כרגע. פתחו את Evidence Ledger לקבלת המידע המתועד.'));
  health.setAttribute('aria-busy', 'false');
  entities.setAttribute('aria-busy', 'false');
  document.getElementById('snapshot-time').textContent = 'טעינה נכשלה';
}

async function loadSnapshot() {
  const response = await fetch(STATUS_ENDPOINT, {
    headers: { Accept: 'application/json' },
    cache: 'no-cache'
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  if (data.schema_version !== 1 || !Array.isArray(data.health) || !Array.isArray(data.entities)) {
    throw new Error('Unsupported command-center status schema');
  }

  renderCheckedAt(data.checked_at);
  renderHealth(data.health);
  renderEntities(data.entities);
  renderBoundaries(Array.isArray(data.boundaries) ? data.boundaries : []);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSnapshot().catch(renderError);
});
