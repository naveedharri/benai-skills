# Data provenance, refresh, and Wispr Flow update

Read this only when refreshing the corpus or updating the skill from new source data.

**Contents:** Data provenance · Refreshing a register · Updating with Wispr Flow transcripts.

## Data provenance and refresh

Corpus collected 2026-07-10: YouTube (10 latest videos, auto-captions), Circle comments (list_comments sweep filtered to Ben's account), Slack (from:@Ben search, 7 days), LinkedIn (Apify harvestapi/linkedin-profile-posts, 2 months), newsletters (Gmail, Kit sends from Ben's address, NOTE: some daily sends come from a teammate; filter by sender). The newsletter file is built on ONE atypical promo week; re-run its analyst against a normal month when convenient. The LinkedIn file covers only video-companion posts.

To refresh any register: re-collect with the same method, then re-run the distillation prompt for that register (measured distributions, verbatim gold examples, never-does verification), and update the reference file. Live data always wins over older claims.

## Updating with Wispr Flow transcripts (Ben: run this when ready)

Ben's Wispr Flow dictations are the highest-volume source of his unfiltered spoken-thinking voice and will sharpen every casual register. When Ben says something like "update the skill with my Wispr Flow transcripts":

1. Locate the local Wispr Flow database on his Mac: look under `~/Library/Application Support/Wispr Flow/` (usually a `flow.db` SQLite file; verify with `ls` first).
2. Export the transcript text column (SQLite: table with dictation history; inspect schema with `sqlite3 <db> ".schema"`).
3. Split the dictations by destination app where metadata allows (Slack, email, browser), they map to different registers.
4. Run the same distillation pass used for the other registers: measured phrase counts, openers, never-does verification against what the current references claim.
5. Merge findings INTO the existing reference files (do not replace the channel files; Wispr data refines the casual/spoken fingerprint in `values.md` Spoken-thinking section and the Slack/DM files).
6. Re-run `CALIBRATION.md`'s checks and update it.
