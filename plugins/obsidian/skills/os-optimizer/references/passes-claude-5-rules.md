# F10 — Claude 5 Rule Rewriting (pass implementation)

**Reference (the why):** `references/claude-5-rules.md`.
**Applies to:** every file classified as `root-claude`, `folder-claude`, or `claude-rules`, plus every `SKILL.md` in the vault.

## How this pass works

**Agentic, not regex-driven.** Triggers surface candidate lines; the agent reads each one in context and decides its bucket before producing a finding. A file with 40 `never` lines usually yields a handful of findings, not 40, because most of them are gotchas or hard rules that this pass deliberately leaves alone.

Two rules govern the whole pass:

1. **Never rewrite a KEEP-bucket line to look productive.** Fewer, correct changes beat many cosmetic ones. A gotcha line the model could not discover on its own is the most valuable line in the file.
2. **When the bucket is ambiguous, do not guess.** Emit the finding with `bucket: unsure` and a question for the walk. Never guess on a line touching safety, destructive actions, client-facing sends, money, or permissions.

This pass changes rule *quality*. It does not move sections, split files, or shorten a file for size. F1 owns size and structure; F9 owns routing and discoverability. If a file is both badly ruled and too long, F10 rewrites the rules and F1 handles the length, independently.

## Contents

1. [F10.1 — Retired instructions](#f101--retired-instructions)
2. [F10.2 — Bare prohibitions](#f102--bare-prohibitions)
3. [F10.3 — One-sided rules](#f103--one-sided-rules)
4. [F10.4 — Aggressive emphasis](#f104--aggressive-emphasis)
5. [F10.5 — Obvious statements](#f105--obvious-statements)
6. [F10.6 — Missing Fable 5.1 vault rules](#f106--missing-fable-51-vault-rules)
7. [Bucket report](#bucket-report)
8. [Finding schema](#finding-schema)

---

## F10.1 — Retired instructions

**Framework rule:** Claude 5 generation models verify their own work, decompose their own reasoning, and read what they need. Instructions telling them to do so are dead weight that costs tokens and causes over-verification.

**Trigger heuristic:** grep, case-insensitive, outside code fences: `double.?check`, `verify (your|the) (work|answer|output)`, `think step.?by.?step`, `be thorough`, `take your time`, `re-?read the file`, `make sure to read`, `you are (an? )?(expert|world.?class|senior)`, `carefully consider`, `don't rush`.

**Agent judgment:** distinguish a retired *self-management* instruction from a live *project* requirement. `Double-check your work` is retired. `Check the generated dashboard against the source notes before showing it to a client` is a project verification requirement with a real reason, and stays. The test: does the line ask the model to be diligent in general, or to verify one specific thing for a stated reason?

**False positives to skip:**
- Verification tied to a named artifact and a named risk.
- Persona lines that carry actual domain context (`you are the operator of this vault` establishes a role and routing, not flattery).
- Lines inside a quoted example or a template the user ships to others.

**Severity:** info.

**Fix:** DELETE the line. If the line bundles a retired instruction with a live requirement, split it and keep the live half.

---

## F10.2 — Bare prohibitions

**Framework rule:** `never do X` with no reason overfits to the literal case or gets dropped when it conflicts with the task. Judgment plus the why generalizes.

**Trigger heuristic:** lines starting with or containing `never`, `always`, `do not`, `don't`, `avoid`, `must not` where the same sentence contains no causal connective (`because`, `since`, `so that`, `otherwise`, `as`, `which means`, `or else`).

**Agent judgment:** first check whether the line belongs in KEEP AS HARD RULE (destructive or irreversible actions, client-facing sends, money, permissions, credentials, data loss). If it does, skip it entirely: a bare prohibition is the correct instrument there. Otherwise, recover the reason. The reason is usually elsewhere in the file, in an adjacent line, or inferable from the vault's own context layer. **If the reason cannot be recovered, do not invent one** — emit the finding with `bucket: unsure` and ask the user for the why during the walk.

**False positives to skip:**
- Hard rules in the protected areas above.
- Prohibitions that already carry the reason in the preceding or following sentence; treat the pair as one rule and mark it compliant.
- Style rules that are pure convention with no discoverable cause and no cost to overfitting (`never use em dashes` where the project rule is the reason; G7.1 already owns this one).

**Severity:** warn.

**Fix:** rewrite as `[behaviour] because [reason]`, or `[reason], so [behaviour]`. Preserve the user's voice and the file's formatting.

---

## F10.3 — One-sided rules

**Framework rule:** a rule that names only the cost of one option steers the model all the way to the other, including in cases where the other is wrong.

**Trigger heuristic:** lines pairing a steering verb (`avoid`, `prefer`, `minimize`, `reduce`, `don't`, `limit`, `keep … short`) with a stated cost (a number, a currency amount, `expensive`, `slow`, `wastes`, `costs`, `burns tokens`).

**Agent judgment:** ask what the opposite failure costs. If the counterweight is real and unnamed, the rule is one-sided. If the file names both sides already, or the opposite failure genuinely has no cost, leave it. Consider the vault's own context layer for the counterweight before inventing one.

**False positives to skip:**
- Rules where the counterweight is stated in the same block.
- Budget ceilings that are genuinely absolute (a hard spend cap is a hard rule, not a one-sided nudge).

**Severity:** warn.

**Fix:** add the counterweight and the decision criterion. `[Cost of A], but [cost of B]. Do A when [condition].`

---

## F10.4 — Aggressive emphasis

**Framework rule:** `CRITICAL`, `YOU MUST`, and all-caps were written to fix undertriggering on older models. Claude 5 generation models overtrigger on them, treating routine steps as safety boundaries.

**Trigger heuristic:** `CRITICAL`, `IMPORTANT`, `YOU MUST`, `ALWAYS`, `NEVER`, `MANDATORY`, `REQUIRED`, `DO NOT` in all-caps; runs of three or more consecutive capitalized words; three or more `**bold**` spans in one paragraph; `!!!`.

**Agent judgment:** emphasis is a budget. A file where every third line shouts has no emphasis at all. Count the emphasis markers across the file, then decide which handful genuinely mark the expensive-to-get-wrong lines and strip the rest. Lines in the KEEP AS HARD RULE bucket may keep one emphasis marker.

Note the interaction with F1.6, which measures the emphasis *ratio* for the file as a whole. F10.4 rewrites individual lines; F1.6 reports the file-level ratio. Both may fire on the same file, and that is correct: F1.6 says the file shouts, F10.4 says which lines stop shouting.

**False positives to skip:**
- A single emphasis marker on a genuine safety or destructive-action rule.
- All-caps inside code, identifiers, env var names, acronyms, or quoted output.
- Markdown headings.

**Severity:** warn.

**Fix:** soften to normal sentence case and normal punctuation. Keep the instruction, drop the volume.

---

## F10.5 — Obvious statements

**Framework rule:** anything the model can discover by listing the filesystem or reading a file is context the instruction layer should not be spending tokens on.

**Trigger heuristic:** lines that enumerate folders or files without saying what goes in them or why; sentences of the form `the X folder contains X`; restatements of a directory listing; descriptions of well-known tools the model already knows.

**Agent judgment:** the distinction that matters is **description versus routing**. `Projects/ contains projects` is obvious and goes. `Project work goes in Projects/{Category}/{project}/, and a project README is its front door, not its filing cabinet` is routing, which is the single most valuable thing an instruction file does. Keep every line that tells the model *where to put things* or *where to look*, even when it also names the folder.

**False positives to skip:**
- Routing tables and knowledge-routing rules. These are F9's territory and are load-bearing.
- Folder descriptions that carry a non-obvious convention or constraint.
- Lines that exist to disambiguate two similarly named folders.

**Severity:** info.

**Fix:** DELETE, or collapse several description lines into one routing line.

---

## F10.6 — Missing Fable 5.1 vault rules

**Framework rule:** Claude Fable 5.1 has five documented behaviour differences that bite specifically inside a vault. Each has published wording. A vault instruction layer that predates them is missing guardrails it should have.

**Trigger heuristic:** run once per vault against the root instruction file. For each of the five, grep for whether the file already addresses it: search-before-answering / verification nudge; surgical-edit instruction; a worked quotation example; a tool-call batching line; any effort guidance.

**Agent judgment:** this check **adds** rules rather than rewriting them, so it is the one place in F10 where the fix is new text. Only fire it when the vault is actually run on a Fable model, which the agent establishes from the vault's own context layer, a model reference in the instruction file, or by asking during the walk. Do not add all five by reflex: propose only the ones whose failure mode is plausible for this vault. A vault the user only reads from does not need the surgical-edit rule.

Use the published wording from `references/claude-5-rules.md` verbatim where it exists, and attribute it in the finding so the user can check the source.

**False positives to skip:**
- Vaults with no Fable usage.
- Files that already carry an equivalent rule in the user's own words.

**Severity:** info.

**Fix:** append the missing rule to the appropriate section of the instruction file, using the published wording.

---

## Bucket report

F10 emits one per-file summary alongside its findings, because the bucket counts are the finding the user actually reads:

```
{path}
  RETIRED           {n} lines  → delete
  BARE PROHIBITION  {n} lines  → rewrite with the why
  ONE-SIDED         {n} lines  → add the counterweight
  AGGRESSIVE        {n} lines  → soften
  OBVIOUS           {n} lines  → delete
  UNSURE            {n} lines  → ask during walk
  KEEP (hard rule)  {n} lines  → untouched
  KEEP (gotcha)     {n} lines  → untouched
  Estimated line reduction: {n} lines ({pct}%)
```

Present the rewrites as a three-column review before applying anything: original line, proposed line or DELETE, one-line reason with its bucket.

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4. F10 findings additionally carry `bucket` (one of the seven, or `unsure`), and the `unsure` bucket carries `question` instead of a proposed fix.
