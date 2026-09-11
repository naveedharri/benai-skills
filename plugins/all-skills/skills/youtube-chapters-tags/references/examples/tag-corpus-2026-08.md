# Tag corpus, measured 2026-08-25

Raw evidence behind `tagging-pattern.md`. Read off the `keywords` field of the 15 most recent
published videos on `UC3KK7ENB_ierAXvrxVNnbZQ`. 390 tags, 253 unique.

## Aggregate

| Measure | Min | Max | Median |
|---|---|---|---|
| Tags per video | 18 | 32 | 26 |
| Characters, commas included | 327 | 451 | 441 |

## Most frequent tags, by occurrence

`Ben AI` 16, `claude skills` 12, `Claude Cowork` 11, `Claude Code` 11,
`Claude Cowork tutorial` 8, `claude mcp` 7, `ai for business` 6, `best claude skills` 6,
`claude connectors` 5, `claude ai` 5, `claude cowork use cases` 5, `claude.md` 5,
`ai operating system` 5, `claude skills tutorial` 4

## Presence, by number of videos containing the tag

`Ben AI` 14/15, `claude skills` 12/15, `Claude Cowork` 11/15, `Claude Code` 11/15,
`claude mcp` 7/15, `best claude skills` 6/15, `claude.md` 5/15, `claude connectors` 5/15,
`claude cli` **1/15**

## Three full lists

### The closest sibling to a skills video

`rjtZv2eXeR4` "How to Actually Build Claude Skills like a Pro", 26 tags, 444 characters

> claude skills, claude skills guide, claude skills explained, skills, ai automation,
> claude code skills, claude cowork skills, Claude, claude skills tutorial, claude cowork,
> Claude Code, Claude cowork skills, codex skills, claude skills examples, claude plugins,
> ben ai, learn skills, AI, claude skills for business, claude skills for beginners,
> claude skills tips, claude for sales, claude for marketing, claude for agencies,
> claude for business, claude skills advanced

Note: eight modifier variants on the core phrase, five vertical framings, three broad
catch-alls (`skills`, `Claude`, `AI`), one brand tag. Also note the casing duplicate
`claude cowork skills` / `Claude cowork skills`, which wastes budget.

### A tool-integration video: almost pure cross-product

`M_E460gRHIQ` "How to Connect ANY App to Claude Instantly (with 1 click)", 26 tags, 446 characters

> claude google drive, claude google sheets, claude google docs, claude google calendar,
> claude google analytics, claude microsoft, claude linkedin, claude microsoft teams,
> claude outlook, claude excel, claude drive, claude meta ads, claude meta ads connector,
> claude google ads, claude linkedin ads, claude pinterest, claude reddit, claude hubspot,
> claude instagram, claude whatsapp, claude twitter, claude facebook, claude youtube,
> claude mcp, claude connectors, composio

Note: no `Ben AI`, no `Claude Skills`, no `claude.md`. This is the clearest evidence against
the idea of mandatory brand staples.

### A how-to video: how-to tags and model names

`ZdTNbziWxqE` "How to Run AI Locally in 18 Min (Easy Setup)", 32 tags, 410 characters

> local ai agent, local ai, kimi k3, glm 5.2, deepseek v4, qwen, private ai,
> how to run ai locally, secure ai, local ai for business, open source ai, ai agents,
> lm studio, goose ai, claude code local model, claude code local llm, local llm,
> local llm setup, local llm server, local llm agents, runpod, ovhcloud, Ben AI, claude ai,
> running llm locally, deepseek, ollama

Note: `how to run ai locally` mirrors the title, and `local ai for business` is a vertical
framing. Both were banned by the lost rules and both are real.

## How to re-measure

```js
const h = await (await fetch('/watch?v=VIDEO_ID')).text();
const m = h.match(/"keywords":(\[.*?\]),"/s);
JSON.parse(m[1].replace(/\\u0026/g,'&'))
```

Get the id list from the InnerTube uploads recipe in `chrome-transcript-extraction.md`. The
uploads list excludes unlisted videos, so the video being prepped will not appear in it.
