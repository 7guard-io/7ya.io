# 7YA Social Embedded Terminal OS

Purpose: make `7ya.io/social/` the free, static, source-aware social embed layer for Igor Vepretski / 7YA.

This layer is built for public trust, not vanity metrics.

## What it ships

- `/social/` — public social signal wall.
- `/social/?embed=1` — clean iframe mode for partners, media kits, static pages, and embeds.
- `/social/embed.js` — script-based embed helper.
- `/social/oembed.json` — static oEmbed descriptor.
- `/social/social-routes.json` — public route manifest.
- `scripts/check-social-embed.mjs` — terminal audit for static files, oEmbed, manifest quality, and blocked unsupported claims.

## Terminal flow

```bash
git checkout main
git pull
node scripts/check-social-embed.mjs
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/social/
http://localhost:4173/social/?embed=1
http://localhost:4173/social/oembed.json
```

## Embed snippets

### iframe

```html
<iframe
  src="https://7ya.io/social/?embed=1"
  title="7YA Social Signal Wall"
  loading="lazy"
  style="width:100%;height:760px;border:0;border-radius:24px;overflow:hidden">
</iframe>
```

### script

```html
<script async src="https://7ya.io/social/embed.js" data-height="760" data-title="7YA Social Signal Wall"></script>
```

## Free smart tools policy

Use free/static-first tools before paid infrastructure:

1. GitHub repository as source of truth.
2. GitHub Pages or Cloudflare Pages as static deployment fallback.
3. Cloudflare DNS/CDN when domain control is available.
4. Plain HTML/CSS/JS before frameworks.
5. JSON manifests before databases.
6. Terminal audit scripts before paid monitoring.
7. Manual evidence classification before AI-generated claims.

## Public trust rules

Allowed:

- Public profile links.
- Source-aware descriptions.
- Static embeds.
- JSON-LD for the public entity graph.
- oEmbed discovery metadata.

Blocked unless visibly sourced:

- Follower counts.
- View counts.
- Sponsorship claims.
- Platform endorsement claims.
- Government or institutional endorsement claims.
- Political rank or candidacy claims.
- Private family material.
- Non-public personal data.

## Humanitarian framing

The social layer should route attention toward useful public work: StartOn, civic technology, AI literacy, youth opportunity, evidence discipline, and digital sovereignty.

Short version: use social platforms for distribution, but keep truth, context, and control on `7ya.io`.
