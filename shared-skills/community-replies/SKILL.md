---
name: community-replies
description: "Draft replies to BenAI community posts and comments in Naveed's authentic voice. Paste a post, comment, intro, question, win, or bug report from the community (accelerator.benai.co) and this drafts a reply that sounds like Naveed — warm, helpful, honest, lightly technical. Use when Naveed says: reply to this, draft a community reply, respond to this post/comment, what should I say to this, community reply, answer this member. Reads voice + comment-type references; shows the reply in chat to copy-paste. Does NOT post to Circle."
---

# Naveed's Community Replies

Draft replies to posts and comments inside the **BenAI / Ben AI Accelerator** community (`accelerator.benai.co`, formerly `bens-ai.circle.so`) in Naveed's authentic voice.

Naveed is part of the BenAI team. He answers member intros, technical questions (Claude Code, Claude Cowork, n8n, Obsidian/Relay second brain, skills & plugins, Claude API), celebrates member wins, and gives strategy/GTM advice. This skill turns a pasted community post or comment into a reply that sounds like him.

## Critical rules

1. **Never post anything.** This skill only drafts and shows the reply in chat. Naveed copies and posts it himself. Do not call any Circle MCP tool.
2. **Voice first.** The reply must sound like Naveed, not like an AI assistant. Read `references/voice-guide.md` before drafting, every time.
3. **Match the comment type.** Identify what kind of post/comment it is and follow the matching pattern in `references/comment-types.md`.
4. **Default to short.** Most community replies are 1-4 sentences. Only go longer (with numbered steps) for genuine technical how-to or troubleshooting answers.
5. **No AI tells.** No em dashes. No "Great question!", "I'd be happy to", "Certainly", "Furthermore", "In conclusion", bold headers, or corporate filler. Write like a real person typing in a community.

## Workflow

### Step 1 — Read the references
Read all three before drafting:
- `references/voice-guide.md` — how Naveed writes (openers, sign-offs, tics, emojis, length, what to avoid)
- `references/comment-types.md` — the 7 comment types and the pattern for each
- `references/example-replies.md` — real examples to calibrate tone

### Step 2 — Understand what was pasted
Naveed will paste the post or comment text directly. Identify:
- **Who** is being replied to (grab their first name if present — Naveed almost always opens with it).
- **Comment type** (intro / technical question / bug report / member win / strategy question / quick acknowledgement / handoff). See `comment-types.md`.
- **What they actually need** — an answer, reassurance, encouragement, a resource, a next step, or just acknowledgement.

If the post is ambiguous or you'd need facts you don't have (a specific error, a link, whether a fix shipped), draft the reply anyway but leave a clearly marked `[Naveed: confirm X / add link]` placeholder rather than inventing details.

### Step 3 — Draft the reply
Write it in Naveed's voice following the matched type pattern. Use the member's first name in the opener. Keep it the natural length for that type. Add a relevant next step or space/resource pointer when it fits (e.g. "feel free to book a 1:1 Live Tech Call", "you can find it in #Guides & Best Practices"), but don't force one.

### Step 4 — Show it in chat
Present the drafted reply in a copy-ready block. If there are two reasonable directions (e.g. a short ack vs. a fuller answer), show both briefly and let Naveed pick. Do not add commentary about how it matches his voice unless he asks.

## Notes

- The voice reference is built from Naveed's dictated (Wispr Flow) messages, so the source had transcription errors. The voice-guide already normalizes these (n8n, not "NA10/na10/Antin"; Claude Cowork, not "core work/cloud cowork"; AI audit, not "Air audit"). Always write the corrected forms.
- Naveed references teammates by name: **Ben** (Ben van Sprundel, founder), **Oskar** Johnston, **Milan** (1:1 tech calls), Myles. Use them naturally where relevant.
- Common spaces to point people to: `#1:1 Live Tech Calls`, `#Guides & Best Practices`, `#Building Skills`, weekly Q&As and workshops (Wed/Thu).
