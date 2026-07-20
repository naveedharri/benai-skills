#!/usr/bin/env python3
"""Layer 1 of the Ben Voice Engine judge: deterministic red-flag linter.

Usage:
    python3 voice_lint.py --type circle-reply < draft.txt
    python3 voice_lint.py --type newsletter --file draft.txt

Types: circle-reply, linkedin-post, newsletter, slack, dm, email, youtube-script, generic

Output: JSON verdict on stdout. Exit 0 = pass, 1 = fail.
A draft fails on ANY hard violation, or on 3+ soft warnings.
Hard violations cap the Layer 2 judge score at 59 no matter what.

Every rule below is grounded in the measured corpus (10 YT transcripts, 88 Circle
comments, 10 LinkedIn posts, 6 newsletters, 78 Slack messages, 45 DMs; May-Jul 2026).
"""
import argparse
import json
import re
import sys

# ---------- global HARD rules (any match fails, all types) ----------
HARD_RULES = [
    # 0 occurrences across every register; the vault-wide rule holds empirically
    ("em-dash", re.compile(r"[—–]")),
    ("ai-vocab", re.compile(
        r"\b(delve|delving|delved|tapestry|pivotal|seamless(?:ly)?|robust|embark(?:ing|ed)?|"
        r"foster(?:ing|ed)?|game.?changing|elevat(?:e|ing|ed) your|supercharg\w+|"
        r"revolutioniz\w+|revolutionary)\b", re.I)),
    # "leverage" is Ben ONLY as a noun ("highest leverage activity"); verb use is a tell
    ("leverage-as-verb", re.compile(r"\bleverag(?:e|ing|ed)\s+(?:the|your|our|this|it|these|those|ai|claude)\b", re.I)),
    ("unlock-hype", re.compile(r"\bunlock(?:s|ing|ed)?\s+(?:the|your|new|a whole)\b", re.I)),
    ("corporate-lingo", re.compile(
        r"\b(synergy|streamlin\w+|amplif\w+|circl(?:e|ing) back|touch(?:ing)? base|bandwidth|"
        r"per my last|as per|at your earliest convenience|kindly|please find attached|"
        r"wanted to reach out|asap|eod)\b", re.I)),
    ("hope-this-finds-you-well", re.compile(r"hope this (email |message )?finds you well", re.I)),
    ("hope-this-helps", re.compile(r"\bhope (this|that) helps\b", re.I)),
    ("linkedin-ism", re.compile(r"\b(thrilled|excited|humbled) to (announce|share)\b", re.I)),
    ("hype", re.compile(r"(mind.?blow\w*|this changes everything|absolute game|"
                        r"in today'?s fast.?paced (world|environment))", re.I)),
    # 0 occurrences anywhere in the corpus; his ladder is
    # nice < great < really good < Perfect / Love it < Amazing
    ("banned-intensifier", re.compile(r"\b(awesome|superb)\b|\bsuper\s+(?=\w)", re.I)),
    ("addressing-the-masses", re.compile(
        r"(most people don'?t realize|everyone'?s sleeping on|the truth nobody talks about)", re.I)),
]

# ---------- type-conditional HARD rules ----------
# ellipsis: newsletter uses "..."/"…" 14x as a suspense device, Circle/LinkedIn/Slack have 0
ELLIPSIS = re.compile(r"(\.\.\.|…)")
SIGNOFF = re.compile(
    r"(?mi)^\s*(best|cheers|warm regards|kind regards|regards|sincerely|warmly|talk soon)[,!.]?\s*$")
HEY_OPENER = re.compile(r"^\s*hey\b", re.I)
GREETING_OPENER = re.compile(r"^\s*(hey|hi|hello|dear)\b", re.I)
HASHTAG = re.compile(r"(?<![#\w])#[A-Za-z]\w+")
LINK_IN_COMMENTS = re.compile(r"link in (the )?comments", re.I)
BULLET_LINE = re.compile(r"(?m)^\s*([-*•]|\d+\.)\s+\S")
BOLD_MD = re.compile(r"\*\*[^*\n]+\*\*|__[^_\n]+__")
MD_HEADER = re.compile(r"(?m)^#{1,6}\s")
KEEP_GOING = re.compile(r"keep going,", re.I)
GUYS = re.compile(r"\bguys\b", re.I)
PLEASE = re.compile(r"\bplease\b", re.I)
EMOJI = re.compile(r"[\U0001F300-\U0001FAFF☀-➿⬀-⯿]")
NEG_PARALLEL = re.compile(r"\bnot (just )?[a-z][^.,;!?\n]{0,40}, but\b", re.I)
GAME_CHANGER = re.compile(r"\bgame.?changer\b", re.I)
RAW_URL = re.compile(r"https?://\S+")
ARROW_OR_CHECK = re.compile(r"(?m)^\s*(↳|✅)")

