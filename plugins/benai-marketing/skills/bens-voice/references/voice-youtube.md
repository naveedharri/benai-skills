# Ben van Sprundel - YouTube spoken voice fingerprint

Empirical analysis of 10 auto-captioned video transcripts (~47,700 words, May 26 to Jul 8, 2026). All counts are corpus-wide unless marked per-video. ASR note: transcripts render "Claude" as "cloud/clot/CloudCode", "ideating" as "ideulating"; punctuation is machine-guessed, so counts focus on words and phrase patterns, not commas.

**Contents:** §1 Hook patterns · §2 Teaching moves · §3 Signature spoken phrases (counts) · §4 Vocabulary fingerprint · §5 Sentence rhythm and structure · §6 CTA / sponsor segments · §7 English quirks (Dutch speaker) · §8 Video structure (macro shape) · §9 Opinions and stances. Writing a script? Read §1, §5, and §8 for shape, then check §4 and §7 for word choice.

Videos in corpus: 12 Claude Plugins I Can't Live Without; 6 Things People Get Wrong Setting up an AI OS; Claude Managed Agents Will Change How You Sell AI Forever; Claude Tag + Slack Will Change How You Work Forever; Every Claude Cowork Feature Explained Clearly; Every Way To Set Up A Claude Second Brain Explained; How to De-Slop Every AI Output Forever; Stop Using Claude Without an Agentic OS; This Claude Second Brain Setup Will Change How You Do Sales Forever; This Skill Instantly 10x'es Every Claude Output.

## 1. Hook patterns

Verbatim openers (first 1-2 sentences of each video):

1. **12 Plugins**: "If you're using CloudCode or CoWork, you have access to an extensive ecosystem of skills, plugins, MCPs, connectors, and CLIs to instantly upgrade its capabilities. With so many out there, it can be hard to know which ones to actually use."
2. **6 Things People Get Wrong**: "Over the past weeks, we've helped dozens of professionals and businesses set up their AI operating system across my community and my agency. And across these people, there's a clear pattern."
3. **Managed Agents**: "I believe Claude managed agents is going to be one of the biggest opportunities for anyone looking to sell AI solutions. With managed agents, we can pre-package agent workflows with skills, MCPs, memory, and sub agents into AI solutions we can sell."
4. **Claude Tag + Slack**: "Anthropic just launched Claude Tag, and I believe it will have big implications on how businesses work with AI."
5. **Cowork Features**: "Claude CoWork has transformed the way me and my team operate. With so many features and new updates, it can become overwhelming and hard to know how to actually use it efficiently."
6. **Every Way Second Brain**: "Setting up a second brain or AI OS for yourself or your business is the most valuable thing you can do in AI right now. But while most advice is around setting it up through Obsidian, there are some downsides to this setup and there are other options."
7. **De-Slop**: "We all know the frustration of going back and forth with AI only to end up with a completely useless output or the feeling of cringe when we see someone else or even worse a team member put out a clearly AI generated LinkedIn post, email comment or anything else."
8. **Agentic OS**: "If you've worked with a second brain or memory in cloud, you know how powerful it can be for AI to always be able to pull in relevant and up-to-date context around you and your business. But what makes this even more powerful is to have a personalized dashboard or command center on top of it."
9. **Sales Second Brain**: "Claude has entirely transformed the way me and my team do sales. We now automate a large part of our sales operation up to a point that our sales reps are barely in the CRM anymore."
10. **Refresh Skill**: "Most people that use Claude, including me, have a few giant chat sessions we keep coming back to for reviewing copy, writing responses, or other repetitive use cases. And the reason we don't start new chats is because it means re-explaining all of the rules and context for that specific task again."

Pattern types and frequency:
- **Transformation claim from own operations** (3/10): "X has [entirely] transformed the way me and my team [operate / do sales]" + a concrete proof point ("our sales reps are barely in the CRM anymore").
- **Belief-stake on a new launch/opportunity** (2/10): "I believe X is going to be one of the biggest opportunities..." / "Anthropic just launched X, and I believe it will have big implications on...".
- **Shared pain, self-included** (2/10): "We all know the frustration...", "Most people that use Claude, including me...". He always puts himself inside the problem, never above it.
- **Earned-pattern credential** (1/10): "we've helped dozens of professionals and businesses... there's a clear pattern."
- **Value claim + contrarian turn** (2/10): "X is the most valuable thing you can do... But [most advice has downsides / there are other options]." The "But" pivot lands in sentence 2.

