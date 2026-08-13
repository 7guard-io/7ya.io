# 7YA Personal Flagship Design

## Goal
Make 7ya.io the official, personal, multilingual flagship site of Igor Vepretski: visually rich, technically reliable, fast, source-aware, and action-oriented.

## Product hierarchy
1. Igor Vepretski is the primary subject and visual anchor.
2. StartOn is the principal social mission.
3. Public media, writing, music, research and verified public records support the story.
4. Digital Igor / 7YA Companion is a guided action layer, not a replacement for Igor and not an impersonation.
5. Evidence, archives, technical controls and system diagnostics remain available as depth routes, not homepage clutter.

## Homepage
The homepage is reduced to six modules:
1. Personal hero — strong portrait, one-line identity, one primary CTA, one secondary CTA.
2. Selected public moments — a curated multilingual visual timeline/media strip using public source-linked assets.
3. StartOn — mission, social impact context, one primary route.
4. Proof — a restrained set of verifiable media/public-work signals with source links and dated metrics only.
5. Digital Igor — the personal growth/action companion with clear disclosure that it is an AI system based on Igor's public work and principles.
6. Contact — speaking, media, partnership and direct contact routes.

Everything else moves to depth pages: museum/archive, media, speaker, blog, research/evidence, creation/growth and technical integrity.

## Languages
Hebrew, English and Russian are first-class. Core identity, navigation, CTAs, homepage modules, SEO metadata and accessibility text must exist in all three languages. Public-source titles may remain in their source language when accuracy requires it, with localized context around them.

## Public material reuse policy
Any material Igor publicly published, or that was publicly published/shared about Igor, may be reused editorially when it is lawful and technically appropriate. Reuse must preserve source attribution where relevant, avoid inventing metrics or endorsements, and exclude sensitive/private material. Critical above-the-fold assets should be first-party optimized copies where licensing/ownership permits.

## Technical architecture
The currently applied AppDeploy runtime is treated as the execution source until its source is exported and synchronized to GitHub. The stabilization sequence is:
1. snapshot the applied AppDeploy source/version;
2. improve the live runtime in small verified changes;
3. export/synchronize the production source into the dedicated GitHub branch;
4. align release metadata and route contracts;
5. restore a canonical release path only after verification.

## Performance and resilience
- Prefer local/first-party images for hero and critical content.
- Lazy-load non-critical media and third-party embeds.
- Keep YouTube/Instagram/TikTok embeds click-to-load where possible.
- Every remote visual must have a local fallback.
- Avoid layout shift with explicit dimensions/aspect ratios.
- Mobile is a primary target, not an adaptation after desktop.

## Accessibility
- Semantic headings and landmark structure.
- Visible keyboard focus.
- Sufficient contrast.
- Meaningful alt text.
- Dialog focus/escape behavior.
- RTL/LTR behavior validated separately.

## SEO
- Unique title, description and canonical URL for each depth route.
- HE/EN/RU hreflang.
- Sitemap and robots aligned with real routes.
- Person/Organization/Article/VideoObject structured data only where supported by real content.

## Trust and identity rules
- Do not present the AI assistant as the human Igor.
- Do not publish unsupported claims or undated aggregate metrics.
- Do not expose minors' sensitive data, private family material, legal/financial details or operational/security information.
- Preserve public-source links for factual claims.

## Definition of done
The release can be called technically complete only when:
- production is `ready` with zero frontend/backend/network errors;
- all release E2E jobs have an internally consistent pass count;
- mobile and desktop visual QA show no critical overflow/crop/interaction defects;
- core routes work in HE/EN/RU;
- release metadata identifies the actual deployed version/build;
- GitHub contains the production source snapshot or an explicitly documented immutable export;
- rollback target is known;
- homepage clearly reads as Igor's personal site within the first viewport.