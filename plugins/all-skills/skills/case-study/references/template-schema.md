# Case Study Template Schema

This is the data structure that needs to be filled for every case study.
Not all fields are required — the user decides what's relevant.

---

## 1. Client Identity

| Field | Description | Required |
|-------|-------------|----------|
| `clientName` | Company or individual name | Yes |
| `clientLogo` | Path/URL to logo image | No |
| `industry` | Client's industry/vertical | Yes |
| `tagline` | One-line description of what they do | Yes |
| `website` | Client website URL | No |

---

## 2. Executive Summary

| Field | Description | Required |
|-------|-------------|----------|
| `clientOverview` | 2-3 sentences: who they are, what they do, key challenge | Yes |
| `projectDuration` | How long the engagement lasted | Yes |
| `keyOutcomes` | 3-5 bullet-point results (metrics preferred) | Yes |
| `pullQuote` | One standout quote for the summary | No |

---

## 3. Client Background

| Field | Description | Required |
|-------|-------------|----------|
| `aboutClient` | Deeper description: mission, market, achievements, team size | Yes |
| `businessGoals` | What they were trying to achieve before engaging | Yes |
| `context` | Market conditions, growth stage, competitive landscape | No |

---

## 4. Challenges

Challenges should be categorized. Not all categories are required.

| Category | Description |
|----------|-------------|
| `strategic` | Big-picture problems: market positioning, growth direction, product strategy |
| `operational` | Process problems: speed, communication, team alignment, workflows |
| `technical` | Implementation problems: tooling, releases, integrations, data |
| `creative` | Content/brand problems: messaging, design, consistency, differentiation |

Each challenge should have:
- A short title (3-5 words)
- A description (1-2 sentences)
- Impact statement: what this was costing them (optional but powerful)

---

## 5. Objectives

3-5 numbered objectives. Each should have:

| Field | Description |
|-------|-------------|
| `title` | Clear, action-oriented title |
| `description` | Why this objective mattered |
| `metric` | How success would be measured (optional) |

---

## 6. Actions Taken

The core of the case study. 3-6 actions. Each should have:

| Field | Description |
|-------|-------------|
| `title` | What was done (action-oriented) |
| `description` | How it was done + why this approach |
| `impact` | What changed because of this action |
| `evidence` | Screenshot, data point, or example (optional) |

---

## 7. Results

This is where the story pays off. Structure:

| Field | Description | Required |
|-------|-------------|----------|
| `heroMetric` | The single most impressive number | Yes |
| `supportingMetrics` | 2-4 additional metrics | Yes |
| `qualitativeResults` | Non-numeric outcomes (team morale, client satisfaction, etc.) | No |
| `beforeAfter` | Explicit before/after comparison | No |
| `timeline` | How quickly results were achieved | No |

### Metric Format
Each metric should have:
- `value`: The number (e.g., "65,000+")
- `label`: What it measures (e.g., "LinkedIn impressions")
- `context`: Why it matters (e.g., "up from ~2,000/month")

---

## 8. Client Testimonial

| Field | Description | Required |
|-------|-------------|----------|
| `quote` | Full testimonial text | Yes |
| `attribution` | Name + title of person quoted | Yes |
| `photo` | Headshot of quoted person (optional) | No |

Ideally, collect 2-3 quotes and let the user pick:
- One for the executive summary (short, punchy)
- One for the full-page quote slide (longer, emotional)
- One for results context (metrics-focused)

---

## 9. Conclusion

| Field | Description | Required |
|-------|-------------|----------|
| `finalThoughts` | Summary of overall success + long-term impact | Yes |
| `nextSteps` | Ongoing support or future plans | No |
| `callToAction` | What the reader should do next | No |

---

## 10. Contact Information

| Field | Description | Required |
|-------|-------------|----------|
| `companyName` | Your company name | Yes |
| `contacts` | Array of { name, title, email, phone } | Yes |
| `website` | Your website URL | Yes |
| `socialLinks` | LinkedIn, Twitter, etc. | No |

---

## Extraction Tips

When extracting from raw data (transcripts, notes):

1. **Metrics** — Look for any numbers, percentages, time frames, before/after comparisons
2. **Quotes** — Look for first-person statements, especially emotional ones
3. **Challenges** — Look for pain language: "struggling with", "couldn't", "frustrated by", "bottleneck"
4. **Actions** — Look for: "we implemented", "we changed", "the approach was"
5. **Results** — Look for: "now we", "increased by", "reduced", "improved"
6. **Goals** — Look for: "wanted to", "goal was", "trying to", "needed to"

When data is ambiguous, propose your best interpretation and ask the user to confirm.
