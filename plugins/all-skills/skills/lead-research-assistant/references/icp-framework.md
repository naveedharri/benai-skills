# ICP (Ideal Customer Profile) Framework

This reference defines how to build, score, and tier leads against an Ideal Customer Profile.

---

## What Is an ICP?

An ICP describes the **perfect-fit company** for the user's product or service. It combines firmographic data (company size, industry, revenue) with behavioral signals (tech stack, hiring patterns, funding) and accessibility factors (decision-maker reachability).

Every lead gets scored against the ICP. Higher scores = better fit = higher priority.

---

## ICP Definition Template

Collect these from the user during Phase 2. Store in `lead-research-config.json`.

```json
{
  "icp": {
    "product": "What the user sells / offers",
    "targetIndustries": ["SaaS", "FinTech", "E-commerce"],
    "companySize": {
      "employees": { "min": 50, "max": 500 },
      "revenue": { "min": "$5M", "max": "$100M" }
    },
    "targetRoles": ["VP of Marketing", "Head of Growth", "CMO"],
    "geography": ["United States", "Canada", "UK"],
    "techStack": ["HubSpot", "Salesforce", "Marketo"],
    "budgetSignals": ["Series A+", "Recently hired for role", "Active job postings"],
    "painPoints": ["Scaling outbound", "Low conversion rates", "Manual processes"],
    "disqualifiers": ["Less than 10 employees", "Government/public sector", "No online presence"]
  }
}
```

---

## Scoring Rubric

Each lead is scored on three dimensions. Each dimension is rated 1–10.

### Dimension 1: ICP Fit (1–10)

How well does this company match the defined ICP?

| Score | Criteria |
|-------|----------|
| 9–10 | Matches ALL ICP fields: industry, size, geography, tech stack, and role titles found |
| 7–8 | Matches most fields (4 of 5+), minor deviations (e.g., slightly outside size range) |
| 5–6 | Matches core fields (industry + size) but missing 2+ secondary fields |
| 3–4 | Matches 1–2 fields, significant gaps in fit |
| 1–2 | Minimal match, likely a poor fit |

### Dimension 2: Timing Signal (1–10)

Are there indicators the company is ready to buy now?

| Score | Criteria |
|-------|----------|
| 9–10 | Active buying signals: recent funding, hiring for the exact role, RFP posted, tech migration announced |
| 7–8 | Strong signals: job postings in relevant area, recent leadership change, growth news |
| 5–6 | Moderate signals: general growth, expanding to new markets, some relevant job postings |
| 3–4 | Weak signals: stable company, no visible changes, no recent news |
| 1–2 | Negative signals: layoffs, downsizing, freezing budgets, leadership instability |

### Dimension 3: Accessibility (1–10)

How easy is it to reach the decision-maker?

| Score | Criteria |
|-------|----------|
| 9–10 | Direct contact found: name, title, LinkedIn profile, email pattern confirmed |
| 7–8 | Decision-maker identified by name and title, LinkedIn profile found |
| 5–6 | Department/role identified, but specific person not confirmed |
| 3–4 | Company found but decision-maker unclear, no LinkedIn presence |
| 1–2 | No contact information, gated company, no public profiles |

### Total Score

```
Total = ICP Fit + Timing Signal + Accessibility
Range: 3 to 30
```

---

## Tier Definitions

| Tier | Score Range | Label | Action |
|------|------------|-------|--------|
| Hot | 24–30 | High priority | Immediate outreach — these are near-perfect matches with strong timing |
| Warm | 16–23 | Medium priority | Worth pursuing — good fit but may need nurturing or more research |
| Cold | 8–15 | Low priority | Keep on radar — monitor for timing changes, don't prioritize |
| Disqualified | 3–7 | No fit | Exclude from list — doesn't meet minimum ICP criteria |

---

## Common ICP Examples

### Example 1: B2B SaaS (Marketing Automation Tool)

```
Industry: SaaS, E-commerce, Digital Agency
Size: 50-500 employees
Revenue: $5M-$100M
Roles: VP Marketing, Head of Demand Gen, Marketing Director
Geography: US, Canada
Tech: HubSpot, Marketo, Pardot (competitors or adjacent)
Signals: Hiring marketing roles, Series A-C, growing team
```

### Example 2: IT Consulting Firm

```
Industry: Healthcare, Finance, Manufacturing
Size: 200-5000 employees
Revenue: $50M-$1B
Roles: CTO, VP Engineering, IT Director
Geography: US East Coast
Tech: Legacy systems (Oracle, SAP), cloud migration keywords
Signals: Digital transformation mentions, compliance deadlines, new CTO hire
```

### Example 3: Recruiting/HR Tech

```
Industry: Technology, Professional Services
Size: 100-1000 employees
Revenue: $10M-$500M
Roles: VP People, Head of Talent, CHRO
Geography: US, UK, EU
Tech: Greenhouse, Lever, Workday
Signals: Rapid hiring (10+ open roles), new offices, DEI initiatives
```

---

## Scoring Tips

- **Be honest** — a 6 is fine. Don't inflate scores to make the list look better.
- **Weight ICP Fit highest** — a perfect-timing lead that doesn't match the ICP wastes effort.
- **Timing signals decay** — funding from 2 years ago is weaker than funding from last quarter.
- **Accessibility varies by path** — Path B (LinkedIn) naturally scores higher on accessibility.
- **Disqualifiers are binary** — if a company matches a disqualifier, score ICP Fit ≤ 3 regardless of other factors.
