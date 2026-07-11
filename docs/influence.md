# Igor Vepretski Historical Influence Archive

<div class="influence-wall" dir="ltr">
  <style>
    .influence-wall {
      --bg: #05070d;
      --panel: rgba(12, 18, 31, 0.78);
      --panel-strong: rgba(17, 28, 48, 0.92);
      --line: rgba(141, 190, 255, 0.22);
      --text: #eef6ff;
      --muted: #a9b8cc;
      --blue: #74b7ff;
      --ice: #dff2ff;
      --gold: #f6c96f;
      --green: #77f0b5;
      --danger: #ff8f8f;
      color: var(--text);
      background:
        radial-gradient(circle at 8% 0%, rgba(83, 148, 255, 0.22), transparent 28%),
        radial-gradient(circle at 84% 20%, rgba(255, 255, 255, 0.10), transparent 30%),
        linear-gradient(135deg, #05070d 0%, #091120 42%, #030408 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
      position: relative;
      margin: 1.5rem 0 3rem;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .influence-wall::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(116, 183, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(116, 183, 255, 0.08) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 82%);
      pointer-events: none;
    }

    .influence-hero,
    .influence-section,
    .influence-footer {
      position: relative;
      z-index: 1;
    }

    .influence-hero {
      padding: clamp(2rem, 5vw, 5rem);
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
      gap: clamp(1.5rem, 4vw, 4rem);
      align-items: center;
      min-height: 560px;
    }

    .influence-kicker {
      display: inline-flex;
      gap: 0.55rem;
      align-items: center;
      padding: 0.55rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--ice);
      background: rgba(116, 183, 255, 0.08);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 800;
      font-size: 0.78rem;
    }

    .influence-hero h1 {
      margin: 1.2rem 0 1rem;
      font-size: clamp(2.4rem, 7vw, 5.8rem);
      line-height: 0.92;
      letter-spacing: -0.07em;
      color: #fff;
      max-width: 950px;
    }

    .influence-hero p {
      color: var(--muted);
      font-size: clamp(1rem, 2vw, 1.28rem);
      line-height: 1.75;
      max-width: 820px;
    }

    .influence-cta-row,
    .influence-filter-row,
    .influence-sort-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    .influence-btn,
    .influence-chip {
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.06);
      color: var(--text) !important;
      text-decoration: none !important;
      border-radius: 999px;
      padding: 0.78rem 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform .2s ease, border-color .2s ease, background .2s ease;
    }

    .influence-btn.primary {
      background: linear-gradient(135deg, rgba(116,183,255,0.96), rgba(223,242,255,0.95));
      color: #03101e !important;
      border-color: transparent;
      box-shadow: 0 18px 44px rgba(116,183,255,0.24);
    }

    .influence-btn:hover,
    .influence-chip:hover,
    .influence-chip.active {
      transform: translateY(-2px);
      border-color: rgba(223,242,255,0.8);
      background: rgba(116,183,255,0.16);
    }

    .influence-orb {
      min-height: 430px;
      border-radius: 32px;
      border: 1px solid var(--line);
      background:
        radial-gradient(circle at 50% 38%, rgba(223,242,255,0.96) 0 2px, transparent 3px),
        radial-gradient(circle at 50% 43%, rgba(116,183,255,0.28), transparent 30%),
        linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 80px rgba(116,183,255,0.1), 0 30px 80px rgba(0,0,0,0.35);
    }

    .influence-orb::before,
    .influence-orb::after {
      content: "";
      position: absolute;
      border-radius: 999px;
      border: 1px solid rgba(223,242,255,0.22);
      inset: 18%;
      transform: rotate(-12deg);
    }

    .influence-orb::after {
      inset: 31%;
      transform: rotate(18deg);
      box-shadow: 0 0 52px rgba(116,183,255,0.18);
    }

    .signal-card {
      position: absolute;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      border-radius: 24px;
      padding: 1rem;
      background: rgba(3, 7, 14, 0.74);
      border: 1px solid rgba(223,242,255,0.16);
      backdrop-filter: blur(16px);
    }

    .signal-card strong {
      display: block;
      font-size: 1.05rem;
      margin-bottom: .25rem;
    }

    .signal-card span {
      color: var(--muted);
      font-size: .92rem;
    }

    .influence-section {
      padding: 0 clamp(1.2rem, 5vw, 5rem) clamp(2rem, 5vw, 5rem);
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: end;
      margin-bottom: 1rem;
    }

    .section-head h2 {
      color: #fff;
      font-size: clamp(1.65rem, 4vw, 3rem);
      letter-spacing: -0.045em;
      margin: 0;
    }

    .section-head p {
      color: var(--muted);
      max-width: 680px;
      line-height: 1.65;
      margin: 0.4rem 0 0;
    }

    .influence-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .archive-card {
      background: var(--panel);
      border: 1px solid rgba(223,242,255,0.12);
      border-radius: 24px;
      overflow: hidden;
      min-height: 420px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 18px 60px rgba(0,0,0,0.25);
    }

    .archive-visual {
      min-height: 180px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 24% 28%, rgba(116,183,255,0.38), transparent 26%),
        radial-gradient(circle at 80% 18%, rgba(246,201,111,0.18), transparent 24%),
        linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
    }

    .archive-visual::before {
      content: attr(data-type);
      position: absolute;
      top: 1rem;
      left: 1rem;
      border: 1px solid rgba(255,255,255,0.20);
      border-radius: 999px;
      padding: .34rem .68rem;
      color: var(--ice);
      background: rgba(0,0,0,0.32);
      font-weight: 900;
      font-size: .72rem;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .archive-visual::after {
      content: "Image pending verification";
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      color: rgba(238,246,255,0.78);
      font-size: .82rem;
      font-weight: 800;
    }

    .archive-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: .72rem;
      flex: 1;
    }

    .archive-meta {
      display: flex;
      flex-wrap: wrap;
      gap: .45rem;
      color: var(--muted);
      font-size: .8rem;
      font-weight: 750;
    }

    .archive-badge {
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 999px;
      padding: .3rem .55rem;
      background: rgba(255,255,255,0.05);
    }

    .archive-badge.verified { color: var(--green); }
    .archive-badge.public-search { color: var(--blue); }
    .archive-badge.user-provided { color: var(--gold); }
    .archive-badge.needs-verification { color: var(--danger); }

    .archive-card h3 {
      color: #fff;
      font-size: 1.18rem;
      line-height: 1.22;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .archive-card p {
      color: var(--muted);
      line-height: 1.58;
      margin: 0;
      font-size: .94rem;
    }

    .archive-tags {
      display: flex;
      flex-wrap: wrap;
      gap: .4rem;
      margin-top: auto;
    }

    .archive-tag {
      color: var(--ice);
      background: rgba(116,183,255,0.10);
      border: 1px solid rgba(116,183,255,0.16);
      border-radius: 999px;
      padding: .28rem .5rem;
      font-size: .75rem;
      font-weight: 800;
    }

    .archive-link {
      color: #061426 !important;
      background: var(--ice);
      border-radius: 999px;
      padding: .66rem .86rem;
      text-align: center;
      text-decoration: none !important;
      font-weight: 900;
      margin-top: .25rem;
    }

    .archive-link.pending {
      color: var(--muted) !important;
      background: rgba(255,255,255,0.06);
      cursor: not-allowed;
    }

    .timeline {
      display: grid;
      gap: .75rem;
      margin-top: 1rem;
    }

    .timeline-row {
      display: grid;
      grid-template-columns: 90px minmax(0, 1fr);
      gap: 1rem;
      padding: 1rem;
      border: 1px solid rgba(223,242,255,0.12);
      border-radius: 18px;
      background: rgba(255,255,255,0.045);
    }

    .timeline-year {
      color: var(--blue);
      font-weight: 950;
      letter-spacing: -0.04em;
      font-size: 1.2rem;
    }

    .timeline-row strong {
      color: #fff;
      display: block;
      margin-bottom: .25rem;
    }

    .timeline-row span {
      color: var(--muted);
      line-height: 1.5;
    }

    .influence-footer {
      padding: clamp(1.5rem, 5vw, 4rem);
      border-top: 1px solid rgba(223,242,255,0.11);
      background: rgba(255,255,255,0.035);
    }

    .import-note {
      border: 1px solid rgba(246,201,111,0.24);
      background: rgba(246,201,111,0.08);
      color: #fff4d6;
      border-radius: 22px;
      padding: 1rem;
      line-height: 1.65;
    }

    @media (max-width: 980px) {
      .influence-hero { grid-template-columns: 1fr; min-height: auto; }
      .influence-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .section-head { display: block; }
    }

    @media (max-width: 640px) {
      .influence-wall { border-radius: 18px; margin-inline: -0.7rem; }
      .influence-grid { grid-template-columns: 1fr; }
      .timeline-row { grid-template-columns: 1fr; }
      .influence-orb { min-height: 320px; }
    }
  </style>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Igor Vepretski Historical Influence Wall | 7YA",
    "description": "Explore the historical influence archive of Igor Vepretski: #7YA creator assets, public posts, pictures, videos, civic moments, StartOn impact, music milestones, and verified media references.",
    "url": "https://7ya.io/#/docs/influence",
    "isPartOf": { "@type": "WebSite", "name": "7YA", "url": "https://7ya.io" },
    "about": {
      "@type": "Person",
      "name": "Igor Vepretski",
      "alternateName": ["איגור ופרצקי", "Игорь Вепрецкий", "#7YA"],
      "url": "https://7ya.io"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Igor Vepretski Historical Influence Archive",
      "numberOfItems": 8,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Igor Vepretski #7YA on Instagram" },
        { "@type": "ListItem", "position": 2, "name": "Igor Vepretski #7YA YouTube Channel" },
        { "@type": "ListItem", "position": 3, "name": "Ron Nesher & Igor Vepretski — Met Al Excel" },
        { "@type": "ListItem", "position": 4, "name": "Viral comedy and creator videos" },
        { "@type": "ListItem", "position": 5, "name": "Igor Vepretski at the Knesset" },
        { "@type": "ListItem", "position": 6, "name": "StartOn Youth Impact Layer" },
        { "@type": "ListItem", "position": 7, "name": "#7YA — Not Fashion. Force." },
        { "@type": "ListItem", "position": 8, "name": "Archive pending pictures" }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "7YA", "item": "https://7ya.io" },
        { "@type": "ListItem", "position": 2, "name": "Historical Influence Wall", "item": "https://7ya.io/#/docs/influence" }
      ]
    }
  }
  </script>

  <section class="influence-hero" id="top">
    <div>
      <span class="influence-kicker">⚡ 7YA Evidence Wall</span>
      <h1>Igor Vepretski Historical Influence Archive</h1>
      <p>
        A verified public archive of pictures, posts, videos, civic moments, creator milestones,
        StartOn impact, and #7YA media signals. Every item is built as evidence infrastructure:
        source label, verification state, SEO snippet, and clear next action.
      </p>
      <div class="influence-cta-row">
        <a class="influence-btn primary" href="#timeline">View Timeline</a>
        <a class="influence-btn" href="mailto:hello@7ya.io?subject=Missing%207YA%20archive%20source">Submit Missing Source</a>
        <a class="influence-btn" href="/">Explore 7YA Programs</a>
      </div>
    </div>

    <aside class="influence-orb" aria-label="7YA archive signal visualization">
      <div class="signal-card">
        <strong>NOT FASHION. FORCE.</strong>
        <span>Public identity, creator memory, civic signal, and verified influence assets in one command-room wall.</span>
      </div>
    </aside>
  </section>

  <section class="influence-section" id="archive">
    <div class="section-head">
      <div>
        <h2>Archive Grid</h2>
        <p>Filter by signal type. Items without a reliable source stay marked as needs-verification instead of being published as unsupported fact.</p>
      </div>
    </div>

    <div class="influence-filter-row" role="group" aria-label="Archive filters">
      <button class="influence-chip active" data-filter="all">All</button>
      <button class="influence-chip" data-filter="image">Pictures</button>
      <button class="influence-chip" data-filter="post">Posts</button>
      <button class="influence-chip" data-filter="video">Videos</button>
      <button class="influence-chip" data-filter="music">Music</button>
      <button class="influence-chip" data-filter="starton">StartOn</button>
      <button class="influence-chip" data-filter="civic">Civic</button>
      <button class="influence-chip" data-filter="press">Press</button>
      <button class="influence-chip" data-filter="needs-verification">Needs Verification</button>
    </div>

    <div class="influence-sort-row" role="group" aria-label="Archive sorting">
      <button class="influence-chip" data-sort="newest">Newest</button>
      <button class="influence-chip" data-sort="oldest">Oldest</button>
      <button class="influence-chip" data-sort="impact">Highest Impact</button>
      <button class="influence-chip" data-sort="verification">Verification Status</button>
    </div>

    <div class="influence-grid" id="influenceGrid"></div>
  </section>

  <section class="influence-section" id="timeline">
    <div class="section-head">
      <div>
        <h2>Timeline Signals</h2>
        <p>The timeline compresses public identity, creator, civic, music, and social-impact nodes into one readable historical surface.</p>
      </div>
    </div>
    <div class="timeline" id="timelineGrid"></div>
  </section>

  <footer class="influence-footer">
    <div class="import-note">
      <strong>Developer archive note:</strong>
      To make this archive complete, import native exports from TikTok, Instagram, Facebook, YouTube Studio, Google Drive screenshots,
      and the audited Igor Vepretski Public Influence workbook. Do not publish unsupported metrics. Use the CSV template at
      <code>docs/influence-import-template.csv</code>.
    </div>
  </footer>

  <script>
    (function () {
      const archiveItems = [
        {
          id: "instagram-profile",
          title: "Igor Vepretski #7YA on Instagram",
          type: "profile",
          platform: "Instagram",
          sourceUrl: "https://www.instagram.com/igor.vepretski/",
          dateLabel: "Public profile",
          year: 2026,
          language: "EN / HE / RU",
          excerpt: "Public Instagram profile connected to Igor Vepretski, #7YA, creator identity, and digital influence.",
          seoSnippet: "Public Instagram profile of Igor Vepretski, connected to #7YA, creator identity, and digital influence.",
          evidenceTier: "public-search",
          verificationStatus: "source-url-present",
          metrics: { followers: null, views: null, likes: null, comments: null, shares: null },
          tags: ["Public Identity", "Instagram", "#7YA", "Creator"]
        },
        {
          id: "youtube-channel",
          title: "Igor Vepretski #7YA YouTube Channel",
          type: "profile",
          platform: "YouTube",
          sourceUrl: "https://www.youtube.com/@Igor.vepretski",
          dateLabel: "Public channel",
          year: 2026,
          language: "HE / RU",
          excerpt: "YouTube channel featuring Igor Vepretski’s music, podcasts, viral videos, and #7YA creator content.",
          seoSnippet: "YouTube channel featuring Igor Vepretski’s music, podcasts, viral videos, and #7YA creator content.",
          evidenceTier: "public-search",
          verificationStatus: "source-url-present",
          metrics: { followers: null, views: null, likes: null, comments: null, shares: null },
          tags: ["YouTube", "Music", "Video", "Creator"]
        },
        {
          id: "met-al-excel",
          title: "Ron Nesher & Igor Vepretski — Met Al Excel",
          type: "music",
          platform: "YouTube",
          sourceUrl: "https://www.youtube.com/@Igor.vepretski",
          dateLabel: "Music milestone",
          year: 2010,
          language: "HE",
          excerpt: "A public music milestone connected to Igor Vepretski’s Hebrew hip-hop and creator identity.",
          seoSnippet: "A major public music milestone connected to Igor Vepretski’s Hebrew hip-hop and creator identity.",
          evidenceTier: "public-search",
          verificationStatus: "needs-specific-video-url",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["Music", "Hebrew Hip-Hop", "Ron Nesher", "YouTube"]
        },
        {
          id: "viral-video-cluster",
          title: "Viral comedy and creator videos",
          type: "video",
          platform: "YouTube / Social",
          sourceUrl: "https://www.youtube.com/@Igor.vepretski",
          dateLabel: "Historical cluster",
          year: 2010,
          language: "HE / RU",
          excerpt: "A cluster of historical viral videos that helped shape Igor Vepretski’s public creator footprint.",
          seoSnippet: "Historical viral videos connected to Igor Vepretski’s creator footprint, comedy, social media, and #7YA identity.",
          evidenceTier: "public-search",
          verificationStatus: "needs-export-row-or-video-list",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["Viral Posts", "Comedy", "Creator", "Archive"]
        },
        {
          id: "knesset-public-post",
          title: "Igor Vepretski at the Knesset",
          type: "civic",
          platform: "Facebook",
          sourceUrl: "https://www.facebook.com/vepretski/",
          dateLabel: "Civic / political moment",
          year: 2020,
          language: "HE",
          excerpt: "A public civic and political #7YA moment connected to Igor Vepretski’s activity in Israeli public life.",
          seoSnippet: "Public civic and political #7YA moment connected to Igor Vepretski’s activity in Israeli public life.",
          evidenceTier: "public-search",
          verificationStatus: "needs-specific-post-url-or-screenshot",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["Civic", "Politics", "Facebook", "Israel"]
        },
        {
          id: "starton-impact",
          title: "StartOn Youth Impact Layer",
          type: "starton",
          platform: "StartOn / 7YA",
          sourceUrl: "https://starton.org.il",
          dateLabel: "Social impact node",
          year: 2020,
          language: "HE / EN",
          excerpt: "StartOn represents Igor Vepretski’s social-impact work around youth empowerment, technology, mentoring, and practical opportunity.",
          seoSnippet: "StartOn represents Igor Vepretski’s social-impact work around youth empowerment, technology, mentoring, and opportunity.",
          evidenceTier: "user-provided",
          verificationStatus: "needs-source-url-for-each-asset",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["StartOn", "Youth Impact", "Mentoring", "Technology"]
        },
        {
          id: "7ya-movement",
          title: "#7YA — Not Fashion. Force.",
          type: "profile",
          platform: "7YA",
          sourceUrl: "https://7ya.io",
          dateLabel: "Movement identity",
          year: 2026,
          language: "EN / HE / RU",
          excerpt: "#7YA is the media, creator, automation, and public influence umbrella connected to Igor Vepretski.",
          seoSnippet: "#7YA is the media, creator, automation, and public influence umbrella connected to Igor Vepretski.",
          evidenceTier: "user-provided",
          verificationStatus: "brand-source-present",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["#7YA", "Automation", "Creator System", "Movement"]
        },
        {
          id: "archive-pending-pictures",
          title: "Archive pending pictures",
          type: "image",
          platform: "Local archive",
          sourceUrl: "",
          dateLabel: "Awaiting upload",
          year: 2026,
          language: "EN / HE / RU",
          excerpt: "Placeholder for professional portraits, 7YA visuals, StartOn community work, media interviews, civic appearances, music visuals, and podcast assets.",
          seoSnippet: "Picture archive placeholder for Igor Vepretski portraits, #7YA movement visuals, StartOn work, civic appearances, and music assets.",
          evidenceTier: "needs-verification",
          verificationStatus: "needs-local-image-and-source",
          metrics: { views: null, followers: null, likes: null, comments: null, shares: null },
          tags: ["Pictures", "Portraits", "Needs Verification", "Archive"]
        }
      ];

      let activeFilter = "all";
      let activeSort = "newest";

      const grid = document.getElementById("influenceGrid");
      const timeline = document.getElementById("timelineGrid");
      const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
      const sortButtons = Array.from(document.querySelectorAll("[data-sort]"));

      function impactScore(item) {
        const metrics = item.metrics || {};
        return [metrics.views, metrics.likes, metrics.comments, metrics.shares, metrics.followers]
          .filter(Boolean)
          .reduce((sum, value) => sum + Number(value || 0), 0);
      }

      function verificationRank(item) {
        return {
          "verified": 4,
          "public-search": 3,
          "user-provided": 2,
          "needs-verification": 1
        }[item.evidenceTier] || 0;
      }

      function filteredItems() {
        return archiveItems
          .filter(item => activeFilter === "all" || item.type === activeFilter || item.evidenceTier === activeFilter)
          .sort((a, b) => {
            if (activeSort === "oldest") return (a.year || 0) - (b.year || 0);
            if (activeSort === "impact") return impactScore(b) - impactScore(a);
            if (activeSort === "verification") return verificationRank(b) - verificationRank(a);
            return (b.year || 0) - (a.year || 0);
          });
      }

      function renderCard(item) {
        const tags = (item.tags || []).map(tag => `<span class="archive-tag">${tag}</span>`).join("");
        const safeType = item.type === "profile" ? "post" : item.type;
        const href = item.sourceUrl ? item.sourceUrl : "#archive";
        const linkClass = item.sourceUrl ? "archive-link" : "archive-link pending";
        const linkText = item.sourceUrl ? "Open Source" : "Source Pending";

        return `
          <article class="archive-card" data-kind="${item.type}" aria-label="${item.title}">
            <div class="archive-visual" data-type="${safeType}"></div>
            <div class="archive-body">
              <div class="archive-meta">
                <span class="archive-badge">${item.platform}</span>
                <span class="archive-badge">${item.dateLabel}</span>
                <span class="archive-badge ${item.evidenceTier}">${item.evidenceTier}</span>
              </div>
              <h3>${item.title}</h3>
              <p>${item.seoSnippet}</p>
              <p><strong>Verification:</strong> ${item.verificationStatus}</p>
              <div class="archive-tags">${tags}</div>
              <a class="${linkClass}" href="${href}" target="_blank" rel="noopener noreferrer">${linkText}</a>
            </div>
          </article>
        `;
      }

      function renderTimelineRow(item) {
        return `
          <div class="timeline-row">
            <div class="timeline-year">${item.year || "TBD"}</div>
            <div>
              <strong>${item.title}</strong>
              <span>${item.excerpt}</span>
            </div>
          </div>
        `;
      }

      function render() {
        const items = filteredItems();
        grid.innerHTML = items.map(renderCard).join("");
        timeline.innerHTML = items.map(renderTimelineRow).join("");
      }

      filterButtons.forEach(button => {
        button.addEventListener("click", () => {
          activeFilter = button.getAttribute("data-filter");
          filterButtons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          render();
        });
      });

      sortButtons.forEach(button => {
        button.addEventListener("click", () => {
          activeSort = button.getAttribute("data-sort");
          sortButtons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          render();
        });
      });

      render();
    })();
  </script>
</div>
