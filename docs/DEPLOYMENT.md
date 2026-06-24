# Deployment Runbook

Status: active repo is linked for Vercel CLI deployment.

Active source repository:

- 7guard-io/7ya.io

Linked Vercel project:

- 7ya-io-app

Local commands:

- npm run check-site
- npm run deploy:preview
- npm run deploy:prod

Safe order:

1. Run the local site check.
2. Deploy a preview.
3. Verify the preview routes.
4. Promote or deploy production only after preview verification.

Routes to verify:

- /
- /talk/
- /articles/
- /labs/visual-ai/
- /labs/visual-ai/evidence-card.html

Note:

GitHub Actions are currently manual only while issue #83 remains open. Do not rely on automatic CI until that blocker is resolved.
