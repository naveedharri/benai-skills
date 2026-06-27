# LinkedIn Search Reference

How to find LinkedIn profiles using Google search operators. **Never navigate to linkedin.com directly** — always search via Google.

---

## Core Principle

LinkedIn blocks direct scraping and requires authentication. Instead, use Google's index of LinkedIn public profiles:

```
site:linkedin.com/in/ "[title]" "[company]" "[location]"
```

Google indexes LinkedIn profile snippets including: name, headline, location, and sometimes current/past companies. This is enough to build a prospect list.

---

## Google-to-LinkedIn Operators

### Basic Person Search

```
site:linkedin.com/in/ "[job title]" "[company name]"
site:linkedin.com/in/ "[job title]" "[industry keyword]" "[city]"
```

### Company Page Search

```
site:linkedin.com/company/ "[company name]"
```

### Job Posting Search (Hiring Signal)

```
site:linkedin.com/jobs/ "[company name]" "[role]"
```

### Boolean Combinations

```
site:linkedin.com/in/ ("VP" OR "Director" OR "Head") "Marketing" "[company]"
site:linkedin.com/in/ ("CTO" OR "VP Engineering" OR "Head of Engineering") "[industry]" "[city]"
```

---

## Common Title Groups

Use these groupings to target the right seniority level.

### C-Suite

```
"CEO" OR "Chief Executive"
"CTO" OR "Chief Technology"
"CMO" OR "Chief Marketing"
"CFO" OR "Chief Financial"
"COO" OR "Chief Operating"
"CRO" OR "Chief Revenue"
"CPO" OR "Chief Product"
```

### VP Level

```
"VP" OR "Vice President"
"SVP" OR "Senior Vice President"
"EVP" OR "Executive Vice President"
```

### Director Level

```
"Director of [department]"
"Senior Director"
"Managing Director"
```

### Head / Manager Level

```
"Head of [department]"
"[Department] Manager"
"Senior Manager"
"Team Lead"
```

### Common Department Keywords

| Department | Keywords |
|-----------|----------|
| Marketing | Marketing, Growth, Demand Gen, Brand, Content, Digital |
| Sales | Sales, Revenue, Business Development, Account Executive |
| Engineering | Engineering, Development, DevOps, Platform, Infrastructure |
| Product | Product, Product Management, UX, Design |
| HR/People | People, Talent, HR, Human Resources, Recruiting |
| Finance | Finance, Accounting, FP&A, Treasury |
| Operations | Operations, Strategy, Program Management |

---

## Query Templates by Persona

### Template 1: Specific Company + Role

```
site:linkedin.com/in/ "[exact role]" "[exact company name]"
```
Best for: Path C (Hybrid) — finding contacts at known companies.

### Template 2: Industry + Role + Location

```
site:linkedin.com/in/ ("[role A]" OR "[role B]") "[industry]" "[city/state]"
```
Best for: Path B — broad prospecting by persona.

### Template 3: Technology + Role

```
site:linkedin.com/in/ "[role]" "[technology/tool]" "[geography]"
```
Best for: Finding users of specific tools who might switch.

### Template 4: Hiring Managers

```
site:linkedin.com/in/ "hiring" OR "we're growing" "[role]" "[industry]"
```
Best for: Finding people actively building teams (strong timing signal).

---

## Company Size Indicators (from LinkedIn Snippets)

Google snippets from LinkedIn company pages sometimes include employee counts:

| Snippet Text | Meaning |
|-------------|---------|
| "11-50 employees" | Startup / small business |
| "51-200 employees" | Growing SMB |
| "201-500 employees" | Mid-market |
| "501-1,000 employees" | Upper mid-market |
| "1,001-5,000 employees" | Enterprise-adjacent |
| "5,001-10,000 employees" | Enterprise |
| "10,001+ employees" | Large enterprise |

---

## Industry Keywords for Queries

Expand industry terms to catch more results:

| Industry | Search Terms |
|----------|-------------|
| SaaS | "SaaS" OR "software" OR "cloud" OR "platform" |
| E-commerce | "e-commerce" OR "ecommerce" OR "online retail" OR "DTC" |
| FinTech | "fintech" OR "financial technology" OR "payments" OR "banking" |
| HealthTech | "healthtech" OR "health technology" OR "digital health" OR "medtech" |
| EdTech | "edtech" OR "education technology" OR "learning platform" |
| MarTech | "martech" OR "marketing technology" OR "adtech" |
| Cybersecurity | "cybersecurity" OR "security" OR "infosec" OR "threat" |
| AI/ML | "artificial intelligence" OR "machine learning" OR "AI" OR "deep learning" |
| HR Tech | "HR tech" OR "people analytics" OR "talent management" OR "HRIS" |

---

## Volume Search Strategy

When building a large prospect list (20+ contacts):

### Step 1: Build Query Variations (3–5 queries per role)

Vary by:
- Exact title vs. broader title group
- Company name vs. industry keyword
- City vs. state vs. country

### Step 2: Execute in Batches

- Run 3–5 queries per batch
- Extract all names + headlines from Google snippets
- Deduplicate by name before next batch
- Pause between batches (rate limiting)

### Step 3: Extract Profile Data

From each Google result snippet, capture:
- **Full name** — from the page title
- **Headline/title** — from the meta description
- **Location** — from the snippet
- **LinkedIn URL** — from the search result link
- **Current company** — from headline or snippet

### Step 4: Cross-Reference

- Match contacts to companies from Path A (if running Hybrid)
- Flag contacts at Hot-tier companies as highest priority
- Note if multiple contacts exist at the same company (multi-threaded outreach)
