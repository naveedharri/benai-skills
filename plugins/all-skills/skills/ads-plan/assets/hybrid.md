<!-- Updated: 2026-02-21 -->
# Hybrid Business Paid Advertising Template

## Industry Characteristics

- Multi-model revenue: product + service, B2B + B2C, or subscription + one-time
- Different customer journeys per revenue stream require separate campaign structures
- Attribution complexity — conversions may involve multiple touchpoints across models
- Diverse audience segments with different intent signals and conversion paths
- Budget allocation must balance competing priorities across business lines

## Recommended Platform Mix

| Platform | Role | Budget % | Why |
|----------|------|----------|-----|
| Google Search | Primary | 35-45% | Captures high-intent queries across all business lines |
| Meta | Primary | 25-35% | Broad targeting for B2C, retargeting for all models |
| LinkedIn | Secondary (B2B line) | 10-20% | B2B decision-maker targeting for service/enterprise line |
| YouTube | Testing | 5-10% | Product demos, service explainers, brand awareness |
| Microsoft | Testing | 5% | Desktop B2B audience, Google import for search coverage |

## Campaign Architecture

```
Account
├── Business Line A (e.g., Product/E-commerce)
│   ├── Brand Defense (shared or split by line)
│   ├── Non-Brand — High Intent
│   │   ├── Product-specific searches
│   │   └── Category + purchase intent
│   ├── Shopping / PMax
│   │   └── Product catalog feed
│   └── Retargeting
│       ├── Product viewers (7-14 days)
│       └── Cart abandoners (3-7 days)
├── Business Line B (e.g., Service/B2B)
│   ├── Non-Brand — High Intent
│   │   ├── Service-specific searches
│   │   └── [Problem] + solution queries
│   ├── LinkedIn ABM
│   │   ├── Target account list
│   │   └── Job title targeting
│   └── Retargeting
│       ├── Service page visitors (30 days)
│       └── Content downloaders (60 days)
├── Cross-Sell / Upsell
│   ├── Product customers → service offers
│   └── Service customers → product offers
└── Testing
    └── New audiences, formats, cross-line messaging
```

## Creative Strategy

### What Works for Hybrid Businesses
- **Segment-specific landing pages**: never send B2B and B2C traffic to the same page
- **Cross-sell sequences**: retarget product buyers with service offers (and vice versa)
- **Unified brand story**: consistent brand across lines but different value propositions
- **Social proof per segment**: B2B testimonials for B2B campaigns, consumer reviews for B2C

### Creative by Business Line
| Line | Format | Message Focus |
|------|--------|---------------|
| Product/B2C | Video, carousel, UGC | Benefits, unboxing, lifestyle, reviews |
| Service/B2B | Case study, whitepaper, webinar | ROI, efficiency, expertise, trust |
| Cross-sell | Email-synced retargeting | "Customers who bought X also use Y" |

### Creative Volume Requirements
| Platform | Min Active Creatives | Recommended | Refresh Cadence |
|----------|---------------------|-------------|-----------------|
| Meta Standard | 5-8 per ad set | Separate creative concepts per revenue stream | Every 10-14 days |
| Google PMax | 15 images, 3 logos, 3 videos | Separate asset groups per business model | Quarterly; swap "Low" assets monthly |
| LinkedIn | 4-5 active per campaign | B2B stream: TLA ≥30%; B2C stream: standard formats | Every 4-6 weeks |
| TikTok | 6-10 per ad group | Native content per audience segment | Every 10-14 days (fatigue onset 3-5 days) |

See `ads/references/creative-volume.md` for detailed per-platform production benchmarks.

## Targeting Strategy

### Audience Separation (Critical)
- **Never mix B2B and B2C audiences** in the same campaign
- Use separate conversion events per business line
- Exclude existing customers from the wrong line's prospecting
- Create custom audiences per business line from CRM segments

### Google Keywords
- **Product line**: [product name], buy [product], [product] reviews, [product] vs [competitor]
- **Service line**: [service] company, [service] near me, best [service] provider, [problem] solution
- **Cross-sell**: [product] + [service] bundle, [product] support, [product] consulting

## Budget Guidelines

| Metric | Hybrid Benchmark |
|--------|-----------------|
| Google Search CPC (product) | $1.50-$4.00 |
| Google Search CPC (service) | $3.00-$8.00 |
| Meta CPC (B2C) | $0.80-$2.00 |
| LinkedIn CPC (B2B) | $5.00-$15.00 |
| Min monthly budget | $8,000+ (must fund both lines adequately) |

### Budget Split Framework
| If B2B revenue > B2C | Allocate | 60% B2B / 40% B2C |
|---|---|---|
| If B2C revenue > B2B | Allocate | 60% B2C / 40% B2B |
| If roughly equal | Allocate | 50/50 split |
| Cross-sell budget | Always | 10% of total from each line |

## Bidding Strategy Selection

| Platform | Business Line | Recommended Strategy |
|----------|--------------|---------------------|
| Google | Product (e-commerce) | Target ROAS (if 50+ conv) or Maximize Conv Value |
| Google | Service (lead gen) | Target CPA (if 30+ conv) or Maximize Conversions |
| Meta | B2C prospecting | Lowest Cost |
| Meta | B2B retargeting | Cost Cap |
| LinkedIn | B2B | Maximum Delivery or Accelerate |

## Attribution Model

- Track conversions **separately** per business line — never combine
- Use different conversion actions for product purchases vs service inquiries
- Cross-sell attribution: use custom parameters to track which line originated the customer
- CRM integration essential for hybrid businesses (connect ad click → business line → LTV)

## KPI Targets

| Metric | Product Line | Service Line |
|--------|-------------|-------------|
| CPA | Industry benchmark | 2-3x product CPA (higher value) |
| ROAS | 4:1+ | Track pipeline, not immediate ROAS |
| CTR | 1.5%+ | 2.0%+ (more qualified traffic) |
| CVR | 2-4% | 1-3% (longer consideration) |

## Common Pitfalls

- Mixing B2B and B2C audiences in the same campaign (muddies optimization signals)
- Single conversion event for all business lines (Smart Bidding can't optimize for both)
- Same landing page for different business lines (message mismatch)
- Not separating budgets — one line starves the other
- Ignoring cross-sell opportunities between lines
- Attribution double-counting when a customer converts across both lines
