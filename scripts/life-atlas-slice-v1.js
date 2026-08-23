(() => {
  'use strict';

  const DATASET_URL = '/knowledge/life-atlas-slice-v1.json';
  const SURFACES = {
    '/': {
      anchor: '#sources',
      eyebrow: 'LIFE ATLAS · FIRST PROJECTION',
      title: 'החיים לא כרשימת קישורים. כציר שאפשר ללכת בו.',
      intro: 'עשרה רגעים ראשונים שכבר מחוברים למקור. אני מספר את החוויה בגוף ראשון; המערכת משאירה את הראיה במרחק לחיצה.'
    },
    '/museum/': {
      anchor: '.editorial-picks',
      eyebrow: 'LIFE ATLAS · CHRONOLOGICAL LENS',
      title: 'לפני קיר המקורות — הנה הרצף שהם מספרים יחד.',
      intro: 'אותם מקורות מקבלים כאן הקשר כרונולוגי: רגע → קול אישי → מקור פתוח. זהו slice ראשון, לא תקרת הארכיון.'
    }
  };

  const normalizePath = value => {
    if (!value || value === '/index.html') return '/';
    const withoutIndex = value.replace(/index\.html$/, '');
    if (withoutIndex === '/') return '/';
    return withoutIndex.endsWith('/') ? withoutIndex : `${withoutIndex}/`;
  };

  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const verificationLabel = value => ({
    verified: 'מאומת',
    corroborated: 'מוצלב',
    'owner-archive': 'ארכיון בעלים',
    'public-source': 'מקור ציבורי',
    unresolved: 'לא פתור'
  })[value] || value;

  const createMomentCard = (moment, index) => {
    const card = node('article', 'life-atlas-card');
    card.dataset.lifeAtlasMoment = moment.id;

    const rail = node('div', 'life-atlas-card-rail');
    rail.append(node('span', 'life-atlas-index', String(index + 1).padStart(2, '0')));
    rail.append(node('span', 'life-atlas-dot'));

    const meta = node('div', 'life-atlas-meta');
    meta.append(node('time', 'life-atlas-date', moment.dateLabel));
    meta.append(node('span', `life-atlas-status is-${moment.verification}`, verificationLabel(moment.verification)));

    const title = node('h3', 'life-atlas-card-title', moment.headline.he);
    const voice = node('p', 'life-atlas-voice', moment.livedVoice.he);

    const source = node('a', 'life-atlas-source', `${moment.sourceLabel || 'מקור'} ↗`);
    source.href = moment.sourceHref;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';

    const body = node('div', 'life-atlas-card-body');
    body.append(meta, title, voice);
    if (moment.disclosure) body.append(node('p', 'life-atlas-disclosure', moment.disclosure));
    body.append(source);

    card.append(rail, body);
    return card;
  };

  const createMount = surface => {
    const section = node('section', 'life-atlas-section');
    section.setAttribute('data-life-atlas-mount', '');
    section.dataset.lifeAtlasState = 'loading';
    section.setAttribute('aria-labelledby', 'life-atlas-title');

    const head = node('div', 'life-atlas-head');
    head.append(node('p', 'life-atlas-eyebrow', surface.eyebrow));
    const title = node('h2', 'life-atlas-title', surface.title);
    title.id = 'life-atlas-title';
    head.append(title, node('p', 'life-atlas-intro', surface.intro));

    const track = node('div', 'life-atlas-track');
    track.setAttribute('data-life-atlas-track', '');
    track.setAttribute('aria-live', 'polite');
    track.append(node('p', 'life-atlas-loading', 'טוען את ציר החיים…'));

    const footer = node('div', 'life-atlas-footer');
    const note = node('span', 'life-atlas-note', 'PUBLIC SLICE · SOURCE-AWARE · 10 MOMENTS');
    const archiveLink = node('a', 'life-atlas-archive-link', 'פתחו את הארכיון המלא ←');
    archiveLink.href = '/museum/';
    footer.append(note, archiveLink);

    section.append(head, track, footer);
    return section;
  };

  const load = async () => {
    const path = normalizePath(window.location.pathname);
    const surface = SURFACES[path];
    if (!surface) return;

    const anchor = document.querySelector(surface.anchor);
    if (!anchor || document.querySelector('[data-life-atlas-mount]')) return;

    const mount = createMount(surface);
    anchor.parentNode.insertBefore(mount, anchor);

    try {
      const response = await fetch(DATASET_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const dataset = await response.json();
      if (!Array.isArray(dataset?.moments) || dataset.moments.length < 1) throw new Error('No moments');

      const track = mount.querySelector('[data-life-atlas-track]');
      track.replaceChildren(...dataset.moments.slice(0, 10).map(createMomentCard));
      mount.dataset.lifeAtlasState = 'ready';
    } catch (error) {
      mount.dataset.lifeAtlasState = 'error';
      const track = mount.querySelector('[data-life-atlas-track]');
      track.replaceChildren(node('p', 'life-atlas-error', 'ציר החיים לא נטען כרגע. שאר האתר והמקורות נשארים זמינים כרגיל.'));
      console.warn('7YA LIFE ATLAS projection unavailable', error);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
