# Data Schema (the report data contract)

The dashboard is fully data-driven. It renders two arrays, `WEEKS` and `LEXICON`, injected
into `references/dashboard-template.html`. Nothing in the report is hardcoded, change the
data and the whole report changes. This is what makes the skill customizable rather than
static.

Produce the data as valid JSON, then paste it into the template (see
`dashboard-template.html` HOW TO USE). Never invent numbers or quotes. Every count traces
to a real Fireflies (or other source) result, every quote is copied verbatim from a real
transcript or post.

## WEEKS

An array of period objects, oldest first. A "week" is one report period (see
`report-config.md` for daily vs weekly cadence, the field names stay `week_*` either way).

```json
{
  "week_start": "2026-06-22",
  "week_end": "2026-06-28",
  "week_of_month": "June W4",
  "calls_processed": 42,
  "posts_processed": 0,
  "themes": [ /* Theme objects, see below */ ],
  "stuck_members": [ /* StuckMember objects, see below */ ],
  "body_html": "<optional pre-rendered HTML block, usually omit>"
}
```

- `calls_processed`: number of meeting transcripts analyzed this period.
- `posts_processed`: number of non-meeting items (community posts, tickets) analyzed. Set 0
  when the run is meetings-only.
- Multiple period objects power the ← → navigation and the trailing-window recurring-themes
  section.

## Theme

The core unit. One recurring topic, problem, or pattern surfaced across the period.

```json
{
  "id": "multi-client-os",
  "title": "Single second brain vs one per client",
  "section": "pain-points",
  "summary": "One to three sentences stating the theme and the resolution or current answer.",
  "calls_count": 4,
  "posts_count": 0,
  "frequency": 4,
  "streak": 4,
  "resolved": true,
  "members": ["Ivan Buric", "Mattia Nanetti", "Bridget Mao"],
  "evidence": [
    {
      "source": "fireflies",
      "transcript_id": "01KVQJKXW2BQ7NHA9M5NJT38MD",
      "timestamp": "12:34",
      "member": "Milan Kumar",
      "quote": "verbatim sentence copied from the transcript"
    },
    {
      "source": "circle",
      "post_id": "33942779",
      "member": "Ivan Buric",
      "quote": "verbatim sentence copied from the post"
    }
  ]
}
```

- `id`: stable kebab-case slug. Must match a `LEXICON.canonical` so the theme is tracked
  across periods.
- `section`: which report section this theme renders under. Value is a section id from
  `report-config.md` (default catalog: `pain-points`, `tech-patterns`). Add a section by
  adding a new id here and to the config, the template renders any section it finds.
- `frequency`: how many times the theme came up this period (calls + posts).
- `streak`: consecutive periods this canonical theme has appeared. Compute by walking prior
  `WEEKS`. Drives the recurring-themes section and the streak badge.
- `resolved`: true when the team reached a clear answer, false when still open.
- `evidence`: 1 to 4 verbatim quotes with real source attribution. `source` is `fireflies`
  for meetings, `circle` for community posts, extend with other source names as needed.
  Include `transcript_id` (and optional `timestamp`) for fireflies, `post_id` for circle.

## StuckMember

A person blocked on the same theme across multiple periods, or flagged for follow-up.

```json
{
  "member": "Bridget Mao",
  "theme": "Single second brain vs one per client",
  "weeks_stuck": 3,
  "first_seen": "2026-06-08"
}
```

Rename "member" mentally to customer, account, or rep depending on scope (see
`report-config.md`), the field name stays `member`.

## LEXICON

A controlled vocabulary that canonicalizes themes so the same idea phrased three ways still
counts as one recurring theme. Maintained across runs, it is how streaks stay accurate.

```json
{
  "canonical": "niche-selection",
  "section": "pain-points",
  "aliases": ["picking a niche", "vertical selection", "positioning at the start"],
  "status": "confirmed"
}
```

- `canonical`: the stable slug used as a Theme `id`.
- `aliases`: phrasings that map to this canonical. When a new phrasing appears, add it here.
- `status`: `confirmed` for an established recurring theme, `emerging` for a new candidate.

The self-improvement rule keeps LEXICON growing: every run, fold new phrasings into existing
canonicals or add a new `emerging` entry, so recurrence tracking improves over time.
