# Context Collection (Phase 0)

Collect four inputs before anything else: (a) Prospect, (b) Audience, (c) Purpose, (d) Format. Parse whatever the user already provided in their message first; only ask for what is missing.

## Contents

- Step 0.1: Detect seller context
- Step 0.2: Collect prospect context (a)
- Step 0.3: Collect audience context (b)
- Step 0.4: Collect purpose context (c)
- Step 0.5: Select format (d)
- Step 0.6: Format-specific inputs
- Input quality rules

## Step 0.1: Detect Seller Context

From the user's email domain, identify what company they work for.

**Actions:**
1. Extract domain from user's email
2. Search: `"[domain]" company products services site:linkedin.com OR site:crunchbase.com`
3. Determine seller context:

| Scenario | Action |
|----------|--------|
| **Single-product company** | Auto-populate seller context |
| **Multi-product company** | Ask: "Which product or solution is this asset for?" |
| **Consultant/agency/generic domain** | Ask: "What company or product are you representing?" |
| **Unknown/startup** | Ask: "Briefly, what are you selling?" |

**Store seller context:**
```yaml
seller:
  company: "[Company Name]"
  product: "[Product/Service]"
  value_props:
    - "[Key value prop 1]"
    - "[Key value prop 2]"
    - "[Key value prop 3]"
  differentiators:
    - "[Differentiator 1]"
    - "[Differentiator 2]"
  pricing_model: "[If publicly known]"
```

**Persist to knowledge base** for future sessions. On subsequent invocations, confirm: "I have your seller context from last time, still selling [Product] at [Company]?"

## Step 0.2: Collect Prospect Context (a)

**Ask the user:**

| Field | Prompt | Required |
|-------|--------|----------|
| **Company** | "Which company is this asset for?" | Yes |
| **Key contacts** | "Who are the key contacts? (names, roles)" | No |
| **Deal stage** | "What stage is this deal?" | Yes |
| **Pain points** | "What pain points or priorities have they shared?" | No |
| **Past materials** | "Upload any conversation materials (transcripts, emails, notes, call recordings)" | No |

**Deal stage options:** Intro / First meeting, Discovery, Evaluation / Technical review, POC / Pilot, Negotiation, Close

## Step 0.3: Collect Audience Context (b)

**Ask the user:**

| Field | Prompt | Required |
|-------|--------|----------|
| **Audience type** | "Who's viewing this?" | Yes |
| **Specific roles** | "Any specific titles to tailor for? (e.g., CTO, VP Engineering, CFO)" | No |
| **Primary concern** | "What do they care most about?" | Yes |
| **Objections** | "Any concerns or objections to address?" | No |

**Audience type options:**
- Executive (C-suite, VPs)
- Technical (Architects, Engineers, Developers)
- Operations (Ops, IT, Procurement)
- Mixed / Cross-functional

**Primary concern options:**
- ROI / Business impact
- Technical depth / Architecture
- Strategic alignment
- Risk mitigation / Security
- Implementation / Timeline

## Step 0.4: Collect Purpose Context (c)

**Ask the user:**

| Field | Prompt | Required |
|-------|--------|----------|
| **Goal** | "What's the goal of this asset?" | Yes |
| **Desired action** | "What should the viewer do after seeing this?" | Yes |

**Goal options:** Intro / First impression, Discovery follow-up, Technical deep-dive, Executive alignment / Business case, POC proposal, Deal close

## Step 0.5: Select Format (d)

**Ask the user:** "What format works best for this?"

| Format | Description | Best For |
|--------|-------------|----------|
| **Interactive landing page** | Multi-tab page with demos, metrics, calculators | Exec alignment, intros, value prop |
| **Deck-style** | Linear slides, presentation-ready | Formal meetings, large audiences |
| **One-pager** | Single-scroll executive summary | Leave-behinds, quick summaries |
| **Workflow / Architecture demo** | Interactive diagram with animated flow | Technical deep-dives, POC demos, integrations |

If the user is unsure, recommend by need: impressive multi-tab experience = interactive landing page; something to present in a meeting = deck-style; quick summary to leave behind = one-pager; visual of how systems connect = workflow demo.

## Step 0.6: Format-Specific Inputs

### If "Workflow / Architecture demo" selected:

**First, parse from the user's description.** Look for:
- Systems and components mentioned
- Data flows described
- Human interaction points
- Example scenarios

**Then ask for any gaps:**

| If Missing... | Ask... |
|---------------|--------|
| Components unclear | "What systems or components are involved? (databases, APIs, AI, middleware, etc.)" |
| Flow unclear | "Walk me through the step-by-step flow" |
| Human touchpoints unclear | "Where does a human interact in this workflow?" |
| Scenario vague | "What's a concrete example scenario to demo?" |
| Integration specifics | "Any specific tools or platforms to highlight?" |

## Input Quality Rules

- Richer context produces a more tailored asset. Encourage the user to share past conversations, pain points, and stakeholder concerns.
- If the user has call recordings, meeting notes, or email threads, ask them to upload; key quotes and priorities get extracted in the research phase.
- Push for audience specificity: "Technical team" is usable, "IT architects evaluating our security model" is better. Capture the more specific version when offered.
