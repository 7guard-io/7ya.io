# 7YA Media Recovery Sprint — Design

Date: 2026-09-05
Status: approved direction, implementation pending
Production source of truth: AppDeploy app `697a008fddc309b142`

## Goal
Turn already-recovered public media into a first-class, source-aware, playable layer of 7YA without redesigning the site or weakening evidence boundaries.

## Verified starting state
- `/api/feed.json`, `/api/health`, Public Projection and Visual Registry already exist in the AppDeploy production snapshot.
- `/media/` is a rich source-linked archive but playable modal behavior is primarily YouTube-based; the recovered 103FM source is absent.
- `/starton/` already uses real public-source visuals. The old 75s Descript StartOn concept video is AI stills + AI voice and must not be promoted as field evidence.
- Three derivative 103FM compositions were created from the real 4m10s source while leaving the original unchanged:
  - Hostage Message — 46.5–115.2s — https://share.descript.com/view/N0QpYdB7gdG
  - Holon Missile — 118.6–137.3s — https://share.descript.com/view/XLqHNeOyDJQ
  - Why I Joined — 173.2–201.8s — https://share.descript.com/view/PjbogmTaJDP

## Architecture
### 1. Recovered media registry
Create one shared typed dataset for recovered playable media. Each record contains id, title in HE/EN/RU, source/publisher, source URL, media kind, layer, provenance, exact source range, duration, verification boundary and topical tags.

Expose the runtime registry through `GET /api/media-registry` for AppDeploy client transport, and generate `/media-registry.json` as the public custom-domain machine-readable contract. The runtime route combines recovered records with relevant public projection audio/video records while keeping layer labels explicit. Recovered owner media is never silently promoted to Canon.

### 2. Media page
Add a compact `RECOVERED BROADCAST MOMENTS` section near the top of `/media/` with the three 103FM moments. Each card must be directly playable/openable from its public Descript source, show duration/context, and expose the provenance boundary.

### 3. StartOn evidence boundary
Keep `/starton/` source-first. Do not embed the old AI concept video as proof. Add a visible distinction between the documented public record and the conceptual PLAY → LEARN → CONNECT → SPEAK model. Preserve the strongest concept — learning earns access/points — as a model statement only where supported, not as claimed deployed infrastructure.

### 4. Canonical navigation
New and edited internal media/speaker/starton links use canonical path routes (`/media/`, `/speaker/`, `/starton/`) rather than creating new `?page=` links. Legacy query redirects remain compatibility shims; this sprint does not claim a server-side 301 where AppDeploy static routing does not provide one.

## Safety / evidence rules
- No private Drive auto-publication.
- No expiring Descript download URLs in source; only stable public share URLs.
- No AI-generated StartOn youth imagery presented as real participants or deployed space.
- No political or impact claim inferred from a clip beyond its documented context.
- Original 103FM composition remains untouched.

## Acceptance
1. `/media-registry.json` returns the three recovered 103FM records with stable public source URLs and explicit `RECOVERED` layer; the internal AppDeploy backend also exposes `/api/media-registry` for client transport.
2. `/media/` visibly renders all three and users can open/play them.
3. `/starton/` continues to use authentic public-source evidence and does not expose the old AI concept share URL as field proof.
4. Existing `/api/health`, `/api/feed.json`, `/api/release`, homepage and Bro Chat behavior do not regress.
5. Mobile and desktop visual acceptance for media and StartOn are checked after deploy.
