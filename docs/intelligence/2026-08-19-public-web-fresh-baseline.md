# Public Web Fresh Baseline — 2026-08-19

## Scope

Fresh pass performed against the public internet. **Google Drive was not used as a live metric source.** Drive is reserved for recovery of deleted, blocked, historical or otherwise inaccessible public material.

Owned public pages may be used as first-party public sources but are not treated as independent corroboration. The baseline below emphasizes independent/publicly indexed web evidence where available.

## Current audience / account telemetry

### TikTok — current account

Independent public third-party index Heepsy, crawled within the last month:

- handle: `@igor.vepretski`
- followers: **12.6K**
- engagement: **0.15%** on the profile page (ranking page rounds to 0.1%)
- average reactions: **18.50**
- estimated average reach: **599**
- posting cadence: **2.47 posts/week**
- activity recency: **3.4 days** at Heepsy crawl

Source: https://www.heepsy.com/es/tiktok-profile/igor.vepretski

### LinkedIn

Multiple public LinkedIn post/profile crawls from the last ~1–2 months expose a narrow changing range:

- followers: **4,282–4,322**
- posts: **325–330**
- articles: **5**
- connections: **500+**

This range is preferable to a stale single snapshot because LinkedIn search pages were captured on different crawl dates.

### Instagram

Independent public Pixnoy/Pixwox index, crawled about six months before this baseline:

- followers: **8,368**
- posts: **938**
- following: **7,493**

This is a stale but independently indexed public observation, not a current same-day metric.

### X

Public indexed profile crawl:

- followers: **24**
- following: **280** in the more recent indexed result
- joined: **October 2011**

### Spotify / music

Public Spotify web crawl:

- artist identity: **Ido Vepretski**
- monthly listeners: **16** at crawl
- visible releases include `מת על אקסל`, `פרח במדבר`, `חצופה`
- public track page for `מת על אקסל` exposes **16,667** on the popular-track counter

Public Amazon Music artist page additionally exposes five releases under Igor/Ido Vepretski, including `СупаПорп`, `חצופה`, `פרח במדבר`, `מת על אקסל`, `אני עידו`.

## Public-web audience relationship floor

Using only independently/publicly indexed follower-style counts currently available in this fresh pass:

- TikTok: 12,600
- LinkedIn: 4,282 (lower end of current crawl range)
- Instagram: 8,368 (stale independent index)
- X: 24

**PUBLIC_WEB_AUDIENCE_RELATIONSHIP_FLOOR = 25,274**

This is **not unique people** and excludes Facebook and YouTube because a fresh independent same-day count was not recovered in this pass. It also excludes Spotify monthly listeners because that is a different metric class.

## Public-web exposure floor reconstructed without Drive

Two public LinkedIn analytics posts expose non-overlapping TikTok performance periods:

1. **2024 annual recap:** 3.8M video views; >129K likes; >20K comments; >21K shares; 41K profile visits.
2. **14-day viral window in 2025:** 3,877,477 views; 181,849 interactions; 4.92% average engagement.

Because the first metric explicitly covers calendar year 2024 and the second is a later 14-day 2025 window, they can be kept as distinct time windows.

**PUBLIC_WEB_DOCUMENTED_TIKTOK_VIEW_EVENT_FLOOR = 7,677,477**

This is a view-event floor, not unique viewers and not lifetime reach.

## Public-web interaction floor

Across those same non-overlapping TikTok periods:

- 2024: >129K likes + >20K comments + >21K shares = **>170,000 interaction events**
- later 14-day window: **181,849 interactions**

**PUBLIC_WEB_DOCUMENTED_TIKTOK_INTERACTION_FLOOR = >351,849**

Do not add profile visits to interaction totals; keep them as a separate conversion/attention metric.

## Public identity / surface graph recovered from the live web

Linktree currently exposes at least 13 explicit external platform/contact routes: Instagram, Facebook, YouTube, X, TikTok, LinkedIn, Spotify, WhatsApp, Apple Music, Apple Podcasts, Snapchat, Threads and Telegram.

Gravatar independently exposes **7 verified account connections**, including Threads, TikTok, GitHub, Facebook, YouTube and Instagram.

Fresh search also surfaced public identity/content nodes on LinkedIn, Heepsy, Pixnoy, X, Spotify, Apple Music, Amazon Music, SoundCloud, Linktree, Gravatar, Hidabroot, mynet, Zman Yisrael, Mindset, Medium, IZI, Wikimedia Commons and Slaps — **18 distinct public domains in this pass** before archive recovery.

## Independent / third-party public publication and amplification nodes surfaced

Examples recovered directly from live public web search:

- mynet Holon — StartOn / return-to-neighborhood profile, 13 May 2022.
- Hidabroot — fatherhood post picked up as a network-viral story, 20 Feb 2023.
- Zman Yisrael — public author page and at least two authored columns from Nov 2022.
- Mindset — independent podcast episode, 20 Sep 2022.
- Podbean — public mirror of Mindset episode 102.
- Spotify / Amazon podcast surfaces — public podcast distribution with episodes dated Jan 2024 and source links to interviews/media.
- Medium — public long-form authored article, 7 Oct 2024.
- Wikimedia Commons — public CC0 portrait asset.
- Kol Sherut — public StartOn service/lecture entries.
- Fresh.co.il — historical public IDF-era article snippet naming Igor Vepretski as a team sergeant in Palsar 401.

## Live-web limitations discovered

- TikTok direct crawling is blocked; current account telemetry requires public third-party indexes unless direct platform access becomes available.
- Instagram direct fetch failed; an independent index is available but stale.
- Facebook direct page fetch/search did not expose reliable current counts in this pass.
- YouTube channel opens publicly but the crawler did not expose current subscriber/video counters; public search currently resolves the channel identity but not a fresh independent numeric snapshot.
- Therefore Facebook and YouTube are **not included** in the fresh independent audience-floor arithmetic yet.

## Operating decision

Live measurement must now be **web-first**. Drive is only a recovery/archive lane.

`LIVE WEB → PUBLIC INDEX → OWNED PUBLIC SOURCE → ARCHIVE RECOVERY (ONLY IF NEEDED)`

Next priority is to close the Facebook and YouTube current-number gaps, enumerate public post/video objects directly from the web, and expand derivative/repost discovery without importing Drive numbers into the live baseline.