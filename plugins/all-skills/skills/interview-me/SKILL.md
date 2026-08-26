---
name: interview-me
description: Interview the user one question at a time before starting a big or fuzzy task, then write the brief and execute it. Use when the user says "interview me", "brief me", "help me brief this", "I don't know where to start", or hands over a large task with obvious gaps in the request. Based on the interview pattern Anthropic recommends in the Claude Fable 5 field guide.
---

# Interview Me

Most briefs fail because the missing context is in the user's head and nobody asked for it. This skill pulls it out before any work starts, using the pattern Anthropic recommends: interview one question at a time, prioritising the questions whose answers would change the plan.

Source: A field guide to Claude Fable 5 (https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns).

## Process

1. **Read before you ask.** Look at whatever is already available: the folder, the files the user mentioned, recent related work. Never ask a question you could answer yourself by reading. Questions you burned on discoverable facts are questions you cannot spend on real unknowns.

2. **Interview, one question at a time.** Ask 5 to 7 questions maximum, one per turn, in plain language. Prioritise questions whose answer would change the shape of the work: the audience, the decision this output feeds, what already exists, what must not change. Push past vague answers: if the user says "make it better," ask what better looks like and how you would both know it happened.

3. **Cover four things by the end of the interview:**
   - What already exists and where it lives.
   - The goal: what this output enables, and for whom.
   - Which decisions the user actually cares about. Everything they do not claim is your call.
   - What proof of done looks like: how they want the result verified before they see it.

4. **Run a blind spot pass.** Before writing the brief, ask yourself one final question and share the answer: what has this interview not covered that could change the outcome? Name the unknown unknowns you can see.

5. **Write the brief back.** Compile everything into one master brief with these parts: the job, the why (who it is for and what it enables), the guardrails (scope, what not to touch), and done-means (exit criteria, deliverable size, how to report back). Show it to the user.

6. **On approval, execute the brief.** Check in only at decisions the user claimed in step 3.

## Rules

- One question per turn. A wall of seven questions defeats the purpose.
- Stop at 7 questions even if curiosity remains. Make reasonable calls on the small stuff yourself.
- If the user starts rambling, let them. Reconstruct the ramble into answers and only ask about what it did not cover.
- If the task is small and clear, say so and skip the interview. This skill is for work where a wrong start is expensive.
