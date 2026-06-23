---
version: 0.3.0
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
2. **Scan (full / ultra).** Once you have the goal, work over the conversation already in context and the files it referenced. Lite skips this.
3. **Check the data has a home (critical).** For every piece of work the next session needs, ask: is it saved in a file/path that session can open?
   - **Saved in a file** → reference the path. This is the normal case.
   - **Lives only in this chat** (built here, never written to disk) → it has no retrievable home, and the fresh session cannot see this conversation. Do one of these before continuing:
     - **Persist it.** Write the finalized work to a file (e.g. `<goal-slug>.md`), then point to that path.
     - **Or embed it.** If you have no filesystem (e.g. claude.ai web), put the finalized data **inline** in the handoff under the "Carried-over data" section below. Here the "path only, never copy content" rule yields, because there is nowhere else to get it.
   - **Tell the user which you did** ("the meals weren't saved anywhere, so I wrote them to `meals.md`" / "...so I embedded them in the prompt").
   - Never let the next session fall back to searching past conversations. That retrieval is fuzzy and returns fragments, which is exactly what this skill exists to prevent.
4. **Dedupe hard.**
   - Drop anything the fresh session loads on its own at startup (a root `CLAUDE.md` / `AGENTS.md`, or any always-loaded context). The new session gets these for free, so listing them just wastes context.
   - For data that does live in files: path only, never copy content.
   - If the next session works in the same folder, point to the folder. Don't enumerate its files.
5. **Anchor the location.** Name the working directory (and the project, if relevant) up front, so the fresh session knows where it is operating without asking.
6. **Write + print.** Save the prompt to the current working directory as `re-fresh-<goal-slug>.md`, then print it in full so the user can copy it.

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

After printing, tell the user in one line: paste this into a fresh chat to continue.
