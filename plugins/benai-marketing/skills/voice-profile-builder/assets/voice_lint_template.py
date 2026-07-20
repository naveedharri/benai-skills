#!/usr/bin/env python3
"""Layer 1 of a {NAME} Voice Engine: deterministic red-flag linter. TEMPLATE.

How to customize (see references/skill-template.md in voice-profile-builder):
  1. Replace the TYPES/LENGTH dict with the person's registers and measured caps.
  2. Add person-specific HARD rules ONLY for corpus-verified zeros, with the
     measurement quoted in a comment.
  3. Add type-conditional rules for words real in one register, absent in another.
  4. Add required-element checks (e.g. a mandatory newsletter sign-off).
  5. Keep the universal rules below: they are cross-person AI tells.

Usage:
    python3 voice_lint.py --type <type> < draft.txt
Output: JSON verdict. Exit 0 = pass, 1 = fail.
Fails on ANY hard violation, or on 3+ soft warnings.
Hard violations cap the Layer 2 judge score at 59.
"""
import argparse
import json
import re
import sys

# ---------- universal HARD rules (cross-person AI tells; keep) ----------
HARD_RULES = [
    ("em-dash", re.compile(r"[—–]")),
    ("ai-vocab", re.compile(
        r"\b(delve|delving|delved|tapestry|pivotal|seamless(?:ly)?|robust|embark(?:ing|ed)?|"
        r"foster(?:ing|ed)?|game.?changing|elevat(?:e|ing|ed) your|supercharg\w+|"
        r"revolutioniz\w+|revolutionary)\b", re.I)),
    ("leverage-as-verb", re.compile(
        r"\bleverag(?:e|ing|ed)\s+(?:the|your|our|this|it|these|those|ai)\b", re.I)),
    ("unlock-hype", re.compile(r"\bunlock(?:s|ing|ed)?\s+(?:the|your|new|a whole)\b", re.I)),
    ("corporate-lingo", re.compile(
        r"\b(synergy|streamlin\w+|amplif\w+|circl(?:e|ing) back|touch(?:ing)? base|bandwidth|"
        r"per my last|as per|at your earliest convenience|kindly|please find attached|"
        r"wanted to reach out)\b", re.I)),
    ("hope-this-finds-you-well", re.compile(r"hope this (email |message )?finds you well", re.I)),
    ("hope-this-helps", re.compile(r"\bhope (this|that) helps\b", re.I)),
    ("linkedin-ism", re.compile(r"\b(thrilled|excited|humbled) to (announce|share)\b", re.I)),
    ("hype", re.compile(r"(mind.?blow\w*|this changes everything|absolute game|"
                        r"in today'?s fast.?paced (world|environment))", re.I)),
    ("addressing-the-masses", re.compile(
        r"(most people don'?t realize|everyone'?s sleeping on|the truth nobody talks about)", re.I)),
    # ---- PERSON-SPECIFIC HARD RULES GO HERE ----
    # Only corpus-verified zeros. Quote the measurement. Examples from production:
    # ("banned-intensifier", re.compile(r"\b(awesome|superb)\b|\bsuper\s+(?=\w)", re.I)),
    #     # 0 occurrences anywhere; his ladder is nice < great < Perfect/Love it < Amazing
]

# ---------- shared detectors ----------
ELLIPSIS = re.compile(r"(\.\.\.|…)")
SIGNOFF = re.compile(
    r"(?mi)^\s*(best|cheers|warm regards|kind regards|regards|sincerely|warmly|talk soon)[,!.]?\s*$")
GREETING_OPENER = re.compile(r"^\s*(hey|hi|hello|dear)\b", re.I)
BULLET_LINE = re.compile(r"(?m)^\s*([-*•]|\d+\.)\s+\S")
BOLD_MD = re.compile(r"\*\*[^*\n]+\*\*|__[^_\n]+__")
MD_HEADER = re.compile(r"(?m)^#{1,6}\s")
EMOJI = re.compile(r"[\U0001F300-\U0001FAFF☀-➿⬀-⯿]")
NEG_PARALLEL = re.compile(r"\bnot (just )?[a-z][^.,;!?\n]{0,40}, but\b", re.I)

