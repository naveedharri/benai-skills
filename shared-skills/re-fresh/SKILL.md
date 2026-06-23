---
version: 0.5.0
name: re-fresh
description: |
  Start a clean Claude session with only the context the next task needs, instead of /compact.
  Captures the goal of your next session, points to the right files (never copies them),
  and outputs a self-contained prompt to paste into a fresh chat.
  Use when: "re-fresh", "refresh context", "fresh start", "my chat got sloppy",
  "start a new chat with context", "hand off this session", outputs degrading, drifting off task.
  Three levels: lite (quick reset), full (default handoff), ultra (full briefing).
  NOT for: summarizing in place (that's /compact), or saving permanent notes.
argument-hint: "lite | full | ultra"
allowed-tools: Read, Glob, Grep, Write
---

# Re-fresh

Long sessions rot: the window fills with stale back-and-forth and outputs get worse. `/compact` summarizes the mess in place and keeps going in the *same* polluted window. Re-fresh does the opposite. It captures the goal of your next session, points to the right files, and hands you a clean prompt to paste into a fresh chat. Rebuild, not summarize.

## UX Rules

1. Ask exactly one question: the goal. Don't interrogate.
2. **Wait for the answer. Stop your turn after asking.** Do not generate the prompt, a draft, or a "default / in the meantime" handoff before the user replies with the goal. The only exception: the user already stated the goal in the trigger, in which case skip the question and proceed.
3. Reference files by **path only**, never copy file content, **but only when the data lives in a file the next session can open.** The fresh session cannot read this chat. So never hand it a pointer to data that has no retrievable home, see the persistence check in the workflow.
4. Be concise. The output is a prompt the user pastes, not a report. No preamble around it.
5. Default level is `full` when none is given.

## Levels

- **lite**: quick reset, no scan. Goal, next 3 steps, open decisions, and bare file paths. A sticky note.
- **full** (default): handoff doc. Everything in lite, plus what's done, key decisions, and file pointers each with a one-line "why it matters".
- **ultra**: full briefing. Everything in full, plus dead-ends to avoid, paths to any relevant data or log files, and suggested skills for the next session to run.

## Workflow

1. **Get the goal.** Ask "What's the goal of your next session?" then **end your turn and wait**. Do not run any step below until the user answers. Skip this step only if the goal was already stated in the trigger.
2. **Decide where the handoff is going (critical).** A handoff is only useful if its reader can reach the files it references. Figure out the destination:
   - **Stays here** — you, same machine, continuing in a fresh chat in the same project. Local absolute paths are fine. This is the default.
   - **Travels** — it will leave this machine/context: shared with a teammate, sent to another PC, emailed, or even saved by you into an unrelated folder away from the referenced files. Here local paths break, the reader does not have them.
   - **How to decide:** if the goal says share / send / hand off to someone / for [a person] / another machine / email it, OR the handoff will be saved somewhere that doesn't sit alongside the referenced files, treat it as **travels**. If genuinely unclear, ask once: "Is this for you to continue here, or to send somewhere else (teammate / another machine / a different folder)?"
   - **In travels mode, the handoff must be portable** (see step 4): no absolute sender-local paths; every referenced file is either embedded, bundled, or pointed at a source the reader also has.
3. **Scan (full / ultra).** Once you have the goal, work over the conversation already in context and the files it referenced. Lite skips this.
4. **Check every referenced thing is reachable by the reader (critical).** For every piece of work the next session needs, ask: is it saved somewhere that session can open AND that survives into a fresh environment?
   - **A "home" must be persistent.** Three tiers:
     - **Persistent disk** (the user's real/mounted project folder, e.g. `/Users/.../Projects/...`) → survives. Reference the path.
     - **Remote server** (e.g. a Higgsfield `media_id`, a URL) → survives. Reference the id/URL instead of copying.
     - **Ephemeral** (a sandbox scratchpad like `outputs/`, a `/tmp` path, or data that lives only in this chat) → does **not** survive. A pointer here is worthless next session.
   - **In a sandbox (e.g. Claude Cowork), the scratchpad is wiped every session.** Only the mounted real-disk folder and remote servers persist. So:
     - If a needed asset lives only in the scratchpad or only in this chat → **copy it to the persistent project folder first** (or, for remote-regenerable assets, reference the remote id), then point to the new persistent path.
     - If there is no filesystem at all (e.g. claude.ai web) → **embed** the finalized data inline under "Carried-over data" below.
   - **If it TRAVELS (share / another machine / a different folder), persistence is not enough, it must be portable.** The reader does not have your disk, so a `/Users/<you>/...` path is useless to them. For each referenced file:
     - **In a shared source the reader also has** (shared Git repo, Relay/shared vault, shared Google Drive, Notion, a URL) → reference the *shared* identifier (repo-relative path, vault name + path, the link). **Strip your absolute local prefix.**
     - **Local-only** → make it self-contained: **embed** the file's full content inline (best for small/critical files like a single voice profile), or **bundle** the needed files into the handoff folder and reference them by their relative location ("the attached `ben-voice.md`").
     - **Never emit an absolute sender-local path in travels mode.**
   - **Tell the user which you did** ("the anchor only existed in the sandbox, so I copied it to `Resources/.../reference-anchor.png`" / "it's going to a teammate, so I embedded the full `ben-voice.md` and dropped the local paths").
   - Never reference a scratchpad/`/tmp` path, and never let the reader fall back to searching past conversations. That retrieval is fuzzy and returns fragments, which is exactly what this skill exists to prevent.
5. **Dedupe hard.**
   - Drop anything the fresh session loads on its own at startup (a root `CLAUDE.md` / `AGENTS.md`, or any always-loaded context). The new session gets these for free, so listing them just wastes context. (Skip this drop in travels mode, the reader's environment won't auto-load your files.)
   - For data that does live in files the reader can reach: path only, never copy content.
   - If the next session works in the same folder, point to the folder. Don't enumerate its files.
6. **Anchor the location.** Name the working directory (and the project, if relevant) up front, so the fresh session knows where it is operating without asking. In travels mode, skip your absolute local path, name the project/shared source instead.
7. **Write + print.** Save the handoff to a **persistent** location (the user's real project folder), never a sandbox scratchpad or `/tmp`. If you can't tell which path is persistent, ask once. Decide the shape:
   - **Single file** (default): `re-fresh-<goal-slug>.md` in the project root. Use when the handoff is just pointers plus inline text and every asset it references is already reachable by the reader. Nothing to carry → one file.
   - **A folder** `re-fresh-<goal-slug>/` (the `.md` plus the assets inside it): use when you had to physically carry assets, sandbox-only, chat-only, or (in travels mode) local-only files the reader doesn't have. Reference them by their relative in-folder paths. More than one file to carry → a folder; in travels mode this folder is what the user sends/zips to the reader.
   - **Either way, always print the full prompt in chat, that is the thing the user pastes/sends.** The output is the same single prompt in both cases. In the folder case the printed prompt references the folder (by local path for "stays here", by relative path for "travels") and names the key files inside it, so the user never needs to open the folder themselves. Mention in one line that a folder was created and where.
   - **In travels mode, tell the user exactly what to hand over:** just the prompt (if everything is embedded or in a shared source), or the prompt **plus** the folder/zip (if files were bundled).

## Output shape

Emit exactly this, filled in. Omit sections that don't apply to the level.

```
# Session refresh — <goal>

Continuing work in <project / working directory>. Goal of this session: <goal>

## Where things stand        (full + ultra)
<what's done, key decisions>

## Next steps
1. ...

## Files to open (read these, don't re-derive)
- <path> — <why it matters>

## Carried-over data          (only if it lives nowhere else)
<finalized data that exists only in this chat, verbatim — so the next session has it>

## Avoid repeating            (ultra only)
- <dead-end / rejected approach>

## Skills to run              (ultra only)
- /<skill>
```

After printing, tell the user in one line what to do with it: "paste this into a fresh chat to continue" (stays here), or "send this to your teammate, they paste it into a fresh chat" plus what to attach (travels).
