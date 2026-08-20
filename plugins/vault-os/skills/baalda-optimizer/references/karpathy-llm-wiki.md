# Karpathy — LLM Wiki (April 2026)

## Contents

1. [Core thesis](#core-thesis)
2. [Why humans abandon wikis but LLMs don't](#why-humans-abandon-wikis-but-llms-dont)
3. [Three-layer architecture](#three-layer-architecture)
4. [Three operations](#three-operations)
5. [Ingest — the canonical flow](#ingest--the-canonical-flow)
6. [Query — the canonical flow](#query--the-canonical-flow)
7. [Lint — what it specifically catches](#lint--what-it-specifically-catches)
8. [Why ingest-time synthesis beats query-time RAG](#why-ingest-time-synthesis-beats-query-time-rag)
9. [Schema doc structure](#schema-doc-structure)
10. [Hard rules](#hard-rules)
11. [The 10–15 page fan-out](#the-1015-page-fan-out)
12. [Human owns vs LLM owns](#human-owns-vs-llm-owns)
13. [Dos](#dos)
14. [Don'ts](#donts)
15. [Verbatim quotes](#verbatim-quotes)
16. [Auditable signals](#auditable-signals)
17. [Practitioner critiques](#practitioner-critiques)
18. [Sources](#sources)

---

## Core thesis

Traditional RAG forces the LLM to **rediscover knowledge from scratch on every query**. Each retrieval pulls raw chunks; the LLM then re-summarizes, re-connects, re-reasons. There's no accumulation.

Karpathy's LLM Wiki flips this: **pre-digest sources at ingest time** into a maintained, cross-linked markdown wiki the LLM owns. Knowledge is compiled once and kept current, not re-derived per query. At ~100 articles / 400,000+ words the entire wiki index fits within a modern LLM's context window — enabling duplicate detection and contradiction checking without any retrieval system.

> *"the LLM is rediscovering knowledge from scratch on every question. There's no accumulation."*

> *"The knowledge is compiled once and then kept current, not re-derived on every query."*

## Why humans abandon wikis but LLMs don't

Humans abandon wikis because the maintenance burden outpaces the value. Cross-references rot, summaries go stale, edits propagate inconsistently. Wikipedia survives because of millions of contributors; private wikis die quietly.

LLMs don't have this problem:

- **Don't get bored** — maintenance is the same task whether it's Tuesday morning or 11pm
- **Don't forget cross-references** — they can scan the whole index in one pass
- **Can touch 15 files in one ingestion** without losing context
- **Don't drift on conventions** — the schema doc is re-read every operation

> *"Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass."*

## Three-layer architecture

| Layer | Purpose | Who modifies |
|---|---|---|
| **Raw Sources** | Immutable curated documents — articles, papers, transcripts, screenshots, data | **Humans only.** LLM reads, never modifies. |
| **The Wiki** | LLM-generated markdown organized by content type: summaries, entity pages, concept pages, comparisons, syntheses | **LLM owns this layer entirely.** |
| **The Schema (e.g., CLAUDE.md)** | Config doc that *"tells the LLM how the wiki is structured, what the conventions are, and what workflows to follow"* | Human-maintained. Read by LLM every operation. |

The schema layer is what makes the system work. It defines:
- How wiki pages are named
- Which folder gets which content type
- What ingest looks like
- What query looks like
- What lint looks like

In an Obsidian-based vault: the **schema = root CLAUDE.md + per-folder CLAUDE.md files**. Same architecture, different name.

## Three operations

| Op | Trigger | What it does |
|---|---|---|
| **Ingest** | New source arrives | Read source → discuss takeaways with user → write summary page → update index → revise relevant entity/concept pages → append to log |
| **Query** | User asks a question | Search wiki pages (not raw sources) → synthesize answer with citations → optionally file valuable explorations back as new wiki pages so discoveries compound |
| **Lint** | Periodic, scheduled | Health check: identify contradictions between pages, stale claims, orphan pages with no inbound links, missing cross-references |

## Ingest — the canonical flow

When a new source enters the system:

1. **Read the source.** Full read, not just abstract.
2. **Discuss takeaways with the user.** What's actually important here? What surprised us? What contradicts what we already have?
3. **Write a summary page.** New file in the wiki named per the schema.
4. **Update the index.** Add the new entry to whatever index pages reference this content type.
5. **Revise relevant entity pages.** If the source mentions a person, project, or concept the wiki already has a page for — update those pages with the new information and link back.
6. **Revise relevant concept pages.** Same as above for ideas/concepts.
7. **Append to the ingest log.** Audit trail: what was ingested, when, which pages were touched.

**One source typically touches 10–15 wiki pages.** If a source produces only one page, it wasn't fully digested.

## Query — the canonical flow

When the user asks a question:

1. **Search wiki pages, not raw sources.** The wiki is already pre-digested.
2. **Synthesize an answer with citations.** Each claim links back to the wiki page that supports it.
3. **If the query reveals a gap or new connection** — file it back into the wiki as a new page or amendment. Knowledge compounds: tomorrow's queries get better because today's exploration was captured.

This last step is critical. Queries are not throwaway. They're how the wiki grows organically.

## Lint — what it specifically catches

The lint operation is a periodic health check. Karpathy's gist names these failure modes explicitly:

| Failure mode | What it looks like |
|---|---|
| **Contradictions between pages** | Page A says "X happens monthly" — Page B says "X happens weekly" |
| **Stale claims** | A new source supersedes an old claim, but the old page still has the old claim with no link to the supersession |
| **Orphan pages** | A wiki page that has zero inbound links from any other wiki page |
| **Missing cross-references** | Entity name appears as plain text in a page body but is not a `[[wikilink]]` to that entity's page |
| **Schema non-compliance** | Page lives in the wrong folder per the schema doc, or has the wrong filename pattern |
| **Undigested sources** | A meeting transcript or article was ingested but only produced one summary page; no entity/concept fan-out |
| **Duplication** | Two pages claiming to be the canonical record for the same entity (e.g., `Brand Voice.md` and `Voice Guidelines.md`) |

This is what Pass 5 (wikilinks) and Pass 6 (duplication) of the audit skill encode.

## Why ingest-time synthesis beats query-time RAG

| Dimension | RAG (query-time) | LLM Wiki (ingest-time) |
|---|---|---|
| Compute cost per query | High — LLM re-derives every time | Low — wiki is pre-digested |
| Quality over time | Static — same chunks, same answers | Compounds — query-time discoveries get filed back |
| Cross-references | None inherent | Mandatory; orphans are lint failures |
| Contradictions | Invisible until they hit the same query | Caught by periodic lint |
| Stale information | Persists silently | Caught by lint when newer sources land |
| Provenance | Each chunk → source citation | Wiki page → source citation, with reasoning preserved |
| Maintenance | Zero (and that's the problem) | Real, but automated — LLM does it |

## Schema doc structure

A working schema doc covers:

- **Folder layout** — what kind of content goes where
- **Naming conventions** — `YYYY-MM-DD-title.md`, `Person Name.md`, etc.
- **Page types** — summary, entity, concept, comparison, decision, meeting note
- **Cross-reference rules** — every entity name in a body becomes a `[[wikilink]]`; orphan files get flagged
- **Ingest workflow** — the 7-step flow above
- **Query workflow** — search wiki first, cite, file findings back
- **Lint workflow** — what to scan for, how often
- **Frontmatter standard** — required fields per page type

In a vault built on this pattern, the root CLAUDE.md is the schema doc.

## Hard rules

| # | Rule | Auditable |
|---|---|---|
| 1 | Schema doc defines structure, naming conventions, and the three workflows | ✅ Pass 4 (routing coverage) |
| 2 | Every ingested source produces multiple downstream edits, not one note | ⚠️ Pass 3 / informational |
| 3 | Cross-references are **mandatory**; orphans are lint failures | ✅ Pass 5 / 9 |
| 4 | Stale claims (superseded by newer sources) are lint failures | ⚠️ Hard to detect — flag for manual review |
| 5 | Contradictions across pages are lint failures | ✅ Pass 6 (duplication) |
| 6 | Query-time discoveries get filed back so the wiki compounds | — |
| 7 | Human owns: source curation, asking good questions. LLM owns: writing, linking, maintenance | — |
| 8 | Raw sources are **immutable**. Never modified by the LLM | ✅ (audit can flag if Raw/ has been edited) |
| 9 | At ~100 articles / 400k words the wiki index fits in modern context windows | — |

## The 10–15 page fan-out

The most operational rule from the gist: **one ingest typically touches 10–15 wiki pages.** This is not an arbitrary number — it's what "thorough digestion" looks like in practice.

If your ingest skill or workflow only writes one summary file per source:

- The source was **not fully digested**
- Future queries will miss the context
- The wiki won't compound

What fan-out looks like for a meeting transcript:

1. New file: `meetings/team-standups/2026-04-30.md` (the summary)
2. Update: each attendee's profile page with action items
3. Update: any project pages mentioned in the meeting
4. Update: any decision pages that came up
5. Update: the index of recent meetings
6. New: a decision record if a decision was made
7. Update: the schema's "active topics" list if a new topic surfaced

Easily 10+ touches.

## Human owns vs LLM owns

| Human owns | LLM owns |
|---|---|
| Source curation (what's worth ingesting?) | Writing summaries |
| Asking good questions | Cross-linking |
| Direction of analysis | Maintaining the index |
| Strategic edits to schema | Running lint |
| Resolving contradictions when surfaced | Flagging contradictions |
| Curating ingest log | Appending to ingest log |

The human's job is **direction**. The LLM's job is **maintenance**. This is exactly why humans abandon wikis (they hate maintenance) and why LLMs make wikis viable.

## Dos

- Pre-digest at ingest, not at query.
- Maintain the schema doc / CLAUDE.md religiously — it's the constitution.
- Run lint periodically (this skill is one).
- File query findings back into the wiki.
- Touch 10–15 pages per ingestion.
- Use the wiki for cumulative knowledge; reserve raw sources as immutable canon.
- When a source contradicts an existing page, link the new page → the old, mark the old as superseded.
- When a query surfaces a new connection, write a new wiki page or amendment.
- Use the Lint operation as a recurring chore, not a one-shot.

## Don'ts

- Don't let RAG re-derive everything per query.
- Don't allow orphan pages — every wiki page needs at least one inbound link.
- Don't let stale claims live next to current ones without linking the supersession.
- Don't ingest a source and only write a single summary — propagate to entities/concepts.
- Don't modify raw sources.
- Don't let humans do the maintenance — LLMs are better at it.
- Don't skip the schema doc. Without it, the wiki drifts into folders nobody can find.

## Verbatim quotes

> *"the LLM is rediscovering knowledge from scratch on every question. There's no accumulation."*

> *"The knowledge is compiled once and then kept current, not re-derived on every query."*

> *"Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass."*

> Lint identifies *"contradictions between pages, stale claims that newer sources have superseded, orphan pages with no inbound links."*

## Auditable signals

When this skill runs Pass 5 (wikilink lint) and Pass 6 (duplication) for the wiki layer:

- **Orphan notes**: any `.md` file with zero inbound `[[wikilinks]]`. (Caveat: index files and daily notes are intentional orphans — exclude `index.md`, `Daily/`, files matching `YYYY-MM-DD.md`.)
- **Dead wikilinks**: `[[target]]` where no file by that name exists. Suggest closest filename match by Levenshtein distance.
- **Missing cross-references**: when a known entity name appears as plain text in a body, suggest converting to `[[wikilink]]`. (Heuristic: known entity = a file with that exact name exists in the vault.)
- **Same-role duplicates**: filename heuristic — `voice.md` and `brand.md` and `tone.md` likely cover the same role; flag for the user to consolidate or differentiate.
- **Single-summary ingests**: meeting/transcript files where the only modification is one summary file (no downstream entity/project/concept edits within the same day). Flag as "potentially undigested."
- **Schema non-compliance**: file in a folder not listed in the routing table of the schema doc.
- **Raw source modification**: if a `Raw/` or `sources/` folder exists, flag any file there with recent modifications by the LLM (check git log for non-human commits).

## Practitioner critiques

From Nate B Jones, "Karpathy's Wiki vs. Open Brain" (2026-04-22):

- The wiki approach is **great for connections and synthesis**, but **fragile when you need exact retrieval from structured data**.
- Pair it with a graph database or relational store when querying tabular data (catalogs, customer records, financial transactions).
- The wiki is a brain layer. Don't put data that needs aggregation, filtering, or transactional integrity in markdown.

This is why Cole Medin's `agentic-rag-knowledge-graph` and similar hybrid stacks exist: markdown for narrative + Postgres/Neo4j for structured data + MCP server as the unified interface.

The vault audit doesn't enforce this boundary — it's an architectural decision per project — but the skill **does** flag when long structured data appears in markdown (Pass 4 / Pass 9).

## Sources

- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f (the original gist)
- https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an
- Nate B Jones, "Karpathy's Wiki vs. Open Brain. One Fails When You Need It Most." (2026-04-22)
- Corey Ganim / Nick B Zark, "Claude + Karpathy's Second Brain is INSANE" (2026-04-07)
- Brad Bonanno, "Build Your Own Self Improving AI Wiki in 11 Minutes" (2026-04-15)