# ---------- registers and measured length caps ----------
# CUSTOMIZE: (max_words_hard, max_words_soft, min_words_soft) per register,
# from the corpus medians and observed ceilings. Bias caps LOW: the person's
# rare long-form is earned; a generated draft's is not.
LENGTH = {
    "community-reply": (250, 190, None),
    "linkedin-post": (500, 410, 150),
    "newsletter": (800, 450, 150),
    "chat": (120, 70, None),
    "dm": (None, 100, None),
    "email": (None, 220, None),
    "script": (None, None, None),
    "generic": (None, None, None),
}


def excerpt(text, match, span=44):
    s, e = match.start(), match.end()
    return text[max(0, s - span // 2):min(len(text), e + span // 2)].replace("\n", " ").strip()


def lint(text, kind):
    hard, soft = [], []
    words = len(text.split())
    lines = [ln for ln in text.splitlines() if ln.strip()]
    first = lines[0] if lines else ""

    for name, rx in HARD_RULES:
        for m in rx.finditer(text):
            hard.append({"rule": name, "match": m.group(0), "excerpt": excerpt(text, m)})

    # ---- TYPE-CONDITIONAL RULES GO HERE ----
    # The most valuable rules contrast the person's own registers. Production examples:
    #
    # if kind in ("community-reply", "linkedin-post", "newsletter", "script"):
    #     m = re.search(r"\binsane(?:ly)?\b", text, re.I)
    #     if m:  # real in Slack/DMs, 0 in public registers
    #         hard.append({"rule": "insane-in-broadcast", "match": m.group(0), "excerpt": ""})
    #
    # if kind == "community-reply" and re.match(r"^\s*hey\b", first, re.I):
    #     # 0/88 despite every member opening with "Hey"; DMs are the opposite
    #     hard.append({"rule": "hey-opener", "match": first[:30], "excerpt": ""})
    #
    # if kind == "newsletter" and not re.search(r"keep going,", text, re.I):
    #     # required element: 6/6 issues close with the exact sign-off
    #     hard.append({"rule": "missing-sign-off", "match": "", "excerpt": ""})

    # ---- generic formatting guards (tune per person) ----
    if kind in ("community-reply", "chat", "dm"):
        m = SIGNOFF.search(text)
        if m:
            hard.append({"rule": "sign-off", "match": m.group(0).strip(), "excerpt": ""})
        if BULLET_LINE.search(text) or BOLD_MD.search(text) or MD_HEADER.search(text):
            soft.append({"rule": "formatting", "match": "list/bold/header",
                         "excerpt": "verify against the corpus; most people never format chat/replies"})

    for m in NEG_PARALLEL.finditer(text):
        soft.append({"rule": "negative-parallelism", "match": m.group(0), "excerpt": excerpt(text, m)})

    max_hard, max_soft, min_soft = LENGTH.get(kind, (None, None, None))
    if max_hard and words > max_hard:
        hard.append({"rule": "wall-of-text", "match": f"{words} words (cap {max_hard})", "excerpt": ""})
    elif max_soft and words > max_soft:
        soft.append({"rule": "running-long", "match": f"{words} words (target under {max_soft})", "excerpt": ""})
    if min_soft and words < min_soft:
        soft.append({"rule": "running-short", "match": f"{words} words (target over {min_soft})", "excerpt": ""})

    return {
        "type": kind,
        "words": words,
        "pass": not hard and len(soft) < 3,
        "hard": hard,
        "soft": soft,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--type", default="generic", choices=list(LENGTH.keys()))
    ap.add_argument("--file")
    args = ap.parse_args()
    text = open(args.file, encoding="utf-8").read() if args.file else sys.stdin.read()
    result = lint(text, args.type)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    sys.exit(0 if result["pass"] else 1)


if __name__ == "__main__":
    main()
