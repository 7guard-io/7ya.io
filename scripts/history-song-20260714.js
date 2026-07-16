(() => {
  'use strict';

  const core = document.createElement('script');
  core.src = '/scripts/history-song-core-20260714.js';
  core.defer = true;
  document.head.append(core);

  const MODES = [
    {
      id: 'sentinel',
      label: 'SENTINEL',
      eyebrow: 'אחריות לפני רעש · מדינה לפני אגו',
      title: 'באתי לשמור. לבנות. להוביל.',
      caption: 'PUBLIC SERVICE · SECURITY · RESPONSIBILITY',
      accent: '#79d7ff',
      glow: 'rgba(121,215,255,.23)'
    },
    {
      id: 'creator',
      label: 'CREATOR',
      eyebrow: 'כל פרסום הוא יצירה · כל יצירה משאירה עקבה',
      title: 'באתי לברוא משמעות.',
      caption: 'PUBLIC CREATOR · MUSIC · STORY · CULTURE',
      accent: '#ff6b2c',
      glow: 'rgba(255,107,44,.24)'
    },
    {
      id: 'founder',
      label: 'FOUNDER',
      eyebrow: 'נוער לפני מערכת · הזדמנות לפני תיוג',
      title: 'באתי לפתוח דלתות.',
      caption: 'STARTON · YOUTH · TECHNOLOGY · BELONGING',
      accent: '#79f0b2',
      glow: 'rgba(121,240,178,.22)'
    },
    {
      id: 'architect',
      label: 'ARCHITECT',
      eyebrow: 'מקור לפני הגברה · מערכת לפני סיסמה',
      title: 'באתי לבנות זיכרון ציבורי.',
      caption: '7YA · AI · EVIDENCE · PUBLIC MEMORY',
      accent: '#c4a7ff',
      glow: 'rgba(196,167,255,.22)'
    }
  ];

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const stored = sessionStorage.getItem('7ya-visual-mode');
  let active = Math.max(0, MODES.findIndex(mode => mode.id === stored));
  if (!stored) active = dayOfYear % MODES.length;

  const style = document.createElement('style');
  style.dataset.visuomodular = '20260715';
  style.textContent = `
    :root{--future-accent:#ff6b2c;--future-glow:rgba(255,107,44,.24);--future-radius:28px}
    body.personal-home{background:radial-gradient(circle at 76% 2%,var(--future-glow),transparent 32rem),radial-gradient(circle at 8% 42%,rgba(92,129,255,.11),transparent 28rem),#07090d}
    .personal-hero{position:relative;grid-template-columns:minmax(0,.78fr) minmax(520px,1.22fr);min-height:calc(100svh - 72px);isolation:isolate}
    .personal-hero::before{content:"VISUOMODULAR / LIVE";position:absolute;z-index:5;inset:auto auto 24px 0;color:rgba(255,255,255,.5);font:800 9px/1 var(--body);letter-spacing:.22em;writing-mode:vertical-rl}
    .personal-hero>div:first-child{position:relative;z-index:4;padding:clamp(28px,4vw,58px);border:1px solid rgba(255,255,255,.13);border-radius:var(--future-radius);background:linear-gradient(145deg,rgba(5,7,11,.88),rgba(5,7,11,.46));backdrop-filter:blur(18px);box-shadow:0 32px 120px rgba(0,0,0,.48);margin-inline-end:-12vw}
    .personal-eyebrow{color:var(--future-accent)!important}
    .personal-eyebrow::before{background:var(--future-accent)!important;box-shadow:0 0 22px var(--future-accent)}
    .personal-hero h1{font-size:clamp(62px,8.2vw,142px);text-shadow:0 16px 50px rgba(0,0,0,.52)}
    .personal-hero h1 span{color:#fff!important;font-size:.33em!important;letter-spacing:.11em!important;text-transform:uppercase}
    .personal-statement{font-size:clamp(24px,2.5vw,43px);max-width:680px}
    .personal-actions .primary{background:var(--future-accent)!important;border-color:var(--future-accent)!important}
    .personal-proof{grid-template-columns:repeat(2,1fr);max-width:590px;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;background:rgba(0,0,0,.22)}
    .personal-proof div{border-bottom:1px solid rgba(255,255,255,.1)}
    .personal-portrait.future-hero{min-height:760px;border:0;border-radius:var(--future-radius);box-shadow:0 32px 120px rgba(0,0,0,.56),0 0 0 1px rgba(255,255,255,.13);transform:translateZ(0);overflow:hidden}
    .personal-portrait.future-hero img{object-position:center center;filter:saturate(.84) contrast(1.07) brightness(.8);transition:transform 1.2s cubic-bezier(.2,.75,.2,1),filter .6s ease}
    .personal-portrait.future-hero:hover img{transform:scale(1.018);filter:saturate(.96) contrast(1.07) brightness(.85)}
    .personal-portrait.future-hero::before{content:"";position:absolute;z-index:2;inset:0;background:linear-gradient(90deg,rgba(4,6,10,.58),transparent 42%),linear-gradient(0deg,rgba(2,3,5,.9),transparent 44%),radial-gradient(circle at 72% 30%,transparent,rgba(0,0,0,.25) 70%);pointer-events:none}
    .personal-portrait.future-hero::after{background:linear-gradient(180deg,transparent 55%,rgba(2,3,5,.9))}
    .portrait-caption{z-index:4!important;right:30px;left:30px;bottom:28px}
    .portrait-caption b{font-size:clamp(34px,4vw,68px)!important}
    .portrait-caption span{color:#fff!important;max-width:330px!important}
    .portrait-label{z-index:4!important;top:24px;left:24px;border-radius:999px!important;border-color:color-mix(in srgb,var(--future-accent) 50%,transparent)!important;color:#fff;background:rgba(4,6,10,.68)!important;backdrop-filter:blur(12px)}
    .visual-control{position:absolute;z-index:8;top:28px;right:28px;display:flex;gap:7px;padding:7px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(4,6,10,.58);backdrop-filter:blur(15px)}
    .visual-control button{width:34px;height:34px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(255,255,255,.05);color:#fff;font-size:9px;font-weight:950;cursor:pointer;transition:.2s ease}
    .visual-control button:hover,.visual-control button.active{background:var(--future-accent);border-color:var(--future-accent);color:#050607;transform:scale(1.06)}
    .future-status{position:absolute;z-index:8;top:28px;left:28px;display:flex;align-items:center;gap:9px;padding:9px 13px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(4,6,10,.58);backdrop-filter:blur(15px);font-size:9px;font-weight:900;letter-spacing:.13em;direction:ltr}
    .future-status i{width:7px;height:7px;border-radius:50%;background:#6ef0ac;box-shadow:0 0 18px #6ef0ac}
    .personal-axis{position:relative;overflow:hidden}
    .personal-axis::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,var(--future-glow),transparent);opacity:.7;transform:translateX(-100%);animation:futureSweep 9s ease-in-out infinite}
    .personal-axis .personal-shell{position:relative}
    .identity-card,.partner-card,.system-rail a,.gallery-grid a{border-radius:18px;overflow:hidden}
    .identity-card,.partner-card,.system-rail a{transition:transform .3s ease,border-color .3s ease,background .3s ease}
    .identity-card:hover,.partner-card:hover,.system-rail a:hover{transform:translateY(-7px);border-color:var(--future-accent)}
    .gallery-grid{grid-auto-rows:270px;gap:12px}
    .gallery-grid a::before{content:"";position:absolute;z-index:3;inset:12px;border:1px solid rgba(255,255,255,.12);border-radius:12px;pointer-events:none}
    .freshness-dock{position:fixed;z-index:130;left:18px;bottom:18px;display:flex;align-items:center;gap:10px;padding:10px 13px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(5,7,11,.75);backdrop-filter:blur(18px);font-size:9px;letter-spacing:.11em;color:#d9dce5;direction:ltr}
    .freshness-dock b{color:var(--future-accent)}
    @keyframes futureSweep{0%,15%{transform:translateX(-100%)}50%,65%{transform:translateX(100%)}100%{transform:translateX(100%)}}
    @media(max-width:1100px){.personal-hero{grid-template-columns:1fr}.personal-hero>div:first-child{margin:0 0 -70px;z-index:7}.personal-portrait.future-hero{min-height:680px}.visual-control{top:90px}.future-status{top:90px}}
    @media(max-width:680px){.personal-hero{padding-inline:12px}.personal-hero>div:first-child{padding:24px 18px;margin-bottom:-35px}.personal-portrait.future-hero{min-height:590px;border-radius:20px}.personal-proof{grid-template-columns:1fr 1fr}.visual-control{right:14px;top:65px}.future-status{left:14px;top:65px}.freshness-dock{left:10px;right:10px;justify-content:center}.portrait-caption{right:18px;left:18px}.portrait-caption span{display:none}}
    @media(prefers-reduced-motion:reduce){.personal-axis::before{animation:none}.personal-portrait.future-hero img{transition:none}.identity-card,.partner-card,.system-rail a{transition:none}}
  `;
  document.head.append(style);

  const portrait = document.querySelector('.personal-portrait');
  if (portrait) {
    portrait.classList.add('future-hero');
    const picture = portrait.querySelector('picture');
    const img = portrait.querySelector('img');
    picture?.querySelector('source')?.remove();
    if (img) {
      img.src = '/assets/igor-hero-storm-20260716.webp';
      img.width = 1672;
      img.height = 941;
      img.alt = 'איגור ופרצקי — אחריות, יצירה ומנהיגות ישראלית';
    }
    const controls = document.createElement('div');
    controls.className = 'visual-control';
    controls.setAttribute('aria-label', 'בחירת מצב חזותי');
    MODES.forEach((mode, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(index + 1).padStart(2, '0');
      button.title = mode.label;
      button.addEventListener('click', () => applyMode(index, true));
      controls.append(button);
    });
    portrait.append(controls);
    const status = document.createElement('div');
    status.className = 'future-status';
    status.innerHTML = '<i></i><span>VISUAL SYSTEM · LIVE</span>';
    portrait.append(status);
  }

  const dock = document.createElement('div');
  dock.className = 'freshness-dock';
  dock.innerHTML = '<span>DAILY COMPOSITION</span><b id="visualModeLabel">—</b><span>· EVIDENCE STABLE</span>';
  document.body.append(dock);

  const nav = document.querySelector('.site-header nav');
  if (nav && !nav.querySelector('a[href="/legacy/"]')) {
    const legacy = document.createElement('a');
    legacy.href = '/legacy/';
    legacy.textContent = 'מורשת';
    const cta = nav.querySelector('.nav-cta');
    cta ? nav.insertBefore(legacy, cta) : nav.append(legacy);
  }

  function applyMode(index, persist = false) {
    active = ((index % MODES.length) + MODES.length) % MODES.length;
    const mode = MODES[active];
    document.documentElement.dataset.visualMode = mode.id;
    document.documentElement.style.setProperty('--future-accent', mode.accent);
    document.documentElement.style.setProperty('--future-glow', mode.glow);
    const eyebrow = document.querySelector('.personal-eyebrow');
    const statement = document.querySelector('.personal-statement');
    const caption = document.querySelector('.portrait-caption span');
    const label = document.querySelector('#visualModeLabel');
    if (eyebrow) eyebrow.textContent = mode.eyebrow;
    if (statement) statement.textContent = mode.title;
    if (caption) caption.textContent = mode.caption;
    if (label) label.textContent = mode.label;
    document.querySelectorAll('.visual-control button').forEach((button, buttonIndex) => button.classList.toggle('active', buttonIndex === active));
    if (persist) sessionStorage.setItem('7ya-visual-mode', mode.id);
  }

  const parallax = event => {
    if (!portrait || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = portrait.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const x = (event.clientX / innerWidth - .5) * 8;
    const y = (event.clientY / innerHeight - .5) * 5;
    portrait.style.transform = `perspective(1200px) rotateY(${x * .12}deg) rotateX(${-y * .12}deg)`;
  };
  window.addEventListener('pointermove', parallax, { passive: true });
  window.addEventListener('pointerleave', () => { if (portrait) portrait.style.transform = ''; });

  applyMode(active);
})();
