# Personalization: the opener that proves you looked

The first line of a cold email (the icebreaker) is where the campaign is won or lost. It is the "why you, why now" of the 4-sentence framework, and it must demonstrate real research, reference a specific observation about the person, and flow straight into why the email is worth their time. A generic opener is worse than none, it actively signals "mass blast".

## Table of contents
1. The four personalization types
2. The writing rules
3. Opening-line rules
4. Banned words and the QC scan
5. The process (test 2, approve, scale, QC)
6. Reference examples
7. Thin data and skipping

---

## 1. The four personalization types

Ground every opener in one of these, drawn from the lead's intelligence columns (the research from `lead-generation`). In order of strength:

1. **Exec name-drop.** Reference another executive at the company, or a person they are connected to / report alongside ("Wasn't sure if I should reach out to you or Jeroen..."). Strong because it proves org-level research and creates a natural "loop them in" path.
2. **LinkedIn engagement / intent signal.** What they have been liking, commenting on, or following recently. Shows you watched behavior, not just a static profile.
3. **Recent LinkedIn post.** A post from roughly the last two weeks. Reference the *idea*, say why you agree, then bridge. Never quote it verbatim.
4. **Website / offer reference.** A specific service, case study, framework, location, or compliance need on their site ("saw on the peakfort site you're doing AI based content..."). The fallback when there is no personal signal, still specific, never "content for brands in the Detroit area".

Pick the type with the best available data for that lead. If only company-level data exists, use website reference plus niche/geography, and keep it short.

## 2. The writing rules

- **Write about the person, not the company.** "Saw you talking about X", not "your company does X". Fall back to company-level only when there is genuinely no personal data.
- **1 to 3 sentences.** It is a sentence, not a paragraph. No lists, no bullets.
- **Casual and human.** Contractions, direct, slight imperfection is fine; a flawless sentence reads AI-written.
- **Assumptive, not tentative.** "I know you're doing SEO for X", not "Since you might be doing...". No "I was wondering if".
- **One connected thought.** The observation must flow into the pitch. If it does not connect, find a different observation; never bolt on a disconnected fact to show you did research.
- **Paraphrase, never quote.** Copy-pasting their self-description reads as automation. Rephrase in your own words.
- **Tie to the offer.** Every opener connects the observation to why the email matters: observation + why it matters + bridge to the product. Pure flattery with no tie-in is a fail.
- **Specifics that signal depth:** name the niche, the region, the compliance angle (healthcare -> HIPAA, law -> bar advertising rules). 
- **No em dashes.**

## 3. Opening-line rules

The first words are the highest-risk part. These exact patterns read as templated, so they are banned with their fixes:

- Not "Saw your post" / "Saw your recent post" -> "Saw you on LinkedIn, your post about..." or "Was on your LinkedIn, your take on..."
- Not "Noticed your..." / "I noticed..." -> "Was stalking you on LinkedIn and realized..."
- Not "Impressive to see" / "Loved seeing" / "Great to see" -> "Was on your LinkedIn and realized..."
- Not "Your post on..." (leading with the post) -> always lead with *how* you found it.
- Not "I came across..." -> too formal.

## 4. Banned words and the QC scan

After every opener is written, scan and fix programmatically before anything ships.

```python
bad_starts = ["saw your post", "saw your recent", "noticed", "impressive",
              "loved seeing", "loved that", "your "]
bad_words  = ["spot on", "data-driven", "data driven", "values-driven", "ai-first",
              "compelling", "resonated", "innovative", "leverage", "synergize"]
# also flag any em dash (unicode U+2014) or a "---" triple-hyphen
```

Fixes: rewrite banned openers per section 3; replace banned words with plain alternatives; replace em dashes with commas or semicolons; rephrase any direct quote into a casual paraphrase. Report violations found and fixed.

## 5. The process

1. **Understand the product** well enough to connect observations to relevance. Without that, you are just flattering people.
2. **Write 2 test openers** on real leads, 2 to 3 variations each, and show the user. This calibrates tone before scale, the mandatory checkpoint.
3. **Incorporate feedback** ("more casual", "reference Y not X", "use A's style everywhere") into the rule set.
4. **Scale with subagents.** Spawn `sales:icebreaker-writer`, **5 leads each, all in one message.** Each receives: the batch (all intelligence columns), the full rules above plus any user additions, the approved examples verbatim, and clear product context.
5. **QC** with the scan, then merge openers back by email then name (watch for suffixes like "MBA" in last names).

## 6. Reference examples

These real openers show the target tone, casual, specific, assumptive, always bridging to the offer. Study the patterns; do not copy the content.

- "We recently worked with Eskimoz, I know you guys are betting big on AI search too, thought I'd reach out."
- "Saw on the vojood website how you're following the traditional 5-step SEO flow, wondering how much of that is still manual?"
- "I know you're mostly doing local SEO and some content too, since you're big on AI (as per your LinkedIn), wanted to understand how much of the content gen is automated at DME."
- "Great to see you're branding as an AI first agency, reason I'm reaching out is I didn't see much around SEO content on the site, I think that could be the next best upsell for boostlab."
- "Saw you guys made it to Inc 5000 last year, congrats. Since we recently worked with Boostability to automate their content gen flows, this could be worth a look."
- "Wasn't sure if I should be reaching out to you or Jeroen, we worked with Sprints and Sneakers on this, might be worth a look for you." (exec name-drop)
- "I feel you on AI generated slop (saw a post of yours hating on it), and that's exactly what we avoid with well researched content that fits a broader strategy, could be worth a look." (recent post, with a why)
- "Saw on the peakfort site you're doing AI based content, wondering what the platform looks like? We did something similar for Sprints and Sneakers, could be worth a look." (website reference)

The fuller set of 55+ examples lives in `_retired/skills/email-personalization/SKILL.md` (the consolidated legacy skill) if you want more patterns, but these cover the four types.

## 7. Thin data and skipping

- **Thin data:** anchor on niche + geography + role, reference one observable thing from the site, keep it short. A simple honest opener that flows beats a padded one.
- **Skip:** if the intelligence shows the person does not actually work at the listed company, or the company does something different from what the list claims, skip the lead and note the reason. Never write an opener on data you know is wrong.
