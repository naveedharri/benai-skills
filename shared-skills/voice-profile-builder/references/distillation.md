# Distillation guide: turning corpus into measured references

One analyst pass per register. Each produces one reference file the generated skill will read before drafting that register. Run analysts in parallel (one subagent per register) where subagents exist.

## Why measured beats described

"Warm but direct" describes every founder on LinkedIn. "Median 67 words; never opens with 'Hey' (0/88) even though every member writes 'Hey' to him; 64% of replies end cold on substance; only 4 of 88 contain a question mark" is falsifiable, lintable, and survives contact with a skeptical reader. Every claim in a reference file should be a count, a percentage, or a verbatim quote.

## The analyst prompt template

Adapt per register; the skeleton below is what produced production-quality references. Give each analyst ONLY its register's corpus file plus this shape:

```
You are a voice analyst building an empirical fingerprint of how {NAME} writes {REGISTER}.
Your output becomes a reference file inside a "{name}s-voice" skill that drafts as {NAME}.

INPUT: Read {corpus file} ({count} verbatim items, {date range}, with per-item context).
Base EVERYTHING on this data. Measured numbers, not vibes.

PRODUCE: {output path} with these sections:

1. LENGTH - median and distribution; identify the modes (quick reaction / standard /
   deep) with share, median, range, and what triggers each. Note the observed ceiling.
2. OPENINGS - measured distribution of greeting styles with percentages; what they
   NEVER open with (verify: 0 occurrences despite sounding plausible).
3. PUNCTUATION AND CASING TICS - dashes, ellipses, apostrophes, ALL-CAPS budget,
   exclamation density, terminal periods, parentheticals, typo patterns. Whether
   typos ship uncorrected (that is voice signal, not noise).
4. VOCABULARY (measured whitelist) - their actual hedges, intensifiers, reaction
   words, recommendation framings, proof markers, signature phrases, WITH COUNTS.
   Also an explicit checked list: plausible words with ZERO occurrences (check at
   minimum: delve, leverage, unlock, seamless, robust, game-changer, awesome, super,
   insane, literally, basically, honestly, obviously - report counts present OR absent).
5. EMOJI - frequency, which ones, position, unicode vs shortcodes.
6. STRUCTURE - the register's anatomy (advice spine / post anatomy / issue skeleton),
   position by position, with frequency. Closers, measured (% cold stop vs question
   vs formula).
7. {REGISTER-SPECIFIC} - reply-type playbook for community registers (classify every
   item by what it responds to, give the exact shape per type with a verbatim example);
   hook analysis for posts (quote every opener verbatim, classify); CTA/sign-off
   mechanics for newsletters; feedback registers for team chat.
8. NEVER DOES - zero-occurrence verification, PLUS a "DO occur" counter-list of
   rare-but-real moves with counts, so nothing real gets over-banned.
9. GOLD EXAMPLES - 8-18 verbatim items spanning the register's modes, chosen as most
   representative. These become the "would this draft look out of place here?" test.
10. OPINIONS AND STANCES - recurring takes/beliefs/recommendations with rough counts,
    for a separate values file.

Return a 10-line summary + confirmation the file is written. The file carries the detail.
```

## Register-specific emphases

- **Spoken/YouTube**: hooks verbatim for every video; teaching moves (analogies, demystifying moves, why-chaining); discourse-marker counts per 1,000 words (these ARE the voice at high density); CTA formulas verbatim; non-native quirks if applicable (they are authentic, keep them); macro video structure. Ignore ASR punctuation.
- **Community replies**: the reply-type playbook is the highest-value section - drafts fail most often by over-answering or mis-shaping, not by vocabulary. Routing conventions (who they tag, exact phrasing like "book in a call with @X") matter.
- **LinkedIn**: line-break rhythm is part of the voice; glyph inventory (↳ ✅ → and dash style) with counts and position; CTA formula; hook families.
- **Newsletter**: paragraph rhythm (sentences per paragraph, measured); subject lines verbatim; sign-off invariants; link conventions; teaching/story/promo ratio per issue. If the sampled week was atypical (a launch, a promo), say so and weight the normal issues hardest.
- **Team chat**: message-splitting behavior (bursts); greeting rate; ask phrasing; praise ladder with counts; the difference between their feedback registers; candor markers.
- **DMs**: pattern library keyed to inbound type (compliment / question / welcome / pricing); signature redirect phrases; length bands per reply type.

## Cross-checks after all analysts return

1. **Channel contrasts** - the most valuable rules are differences between registers of the SAME person ("Hey" in DMs but never in community; "guys" in Slack but never to viewers; "insane" casually but never in public). Scan for these explicitly; they become type-conditional linter rules.
2. **Values merge** - combine every analyst's "Opinions and stances" into one `values.md` organized as: core theses / tooling or domain stances / business playbook / spoken-thinking fingerprint. Deduplicate; keep counts and verbatim quotes.
3. **Prior-art reconciliation** - if older voice docs exist (brand guides, previous profiles), note where live data CONFIRMS or CONTRADICTS them in the reference file. Live data wins; say so explicitly so future editors don't "fix" the file back toward the outdated guide.
