---
name: email-personalization
description: Write hyper-personalized cold email icebreakers for B2B leads using their company intelligence and LinkedIn
  data. Use this skill whenever the user says "write icebreakers", "personalize emails", "email personalization",
  "cold email first lines", "write opening lines", "personalize outreach", "create email openers", or has
  enriched leads and wants to write the first line of a cold email for each. Also trigger when the user has
  a CSV with lead intelligence columns and wants to generate personalized outreach copy. This skill produces
  icebreakers that sound human, reference real observations, and tie back to the user's product/service.
---

# Email Personalization

You are writing hyper-personalized icebreakers (the first 1-3 sentences of a cold email) for B2B leads. Each icebreaker must demonstrate that real research was done, reference a specific observation about the lead, and tie it back to why the email is worth their time.

## Before You Start

You need three things:

1. **The enriched lead list** - a CSV or JSON with lead intelligence data (company info, LinkedIn profile, LinkedIn posts, general web intelligence)
2. **The user's product/service** - what are they selling? You need to understand this deeply so you can tie observations to relevance. Ask: "What exactly are you selling, and why would these leads care?"
3. **The user's ICP context** - who are these leads? What niche, what vertical, what role? This shapes what observations matter.

If the user has already provided this context earlier in the conversation, don't ask again. But if you're starting fresh, get all three before writing a single icebreaker.

## The Process

### Step 1: Understand the Product

Before writing anything, internalize what the user is selling and why it matters to the leads. Ask yourself:
- What problem does this product solve for these specific leads?
- What signals in their data would indicate they need this?
- What would make a lead think "this person actually understands my business"?

This understanding shapes EVERY icebreaker. A good icebreaker connects an observation to a reason the email matters. Without understanding the product, you're just flattering people.

### Step 2: Write 2 Test Icebreakers

Always do this first. Pick the first 2 leads, write icebreakers for each, and present them to the user for approval. This calibrates the tone, style, and angle before you scale.

Present multiple options per lead (2-3 variations) so the user can pick the style they prefer.

### Step 3: Get Approval and Adjust

The user will give feedback. Common adjustments:
- "Too formal" / "Too casual"
- "Don't reference X, reference Y instead"
- "I like option A's style, apply it everywhere"
- New rules to follow

Incorporate ALL feedback before scaling.

### Step 4: Spawn Sub-Agents

Once approved, spawn `icebreaker-writer` sub-agents to handle the remaining leads. Each sub-agent handles 5 leads.

**Every `icebreaker-writer` sub-agent must receive:**
1. The batch of leads (all columns: name, company, general intelligence, LinkedIn data)
2. The full set of writing rules (copy them verbatim from the rules section below plus any user-added rules)
3. The approved example icebreakers (the 2 you wrote plus any the user provided)
4. The user's reference examples (if they provided any)
5. Clear context on what the user is selling and why it matters

**Critical: Spawn ALL `icebreaker-writer` sub-agents in a single message.** If there are 38 remaining leads, that means 8 sub-agents spawned simultaneously. For 500 leads, that's 100 sub-agents in one shot. Every sub-agent launches at once for maximum parallelism.

**Never batch sub-agents sequentially.** Do not spawn 5, wait, spawn 5 more. Spawn ALL in one message. The Task tool supports unlimited concurrent sub-agents.

### Step 5: Compile and Quality Check

After sub-agents complete:
1. Collect all icebreakers
2. Scan for rule violations (see Quality Checks below)
3. Fix any violations programmatically
4. Add an `Email Personalization` column to the CSV
5. Match icebreakers to leads by name
6. Handle name mismatches (MBA suffixes, middle names, etc.)

## Writing Rules

These rules are non-negotiable. Every icebreaker must follow ALL of them.

### Tone and Style

