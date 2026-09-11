# Step 2: Assemble the description

## Do not copy from another video

A fresh draft carries the unfilled template (`{{Video description}}`, `{{Chapters}}`,
`{{Templates}}`). Wipe it. Do not paste a previous video's description either: that is how
the old five-letter UTM code ships.

Build from `references/description-template.md`, which is the canonical block with the
three variables marked. Fill the variables, leave everything else byte-identical.

## Fill the three variables

1. **`{{CODE}}`** from `benai-utm-creator`. Run it if it has not run this session; it needs
   only the exact video title. Substitute programmatically, never by hand:

```bash
python3 - <<'PY'
code = "<5-letter code>"
tpl = open("/home/claude/description-template.txt").read()   # the template block, verbatim
out = tpl.replace("{{CODE}}", code)
assert out.count(f"c.benai.co/{code}-") == 4, "expected 4 tracking links"
open("/mnt/user-data/outputs/description.txt", "w").write(out)
PY
```

   Then grep the result for `c.benai.co` and confirm all four carry the new code and none
   carry an old one. If the count is not 4, stop and show the user.

2. **`{{REFERENCED_VIDEOS}}`** from `youtube-chapters-tags`, which flags the videos Ben
   references. Rules and format are in `references/description-template.md`. If Ben names
   nothing, ask; offer 5 candidates. Never carry the previous video's list forward silently.

3. **`{{CHAPTERS}}`** from `youtube-chapters-tags`, format `MM:SS – Title`, first line
   `00:00 – Intro`. If chapters do not exist yet, run that skill first.

## Ben AI voice

For anything you write yourself (a chapter title, a label for a referenced video):
practitioner authority, direct, specific about the why. No buzzwords, no hype, no filler.
No em dashes. Offer the user 5 options rather than choosing silently.

## Before the checkpoint

Write the result to `/mnt/user-data/outputs/description.txt`, report the character count
(cap 5000), and show it in full. Wait for a go.
