# Ben's chaptering style

Reverse-engineered 2026-08-20 from the chapter blocks of the 15 most recent published videos
(11 to 43 minutes). Raw corpus in `examples/chapter-corpus-2026-08.md`.

**Re-measured 2026-08-26** against the channel's live descriptions. Eleven of the thirteen
claims below reproduced exactly. Two did not, and both are corrected in place: the
last-chapter band and the minimum gap. Everything unmarked survived the recheck.

The governing principle, in Ben's words: a chapter title should read like a video title, giving a
rough idea of what the section is about **without giving away what it is**. Curiosity, not a summary.
A viewer scanning the chapter list should still need to watch.

## Measured facts (n=15)

| Property | Finding |
|---|---|
| First chapter | `00:00 – Intro`, 15/15, always |
| Timestamp format | zero-padded `MM:SS`, 15/15 |
| Separator | en dash U+2013, space either side, 15/15 |
| Chapter count | 7 to 13 (median 9). One 34-chapter outlier, a 43-min feature explainer |
| Words per title | 3.2 average, 9 maximum |
| `Outro` chapter | **0/15. Ben never uses one.** |
| Last chapter starts at | **67 to 94%** of runtime (median 88%) |
| CTA / accelerator plug | never chaptered |

## Shape

1. `Intro`
2. One to three framing chapters. Usually a question or a bare noun phrase:
   `Why an AI OS?`, `What Are Skills?`, `How it works`, `Why You Need a Second Brain`,
   `What the Sales OS does`, `Local vs Cloud OS`
3. The numbered body: the counted items.
4. Optional walkthrough or setup chapters after the list:
   `Connector Setup`, `Second Brain Setup`, `How to set it up easily`
5. A final content chapter, never an outro. Ends on `Recommendation`,
   `How to Personalize the Skill`, `Examples & Use Cases`, or simply the last numbered item.

## The three numbering forms

Pick by how much identity the items have.

**Bare `#N`**: items are interchangeable instances of one kind, and the video title already counts
them. Reveals nothing. This is the highest-curiosity form.
- `Skill #1 … Skill #8` (8 Insane Claude Skills to Automate Your Sales)
- `Mistake #1 … Mistake #6` (6 Things People Get Wrong Setting up An AI OS)
- `Plugin #1 … Plugin #12` (12 Claude Plugins, Skills & MCP's I Can't Live Without)

**`N. Label`**: items are distinct named things a viewer might search for.
- `1. Obsidian OS`, `2. Obsidian + Relay OS`, `3. Skill OS`, `4. Google Drive OS`
- `1. Skill Building Mindset`, `2. Skill Building Methods`, `4. Testing Skills`
- `1. Claude Console + Features Explained`, `3. Deploying Managed Agents`

**`Label N` / `#N Label`**: a middle form, grouped families or option lists.
- `Copywriting Skill 1 … 4`, `Design Skill 1`, `Research Skill 1 … 3`
- `Skill 1: OS Setup`, `Skill 2: OS Operator`
- `#1 Live Artifact Setup`, `#2 Obsidian Dashboard Setup`

Default to **bare `#N`** when the video counts a set of like items. Only name them when the name is
itself the thing the viewer wants.

## Rules to apply

- Never write the payoff into the title. `Benefit #3` not `Benefit 3: More Tool Calls Than Native
  Connectors`. The second one means nobody watches that section.
- Never add an `Outro` chapter. Name the closing section for its content.
- Asides between numbered items are fine and Ben uses them: `Pricing`, `Limitations`,
  `My Skill Builder Skill`, `Local vs Cloud OS`.
- Do not chapter the accelerator plug or any CTA.
- 3 words is the target, 9 the ceiling.
- Casing is loose. Ben mixes Title Case (`How Context Rot Works`) and sentence case
  (`How to set it up easily`). Do not "fix" it; match the register of the surrounding titles.
- Keep chapters at least **20 seconds** apart. This is a rule [[Oskar Johnston]] set on
  2026-08-24, not something measured off the corpus, and the distinction matters: Ben's own
  videos break it 3 times in 127 gaps. The observed exceptions are 19s and 12s gaps, plus a
  **0-second gap** between `Plugin #7` and `Plugin #8` in "12 Claude Plugins, Skills & MCP's I
  Can't Live Without", which YouTube will not render as a chapter at all. That last one is the
  argument for the rule rather than against it. If two transitions land closer than 20s, merge
  them or fold the smaller into a neighbour, and say which.

## Self-check before delivering

- `00:00 – Intro` present, en dash, zero-padded.
- No chapter contains the answer to itself.
- No `Outro`.
- 7 to 13 chapters unless the video is over 40 minutes.
- Last chapter lands between 67 and 94% of runtime. The old floor of 80% would have rejected a
  real video: "How to Run AI Locally in 18 Min" closes at 67.3% on "How to set it up easily",
  because a long setup walkthrough is the final section. When the closer is a walkthrough
  rather than a summary, expect it to start early.