# (max_words_hard, max_words_soft, min_words_soft) - from measured medians/ceilings
LENGTH = {
    "circle-reply": (250, 190, None),     # median 67w; observed ceiling 250 (once)
    "linkedin-post": (500, 410, 150),     # median 290w, max observed 407
    "newsletter": (800, 450, 150),        # teaching issues 245-352w; promo max 740
    "slack": (120, 70, None),             # median 5w; weekly max ~70
    "dm": (None, 100, None),              # substantive replies stay under 100w
    "email": (None, 220, None),
    "youtube-script": (None, None, None),
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

    # --- ellipsis: banned where the corpus shows zero, allowed in newsletter/scripts ---
    if kind in ("circle-reply", "linkedin-post", "slack", "dm"):
        m = ELLIPSIS.search(text)
        if m:
            hard.append({"rule": "ellipsis", "match": m.group(0), "excerpt": excerpt(text, m)})

    # --- "insane": real Ben in casual registers (Slack 2x, DMs), zero in broadcast ones ---
    if kind in ("circle-reply", "linkedin-post", "newsletter", "youtube-script"):
        m = re.search(r"\binsane(?:ly)?\b", text, re.I)
        if m:
            hard.append({"rule": "insane-in-broadcast", "match": m.group(0),
                         "excerpt": '"insane" is Slack/DM-only Ben; 0 occurrences in public registers'})

    # --- sign-offs: Ben never signs off anywhere except the newsletter's "Keep going," ---
    if kind in ("circle-reply", "slack", "dm", "linkedin-post"):
        m = SIGNOFF.search(text)
        if m:
            hard.append({"rule": "sign-off", "match": m.group(0).strip(), "excerpt": ""})

    if kind == "circle-reply":
        if HEY_OPENER.match(first):
            hard.append({"rule": "hey-opener", "match": first[:30],
                         "excerpt": 'Ben never opens Circle comments with "Hey" (0/88); use "Hi [Name]," or none'})
        m = BULLET_LINE.search(text)
        if m:
            hard.append({"rule": "bullets-in-circle", "match": m.group(0)[:30],
                         "excerpt": "deep advice is stacked short paragraphs, never lists"})
        if BOLD_MD.search(text) or MD_HEADER.search(text):
            hard.append({"rule": "formatting-in-circle", "match": "bold/header", "excerpt": ""})
        q = text.count("?")
        if q > 1:
            soft.append({"rule": "question-stack", "match": f"{q} question marks",
                         "excerpt": "only 4 of 88 real comments contain any ?; curiosity is a statement"})
        e = len(EMOJI.findall(text))
        if e > 0:
            soft.append({"rule": "emoji-in-circle", "match": f"{e} emoji", "excerpt": "2 of 88 real comments have emoji"})
        bangs = text.count("!")
        if bangs > 3:
            soft.append({"rule": "exclamation-density", "match": f"{bangs} exclamation marks", "excerpt": "never more than 3"})

    if kind == "linkedin-post":
        m = HASHTAG.search(text)
        if m:
            hard.append({"rule": "hashtag", "match": m.group(0), "excerpt": "0 hashtags in corpus"})
        m = LINK_IN_COMMENTS.search(text)
        if m:
            hard.append({"rule": "link-in-comments", "match": m.group(0), "excerpt": "link always goes in the post body"})
        if not RAW_URL.search(text):
            soft.append({"rule": "missing-cta-link", "match": "no URL",
                         "excerpt": "9/9 originals end on a lnkd.in link with a contents-first CTA"})
        for pat in (r"drop a comment", r"\bthoughts\?", r"\bagree\?", r"comment below"):
            m = re.search(pat, text, re.I)
            if m:
                soft.append({"rule": "engagement-bait", "match": m.group(0), "excerpt": excerpt(text, m)})
        q = text.count("?")
        if q > 1:
            soft.append({"rule": "question-stack", "match": f"{q} question marks", "excerpt": "1 ? in ~2,700 corpus words; he asserts"})
        e = len(EMOJI.findall(text))
        if e > 2:
            soft.append({"rule": "emoji-overuse", "match": f"{e} emoji", "excerpt": "max 2: hook-end and CTA-start only"})

    if kind == "newsletter":
        if GREETING_OPENER.match(first):
            hard.append({"rule": "newsletter-greeting", "match": first[:30],
                         "excerpt": "0/6 issues open with a greeting; cold-open with the hook"})
        if not KEEP_GOING.search(text):
            hard.append({"rule": "missing-keep-going", "match": "",
                         "excerpt": 'every issue closes "Keep going," + "Ben" (6/6)'})
        if BOLD_MD.search(text) or MD_HEADER.search(text):
            hard.append({"rule": "formatting-in-newsletter", "match": "bold/header", "excerpt": "plain text only"})
        # one-sentence paragraphs are the house style (175/181)
        for para in re.split(r"\n\s*\n", text):
            p = para.strip()
            if not p or BULLET_LINE.match(p) or KEEP_GOING.search(p):
                continue
            sentences = len(re.findall(r"[.!?](?:\s|$)", p))
            if sentences >= 3:
                soft.append({"rule": "multi-sentence-paragraph", "match": p[:50],
                             "excerpt": "175/181 real paragraphs are a single sentence"})
                break
        for m in RAW_URL.finditer(text):
            soft.append({"rule": "raw-url", "match": m.group(0)[:40],
                         "excerpt": 'links are "Click here to..." sentences, never raw URLs'})
            break
        e = len(EMOJI.findall(text))
        if e > 0:
            soft.append({"rule": "emoji-in-body", "match": f"{e} emoji", "excerpt": "0 emoji in real bodies (1 ever, in a subject)"})

    if kind == "slack":
        m = PLEASE.search(text)
        if m:
            soft.append({"rule": "please-in-slack", "match": m.group(0),
                         "excerpt": '0 "please" in 78 real messages; asks are bare "can you X"'})
        if BULLET_LINE.search(text) or BOLD_MD.search(text) or MD_HEADER.search(text):
            hard.append({"rule": "formatting-in-slack", "match": "list/bold/header", "excerpt": "0 formatting all week, even in briefs"})
        m = re.search(r"\bby \d{1,2}(:\d{2})?\s?(am|pm)\b", text, re.I)
        if m:
            soft.append({"rule": "clock-deadline", "match": m.group(0), "excerpt": "deadlines are day-words (tomorrow, today), never times"})

    if kind == "dm":
        if BULLET_LINE.search(text):
            soft.append({"rule": "bullets-in-dm", "match": "list", "excerpt": "no bullets in 1:1 replies (one templated exception)"})

    if kind == "youtube-script":
        m = GUYS.search(text)
        if m:
            hard.append({"rule": "guys-to-viewers", "match": m.group(0),
                         "excerpt": 'he NEVER addresses viewers as "guys" (0 in 47.7K words); Slack-only word'})

    # --- global softs ---
    for m in NEG_PARALLEL.finditer(text):
        soft.append({"rule": "negative-parallelism", "match": m.group(0), "excerpt": excerpt(text, m)})
    m = GAME_CHANGER.search(text)
    if m:
        soft.append({"rule": "game-changer", "match": m.group(0),
                     "excerpt": "rare-but-real for Ben (1-3x ever); never more than once, never hyped"})
    m = re.search(r"\bcrazy\b", text, re.I)
    if m:
        soft.append({"rule": "crazy", "match": m.group(0), "excerpt": "1 descriptive use ever; avoid as hype"})
    # his intensifier is "far more/better/less" (49x); "way X" shipped exactly once
    m = re.search(r"\bway (more|better|less|faster|easier|cheaper|worse)\b", text, re.I)
    if m:
        soft.append({"rule": "way-as-intensifier", "match": m.group(0),
                     "excerpt": 'his default is "far more/better/less" (49x); "way" observed once ever'})

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
