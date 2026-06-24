# Publication Status

Status: RELEASE READY IN ACTIVE REPOSITORY

Date: 2026-06-24

Release package:

- Space Lobby homepage
- Floating 7YA Guide chatbot
- Digital Member Pass
- Igor Founder Pass page
- Social Signal Wall
- Visual AI Lab
- Evidence Card prototype
- GPU readiness track
- Public links map
- Link audit
- Site health check

Production rule:

Do not claim that this release is live on 7ya.io until the production source is confirmed and the live routes are verified.

Publish order:

1. npm run check-all
2. npm run deploy:preview
3. verify preview routes
4. npm run deploy:prod
5. verify live routes

Critical live routes:

- /
- /member-pass/
- /member/igor-vepretski/
- /talk/
- /social/
- /labs/visual-ai/
- /labs/visual-ai/evidence-card.html
- /docs/my-links.md
