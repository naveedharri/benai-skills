---
name: voice-builder
disable-model-invocation: true
description: Build a personal tone-of-voice skill ({name}-voice) for any person from their real writing and speaking corpus. Use this skill whenever someone wants AI to write in their voice, clone their tone, or stop AI outputs from sounding generic - triggers include "build my voice skill", "create a tone of voice skill", "make AI sound like me", "clone my writing style", "voice engine", "my LinkedIn posts don't sound like me", or any request to draft content that should sound like a specific person who doesn't have a voice skill yet. The output is a complete, calibrated skill (references + deterministic linter + rubric judge) that every future draft in their voice must pass through.
---

# voice-builder: build a {name}-voice skill

This skill turns a person's real content into a personal voice engine: a skill that drafts AND judges content in their voice, with a deterministic red-flag linter (Layer 1) plus an LLM rubric judge (Layer 2). It reproduces the exact workflow used to build production voice skills for two founders, where calibrated linters hit 96-100% pass rates against the person's real content while a generic AI draft trips 17+ hard violations.

The core belief behind the method: **voice rules must be measured, not vibed.** A distilled reference that says "median 67 words, never opens with Hey (0/88), praise ladder nice < great < Amazing" beats pages of adjectives about "warm and direct tone". Everything below exists to produce numbers like those from the person's actual corpus.

Read `references/` files at the phase that needs them; don't front-load.

## Phase 0: Name and scope

The skill is named `{firstname}s-voice` (e.g. `bens-voice`, `aryans-voice`), lowercase, hyphenated. Confirm with the user who the voice belongs to and who will run the finished skill (the person themselves, or teammates drafting on their behalf - both are normal).

## Phase 1: Interview: where does their voice live?

Ask which bodies of content they'd point to and say "that sounds like me". Offer this menu and let them approve, remove, and add:

- Newsletters / email broadcasts
- YouTube videos (transcripts = spoken voice, usually the richest source by volume)
- LinkedIn posts
- LinkedIn DMs
- Community replies (Circle, Skool, Slack community, Discord)
- Slack / internal team chat
- WhatsApp messages
- Instagram DMs
- Blog posts / articles
- Dictation transcripts (see the transcription-tool scan below - often the biggest hidden corpus)

Two questions per approved source: roughly how much exists, and is it actually THEM (ghostwritten newsletters or a VA answering DMs poison the corpus - exclude anything not written by the person, and filter by sender/author during collection; one production build caught two newsletter issues actually sent by a co-founder).

Also ask: which registers will the skill DRAFT in? Collect sources for those registers even if thin, and skip registers they never write in.

## Phase 2: Source audit

**Transcription tools.** Scan the machine before asking - people forget they have gold here. Check for Wispr Flow, Aqua, superwhisper, MacWhisper, and any local dictation history (paths and detection commands in `references/collection.md`). Dictation is unfiltered spoken-thinking voice; if found, ask whether to include it. If it exists but the user wants to skip it for now, note the update path in the generated skill so they can fold it in later.

**Connectors.** For each approved source, verify the access path actually works before promising collection (a quick probe call, not an assumption). The map of source → connector → fallback lives in `references/collection.md`. When a connector is missing, offer to help connect it; when that fails, fall back (e.g. exported files the user drags in) rather than silently dropping the source.

## Phase 3: Collect the corpus

Collect each source in parallel (one subagent per source where subagents exist; sequentially otherwise). The non-negotiable collection rules, per-source methods, and recommended time windows are in `references/collection.md`. The two rules that matter most:

1. **Verbatim means verbatim.** Typos, casing, dropped apostrophes, emoji, line breaks - all preserved. A person's imperfections are load-bearing voice signal ("a draft that is spelled perfectly everywhere reads less like them than one with a light natural slip").
2. **Capture context per item.** What was the person replying to? A comment without the post it answers can't teach reply shapes.

## Phase 4: Distill measured references

One analyst pass per register, producing one reference file per register. The full analyst prompt template is in `references/distillation.md` - use it. What makes a reference file good:

- **Measured distributions**: length medians and modes, opener/closer percentages, punctuation and casing tics with counts.
- **A vocabulary fingerprint**: what they actually say (with counts) AND a checked list of plausible words with ZERO occurrences. The zero-list becomes linter rules.
- **A "Never does" section verified against the corpus**, plus a "DO occur" counter-list so rare-but-real moves don't get over-banned.
- **Verbatim gold examples** spanning the register's modes.
- **An "Opinions and stances" section** - recurring takes with counts, merged later into `values.md` (a draft that contradicts the person's actual opinions is not their voice, no matter how good the register).

## Phase 5: Assemble the skill

Follow `references/skill-template.md` for the output structure: SKILL.md (classify → read references → draft → lint → judge → verdict loop, a 6-dimension rubric, non-negotiables), `references/` per register + `values.md` + gold examples, `scripts/voice_lint.py`, `CALIBRATION.md`.

Build the linter from `assets/voice_lint_template.py`: keep the global rules (em dash, AI vocabulary, corporate lingo - these are universal tells), then add person-specific rules ONLY where the corpus showed a zero or a strong pattern, with the measurement quoted in a comment. Make rules type-conditional when a word is real in one register and absent in another (one founder says "insane" in Slack but never in public content; another never opens community replies with "Hey" but always opens DMs with it).

## Phase 6: Calibrate

Lint the person's REAL corpus with the finished linter, per register. Targets:

- **>= 90% of real content passes** per register, with failures explainable as artifacts (collector placeholders, one-off exceptions held stricter for drafts).
- **A deliberately generic AI draft fails with multiple hard violations.**
- **When a rule fails against real content, the corpus wins**: downgrade to soft or type-scope the rule, and record the correction in CALIBRATION.md.

Then run 1-2 live drafts through the full loop (draft → lint → judge) and record the scores. Ship only when calibration is written up.

## Phase 7: Handoff

Tell the user what was built, the calibration numbers, and how to invoke it ("draft a LinkedIn post in my voice"). If a dictation corpus was skipped in Phase 2, make sure the generated SKILL.md carries the documented update path so the person can later say "update my voice skill with my dictation transcripts" and it just works. Remind them the skill improves with refresh: re-collect and re-distill any register that felt off after a few weeks of use.

## Failure modes to avoid (learned in production builds)

- **Skipping the connector probe.** Specialized subagents sometimes launch without their MCP tools; verify tools respond before delegating, and prefer general-purpose agents that load connectors explicitly.
- **Trusting instinct over the corpus.** Every "surely they'd never say X" must be checked; both production builds found banned-sounding words the person really uses.
- **One reference for all registers.** The same person is measurably different per channel (median 5 words on Slack vs 67 in community replies vs 290 on LinkedIn). One file per register, always.
- **Sanding out imperfection.** Never inject typos deliberately, but never polish run-ons and comma splices out of the drafts either.
- **Corpus contamination.** Filter by author everywhere: co-founders send from the same newsletter, teammates post in the same channels.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a phase was done, update the relevant reference file (`references/collection.md`, `references/distillation.md`, or `references/skill-template.md`) or the linter template `assets/voice_lint_template.py` so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here or in the matching reference file.
- When a build produces a voice skill the user says is genuinely good, capture what made it work (a distillation move, a linter rule pattern) back into the reference that governs it, so the next build inherits it.
- Keep this SKILL.md small: when you add something, run the deletion test and cut anything that no longer changes behavior.