- Write like a real person. Casual, direct, no corporate speak.
- Keep it to 1-3 sentences. No fluff, no filler.
- The icebreaker should feel like it was written by someone who actually looked at their stuff, not by an AI that scraped their LinkedIn.
- Use contractions. Write "you're" not "you are", "we've" not "we have".
- Slight imperfections are fine and even desirable. A typo-free, perfectly structured sentence can read as AI-generated.

### Conciseness and Punch

- Be concise and punchy. Every word must earn its place.
- Remove filler phrases like "I thought I'd reach out because", "reason I'm reaching out is". Get to the point.
- Don't pad icebreakers with generic context. If the observation is specific, the reader will understand why you're emailing.

### Make It Personal, Not Company-Level

- **Write about the PERSON, not just their company.** Reference things they personally said, posted, or did. Not just "your company does X" but "saw you talking about X" or "I know you've been focused on X."
- If there's LinkedIn post data, personal interests, or role-specific info, USE IT. The icebreaker should feel like it's written to a human, not to a company.
- Only fall back to company-level observations when there's genuinely no personal data available.
- Generic company descriptions like "content for cause-driven brands in the detroit area" are NOT acceptable. That's what an AI scraper would write. Be specific or don't mention it.

### Assumptive Tone

- Be assumptive, not tentative. Say "I know you're doing SEO for X in Y" not "Since you're doing SEO and..."
- Don't hedge. Don't say "I was wondering if..." or "thought this might be relevant". State what you know and connect it.
- The icebreaker should read like it comes from someone who already understands their business, not someone asking permission.

### Flow and Interconnection

- The entire icebreaker must feel like one interconnected thought. The observation must flow naturally into the pitch.
- If the observation doesn't connect to the pitch, DON'T USE IT. Find a different observation that does connect.
- Never force a disconnected observation just because it exists. A forced icebreaker is worse than a simpler one that flows.
- Test: read the icebreaker aloud. If you have to mentally "switch gears" between the observation and the pitch, it doesn't flow.

### LinkedIn Post References

- Only reference LinkedIn posts when they're RELEVANT to the pitch. Don't force irrelevant posts just to show you did research.
- If the post topic doesn't connect to what you're selling, skip it and find a different angle.
- When you do reference a post, actually engage with the idea. Don't just say "loved your post on X". Explain WHY you agree or what you took from it, casually.

### Formatting Bans

- NEVER use m-dashes or em-dashes. No "—" characters. Use commas, semicolons, or periods instead.
- NEVER use bullet points or lists in an icebreaker. It's a sentence, not a document.

### Opening Line Rules

- NEVER start with "Saw your post" or "Noticed your post" or "Saw your recent post". Instead use: "Saw you on LinkedIn, your post about..." or "Was on your LinkedIn, your take on..."
- NEVER start with "Impressive to see" or "Loved seeing" or "Great to see". Instead use: "Was stalking you on LinkedIn and realized..." or "Was on your LinkedIn and realized..."
- NEVER start with "Your post on..." or "Your recent post about...". Always lead with how you found it.
- NEVER start with "I noticed..." or "I came across...". Too formal.

### Content Rules

- NEVER quote them directly. Always paraphrase. If their LinkedIn says "AI-first, values-driven agency in the NYC metro", you cannot write that in the icebreaker. It's an obvious copy-paste and reads as AI. Rephrase it in your own words.
- NEVER use these words/phrases: "spot on", "data-driven", "values-driven", "AI-first" (when quoting their self-description), "compelling", "resonated", "innovative", "leverage", "synergize"
- When you mention a LinkedIn post, you MUST explain WHY you agree. Don't just say "loved that" or "couldn't agree more". Actually explain the reasoning casually, then transition into the pitch. Example: "...your take on being skeptical of Google Ad Rep calls; honestly those reps are incentivized to get you to spend more, not to improve your ROI, so I totally get why you'd tell clients to take their advice with a grain of salt."
- ALWAYS mention something specific about their niche, location, or compliance requirements. If they work with healthcare clients, mention HIPAA. Law firms? Bar advertising compliance. Specific geography? Name the region. This shows research depth.
- ALWAYS tie the observation back to why the email matters. Every icebreaker must connect to the product/service being sold. The formula is: observation + why it matters + bridge to your product.

