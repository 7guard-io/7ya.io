# Canonical Corpus Ingestion Batch 01 — 2026-08-17

Status: VERIFIED-SOURCE BATCH · CODE-SEED CANDIDATES · NO DB MUTATION

Purpose: expand the canonical corpus without inflating the homepage life stream. Every record below has an exact public source URL and a dated publisher/public-index basis. These items must be tagged for supporting surfaces (archive/media/writing/starton/influence) and must NOT receive the `life` surface in this batch.

## 1. StartOn television coverage — Channel 13
- canonical id: `starton-channel13-2022-05-22`
- source date: 2022-05-22
- source: Channel 13 / העולם הבוקר
- URL: https://prod.13tv.co.il/item/news/haolam-haboker/season-01/clips/u0uoy-903061791/?pid=44
- relation: supporting record of `starton-return-2022`
- surfaces: media, starton, archive
- verification: verified publisher page

## 2. Glass Ceilings podcast episode 18
- canonical id: `glass-ceilings-2022-09-06`
- source date: 2022-09-06
- source: Podbean / שחר קאיקוב
- URL: https://kaikovshahar.podbean.com/e/%D7%9E%D7%A0%D7%A4%D7%A6%D7%99%D7%AA%D7%A7%D7%A8%D7%95%D7%AA-%D7%94%D7%96%D7%9B%D7%95%D7%9B%D7%99%D7%AA%D7%A4%D7%A8%D7%A718/
- relation: long-form supporting record around StartOn and life-story transition
- surfaces: media, starton, archive
- verification: verified public podcast page

## 3. Mindset episode 102
- canonical id: `mindset-social-entrepreneur-2022-09-20`
- source date: 2022-09-20
- source: Mindset / שלומי חסטר
- URL: https://mindset.org.il/%D7%9E%D7%A0%D7%A2%D7%A8-%D7%91%D7%A1%D7%99%D7%9B%D7%95%D7%9F-%D7%9C%D7%99%D7%96%D7%9D-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%90%D7%99%D7%92%D7%95%D7%A8-%D7%95%D7%A4%D7%A8%D7%A6%D7%A7%D7%99-%D7%A4/
- distribution mirror: https://open.spotify.com/episode/0t2lzatmzK8RJP5B88sOUw
- relation: long-form supporting record of StartOn / transformation story
- surfaces: media, starton, archive
- verification: verified publisher page plus distribution mirror

## 4. Cost-of-living public post propagation
- canonical id: `cost-of-living-post-2022-10-14`
- source date: 2022-10-14
- source: סטטוסים מצייצים
- URL: https://www.facebook.com/lan2lan.sta2sim/posts/%D7%9E%D7%A8%D7%AA%D7%99%D7%97-%D7%90%D7%95%D7%AA%D7%99-%D7%94%D7%9E%D7%A6%D7%91-%D7%94%D7%96%D7%94%D7%90%D7%99%D7%92%D7%95%D7%A8-%D7%95%D7%A4%D7%A8%D7%A6%D7%A7%D7%99/667549874740678/
- relation: external propagation of civic/public voice
- surfaces: influence, archive
- verification: verified indexed external post; no reach metric added

## 5. Authored column — My son does not have TikTok
- canonical id: `zman-tiktok-column-2022-11-10`
- source date: 2022-11-10
- source: Zman Yisrael
- URL: https://www.zman.co.il/350569/
- relation: authored writing on parenting, technology and belonging
- surfaces: writing, media, archive
- verification: verified publisher page and authorship

## 6. Authored column — The rules of the game have changed
- canonical id: `zman-digital-education-2022-11-27`
- source date: 2022-11-27
- source: Zman Yisrael
- URL: https://www.zman.co.il/352289/
- relation: authored writing on education and the digital environment
- surfaces: writing, media, archive
- verification: verified publisher page and authorship

## Ingestion guardrails
- No record in this batch receives the `life` surface.
- No generic fallback image is attached. Where no authentic media asset is verified, use an explicit `source-card`.
- No reach/view metric is added unless the metric has its own dated source snapshot.
- Exact publication/source dates remain factual dates; `storyOrder` is a separate narrative rank.
- Cross-platform mirrors are sources/derivatives of one canonical record, not extra canonical events.
