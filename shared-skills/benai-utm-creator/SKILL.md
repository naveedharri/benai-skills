---
name: benai-utm-creator
description: Stage 2 of the Ben AI publishing chain. Turns one YouTube video title into all six Ben AI UTM tracking links, their Bitly backhalfs, a five-letter campaign code, and a Bitly-ready import CSV saved to Downloads. Needs nothing but the exact title, so it can run while YouTube is still processing the upload. Use whenever someone wants UTM links, tracking links, a campaign code, or Bitly short links for a video, or says "make UTMs for [title]", "create the tracking links", "UTM creator", "what is the code for this video", or "bitly links for [title]".
---

# Ben AI UTM Creator

Stage 2. One video title in, six links and a CSV out. Replaces the manual formula work in the
UTM creator sheet.

Needs only the title, so run it while YouTube processes the upload rather than waiting.

## Steps

```
Task Progress:
- [ ] 1. Get the exact video title
- [ ] 2. Generate links + CSV
- [ ] 3. Settle the free link
- [ ] 4. Review with the operator
- [ ] 5. Save the CSV where the operator can reach it
- [ ] 6. Write the code to the Notion card
```

### 1. Get the exact video title

Take it from Studio, not from the Notion card's name. The card often carries a working title
or a list of candidate variations; the code has to derive from the title that actually ships.

### 2. Generate links + CSV

Run `scripts/utm_creator.py "<video title>"` yourself. **The operator never runs this.** They
should not see a command, be asked to open a terminal, or be told a path they have to type.

The script prints the slug, the five-letter code, all six links with their backhalfs, and
writes the CSV. Do not hand-build any URL.

It self-checks before writing and exits 1 without producing a file if `utm_content` is not
lowercase or disagrees between the Long URL and the UTM Content column. If it refuses, fix the
cause in the script. Never hand-edit the CSV to get past it.

Destination table and derivation rules are in `references/destinations.md`. Read it only if a
value looks wrong or someone wants a destination changed.

### 3. Settle the free link

Six links get generated, but only five are wanted when there is no lead magnet.

The `-free` backhalf points at `benai.kit.com/<code>-free`. That page only exists if the lead
magnet was built. With no lead magnet the link resolves to nothing, and the description
template has a hardcoded line pointing at it, so the video would ship a dead link in front of
every viewer.

- **Lead magnet yes:** keep all six. `youtube-link-setup` builds the Kit page.
- **Lead magnet no:** drop the `-free` row from the CSV before delivering, import five, and
  tell `youtube-description` to cut the "Get the free setup guide" block.

This should already be answered in the Ship Brief. If it is not, ask now, before the import.

### 4. Review with the operator

Show the six (or five) links and their backhalfs as a table, plus the slug and the code. Wait
for a go before anything gets delivered or written.

### 5. Save the CSV where the operator can reach it

The script writes it to `~/Downloads/`. That is where the Bitly bulk uploader's file picker
opens, which means the next step is a drag rather than a path.

Tell the operator the file name only. Do not give them a shell command to find it.

### 6. Write the code to the Notion card

Five-letter code onto the `UTM code` property. An empty `UTM code` is how every other stage
knows this one has not run.

## Known-good conventions

Verified against live Bitly data on 2026-08-18, and again on 2026-08-25. The older vault SOP
has drifted; trust this list.

- Six links per video. Suffixes in use: `-accelerator`, `-agency`, `-os`, `-aioperator`,
  `-free`, `-kityout`. The old SOP's `-acc` and `-kitlink` appear zero times in recent links.
- **The Cowork suffix was `-cowork` until 2026-08-26 and is `-os` from then on.** Oskar's
  call, forward only. Every link already live keeps `-cowork`, and renaming a live backhalf
  breaks it wherever it has already been published, so `tnwtb-cowork` and everything before it
  stay untouched. `utm_content` stays `cowork` either way, which keeps the funnel comparable
  in reporting across the change.
- Kit-YouTube points at `benai.co/accelerator-offer`, not the old SOP's `benai.co/template-success`.
- `utm_content` is lowercase everywhere.
- Link Title uses the canonical label verbatim (`AI-Operator`, `Kit-YouTube`), never a
  `PROPER()`-style transform.
- **Bitly reorders the query string alphabetically on import.** Every parameter survives and
  tracking is unaffected, but a byte-for-byte comparison against the CSV will always report a
  difference. Compare parameter by parameter.

## Self-improvement

When someone corrects a destination, base URL, backhalf, or the slug/code rule, update
`references/destinations.md` and the script so the correction sticks. Do not just fix it for
one run. When a correction is a hard rule, write it in as a rule, and say whether it applies
to new videos only or to everything.
