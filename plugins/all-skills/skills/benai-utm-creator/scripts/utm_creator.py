#!/usr/bin/env python3
"""Ben AI UTM creator: generate YouTube UTM links + Bitly import rows from a video title."""
import re, csv, sys, io, os

# Fixed destination table (matches the UTM creator sheet).
# term, base_url_template ({code} filled with short code), utm_content, backhalf_suffix
DESTINATIONS = [
    ("Accelerator",  "https://www.benai.co/accelerator",                     "Accelerator", "accelerator"),
    ("Agency",       "https://www.benai.co/custom-solutions",                "Agency",      "agency"),
    # Backhalf changed from "cowork" to "os" by Oskar on 2026-08-26, forward only.
    # utm_content stays "cowork" so the funnel stays comparable in reporting across the change.
    # Links already live keep -cowork and must never be renamed; renaming a live backhalf breaks it.
    ("Cowork",       "https://calendly.com/ben-ai-aryan/business-os-setup",  "Cowork",      "os"),
    ("AI-Operator",  "https://calendly.com/ben-ai-aryan/1-on-1-program",     "AI-Operator", "aioperator"),
    ("Free",         "https://benai.kit.com/{code}-free",                    "Free",        "free"),
    ("Kit-YouTube",  "https://www.benai.co/accelerator-offer",               "Kit-YouTube", "kityout"),
]

def campaign_slug(title: str) -> str:
    # REGEXREPLACE(LOWER(REGEXREPLACE(title,"[^a-zA-Z0-9]+","-")),"^-+|-+$","")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", title).lower()
    return re.sub(r"^-+|-+$", "", s)

def short_code(title: str) -> str:
    # first letter of each of the first 5 words, lowercased
    words = title.split()[:5]
    return "".join(w[0] for w in words if w).lower()

def verify_rows(rows):
    """Fail loudly on the two mistakes that survive review and only show up in Bitly.

    1. utm_content differing between the Long URL and the UTM Content column. Bitly
       resolves that conflict inconsistently on import: in the 2026-08-18 htral batch
       it kept three rows verbatim and rewrote the other three into alphabetical
       parameter order with the column's value.
    2. utm_content not lowercase. ~16 videos of history use lowercase, and GA4 splits
       Accelerator from accelerator into separate rows.
    """
    problems = []
    for r in rows:
        m = re.search(r"utm_content=([^&]+)", r["long_url"])
        in_url = m.group(1) if m else None
        col = r["utm_content"]
        if in_url != col:
            problems.append(f"{r['backhalf']}: URL has utm_content={in_url!r}, column has {col!r}")
        if col != col.lower():
            problems.append(f"{r['backhalf']}: utm_content {col!r} is not lowercase")
    return problems

def build_rows(title: str):
    slug = campaign_slug(title)
    code = short_code(title)
    rows = []
    for term, base_tpl, content, suffix in DESTINATIONS:
        base = base_tpl.format(code=code)
        # utm_content is lowercase in BOTH the Long URL and the CSV column. They must
        # agree: when they disagree Bitly rewrites some rows and not others on import.
        content_value = content.lower()
        url = f"{base}?utm_source=youtube&utm_medium=video&utm_campaign={slug}&utm_content={content_value}"
        backhalf = f"{code}-{suffix}"
        rows.append({
            "term": term,
            "long_url": url,
            "backhalf": backhalf,
            "tags": "youtube",
            # Use the canonical label verbatim: PROPER() mangles AI-Operator and Kit-YouTube.
            "title": f"{content} - {title}",
            "utm_source": "youtube",
            "utm_medium": "video",
            "utm_campaign": slug,
            "utm_term": "",
            "utm_content": content_value,
        })
    return slug, code, rows

def to_bitly_csv(rows) -> str:
    out = io.StringIO()
    w = csv.writer(out)
    w.writerow(["Long URL","Backhalf","Tags","Title","UTM Source","UTM Medium","UTM Campaign","UTM Term","UTM Content"])
    for r in rows:
        w.writerow([r["long_url"], r["backhalf"], r["tags"], r["title"],
                    r["utm_source"], r["utm_medium"], r["utm_campaign"], r["utm_term"], r["utm_content"]])
    return out.getvalue()

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="Generate Ben AI YouTube UTM links + Bitly import rows from a video title.")
    p.add_argument("title", help="the YouTube video title")
    p.add_argument("--out", default=None, help="write the Bitly CSV to this path (default: ~/Downloads/<slug>_bitly.csv, where Bitly's bulk uploader opens)")
    a = p.parse_args()
    slug, code, rows = build_rows(a.title)

    problems = verify_rows(rows)
    if problems:
        print("REFUSING TO WRITE: the CSV would break on Bitly import.", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print("See references/destinations.md, 'Full URL format'.", file=sys.stderr)
        sys.exit(1)

    if a.out:
        out_path = a.out
    else:
        # Downloads, because that is where Bitly's bulk-upload file picker opens.
        # Nobody running this should have to type a path.
        dl = os.path.expanduser("~/Downloads")
        out_path = os.path.join(dl, f"{slug}_bitly.csv") if os.path.isdir(dl) else f"{slug}_bitly.csv"
    with open(out_path, "w", newline="") as f:
        f.write(to_bitly_csv(rows))
    print(f"TITLE: {a.title}")
    print(f"SLUG:  {slug}")
    print(f"CODE:  {code}\n")
    for r in rows:
        print(f"[{r['term']}] backhalf={r['backhalf']}")
        print(f"   {r['long_url']}")
    print(f"\nutm_content check: all {len(rows)} rows lowercase and consistent between URL and column.")
    print(f"Bitly CSV written to: {out_path}")
