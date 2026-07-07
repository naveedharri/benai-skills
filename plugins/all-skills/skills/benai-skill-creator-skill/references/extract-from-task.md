# Extraction Procedure (Step 2, Build branch)

Reconstruct the real process from the conversation that just happened. Do not ask the user to describe their process from memory; that yields the cleaned-up version missing judgment and exceptions. Reconstruct from the evidence in the chat, then have the user correct it.

## Procedure
1. Walk the conversation in order. For each move actually made, write one concrete step. Use the real conversation as the source, not a summary.
2. For each step, capture two things:
   - What input or information was in front of the user at that moment.
   - How they judged the output good enough to proceed (what separates a good result from a bad one).
   Reject vague steps. "Researched the competitor" is not a step. "Read their pricing page and last 10 LinkedIn posts; good when their offer, price, and angle can be named in one sentence" is a step.
3. Hunt exceptions and failure points:
   - What was the edge case, handled differently?
   - Where would a brand-new hire get this wrong?
   - What did the user almost get wrong, or catch and fix?
   Record each as explicit guidance. The agent that runs the built skill is the new hire.
4. Strip human-only overhead: tab-switching, copy-pasting between tools, waiting, re-reading to remember position. Keep only steps that produce or judge the work.
5. Flag human-in-the-loop points: decisions that should not be automated (review before send, publish, spend, delete). These become checkpoints in the built skill (see structure.md).
6. Play it back: present the reconstructed process as a numbered list (steps, judgment, exceptions, checkpoints) and ask "This is what I saw us do. What is wrong or missing?" Apply the corrections.

## Output
A confirmed numbered process. For each step: what happens, how you know it worked, and any exception handling. Pass this to Step 3 (Structure).
