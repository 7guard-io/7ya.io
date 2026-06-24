# Deployment Runbook

Status: release-ready in the active repository.

Active source repository:

- 7guard-io/7ya.io

Current release package:

- Space Lobby homepage
- Floating 7YA Guide chatbot
- Digital Member Pass hub
- Igor Founder Pass page
- Social Signal Wall
- Visual AI Lab
- Evidence Card prototype
- GPU readiness track
- Link audit and site-health checks

Linked Vercel project:

- 7ya-io-app

Local commands:

- npm run check-all
- npm run deploy:preview
- npm run deploy:prod

Safe order:

1. Run the local checks.
2. Deploy a preview.
3. Verify preview routes.
4. Deploy production only after preview verification.

Routes to verify:

- /
- /member-pass/
- /member/igor-vepretski/
- /talk/
- /articles/
- /social/
- /labs/visual-ai/
- /labs/visual-ai/evidence-card.html
- /docs/my-links.md

Production caution:

The live 7ya.io Evidence Cockpit appears to be served by a production source that is not fully confirmed in this repository. Do not overwrite the live cockpit blindly. Publish this release only through the confirmed production source or after binding the active repository to the production domain.

Note:

GitHub Actions are currently manual only while issue #83 remains open. Do not rely on automatic CI until that blocker is resolved.
