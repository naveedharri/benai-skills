#!/usr/bin/env python3
"""
Auto-generated eval script for: Email Subject Line Generator
DO NOT MODIFY during autoresearch loop — this is the read-only judge.

Assertions:
1. Contains a number or statistic
2. Is under 60 characters
3. Does NOT use ALL CAPS
4. Creates curiosity or urgency
5. Is relevant to the given topic
"""

import sys
import os
import re
import json


# --- Assertion Functions ---

def check_contains_number(text):
    """Does the subject line contain a number or statistic?"""
    return bool(re.search(r'\d+', text))


def check_under_60_chars(text):
    """Is the subject line under 60 characters?"""
    return len(text.strip()) <= 60


def check_no_all_caps(text):
    """Does the subject line avoid ALL CAPS words (3+ letter words)?"""
    words = text.split()
    all_caps_words = [w for w in words if len(w) >= 3 and w == w.upper() and w.isalpha()]
    return len(all_caps_words) == 0


def check_curiosity_or_urgency(text):
    """Does the subject line create curiosity or urgency? (proxy heuristic)"""
    text_lower = text.lower()
    signals = 0

    # Question mark = curiosity
    if "?" in text:
        signals += 1

    # Urgency words
    urgency_words = ["now", "today", "urgent", "limited", "last chance", "don't miss",
                     "before", "deadline", "hurry", "ending", "final", "act fast",
                     "breaking", "alert", "just released", "new"]
    if any(w in text_lower for w in urgency_words):
        signals += 1

    # Curiosity words
    curiosity_words = ["secret", "surprising", "hidden", "discover", "why", "how",
                       "what", "revealed", "truth", "inside", "unexpected", "little-known",
                       "myth", "mistake", "actually", "really"]
    if any(w in text_lower for w in curiosity_words):
        signals += 1

    # Numbers create specificity which drives curiosity
    if re.search(r'\d+', text):
        signals += 1

    return signals >= 2


def check_topic_relevance(text, topic):
    """Does the subject line relate to the given topic? (keyword overlap proxy)"""
    # Extract significant words from topic (4+ chars, not stopwords)
    stopwords = {"the", "and", "for", "that", "this", "with", "from", "your", "have",
                 "will", "about", "what", "their", "been", "more", "when", "which", "into"}
    topic_words = [w.lower().strip(".,!?-") for w in topic.split()
                   if len(w) >= 4 and w.lower() not in stopwords]
    text_lower = text.lower()

    # At least one significant topic word appears in the subject line
    matches = sum(1 for w in topic_words if w in text_lower)
    return matches >= 1


# --- Main Eval ---

ASSERTIONS = [
    "contains_number",
    "under_60_chars",
    "no_all_caps",
    "curiosity_or_urgency",
    "topic_relevance",
]


def evaluate_output(text, test_case):
    """Run all assertions on a single output. Returns dict of assertion_name: bool."""
    topic = test_case.get("topic", "")
    return {
        "contains_number": check_contains_number(text),
        "under_60_chars": check_under_60_chars(text),
        "no_all_caps": check_no_all_caps(text),
        "curiosity_or_urgency": check_curiosity_or_urgency(text),
        "topic_relevance": check_topic_relevance(text, topic),
    }


def main():
    outputs_dir = sys.argv[1] if len(sys.argv) > 1 else "outputs"

    # Load test cases
    script_dir = os.path.dirname(os.path.abspath(__file__))
    test_cases_path = os.path.join(script_dir, "test_cases.json")
    if not os.path.exists(test_cases_path):
        test_cases_path = "test_cases.json"

    with open(test_cases_path) as f:
        test_cases = json.load(f)

    total_pass = 0
    total = 0
    assertion_totals = {a: 0 for a in ASSERTIONS}

    for i, tc in enumerate(test_cases):
        output_file = os.path.join(outputs_dir, f"output_{i:02d}.txt")
        if not os.path.exists(output_file):
            continue

        with open(output_file) as f:
            text = f.read().strip()

        results = evaluate_output(text, tc)
        all_pass = all(results.values())

        if all_pass:
            total_pass += 1
        total += 1

        # Count per-assertion passes
        for a, passed in results.items():
            if passed:
                assertion_totals[a] += 1

        # Per-output detail
        status = "PASS" if all_pass else "FAIL"
        failed = [k for k, v in results.items() if not v]
        print(f"  Output {i:02d}: {status}" + (f"  (failed: {', '.join(failed)})" if failed else ""))

    if total == 0:
        print("ERROR: No output files found")
        sys.exit(1)

    pass_rate = total_pass / total
    print(f"\n--- Assertion Breakdown ({total} outputs) ---")
    for a in ASSERTIONS:
        pct = assertion_totals[a] / total * 100
        print(f"  {a}: {assertion_totals[a]}/{total} ({pct:.0f}%)")

    print(f"\n--- Result ---")
    print(f"DETAIL {total_pass}/{total} outputs passed ALL assertions")
    print(f"METRIC pass_rate={pass_rate:.4f}")


if __name__ == "__main__":
    main()
