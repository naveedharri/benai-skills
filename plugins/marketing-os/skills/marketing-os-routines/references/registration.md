# Registration

**A routine is a schedule.** Creating one means creating a scheduled task, not explaining how to create one. Pick the mechanism per the table in SKILL.md and use it.

## Schedules

Each routine file carries its cadence in the `schedule:` frontmatter field and restates it in the **Set it up** table at the top. That is the source. The `routines:` block in `Context/config.md` carries the same times so the two can be diffed, and if they disagree the routine file wins and the disagreement is a finding.

Times are in the operator timezone from `Context/config.md`. **Confirm the scheduler interprets them in that zone**, because a routine firing at 07:30 UTC when the operator meant 07:30 local is a real and silent failure.

## The ten, and when each runs

Cadences stay in these words. **Do not translate them into a cron expression**, and do not pick a scheduling tool: ask for the scheduled task in plain language and let the environment create it.

| Routine | Name it | Runs |
| --- | --- | --- |
| `market-scan` | `marketingos-market-scan` | daily at 07:30 |
| `morning-performance-sweep` | `marketingos-morning-sweep` | daily at 08:00 |
| `content-pipeline-sync` | `marketingos-content-pipeline-sync` | daily at 09:00 |
| `campaign-sync` | `marketingos-campaign-sync` | daily at 09:30 |
| `dashboard` | `marketingos-dashboard` | daily at 10:30 |
| `customer-intel` | `marketingos-customer-intel` | Monday at 09:00 |
| `competitor-radar` | `marketingos-competitor-radar` | Monday at 09:45 |
| `pipeline-hygiene` | `marketingos-pipeline-hygiene` | Monday at 11:00 |
| `monthly-report` | `marketingos-monthly-report` | the 1st of the month at 09:00 |
| `quarterly-report` | `marketingos-quarterly-report` | the 1st of Jan, Apr, Jul and Oct at 10:00 |

Every time is in the operator timezone from `Context/config.md`. If the operator has changed a time there, use theirs.

## What goes in each scheduled task

1. **Name** from the table above, which is the routine's own `name:` field.
2. **Cadence** in plain words, from the table above.
3. **Working directory** the OS root. This is the one thing the routine cannot work out for itself.
4. **Connectors** the ones that routine's Set it up table names. A connector left off does not break the routine: it makes the routine write `not available` and name the blocker, which is correct behaviour and the whole reason the gaps stay visible.
5. **Prompt** a short instruction pointing at the file:

   ```
   Run the Marketing OS <routine name>. Read and execute @Routines/<file>.md
   exactly as written. Unattended: never ask a question, make the safe
   assumption and note it.
   ```

## Never report a schedule that does not exist

Confirm each one was actually created before you say it was. A user who believes ten routines are running when none are stops checking, and the dashboard goes stale while still looking correct.

If a scheduled task cannot be created, say that plainly and hand over the four values above per routine so the operator can set it up themselves. Do not describe it as registered.

## Three things that matter

**The task must be pointed at the OS root.** Every routine states that it has been pointed at the root and that all its paths are relative to it. Pointed anywhere else, every routine fails identically and confusingly.

**Point at the file, do not inline it.** The scheduled prompt is the short pointer above; the routine file is the spec. Pointing means an edit to the file takes effect on the next fire with nothing to re-register. Inlining the whole text freezes a copy that drifts the moment somebody improves the file, and a paraphrase quietly drops the guardrails.

**Keep the routine's own constraint lines.** "Never estimate a number." "Verbatim quotes only." "Create records, do not draft content." "Unattended: never ask a question." These are what make an unattended run safe.

## Order is a rhythm, not a chain

> [!important] No routine depends on another having run
> Each scheduled task points at the OS root and runs **one** routine. Each one pulls whatever it needs, so any single routine firing alone against a fresh OS still produces a complete result.

The times below front-load the routines that produce signal on day one. They matter only for efficiency: a later routine that finds numbers already dated today skips the pull rather than duplicating it.

**Daily**

```
market-scan               07:30   the world, before we look at ourselves
morning-performance-sweep 08:00   the numbers, pulled from source
content-pipeline-sync     09:00   asset records and the repurpose cascade
campaign-sync             09:30   only while a campaign runs, no-ops otherwise
dashboard                 10:30   pulls anything not already fresh, then renders
```

**Weekly, Monday**

```
customer-intel     09:00   real customer language
competitor-radar   09:45   the tracked roster
pipeline-hygiene   11:00   the OS audited against itself
```

**Periodic**

```
monthly-report     1st of the month, 09:00
quarterly-report   1st of Jan, Apr, Jul, Oct, 10:00
```

The dashboard sits last in the day because that is when the most is already fresh, not because it needs the others. It is a hybrid and self-sufficient: somebody who wants a current dashboard schedules it and nothing else.

**Never tell the operator that one routine must run before another.** If a routine appears to need that, it is a bug in the routine file.

## Verifying a registration took

Do not trust the scheduler's confirmation alone. Check three things:

1. The task appears in the scheduled tasks list under the expected name
2. Its next run time is what you expect, in the right timezone
3. After its first fire, a log entry exists in `Intelligence/logs/`

The third is the only one that proves the routine actually works rather than merely being scheduled. Nine of the ten are brain-update and log every run, including a run that changed nothing. The dashboard is the only hybrid: it logs when it had to pull, so also check that its output file's timestamp moved.

## Naming

Names come from each routine's `name:` field, conventionally `<prefix>-<slug>` where the prefix is `routine_prefix` in `Context/config.md`, defaulting to `marketingos-`.

Consistent prefixing is what makes audit mode possible: listing tasks by prefix is how the skill discovers what is already registered. Never rename a routine at registration time.

## Unregistering

Ask first. A user may have edited a registration by hand.

When replacing, delete then create rather than editing in place, so a half-applied change cannot leave two routines writing to the same files on different schedules.

After any change, update the register in `Routines/CLAUDE.md` so it reflects reality. A register claiming nine routines are running when ten are is worse than no register.