### The ICP Connection

This is the most important rule. Every icebreaker must connect an observation from the lead's data to the user's product/service. You're not just flattering them, you're showing relevance.

- Find signals in their data that relate to the product being sold
- A post about AI search? Tie it to your AI SEO product.
- They work with healthcare clients? Mention the compliance content challenge.
- They just won an award? Congrats, then bridge to how scaling creates content needs.
- They're hiring content people? That signals a bottleneck you can solve.

If you can't find a relevant signal, use their niche + a general bridge. Never write a purely flattering icebreaker with no product tie-in.

### Handling Leads with Thin Data

Some leads will have minimal intelligence (no LinkedIn posts, sparse profile, no case studies). For these:
- Use their niche + geography + role as the anchor
- Reference something observable on their website if general intelligence is available
- Keep it shorter; don't fabricate depth that isn't there
- A simple, honest icebreaker that flows is better than a padded one that tries too hard

### Skipping Leads

If the intelligence data reveals a person-company mismatch (e.g., the person doesn't actually work at the company listed, or the company does something completely different from what the CSV claimed), the sub-agent should SKIP that lead and note it in the output with a reason. Do not write an icebreaker based on incorrect data.

## Reference Examples

Below are 55+ real icebreakers that demonstrate the correct tone, style, and approach. Study these patterns:

1. We literally just worked with another swiss agency by the name of My Online Marketing, do you know them?
2. We recently worked with Eskimoz, I know you guys are betting big on AI search too, thought I'd reach out.
3. Saw on the vojood website how you guys are following the traditional 5-step SEO flow, wondering how much of that is still manual?
4. Loved what you did with Bernerland, since you're also big on Marketing Automations, thought I'd reach out.
5. Saw one of your posts on how marketing spend is usually the first one to be trimmed when one thinks of cost cutting; however, through automation, I'm of the belief you could do so without hindering growth.
6. Saw your post on whether SEO is dead, 100% agree on the fact that its no longer about keywords. Its about generating machine readable content that solves the search intent for the user.
7. I see that you're mostly doing CRO and betting big on Ads. What about content SEO?
8. I know you're mostly doing local SEO and some content too, since you're big on AI (as per your LinkedIn); wanted to understand how much of the content gen is automated at DME
9. Great to see you're branding yourself as an AI first marketing agency; reason I'm reaching out is because I didn't see much around SEO content on the site, I believe that could be the next best upsell for boostlab.
10. Saw you've already spent a year at radyant focusing on content strategy, since you guys are centered around AI search, thought I'd reach out.
11. Since you're already centered around AI search, hoping this would be worth your time because we just worked with Eskimoz too.
12. Since digiberries is already centered around AI search, hoping this would be worth your time because we just worked with Eskimoz on this too.
13. This email will probably suck since I genuinely admire your ability to express ideas through content on LinkedIn, but as I found AI to be one of your interests, hope this is worth your time.
14. I see you guys are already adapting to how AI is transforming search, I really wanted to reach out because we recently worked with Eskimoz on this.
15. I wanted to reach out to Jean but since you're overlooking the content side of things thought this would resonate with you; we also recently worked with Eskimoz.
16. Thought we have some synergies considering you're working around Wordpress (and we do too) and we worked with Eskimoz recently. Since you're already adopting AI to a great extent, I'm sure you already have automated most of your content SEO ops yourself, in case you haven't, this may be worth a look.
17. Wanted to reach out because I'm a fan of your truth based marketing values, I think we have some synergies considering you're working with home service folks, and usually they're lacking in their content SEO game.
18. I saw you're focused on out of the box solutions for non-profits; i think we have some synergies, I'm sure this would be of interest because we literally are "SEO Agency In a Box".
19. Since you're mostly focused on CRO but I know how SEO would be a priority especially considering how search is changing with AI. Reaching out because we have some synergies, and I love the SEO ROI calculator on the website haha.
20. I know you just started Ignis last year with Scott, I wasn't sure if I should be reaching out to him or you; since you seem to be more involved in all things SEO and tech, figured this would be of interest to you.
21. I saw you love Reddit, so do I, its internet at its most authentic (hope that lasts); but reason why I'm reaching out is because I was on the made simpler website and noticed you guys do content clustering, I think this could be worth a look.
22. I wasn't sure if I should be reaching out to you or steve, but I saw you're based out in UT and do content SEO under your growth plan, we recently worked with Boostability to automate their content flows, could be worth a look for you.
23. Saw you guys made it to inc 5000 last year, congrats on that. Since we recently worked w Boostability to automate their content gen flows, this could be worth a look.
24. Its a bold move to put a mirror selfie on your website. But since you're based out in UT AND we recently worked with Boostability to automate their content flows; could be worth a lookie for you.
25. I feel you on AI generated slop (saw a post of yours hating on it), and that's exactly what we're trying to avoid with well researched content that actually fits into a broader strategy, could be worth a lookie for you.
26. I can see you're niched on pest control, that's cool, but I can also see how you're having to outsource some of the SEO related content writing; which might be hindering growth. We worked with boostability recently, could be worth a look for you.
27. We're using rb2b, how's local track different? I also saw you guys are going big on AI search; we recently worked with Boostability on this, could be worth a look for you.
28. Love the Ace framework, but I'm curious how much content SEO is part of the 'attract' bit since you're targeting local. I'm reaching out about capitaltec, saw your post on content length not being a factor anymore, 100% agree. Its all about solving for the search intent with clarity, I think this could be worth a look for you.
29. Love the direction DPI is taking, I know you guys are doing a lot of SEO content writing, wonder how much AI you're using to automate that process?
30. Interesting to see that you have a background in art, I guess that clearly ties into creative marketing. I'm reaching out because I'm sure you're outsourcing a lot of SEO content writing, and we have a way to help you keep up with AI search.
31. Reaching out because we recently helped Boostability automate their content gen flows, I know you mostly do local but I'm sure you're publishing at least 100-200 content pieces per month. This could be worth a look.
32. I looked at your post on how search is moving away from keywords, I couldn't agree more. Its actually insane how many agencies still create their entire content strategy around keywords without ever aiming for Topical Authority or caring about the search intent, LOL. Reaching out because we recently worked with boostability automate their content gen flows, this could be worth a look.
33. I know you've worked with 100s of marketing teams and transformed how their work; I see some synergies here and believe there are opportunities to partner up.
34. Reaching out because we recently worked with sprints and sneakers automate their content gen flows. I also saw your recent post on AI automation, totally agree; you need end to end systems that WORK, not wrappers, not fluff. That's exactly what we do.
35. I know you guys are already doing workshops on AI search, reaching out because we recently worked with Ink Digital to automate their content gen flows, this might be worth a look.
36. Love the BFG ICP identification method you guys came up with, saw Jessica talking about that on your Linkedin. Reaching out because we've scaled various SaaS businesses SEO using automations, might be worth a look for you.
37. Your problem based content approach to search really resonated with me. Since we've recently worked with Eskimoz, Boostability and Ink Digital to automate their problem based content gen flows, this might be worth a look.
38. You're all over the place, and I know you're already using AI for creatives but really wonder how much of your client SEO content is automated; we've worked with other global agencies like Boostability on the same, this might be worth a look for you.
39. Listened to the recent pod, the insight from Jasper on how Clay lead the new trend on GTM engineer roles in form of a promotion blew my mind.
40. You've been in the space 14 years and I know you've recently invested in AI infra, wondering how your performance team is using AI to automate seo based content gen. We recently worked with Ink digital on the same, might be worth a look for you.
41. Nice to see you're a fellow good deeds attempter, recently worked with Ink digital in brentwood to automate their seo content gen flows, might be worth a look for you.
42. Great to see you're already doubling down on AI search by offering GEO as a service, we recently worked with sprints and sneakers to automate their content gen flows, this may be worth a look.
43. Wasn't sure if I should be reaching out to you or Lysette since she's overlooking strategy (feel free to loop her in if that is the case); I know you guys are big on SEO content, and we recently worked wth sprints and sneakers to automate their content flows, might be worth a look.
44. Wasn't sure if I should be reaching out to Tess for this (feel free to loop her in if that's the case), wondering how much of your seo content flows are automated with AI, we recently worked with Ink digital on the same so this may be worth a look.
45. I know you guys acquired Flowhuub, reaching out because we recently worked with Sprints and Sneakers to make their SEO AI first, this may be worth a look for you.
46. I know you get a ton of outreach so I won't BS you. I wasn't sure if i should be reaching out to Jonny or you, but we recently worked with Boostability and Eskimoz on this. Might be worth a lookie.
47. Saw on the peakfort site that you're doing AI based content, wondering what the platform looks like? We've done something similar, and could be worth a look because we did the same for Sprints and Sneakers.
48. I know you've got Marc building automations for you, wondering how much of your SEO is automated, we worked with Sprints and Sneakers recently, might be worth a look for you.
49. Wasn't sure if I should be reaching out to Nick for this, but since you're connected with Michael Ryan on LinkedIn (we worked with Ink Digital to automate their content gen flows recently), I thought this could be worth a look for you.
50. Wasn't sure If I should be reaching out to Alessia for this because I saw her post on the SEO specialist hire, but since you're connecting with Jason Morris (we recently worked with profit engine to automate their content gen flows), this could be worth a look for you.
51. I was about to reach out to Erik but realized this may be more under your purview. We recently worked with Sprints and Sneakers to automate their content gen flows, this might be worth a look.
52. Congrats on making it to Fonk 150, we recently worked with Sprints and Sneakers to automate their content gen flows, since you guys are ramping up, this may be worth a look.
53. Wasn't sure if I should be reaching out to Mark or yourself, this may be more up your alley since you're in the trenches working on GEO. We recently worked with Ink digital on this, could be worth a lookie.
54. Wasn't sure if I should be reaching out to Steven or yourself, this may be more up your alley since you're in the trenches working on GEO. We recently worked with Sprints and Sneakers on this, could be worth a look.
55. Wasn't sure if I should be reaching out to you or Jeroen, we worked with Sprints and Sneakers on this, might be worth a look for you.
56. Wasn't sure if I should be reaching out to Sion for this, but since you're in the content trenches this may be relevant. We recently worked with Sprints and Sneakers on this, could be worth a look.
57. Reaching out because we recently worked with Sprints and Sneakers to automate their content gen flows, this might be worth a look since you guys are ramping up your AI usage.

## Quality Checks

After generating all icebreakers, run a programmatic scan for violations:

```python
bad_starts = ["saw your post", "saw your recent", "noticed", "impressive", "loved seeing", "loved that", "your "]
bad_words = ["spot on", "data-driven", "data driven", "values-driven", "ai-first", "compelling", "resonated", "innovative", "leverage", "synergize"]
# Also check for m-dashes: "—" and "---"
```

Fix any violations before saving to the CSV. Common fixes:
- "Saw your post on X" becomes "Saw you on LinkedIn, your take on X"
- "Noticed X" becomes "Was stalking you on LinkedIn and realized X"
- "Impressive to see X" becomes "Was on your LinkedIn and realized X"
- Remove all m-dashes and replace with commas or semicolons
- Rephrase any direct quotes into casual paraphrases

## Output

Add an `Email Personalization` column to the CSV. Match by lead name (watch for suffixes like "mba", "ma" in last names). Report the total count and confirm all leads were matched.
