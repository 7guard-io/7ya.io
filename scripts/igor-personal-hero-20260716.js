(() => {
  const topbar = document.getElementById('topbar');
  const progress = document.getElementById('pageProgress');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loadControlLayer = () => {
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifest = document.createElement('link');
      manifest.rel = 'manifest';
      manifest.href = '/site.webmanifest';
      document.head.append(manifest);
    }

    if (!document.querySelector('link[href*="7ya-control-layer-20260726.css"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = '/styles/7ya-control-layer-20260726.css?v=1';
      document.head.append(stylesheet);
    }

    if (!document.querySelector('script[src*="7ya-control-layer-20260726.js"]')) {
      const script = document.createElement('script');
      script.src = '/scripts/7ya-control-layer-20260726.js';
      script.defer = true;
      document.body.append(script);
    }
  };

  loadControlLayer();

  const officialProfiles = [
    {
      label: 'Instagram · @igor.vepretski',
      href: 'https://www.instagram.com/igor.vepretski/',
      platform: 'instagram-primary'
    },
    {
      label: 'Instagram · @vepretski.igor',
      href: 'https://www.instagram.com/vepretski.igor/',
      platform: 'instagram-secondary'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/vepretski/',
      platform: 'linkedin'
    }
  ];

  const connectOfficialProfiles = () => {
    const footerNav = document.querySelector('.footer nav[aria-label="קישורי רשת"]');
    if (footerNav) {
      const existingPrimaryInstagram = [...footerNav.querySelectorAll('a')].find(link =>
        link.href.includes('instagram.com/igor.vepretski')
      );

      if (existingPrimaryInstagram) {
        existingPrimaryInstagram.textContent = officialProfiles[0].label;
        existingPrimaryInstagram.dataset.socialAccount = officialProfiles[0].platform;
      }

      officialProfiles.forEach(profile => {
        const alreadyConnected = [...footerNav.querySelectorAll('a')].some(link =>
          link.href.replace(/\/$/, '') === profile.href.replace(/\/$/, '')
        );
        if (alreadyConnected) return;

        const link = document.createElement('a');
        link.href = profile.href;
        link.textContent = profile.label;
        link.target = '_blank';
        link.rel = 'noopener noreferrer me';
        link.dataset.socialAccount = profile.platform;

        const firstInternalLink = [...footerNav.querySelectorAll('a')].find(item =>
          item.getAttribute('href')?.startsWith('/')
        );
        footerNav.insertBefore(link, firstInternalLink || null);
      });

      if (![...footerNav.querySelectorAll('a')].some(link => link.getAttribute('href') === '/control/')) {
        const controlLink = document.createElement('a');
        controlLink.href = '/control/';
        controlLink.textContent = 'Control';
        footerNav.append(controlLink);
      }
    }

    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
        const people = [];

        nodes.forEach(node => {
          if (node?.['@type'] === 'Person') people.push(node);
          if (node?.mainEntity?.['@type'] === 'Person') people.push(node.mainEntity);
        });

        people.forEach(person => {
          const current = Array.isArray(person.sameAs) ? person.sameAs : [];
          const normalized = current.filter(url => !url.includes('il.linkedin.com/in/vepretski'));
          officialProfiles.forEach(profile => {
            if (!normalized.includes(profile.href)) normalized.push(profile.href);
          });
          person.sameAs = normalized;
        });

        script.textContent = JSON.stringify(data);
      } catch (error) {
        console.warn('7YA social identity metadata could not be updated.', error);
      }
    });
  };

  connectOfficialProfiles();

  const updateFrame = () => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, window.scrollY / scrollable)})`;
    topbar.classList.toggle('is-scrolled', window.scrollY > 30);
  };

  let frame = 0;
  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; updateFrame(); });
  };

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    const open = !mainNav.classList.contains('is-open');
    mainNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateFrame();

  const reveals = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(element => observer.observe(element));
})();