**Invariant**: every hook resolves within ~90 words into an explicit promise list: "So, in this video, I'll show you [A], show you [B], and show you [exactly how to C]." ("So, in this video" 7x verbatim; "I'll show you" 27x corpus-wide; the promise is almost always 3 items, sometimes 4). Titles and hooks share the "will change how you X forever" framing (3 titles).

## 2. Teaching moves

**Analogies - always domesticating, never dramatizing.** He explains new concepts by shrinking them to something mundane:
- Context window = "Claude's short-term memory inside of a single chat"; also "thinking of the context window as your own brain on a normal day-to-day."
- Claude.md = "the map that Claude reads at the start of every chat" / "the map for your AI agent" / "a routing table."
- A skill = "just a saved how-to file."
- Second brain = "just a fancy name for one centralized folder"; deals folder = "the CRM but for AI."
- De-slop skill = "like a spell check but for slop."
- Degraded long chats = "the dumb zone" and "the 'you're right to push back' zone" (self-coined, playful).

**The demystifying move (signature):** "All X really is is just [ordinary thing]." Obsidian gets this treatment in nearly every video: "all Obsidian really is is just a visual overlay of a file on your computer," "just a free desktop app that helps you visualize a folder." He deflates hype rather than building it: "it might sound fancy or complicated, but it really is not."

**Concept introduction ritual:** "Now, if you're not familiar with X yet..." (4x) / "if you're completely new to this" (3x) → one-line definition → pointer to a full beginner video → "but you should be able to follow this video, too" (3x verbatim). He pre-handles the beginner without slowing down: "if this is going a little bit too fast for you, don't worry" (variants 5x).

**Demo narration style:** first-person past tense with on-screen proof, not future-tense hypotheticals. "So, here I ran...", "For example, here I asked Claude to create a competitor intelligence Google Sheet...", "and you can see it created a Google Sheet here with all the opportunities." ("as you can see" 24x, "you can see" 69x, "for example" 156x.) Setup instructions switch to plain imperative second person: "All you have to do is just..." (variants 11x), "You can just copy and paste this command line."

**Caveats and nuance - heavy and honest.** "keep in mind" 10x ("Now, one thing you want to keep in mind..."), plus constant trade-off accounting: downside 9x, limitation(s) 16x, advantage 6x, trade-off 4x. He voluntarily undercuts his own claims: "in my experience it's a bit less [than they say]", "I'm not a huge fan here", "not a huge game-changer for me", "please recheck it before uh my word" (on LinkedIn limits), and the standout: "Now, these metrics are not real. I changed them for the video. I wish they were true, but not yet." He also credits sources by name: "credits to Matt Pocock who came up with the handoff skill, which inspired me", "The original framework was built by Andrej Karpathy."

**Why-chaining:** he rarely states a rule without the mechanism. Ritual form: "Now, why is that? Because..." ("why is that" 3x, "Now, why" 4x; "because" 212x). Benefits get restated as consequences: "And this means..." (18x), "this means" (21x), "which of course means...".

**Transitions between sections:** "Now, the next one is..." (12x combined), "Which brings me to the next one," "So that brings me to...", "And then lastly / Now lastly" (13x), plus disciplined enumeration: firstly 15x, secondly 6x, thirdly 10x, lastly 22x. Mid-video re-orientation with "So," + recap of where we are.

## 3. Signature spoken phrases (with corpus counts)

