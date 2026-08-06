# Instagram Link Hub Design

**Date:** 2026-08-06  
**Owner:** Igor Vepretski  
**Canonical route:** `https://7ya.io/go/`

## Goal

Replace the overloaded external link-list experience with a short, owned, mobile-first 7YA gateway that answers three questions immediately: who Igor is, what he is building, and how the visitor can act.

## Information hierarchy

1. Igor Vepretski identity and the line `אדם. שליחות. פעולה.`
2. Six prioritized routes: Igor, 7YA, StartOn, media, evidence, contact
3. Six verified social profiles: Instagram, TikTok, YouTube, Facebook, X, LinkedIn
4. Secondary channels: Threads, Telegram, Spotify

## Design direction

- Hebrew RTL and mobile-first
- restrained dark institutional palette with gold signal accents
- one approved Igor portrait; no collage and no invented visual evidence
- large touch targets, clear focus states, no horizontal overflow
- no unsupported reach, follower, partnership, or authority claims

## Routing and SEO

- `/go/` is canonical and indexable
- `/links/` is a noindex alias that redirects to `/go/`
- add `/go/` to `sitemap.xml`
- expose `ProfilePage` and `Person` structured data

## Acceptance criteria

- unique heading `הקישורים הרשמיים של איגור ופרצקי`
- unique line `אדם. שליחות. פעולה.`
- six primary action cards and all six primary social links render on mobile
- canonical URL is `https://7ya.io/go/`
- existing 7YA routes remain unchanged
