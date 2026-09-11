# Step 1: Pull titles and thumbnails off the Notion card

Everything here runs on the Notion MCP. Do not open Notion in a browser.

## 1. Find the card

Pipeline database: `2f111245-70fe-802b-aabd-d23302ab39b1`
Data source: `collection://2f111245-70fe-80ec-b9ed-000b4a3ce366`

If you were given a Notion URL, go straight to `mcp__Notion__notion-fetch`. Otherwise
`mcp__Notion__notion-query-data-sources` on the data source above, filtered to
`Stage IN ('Editing', 'Ready to publish')`, and match on `Name`.

Card properties: `Name`, `Stage`, `Priority`, `Video type`, `Stage owner`.
Stage values in order: Scratchpad, Scouted Ideas Today, Pre Outline, Checkin With Ben,
Packaging + Structured, Ideating Use Cases, Backlog, Preparing Demo, Ready to film,
Editing, Ready to publish, Published, Trash.

## 2. Read the two A/B titles

The A/B titles live in the card body as the **caption underneath each thumbnail image**,
not in a property. In the fetched Markdown they appear as a line of plain text directly
after each `![](...)` image.

Take them in document order: first image caption = variant 1, second = variant 2.

Checks before continuing:
- Two captions present. If only one, ask the user for the second title.
- Both under 100 characters (YouTube's limit). Report the count for each.
- If both captions are byte-identical, say so and ask whether that is intentional. A test
  with two identical titles measures nothing, but it is sometimes deliberate when only the
  thumbnails differ.

## 3. Download the two thumbnails

The image URLs in the fetched Markdown are presigned S3 links that expire in 300 seconds.
Fetch them immediately after the fetch call. If a download 403s, re-run
`mcp__Notion__notion-fetch` to get fresh URLs.

```bash
mkdir -p /mnt/user-data/outputs/thumbs
curl -sS -o /mnt/user-data/outputs/thumbs/variant-1.png "<first image URL>"
curl -sS -o /mnt/user-data/outputs/thumbs/variant-2.png "<second image URL>"
file /mnt/user-data/outputs/thumbs/*.png
```

Quote the URLs. They contain `&` and will break the command unquoted.

Verify with `file`: each must be a PNG or JPEG, 1280x720 or larger, 16:9, under 2 MB
(YouTube's cap is 2 MB per thumbnail). If one is over, downscale with
`python3 -c` and Pillow rather than asking the user to re-export.

Keep the mapping straight and report it: variant-1.png is the first image on the card.

## Publish-state properties

The card carries the pipeline's state (added 2026-08-20). Read these instead of asking the user for
anything already recorded:

`Video ID`, `UTM code`, `Chapters`, `Tags`, `Referenced videos`, `Lead magnet`, `Kit page URL`,
`Bitly imported`.

If `UTM code` is empty, `benai-utm-creator` has not run. If `Bitly imported` is unchecked, the
description's links are not live yet: run `youtube-link-setup` first rather than writing a
description full of dead links.

## 4. Stage update (step 5 of the skill, not now)

When the setup is done:

```
mcp__Notion__notion-update-page
  page_id: <card id>
  properties: {"Stage": "Ready to publish"}
```

Only touch `Stage`. Leave `Stage owner` and `Priority` as they are.
