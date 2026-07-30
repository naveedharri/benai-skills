---
name: marketing-os-dashboard
description: "Build, rebuild, and deploy the Marketing OS control center: a self-contained single-page dashboard rendered from the OS files, eleven pages in six nav groups (Core, Calendar, Content, Campaigns, Funnel, Performance, Learnings, Audience, Intelligence, Team, System). Interviews the user on first build to decide which pages earn a place, then reads the OS, assembles one inline JSON data block, swaps it into the fixed page shell, verifies the page opens with no external requests, deploys to a live URL and records it in config. Renders gaps as 'not pulled' rather than zero, flags any routine that should have run and did not, and renders correctly in both light and dark palettes. Bundled shell ships with the skill. Run from the Marketing OS root. Use when the user says 'build my marketing dashboard', 'rebuild the control center', 'update the marketing OS dashboard', 'deploy my marketing dashboard', 'my dashboard is stale', 'marketing os dashboard', or runs /marketing-os-dashboard."
disable-model-invocation: true
---

# Marketing OS Dashboard

Render the control center from the OS and deploy it.

**This skill owns the dashboard end to end**, and it ships the only copy of the shell. `marketing-os-setup` writes `Analytics/dashboard/spec.md` and then invokes this skill; it never builds the page itself. Works either way: invoked from setup, or run on its own against an OS that already exists.

Run from the OS root, then branch on what is there:

| State | Do |
| --- | --- |
| No `Context/config.md` | The OS is not set up. Point the user at `marketing-os-setup` and stop |
| `config.md` but no `Analytics/dashboard/spec.md` | **First build.** Run the interview below and write `spec.md` yourself |
| `config.md` and `spec.md`, no `control-center.html` | **First build.** Read `spec.md` for the answers, only ask what it does not cover |
| All three exist | **Rebuild.** Skip the interview entirely |

Never refuse to run because `spec.md` is missing. It is an output of the first build, not a precondition for it.

**Stay inside that root.** Read and write only within it. Do not list, glob or read elsewhere on the machine, and do not go looking for other vaults or example OS folders. If something outside the root would help, name the one path and ask. **Start from zero on identity.** Every name, org and handle comes from `Context/config.md` or from the user in this conversation. Never from your context, the system username, the cwd folder name, a git config, or a connected account, and never echoed back as "confirm this?". If `config.md` does not name it, you do not know it: say the key is empty rather than filling it.

## The one rule

**The shell is fixed. Only the data changes.**

Read the OS, assemble the JSON, swap it into the inline block, deploy. Do not restructure the page, rename an element id, or change the CSS.

The exception is a first build, when `Analytics/dashboard/control-center.html` does not exist. Copy the bundled shell from `assets/control-center.html` and fill it.

A genuine layout change is deliberate and ordered, never a side effect of a rebuild:

1. Edit `Analytics/dashboard/spec.md` first, so the contract stays the source of truth
2. Then edit the shell to match
3. Then confirm the rebuild still produces the same data shape, and update `references/data-contract.md` if it does not

A drifting shell means nobody can tell whether a rendering oddity is a data problem or a layout problem. This is the only place that procedure is written down.

## First build: read the OS, propose the pages, then render

**Only on a first build.** A rebuild skips all of this. If `spec.md` already exists because setup wrote it, read it first and ask only what it leaves open, then write your answers back into it.

### Read before you ask

**Never open with a questionnaire against an OS you have not looked at.** Half the answers are already on disk, and asking for them tells the user you did not check.

Walk the tree and inventory it: which of the seven folders exist, which channels are in `Channels/`, which one is `role: primary-original`, how many offers and whether any price has a future effective date, whether `Campaigns/` holds anything live, whether `Team/` exists and how many people, whether any snapshot exists in `Analytics/snapshots/`, whether `Intelligence/competitors/` and the quote bank hold anything real.

### Then propose the pages

Eleven ship in the shell. **Not every OS earns all eleven**, and a page that renders an empty state forever teaches the operator to ignore the whole dashboard.

Put all eleven on the table with a verdict each, drawn from what you just read, and let the user correct you:

| Verdict | When |
| --- | --- |
| **Build it** | The files it reads exist and hold something real |
| **Build thin** | The files exist but are nearly empty. Say what fills it and roughly when |
| **Empty state** | Nothing for it yet, but the folder exists and a routine will write it |
| **Skip** | The OS has no such folder. Name what is missing |

Then say plainly which will be thin and why. A user who knows the Learnings page fills up over a month will not read its empty state as a broken dashboard. A user who was not told will.

**If the OS has something the eleven do not cover**, name it and offer a page for it. A podcast channel, a second community, a partner funnel. Judge it the way the OS judges a folder: it earns a page if a named routine writes the files it would read. If nothing does, say so and leave it out.