Discourse skeleton:
1. "actually" - 250 (~5.2 per 1,000 words; his #1 tell: "can actually" 45x, "it actually" 11x)
2. "just" - 287 (minimizer: "just a folder", "you can just tell Claude")
3. "of course" - 176 (~3.7 per 1,000 words; concedes shared knowledge mid-sentence)
4. "basically" - 155 ("which basically" 11x, "it basically" 12x, "we can basically" 5x)
5. "for example" - 156 (evidence reflex; nearly every claim gets one)
6. "Now, ..." sentence-opener - 187
7. "Again, ..." - 80 (recap/repeat marker)
8. "So, ..." - dominant clause-chainer (So 1,134 tokens; And 1,686; But 266)
9. "uh" - 264 (his real verbal filler; NOT "you know" [5], NOT "I mean" [1])
10. "essentially" - 16
11. "etc." - 54 (list-truncation habit)
12. "sort of" - 17; "a little bit" - 33; "a bit more" - 11 (softeners)
13. ", right?" tag question - 15

Emphasis and evaluation:
14. "far more / far better / far less" - 49 combined (his intensifier is **far**, never "way")
15. "instantly" - 33 ("instantly become far better")
16. "up-to-date" - 18; "real-time context" - recurring
17. "very powerful" - 7, "really powerful" - 4, "far more powerful" - 6 ("powerful" 36 total)
18. "the nice thing (is/with)" - 7; "the amazing thing" - 2 of 3 "amazing" uses
19. "a big deal" - 4 (+ "huge deal" 1, "huge opportunity" 2)
20. "game-changer" - 3 (rare but present, incl. negated: "not a huge game-changer for me")
21. "token-heavy" - 5, "error-prone" - 3, "burns/burn tokens" - 8 ("token(s)" 83)

Personal stance and hedges:
22. "in my opinion" - 8; "in my experience" - 7; "I believe" - 10; "I think" - 15
23. "I can tell you" - 4 ("And I can tell you this setup makes...")
24. "honestly" - 3 (sparing, sincere: "I honestly noticed for myself...")
25. "me and my team" - 27 (including as subject: "the way me and my team operate")

Instructional recurring lines:
26. "I highly recommend" - 13 ("highly recommend" 17)
27. "keep in mind" - 10
28. "all you (really) have/need to do is (just)..." - 11
29. "I'll show you" - 27; "show you exactly" - 9; "walk(s) you through" - 15
30. "as you can see" - 24
31. "get in the habit of" - 6 of 10 "habit" uses
32. "you'll be surprised how much" - 3
33. "rule of thumb" - 2; "best practices" - 24; "the 80/20 (of)" - 5
34. "context rot" - 6; "second brain" - 165; "context compounds / this context compounds" - 3
35. "less is (often) more" - 4
36. "99% of people (and businesses)" - 4
37. "if you're interested" - 23 (+ "if that's interesting to you" 7) - CTA on-ramps
38. "thank you so much for watching" - 6; "the video here above" - 9; "for free in the first link" - 6

## 4. Vocabulary fingerprint

Required checklist (present/absent with counts):

| Word | Count | Note |
|---|---|---|
| delve | 0 | never |
| leverage | 2 | ONLY as noun ("the highest leverage ones", "get the most leverage out of"); never the verb "leverage X" |
| unlock | 1 | intransitive only: "a few things unlock" - never "unlock the power of" |
| seamless | 0 | never |
| robust | 0 | never |
| game-changer | 3 | used sincerely and sparingly, once negated |
| revolutionary | 0 | never |
| insane | 0 | never |
| crazy | 1 | descriptive, not hype: "doesn't need crazy thinking or reasoning" |
| awesome | 0 | never |
| super | 0 | never (no "super useful", "super simple") |
| literally | 6 | deflationary use: "literally just a folder", "That's literally all you have to do" |
| basically | 155 | top-3 filler |
| essentially | 16 | regular |
| honestly | 3 | rare, sincere |
| frankly | 0 | never |

Also absent (0 occurrences): obviously, at the end of the day, that being said, with that said, to be honest, to be fair, in other words, long story short, moving forward, makes sense (as filler check-in), guys (he NEVER addresses viewers as "guys").

Evaluative words he actually uses: powerful (36), efficient (37, incl. "far more efficient", "less efficient"), relevant (57, esp. "more relevant outputs"), reliable/reliably (10), practical, useful, straightforward, tedious, tricky, deterministic (5), great, interesting ("really interesting", "definitely worth checking out"). Negative register is measured, never savage: "not very practical", "not very user friendly", "not a huge fan", "pretty limited", "a bit tedious", "far less efficient".

Workhorse nouns: context (constant), second brain (165), use case(s) (71), workflow(s) (40), setup (78), infrastructure (22), softwares (51), tokens (83), skills, connectors, MCPs, routines, scheduled tasks, dashboards, intelligence.

Verbs of choice: set up (169 combined forms), pull (data/context), save, deploy, automate, spin up (sub-agents), roll out (across a team), populate, iterate, compound, burn (tokens), throw in ("you can throw in reference images"), veer off, hip-hop ("hip-hopping between softwares").

## 5. Sentence rhythm and structure

- **Long, chained, additive sentences.** Spoken sentences routinely run 40-80 words, glued by "and... because... which... so...". "And" appears 1,686 times, "So" 1,134, "But" 266. He thinks in consequence chains, not staccato punches.
- **Emphasis by restatement, not volume.** A claim is made, then immediately re-explained: "...gives your AI persistent context and memory across different chats. And this just means that your outputs become far better and more relevant." The "And this means / which means" restatement is the core rhythm unit (39 combined).
- **Short sentences reserved for verdicts.** After a long chain he lands a short one: "Context is really what makes AI powerful." "That's literally all you have to do." "So, less is often more." Scripts should earn short lines by preceding them with long ones.
- **Rhetorical questions: ~6 per video** (range 2-19 question marks per file; managed-agents video peaks at 19). Always self-answered within a breath. Templates: "Now, you might be wondering, [objection]?" (2x), "Now, why is that? Because...", "So, how do you set it up?", "who would actually buy and pay this extra fee?"
- **Pre-emptive objection handling** is structural: he voices the viewer's pushback verbatim ("Don't we already have the Google connector...? And yes, but...") then answers with numbered reasons.
- **Numbered scaffolding everywhere**: firstly/secondly/thirdly/lastly, "there are two big limitations", "three options", "five different parts", "the six most common mistakes."
- **Anaphora as emphasis**: "It has a limit... it starts forgetting... outputs get worse..."; "The more you use it, the more... the more..." ("the more you" 11x - the compounding construction is a favorite).

## 6. CTA / sponsor segments

No external sponsors in this corpus; all CTAs are his own offers. Four distinct CTA types, each with a fixed formula:

1. **Free lead magnet (top of description):** "you can download the skill for free in the first link in the description below" ("for free in the first link" 6x, "free resources" 9x). Usually dropped the moment a downloadable is first mentioned, then repeated near the end.
2. **AI Accelerator (community) plug** - the big one, appears BOTH mid-video (roughly the 40-60% mark, always after delivering value, framed as "diving deeper") AND in the outro. Near-verbatim formula: "if you want access to all of the skills and plugins that me and my team are building out [across marketing, sales, operations, and customer support], together with unlimited one-on-one live tech help, multiple weekly Q&As with me and my team, full courses, and a community of serious professionals and business owners, you can check out my AI accelerator in the [first/second] link in the description below." Components that always recur: "unlimited one-on-one live tech help" (15x), "multiple weekly Q&As with me and my team", "serious professionals and business owners", "me and my team are building out."
3. **Agency/service CTA** (in ~4 videos, stacked after the accelerator): "if you're a small business and want me and my team to actually help you set this up for you together with training and consulting, you can also book in a free call with us in the third link in the description below. And if you might be a bigger business and are looking for an AI partner..., you can also check out the fourth link." Note "book in a call" phrasing.
4. **Outro** (fixed, 6x near-verbatim): "Thank you so much for watching. If you got any value out of it, I highly appreciate a like and a subscribe. [It really does help me.]" then the end-screen pointer, present in 9/10 videos: "if you want to learn more about X, you can check out the video here above."

Tone inside CTAs stays identical to teaching tone: conditional and low-pressure ("if that's interesting to you", "if you want to dive a little bit deeper"), never scarcity or hype. CTAs are gated behind "if you're interested" (23x).

## 7. English quirks (Dutch speaker, part of the authentic voice)

- **"softwares" as a countable plural - 51x.** "all of our sales softwares", "deploy them in softwares like Notion". His single most distinctive lexical quirk; keep it in scripts.
- **"inside of" instead of "in" - 109x.** "inside of Slack", "inside of a skill", "inside of my AI accelerator."
- **"me and my team" as sentence subject - 27x.** "Claude has entirely transformed the way me and my team do sales."
- **"far" as the default intensifier - 49x** (far more/better/less efficient/powerful). Reads slightly formal/continental; he never says "way better."
- **"of course" density (3.7/1,000 words)** - the Dutch "natuurlijk" reflex, dropped mid-clause: "which of course wasn't possible with the Google MCP."
- **Sentence-final ", too" - 23x.** "you should be able to follow this video, too", "they can be long-running, too."
- **"the upcoming years" - 2x** ("in the upcoming years" rather than "the coming years/years ahead").
- **"book in a (free) call" - recurring** phrasal quirk ("you can also book in a free call with us").
- **Occasional agreement slips** kept natural in speech: "the worse the performance get", "every employee in the business have a has a different quality bar" (partly ASR, but the pattern of restarting mid-clause is real).
- **Doubled restarts / self-repair**: "in the in the dashboard", "I I don't actually enforce it", "con- managed agent console" - he repairs out loud rather than pausing.
- **"a little bit" softening - 33x**, often before technical difficulty: "it is a bit more technical to set up", "can be a bit tedious."
- **"I highly appreciate a like and a subscribe"** - article on "a subscribe", verbatim signature outro line.

## 8. Video structure (macro shape across the 10 videos)

1. **Cold-open hook** (no greeting, no "hey guys", no channel intro - ever). Problem/claim in sentence 1-2.
2. **Promise list**: "So, in this video, I'll show you [3-4 items]" within the first ~90 words. Often plus a credibility beat: "We've been [doing X] at my AI agency for weeks, and it's already changing how we work" (2x near-verbatim).
3. **"Before I show you..." context block**: a why-it-matters / how-it-works-under-the-hood section ("before showing you how to set them up, let me show you quickly what they actually are and why they're a big deal"). Beginner off-ramp lives here: link to the full tutorial + "but you should be able to follow this video, too."
4. **Body = numbered sequence** (mistakes, options, features, layers, steps), each unit shaped as: concept → why it matters → concrete first-person demo ("here I ran...") → caveat/trade-off → transition ("Now, the next one...", "Which brings me to...").
5. **Mid-video CTA** at roughly 40-60%, camouflaged as a depth offer ("if this is going a little bit too fast for you... check out my AI accelerator"), then straight back to content.
6. **Setup/how-to section** in the back half: switches to imperative walkthrough voice ("So, how do you set it up? ... All you have to do is...") with both the DIY path AND his skill-assisted shortcut path - he always shows the manual way too.
7. **Recap/mindset close** (in ~half the videos): a principle-level takeaway rather than a summary list ("The pattern across all of these mistakes is often less is more... So, just start simple, put the effort in, and be consistent"). Encouragement against overwhelm: "It looks very complicated at the start and intimidating, but really once you get this set up... there's not that much maintenance."
8. **CTA stack + fixed outro + end-screen pointer** ("...you can check out the video here above" - 9/10 videos end on this exact device).

No chapters announced by timestamps in speech; sections are carried purely by "Now, the next..." transitions. Recaps are rare mid-video; he relies on "Again, ..." (80x) micro-recaps instead.

## 9. Opinions and stances (for the values file)

Recurring beliefs, with rough cross-video counts:

1. **Context is the moat.** Stated explicitly and often: "Context is really what makes AI powerful", "your unique context is not going to be replaced by a new model", "it's already more efficient to use an older model... with good context instead of one of the newest models without context." Appears in 8/10 videos as the underlying thesis. Corollary: "this context compounds - the earlier you start, the better" (3x verbatim "compounds", the compounding argument in 6+ videos).
2. **Local files beat connectors/MCPs for context.** "The most efficient way is to have this locally stored"; MCP/connector = "a layer of complexity in between our AI agent and the context" that costs tokens, accuracy, speed. Argued in 4 videos, always as a trade-off (you still get "around 90% of the benefits" via SaaS platforms).
3. **CLIs > MCPs for tool access** (token efficiency): argued at length in the plugins video; "a CLI is more reliable and less token heavy and less error-prone than browser computer use." Efficiency hierarchy he repeats: API/CLI > MCP > browser use > computer use ("last resort", 3 videos).
4. **The 99% adoption-gap thesis.** "99% of people and businesses will not even use a tool like cloud code or even co-work" (4x across 3 videos). The business opportunity = bridging capability and adoption (managed agents, Claude Tag, dashboards). This is his core sell-AI worldview.
5. **Less is more / 80-20 setups.** "less is (often) more" 4x, "80/20" 5x: five or six essential context docs give 80% of the benefit; fixed simple folder structure beats elaborate ones; "start simple", MVP approach to dashboards.
6. **Skills > prompts because they're testable.** "skills can actually be tested and optimized... With prompts, it can be far less reliable"; skills make agents "far more deterministic" (3 videos). Always run evals on a new skill.
7. **Consistency/mindset over tooling.** "mindset is even more important than the tool itself"; force yourself to make Claude the default "even when it feels much slower the first few times"; the payoff compounds (3 videos). Using AI well is "arguably one of the highest value skills you can have right now."
8. **Team/multiplayer AI is the unlock for businesses.** Shared second brain aligns everyone's agents with the business (6 videos); Slack visibility drives adoption because "non-technical employees directly see how others are using these AI agents" (2 videos); one AI power user can run the infrastructure for a whole company (2 videos).
9. **Quality bar / anti-slop stance.** Slop is subjective; "this quality bar... is going to really set you apart"; AI "reinforces the user, not the truth"; individual productivity gains don't equal company value without shared standards (de-slop video, echoed in 6-mistakes).
10. **Honest cost accounting as a value.** He always names the price, the token burn, and who shouldn't buy: "having some cost is a good thing because it means you're actually using it", "for internal use cases you probably want routines... it will be cheaper." Anti-hype disclosure is part of the brand (fake dashboard metrics disclaimed on camera).
11. **Tool opinions on record:** Obsidian = optional visual layer only ("you don't need it, but... I do recommend it"); Firecrawl = "should be your default web scraper"; Apify = "the go-to place to scrape any social media"; Unipile = "the best tool or MCP" for WhatsApp/LinkedIn; n8n/Zapier reduced to "really all we use n8n for here is the trigger"; caveman-style output compression = "not a huge fan... not very readable" (use on inputs instead); /compact "has some real flaws."
