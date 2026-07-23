# Values, Beliefs & Stories, Source Docs

Ben maintains two living documents that feed the newsletter. **Always fetch the live version at the start of a session that draws on them**, Ben adds answers regularly.

## The two source docs

### 1. Values & Beliefs doc
Long-form answers about work, success, fears, non-negotiables, habits, routine, diet, past businesses, and what he'd say publicly even if it cost followers.
- **Notion (canonical, public):** https://harsh-ease-124.notion.site/Values-Beliefs-3a41124570fe80f7ac6ddcb8909d2fa3
- Google Doc mirror ID: `15i2Wqwl-QpDEQJpixDdJLgkrame0SjgUjF5wHBAK9OQ`

### 2. Stories doc (daily questions)
Short daily prompts Ben answers about recent moments: funny thoughts, travel incidents, conversations that stuck, small annoyances, "most people think about this wrong" realizations. The richest source for daily story emails.
- **Notion (canonical, public):** https://harsh-ease-124.notion.site/Stories-3a41124570fe80a78620e81c18cd766b
- Google Doc mirror ID: `1W1ugpaurZCccYGbzy5x9PCt0DaORQoROsi5sbU2QzFU`

### How to fetch

The Notion pages are the canonical versions Ben updates. They are public but JavaScript-rendered, so a plain HTTP fetch (WebFetch/curl) returns only an empty shell.

**Primary method, Firecrawl scrape** (verified working):
```
firecrawl_scrape with:
  url: <the Notion URL above>
  formats: ["markdown"]
  waitFor: 5000
  onlyMainContent: true
```
(Equivalent: the `firecrawl` skill / Firecrawl CLI with the same waitFor option.)

**Fallback, Google Doc mirrors** via the gws CLI:
```
gws drive files export --params '{"fileId":"<DOC_ID>","mimeType":"text/plain"}' -o <output.txt>
```
If the two versions differ, the Notion page wins, flag the discrepancy to Ben.

When mining these docs: identify which answers are NEW since the last newsletters (cross-check against `08_Newsletter_Examples.md`, e.g. the 200K story, Tokyo cops, and taxi translator are already used), and propose angles from unused material first. One rich answer can yield multiple emails from different angles.

## Distilled: Ben's core values & beliefs (snapshot, July 2026)

**Purpose & work**
- Purpose/mission beats happiness-chasing. Building something you believe in > money (paid himself $800/month for 3 years; felt worse in a well-paid comfortable job than broke building his own thing).
- Entrepreneurship is a career, not a gamble: front-loaded sacrifice, back-loaded freedom.
- You can learn anything; it's easy to outperform most people because most are distracted and unfocused. Focus + sacrifice on high-leverage things wins.
- Tiny-team philosophy: high-margin business, handful of high-agency people. No billion-dollar ambition, past a point, scale adds problems and subtracts freedom.
- Work-life balance is yearly, not daily. Works 7 days/week by choice; picks 1–2 life areas to prioritize each year and accepts the rest won't grow (kills FOMO).

**Fears (usable vulnerability)**
- Losing YouTube traction; taking view counts personally.
- Being seen as a guru/fake, grew up with Dutch feet-on-the-ground mentality; judges "look how special I am" social media, so fears being seen that way.
- Not capitalizing enough on the opportunity (source of his obsessiveness); struggles to delegate (perfectionist since childhood football days).
- Personally: not developing other life areas while friends build families.

**Non-negotiables**
- Integrity and quality. Won't ship below the bar even when shipping faster would help the business. Anti-guru, expects high integrity from the team.

**On AI (contrarian positions he'll defend)**
- Stop consuming, start using. AI literacy comes from reps, not videos.
- Most new features don't matter; someone using a year-old model well beats someone using the newest model badly.
- Most "AI experts" on YouTube are marketers covering news, not builders.
- Building an AI business is just as hard as any business; the "rich in 90 days" pitch is exactly what makes people quit.
- Distribution, sales, account management > technical skills. AI agencies are HR-heavy with ~20% margins; education is the high-margin path.
- Still extremely early; real value beyond coding largely unproven. AI is strong at verifiable work, overrated at taste/judgment, which is why domain experts with taste win.

**Habits he preaches**
- Do it every single day (no negotiation), how he quit alcohol (3+ years) and exercises daily.
- Ice baths & saunas almost daily ("totonou"), daily journaling with stoic prompts ("What 3 things make today a win?", "Where am I doing $10/hr work that should be $1,000/hr?"), deep work with phone away, intermittent fasting (eats at night, loves desserts, terrible cook, eats out).
- Reads before bed; phone away from the bed.

**Biography beats (for story emails)**
- Physiotherapist → gap year Costa Rica/Colombia → taught English → appeared 2 seconds in Narcos as a CIA agent (and got shot in a telenovela).
- First startup (PROFY, language-learning marketplace with co-founder Oskar): Startup Chile, raised capital, 5-year grind, bankrupt, great product, no scalable acquisition channel. The formative lesson: distribution first.
- CMO of NoCRM: earned more than ever, felt worse than ever, quit.
- Started YouTube June 2024 after hearing Hormozi's "focus on inputs, not outputs" / "do so much volume it would be unreasonable to fail", goal: 100 videos in 2 years. Hit 200K subscribers at video ~97, right on schedule.
- Introvert; not a "natural" on camera, just reps.
- Lives in Brazil; recently working from Madrid, Bali, Tokyo. 1.94m tall (fun detail in travel stories).
- Inspirations: Naval Ravikant, Alex Hormozi (inputs), Ed Lawrence (make content only you can make), Essentialism by Greg McKeown ("What's the one thing you can't say no to?", led to shutting down two businesses).