### The questions worth asking anyway

These are the ones the tree cannot answer. Ask them, then record every answer in `spec.md` so no rebuild has to ask again.

**Three real questions.** Everything else on the old checklist is already on disk, so confirm it from the inventory rather than asking for it.

| Ask | Why it changes the build |
| --- | --- |
| **1. What is the one question you open this to answer?** | That page becomes the default tab. Do not assume it is the Core |
| **2. Light or dark, and will you share screenshots?** | Sets the default palette. The core renders correctly in both, but a screenshot going into brand material usually wants the light one |
| **3. Where does it deploy, and does it need a password?** | Decides the deploy step and whether the URL is safe to record in `config.md` |

**Confirm these, do not ask them.** State what you found and let the user correct it in one pass:

| You already know | From |
| --- | --- |
| Solo or a team, and who owns what | whether `Team/` exists, and the folders inside it |
| How many offers, and whether a price steps on a date | `Offers/*/offer.md` and the ladder in `Context/config.md` |
| Which channels are produced for, and which one originates | `Channels/`, and `role: primary-original` |
| Whether anything time-boxed is running | `status:` across `Campaigns/*/brief.md` |
| Whether competitors are tracked and customers quoted | `Intelligence/competitors/` and the quote bank |

**Offer options rather than open questions.** On each of the three, put five to ten concrete candidates on the table drawn from what the OS already shows, and let the user pick or correct. "Which of these is the one question you open this to answer?" with seven real candidates beats "what is the one question?" every time, and it is what keeps this from feeling like a form.

## Do not build against an empty OS

Check before building: has any pull produced a real snapshot in `Analytics/snapshots/`?

If not, say so and offer the choice. A dashboard rendered from an OS with no measured data is a page of placeholders, and it teaches the user that the OS does not work. Better to run the morning performance sweep once by hand and build after.

If they want it anyway, build in seed mode: a standing warning at the top saying no routine has run, carried values labelled with their real as-of dates, and every empty panel naming the routine that will fill it. That is honest and still useful, because every gap points at the thing that closes it.

## The eleven pages, and what each reads

Six nav groups. The grouping is part of the contract: eleven flat tabs is a list, six named groups is the OS's own logic made visible in the nav.

| Group | Page | Reads |
| --- | --- | --- |
| Today | **Core** | `Team/<owner>/tasks.md`, `Channels/*/pipeline/`, the latest `Intelligence/logs/` brief block, one node per entity |
| Make | **Calendar** | The cadence table in `Channels/<primary>/strategy.md`, `Channels/*/pipeline/`, `published/`, `Campaigns/*/brief.md` |
| Make | **Content** | `Channels/*/ideas/`, `pipeline/`, `published/`, the email channel's `broadcasts/` |
| Make | **Campaigns** | `Campaigns/*/brief.md`, `Campaigns/*/results.md` |
| Sell | **Funnel** | `Offers/*/offer.md`, `landing.md`, `proof/`, `Offers/lead-magnets/`, the ladder in `Context/strategy.md`, prices from `Context/config.md` |
| Measure | **Performance** | `Analytics/metrics.md`, `Analytics/channels/*.md`, latest `Analytics/snapshots/`, `Analytics/reports/` |
| Measure | **Learnings** | `Analytics/what-works.md`, `Campaigns/*/results.md`, `Intelligence/decisions/` |
| Know | **Audience** | `Context/icp/*.md`, pain points included since they live inside each segment file, plus `Intelligence/research/voice-of-customer.md` |
| Know | **Intelligence** | Latest `Intelligence/market/`, `Intelligence/competitors/`, `Intelligence/research/` |
| Run | **Team** | `Team/*/<person>.md`, `Team/*/tasks.md`. Profile cards with a page per person |
| Run | **System** | `Context/infrastructure.md`, `Context/config.md`, `Routines/CLAUDE.md`, latest `Intelligence/logs/`, staleness across `Analytics/` |

Full panel-by-panel contract in `references/data-contract.md`. Style tokens come from `Context/brand/brand-kit.md`, declared once as CSS custom properties. **Never hardcode a colour.**

**Every one of the eleven keys is required in the JSON.** A missing key renders a blank page with no error a human would notice. `funnel` and `team` are the two most often forgotten.

## The core renders in two modes, and it breaks silently

The rotating sphere on the Core page is drawn with **additive blending**, `globalCompositeOperation = 'lighter'`, which means add light. On a dark background that makes a node glow. **On a light background the channels are already at maximum, so adding light does nothing and the sphere all but disappears.**

The shell therefore carries two rendering models, selected from the background's own luminance rather than from the palette name, so a new light palette inherits the model automatically:

