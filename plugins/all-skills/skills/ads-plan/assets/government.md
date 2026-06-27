<!-- Updated: 2026-02-21 -->
# Government & Public Sector Paid Advertising Template

## Industry Characteristics

- Strict compliance requirements (government advertising regulations, accessibility, transparency)
- WCAG 2.1 AA accessibility mandatory for all landing pages and ad content
- Public accountability — all ad spend subject to FOIA/public records requests
- Multiple stakeholder audiences: citizens, businesses, employees, specific demographics
- Procurement and approval processes may slow campaign launches
- Many campaigns are informational (not transactional) — awareness and education focus
- Political advertising restrictions and declaration requirements vary by platform
- .gov domains carry inherent trust signals but also higher scrutiny

## Compliance Requirements

### WCAG 2.1 AA Accessibility (Mandatory)
| Requirement | Application to Ads |
|-------------|-------------------|
| Text alternatives | All images must have alt text; video must have captions |
| Color contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Keyboard navigable | Landing pages must be fully keyboard-accessible |
| Screen reader compatible | All content readable by assistive technology |
| Readable text | Minimum 16px body text, clear sans-serif fonts |
| Time limits | No auto-advancing content without user control |
| Language | Page language declared in HTML lang attribute |

### Advertising Regulations
- **Transparency**: may need to disclose "Paid for by [Agency]" in ad copy
- **Political restrictions**: some platforms require government advertiser verification
- **Data privacy**: may need to comply with government data handling requirements
- **Accessibility**: FedRAMP/Section 508 compliance for any tools used
- **Record keeping**: retain all ad creatives, targeting, and spend for public records

## Recommended Platform Mix

| Platform | Role | Budget % | Why |
|----------|------|----------|-----|
| Google Search | Primary | 40-50% | Citizens search for government services |
| Meta | Primary | 25-35% | Broad public reach, demographic targeting |
| YouTube | Secondary | 10-15% | PSA videos, educational content |
| Microsoft | Secondary | 5-10% | Government/enterprise desktop users |
| LinkedIn | Testing | 5% | Recruitment, B2G (business-to-government) |

## Campaign Architecture

```
Account
├── Public Services (citizen-facing)
│   ├── Service discovery ([service] application, how to [service])
│   ├── Deadline-driven (tax filing, permit renewal, enrollment)
│   └── Location-based (nearest [office/facility])
├── Public Safety / PSA
│   ├── Emergency preparedness
│   ├── Health campaigns (vaccination, safety alerts)
│   └── Seasonal awareness (weather, wildfire, flu)
├── Recruitment
│   ├── Job opportunity campaigns
│   ├── Specific role targeting
│   └── Benefits/culture messaging
├── Economic Development
│   ├── Business incentive programs
│   ├── Grant/funding opportunities
│   └── Tourism/destination marketing
└── Community Engagement
    ├── Public comment/feedback periods
    ├── Town hall / meeting promotion
    └── Census / survey participation
```

## Creative Strategy

### What Works for Government
- **Clear, authoritative messaging**: official seal/logo builds trust
- **Plain language**: avoid jargon, use reading level appropriate for general public
- **Inclusive imagery**: represent the diversity of the community served
- **Accessible formats**: captions on all video, high-contrast design, alt text
- **Call to action**: specific next steps ("Apply by March 15" not "Learn more")

### Creative by Campaign Type
| Type | Format | Message Focus |
|------|--------|---------------|
| Services | Search ads, responsive display | How to access, deadlines, eligibility |
| PSA | Video (15-30s), display | Urgency, safety, clear instructions |
| Recruitment | LinkedIn, Meta carousel | Benefits, mission, culture |
| Engagement | Meta, YouTube | Why participate, impact of input |

### Accessibility in Creative
- All video ads must include closed captions
- Display ads must meet WCAG color contrast ratios
- Landing pages must pass automated accessibility testing
- Provide content in multiple languages where community demographics require it

