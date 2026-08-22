# 7YA App Shell v2 — Design

## Goal
Turn the existing static-first 7YA site into one coherent product surface without discarding the canon, evidence corpus, media, or route-level content.

## Product model
7YA is a personal digital universe, not a command dashboard. The global shell must make the site feel like one continuous life archive while preserving source provenance and static indexability.

## Architecture
- Keep static HTML routes as the primary rendered content.
- Inject one global App Shell at build time into every public HTML route except `404.html`.
- Use one route/config source for global navigation and search labels.
- Replace the globally injected legacy Control palette with the App Shell v2 runtime; keep legacy Control assets available for `/control/` compatibility.
- Lazy-load knowledge datasets only when search/Ask is opened.
- `Ask 7YA` performs local retrieval first, then optionally calls the serverless chat endpoint with only selected public snippets as context.
- If no AI key/model is configured, Ask remains useful as retrieval-only search and never fabricates an answer.

## UX
### Desktop
A compact translucent global rail contains brand, primary life routes, current context, Search, and Ask 7YA. Page-specific legacy topbars are absorbed: their useful same-page links become contextual links in the shell and the duplicated legacy topbar is hidden after shell initialization.

### Mobile
Use a five-item bottom dock: Home, Life, Media, Search, Ask. Keep the top surface minimal so imagery and story content dominate.

### Search
Search ranks:
1. Current page headings/anchors.
2. Canonical routes.
3. Public universe records.
4. Public response signals.
5. Evidence claims.

### Ask 7YA
- Answer in the user's language.
- Use provided public context only.
- Distinguish verified/source-backed material from insufficient evidence.
- Never invent personal facts, impact metrics, quotations, or source claims.
- Return useful source links alongside the answer through the client retrieval results.

## Visual system
- Dark graphite / near-black shell, warm off-white text, restrained warm-metal accent.
- No dashboard/status jargon in public navigation.
- High contrast and visible keyboard focus.
- Reduced-motion support.
- Safe-area handling on iOS.

## Performance
- No framework hydration.
- Shell JavaScript is deferred and dependency-free.
- Knowledge JSON is fetched only after explicit Search/Ask intent.
- No new render-blocking third-party resources.
- Existing critical hero preload remains untouched.

## SEO / AEO
- Keep canonical route HTML and current metadata/JSON-LD.
- Do not move primary content behind JavaScript.
- Preserve crawlable route URLs and source links.
- Global shell is enhancement, not the content source.

## Accessibility
- Skip links and existing document semantics remain intact.
- Shell controls expose labels, dialog semantics, focus management, Escape handling, and 44px+ mobile tap targets.
- `prefers-reduced-motion` is respected.

## Release constraint
Implementation happens on `feat/7ya-app-shell-v2`. No production deployment is part of this design task.