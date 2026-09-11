# Destinations and derivation rules

The script `scripts/utm_creator.py` is the source of truth. This file documents what it does so you can verify a value or change a destination.

## Two derived values

From the video title:

- **Campaign slug** (`utm_campaign`): lowercase the title and replace every run of non-alphanumeric characters with a single hyphen, then strip leading/trailing hyphens. Matches the sheet formula `REGEXREPLACE(LOWER(REGEXREPLACE(title,"[^a-zA-Z0-9]+","-")),"^-+|-+$","")`.
  - "10 skills that will change how you work" → `10-skills-that-will-change-how-you-work`
- **Short code**: first letter of each of the first five words, lowercased and concatenated. If the title has fewer than five words, use all of them.
  - "10 skills that will change how you work" → first 5 words "10 skills that will change" → `1stwc`

## The six destinations

| Term (col D) | Base URL | utm_content | Backhalf |
|---|---|---|---|
| Accelerator | `https://www.benai.co/accelerator` | Accelerator | `<code>-accelerator` |
| Agency | `https://www.benai.co/custom-solutions` | Agency | `<code>-agency` |
| Cowork | `https://calendly.com/ben-ai-aryan/business-os-setup` | Cowork | `<code>-os` |
| AI-Operator | `https://calendly.com/ben-ai-aryan/1-on-1-program` | AI-Operator | `<code>-aioperator` |
| Free (lead magnet) | `https://benai.kit.com/<code>-free` | Free | `<code>-free` |
| Kit-YouTube (redirect) | `https://www.benai.co/accelerator-offer` | Kit-YouTube | `<code>-kityout` |

Notes:
- The **Free** base URL embeds the short code: the Kit landing-page slug equals its own backhalf (`<code>-free`). This is the lead-magnet page.
- **Kit-YouTube** is the redirect the lead magnet sends people to after signup. Its backhalf short form is `kityout` (not `kit-youtube`), and AI-Operator's is `aioperator`. These two are fixed short forms, not auto-derived.

## Full URL format
`<base_url>?utm_source=youtube&utm_medium=video&utm_campaign=<slug>&utm_content=<utm_content_lowercase>`

> **Hard rule: `utm_content` is lowercase, and the Long URL and the UTM Content column must carry the identical value.**
> The CSV declares `utm_content` in two places. When they disagree, Bitly resolves the conflict inconsistently: in the 2026-08-18 `htral` import it kept the Long URL verbatim for `accelerator`, `agency`, and `free`, and rewrote the other three rows into alphabetical parameter order with the lowercase column value. Same CSV, same batch. Keeping the two values identical removes the conflict. Lowercase is the established standard: about sixteen videos of history use `accelerator`, `agency`, `cowork`, `free`, and `kit-youtube`.
> One wrinkle to know about: `ai-operator` is split in the historical data, six links as `AI-Operator` against two as `ai-operator`. Lowercase is still correct going forward, for consistency with the other five funnels, but GA4 will show the older six separately.

## Old full URL format (superseded 2026-08-18)
`<base_url>?utm_source=youtube&utm_medium=video&utm_campaign=<slug>&utm_content=<MixedCase>`

## Bitly CSV columns (the "YT bitly" tab layout)
`Long URL, Backhalf, Tags, Title, UTM Source, UTM Medium, UTM Campaign, UTM Term, UTM Content`

- **Tags** = `youtube` for every row.
- **Title** = `<utm_content> - <video title>`, using the canonical label verbatim (e.g. `Accelerator - 10 skills...`, `AI-Operator - ...`, `Kit-YouTube - ...`). Never run it through `PROPER()`: the sheet formula mangles these two into `Ai-Operator` and `Kit-Youtube`. Confirmed by Oskar 2026-08-18.
- **UTM Source** = `youtube`, **UTM Medium** = `video`, **UTM Campaign** = slug.
- **UTM Term** = blank. The Ben AI links do not use a utm_term. If the user wants one populated, ask what value and update the script.
> [!important] The Cowork backhalf changed to `-os` on 2026-08-26, forward only
> [[Oskar Johnston]]'s call. New videos get `c.benai.co/<code>-os`. Links already live keep `-cowork`, and renaming a live backhalf breaks it wherever it has already been published, so `tnwtb-cowork` and everything before it stay untouched.
>
> `utm_content` stays `cowork`. Only the short link changed, and keeping the reporting label steady is what makes the funnel comparable across the boundary. If the label should move too, change both together.

- **UTM Content** = lowercase term (`accelerator`, `agency`, `cowork`, `ai-operator`, `free`, `kit-youtube`). Must match the `utm_content` in the Long URL byte for byte. See the hard rule above.

## Changing a destination
If a base URL, term, or backhalf short form changes, edit the `DESTINATIONS` table at the top of `scripts/utm_creator.py` and note the change here.
