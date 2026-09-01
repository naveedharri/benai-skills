# Interview (Step 1)

Pull the missing context out of the user's head before writing anything. Pattern from Anthropic's Fable field guide: one question at a time, prioritise questions whose answer would change the plan (FIELDGUIDE in `rulebook.md`).

## Procedure
1. **Read before you ask.** Open the pasted prompt, the file, the folder, recent related work. Never ask a question you could answer by reading. Every question spent on a discoverable fact is one you cannot spend on a real unknown.
2. **Classify silently** from what you read: input type (rough idea, existing prompt, whole instruction file), likely surface, likely run length. Ask only about what is still unknown.
3. **One question per turn, plain language, 7 maximum.** Order by how much the answer changes the prompt:
   - What is the deliverable, named as a thing a colleague could hand back?
   - Who reads or uses it, and what do they decide with it? (This becomes THE WHY.)
   - What already exists that the prompt should build on or must not touch? (Scope guardrail.)
   - Where does it run: Claude Cowork, Claude app, Claude Code, or an API system prompt, and does that place already carry standing instructions or a role? (Decides format, tags, install home, and whether the prompt needs a role line.)
   - For research or data tasks: which sources or tools may it use, and which are off limits? (Becomes a scope guardrail.)
   - Is this a quick answer or a long run with files touched and minutes of work? (Decides the audit line and the caps.)
   - Which decisions does the user actually care about? Everything else is the model's call.
   - How should done be proven, and how short should the report-back be?
4. **Push past vague answers.** "Make it better" gets "better how, and how would we both know?" One follow-up, then move on.
5. **Let them ramble.** If the user dumps everything at once, reconstruct the answers from the ramble and only ask about what it did not cover.
6. **Blind spot pass.** Before writing, name in one or two sentences what the interview has not covered that could change the outcome. Ask about it only if it matters.
7. **Play it back** for anything larger than a one-paragraph prompt: one paragraph restating job, why, scope, done. Proceed on a yes.

## Skip rule
When the ask is already small and clear (the deliverable, audience, surface and size are all evident from what was pasted), ask one confirming question at most and go. The interview is for work where a wrong start is expensive.
