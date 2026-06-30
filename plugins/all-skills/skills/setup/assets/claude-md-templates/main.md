# Sales OS

{{Rep name}}'s sales operating layer. A second brain plus the routines and skills that keep it current and act on it. Read this before working in any subfolder, then read `MAP.md` for orientation and `MEMORY.md` for why the OS is the way it is.

## What this is

The second brain holds everything about the sales world: the offer, the ICP, the process, every active deal, every sales call, the templates, and the intelligence. Skills read this context before they act, and routines write back to keep it current. The CRM ({{crm_name}}) stays the system of record. This OS augments it with the unstructured context, the intelligence, and the working layer.

## The core rule: brain-update versus action

> [!important] If it changes what the OS knows, it logs. If it just acts, it does not.
> Brain-update routines change the second brain's state of knowledge and log their work to `Daily/logs/`. Action automations perform an external task or create a deliverable and do not log.

## Routing: what goes where

| Topic | Folder |
| --- | --- |
| Offer, ICP, process, positioning, voice, the rep, the stack, config | `Context/` |
| Outbound campaigns, cadences, the lead-gen SOP | `Lead-Gen/` |
| One file per active deal, plus the metrics file | `Deals/` |
| One file per sales call: summary, notetaker link, score | `Calls/` |
| Proposal, one-pager, and other masters | `Templates/` |
| The monthly and quarterly reports | `Intelligence/` |
| The rolling task list and the daily routine logs | `Daily/` |
| The manifest of installed routines and skills | `Skills/` |

## Conventions

- **Deals:** one file per prospect, named by the prospect. Tracking freezes the moment a deal is won or lost.
- **Calls:** sales calls only, classified by attendee not title. Summary plus the {{notetaker_name}} link, never the full transcript. Score first calls only.
- **Tasks:** one rolling `Daily/tasks.md`.
- **Logs:** one `Daily/logs/YYYY-MM-DD.md` per day, every brain-update routine writes to it, no silent writes.
- **CRM:** {{crm_name}}. Augment, never replace.
- **Voice:** inherit `Context/voice.md`. Never use em dashes.
- **Self-model:** `MAP.md` is the one-page orientation, `MEMORY.md` is the durable record. Update `MAP.md` on any structural change (a folder, file, rule, or capability); append to `MEMORY.md` on any decision or durable fact. Keep them in lockstep with these CLAUDE.md files.
- Wikilink every entity, woven into sentences.

## Routines run on local scheduled tasks

Every brain-update routine runs as a local scheduled task against this folder. Turning the vault into an MCP and running cloud routines is an advanced option the rep can take later.
