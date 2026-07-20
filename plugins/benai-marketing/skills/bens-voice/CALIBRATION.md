# Calibration report - 2026-07-10

Layer 1 linter (`scripts/voice_lint.py`) run against ground truth: the full collected corpus (May-Jul 2026).

## Real Ben content (should pass)

| Register | Result | Failures, all explainable |
|---|---|---|
| 88 Circle comments (as `circle-reply`) | **85/88 pass (96%)** | 3x `bullets-in-circle`: the corpus's 1 numbered list + 2 dash-lists flagged by the analyst as editor artifacts. The ban is a deliberate bias so GENERATED drafts never use lists; his one-in-a-month exception is earned, a draft's is not. |
| 6 newsletter issues (as `newsletter`) | **6/6 pass (100%)** | - |
| 10 LinkedIn posts + 1 repost (as `linkedin-post`) | **10/11 pass (90%)** | 1x: the SAP/n8n REPOST tripped 3 softs (engagement bait "Drop a comment below!" among them). Reposts-with-commentary are genuinely atypical; his 9 original posts all pass. |
| 84 Slack messages (as `slack`) | **83/84 pass (98%)** | 1x `em-dash`: the collector's own "[no text — attachment only]" placeholder, not Ben's text. |

## Rules corrected during calibration (live data beat instinct)

- "insane" was globally banned; real Ben uses it in Slack ("Haha insane") and DMs ("really insane what's possible"). Now `insane-in-broadcast`: hard only in circle-reply / linkedin-post / newsletter / youtube-script.
- "way more/better/..." was a hard ban; Ben shipped "way cheaper" once on LinkedIn. Downgraded to soft ("far" is his measured default, 49x).

## Known-bad AI draft (should fail)

A deliberately generic AI reply tripped **17 hard violations + 2 soft** (em-dash, hey-opener, delve/seamless/streamline ai-vocab, leverage-as-verb, unlock-hype, corporate-lingo x3, hope-this-helps, linkedin-ism, addressing-the-masses, bullets-in-circle, sign-off). Clean separation from real Ben content.

## Layer 2 live results (first real run, Fable 5 drafter)

| Draft | Lint | Judge |
|---|---|---|
| circle-reply: intro-with-pain (consultant Sarah) | PASS 0/0, 85w | 96/100 |
| circle-reply: how-do-I (Apify scraping question) | PASS 0/0, 60w | 97/100 |

## Maintenance

Re-run this check after any change to the rules or references:

1. Collect a fresh corpus per SKILL.md's "Data provenance and refresh" section (the original raw corpus was session-scoped and is not bundled).
2. Lint every real item with its register's type (`python3 scripts/voice_lint.py --type <type>`) and compute pass rates.
3. Targets: >= 90% per register with only artifact-class failures (collector placeholders, one-off formatting exceptions); a deliberately generic AI draft must fail with multiple hard violations.
4. When a rule fails against real Ben content, the corpus wins: downgrade or type-scope the rule, and record the correction here.

When the Wispr Flow data lands, re-verify the casual-register rules (especially please-in-slack, insane-in-broadcast) before trusting them.
