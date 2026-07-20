# Analysis Framework (transcripts to themes)

How to turn a batch of meeting transcripts into the `WEEKS`/`LEXICON` data the dashboard
renders. Read this in the analysis step. Every output traces to a real transcript, never
invent a theme, a count, a member, or a quote.

## Contents
1. What a theme is
2. Section assignment
3. Extraction procedure
4. Canonicalization against LEXICON
5. Counts, frequency, streak, resolved
6. Stuck-member detection
7. Quality bar

## 1. What a theme is
A theme is one recurring topic, question, problem, or pattern that shows up across the
period's meetings. Not a summary of one call. A theme earns its place when it appears in
more than one meeting, or appears once but is high-signal (a blocker, a churn risk, a
repeated question). One clear idea per theme, with a real answer or current status.

## 2. Section assignment
Every theme gets a `section` id from the catalog in `report-config.md`. Default catalog:
- `pain-points`: problems, friction, blockers, confusion, unmet needs, complaints.
- `tech-patterns`: recurring technical approaches, tooling questions, architecture or
  setup patterns, how-to topics.
Assign by what the theme IS, not who raised it. If a theme fits no catalog section, either
add a new section id to the config or leave the theme's section as its best-fit slug (the
dashboard renders unknown sections under an auto "Other" block so nothing is lost).

## 3. Extraction procedure
1. Read each transcript (or its summary plus key segments) for the period.
2. Note every distinct topic, question, problem, or decision, with the speaker and a
   verbatim sentence that captures it.
3. Cluster those notes across all meetings into candidate themes. Two notes belong to the
   same theme when they are the same underlying idea, even if phrased differently.
4. For each cluster, write: title (plain, specific), one-to-three-sentence summary that
   states the theme and its resolution or current answer, the members who raised it, and
   one to four verbatim evidence quotes with source + id + member.
5. Drop clusters that are single low-signal mentions. Keep single mentions only if they are
   blockers, risks, or repeated-from-prior-period.

## 4. Canonicalization against LEXICON
Before finalizing a theme id, check `LEXICON`:
- If the theme matches an existing `canonical` (directly or via an alias), reuse that
  `canonical` as the theme `id`, and add any new phrasing you saw to that entry's `aliases`.
- If it is genuinely new, add a new LEXICON entry with `status: "emerging"`.
This is what keeps streaks accurate across periods. Skipping it fragments one theme into
several and breaks recurrence tracking.

## 5. Counts, frequency, streak, resolved
- `calls_count`: distinct meetings this period where the theme appeared.
- `posts_count`: distinct non-meeting items (0 for meetings-only runs).
- `frequency`: total mentions this period (calls + posts).
- `streak`: consecutive prior periods (walk earlier `WEEKS`) whose themes include this same
  `id`, plus this one. A theme new this period has streak 1.
- `resolved`: true only when the transcripts show the team reached a clear answer. If it is
  still open or recurring unresolved, false.

## 6. Stuck-member detection
A member is stuck when they raise the same theme across two or more periods without it being
resolved for them, or a transcript shows them explicitly blocked. For each, record `member`,
the `theme` title, `weeks_stuck` (count of periods they have been on it), and `first_seen`
(date of the earliest period they raised it). Rank by `weeks_stuck` descending. Scope note:
"member" reads as customer / account / rep depending on the run scope (see report-config.md).

## 7. Quality bar
A period's data is good when: every theme has real evidence quotes, every count matches the
transcripts, sections are assigned by topic, ids are canonicalized against LEXICON, and no
copy contains em dashes or invented figures. If you cannot support a theme with a real quote,
cut it.
