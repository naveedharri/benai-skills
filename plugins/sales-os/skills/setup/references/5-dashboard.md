# Pillar 5: Dashboard

The vault overlay where the rep, and later a manager or team, sees what matters most. This is the visible payoff of everything before it; one pillar follows, sealing the self-model. Per rep for v1, no team or manager roll-up yet.

Two things happen in this pillar: you BUILD the dashboard shell once, in the rep's design, then you REGISTER the daily routine that regenerates it. The shell is the artifact; the routine keeps it alive.

> [!important] The skill defines the structure, the rep defines the content
> The reference shell fixes the SKELETON (the tabs, the hash router, the chart ids, the section order, the `#ov-data` contract). Everything else adapts entirely to the rep: their tools, their capabilities, their context, their metrics, and their brand. Never ship BenAI's content or look. Build the rep's.

## Build from the reference shell

Start from `assets/dashboard-templates/control-center.example.html`. It is the proven structure and the data contract. Keep its skeleton; swap its look and content for the rep's.

KEEP (the contract, the routine and the charts depend on it):
- Five tabs: Today, Pipeline, Context, Capabilities, Stack. No Map tab.
- The hash router (tabs plus `#today/<slug>` call sub-pages and `#context/<slug>` context sub-pages) and the Chart.js init (which lives on the Pipeline tab).
- The inline `#ov-data` block keys: `funnel`, `rep`, `weeks`, `meetings`, `revenue`.
- The four canvas ids EXACTLY: `meetings`, `revenue`, `funnel`, `rep`.
- The Today and Pipeline section orders (see the table below). Today holds the calls, each with a links row and a `#today/<slug>` sub-page; Pipeline holds the metrics and charts.

SWAP (make it theirs): the `:root` design-token block (colors, fonts, radii, shadows) and all copy.

## The tabs

| Tab | Holds |
| --- | --- |
| **Today** | a hero "one thing to act on today"; today's calls, ONE card per prospect (a paragraph of call-prep, a verdict, and a links row of LinkedIn, website, the meeting link, and a "Full brief" chip that opens the prospect's `#today/<slug>` sub-page); a "not pipeline" card for non-sales calendar events; and a Top tasks card plus a What changed today card. Each prospect also gets a full sub-page (Snapshot, Qualification, History, Next step, links) sourced from the deal file. This is how the call-prep research becomes visible. Regenerated daily. |
| **Pipeline** | a snapshot strip of about six key metrics; a CRM-by-stage snapshot; the four pipeline charts; and a system row (routine heartbeat plus a Needs-you list). Regenerated daily. |
| **Context** | a folder visualization (the folder on the left, the documents indented to the right, grouped by what-we-sell / to-who / how-we-sell / etc.), where each document opens as its own `#context/<slug>` sub-page with the full detail and a back link. |
| **Capabilities** | the installed routines and skills, segregated by the two types: a featured Onboarder, then the brain-update set (keep the brain current), then the action set (do the sales work). |
| **Stack** | the connected tools, grouped by job, each shown with its real logo. |

No **Map** tab.

## Design system (always the rep's brand, never a silent default)

> [!important] Find the rep's brand first; if there is none, confirm before choosing
> Before you style anything, LOOK for the rep's existing brand guidelines: a brand or visual-identity doc, a `brand.md` or design-tokens file in their Context, a style guide, their website's palette and fonts, or an existing product they run. If you find them, build the dashboard in those colors, fonts, and shadows, full stop. If you find NONE, do not silently pick a look. STOP and confirm with the rep: present a few options via the `ui-ux-pro-max` skill (or ask their stated preferences), let them choose, and only then build, using that choice consistently. The dashboard must feel like theirs, which is why a colleague's first build felt off, it had picked a default instead of their brand.

Once the look is chosen, it lives in the shell's `:root` token block; the daily routine never changes it.

## The pipeline charts (the Pipeline tab)

Four charts, two lines and two bars, so they are visually distinct and each says something different:
- **Meetings booked per week** (`canvas#meetings`): a filled line, weekly volume across the quarter.
- **Revenue and commission per week** (`canvas#revenue`): a dual-axis line, revenue on the left axis and the rep's commission on the right (the shell computes commission as revenue times the rep's rate; do not pass a separate array).
- **Closing funnel** (`canvas#funnel`): a horizontal bar, booked into met into qualified into won.
- **Rep score by dimension** (`canvas#rep`): a horizontal bar, where the rep is strong and where to coach.

Do not ship two charts that show the same thing. An earlier version had a funnel bar and an outcome bar that read as duplicates; the line graphs replace the duplicate and add the meetings-to-revenue story.

## The Stack tab always uses real logos

For every tool in the rep's stack, the Stack tab shows the tool's real logo, not a generic icon. When you build the Stack tab (and whenever the weekly refresh adds a tool), FIND the official logo on the web, DOWNLOAD it into the dashboard's assets folder (for example a `logos/` folder beside `control-center.html`, or inline it as a data URI), and reference it. A favicon service (for example `https://www.google.com/s2/favicons?sz=128&domain=<domain>`) is only a last-resort fallback when a clean logo cannot be found. Never ship a tool tile without a logo.

## Generation architecture (keep this, it is why it scales)

The dashboard is regenerated by a daily routine (the template is in `assets/routine-templates/dashboard.md`). Keep the architecture where one subagent generates each dynamic tab, so a single run never has to load the whole OS into one context, and the orchestrator stitches the fragments into the shell. The static tabs (Context, Capabilities, Stack) refresh only when structure changes; Today and Pipeline rebuild daily, Today with one subagent (which also emits the per-prospect call sub-pages from the deal files) and Pipeline with another. Keep the heartbeat idea: if today's log is missing a routine's entry, mark that routine amber so the rep can see a routine did not run.

## Register the daily routine (do not skip this)

The dashboard is not a one-time build, it is a running capability. After the shell renders:
1. Open `assets/routine-templates/dashboard.md`.
2. Fill every `{{CONFIG:...}}` from the rep's Context and config (name, path, run time, design-system name, the design contract reference, the commission rate, the routine-name list for the heartbeat, and the hosting keys if they have hosting).
3. Register it on the rep's chosen execution model from Pillar 4: a LOCAL scheduled task, or a cloud Claude routine if they took the MCP-vault path. Schedule it daily, after the morning and hygiene routines.
4. Add this routine to the heartbeat's routine list and to `MAP.md` and the manifest as a core capability.
5. Pre-run it once so the first unattended run does not pause on permission prompts.

## Hosting

Make hosting optional. Always write a local HTML file the rep can open. Deploy to a host and return a shareable link only if the rep has hosting (a Vercel or similar account); otherwise the local file is the deliverable. Do not require a hosting account to finish the onboarding.

## Done when

The dashboard renders in the rep's brand with the five tabs, the Today tab shows each of today's calls with its links and a full per-prospect sub-page, the Pipeline tab reflects their real metrics and charts, every Stack tool shows a real logo, and the daily regeneration routine is registered on their chosen execution model and pre-run once. The rep now has a Context brain, the structure and conventions, the connected stack, the running capabilities, and the overlay to see it all. Pillar 6 seals it with a map and memory the OS keeps current.