| | Dark | Light |
| --- | --- | --- |
| Blend | `lighter`, additive glow | `multiply`, subtractive ink |
| Dense centre | near-white bloom | dark ink vignette |
| No-state nodes | the muted accent tint | neutral ink at 50 percent |
| Edges and mesh | an accent hue | neutral ink |
| Node separation | the glow does it | a knockout ring in the page colour |

**Do not touch that logic.** If a rebuild recolours nodes, or drops a dark plate behind the sphere to "fix" light mode, it has misdiagnosed the problem: the blend is the cause, not the colours, and the page ends up worse in both modes.

**Nothing in the frame loop may read from the DOM.** The knockout ring reads a token cached at theme-read time, because `getComputedStyle` per node at 60fps is thousands of style resolutions a second.

Verify both palettes before deploying. It is one toggle in the top bar.

## Rendering rules

**A gap is not a zero.** Missing data renders as `not pulled`. A zero is a claim about reality, a gap is the truth. Getting this wrong is how a dashboard starts lying.

**Every value carries its source and pulled date.** A panel that cannot name the file it came from does not ship.

**Empty states name what fills them.** Not "no data" but "no confirmed patterns yet, the monthly report writes here."

**Lead Performance with the funnel**, in order: attention, conversion, revenue, retention. Never a vanity metric first. If the OS has one number that outweighs the rest, give it its own tile and say why.

**A tag count is not a subscription count.** If a community platform reports members carrying a tag, write it as a tag count and never promote it to paying customers.

**Never invent proof.** If `Offers/<offer>/proof/` holds no case study, the Funnel page says so. An invented testimonial on a dashboard is the worst failure available to this skill, because it will be read as real and then quoted.

## Flag stale routines

On the System page, mark any routine that should have run and did not.

This is the OS's own health check and the main reason that page exists. A silently dead routine is the most dangerous failure mode available: everything downstream keeps looking correct while going stale.

Brain-update routines prove they ran by logging every time, including a run that changed nothing. Check `Intelligence/logs/` for their entries and the output file timestamp for the dashboard itself.

## Verify before deploying

If any check fails, do not deploy. Report the failure. A broken dashboard on a shared URL is worse than a stale one.

1. The JSON parses. An invalid data block renders a blank page silently
2. All eleven panels populate
3. Every chart canvas id from the spec is present
4. No panel renders a value it cannot attribute to a file
5. The page opens from disk with **no external requests**: no fetch, no CDN, no remote font, no remote image
6. Both palettes read correctly, the core included

## Deploy

**Stop and get approval before every deploy.** A deploy publishes the page, and this page carries the business's own numbers, offers, prices, task lists and customer quotes. Building locally is not a consequential action; putting it on a URL is.

Show the user what is about to go out, then offer the choices rather than assuming one:

1. Deploy to the recorded target in `surfaces.dashboard_deploy`
2. Deploy, but password gate it
3. Deploy to a new private target instead, and record it
4. Rebuild locally only, no deploy
5. Deploy with named individuals and uncleared quotes stripped first
6. Show the diff against the live version first, then decide

Name anything on the page that would be sensitive published: a price not yet announced, a quote not cleared for public use, a person's name, a revenue figure. If the page holds any of those, say so before asking, not after.

Once approved, push per `references/deploy.md`. Record the URL under `surfaces.dashboard_url` if it is not already set.

**Record deploy notes, never credentials.** If the page is password gated or encrypted, say so in `spec.md` and keep the secret out of the vault.

If the deploy target is unavailable, build locally, say the deploy failed, and leave the local file correct. A current local dashboard is still useful.

## Then hand the loop to a routine

A dashboard rebuilt by hand goes stale the moment the operator stops running this skill.

`Routines/dashboard.md` is the **single** routine that updates the whole thing: it pulls whatever is not already fresh, assembles all eleven pages, verifies and redeploys. It is self-sufficient, so somebody who wants a current dashboard runs it and nothing else. Point the user at it, and at `marketing-os-routines` to get it created as a scheduled task.

Running this skill by hand does not log to `Intelligence/logs/`, because it produces a deliverable. Report what changed in your response instead: the three numbers that moved most since the last build, anything newly flagged on System, and the URL.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects a panel, a derivation or a deploy step, update `references/data-contract.md` or `references/deploy.md` so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When a genuine layout change is agreed, follow the ordered procedure under "The one rule" and record what changed in `Analytics/dashboard/spec.md`.
- When a rebuild reveals a data key the contract does not describe, add it to `references/data-contract.md`.
- When the user says a build was genuinely good, save its data block to `references/examples/` as a model for future runs. Strip every real name, handle, price and metric first: the example is a shape, not a record.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
