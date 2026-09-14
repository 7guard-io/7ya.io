# Unified Public Media Library Design

**Goal:** Remove the 91-item ceiling from the Hebrew 7YA media room without creating a second archive system.

## Approved architecture

`/library/` already reads from Public Projection, which joins Canon, Discovery, Live Social, owner-authorized Meta records, public surfaces and graph objects. The media room will reuse that same projection and merge it with the existing 91-item `deepMedia` curated layer in the client.

The curated 91 remain authoritative editorial selections; Public Projection supplies breadth and freshness. Items are deduplicated by normalized canonical source URL, including canonicalized YouTube video IDs and stripped tracking parameters. Public profiles are excluded from the media-item wall so the result remains content-first.

## User-visible behavior

- `/media/` shows a merged item count greater than 91 when Public Projection contains additional unique objects.
- The ledger separately exposes the 91 curated base, merged library size, known public-object count, source count and Public Projection status.
- Existing search, category filters, playback and source actions operate over the merged inventory.
- `/library/` remains the full archive surface backed directly by Public Projection.
- Original/public source visuals remain preferred; blocked visuals fall back to clearly marked source posters rather than invented imagery.

## Constraints

- No automatic external publishing.
- No private-source promotion into the public library.
- Canon, Discovery and Live remain visibly distinguishable through source status.
- No duplicate source URL should appear twice in the merged media wall.
- Mobile behavior must remain usable at 375×667.