### Creative Volume Requirements
| Platform | Min Active Creatives | Recommended | Refresh Cadence |
|----------|---------------------|-------------|-----------------|
| Google PMax | 15 images, 3 logos, 3 videos | WCAG AA compliant assets; inclusive imagery | Quarterly; swap "Low" assets monthly |
| Meta Standard | 5-8 per ad set | Accessible formats; multi-language variants | Every 10-14 days |
| YouTube | 3-5 video formats | Captioned PSA videos, service explainers | Every 4-8 weeks |
| Microsoft | Mirror Google assets | 15 headlines, 3 descriptions, 15 images | Every 8-12 weeks |

See `ads/references/creative-volume.md` for detailed per-platform production benchmarks.

## Targeting Strategy

### Google Keywords
- **Services**: [government service] application, how to get [service], [agency] contact
- **Deadlines**: [service] deadline [year], last day to [action]
- **Location**: [service] near me, [city/county] [service] office
- **Recruitment**: [agency] jobs, government careers [location], [role] government

### Geo-Targeting (Critical)
- **Federal**: national targeting with state/region exclusions as appropriate
- **State**: state-level targeting only (exclude out-of-state)
- **Local/Municipal**: city/county radius targeting, ZIP codes
- **Never target outside jurisdiction** — wastes budget and creates confusion

### Audience Restrictions
- Cannot use discriminatory targeting for public services
- Age, gender, and demographic restrictions generally prohibited for government services
- Recruitment campaigns may target specific qualifications/interests
- Must comply with equal opportunity requirements

## Budget Guidelines

| Metric | Government Benchmark |
|--------|---------------------|
| Google Search CPC | $1.00-$3.00 (services) |
| Google Search CPC | $3.00-$8.00 (recruitment) |
| Meta CPC | $0.50-$2.00 |
| Meta CPM | $5-$15 |
| YouTube CPV | $0.02-$0.06 |
| Cost per application | $5-$25 (services) |
| Cost per job application | $15-$50 (recruitment) |
| Min monthly budget | $2,000+ |

### Budget Allocation by Campaign Type
| Campaign Type | Priority | % of Budget |
|--------------|----------|-------------|
| Public services (deadline-driven) | P1 | 35-45% |
| Public safety / PSA | P1 | 20-25% |
| Recruitment | P2 | 15-20% |
| Community engagement | P2 | 10-15% |
| Economic development | P3 | 5-10% |

## Bidding Strategy Selection

| Campaign Type | Platform | Strategy |
|--------------|----------|----------|
| Services | Google | Maximize Conversions (application completions) |
| PSA/Awareness | Google | Maximize Clicks or Target Impression Share |
| PSA/Awareness | Meta | Lowest Cost (maximize reach) |
| PSA/Awareness | YouTube | Target CPV (video views) |
| Recruitment | LinkedIn | Maximum Delivery |
| Recruitment | Google | Maximize Conversions (job applications) |

## Attribution Model

- Track service applications/completions as primary conversion
- PSA campaigns: measure reach and frequency (not conversion-based)
- Recruitment: track application starts and completions separately
- Multi-language campaigns: attribute by language segment
- Report on cost-per-citizen-reached for awareness campaigns

## KPI Targets

| Metric | Services | PSA | Recruitment |
|--------|---------|-----|------------|
| CTR | 3%+ | 0.5%+ (display) | 2%+ |
| CVR | 5-15% | N/A (awareness) | 3-8% |
| CPA | $5-$25 | CPM focus | $15-$50 |
| Reach (monthly) | N/A | Target population % | Target talent pool |
| Accessibility score | 100% WCAG AA | 100% WCAG AA | 100% WCAG AA |

## Common Pitfalls

- Landing pages failing WCAG accessibility requirements (legal liability)
- Targeting outside jurisdiction (wastes budget, confuses citizens)
- Not declaring government advertiser status on platforms that require it
- Using commercial-style urgency tactics that erode public trust
- Not providing multi-language ad variants for diverse communities
- Missing deadline-driven campaign windows (enrollment periods, filing deadlines)
- Overly generic keywords competing with commercial advertisers at higher CPCs
- Not retaining ad records for public records/FOIA compliance
- Using discriminatory targeting for public service campaigns
