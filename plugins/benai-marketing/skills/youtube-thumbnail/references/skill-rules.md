# Skill Rules Changelog

Living log of in-flight corrections from real generation runs. Append new entries at the top with the date.

## How This File Works

- During a run, if Ben gives a correction ("never put me in a suit", "always lean yellow on tutorial topics"), append a dated entry below.
- After 3 confirmations of the same rule across separate runs, promote it into the Core Rules block in `SKILL.md` and add a `[PROMOTED]` tag to the original entry here.
- Never delete entries. This is the audit trail for why the skill behaves the way it does.

## Entry Format

```
### YYYY-MM-DD

- **Rule:** one-line statement
- **Trigger:** what prompted the correction (topic, mode, what was wrong)
- **Scope:** all modes | specific mode | specific topic family
- **Status:** new | confirmed-2x | [PROMOTED YYYY-MM-DD]
```

## Boundaries

This file is owned by the generate skill. It accumulates corrections that affect generation behavior.

Do NOT put here:
- Reference photo update triggers (those belong in the setup skill)
- Style spec content updates (those belong in `Context/youtube-thumbnail-style.md` via the setup skill)
- Folder structure changes (those belong in the setup skill)

DO put here:
- Prompt phrasing preferences ("always use 'home office' not 'workspace'")
- Mode override patterns ("for tutorial topics, default to `new-with-ben` standard not hero")
- Output post-processing rules ("rename v1.png to v1-{quality-tag}.png")
- Model preference shifts ("try `gpt_image_2` first for text-heavy no-face thumbnails")

## Entries

(empty until the first correction lands)
