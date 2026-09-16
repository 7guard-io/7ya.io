# Connections Hub — verified topology snapshot

Observed 2026-09-16 (Asia/Jerusalem):

- GitHub: direct ChatGPT connector operational against `7guard-io/7ya.io`.
- Google Drive: direct connector operational; 7YA files are readable.
- GSC Wizard: both `sc-domain:7ya.io` and `https://7ya.io/` are registered/readable.
- GA4: linked and readable through GSC Wizard.
- Metricool: brand `igor.vepretski` exists and reports connected network identities for YouTube, TikTok and LinkedIn.
- Windsor.ai: plugin is installed, but `get_connectors(include_not_yet_connected=false)` currently returns zero authorized connector accounts.
- Instagram is the next recommended missing organic source to authorize through Windsor.ai. The Windsor connector uses OAuth; signed/onboarding URLs must be generated live and must not be persisted in the static repository.

This snapshot is evidence for the static Hub labels only. Static status is always dated; it is not a substitute for a fresh connector read when performing an operation.